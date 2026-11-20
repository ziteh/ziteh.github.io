import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFile, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import {
  BREAKPOINTS,
  CACHE_FILE_PATH,
  MAX_ORIGINAL_WIDTH,
  R2_BUCKET,
  R2_PUBLIC_URL,
  isSvg,
  variantUrl,
} from "./img-config.mjs";

const BLOG_DIR = "content/blog";
// Accepts encoded, raw-space and angle-bracket paths, with an optional title
const IMG_REF_PATTERN = /!\[[^\]]*\]\(<?((?:\.\/)?img\/[^)>"]*?)>?(?:\s+"[^"]*")?\)/g;
const LOCAL_IMG_MENTION_PATTERN = /\]\(<?(?:\.\/)?img\//g;

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

function git(...args) {
  return execFileSync("git", args, { encoding: "utf-8" });
}

async function upload(buffer, key, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

// SVG is uploaded as-is: rasterizing loses the vector, and variants would be pointless
async function processSvg(original, slug) {
  const { width, height } = await sharp(original).metadata();
  const hash = createHash("sha256").update(original).digest("hex").slice(0, 8);
  const key = `blog/${slug}/${hash}.svg`;

  await upload(original, key, "image/svg+xml");

  return { url: `${R2_PUBLIC_URL}/${key}`, width, height };
}

async function processImage(localPath, slug) {
  const original = await readFile(localPath);
  if (isSvg(localPath)) return processSvg(original, slug);

  const { data: finalBuffer, info } = await sharp(original)
    .resize({ width: MAX_ORIGINAL_WIDTH, withoutEnlargement: true })
    .webp()
    .toBuffer({ resolveWithObject: true });
  const hash = createHash("sha256").update(finalBuffer).digest("hex").slice(0, 8);
  const key = `blog/${slug}/${hash}.webp`;

  await upload(finalBuffer, key, "image/webp");

  for (const w of BREAKPOINTS.filter((w) => w < info.width)) {
    const variantBuffer = await sharp(original).resize({ width: w }).webp().toBuffer();
    await upload(variantBuffer, variantUrl(key, w), "image/webp");
  }

  return { url: `${R2_PUBLIC_URL}/${key}`, width: info.width, height: info.height };
}

// Uploads a post's local images but writes nothing, so a failure leaves the working tree untouched
async function processPost(mdPath) {
  const slug = path.basename(mdPath, ".md");
  const content = await readFile(mdPath, "utf-8");
  const refs = [...content.matchAll(IMG_REF_PATTERN)];
  const mentions = content.match(LOCAL_IMG_MENTION_PATTERN)?.length ?? 0;
  if (mentions !== refs.length) {
    throw new Error(`${mdPath}: ${mentions - refs.length} local image link(s) could not be parsed`);
  }
  const relPaths = new Set(refs.map((m) => m[1]));

  const entries = [];
  const localPaths = [];
  let updated = content;
  for (const relPath of relPaths) {
    const localPath = path.resolve(BLOG_DIR, decodeURIComponent(relPath));
    const entry = await processImage(localPath, slug);
    updated = updated.replaceAll(relPath, entry.url);
    entries.push(entry);
    localPaths.push(localPath);
  }
  return { mdPath, updated, entries, localPaths };
}

async function main() {
  const stagedPosts = git("diff", "--cached", "--name-only", "--diff-filter=ACM", "--", `${BLOG_DIR}/*.md`)
    .split("\n")
    .filter(Boolean);

  const posts = [];
  for (const mdPath of stagedPosts) {
    const post = await processPost(mdPath);
    if (post.entries.length > 0) posts.push(post);
  }
  if (posts.length === 0) return;

  const sizeEntries = posts.flatMap((p) => p.entries);
  const yaml = sizeEntries.map((e) => `- url: ${e.url}\n  width: ${e.width}\n  height: ${e.height}\n`).join("");
  for (const post of posts) {
    await writeFile(post.mdPath, post.updated);
    for (const localPath of post.localPaths) await rm(localPath, { force: true });
  }
  await appendFile(CACHE_FILE_PATH, yaml);

  git("add", CACHE_FILE_PATH, ...posts.map((p) => p.mdPath));
  console.log(`uploaded ${sizeEntries.length} images from ${posts.length} posts`);
}

await main();
