---
title: '[自製QMK鍵盤-5] KiCAD鍵盤PCB繪製教學 (上)'
subtitle: 'KiCAD PCB 電路板 Schematic 基礎教學'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK
categories: ["自製QMK鍵盤"]
date: 2023-04-27 22:17:00+08:00
comments: true
toc: true
draft: false
# aliases: []
---

到[上一篇文章](/posts/diyqmkkeyboard-3/)為止我們已經完成了鍵盤的韌體部分，接下來要進行硬體的部分。本篇要介紹的是[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)的第 5 步——繪製 PCB。

我將示範以 KiCad 7 進行機械式鍵盤的 PCB Layout，包含基本的 KiCad 使用教學。要畫 PCB 可能多少需要一些基本電學或基礎電路學知識，但是如果你真的沒學過的話也沒關係，仔細照著本文應該也不會出錯。

<!--more-->

另有影片教學可以供參考：

<iframe width="560" height="315" src="https://www.youtube.com/embed/DOluUYmqIs4?si=y68SmS6Z4g1ycMCW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

> 以下內容以 KiCad `v7.0.2` 作為示範。

<!--more-->

# 鍵盤 PCB

一個鍵盤的 PCB 上基本會有這些部分：
- 鍵盤矩陣掃描電路
- 微控制器電路
- 電源供應電路
- USB

其中較複雜的是微控制器電路與 USB 的部分，微控制器週邊會有許多外圍電路（如去藕電容），且腳位小又密集，較難佈線；而 USB 訊號是差分訊號，佈線時需要注意符合差分對設計與阻抗控制（阻抗匹配）。

還好市面上有許多開發板（如 Pro Micro），這些開發板通常都已經把電源供應、微控制器與 USB 電路都做好了，所以我們可以只要設計鍵盤矩陣掃描電路即可。

# PCB 繪製流程

使用 KiCad 進行 PCB Layout 通常會遵循以下流程：

1. 建立專案
2. 編輯 Schematic 電路圖（原理圖）
    - 擺放所需的零件，並接線
    - 指定各零件的數值（如電阻阻值）
    - 指定各零件的 Footprint
3. 編輯 PCB
    - 將各零件擺放到實際的位置
    - 佈線
    - 繪製 PCB 外框邊緣
4. 進行 Design rule check（DRC）
5. 輸出生產所需的檔案（Gerber 檔）

> *Footprint* 指的是一個電子元件物理上的實際樣子，包含了 Pin 腳的數量、位置及大小等。例如同樣是機械鍵軸，有分 Cherry MX、Alps、Kailh Choc 等不同的樣式，或是電阻有 THT 分插板型或 SMD 表面黏貼型的，而 SMD 型又會根據尺寸分為 0805、0603、0402...等。
> 不同 Footprint 的 Pin 腳位置（焊孔或焊盤）及大小不同，用錯 Footprint 的話到時候零件可是沒辦法裝上去的。

# 自動生成鍵盤 PCB

[Keyboard PCB Builder](https://kb.xyz.is/) 是一個自動工具，只要複製貼上 Keyboard Layout Editor 的 [raw data](/posts/diyqmkkeyboard-1/)，就可以幫你生成基本的 KiCad 專案。

將下載的 `.zip` 檔解壓縮，使用 KiCad 開啓 `keyboard.pro` 即可開啓專案。自動生成的專案檔包含了已經畫好鍵盤矩陣的 Schematic、擺好位置的 PCB 設計及各種鍵軸的 Footprint 庫。微控制器與其它部分還是必須要自己手動繪製。

本文不使用其自動生成的專案，這裡僅做簡單的介紹。

![自動生成的專案內容](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6f33nsFQt0034iy9rPNKpGa-CDNIwb4PQo5pJVjrq7vfzv0-EG2U5ezd0RDt1KUggojOaU6yKHeOVfusjAwgGjbgmsm37kvwAdrj32qLdWxlCDL6y_I3_tg9dlD1xrUg8HzNUHzae32V6Wct1cE_6inY2DP-ztdDCRunIy3pH0lY_PfZo2c90j7KL/s16000/auto-pro.jpg)

![自動生成的 Schematic 電路圖，有鍵矩陣電路](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQO1IDJhrfPwzxngBGlAll5epAX7wwqyxB9s2Yn4pYRQAXT1yb1AHYTnHCTUT3Pr-AeJKvgv5o_kvFylZLASi1mV0RtrrlHX1UpEg_I_KjeQNNxQMNh6cFMVxJNuHKKHtXKYqjOHzbd4ms9VmB2ZU-cf8ImEoxGzS1bCisXi-zKr1hKqy6FP5qQyB1/s16000/auto-sch-1.jpg)

![自動生成的 PCB 設計，已經擺好按鍵位置](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDs57r0P5KuqEnKYacpdejxTiyw20_zHDdrL7to4rFYjQZO28qd9VTpFs6BSRA9r23DJ-4-aFXyGhEb29wDdVmYF5Mmc94xITawBGiscwmwo-a4I69JthKyYnCMyyDdH8WaD_td__TzRtBHuMwuYuyNFTNrYczFiDnK49tBtHoW3MGG6uW36T9Xncy/s16000/auto-layer-1.jpg)

# 安裝 KiCad

我喜歡用的 PCB Layout 工具是 [KiCad EDA](https://www.kicad.org/)，這是一款開源且跨平臺的 PCB 繪製軟體，算是現今開源界最熱門、社群最龐大的一個。有很多開源的鍵盤或其它電路專案都使用 KiCad。在[此頁面](https://www.kicad.org/download/)下載 KiCad。

目前最新的版本是 `7.0.2`，但是 `7.x.x` 是最近才更新的，可能有些插件還沒更新並支援新版，如果有這種情況的話建議先使用 `6.0.8` 版。本文是以 `7.0.2` 做示範。

> 要用較舊版本的 KiCad `6.0.8` 可以到[這個頁面](https://downloads.kicad.org/kicad/windows/explore/stable)或 [GitHub](https://github.com/KiCad/kicad-source-mirror/releases/tag/6.0.8) 中，下載 ` kicad-6.0.8-x86_64.exe`。

# KiCad 基礎教學

首先要學會 KiCad 的基本用法。

## 建立專案

開啓安裝好的 KiCad。按下左上角的建立新專案按鈕。

![新增專案](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgCJHt3BFDyYtQA_m3O7Zmh8YXfDY-UQnmJW3pqnoXJe9EMpw0B4m-n9k0UVcVkk_gbOBwepEygpyxD1TrRGWYA_gzHDKY5LFX7WBzp-UQzzQ8he_s82i-VHbcyl8JETN4kdHxjmmWbQmQhDpo3EF8VuhBY-DGD64E-Q-ZcktxTgE8sla-eSpQslZzI/s16000/kicad-new-project.jpg)

選擇要存放專案的位置，並輸入專案名稱。預設會自動新增與專案同名的資料夾（可以從右下取消自動新增資料夾）。

![選擇存放位置並輸入專案名稱](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQl-gVTMGssXj-MS6nEnDMsaqTa3L6WKrm4Af6SqXc889ZmKZHX5FXk0eF0HjAREZ2dEAPumqgNn2opUSJfTzwajZbko1Qo7W2Hqu7kcuwViHeYl2wZtXqcMUB71gM6_8ffDLLq4bKkGGGUaR1Hc5rL-Df0IrW8s_8gn3h86AKq-cBsPw1Wu1aUKCO/s16000/kicad-new-project-path.jpg)

建立完專案後會出現 3 個檔案：
- `<project_name>.kicad_pro`：專案檔
- `<project_name>.kicad_sch`：Schematic 電路圖
- `<project_name>.kicad_pcb`：PCB 設計檔

![建立完成後的專案](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTXl3xKteDvpQCF2l_7ZGQ8jOHqVFqeFzzZuA4ktyaSKSOU6JugiBoGXdwB_Xnft5pkqNV6K9-HQS0P8on0CMJD_58pQyH5ac2LHbRJFxq1QV5e3vEMtdmb-bSp9kKq6bQ7yBeJSxeKTL8FeqJW44dqrVIt3w8XPYIfanqteQ2mDiMnFibhNN6FVnC/s16000/kicad-project-overview.jpg)

## 安裝 Footprint 庫

KiCad 內建的 Footprint 庫沒有機械鍵軸的 Footprint，因此我們要加入第三方的 Footprint 庫（或自己畫）。

GitHub 上有許多人畫好的機械軸 Footprint 庫，你可以選幾個喜歡的來用

- [ebastler/marbastlib](https://github.com/ebastler/marbastlib)
- [daprice/keyswitches.pretty](https://github.com/daprice/keyswitches.pretty)
- [ai03-2725/MX_Alps_Hybrid](https://github.com/ai03-2725/MX_Alps_Hybrid)
- [perigoso/keyswitch-kicad-library](https://github.com/perigoso/keyswitch-kicad-library)
- [keebio/Keebio-Parts.pretty](https://github.com/keebio/Keebio-Parts.pretty)
- [egladman/keebs.pretty](https://github.com/egladman/keebs.pretty)
- [ziteh/key-switches.pretty](https://github.com/ziteh/key-switches.pretty)（我畫的鍵軸庫，我自己做的鍵盤都是用這個）

有些 Footprint 庫支援 KiCad 的插件管理器 Plugin and Content Manager（PCM），有些則是要手動下載並指定路徑。

[ebastler/marbastlib](https://github.com/ebastler/marbastlib) 就支援 PCM 安裝。只要在 KiCad 主頁面（專案頁面）打開 PCM 頁面並按下「Manage」按鈕，在新跳出的「Manage Repositories」頁面中新增其網址 `https://raw.githubusercontent.com/ebastler/ebastler-KiCAD-repository/main/repository.json`，隨後就可以在 PCM 頁面上面的下拉式選單中選擇「ebastler KiCad repository」，並選擇「Libraries」標籤頁安裝「marbastlib」。點擊「Install」按鈕後要記得按「Apply Pending Changes」才會真正進行安裝。

![安裝支援 PCM 的 Footprint 庫](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrUe8pueoiShS4VwATcXwk7kRQXP28RwXFmD37E_3AK7zLT4OH84IMdQU_qQSFXkDxMavFTo5WfGRcgb9yIdORsA7XLTA5Yv1tvlie6wpoN-d-7mAJ3CK28OCfMGM8_oI7Xi4OkZ8KgJNoT_xNVsbobPQpjMPIJ-KkgWKXPeVlpbCMnPXGBU64FXV6/s16000/PCM.jpg)

而我自己畫的 [ziteh/key-switches.pretty](https://github.com/ziteh/key-switches.pretty) 必須要手動下載並自己新增。透過 KiCad 主頁面（專案頁面）上方工具列的「Preferences > Manager Footprint Libraries」開啓 Footprint 庫管理頁面，標籤頁可以選擇全域的「Global Libraries」或專屬於專案的「Project Specific Libraries」，透過左下的資料夾圖樣按鈕選擇下載下來的 Footprint 庫資料夾位置即可。

對於手動增加的 Footprint 庫，如果想要以專案專屬的方式安裝（Project Specific Libraries），可以將其資料夾放到專案資料夾中，再到管理頁面新增，它應該會自動套用變數路徑，如：`${KIPRJMOD}/my-footprint.pertty`。如果你預計使用 Git，也可以用 Git submodule 管理這些 Footprint 庫。

![手動新增專案專屬的 Footprint 庫](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYluZZe-b_2p8iOgo5Cvuq6Z9w5GQV1Go_TTBxwO9y4ez_eT9GSui2ylGi-4jhwtvMyAHLA93ptdq9ISJDKP5kv5ou7tzAhCi9kLwqnUvPubazJ0-BIr5BMVpJv1nFEW0oK_WyQTMPj6R_Bkmdu2--RXmp1yRMFcndTgUWh3IgLswKB3GC7APgGyDf/s16000/pertty.jpg)

## 編輯 Schematic

> Schematic 常見翻譯為原理圖，雖然我自己不是很習慣這個名稱。

在專案頁面中雙擊 `.kicad_sch` 以打開 Schematic。現在是全空的狀態。

![Schematic 編輯器畫面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBSDN4vIVVSVpIrhMM6qxHf8W0Eo6oGkjVVToL8muzQ-52W9HgtxNB3gZNpBC7l0fyYakom80bhZBN3CMXU8EicBLRqh8Hhm6yOBY0zfP1-rhK2YO28cFEfCplY_WrUWlHmU3OUPG2-dOIKeY8OEwYlVPfzIRiINDpexeXgs0LZojO31MWP2njQfz/s16000/sch-empty.jpg)

### 加入元件符號

在右排工具列偏上處有一個「Add a symbol」按鈕（或快捷鍵 `A`），按下後會出現元件符號（symbol）選擇視窗。在上方的搜尋欄鍵入「R」，並在中間的清單中找到電阻的符號（應該位於 Deveice 底下），然後將其擺放到畫面上。按一下 `ESC` 退出擺放符號，返回選取模式。

![使用「Add a symbol」按鈕加入元件到頁面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-y4sWQTuxyPlHzWYqsyWbX8KYka7qUZwzhK3yqhwKsHUCt-wk-fiKrDU582kkFQ6REkua0NYsYx8St6UgDlbfPIKdzCH4-aRvEbD9dtEz-w4-N4Kbbx5UFaRVs2bA7jO3dgAk5h59pYoZubnudQwsZfqoGDXmSaT-3ji6YABHwhaNzUVeP_BdTVoQ/w253-h320/sch-add-symbol.jpg)

![在元件符號選擇畫面搜尋並選擇所需的元件](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuE8OZzNE5ub-dElZ_mKzNNrnxMGIat0CfM42KKHzCHYM8DvIU-CfdDdLs0edV1Avt8L4Spjjk50NYanz8QnreZVEY-dDN35jZvzsk9qDi0qT68CJaZi4gDp7tuep6dQOqs5DuwmDlxG4TyD89cHa9Yowow_-Wm-QzjHPkqN1KkuCUTxI8bT0ena9z/s16000/sch-symbol-choose.jpg)

選擇元件符號可以按 `R` 旋轉。雙擊則可以進入其屬性設定頁面。

將滑鼠遊標移動到符號的接腳端點上會出現接線的提示，按一下後就會開始接線，過程中單擊會在該處清楚轉角，接線到另一個接腳端點、線會自動結束接線，在空白處雙擊會強制結束。若要手動新增走線，可以在右排工具列選擇，或使用快捷鍵 `W`。

![點擊元件接腳或使用快捷鍵 W 可以繪製接線](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXICAV-tpFs_UXIRABbyXMN31oro-62sozsOC9CmSycmgiDDJ_cvXNlhPsdmRbGEgcKO51lH_qfTvjEaD9ucFzFR1cFEEBw-ucskOWdAfT9l8VBnYF0SuPgDwbvzBg-2HzGFArSKoVtJEBN7sRssx9EvueDkdSXb3AIrHFRfDsUAxRkRfIDao8pvGd/s16000/sch-wire.jpg)

在右側工具列加入元件符號的按鈕下面還有一個「Add a power symbol」的按鈕（快捷鍵 `P`），使用它可以加入電源符號。

### 子頁面

若電路較複雜，一頁不夠畫的話，可以使用階層式頁面（Hierarchical sheet）。

在右排工具列中央處有一個「Add a hierarchical sheet」按鈕（或快捷鍵 `S`），按下後可以在頁面上繪製一個方塊以代表子頁面，隨後可以設定其名稱。雙擊此方塊即可進入子頁面。你可以按快捷鍵 `Ctrl`+`H` 開啓階層式頁面導覽，以方便在各個頁面間切換。

![透過「Add a hierarchical sheet」按鈕新增階層式頁面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRFzFyr8iuNc5jVk8t_l3IoxUUFtvwnk392R4Tm758aJfYhkJTYb8SYYyjkmArA_vLHGGU16KqwTyGg_NSc3o9r5l3ixXknU_SrydgRedc5w_p2Pz_ce2esNIJ7aOiyNveInZkdPQW0SR2FOHXnoSclWdkgcYkZD_0Gvwdy6oNIHIxR2qnbQeTOBsG/s16000/sch-add-hierarchical-sheet.jpg)

![設定子頁面的名稱](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWPOlxWil726eynU3e5KddoNV1NdpsrpjHfA0VDFrd6jx8Z7AvB5wj7DvDaNx4w2iuqzIs1sbB5uiCgAe6ZDdxt_HqwR9RghgmTgecGen8BMtmVV4o6ROKpCCLR_0JzOSl_w5FPUeJJizJO4i6AqHDLWRI5taAsI3x0L3-OIG4sosJ4wgFjVi-wEar/s16000/sch-hierarchical-sheet-name.jpg)

### 標籤

在右排工具列中央處選擇「Add a global label」（或快捷鍵 `Ctrl`+`L`）可以新增全域標籤。這個全域標籤可以跨頁面連接走線，只要是名稱相同的標籤就會視為連接在一起。善於全域標籤可以讓你的 Schematic 不會充滿一堆凌亂的走線。

![用「Add a global label」按鈕加入全域標籤](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1bGF8PQQNGApgEIkDOkeTXLrdcC8mxZ4uGNAzVplSn9fCBltVw2GxDcnRSeElgKWUshjXtNyqCGb78YHjY2Zb9f3zyEoWkidkTXwog1PnWtF_npVhgkNI7Wlm6sVfHf6DuHacSS668gpyUV24ZQHbTw6FNpcB8VDRTt3-JibDpkkF-ATN9DbpTieQ/s16000/sch-add-global%20label.jpg)

除了全域標籤，還有一種網路標籤（Net label），透過右側工具列的「Add a net label」或快捷鍵 `L` 來新增網路標籤。網路標籤和全域標籤的功能一樣，相同名稱的標籤會連接在一起，只是網路標籤的作用域是局部的，僅在目前的單一頁面中有效，要跨頁面連接的話要用全域標籤，或使用階層式標籤（hierarchical label）。

### Footprint

指定各個元件的 Footprint。元件的 Footprint 可以透過雙擊該元件開啓屬性設定頁面來調整，也可以按上方工具列的「Bulk-edit fields of all symbols in schematic」按鈕開啓「Symbol Fields Table」頁面來修改。

![「Bulk-edit fields of all symbols in schematic」按鈕](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFFfazVfv28XmOf69Rapnop9P6vpB3P4h7NvJfjmxXrlH_mB7QGpg2u1Qc64WCefdf1i58rtZNCvQ6ba6xZphL-Lz-VAXyJX5zUD-rdz_XKP8MTL4qKgjqrRrUPfvdvDdxgbFb1ZBS16v3eDpkn_OeolKog0XAqUTPWOkmp4URju0IvQCgl76y1ezz/s16000/sch-bom-edit.jpg)

點擊元件「Footprint」欄位右側的「三本書符號」以開啓 Footprint 庫瀏覽頁面。

![選擇指定元件的 Footprint 欄位](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoCrzMXn_9_tKBotsgHycppvmi1FFeRlA_J78tqmhogQbyNk6Kx0MVdNzAVpiMEpwlm7MepJ4mhNJ3wbxuhUb9S0NS_deArZEmcpYMGCiarBWo1nOKqL8jB53mshM7_mYj8NhfSOLSHAt7kCGcL4penHgTrpa1gGVNj-DbaIQYtzCNf-UFkfl9lzgY/s16000/sch-bom-edit-footprint.jpg)

Footprint 瀏覽頁面左側有兩個清單，在最左側的清單找種類，例如表面黏貼型的電容是「Capacitor_SMD」，點選後在右側的清單選擇要的 Footprint，例如常用的 0402 電容是「C_0402_1005Metric」。

![選擇 Footprint 「C_0402_1005Metric」](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgvIHRSRcwEE2XYdea3Po6E-VpXZyKytA4y855pHioiGVmdC5AOJcm5iG6gQ6dy1JYi3HJCJM9jJtHDJcIWPraROaC_EAp0nWNqJCOVF5zyynKF0OuTk9zSeMFGD-fmFOzrPPPfWGEpNW3MDbDYHsQzYDjadGgH_DgbA8qf13TuswFQvyv9BqwaJ1b/s16000/sch-footprint-as.jpg)

至於要怎麼選擇 Footprint？這個牽涉到許多因素，首先是該零件要有，例如 RT9013-33GB 的封裝就是 SOT-23-5，那當然是選用「Package_TO_SOT_SMD:SOT-23-5」。但是像電容或電阻選擇就很多了，這時可以考慮焊接方式，要手工焊接的話，除非你手很穩（或有其它工具）可以焊 0201 尺寸的元件，不然通常會選 0805、0603 或 0402 的，同時你也可以考慮購買容易度；如果你打算使用 PCBA 的話，那可以考慮工廠那邊的報價。當然，封裝也和元件的功率和耐壓等電氣規格有關，但鍵盤的電路比較不需要擔心這點。

> 一般說的 0603、0402 或 0201 封裝是英制尺寸，0603 就代表其尺寸長寬為 0.06 * 0.03 inch。但是還有公制（Metric）表示法，公制 0603 代表的是長寬 0.6 * 0.3 mm。而英制 0402 等於公制 1005；英制 0201 等於公制 0603，所以一定不要搞混了。
> KiCad 中的「C_0402_1005Metric」前面的「0402」是指英制尺寸，後面的「1005Metric」是指公制尺寸。所以這個 Footprint 就是我們一般習慣稱呼的 0402 封裝。

### 更新元件代號

這裡的元件代號是指「Reference designator」，即 `U1`、`R1`、`R10` 或 `C6` 這種，這些代號是方便人員在焊接時知道這是什麼零件，其名稱其實沒有很強制的規定。這一步通常最後再做。

在上方工具列的「Fill in schematic symbol reference designators」按鈕，開啓「Annotate Schematic」頁面。你可以先用左下角的「Clear Annotation」清除目前的代號，再用右下角的「Annotate」自動更新代號。

![「Fill in schematic symbol reference designators」按鈕](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9ox8uie8cK99P7-Bh4J-L3JAF1tjoX4h27ZM9vs64lVEkFYQ7BfkWR7eJEd1-JX2q4aons3v14yiU3O2gRpCYA9YLLxrQEEqLC25dnE8nYALdbjwNF6sq43djmQxvrKfIdrscjdU_4w2SW0Q60s3xSycRbWzdw3W-6-qhXMeJb-in21-K2nuoQzTP/s16000/sch-ref-1.jpg)

![「Annotate Schematic」頁面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2D3I_ShbIWDJxDQEVcnQdX8QPBovSH4F5FfOHxl_wN2d-sm9IjEw9r5kmD1P0Sk8F7hTjJeSvcHyCAgU-dRQ525kuws6IZi_hgU8LJ2rCkeV1ahqmbdinO_WS87FHjJdncZEuucT3_3V_ZjXeXC-4Mg1Fi6eWGYyv1kags31J1B306eLMW4zoh7pf/s16000/sch-ref-2.jpg)

### 零件型號

如果你要使用 JLCPCB 的 PCBA（PCB 組裝。除了生產 PCB 外，一併把零件焊接完成）服務的話，可以在「Symbol Fields Table」（上方工具列的「Bulk-edit fields of all symbols in schematic」按鈕）中新增欄位「LCSC」，並在內填入 JLCPCB 的零件編號，例如 RP2040 是 C2040、W25Q128JVS 是 C97521。

![增加「LCSC」欄位並填入各零件的編號](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAa35I5IbRaoNKn_kVqRN5cdSyDXW1fOY-Llr_JWbS8qoP4_JXBA2XCx_juLtAQKCJqHXOI3xCVekfj4s0iMw6V-qwaRTEKlNob1teo50B_fOST1FZ-LF3VVqU855RnTAmAis9LG-ple6c-yPfwXN4N-YNN3a-MqJVfDLvo59bLJRewfYiTVUeDxzf/s16000/sch-lcsc.jpg)

### 頁面資訊

Schematic 頁面右下角有一些資訊可以填寫。

要修改這些資訊的話，可以到上方工具列「File > Page Settings」中設定。

![修改 Schemaric 頁面資訊](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQHk-tCHUI6E6gXu6u-VKa2m73Hhxq5VxTAe1ewnlxTPhDSUmSp7vA4eJfMjOWgCRYWsH1JEh9_NkIayxTYUaeRYDF0ounPrMbxwjBKLtPxCumCbl-ybjw-h9CVOoKR605GbaC82WvKPapV2AO9hAbMaDvcRY-rfBGMzhtUpUGIKdhaXdFv1bM180M/s16000/page-settings.jpg)


# 開始繪製鍵盤

開始正式繪製鍵盤的 Schematic。首先要完成各個部分的元件接線。

## 使用開發板

如果你覺得要自己畫[微控制器](/posts/diyqmkkeyboard-pcb-layout-sch/#繪製微控制器電路)、[電源](/posts/diyqmkkeyboard-pcb-layout-sch/#繪製電源電路)和 [USB](/posts/diyqmkkeyboard-pcb-layout-sch/#繪製-usb) 的電路太麻煩的話，你可以使用現成的開發板，使用排針或排插連接開發板，這樣就只需要畫[鍵矩陣掃描電路](/posts/diyqmkkeyboard-pcb-layout-sch/#繪製矩陣掃描電路)。以下以 Pro Micro 為例。

加入兩個「Conn_01x12」元件來代表排針/插，雙擊它進入屬性頁面，將它的「Footprint」改成「Connector_PinHeader_2.54mm:PinHeader_1x12_P2.54mm_Vertical」。

加入電源符號與標籤，並根據 Pro Micro 的腳位接到正確的位置。

![使用 Pro Micro](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjfmopmM-RL6jfbbgw69xQqYMHaqXemSIyNDt9fsk5BRSbz6Bo844xybKd_1XBD4oQxDIxosfo7WewDHWx_50HpoWvnpmDKwkn_m3-0QYeXahDOHiVpsYgD_kGDXFjVHyp5k31uDT60IQr9hnZbXw-TmgNOZ4U6-Ceno6yzMqmdLpemVzEq7KWqOu5F/s16000/promicro-pinout.jpg)

> 上圖的接腳標籤名是根據 ATmega32U4 原本的腳位名，不是板上標記的 Arduino 腳位名。

## 繪製矩陣掃描電路

鍵盤矩陣掃描電路是由數個開關（鍵軸）及二極體組成的。

為了保持整潔，我喜歡將其放在一個獨立的子頁面中。先新增一個階層式子頁面，並命名為「key-matrix」（Sheetname 與 Sheetfile 的名稱都要改）。雙擊方塊進入子頁面。

![新增「key-matrix」子頁面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOa15_1bCowe-jw0sThBPhy1HKScNgCSbzM3Pxdl9vqlK10vSq9YBykJv--pfhGIpbawNpbnGhVBqjv8qwNtpzC2SaoPjerYeD-jfdd7RDjZ42Pz4lN4vLNBNFihTzb15NSlloZRyQGdfuGW89w_J_8gepngKL9WbOiNxVQ5fHtBLUPrp2yk5_4Q2K/s16000/sch-new-key-matirx-subsheet.jpg)

加入開關與二極體的元件符號「SW_Push」和「1N4148W」。當然二極體的型號很多，不一定要用 1N4148，但這是最常見的選擇（其後綴 *W* 代表 SOD-123 封裝）。

![加入「SW_Push」元件到頁面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8v9h0Om1GTdYqD9sTwAUerfyor_2Qjmf186kaPqZlJgYdq5flloVI7VJSfuZpWoyEGwZ4oaDOXTN7BgVjdn8g3JbwDuTXf431wx51nQZjp21dY9Ng0PGOXRpAxFWYfSK5xd3W8EqPYB3MSXD6wginD8KYC9cKo0qzYX0lSrmWlH1Qij6ZvaAAdYMu/s16000/sch-add-symbol-sw.jpg)

個人會喜歡將此處代表鍵軸的元件代號改成「KEY」，雙擊開關的符號，將 Reference 的開頭由「SW」改成「KEY」。這一步有助於後續的自動擺放工具。

![將開關的代號「SW」改成「KEY」](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_asgQ8nY5OPGCRKeyPjCosZ7TD-j20AkAmPebXzqSrJSs2yWGiltSe5EJEeUaj_GDJwoC0PaPeDdaGIvhWy69ndGpsWu8Mpj2b4kuTVvATgXPlEeQqBMzNAp_OSzGawbuOSwXxTP3b3D6LvAJTisidbvK-ff7mUjEa-fxxix4vX8lHyI6YuhgSegU/s16000/sch-key.jpg)

另外，也可以在這一步選擇鍵軸的 Footprint。滑鼠移到「Footprint」的「Value」欄位右側，會出現三本書的圖案，點擊後可以[修改 Footprint](/posts/diyqmkkeyboard-pcb-layout-sch/#footprint)。

鍵軸的 Footprint 決定了最後這把鍵盤**可以使用什麼樣的機械軸**，Cherry MX、Alps、Kailh Choc 等各種機械軸的 Footprint 都不同，要選擇正確的 Footprint 才行。而如果要鍵盤可以熱插拔的話，也就必須選用有支援熱插拔座的 Footprint（不同軸體的熱插拔座也不同）。當然也有些 Footprint 同時整合並兼容了多種不同的軸體。請自行確認你所[安裝的鍵軸 Footprint 庫](/posts/diyqmkkeyboard-pcb-layout-sch/#安裝-footprint-庫)有哪些種類可以用。

以[我自己的 Footprint 庫](https://github.com/ziteh/key-switches.pretty)為例：`MX_switch_THT_hotswap_A` 是同時兼容 Cherry MX 軸體熱插拔與直接焊接的 Footprint；而 `MX_switch_PTH_hotswap_A` 只有 Cherry MX 熱插拔座的焊盤，沒有直接焊接的 PTH 焊盤；`MX_switch_hotswap_double_sided_A` 是雙面都有 Cherry MX 軸的熱插拔焊盤；`Kailh_Choc_PG1350_THT_A` 則是 Kailh Choc 矮軸直接焊接用的 Footprint。

![我自己的 Footprint 庫中有多種不同的 Footprint](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_ueLaVTGPaUM-MKQO7hDPP1pHJGXQ1mhv5XlmA8MBuWomK9TiAegrZqPXoeXnTjUgN20u7JVl8py9jgnJKyMlDxrFR_eTemduMBZesMK7hPURS9nQKfvcTRcDkWgFTBBHTaFHN5u1CYJ4etpJNOOSU_ue9EjbvftfKFGVRwPNf1vZypMso1tCJkbZ/s16000/Screenshot%202023-05-08%20at%2023-49-58%20ziteh_key-switches.pretty%20Mechanical%20keyboard%20switches%20KiCad%20footprint%20library.png)

先將開關與二極體這樣擺放，一端相連接（注意方向，二極體有方向性），再根據你的鍵盤按鍵數量複製它們。然後將其接成鍵矩陣的樣子。

![先將一組開關與二極體擺好，再複製需要的數量](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1nX3B16ELDFBNmCfU-nhakYzWRgHuNfjPL47O7jNpxfDgYQF35S6H06sZuaJFUb9qnvt344otZXIK0knjz3bsPPm95YVzR5V6GHvffNSCfedHokXP7vbNDVxXEfW9wga7cv3dJoNf1VePxWZNjEPn0A88UDzcYvbXiaiE7JVglxpcJJX25v3KM7aW/s16000/sch-sw-diode-pair.jpg)

![接成鍵矩陣掃描電路](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvak73OBN9QiLxWjWHknS3o454zC9i_1FPCQrOqcD3flJPXkT7NPfViKjgasolo7vkPGOR_V0s0CvLTYUN8X3I1jTOvlbOpc3e_eCqS7Pvu4n1Apiy9gltgQdkvCs0GPtemJ_JOPAl2UDpB4j-5D2fKnmlAjn81bCQr8-rgJ_-exg3FPjl74P8KPui/s16000/sch-key-matrix-1.jpg)

> 請注意走線的交叉處，若交叉點上有一個圓點，則代表交叉的兩條線有連接；無圓點的話就代表這兩線沒有實際連接，是跨越。要手動使交叉點連接的話可以用快捷鍵 `J`。

為鍵矩陣電路的各個 Row 和 Column 新增各自的全域標籤。

![加上全域標籤](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj0yIr0fJaCqQXdnN5sLqaSHp7yrnsp2DpACNsbB5bWvw2yxGaoMwlI6pRKm-cN7Mi8dhO8CpSACS8315D6F3MHnIu-J_CF43cYgwdxGqdbBCp3S2WrZlarglVmYfdvCHDF9_tZ2EUCrU6syHDYVIsZRnsNIZadke1yowF-ptN_-qcTI1WASjwTn4mf/s16000/Inkedsch-key-matrix-2A.jpg)

## 繪製電源電路

電源電路主要是提供穩定的電源給微控制器。現在的微控制通常使用 3.3V 或 5.0V 的電壓，而 USB 的電源電壓是 5.0V，若需要將 USB 的 5.0V 變成 3.3V 的話，就需要降壓電路。降壓電路通常有分 DC-DC（Buck converter）和 LDO（Low-dropout regulator）兩種，一般來說 DC-DC 的功率較大、效率較高，但週邊電路較複雜，因為鍵盤其實不太耗電，所以比較沒必要使用 DC-DC 電路，大家通常都會選擇用 LDO。

LDO 的型號有非常多種，其規格可能都不太一樣，且還有分可調輸出或固定輸出型。若是需要 固定輸出 3.3V 的話，我常使用的 LDO 型號為：
- [RT9013-33GB](https://www.digikey.tw/zh/products/detail/richtek-usa-inc/RT9013-33GB/2546347)：500mA，SOT-23-5（個人最常用）
- [XC6220B331MR-G](https://www.digikey.tw/zh/products/detail/torex-semiconductor-ltd/XC6220B331MR-G/2138177?s=N4IgTCBcDaIBoGEBsYwAYBCBmLBGAsgEoC0A4iALoC%2BQA)：1A，SOT-23-5
- [AMS1117-3.3](https://www.digikey.tw/zh/products/detail/umw/AMS1117-3-3/17635254)：1A，SOT-223

我自己最常用的是 RET9013-33GB，但是 KiCad 原始的元件庫內沒有它，這時你可以選擇找第三方元件庫或自己畫（[參考教學](https://www.studiopieters.nl/kicad-create-a-new-symbol/)），但最簡單的方式是找可替代的元件。XC6220B331MR 的接腳與 RT9013-33GB 相同，所以我們用它來代替 RT9013-33GB。

在主頁面加入 XC6220B331MR，雙擊它進入屬性頁面，將「Value」的值改成「RT9013-33GB」。

加入兩個無極性電容「C」，雙擊它們開啓屬性頁面，將「Value」改成「1uF」，並將其分別接到 RT9013-33GB 的「VIN」與「VOUT」腳。RT9013-33GB 的「CE（或 EN）」腳直接接到「VIN」。

增加「GND」、「+5V」與「+3V3」這三種電源符號。「+5V」接「VIN」、「+3V3」接「VOUT」、「GND」接兩個電容的另一腳與 RT9013-33GB 的「GND」。

![RT9013-33GB 電路](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibQMCqA8P9g-6L1yjVyQjpXe17q4b24mt09T21KwoxkGSQSI7jKxeyYdoGEoWXH4qBQM8wPXwxkRkRGPJkLveWiLUpl0UmHyPUaSRajFD6gtsop1XMS-_pT3hjKReJwf0Fjd7ckvRZYgcy_gcY2G0gGoqrzwMz-Uayo9DhfdA7I5NuE4n5HJu9hY6D/s16000/sch-ldo.jpg)

這樣就完成電源電路了。每種電源 IC 所需的外圍電路不同，若要使用其它型號的 IC，請記得去查看它的 Datasheet，一般都會提供參考應用電路。

## 繪製 USB

加入元件「USB_C_Receptacle_USB2.0」，這是 USB Type-C（僅 USB 2.0）的符號。

![選擇 USB 元件符號並加入到頁面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJM_J0Z0Kzsyjg__YCZnkPv66rpjZSp1xVemqBQuni34aV1FKMAwq76eRCPQHAXyvfAJsbCutUEKIlbkFdIia1X0skNpbhhrHmrtr1SaZY0b0rE3ZOMhFupSVX5_H0RuqPdZJb5hVRNcN6D6R3U56wWoewXB5-cv_-ebZP6NwypcC4p5eArjQymb7j/s16000/sch-symbol-usb-c.jpg)

USB Type-C 需要加入 CC 電阻。加入兩個電阻「R」，在屬性頁面將「Value」改成「5.1k」，並分別接到「CC1」與「CC2」腳，另一端接地（GND）。

「VBUS」是 USB 的電源腳，USB 標準電源是 5.0V，可以直接接給 LDO 用，但一般安全起見會加個自恢復保險絲。加入元件符號「Polyfuse」，並將其「Value」改成「500mA, 6V」。將其一端接「VBUS」一端接「+5V」。

USB 差分訊號「D+」與「D-」各 2 腳，將相同的接在一起，然後加入全域標籤「USB_D+」與「USB_D-」。

「GND」和「SHIELD」接地。在一些情況下，「SHIELD」和地之間可能會接一些濾波電路，但是對鍵盤來說直接接地就可以了。

「SBU1」和「SBU2」這裡用不到，可以為其加上無連接的旗標（右側工具列的「Add a no-connection flag」或快捷鍵 `Q`）。

> 如果可以的話，可以為 USB 加入 ESD 靜電保護的元件。

![USB Type-C 電路](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHLtaF4GyRFYABUeV7Lrp9TkK2KQ2B8J3pV37GB6KVS9P74TzhlSNQOyP9wdEpzRpbUEgTvRHzgtReCEMpbqDn55Bm1CaTV-k5ct0UMZ4-IXIRYx844f9vdGVoJXqCoFvfkBJpR8H15A8_nhQ3yp_-05xi2nIT2C87HwLXlEZ3t5uk2ewUfbhbE01Y/s16000/sch-usb.jpg)

## 繪製微控制器電路

微控制器電路是最複雜的部分，且每種微控制器都不同。想要知道一個微控制需要哪些週邊元件的話，最好的方式就算找現成的電路參考，ATmega32U4 可以參考 [Pro Micro 的電路](https://cdn.sparkfun.com/datasheets/Dev/Arduino/Boards/Pro_Micro_v13b.pdf)；RP2040 可以參考官方的[範例電路](https://www.raspberrypi.com/documentation/microcontrollers/rp2040.html#design-files)。為了方便起見，我也為微控制器電路新增一個名為「mcu」的子頁面。

我這裡以較複雜的 RP2040 為例。RP2040 所需的外圍元件有：
- 石英振盪器。可以使用元件「Crystal_GND24」，將數值改成「12MHz」。
- 外接 QSPI Flash。這裡使用 16MB 的 「W25Q128JVS」。Flash 也有自己的週邊電路元件。
- USB 終端串聯電阻，阻值 27Ω。
- 8 顆接到 3.3V 的去藕電容，其中一顆是「1uF」，其它是「100nF」。
- 3 顆接到 1.1V 的去藕電容，其中一顆是「1uF」，其它是「100nF」。
- 兩個開關，RESET 開關有上拉電阻。

![RP2040 週邊電路示範](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTWnrMxbb3OhXV3AmrvfdE6-ATnIpOahS6IA4Z6Qc0obPg0IWltLi7x_7CmnjWuVApdjapocij70tICZA9XR8pk8lsgaAqdA_Kj6EpTCYZEKGpu3zM46eY1nTVaUG3AHOpYQ9OZT7KWT9SA8D_M5is_flhY8YkcXulJhPMTt7KooCjqBn13S3cQTj_/s16000/test-keyboard-mcu-1.jpg)

這裡我使用網路標籤（Net label）來完成週邊電路的接線。

另外使用全域標籤將鍵矩陣接上正確的 GPIO 腳，這裡要與 QMK 韌體內的腳位設定一致。微控制器上其它沒用到的接腳可以加上無連接旗標（右側工具列的「Add a no-connection flag」或快捷鍵 `Q`）。

## 其它元件

鍵盤會需要螺絲孔，這個也要加入 Schematic 中。在元件符號庫中找到「MountingHole」或「MountingHole_Pad」，前者是無焊盤的絕緣螺絲孔，後者有焊盤，可以做接地屏蔽等用途。要幾個螺絲孔加複製幾個。

建議至少為電源「+3V3」與「GND」加上測試焊盤，未來焊接前的短路檢查會比較方便。使用元件符號「TestPoint」，並將其接到要加上測試焊盤的接線上。

![測試焊盤](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3XzabwSjq-KAEzUmmSC4x53fjTbuW_VyYEszuvdTVic2TeX3xfCLH5XgMYSbFyLQu1AOwF4lFXwNtlRldWg47vdwGMbD8JjdEifWwZPgKejKLIHad_opy-VxdkLk7cO6C2Ik2hcsPfCVlxgjShO_ABkc-o9qw1PFP_BpT8Y4AuDAsTFo9Ha5RlZYK/s16000/sch-testpotin.jpg)

如果你要加入 LED 的話，LED 預設的 Reference 是「D」，為了後續自動擺放方便，我喜歡將其改成「LD」（例如「LD1」），將 LED 和鍵矩陣電路的二極體作區隔。

## 完成

當所有部分的元件符號及接線都完成後，編輯並再次檢查各個元件的 [Footprint](/posts/diyqmkkeyboard-pcb-layout-sch/#更新元件代號)，然後[更新一下代號](/posts/diyqmkkeyboard-pcb-layout-sch/#更新元件代號)，Schematic 就算完成了。

接下來請繼續查看[下一篇](/posts/diyqmkkeyboard-pcb-layout-layers/)以完成 PCB Layou 的部分。

> 如果你想參考完整的檔案的話，可以到 GitHub 上找一些別人的 repo，例如我的 [Calcite52](https://github.com/ziteh/calcite)。
> 你或許可以用 [KiCanvas](https://kicanvas.org/) 來線上查看 KiCad 的 Schematic 檔案，例如[這樣](https://kicanvas.org/?github=https%3A%2F%2Fgithub.com%2Fziteh%2Fcalcite%2Ftree%2Fmain%2FCalcite52)。我的另一篇文章有介紹：[KiCanvas——線上預覽KiCAD電路圖](/posts/kicanvas-intro/)

# Git

如果你想為 KiCad 用 Git 的話，可以參考以下的 `.gitignore`。

```gitignore
## KiCad EDA .gitignore ##

# Temporary files
*.000
*.bak
*.bck
*.kicad_pcb-bak
*.sch-bak
*.kicad_sch-bak
*~
_autosave-*
\#auto_saved_files\#
*.tmp
*-save.pro
*-save.kicad_pcb
fp-info-cache

# Netlist files (exported from Eeschema)
*.net

# Autorouter files (exported from Pcbnew)
*.dsn
*.ses

# Exported BOM files
*.xml
*.csv

# Exported Gerber
[Gg]erber/
*.g[tb][lops]
*.gbr
*.gm1
*.drl

# Backup
*-backups/

# Exported JLCPCB tools plugin
jlcpcb/

# zykrah/kicad-kle-placer plugin
keyautoplace.log
```


# 相關網頁

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [Keyboard PCB Builder](https://kb.xyz.is/)
- [KiCad 官方文件](https://docs.kicad.org/7.0/zh/getting_started_in_kicad/getting_started_in_kicad.html)
- [KiCAD – Create a new Symbol](https://www.studiopieters.nl/kicad-create-a-new-symbol/)
- QMK相關
	- [QMK 官方網站](https://qmk.fm/)
	- [QMK 官方文件](https://docs.qmk.fm/#/)
	- [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)
