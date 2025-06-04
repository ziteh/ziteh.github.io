---
title: 'Calcite52 - 52鍵正交Choc矮軸QMK鍵盤'
author: ZiTe
tags:
  - DIY
  - 電子電路
  - QMK
date: 2023-04-16 15:00:00+08:00
comments: true
toc: true
draft: false
---

![](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/b151b244.webp)

[上一篇](/posts/calcite52-keyboard-1/)中介紹了 Calcite52 的設計理念，現在 Rev 1.0 成品已經完成了，所以來介紹一下。

<!--more-->

# PCB

Calcite52 是基於 [Home row mods](https://precondition.github.io/home-row-mods) 和 [ARTSEY](https://artsey.io/) 這兩個鍵盤操作系統進行設計的鍵盤，所以按鍵數特別少，只有 52 鍵。

微控制器為 RP2040，有 USB ESD 保護（SRV05-4）和 PPTC 自恢復保險絲。整體尺寸為 231.14 mm x 97.79 mm 。

最下面的四個鍵為 1.25 U。

![最終 PCB Layout](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/34232a74.webp)

![PCB 正面](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/f8830e66.webp)

![PCB 背面](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/475beba6.webp)

![裝上鍵軸與鍵帽](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/a378be26.webp)

這是我第一次用 Choc 軸，選擇茶軸。鍵帽是 Keychron K1 上拆下來的。

# 外殼

![樹脂 SLA 3D 列印的外殼](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/3f95f570.webp)

![組裝起來的樣子](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/b151b244.webp)

![整體高約 2.3cm](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/48bcb289.webp)

上面這個外殼其實是畫錯的。在畫此外殼時，我首次使用 FreeCAD，但是因為不夠熟悉，加上沒有最終確認尺寸，所以外殼和 PCB 有一個段差，我原本是想 PCB 和外殼的外緣齊平。

此外，3D 列印扁平的零件難免會有點彎曲，而 PCB 最外側的螺絲孔沒有加大，也不是槽孔，只要外殼稍微彎曲就會鎖不進去。這是設計時沒有考慮到的。

![修正後的外殼，並加強結構](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/aab5a97d.webp)

# 腳架

雖然修正後的外殼畫好了，但我暫時懶得再次訂 SLA 列印件，所以就簡單地再設計一對腳架，用 FDM 3D 列印。

![](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/3258d26a.webp)

![](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/e0e2c1a5.webp)

![](https://bucket.ziteh.dev/blog/calcite52-keyboard-2/0ce0859b.webp)

# Keymap

Calcite52 支援 [Vial](https://get.vial.today/)，可以即使編輯鍵位及各種功能。

為了實現 Home row mods 和 ARTSEY，使用 Vial 編輯也比在 QMK 韌體內設定還方便些。Home row mods 使用 [Mod-Tap](https://docs.qmk.fm/#/mod_tap) 實現，ARTSEY 使用 [Combos](https://docs.qmk.fm/#/feature_combo) 實現。

在下圖看不出來，我設定同時按下「XCV」或「M<>」時會輸出空白鍵，也就是 ARTSEY 的概念。

![鍵位](https://bucket.ziteh.dev/blog/diyqmkkeyboard-vial/6f687248.webp)

> Calcite52 的相關檔案在 GitHub 上：[ziteh/calcite](https://github.com/ziteh/calcite)
