/**
 * Social media links configuration.
 */

import IconGitHub from "@/assets/icons/brand-github.svg";
import IconYouTube from "@/assets/icons/brand-youtube.svg";
import IconRss from "@/assets/icons/rss.svg";
import { SITE } from "@/config/site";

export const SOCIALS = [
  {
    name: "YouTube",
    href: "https://www.youtube.com",
    title: `YouTube - ${SITE.title}`,
    icon: IconYouTube,
  },
  {
    name: "GitHub",
    href: "https://github.com/ziteh/astro-theme-jing",
    title: `GitHub - ${SITE.title}`,
    icon: IconGitHub,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    title: "RSS Feed",
    icon: IconRss,
  },
] as const;
