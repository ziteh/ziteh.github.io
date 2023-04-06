---
title: '[自製QMK鍵盤-3] 編譯並燒錄QMK'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
series: ["自製QMK鍵盤"]
date: 2020-06-21 16:33:00
comment: true
toc: true
draft: false
aliases: ["/2020/06/diyqmkkeyboard-3/"]
---
# 前言

在上一篇文章([\[自製QMK鍵盤-2\] 手動編輯QMK韌體原始檔](/2020/06/diyqmkkeyboard-2/))時，我們已經有了編輯好的 QMK 韌體原始檔，接下來就可以準備進行編譯和燒錄。

編譯和燒錄的步驟對於不熟悉軟體和開發板的人可能會覺得複雜甚至是害怕，但是其實沒有這麼困難，只要小心地確認好每一步、好好地照著做，相信這是很容易的。

<!--more-->

# 編譯

## 建構環境

首先要建構環境（Environment），這部分可以參考 [QMK 的官方文件](https://docs.qmk.fm/#/newbs_getting_started)。以下就以最簡單的方式示範。

1. 下載並執行 [QMK MSYS](https://msys.qmk.fm/) 工具。
2. 在 QMK MSYS 中輸入並執行指令 `qmk setup` 指令。

## 開始編譯

當你建立好 QMK 的環境後，就可以正式開始編譯了。以下教學以 Windows 系統為範例，Mac 和 Linux 的話還請另請高人。（不過會用 Linux 的人應該也不用看我的教學吧？）

首先，複製你在上一篇文章中準備好的 QMK 韌體原始檔資料夾 `\qmk_firmware\keyboards\` 底下的 `kb` 資料夾，並把它貼到你的環境底下的 `keyboards` 資料夾中（參考路徑： `C:\Users\USERNAME\qmk_firmware\keyboards\`）。

![▲ 大概像這樣。](https://1.bp.blogspot.com/-R-JnAk6dbbc/Xu8SJ6OKXeI/AAAAAAAAChE/KAmscT04GTE5o9w_K9TQgx1eQid8Tt94gCK4BGAsYHg/s850/kb%25E8%25B3%2587%25E6%2596%2599%25E5%25A4%25BE.jpg)

接著打開你的 QMK MSYS 輸入並執行指令：`qmk compile -kb kb -km default`。

指令中`-kb`後面代表了你要編譯的鍵盤名稱，這裡是 `kb`；`-km` 後面則是要編譯的鍵映射（Keymap），這裡是 `defaule`。

如果有問題的話會顯示問題出在哪裡。如果都沒問題的話，應該會看到一整排的 `[OK]`，並且會告訴你編譯好的 `.hex` 檔儲存的路徑（參考路徑：`C:\Users\USERNAME\qmk_firmware\.build\kb_defaulf.hex`）。

![▲ 編譯完成並顯示編譯好的檔案。](https://1.bp.blogspot.com/-hENkr6oUTL4/Xu8SKl2cmPI/AAAAAAAAChM/o6l8dhizAMIrAk5i4xCmnjFTJ_iXLlPQQCK4BGAsYHg/s754/MSYS2-02.png)

有了這個 `.hex`（或 `.bin`）檔就可以進行燒錄了。

# 燒錄

## 準備軟體

燒錄韌體前要先安裝好用來燒錄的軟體。QMK 有個官方的燒錄工具：[QMK Toolbox](https://github.com/qmk/qmk_toolbox/releases)，一般情況下你可以先試試看使用它進行燒錄。但是如果你和我一樣是使用 Pro Micro 開發板的話，我會建議你使用 [AVRDUDESS](https://blog.zakkemble.net/avrdudess-a-gui-for-avrdude/) 來進行燒錄。

以下為將示範使用 AVRDUDESS 進行燒錄，如果想要使用 QMK Toolbox 或 CLI 的話可以參考 QMK 的官方指南：[Flashing Your Keyboard](https://docs.qmk.fm/#/newbs_flashing)。

然後也別忘了安裝 QMK 的驅動程式，通常如果你是用 QMK Toolbox 的話它會問你要不要安裝。如果你不是用 QMK Toolbox 或想另外安裝的話，你可以從它們的 [GitHub](https://github.com/qmk/qmk_driver_installer/releases) 下載。我自己是使用該網頁中「qmk_driver_installer.zip」裡的「install_all_drivers.bat」進行驅動程式的安裝。

## DFU（Bootloader）模式

再來要確認好你使用的晶片或開發板要如何進入所謂的 DFU（或 Bootloader）模式，不同的板子和晶片可能會有所不同，通常都是透過短接 RST（Reset）和 GND 接腳。

以我的 Pro Micro 來說，進入 DFU 模式要快速地短接 RST 和 GND 接腳**2次**，然後它在 8 秒內會是Bootloader 模式。關於 Pro Micro 的 Bootloader 相關說明可以看官方說明：[SparkFun Pro Micro: Reset to Bootloader](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide/troubleshooting-and-faq#ts-reset)。

為了方便作業，建議各位可以裝個按鈕或開關之類的，當然如果你眼明手快也是可以用金屬鑷子之類的來短接。

![▲ 建議裝個開關在RST和GND腳上。](https://1.bp.blogspot.com/-TKceHU3vb0s/Xu8SKzMqdII/AAAAAAAAChQ/xfBuaKSsOGguZcPwDfjP_43mBYOBhM-cgCK4BGAsYHg/s2796/DSC_0036.JPG)

## 進行燒錄

接下來請打開「裝置管理員」（你可以透過在左下角、工具列上的 Windows 標誌的開始鍵上按滑鼠右鍵來打開選單並打開它），裝置管理員內會列出目前連接到此電腦上的裝置。

打開 AVRDUDESS，並跟隨以下步驟：

1. 在上方的「Programmer」選單中選擇「Ateml AppNote AVR109 BootLoader」。
2. 在下面的「Flash」中選擇點擊文字框右邊的「...」按鈕來選擇剛剛你編譯好的.hex（或.bin）檔案（如示範為 `kb_defaulf.hex`）。
3. 在右上方的「MCU」選單中選擇「ATmega32U4」（或者你的晶片型號。Pro Micro 請和我一樣選 ATmega32U4）。
4. 將你的開發板（如 Pro Micro）透過 USB 線接上電腦。這時「裝置管理員」應該會有反應。
5. 讓你的開發板進入 DFU 模式（例如 Pro Micro 是快速短接 RST 和 GND 腳 2 次）。
6. 這時「裝置管理員」應該也會有反應，並請特別注意「裝置管理員」中的「連接埠 (COM和LPT)」項目，開發板進入 DFU 模式後這裡會出現一個新的裝置，並在後面會標示其 COM-Port 名稱（如 COM10）。
7. 回到「Programmer」，在其中的「Port」選單裡選擇剛剛看到的 COM-Port 名稱（如 COM10）。
8. 按下「Program!」，下方的指令列會開始燒錄。
9. 等待它燒錄完成。

![▲ 設定好的AVRDUDESS大概是這樣。](https://1.bp.blogspot.com/-h_kR_cbyiI0/Xu8SLCaQHQI/AAAAAAAAChU/KdGDqoghBnArI9ZTjw6yywYsBMCE1ZDmgCK4BGAsYHg/s646/AVRDUDESS-01.jpg)

**請注意！** 因為 Pro Micro 的 DFU 模式只會持續 8 秒，所以在上述的步驟 5 進入 DFU 模式後，接下來的步驟 6～8 必須要在這 8 秒內完成，否則失敗。

但是同一個裝置的 COM-Port 名稱通常會一樣，所以你可以先進入一次 DFU 模式記下 COM-Port 名稱並先將 COM-Port 名稱填入 AVRDUDESS 中，然後再次進入 DFU 模式並直接按下「Program!」進行燒錄。 

如果成功燒錄的話應該會看到類似這樣的畫面。如果失敗的話就多試幾次吧。

![▲ 燒錄成功。](https://1.bp.blogspot.com/-EgrFqZ05qvc/Xu8SLcnbmzI/AAAAAAAAChY/SjQG8nQdpNcxa4owlwivtJB_0QvFQ964QCK4BGAsYHg/s960/AVRDUDESS-02.png)

如果出現以下這種畫面的話，你的開發板可能並沒有進入 DFU 模式，或是 COM-Port 選錯等錯誤，請再試試。

![▲ 出現此畫面，可能代表沒有成功進入DFU模式，或是COM-Port選錯。](https://1.bp.blogspot.com/-nBbABHCw-8w/Xu8SLuGSqfI/AAAAAAAAChc/th4vpoYxMjk3BIKszo7_oTko6pY1ADJOQCK4BGAsYHg/s960/AVRDUDESS-03.png)

燒錄過程示範影片：

<center><iframe width="800" height="450" src="https://www.youtube.com/embed/_KihNT558II" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

# 測試

這時你可以拔掉連接開發板的 USB 線，等待「裝置管理員」更新畫面後再次接上 USB，如果這時「裝置管理員」也有反應的話，且「鍵盤」的地方有新的裝置出現（如 HID Keyboard Device），代表你的開發板有被正確識別為鍵盤，也就是成功了。

如果你在燒錄時有出現成功燒錄的畫面，但是電腦卻沒有正確地辨識出你的開發板的話，請在此確定你的QMK韌體原始檔的內容有沒有錯誤（尤其是 `rules.mk` 中選擇 Bootloader 的部分）。

接下來你就可以透過將設定好的鍵盤掃描矩陣的行列腳位短接或接上開關按鈕，來測試鍵盤是否正常運作。測試時可以使用類似[這樣的鍵盤測試工具](http://en.key-test.ru/)。

# 結語

如果到這一步都很成功的話那就恭喜了，因為你現在應該已經有一個可以當作鍵盤的開發板。接下來的硬體接線會簡單許多。不過我還想在 QMK 中加入一些其它的功能。

接下來請繼續觀看下一篇文章：[\[自製QMK鍵盤-4\] 瞭解QMK的基本架構與運作](/2020/06/diyqmkkeyboard-4/)。

# 相關文章與資源

* 參考資料
	* [\[2020\] 新版 QMK 教學](https://ergotaiwan.tw/install-qmk-tutorials-2020/)
	* [SparkFun Pro Micro: Reset to Bootloader](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide/troubleshooting-and-faq#ts-reset)
	* [Trouble flashing QMK - No device present](https://www.keebtalk.com/t/trouble-flashing-qmk-no-device-present/5871/21)
	* [Installing an Arduino Bootloader](https://learn.sparkfun.com/tutorials/installing-an-arduino-bootloader) 
	* [Replace Pro Micro bootloader with QMK DFU](https://www.reddit.com/r/olkb/comments/8sxgzb/replace_pro_micro_bootloader_with_qmk_dfu/)
* QMK相關
	* [QMK官方網站](https://qmk.fm/)
	* [QMK官方說明文件](https://docs.qmk.fm/#/)
	* [QMK的GitHub](https://github.com/qmk/qmk_firmware)
