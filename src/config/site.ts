/**
 * Basic site configuration.
 */

export const SITE = {
  // Basic information
  url: "https://astro-theme-jing.ziteh.dev", // Your site's URL, e.g. https://username.github.io
  title: "Astro Jing", // Your blog title
  description: "A calm Astro theme for blogging.", // Your blog description
  author: "ZiTe", // 君の名は ~

  // Pagination
  postsPerHomepage: 3,
  postsPerArchives: 3,
  postsPerAllPosts: 5,

  // Description generation
  getDescriptionCount: 150, // If 'more' tag is not found, use this count of characters
  getDescriptionMaxLines: 10, // Max number of lines to process

  // Default values for frontmatter fields
  defaultFmTag: "Others",
  defaultFmCategory: "",
  defaultFmToc: false,
  defaultFmComments: false,
  defaultFmMath: false,

  // Config
  transitions: true, // View transitions (https://docs.astro.build/en/guides/view-transitions/)

  // Disqus comments
  disqusShortname: "", // Your Disqus shortname (without https:// and .disqus.com)

  // Giscus comments
  giscusRepo: "", // e.g. "user/repo"
  giscusRepoId: "",
  giscusCategory: "",
  giscusCategoryId: "",
  giscusMapping: "title",
  giscusStrict: "0",
  giscusReactionsEnabled: "1",
  giscusEmitMetadata: "0",
  giscusInputPosition: "bottom",
  giscusTheme: "preferred_color_scheme",
} as const;
