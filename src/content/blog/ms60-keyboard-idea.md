---
title: "MS60：60%左移熱插拔鍵盤開發-構想"
subtitle: ""
# description: ""
tags:
  - DIY
  - 3C
categories: []

date: 2023-07-10 22:30:00+08:00
header_img: ""
comments: true
toc: false
draft: false
---

我最近開始製作一個名為 MS60 的鍵盤，它的主要特色及設計目標是 60% 尺寸、左移佈局（2U Shift）、Cherry MX 軸熱插拔、分離 USB 子板。

左移佈局是為了在 60% 的尺寸下可以有方向鍵。整體佈局會很類似 FILCO MINILA。

會想做這個鍵盤是因為我的 Just60 已經有點舊了，而且它也不支援 [Vial](https://get.vial.today)，再加上現在金屬 CNC 加工的價格也變得很便宜了，所以想說做一款風格走向比較主流的 60% 鍵盤，也因此它被命名為 **_M_**&#x61;in **_S_**&#x65;quence，也就是天文學中的主序帶——它們是恆星演化中宇宙裡數量最多的恆星所在的階段。

<!--more-->

目前還在初期開發階段，我連要採用的 MCU 方案都還沒確定要 RP2040 還是 nRF52840、韌體要 QMK 還是 ZMK。MS60 不算是我的主要專案，所以進度大概會很慢。

![目前的佈局設計](https://bucket.ziteh.dev/blog/ms60-keyboard-idea/12859669.webp)

![Keymap 設計](https://bucket.ziteh.dev/blog/ms60-keyboard-idea/61c9aa28.webp)

![PCB](https://bucket.ziteh.dev/blog/ms60-keyboard-idea/8ef6527f.webp)

![PCB 正面渲染](https://bucket.ziteh.dev/blog/ms60-keyboard-idea/998b3170.webp)

![PCB 背面渲染](https://bucket.ziteh.dev/blog/ms60-keyboard-idea/8f4657ca.webp)

可以發現目前的 PCB 上還有正面的 RGB LED（SK6812MINI-E），但是因為要支援多重佈局的關係，有些鍵位的 LED 會擺得歪歪的。這時我就重新思考設計理念是什麼？我想要它是一把內在優雅的鍵盤。

雖然這些 LED 都確實可以塞進有限的空間內，但它們大概與核心價值牴觸了。雖然我也想過用 WS2812B 2020 這種更小的 RGB LED，但總覺得這樣佈出來還是沒辦法符合期待，所以之後應該會完全拔掉正面的 LED。至於背面的 RGB LED 可能可以保留。

而且我自己其實是不喜歡鍵盤有 LED 燈的，一開始會加也只是想儘可能保留更多元的功能。不過我畫鍵盤時更多時候是遵循減法的方式。不過也有可能是最後拔掉的是多重佈局的兼容性。
