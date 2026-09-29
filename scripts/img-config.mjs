export const R2_PUBLIC_URL = "https://bucket.ziteh.dev";
export const R2_BUCKET = "imgstr";
export const BREAKPOINTS = [720, 1440];
export const MAX_ORIGINAL_WIDTH = 2880;
export const CACHE_FILE_PATH = "content/image-sizes.yaml";

export function variantUrl(src, width) {
  return src.replace(/(\.[a-z0-9]+)$/i, `-${width}w$1`);
}

export function isR2Image(src) {
  return src.startsWith(R2_PUBLIC_URL);
}

export function isSvg(src) {
  return /\.svg$/i.test(src.split(/[?#]/)[0]);
}
