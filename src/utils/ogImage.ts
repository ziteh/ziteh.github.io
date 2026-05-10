/**
 * Generates Open Graph images.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
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

const FONT_PATH = join(process.cwd(), "fonts/og.ttf");

async function getFonts(): Promise<SatoriFont[]> {
  if (cachedFonts) return cachedFonts;

  const data = await readFile(FONT_PATH);
  cachedFonts = [
    { name: OG_FONT_FAMILY, data: data.buffer, weight: 400 as const, style: "normal" as const },
  ];

  return cachedFonts;
}

/* biome-ignore lint/suspicious/noExplicitAny: not sure which type to use */
export async function renderOgImage(element: any): Promise<Response> {
  const fonts = await getFonts();

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
