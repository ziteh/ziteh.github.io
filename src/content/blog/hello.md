---
title: Welcome to Astro Jing
date: 2026-04-25T23:47:00+08:00
tags:
  - Docs
  - Astro
categories:
  - Astro Jing
featured: true
toc: true
comments: false
---

[**Astro Jing**](https://github.com/ziteh/astro-theme-jing) is a calm blog theme powered by [Astro](https://astro.build/). This post will show you how to use it.

<!-- more -->

Features:

- Auto-generate post descriptions based on character count or up to the `<!-- more -->` tag
- Auto-expanding & collapsing table of contents
- Open Graph image generation
- Full-text search
- Syntax highlighting
- Math equations
- Internationalization (i18n)
- Comment systems (Giscus / Disqus)
- Sitemap & RSS feed
- Static site

## Usage

```bash
git clone https://github.com/ziteh/astro-theme-jing.git
cd astro-theme-jing
pnpm i
pnpm dev
```

## Markdown

### Posts

Place your post `.md` files in the `src/content/blog/` directory.

#### Frontmatter

The YAML frontmatter format for posts broadly compatible with [Hexo](https://hexo.io/docs/front-matter), the default values for some fields can be changed in the [`site.ts`](#sitets) configuration (with `defaultFm` prefix).

| Field         | Description                                       | Type                                                |
| ------------- | ------------------------------------------------- | --------------------------------------------------- |
| **`title`\*** | Post title (h1), also used as the metadata title. | string                                              |
| `description` | Post summary, auto-generated if not given.        | string                                              |
| **`date`\***  | Publish date                                      | string in `YYYY-MM-DDTHH:mm:ss`                     |
| `updated`     | Updated date                                      | string in `YYYY-MM-DDTHH:mm:ss`                     |
| `tags`        | Post tags                                         | Array of strings, default: `SITE.defaultFmTag`      |
| `categories`  | Post categories                                   | Array of strings, default: `SITE.defaultFmCategory` |
| `draft`       | Mark as draft, excludes from production           | boolean, default: `false`                           |
| `featured`    | Mark as featured post                             | boolean, default: `false`                           |
| `toc`         | Enable table of contents                          | boolean, default: `SITE.defaultFmToc`               |
| `comments`    | Enable comments                                   | boolean, default: `SITE.defaultFmComments`          |
| `math`        | Enable math equations                             | boolean, default: `SITE.defaultFmMath`              |

> **\***: required

## About

The Markdown for [about page](/about) is: `src/content/about.md`.

`about.md` does not require frontmatter; it is recommended not to include an `h1` (i.e. `# Header`).

## Configuration

There are some settings that need to be adjusted before deployment.

### site.ts

> [`src/config/site.ts`](https://github.com/ziteh/astro-theme-jing/blob/main/src/config/site.ts)

Basic site information and feature toggles.

| Field                    | Description                                       | Example                      |
| ------------------------ | ------------------------------------------------- | ---------------------------- |
| **`url`\***              | Your site's URL                                   | `https://username.github.io` |
| **`title`\***            | Blog title                                        | `My Blog`                    |
| **`description`\***      | Blog description                                  | `A personal blog`            |
| **`author`\***           | Blog author name                                  | `ZiTe`                       |
| `postsPerHomepage`       | Posts to display per page ([home](/))             | `3`                          |
| `postsPerArchives`       | Posts to display per page ([archives](/archives)) | `10`                         |
| `postsPerAllPosts`       | Posts to display per page ([posts](/posts))       | `5`                          |
| `getDescriptionCount`    | Character count for auto-description              | `150`                        |
| `getDescriptionMaxLines` | Max lines to process for auto-description         | `10`                         |
| `defaultFmTag`           | Default tag for posts                             | `Others`                     |
| `defaultFmCategory`      | Default category for posts                        | `""`                         |
| `defaultFmToc`           | Enable table of contents by default               | `false`                      |
| `defaultFmComments`      | Enable comments by default                        | `false`                      |
| `defaultFmMath`          | Enable math equations by default                  | `false`                      |
| `transitions`            | Enable [view transitions][astro-vt]               | `true`                       |
| `disqusShortname`        | Disqus shortname                                  | `your-disqus-shortname`      |
| `giscusRepo`             | Giscus repository                                 | `user/repo`                  |
| `giscusRepoId`           | Giscus repository ID                              |                              |
| `giscusCategory`         | Giscus category name                              |                              |
| `giscusCategoryId`       | Giscus category ID                                |                              |

> **\***: important

### lang.ts

> [`src/config/lang.ts`](https://github.com/ziteh/astro-theme-jing/blob/main/src/config/lang.ts)

Internationalization (i18n) language and locale settings.

Key settings:

- `lang`: [BCP 47][bcp47] language tag (e.g., `en`, `zh-TW`)
- `langOg`: [Open Graph][og-locale] locale tag (e.g., `en_US`, `zh_TW`)
- `timeZone`: [IANA][iana-tz] time zone (e.g., `America/New_York`, `Asia/Taipei`)

To add a new language, modify the `myLang` object following the `en` template and update the exported `_t` constant.

### socials.ts

> [`src/config/socials.ts`](https://github.com/ziteh/astro-theme-jing/blob/main/src/config/socials.ts)

Social media links displayed in the site footer.

Each social link object contains:

- `name`: Display name
- `title`: Hover text
- `href`: URL to the social profile
- `icon`: SVG icon component

Example:

```ts
{
  name: "GitHub",
  title: "My GitHub",
  href: "https://github.com/username",
  icon: IconGitHub,
}
```

### astro.config.ts

> [`astro.config.ts`](https://github.com/ziteh/astro-theme-jing/blob/main/astro.config.ts)

Astro config, please refer to [Configuration overview](https://docs.astro.build/en/guides/configuring-astro/) and [Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/).

## Features

Details of each feature.

### Auto-generate Description

If there is no `description` in the frontmatter, one will be generated automatically. There are two ways this is done:

1. If there is a `<!-- more -->` tag, the description will be the content from the first line up to the `<!-- more -->` tag.
2. If there is no `<!-- more -->` tag, the first `getDescriptionCount` characters will be used.

For performance reasons, only the first `getDescriptionMaxLines` lines of each `.md` file will be processed.

You can adjust `getDescriptionCount` and `getDescriptionMaxLines` in [`site.ts`](#sitets).

### Syntax highlighting

Astro Jing uses Expressive Code for syntax highlighting; please refer to <https://expressive-code.com/>

You can adjust its config in [`astro.config.ts`](#astroconfigts). [Themes](https://expressive-code.com/guides/themes/#available-themes)

Example:

```ts
// astro.config.ts
export default defineConfig({
  // ...
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ["catppuccin-latte", "one-dark-pro"],
      defaultProps: {
        wrap: false,
        showLineNumbers: false,
      },
    }),
    // ...
  ],
});
```

<!-- ### Disqus Comment -->

<!-- ### Giscus Comment -->

## Deploy

You can easily deploy Astro Jing to a variety of platforms, including GitHub Pages, Netlify, Cloudflare, Vercel, and more, please refer to [Deploy your Astro Site](https://docs.astro.build/en/guides/deploy/).

[astro-vt]: https://docs.astro.build/en/guides/view-transitions/
[bcp47]: https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag
[og-locale]: https://ogp.me/#optional
[iana-tz]: https://timeapi.io/documentation/iana-timezones
