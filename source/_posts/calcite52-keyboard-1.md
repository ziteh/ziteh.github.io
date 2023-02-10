title: 'Calcite52 - 一種52鍵QMK正交鍵盤的初步設計'
author: ZiTe
tags:
  - DIY
  - 電子電路
date: 2023-02-10 23:10:00
---

# 前言

![](https://blogger.googleusercontent.com/img/a/AVvXsEiDjgnopDdC_Tneeb-yHz95lpySZi5OC5dVayCmAD7d_-lyDiigpjfZfSSV_76folSZweujFPW_Ztq6I6dEe1BKyDylzPKqbLpAKbdLXvzKhxGvcaooOmnpEGWu9ipsWpGljXghNlBDZGQUXNaSGLQpYyLbE5w1C3y3NGJPXjThavvuCR-_BiEwp2u9=s16000)

前陣子無意間得知 [Home row mods](https://precondition.github.io/home-row-mods) 和 [ARTSEY](https://artsey.io/) 這兩個鍵盤操作系統。

Home row mods 主要是將修飾鍵（Modifiers，如 Shift、Ctrl、Alt 和 Windows）改到 Home row，也就是 ASDF 這一排上，以更方便使用這些按鍵，減輕小拇指的負擔。

而 ARTSEY 則是將一把鍵盤的大部分按鍵透過僅 8 個按鍵的排列組合來達成，即可以只用單手 8 個按鍵就達到一把鍵盤所需要的最基本功能。

因此我就產生一種將它們兩個稍微結合起來，做一把小鍵盤的想法。

<!--more-->

# 正文

要實現 Home row mods 和 ARTSEY 的功能，韌體使用 [QMK](https://qmk.fm/) 會比較方便。

由於我現在正在製作的另一把鍵盤 [ErgoSNM](https://github.com/ziteh/ergo-snm-keyboard) 是使用 RP2040 作爲 MCU，而我實際用起來也沒什麼問題，Layout 也很熟悉了，所以這把也使用 RP2040，而非 ATmega32U4。

PCB 基本上一下就畫好了。以往比較麻煩的是要把按鍵和二極體擺放整齊，這次我使用 [zykrah/kicad-kle-placer](https://github.com/zykrah/kicad-kle-placer) 這個 KiCad 插件，只要匯入 [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/) 的 JSON 檔就會自動排好了，很方便。

因爲這把鍵盤想用矮軸，我選擇的鍵軸種類是 Kailh Choc (PG1350)。正交（Ortholinear）的佈局也是必要的。

![▲ PCB 渲染](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikdfMDvGMBbeyubopnGmEdvAsqMoRYKlinSg_swXpWuJnRyoEnrmzMNCaSNbEvTSrd7WkL1ke-EWzbn0UwgHoozA_IJ8-FUWAy8iQWEjWVPnunQrR_PBqa2hrjXjXm071fCRLIj2KBIMmTYL7BaI0F_wQpsOsjSVgg4FkJ2F1yyMECzoBTCS4WUEUb/s16000/l.jpg)

![▲ PCB Layers](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5NtBILxDnwc-sdAUgrVPwGR2ptUVPelBlQUiXgUv8YFAPWsgcTpTTmsP0wScYJUtgNfXFJk3oja7-thCMCc2xvJDjqmZVWybHj67emk0u7EhaZlj00qYwYvwXqO-n6nWBgn7SnF04i_RGzAoGHUapJsPmdPLXGhbCAssf_VNdoxaTp8mnKABXP7N8/s16000/b.jpg)

這把鍵盤取名爲「Calcite52」，「52」就代表有 52 鍵，而「Calcite」是方解石/冰州石，方解石結晶時常爲方塊狀，感覺和 Kailh Choc 滿合的。

![▲ Keymap](https://blogger.googleusercontent.com/img/a/AVvXsEiDjgnopDdC_Tneeb-yHz95lpySZi5OC5dVayCmAD7d_-lyDiigpjfZfSSV_76folSZweujFPW_Ztq6I6dEe1BKyDylzPKqbLpAKbdLXvzKhxGvcaooOmnpEGWu9ipsWpGljXghNlBDZGQUXNaSGLQpYyLbE5w1C3y3NGJPXjThavvuCR-_BiEwp2u9=s16000)

比較特別的是：
- ASDF、JKL: 鍵融合修飾鍵（Home row mods）。
- XCV、M<> 鍵套用 ARTSEY 空白鍵的概念（原本是 4 鍵）。
- 我一直覺得 Enter 和 Backspace 放在小拇指很糟糕，故改到大拇指。擺在中央讓左右手可以單獨按到。
