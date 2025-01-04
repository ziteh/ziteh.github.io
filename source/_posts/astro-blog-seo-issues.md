---
title: "本 Blog 遇到的 SEO 問題"
# subtitle: ""
# description: ""
tags: ["心得"]
# categories: [""]
date: 2025-01-04 15:30:00
# updated: 2024-MM-DD HH:MM:00
comments: true
toc: true
# RESERVE
---

本 Blog 大概在 2024 年 10 月初的時候迎來一次重大變更，包含購買了網域 `ziteh.dev`，將網頁框架改成 [Astro](https://astro.build/)，並且也將 Theme 改成我從 [Astro Paper](https://github.com/satnaing/astro-paper) 調整而來的 [Astro Paper-S](https://astro-paper-s.ziteh.dev/)。託管服務也從 GitHub Pages 改成 [Cloudflare Pages](https://pages.cloudflare.com/)。

在一切都調整好後，我對新的 Blog 無論是介面外觀還是功能上都很滿意。但是在幾個月後我發現 Blog 的 SEO 完全壞了，從 Google 直接搜尋文章名稱，甚至在進階搜尋中明確指定網址和域名也都不會出現任何結果。這個問題算是相當嚴重。

<!-- more -->

首先各個頁面的 Lighthouse 都很正常甚至是接近滿分，使用一些第三方 SEO 分析工具也顯示各頁面、Sitemap 和 Meta tag 都沒什麼問題。但是 Google Search Console 顯示爲「已建立索引」的頁面卻超級少，甚至還一直下降。

![][google-search-console]

幾乎所有的頁面都呈現「已檢索 - 目前尚未建立索引」。網路上有一些文章，但對我來說情況還是沒有改善，反而已索引的頁面數量還在持續下降。

由於我本身實在也不是網路或網頁相關領域的人，所以只好先暫時換回 Hexo 和 GitHub Pages，儘可能回到原本的情況，看看 SEO 會不會改善，再看看新 Blog 到底是那裡出了問題。

希望可以儘快找到並接近這個 SEO 的問題，因爲我相信原本新的 Blog 的閱讀和瀏覽體驗對讀者來說是更好的。

[google-search-console]: https://bucket.ziteh.dev/blog/astro-blog-seo-issues/google-search-console.webp
