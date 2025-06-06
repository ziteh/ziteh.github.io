export const SITE = {
  website: process.env.SITE_DOMAIN || "https://ziteh.github.io/", // replace this with your deployed domain, e.g. https://ziteh.github.io/
  author: "ZiTe", // 君の名は ~
  profile: "https://github.com/ziteh",
  desc: "一位在開源的世界中，慢步於程式與電路、韌體與網頁之人的學習記錄與分享",
  title: "ZiTe 本物志",
  ogImage: "og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  postPerArchive: 14,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  genDescriptionMaxLines: 30, // Max number of lines to process
  genDescriptionCount: 150, // If 'more' tag is not found, use this count of characters
  showArchives: true,
  showBackButton: false, // show back button in post detail
  showPageDesc: false, // show page description in post detail
  editPost: {
    enabled: false,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: false,
  lang: "zh", // html lang code. Set this empty and default will be "en"
  langOg: "zh_TW", // Open Graph locale tag, format 'language_TERRITORY' https://ogp.me/#optional
  timezone: "Asia/Taipei", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  wontonCommentUrl: "https://wtc.ziteh.dev/", // Wonton comment server URL, set to empty string to disable comment
} as const;
