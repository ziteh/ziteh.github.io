# Blog

To pull in later theme updates:

```sh
git config merge.ours.driver true # required once per clone; see .gitattributes
git subtree pull --prefix theme https://github.com/ziteh/astro-jing-theme main --squash
cd theme
echo "CONTENT_DIR=../content" > .env
pnpm i && pnpm build
```
