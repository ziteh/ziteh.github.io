/**
 * Basic site configuration.
 */

export const SITE = {
  // Basic information
  url: "https://blog.ziteh.dev", // Your site's URL, e.g. https://username.github.io
  title: "ZiTe 本物志", // Your blog title
  description: "一位在開源的世界中，慢步於程式與電路、韌體與網頁之人的學習記錄與分享", // Your blog description
  author: "ZiTe", // 君の名は ~

  // Pagination
  postsPerHomepage: 3,
  postsPerArchives: 10,
  postsPerAllPosts: 5,

  // Description generation
  getDescriptionCount: 150, // If 'more' tag is not found, use this count of characters
  getDescriptionMaxLines: 10, // Max number of lines to process

  // Default values for frontmatter fields
  defaultFmTag: "其他",
  defaultFmCategory: "",
  defaultFmToc: false,
  defaultFmComments: true,
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
