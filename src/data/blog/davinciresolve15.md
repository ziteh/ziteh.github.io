---
title: DaVinci Resolve 15 小功能介紹
author: ZiTe
tags:
  - 教學
categories: []
date: 2018-08-20 10:38:00
comments: true
toc: true
draft: false
# aliases: ["/2018/08/davinciresolve15/"]
---

以往我都是使用Adobe的Premiere Pro和After Effects來剪輯影片與製作特效，而最近剛好認識到Blackmagic Design公司的[DaVinci Resolve 15](https://www.blackmagicdesign.com/products/davinciresolve/)這套軟體，不但有免費版本，而且三大作業系統都有（之前在用Linux時才覺得軟體支援真的很重要，一直試Wine也不一定成功）。

總之，DaVinci Resolve 15是一套强大的調光調色+剪輯+特效+聲音處理軟體，網路上已經有不少文章與影片的介紹與教學，此篇文章就不多加贅述，此文章將會介紹一些我使用DaVinci Resolve 15兩週以來發現的重要小功能。如果未來還有發現的會也會繼續更新。

<!--more-->

以下Premiere Pro簡稱為Pr；After Effects簡稱為Ae；DaVinci Resolve 15簡稱為DaVinci Resolve。

## 1.避免連續的圖片被讀成影片

我發現加入媒體庫時，如果是檔名連續的圖片會被當成影片檔，如果要把這些圖片檔分開來加入媒體庫的話，只要在【Media Storage】右上角的3個點處將【Show Individual Frames】打勾，它就會獨立顯示每一張圖片，而不是將它們當成一個影片。

![▲ 獨立顯示每一幀](https://bucket.ziteh.dev/blog/davinciresolve15/f8c670df.webp)

![▲ 獨立顯示每一幀](https://bucket.ziteh.dev/blog/davinciresolve15/a7e03983.webp)

## 2.直接輸入時間來移動播放頭

在Pr和Ae都可以點選時間軸左上方的時鐘來輸入時間移動播放頭，DaVinci Resolve也可以，只是DaVinci Resolve不用點選時鐘，而是直接按數字鍵（上方與右方獨立數字鍵盤都可以）就可以達成。

和Pr與Ae相同，如果要到達1分25秒00影格的話就是輸入“12500”；如果要到1秒59
影格的話就是輸入“159”。

![▲ 直接輸入時間來移動播放頭](https://bucket.ziteh.dev/blog/davinciresolve15/84903ab8.webp)

## 3.開啓關鍵影格時間軸

在Pr中關鍵影格的時間軸在Effect Controls中，而DaVinci Resolve是直接顯示在主要時間軸中。只要按下有加入關鍵影格的素材右下方的按鈕就可以開啓關鍵影格時間軸。

![▲ 開啓關鍵影格時間軸](https://bucket.ziteh.dev/blog/davinciresolve15/282adedb.webp)

而按鈕有2種，左邊波形樣式的按鈕會以波形的方式顯示；而右邊菱形樣式的按鈕只會顯示關鍵影格的位置。
![▲ 波形樣式按鈕](https://bucket.ziteh.dev/blog/davinciresolve15/7c2cd386.webp)

![▲ 菱形樣式按鈕](https://bucket.ziteh.dev/blog/davinciresolve15/dcb4d256.webp)

而且我們也可以直接在關鍵影格時間軸上編輯關鍵影格，還可以加入不同的轉變方式。

![▲ 在關鍵影格時間軸上編輯關鍵影格](https://bucket.ziteh.dev/blog/davinciresolve15/6846b683.webp)

而波形樣式關鍵影格時間軸最左邊的按鈕可以選擇要顯示的不同特效的關鍵影格波形。

![▲ 顯示選單按鈕](https://bucket.ziteh.dev/blog/davinciresolve15/76492da0.webp)

## 版本資訊

![▲ Public Beta Version 15.0.0B.073](https://bucket.ziteh.dev/blog/davinciresolve15/2e89711c.webp)
