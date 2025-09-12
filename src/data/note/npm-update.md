---
title: "更新 npm 套件"
date: 2025-06-05T08:30:00+08:00
draft: false
---


透過 [npm-check-updates](https://github.com/raineorshine/npm-check-updates) 更新。

檢查：

```bash
pnpm dlx npm-check-updates
```

實際更新：

```bash
pnpm dlx npm-check-updates -u
```

更新完後記得還要：

```bash
pnpm i
```

## 參考

- [用 npm-check-updates 幫助你更新專案套件吧！ | 是 Ray 不是 Array](https://israynotarray.com/nodejs/20240321/3544397426/)
