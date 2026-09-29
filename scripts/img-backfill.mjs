import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { BREAKPOINTS, R2_BUCKET, R2_PUBLIC_URL, isSvg, variantUrl } from "./img-config.mjs";

const BLOG_DIR = "content/blog";
const R2_IMG_PATTERN = new RegExp(`(${R2_PUBLIC_URL}/[^)\\s>"]+)`, "g");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function collectImageUrls() {
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  const mdFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".md"));

  const urls = new Set();
  for (const entry of mdFiles) {
    const content = await readFile(path.join(BLOG_DIR, entry.name), "utf-8");
    for (const match of content.matchAll(R2_IMG_PATTERN)) {
      if (!isSvg(match[1])) urls.add(match[1]);
    }
  }
  return urls;
}

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch (error) {
    if (error.name === "NotFound") return false;
    throw error;
  }
}

async function backfillVariants(url) {
  const key = url.slice(`${R2_PUBLIC_URL}/`.length);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const original = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(original).metadata();
  const width = metadata.width;

  for (const w of BREAKPOINTS.filter((w) => width && w < width)) {
    if (await exists(variantUrl(key, w))) continue;
    const variantBuffer = await sharp(original).resize({ width: w }).webp().toBuffer();
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: variantUrl(key, w),
        Body: variantBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    console.log(`uploaded ${variantUrl(key, w)}`);
  }
}

async function main() {
  const urls = await collectImageUrls();
  console.log(`found ${urls.size} images`);

  const failed = [];
  for (const url of urls) {
    try {
      await backfillVariants(url);
    } catch (error) {
      console.error(`failed ${url}: ${error.message}`);
      failed.push(url);
    }
  }

  if (failed.length > 0) {
    console.error(`${failed.length} images failed:\n${failed.join("\n")}`);
    process.exitCode = 1;
  }
}

await main();
