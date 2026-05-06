/**
 * Generates Open Graph images.
 */

import { fontData } from "astro:assets";
import { outDir } from "astro:config/server";
import { readFile } from "node:fs/promises";
import satori, { type Font as SatoriFont } from "satori";
import sharp from "sharp";

export const OG_COLORS = {
  bg: "#f9f9f8",
  text: "#21201c",
  muted: "#63635e",
  faint: "#cfceca",
};

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const OG_FONT_FAMILY = "OpenGraphFont";

let cachedFonts: SatoriFont[] | null = null;
async function getFonts(origin: string): Promise<SatoriFont[]> {
  if (cachedFonts) return cachedFonts;

  const faces = fontData["--font-og"];

  cachedFonts = await Promise.all(
    faces.map(async (face) => {
      const src = face.src[0];
      if (!src) throw new Error("No src in font face");

      const data = import.meta.env.DEV
        ? await fetch(new URL(src.url, origin)).then((r) => r.arrayBuffer())
        : await readFile(new URL(`.${src.url}`, outDir)).then(
            (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer,
          );
      return { name: OG_FONT_FAMILY, data, weight: 400 as const, style: "normal" as const };
    }),
  );

  return cachedFonts;
}

/* biome-ignore lint/suspicious/noExplicitAny: not sure which type to use */
export async function renderOgImage(element: any, url: URL): Promise<Response> {
  const fonts = await getFonts(url.origin);

  const svg = await satori(element, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
