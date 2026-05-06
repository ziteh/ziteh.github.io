---
title: "用 TypeScript + Motion Canvas 做動畫影片"
tags: ["JS/TS"]
categories: ["快速分享"]
date: 2025-04-04 17:26:00+08:00
comments: true
toc: false
---

我最近做了一個 [ErgoSNM 的介紹影片](https://youtu.be/mWoAi_D721U)，這部影片是一個由向量圖做成的動畫。以前我要做這種動畫影片都要用 Adobe After Effects，但是隨著我逐漸把各種軟體都[換成開源方案](https://awesome.ziteh.dev/)後就不太想用商業軟體了，而且我想做的效果也沒有很複雜，所有特別找了一些開源的方案。

<!-- more -->

寫程式來做動畫不是什麼新鮮事，一般來說用 Python 好像比較常見，但比較 Python 我更喜歡 TS，所以我這次找到並使用 [Motion Canvas](https://motioncanvas.io/) 這個工具來製作影片，它使用 TypeScrip。

比較特別的是 `npm run start` 後會啓動一個編輯頁面，你可以在上面即時預覽目前的畫面，甚至可以用滑鼠調整各個效果的時間，就不用一直用鍵盤輸入時間微調了。這也是我第一次使用 TS 的 `yield`。

![瀏覽器上的編輯畫面](https://bucket.ziteh.dev/blog/ts-motion-canvas/motion_canvas.webp)

最後輸出時，我是選擇生成每幀的 PNG 圖片，然後再用 ffmpge 將它們合在一起變成影片。

總之我覺得用起來很不錯，未來如果還有其它動畫要製作的話，應該也還是會使用它。

該動畫的專案 repo 在這：[siderakb/ergosnm-animate](https://github.com/siderakb/ergosnm-animate)。不過因為我偷懶，所以裡面的程式真寫的滿醜的。
