# Blog

To pull in later theme updates:

```sh
git subtree pull --prefix theme https://github.com/ziteh/astro-jing-theme main --squash
cd theme
echo "CONTENT_DIR=../content" > .env
pnpm i && pnpm build
```
