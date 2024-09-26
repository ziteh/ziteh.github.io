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

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKrX4InG0CDi9J4rxBfj1XvoBp39i0X6CXaR_wyasREFn4BxrTexYuP0vROMtQIGfLt_6gkNh0lb6M7TYZLwriSnQ5JP9V52IgqrJiJpjT8gTMj5tax3iX0biZTjZiDzAjpzmLIdEStf45gbJtT6WZyjd6xAjK2sIlUPeIRzbR_tMsJRhPgC14oT80/s16000/PXL_20230323_025401968.jpg)

[上一篇](/posts/calcite52-keyboard-1/)中介紹了 Calcite52 的設計理念，現在 Rev 1.0 成品已經完成了，所以來介紹一下。

<!--more-->

# PCB

Calcite52 是基於 [Home row mods](https://precondition.github.io/home-row-mods) 和 [ARTSEY](https://artsey.io/) 這兩個鍵盤操作系統進行設計的鍵盤，所以按鍵數特別少，只有 52 鍵。

微控制器為 RP2040，有 USB ESD 保護（SRV05-4）和 PPTC 自恢復保險絲。整體尺寸為 231.14 mm x 97.79 mm 。

最下面的四個鍵為 1.25 U。

![最終 PCB Layout](https://i.imgur.com/m04crWC.png)

![PCB 正面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRnFEKRBJ7iNYcNnThtgxdujw8hKnr6jOnZLkGaHeWJBu8ChyzXImCRcPN3VqpI-OZzK09yqdHHWk6SIQQP1faMhg7S55MpW70Xr4NV4MYkg5cUx6rhbpv-kLuznfU7cozklshcH1HfW2hht1NzcZVqTx1ksY3ogoQQq9ib7ChhR5WH1FtdjPLjoa6/s16000/PXL_20230323_020054339.jpg)

![PCB 背面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4cGd6Qtf8rXbQwBZeQcwbcZLTnXCBV-krr1yxjjMS4yICjKyjpGxp_eVWnotqVPJJBIlYC8BAHWnyi0zJTL--S1-4EUjiQaVKbXPFnhlMoLk67yvTXyp4ffNllEERttb5tVPF4WN8ChXrb-wBX1hVRj7MNsJ-33T7yqMlQcMe7fBCoAFwumHJkF25/s16000/PXL_20230323_020100545.jpg)

![裝上鍵軸與鍵帽](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg64EOXAwVJxsgCpf3syuZ2W5GAHNQ68kyDRTmcnXuehMDmML2z7FeCdI1EZHo6L5XV4sBnbiZ0MgvQBcVy8M4S0PTh_r1JMMogS-lyDl4hRPelj7Syc_e-pvcWRCU36HHnw127Sj0s6t4FBnrn-cO7LSISemdttyJarilnRVFmWvQmKgLAjzQmSV58/s16000/PXL_20230323_023905851.jpg)

這是我第一次用 Choc 軸，選擇茶軸。鍵帽是 Keychron K1 上拆下來的。

# 外殼

![樹脂 SLA 3D 列印的外殼](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmfE0mPVh55yl-CaZKAJ-orO5lwxG2PWed4JhCUuRFSKT7cfikM8_eithVTcj8_s0xvmi4A-vDeDQmETqat_DvpdOQ8LHxr9PBkUj-o3Y0PwG_6UJOAQKPSqBGIMTKo1tZBVbWTa4QRovr8wCgdDGxC9UVRbZ3mYQ5X3_ISIOO2u2e4BglNodC4FPB/s16000/PXL_20230323_024932747.jpg)

![組裝起來的樣子](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjKrX4InG0CDi9J4rxBfj1XvoBp39i0X6CXaR_wyasREFn4BxrTexYuP0vROMtQIGfLt_6gkNh0lb6M7TYZLwriSnQ5JP9V52IgqrJiJpjT8gTMj5tax3iX0biZTjZiDzAjpzmLIdEStf45gbJtT6WZyjd6xAjK2sIlUPeIRzbR_tMsJRhPgC14oT80/s16000/PXL_20230323_025401968.jpg)

![整體高約 2.3cm](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmr_DMNlwNzqUsNTaYp9UoUN2R_wAhKOJalTTSuQlJxnKGz78d97tJr2mUL8zhrxSIY-JzdG0aj6ypamoPKeGVDJITZxz8cQJ_Df8iSzOAAdQRjIhCtzApzlbLlPRnl8LH2axqrS7LQYJAGVgWmNlJQrKt7Kh9PODV12fggUrxylUDXfcXcLuZ9h-o/s16000/PXL_20230323_025445281.jpg)

上面這個外殼其實是畫錯的。在畫此外殼時，我首次使用 FreeCAD，但是因為不夠熟悉，加上沒有最終確認尺寸，所以外殼和 PCB 有一個段差，我原本是想 PCB 和外殼的外緣齊平。

此外，3D 列印扁平的零件難免會有點彎曲，而 PCB 最外側的螺絲孔沒有加大，也不是槽孔，只要外殼稍微彎曲就會鎖不進去。這是設計時沒有考慮到的。

![修正後的外殼，並加強結構](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLvhCOc6cILoEQddSdR0jBt9UP7P58Om_LskFnOMWUPNFXZ2GS4g03FyhJy8WC-ewfyFdjhub9qAudjKzrU9uKFHv4_zPWKGAQfFo-DZeM-sg6RaTjFxjAkxMAYlasGZYdOT12umNdp2ngD1bq8V1W_gLcR8QXA8ym4m1hxZ4bJnBKwjhm6SPnd35T/s16000/Screenshot%202023-04-16%20142751.jpg)

# 腳架

雖然修正後的外殼畫好了，但我暫時懶得再次訂 SLA 列印件，所以就簡單地再設計一對腳架，用 FDM 3D 列印。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy79q2UstUWryWLyk3ffX1WBqTew_vnVN13rVSsr5RLpfUTdkW7WYf61b6lRouUqZqK7Bp5_nQfBu6OGmFe__L7HP6HSuUtk7OGM0vrvYYXyHbz_9UY-Y71Ma41Y5A-hZfk1X4TNOGORNAomGEwASzSlIhM5Nd_pev0LAZAH__HbkhUSXIbmFMmFDC/s16000/PXL_20230411_103348679.jpg)

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfX1hBYsFMBB77TgpRU9hVMuR8ZW3-mdgVgktAS4FkzjyUphRKC0RQmBfnxtvIOdq5UxDEDuC_8aHWKg9Ecg75NMFYK_4aryd7_b42M1zRfHhwAWBi3DuuUvRT8r3u2lxO4wSUpb4faNbWNQGKn1Ze5N_glunpaF0jf6573tLMlzWE3HMBtl6pBpun/s16000/PXL_20230411_102646515.jpg)

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-0Yq_OSo44Hc6yIhH_ddPYKyU7v-_z1o_DljKDLdX3AhDMGTMhLmQf-YkATNBpcaUbP4Ayz1sj0cQLOBw43D3npkBvDzttBiTTTDCTIaUsPuZsZxGEa0ri2zG4qOTgMtwJhPpBFjD0eMVWeFe1sMTWtu4u0Qho_Xent1c-ydfd0UpfsT7NqCyres6/s16000/PXL_20230411_102639224.MP.jpg)

# Keymap

Calcite52 支援 [Vial](https://get.vial.today/)，可以即使編輯鍵位及各種功能。

為了實現 Home row mods 和 ARTSEY，使用 Vial 編輯也比在 QMK 韌體內設定還方便些。Home row mods 使用 [Mod-Tap](https://docs.qmk.fm/#/mod_tap) 實現，ARTSEY 使用 [Combos](https://docs.qmk.fm/#/feature_combo) 實現。

在下圖看不出來，我設定同時按下「XCV」或「M<>」時會輸出空白鍵，也就是 ARTSEY 的概念。

![鍵位](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKm5YevuV_KIbJUCILuzB1_1jl_IttPrKgmzhFeJyo61ee6dWGH0-5PJqbqN1pe5Jby-jsUf7dkk-Fko_dKERc72ugLOs-Pmhnful-jaXOzQxAIMZtDjpup8Z_97G2PotA1SOclV0eTKU3Q8dqLjVONAoNF7zHXinC-ZMmUFIW0qMg9uCjOAVxH2ce/s16000/image.png)

> Calcite52 的相關檔案在 GitHub 上：[ziteh/calcite](https://github.com/ziteh/calcite)
