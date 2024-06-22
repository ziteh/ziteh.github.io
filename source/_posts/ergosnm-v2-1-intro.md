---
title: "ErgoSNM——有軌跡球的分離式人體工學QMK鍵盤 (v2.1)"
subtitle: "An split ergonomic keyboard with trackball"
# description: ""
tags:
  - DIY
  - 3C
  - QMK
categories: []

date: 2023-04-30T17:10:00+08:00
header_img: ""
comments: true
toc: true
draft: false
---

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjomPEzS9-CAg0tckSdbuGhUKEqEwi7Fitbm7g664xAt6KUuiUpvG1thjNKNARCq9x_JNFkMLit46aYbtpui2eG1qMtvZgZPY9pD0hYhS7pthagfeJOBqcq84bG-SalQydnXrthixqqQYHqsHpj9homTtRZagHPFzFkvRSv5XxGDucJpWoCF-if3Ohk/s16000/ovP1uKJ.jpg)

[ErgoSNM](https://github.com/siderakb/ergo-snm-keyboard) 是我自己設計並製作的分離式人體工學機械式鍵盤（Split ergonomic keyboard），並且有可以取代滑鼠功能的軌跡球，其韌體使用 QMK。

這把鍵盤的目標就是讓人們（尤其是常需要敲鍵盤寫程式的工程師，甚至是 Vim 的使用者）在使用電腦時，右手可以不用在鍵盤與滑鼠之間來回移動。長時間使用電腦的話，這僅僅幾公分的移動都會讓效率下降，最糟糕的是造成手部的負擔。就算 ErgoSNM 可能難以完全 100% 地取代滑鼠，但希望至少可以勝任簡單的遊標操作。

<!--more-->

爲了做成這把鍵盤，我開始研究 [QMK](https://github.com/qmk/qmk_firmware)，所以我才會寫了一系列的 [QMK 教學文](/posts/diyqmkkeyboard-0/)。而現在，第一個可以正式當作鍵盤使用的 `Rev 2.1` 版完成了，因此來介紹一下。

# 特色與規格

- 全部 64 鍵。其中左側（有拇指區）有 29+6 鍵，右側（有軌跡球）有29鍵。
- 軌跡球用於移動滑鼠遊標及滾輪滾動，使用 [PixArt PMW3360DM-T2QU](https://www.pixart.com/products-detail/10/PMW3360DM-T2QU) 光學感測器。
- USB Type-C 接口。
- 支援 Cherry MX 形式的鍵軸熱插拔。
- Column-staggered 佈局。
- 支援 [Vial](https://get.vial.today/)，可以隨時編輯 Keymap 鍵位及其它鍵盤配置。
- 使用 [Raspberry Pi RP2040](https://www.raspberrypi.com/products/rp2040/) ARM Cortex-M0+ 微控制器，搭配 16MB 的外接 Flash。
- SRV05-4 USB ESD（Electrostatic discharge，靜電放電）保護。
- 自恢復保險絲提供短路或過電流保護。
- 有板載 RP2040 的 RESET 與 BOOT 按鈕。
- 一個可自訂的 LED。
- 連接兩半的線可以選用 3.5mm TRRS/TRS 或 USB Type-C。
- 左半有 SWD 與 USB D+/- Debug 測試焊盤。
- 500mA 3.3V LDO。
- 支援 JLCPCB 的 PCBA 服務，大部分的零件都不需要自己焊接。

整體的鍵盤 Layout 參考並結合 [Keebio Iris](https://keeb.io/collections/iris-split-ergonomic-keyboard) 與 [ZSA Moonlander](https://www.zsa.io/moonlander/)，爲 6x5 設計，Column-staggered 的設計可以使手指的擺放更加自然。

預設在切換到 Layer 1 時，軌跡球會變成滑鼠滾輪的功能。滑鼠按鍵可以直接分配到特定的鍵上，而我使用 [QMK Combos](https://docs.qmk.fm/#/feature_combo) 功能，設定同時按 <kbd>J</kbd>+<kbd>K</kbd> 鍵時是左鍵；<kbd>K</kbd>+<kbd>L</kbd> 鍵時是右鍵；<kbd>J</kbd>+<kbd>L</kbd> 鍵時是中鍵（滾輪按下）。

# 零件

整個鍵盤的 PCB 分成 4 個部分：
- 左半主 PCB
- 右半主 PCB
- 拇指區子板（Thumb cluster）
- 軌跡球子板

所有的 PCB 檔案都在 [GitHub](https://github.com/ziteh/ergo-snm-keyboard) 上。詳細的零件清單請看 [Parts List](https://github.com/ziteh/ergo-snm-keyboard/wiki/Document-for-Rev-2.X#parts-list)。

![左半主 PCB (Bottom View)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6dO_mnkVhaYbtkG02wFyNsJFdHKv6ksLL0X2enGrMLLmrT4hkVK-XlFYK8dqkFw3NMbV3tsNalGX7KtV387F8BOFYMN9YGaFgmRTU_CXdy4IESosQ2hj1zpVjxMIk9dXc5ulBmPNk6YU5-3TtldYN_ob24syWUkJCGrLSeIYrH5ZrhkEPXQgpu1I9/s16000/lFPIKst.png)

![右半主 PCB (Bottom View)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgKrLNx1HL1SfHOirbf27VJaKAokb4rCj1spZV4oCJ2r6XipFFd6Iee_IZAN2HZbFQqndGHbhVFt5KgRL8kfcOTC9jWDEhWm3oD2CZtiSpI7AwYxxGt4LY3ZE4oHK_L1UREaa6cxqrRfCEYQCWGRfTBfdyIA2bmCtfjZmb7KhjpXcNE8VwwRyGA0hgw/s16000/YIMYJX9.png)

![拇指區子板 (Bottom View)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYklKhN4QzWLMyv7n6wGgdtWcQ0iJH0HbNBmyynr6_L2IpXX9Qah2233CrhrlFxVVbFvuWWn7dvw3GLZnjajgJ2CS7WowFkJZ6aHJZO__OKpnYaNi97NEfXv7OrPrA9UVGMCIQxKsE2MPhZSRBYK6v3r1gbKlBc3PygULjs1NeDBbos13y9OY2kIon/s16000/PUA9THP.png)

![軌跡球子板](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuRqo0i45ZfHiZGcLMmOwndWTQRm1ly4GhOmrfHK4F1UR0NVYp1RX7SxlH4EH3Aa3NA6fBekDTuzjlC58y40qxQ9FGWz36inGy7bTMBEG7v5cYfQhQv_6IH7od2_Cj60W2nbNg_BI7eqf4ZyNCMmXHQrrQsQoSInaHrhiNhF-0JGxtgkn3FUZBAahh/s16000/OyAF7rm.jpg)

# 組裝

<iframe width="560" height="315" src="https://www.youtube.com/embed/1BXKdrCFn6c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

因爲我有使用 PCBA 服務，所以大部分的零件都不用自己焊接，包含最麻煩的 QFN 封裝 RP2040。但是爲了降低成本，有一些零件我還是選擇自己手工焊接，包含了：USB、LDO、保險絲、鍵軸熱插拔座、TRRS 座、FPC/FFC 連接器。另外拇指區和軌跡球的子電路板我沒有用 PCBA，所以這 2 片是完全自己焊的。

將焊接好的 PCB 連接起來。這時就可以先燒錄 QMK 韌體進去，測試功能是否正常了。

![完成 PCB 焊接](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEieqk1kQZQJzrwvObzCeKdPhyDg-iNOo9gzl6oRwpGHksdJ3F7EkXCx6GHOn5rBngN0cdwOEndw-9bAIWiF-bbbG_-zSkP84sXRufG-9AmjBpSklEAjwLESvvTARRgC2GtCgzrHE_XaOfRuMC2pFHoifE-UKA9oL6wJgGyWYjMRfBh6p0pb7OoilCgV/s16000/kWDrTm2.jpg)

PCB 搞定後，就可以安裝外殼。我的外殼一樣是找 JLCPCB 訂，使用 SLA 黑樹脂 3D 列印，效果還不錯，價格也不會太貴。使用電烙鐵將熱融螺帽嵌入到外殼預留的螺絲孔中，再將 FR4 定位板（一樣是 JLCPCB 製）鎖進外殼。也可以先將定位板與 PCB 組合好再一起鎖進外殼裡，我設計的螺絲孔都沒有遮擋或干涉。

![組裝定位板](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitwNF3pmjzf_SBwxJ78euhFpFnVw2C1gxwzdgwlNUBdyZ4Q7CW2sknrmPXJknfOmUgfhh8cVCD6u1up4UEuRJKlrlyEcPt7Xr23fOoZH6LWVtZ6kx1EzP7w2ZswHIORcc15v3H9R4ervZyo7NLYUD8T-B-zVCGY9Qzm1hZx5JPZ0FrSzBVIKsHbmGf/s16000/54kXYYD.jpg)

先插入一些鍵軸把 PCB 與定位板固定，再將剩餘的鍵軸一一安裝上。我使用的是億光水王軸 v2 55g。

![插入鍵軸](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGFfZtEczTVqNb5Rn0v0gNWrGPC5qD61e3ylDXwiA4s9_aIikzWyQzodbYZAGT8_qzr55o8BTdTDvsnXIrduccgVH3EYabosew7R3H1HIFbVwt7fcGQ4ux8d_LM-0nmLDjb8B6u2OF1LxxG7S2epmw_hiO6WIsdTaPbrvSTcnMiw8eU9X20NV9C0vL/s16000/5N0QGRi.jpg)

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1x_UbV_Uzq6i4gDH8ucrwvN_MblVezYSqmthIT5VhC1whJ5sz16zLH5DlPZqE8HSabSx07hEw9fG1se_5J19TO5V-P1Lh5xbVfKjXacIKDiumzAYDQ8SsTm_4rUguXHf4nYglFa9h9jVfrilCQoGBjvW2L0mfna0QpT3XkSp5Y5DW1mmFkewtjUKt/s16000/Lklcmzc.jpg)

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6FWMwa7CwrHaadHwyVpofQfnAA9gqmNf5P3PgVCynK_G7F2mUBN2-SzagPKip0hj4iIN02wyqjrHYYs9m3cXnBRWzxH7YbcJrPoxELXk6vln0qQBILNM2jpleuMQuRsCVcCClyzpKh7Yp8MKYj9dL0-fHIa1OgLF-iY16qC8XMCMCYZxDc69kpBde/s16000/BhxgrRT.jpg)

最後鎖上底蓋和腳架。這裡的腳架是 MFJ 尼龍 3D 列印的。

![鎖上底蓋與腳架](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj0y9E-pOU2r_b8sVI6QhCyuTGEDjG_5w1yGuCg6H4vOsRSd_lckxvN7CY9B0RRN1LcisrYX_0t6SCDzZuOnrFsR6ZD4qLaxqHN7ZJYBx2F6HhOjIuI7TQ-OTWBVnmE_UUqQ9c8atZV_L3m0BOrY5osrXZWuih6PZto0ZttCJdBoMOxaMVojf-1Qtay/s16000/64Up6Aol.jpg)

完成後就可以正式使用。Vial 軟體可以正常辨識與運作。

![可以使用 Vial](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7CbpXPeS9Q9bfvoflorZR1u-REqUQ1KQMSEwmT-GaP3rl4c1-F7cbJR7sGHbWFTfGF1xXxDPsvCvtrUAEuO6MjaHY6GgjkmspAYK-zXAdLhO28oPqA0ASCl67I2KG8JJEYUWQ2gI8n-sqihFx1KemPakP7BVpCMh3CIDNgKSkxZYsveyxGMR5DyQ7/s16000/0yXPjm1.png)

# 使用

分享一下我親自使用約 3 週的想法。

1. 不確定是我太習慣 Iris 還是目前的 Layout 真的不好，最下面的 space row 很常按錯。但我朋友表示他沒這個問題，而且 6x5 配置的鍵盤其實不少。
1. 右手拇指區只有軌跡球果然太空了，應該要再多加一些按鍵。
1. 滾輪的滾動速度已經設到只剩1了但還是太快，這個要再想辦法。
1. 有一點比較奇怪的是，`v2.0` 時左側接電腦軌跡球也會動，但 `v2.1` 就只能接右側，明明這部分的程式沒動到。
1. 測試時我不小心燒壞一片 PCB 上的 RP2040，懷疑是熱插拔 TRRS 的關係（TRRS 不是設計用來帶電熱插拔的），這點也要再看看如何改善。
1. 我本來就在用食指軌跡球，所以拇指球也很快就上手了，現在除了遊戲外應該都沒什麼問題。

<iframe width="560" height="315" src="https://www.youtube.com/embed/Lcm6xuI0GyE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

# 開發過程

## 早期

SNM 鍵盤計劃是我從 2020 年 6 月開始的，目標是設計並作出整合鼠標裝置的鍵盤。

最一開始是受到 TEX Yoda II 啓發，因此最初的計劃有也是做 60% 鍵盤，而鼠標裝置也是指點桿（小紅點），然後開始慢慢地學習 QMK。後來我朋友推坑我 Keebio Iris v4 分離式鍵盤，而我當時也開始使用食指軌跡球取代滑鼠，因此計劃改成做分離式鍵盤+軌跡球。

但是因爲我還有其它東西要做，所以這個鍵盤的進度一直不多，包含我在研究要如何做到完全無線且還有軌跡球的功能。如果只是要全無線的分離式鍵盤其實不會太難，要再加上軌跡球功能的話也還好，但是因爲達成方案很多種，包括不使用 QMK 韌體，我想把每一種都實際測試過一次再決定最終方案，所以才會拖這麼久。

![早期設計的軌跡球感測器 PCB](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_z8PRnwLFbvdWsDexqhSct47ZNFakd9bQ7tnrEC-UKPNpdqX4B1tdu5AGAJULK7ovLY6uH9rRhNHbo2MlhyqaV46diA7OJgS7A3kJ27i-OO_hL6N3-6Nz1Ug-GsFN99tKjNePSm4rn0mtIV7yqNW_EzMKo08CqwfctMv_A53iXZjpF9HVNFGQbQiA/s16000/bwTRRi4.jpg)

其中包括爲了測試方便而自己設計的各種開發板：搭載 [nRF52840](https://www.nordicsemi.com/products/nrf52840) ([MDBT50Q](https://www.raytac.com/product/ins.php?index_id=24)) RF SoC 的 [MDBT Micro](https://github.com/ziteh/mdbt-micro)；搭載 ATmega32U4、取代 Pro Micro 的 [Next Micro](https://github.com/ziteh/next-micro)；搭載 RP2040 的 [RP Micro](https://github.com/ziteh/rp-micro)。

期間還受到了 PCBWay 的贊助，他們免費幫我生成了一批 PCB 與鋼網。人生第一次被贊助。

![MDBT Micro](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgJRLKqep_RV7NRMVRtkmcg0LLiOTe13p1IlzIYxCGjsy_cdSckAMDBLI441zwuOWBcRXeffIAf3uzTKK00jGIc52fzIrnjK3spU7nuLVHLdwthpJ_pqprbZg_H9nrhY0GA0Qz-VrhyQqR0LLHiuFSXqV4N2VacuBZ9s0sep5Kh7nnvcoVMNqngiwB8/s16000/TniY3Ef.jpg)

![Next Micro](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9oLwmf-Pi3LV0OToeNDmy5x10F2eNd8U_QesrvJY20CfetawM6zWzRNulHkVTaZFdmfbBqlKKCAt3V2w5HzdCsjgRZIGRx42QdphChjH796nhQvJlAWO5CqsaILK8i-AnXzOhWDGCr5vXurhAScgT28jq6hm8j9J0_xvyRbtJ77QPzmfH5wTbef6c/s16000/68747470733a2f2f692e696d6775722e636f6d2f4362616c464c592e6a7067.jpg)

![RP Micro](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_QDbwCkGycWz7jqhNoBEsToF3LuoiPCt1CtaS74-8pH4P_P8f8lmBqErAOvXb7OzYyil8tu6KTulZ-jjWn2xWFCB-k_FBNUkSh31nAr_YDYSQbeNYMBLcBc9-PLtoeASmINjL7jhkZ65M22TTyjBM_MUNl9b2C-SnuYT1fe5OQU9xKnRUzIhcpCWw/s16000/68747470733a2f2f692e696d6775722e636f6d2f7356477152796b2e6a7067.jpg)

<iframe width="560" height="315" src="https://www.youtube.com/embed/CSA7Ih7nAls" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

到了 2022 年 2 月 左右，我覺得這樣一直花錢和時間研究無線方案好像不是很好，而且其實也有比較確定的辦法了，所以我覺得開始正式做鍵盤的部分，想要先作出一個有線版本的測試鍵盤 Layout 與軌跡球等，當作階段性試驗，也就是現在的 ErgoSNM Rev 2.1。

## Rev 1.0

Rev 1.0 的 PCB 主要是測試鍵盤 Layout 與[我自己畫的鍵軸 Footprint](https://github.com/ziteh/key-switches.pretty) 是否有問題。

![ErgoSNM v1.0 測試用 PCB](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitaAlcXrmnpa3CZ6V1rrfLeljqgOJvkNGBEQa05XK4XgPMpLP9Oy2oX3L8lmncuiWlqg87H7gg5QgE8sOIxh-KwxSd3eqmiZ8tmLseaz1_KOkwmJqY9gHgh-hkZ0r9BpftmvUmXGtSVBr1sMQgEg4lawGbmtWf02tzIRqrQrKvwpDHzc9sUcDd0dlt/s16000/PuP0csC.jpg)

![ErgoSNM v1.0](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitvs1aabTRCE1q8249Dk0D5DzQl-kzXpXimvAH08SzhGTSBhPzDBrhNBAPO5dOH-9EZLuFy9QgHaptZk_UX3a2Q0bszn8-UfR9rv6jR2md92exoZZu_vap0_SAPFntQ7jmC_n_crx294ahpx_oY8_5x-R3hGs95IACNWbQSVVC1AerCX-AACYm0PVe/s16000/AHmFrbP.jpg)

## Rev 2.0

Rev 2.0 其實和最後的 Rev 2.1 已經幾乎沒有差別了，幾乎只差在子板的連接器由 JST GH1.25 改成 FPC/FFC，Rev 1.0 的問題都修正了。

這時主要在確認外殼的設計與可生產性。

![ErgoSNM v2.0](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbz3XfZSNSloypJoef-qO78t932NjE-hp3LEgcV83b3clS3CJx5s9UR72kEK6IwRXByBBkS4H9TEPU9y9jSydWU-1mBuwnu6NgmOgu4ge6-rcB_d0UjndD00wHDjJ6kLCioaj5Orfz986bqBBc_Yhb1kym6NJS2j2pzzBI00OMwB1RYcLrTpcJXZp0/s16000/p5efEiD.jpg)

![ErgoSNM v2.0](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOSLi6C-Z8wesLn3iYa-zGhEgAiZv6Lt6i9aJ3Lrn_unOSWMwofkiJN5wyGUe_GUD9rNtk5YrojZDWkUtMZK5JksP-qbw0y-CYbl_uVkL9DVInY2jklPYgYG63PGYGNbt1By-rWML0H03MgalMZVeXYKSrgioNE37dCgLDQ0jou3mJc69tXR_AyIni/s16000/iunDh1H.jpg)

![ErgoSNM v2.0](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmPp8a3_LbWJsV6PO23wmhOlxd1i4EckWyQvFNkpk1xKI9jH3ncfSgiCEuP_haKyz5F1ztdxs80I7rhPaRkKFZcXj2eHTTHE8i9Q6XVeRn15KjZl6GQH3I4wiBNt5uKZnZLirrQuuPlKptagQgB6-2DSaOyxwJ7UkaocYDS5OEqTke8veggGG9Dr9p/s16000/2IsvDlb.jpg)

![ErgoSNM v2.0 試做的外殼，原本還更多](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPrHuHYVK-g95BoJzpY2rjBvp3s3mAsovt5FhRNnHphhYFwkoDKSeyP385Xwf2zq-zlmSOFr9JajryK36oFQeQWWtnA5YVAhI0PQW6ZyTSTIoqKZVqS3bnpyXIULuVm-Km_3DX4uXk2cZyeJ0kcKLHFk6gEobkrE07tDpKjMPokBntm5l5mM6ydYyb/s16000/kAELfXq.jpg)

![設計外殼](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdbqe7dhoItP3ZQqVNKG5kd_QmJPyrNnbda089q85_qkjTmlXnPh-z945fKieLsqqSD90Pc5xAPDVQd0ZoGLXCqIP0Nk7Xn8Cai61e_AHMwddVsjtncTu3iuLSWi9EGOroa7RVFiVtduFBxE7Zs1mZxp6xqoN92r1lCltQ3lr92FFJ65ssa_fbt02B/s16000/npMxuBe.jpg)

![設計外殼](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1OCCo_8UQZ8GYyu6_MADh3qjwCMWn6MopuNvjEHRPnoM9JXHBgQCrIeD0fKoErd_SbZTY-oxuTEHvGekBkEkRtiBR_v8aCOf7gkwjnA2EX1ENS9vA5ZrZmCmN3wr3lrJsgsN9gI56K1i0x5FJF2xt04K_asLU12yT7BoMervnWA43kV8oLL6OQTZ2/s16000/S12uUib.jpg)

![設計外殼](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSbUJxaxfMdfrTlURGjO_ZGvFnkVcGBmfxvgANO6hJ4zGd2mJ_LaSMdcgDfeBGgtko9nbhW5AbVVV7D0Ack63SfPC7jhfKar_6tAIGxuL1tBs9lR4ApAINjbdSK6eMB0aaH0QaWy1urDjBFSepfw_iiIfcjgDG8QRY05c7iirrUrfJBVeYO1OLbJzx/s16000/E4U7h6P.jpg)

![測試軌跡球的軸承和滾輪](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSQkimQEnDMMmodY-3G_jDwCMHkQvqxvCTljQC4n5LIA4pUUFgUhRnG-KkWUREYKrxRvxsrC9qJKV3SsR_WpMLshETKNxPKnv98XPDVijYC4PvYoMbheV8kE2LEWApbDdEoa5GCFGR7eolZ7d5KSo-4ZQHM3jndhi1i51TQWi63rAf0zR5GxHBPzYP/s16000/orgEOfc.jpg)

# 結語

總之，隨著 Rev 2.1 的完成，ErgoSNM 總算是有點階段性的成果，接下來會再想辦法慢慢地改善它。

# 相關網站

- [ErgoSNM GitHub repo](https://github.com/siderakb/ergo-snm-keyboard)
- [ErgoSNM 文件](https://siderakb.github.io/docs/category/ergosnm)
- [ErgoSNM YouTube 播放清單](https://youtube.com/playlist?list=PL1kBTdTo-vGbdUH9_YovZvkGXuNMB03fa)
- [我的 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [QMK 官網](https://qmk.fm/)
