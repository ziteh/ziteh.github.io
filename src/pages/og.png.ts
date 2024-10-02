import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@utils/generateOgImages";

// Disable generate OG image
// export const GET: APIRoute = async () =>
//   new Response(await generateOgImageForSite(), {
//     headers: { "Content-Type": "image/png" },
//   });
