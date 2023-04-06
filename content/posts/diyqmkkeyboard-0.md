---
title: '[自製QMK鍵盤-0] QMK介紹與SNM鍵盤計劃'
author: ZiTe
tags:
  - DIY
  - 3C
series: ["自製QMK鍵盤"]
date: 2020-06-21 10:24:00
comment: true
toc: true
draft: false
aliases: ["/2020/06/diyqmkkeyboard-0/"]
---
# 前言

[QMK（Quantum Mechanical Keyboard）](https://qmk.fm/) 是一個針對 Atmel AVR 及 ARM 微控制器的開源鍵盤韌體（Firmware），在目前自製機械鍵盤中相當受歡迎，有許多自製的鍵盤都使用 QMK。

這一系列的文章將會介紹如何用 QMK 來自己作一把機械鍵盤。

<!--more-->

# QMK 簡介 

自製一把鍵盤主要會需要兩個部分：硬體和韌體。

硬體（Hardware）大家都知道，就是PCB電路板、鍵軸、LED...等，但[韌體（Firmware）](https://zh.wikipedia.org/zh-tw/%E9%9F%8C%E9%AB%94)可能就不是每個人都聽過了。簡單來說，韌體就是嵌入在硬體（通常是晶片、微控制器）裡的程式。例如我之前介紹過的[ Just60 鍵盤](https://ziteh.github.io/2020/03/unbox-just60/)，它的主晶片是 [ATmega32U4](http://ww1.microchip.com/downloads/en/devicedoc/atmel-7766-8-bit-avr-atmega16u4-32u4_datasheet.pdf)，而韌體是用 TMK 改的。

說到自製鍵盤的韌體，就不得不說到[ TMK](https://github.com/tmk/tmk_keyboard)，這是目前最廣泛使用的開源（Open-source）鍵盤韌體，有許多的自製鍵盤都是用 TMK 為基礎進行製作的。而 TMK 也有許多衍生的鍵盤韌體，其中最有名的就是本次要使用的 QMK了。

QMK 韌體的功能眾多、使用簡單、擴展方便，相關的工具和文件也是非常的豐富，這些都是我選擇它的原因。

而我的開發板是使用[ Pro Micro](https://www.sparkfun.com/products/12587)，這是相當常見的 ATmega32U4 開發板。但因為 Pro Micro 有拉出的接腳有點少，所以只能做鍵位數比較少的鍵盤（例如 60 鍵）。

# SNM 鍵盤計劃

我之所以會接觸 QMK，並想自己做鍵盤是有一些小小的原因的，而這也是 SNM 鍵盤計劃的起因。

## 遇到問題

鍵盤和滑鼠是許多現代人工作上不可缺少的東西，但是我一直都很不喜歡滑鼠。我們的右手（或是左手）總是在鍵盤和滑鼠之間來回切換，這樣不僅很沒效率，也很累人，尤其是使用100%（104鍵）的鍵盤。

## 嘗試解決

我因為會長時間使用電腦，所以使用滑鼠的右手常常疼痛。雖然我早在高中時就發現此問題，並且開始訓練自己左右手都可以控制滑鼠，藉此分攤使用量，但隨著使用電腦的時間越來越長，這招也不夠用了。

後來我嘗試使用軌跡球，效果非常好，基本上不管用多久都不太會有疼痛感產生。雖然手不痛了，但是手在鍵盤和軌跡球之間的切換依然存在，操作效率依舊很低。

我一直以來都很喜歡用筆電的觸控板來進行滑鼠游標的控制，因為我的大拇指可以很自然地操作，而且我的雙手都不用離開鍵盤，效率可以說是非常高。

但是市售的外接觸控板實在是太少了，而且現在有許多筆電也漸漸捨棄觸控板了。我雖然也嘗試使用舊手機搭配滑鼠App來當觸控板，但是使用上的效果並不太好。

## 發現新路

就在我灰心喪志時，我看到了這篇文章——[TEX Yoda 2 = HHKB + 小紅點 + 機械軸 + 方向鍵](https://tsai.it/archives/2017/11/tex-yoda-2-hhkb-%E5%B0%8F%E7%B4%85%E9%BB%9E-%E6%A9%9F%E6%A2%B0%E8%BB%B8-%E6%96%B9%E5%90%91%E9%8D%B5/)。我才想到，聯想電腦ThinkPad系列的TrackPoint（俗稱小紅點）不就是鍵盤結合滑鼠的最好示範嗎？

於是我開始構想、找資料、查零件，準備開始製作屬於我自己的鍵盤。

——這就是 SNM 鍵盤計劃的起源。

## 開闢新道

SNM 鍵盤，或稱 SNM-Keyboard（"Say No to Mouse" Keyboard）是一個開源的鍵盤計劃，包含了硬體和韌體的部分。

其最主要的目的就是將滑鼠的功能完全地整合進（或附加在）鍵盤，這樣在使用電腦時，手就不用一直在鍵盤和滑鼠上來回切換。

目前SNM-Keyboard計劃有一個項目：
* SNM60：一把整合了滑鼠功能的60%尺寸鍵盤。

本計劃的韌體使用 QMK。而硬體，或者說PCB電路板的部分會參考眾多開源鍵盤（如 GH60）來進行設計。

## 瞭望前方

我在找資料的時候發現，自製鍵盤的中文相關文章並不多，找到的通常也都是來自中國的文章。

所以我除了自己把鍵盤做出來以外，我還會盡可能地將我的製作過程與步驟整理成文章，就是希望未來如果有人想要自己做鍵盤的話，可以有多一點的資料參考，可以少走一點冤枉路，並且從中感受到開源的美好，甚至投身並回饋開源社群——這是我對 SNM 鍵盤計劃的額外願景。

# 結語

經過簡單的介紹，趕緊開始 QMK 的旅途吧：[\[自製QMK鍵盤-1\] 設計鍵盤佈局、按鍵功能和產生韌體原始檔](/2020/06/diyqmkkeyboard-1/)

# 相關文章與資源

* 參考資料
	* [TEX Yoda 2 = HHKB + 小紅點 + 機械軸 + 方向鍵](https://tsai.it/archives/2017/11/tex-yoda-2-hhkb-%E5%B0%8F%E7%B4%85%E9%BB%9E-%E6%A9%9F%E6%A2%B0%E8%BB%B8-%E6%96%B9%E5%90%91%E9%8D%B5/)
	* [TEX YODA II - DIY kit (Special Edition)](https://geekhack.org/index.php?topic=92681.0)
	* [TEX Yoda IIを作る](https://kobtea.net/posts/2019/01/11/tex-yoda-2/)
* QMK相關
	* [QMK官方網站](https://qmk.fm/)
	* [QMK官方說明文件](https://docs.qmk.fm/#/)
	* [QMK的GitHub](https://github.com/qmk/qmk_firmware)
