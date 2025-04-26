import type { APIRoute } from "astro";
import { SITE } from "@config";

const banGooglebot = `
User-agent: Googlebot
Disallow: /

`;

const robots = `
${import.meta.env.PUBLIC_BAN_GOOGLEBOT === "true" ? banGooglebot : ""}
User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", SITE.website).href}
`.trim();

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
