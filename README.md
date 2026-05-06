# Astro Jing

A calm blog theme powered by [Astro](https://astro.build/).

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
pnpm i          # Install dependencies
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm preview    # Preview built site
```

## Development

Tech stack:

- Colors: [Radix Colors](https://www.radix-ui.com/colors)
- Icons: [Tabler](https://tabler.io/icons)
- TOC: [Tocbot](https://tscanlin.github.io/tocbot/)
- Math: [KaTeX](https://katex.org/)
- OG image: [Satori](https://github.com/vercel/satori)
- Search: [astro-pagefind](https://github.com/shishkin/astro-pagefind)
- Syntax highlighting: [Expressive Code](https://expressive-code.com/)
- A11y testing: [axe-core](https://github.com/dequelabs/axe-core)
- Linter: [Biome](https://biomejs.dev/)
- Formatter: [Prettier](https://prettier.io/)

### Project Structure

Refer to [Astro project structure](https://docs.astro.build/en/basics/project-structure/).

```text
├── public/             # Unprocessed assets
├── tests/
├── src/
│   ├── config/
│   │   ├── site.ts     # Site config
│   │   ├── lang.ts     # I18n and locale config
│   │   └── socials.ts  # Social media links
│   ├── assets/
│   ├── content/
│   │   ├── blog/       # Markdown posts
│   │   └── about.md    # About page
│   ├── components/
│   ├── layouts/
│   ├── pages/          # Routes
│   ├── utils/
│   ├── styles/         # CSS
│   └── content.config.ts  # Content collection
├── astro.config.ts     # Astro config
├── package.json
└── README.md
```

## Testing

```bash
pnpm test       # All tests
pnpm test:lh    # Lighthouse
pnpm test:urls  # URLs
pnpm test:a11y  # Accessibility
```

### SEOnaut

```bash
pnpm seonaut:up
pnpm dev --host
```

Open <http://localhost:9000/signin> and enter <http://host.containers.internal:4321> as the target URL.

## Deploy

- [Cloudflare Pages build system](https://developers.cloudflare.com/pages/configuration/build-image/#languages-and-runtime)
