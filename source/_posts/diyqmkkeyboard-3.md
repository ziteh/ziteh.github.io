title: '[自製QMK鍵盤-3] 編譯並燒錄QMK'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
categories: []
date: 2020-06-21 16:33:00
---
# 前言

在[上一篇文章](/2020/06/diyqmkkeyboard-2/)時，我們已經有了編輯好的QMK韌體原始檔，接下來就可以準備進行編譯和燒錄。

編譯和燒錄的步驟對於不熟悉軟體和開發板的人可能會覺得複雜甚至是害怕，但是其實沒有這麼困難，只要小心地確認好每一步、好好地照著做，相信這是很容易的。

<!--more-->


# 編譯韌體

## 建構環境

編譯（Compile）韌體麻煩的地方在於要建構環境（Environment）。這個部分目前沒有捷徑，只能乖乖地照著說明去做。還好QMK官方的說明文件寫的非常清楚。

這裡推薦各位可以看[ErgoTaiwan](https://ergotaiwan.tw/)寫的[\[2020\] 新版 QMK 教學](https://ergotaiwan.tw/install-qmk-tutorials-2020/)，它將[QMK的官方指南](https://docs.qmk.fm/#/newbs_getting_started)完整地翻譯成中文了，只要照著它就可以成功。建議各位在進行環境建構時，打開上面兩篇，相互對照著看。而如果內容有出入的話，基本上就以QMK官方指南為準。過程中，Google翻譯也會是你的好幫手。

另外注意，QMK的官方指南雖然有[簡體中文版](https://docs.qmk.fm/#/zh-cn/newbs_getting_started)，但目前其內容和英文版的指南並不同，應該是舊版的教學，實作時請以英文版的為主。

## 開始編譯

當你建立好QMK的環境後，就可以正式開始編譯了。以下教學以Windows系統為範例，Mac和Linux的話還請另請高人。（不過會用Linux的人應該也不用看我的教學吧？）

首先，複製你在上一篇文章中準備好的QMK韌體原始檔資料夾\qmk_firmware\keyboards\底下的kb資料夾，並把它貼到你的環境底下的keyboards資料夾中（參考路徑：C:\Users\USERNAME\qmk_firmware\keyboards）。

![▲ 大概像這樣。](https://1.bp.blogspot.com/-R-JnAk6dbbc/Xu8SJ6OKXeI/AAAAAAAAChE/KAmscT04GTE5o9w_K9TQgx1eQid8Tt94gCK4BGAsYHg/s850/kb%25E8%25B3%2587%25E6%2596%2599%25E5%25A4%25BE.jpg)

接著打開你的MSYS2 MinGW 64-bit終端機。輸入指令：`qmk compile -kb kb -km default`，然後按下<kbd>Enter</kbd>。你可以複製該行指令，並用滑鼠右鍵（而不是<kbd>Ctrl</kbd>+<kbd>V</kbd>）在MSYS2 MinGW 64-bit裡貼上。

指令中`-kb`後面代表了你要編譯的鍵盤名稱，`-km`後面則是要編譯的鍵位佈局（Keymap）。

![▲ MSYS2 MinGW 64-bit裡鍵入編譯指令並執行。](https://1.bp.blogspot.com/-Bjr_FxhTLNg/Xu8SKcvMgtI/AAAAAAAAChI/IC2Zb9iaYvIhVl5E-YqfUGo1sjekUDk0QCK4BGAsYHg/s534/MSYS2-01.png)

如果有問題的話，MSYS2 MinGW 64-bit會顯示問題出在哪裡。如果都沒問題的話，應該會看到一整排的`[OK]`，並且會告訴你編譯好的檔案「kb_defaulf.hex」已經儲存在環境\qmk_firmware底下（參考路徑：C:\Users\USERNAME\qmk_firmware）。

![▲ 編譯完成並顯示編譯好的檔案。](https://1.bp.blogspot.com/-hENkr6oUTL4/Xu8SKl2cmPI/AAAAAAAAChM/o6l8dhizAMIrAk5i4xCmnjFTJ_iXLlPQQCK4BGAsYHg/s754/MSYS2-02.png)

有了這個.hex（或.bin）檔就可以進行燒錄了。

# 燒錄韌體

## 準備軟體

燒錄韌體前要先安裝好用來燒錄的軟體。QMK有個官方的燒錄工具：[QMK Toolbox](https://github.com/qmk/qmk_toolbox/releases)，一般情況下你可以先試試看使用它進行燒錄。但是如果你和我一樣是使用Pro Micro開發板的話，我會建議你使用[AVRDUDESS](https://blog.zakkemble.net/avrdudess-a-gui-for-avrdude/)來進行燒錄。

以下為將示範使用AVRDUDESS進行燒錄，如果想要使用QMK Toolbox或指令碼的話可以參考QMK的官方指南：[Flashing Your Keyboard](https://docs.qmk.fm/#/newbs_flashing)。

然後也別忘了安裝QMK的驅動程式，通常如果你是用QMK Toolbox的話它會問你要不要安裝。如果你不是用QMK Toolbox或想另外安裝的話，你可以從它們的[GitHub](https://github.com/qmk/qmk_driver_installer/releases)下載QMK驅動程式。我自己是使用該網頁中「qmk_driver_installer.zip」裡的「install_all_drivers.bat」進行驅動程式的安裝。

## DFU（Bootloader）模式

再來要確認好你使用的晶片或開發板要如何進入所謂的DFU（或稱Bootloader）模式，不同的板子和晶片可能會有所不同，通常都是透過短接RST（Reset）和GND接腳。

以我的Pro Micro來說，進入DFU模式要快速地短接RST和GND接腳**2次**，然後它在8秒內會是Bootloader模式。關於Pro Micro的Bootloader相關說明可以看官方說明：[SparkFun Pro Micro: Reset to Bootloader](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide/troubleshooting-and-faq#ts-reset)。

為了方便作業，建議各位可以裝個按鈕或開關之類的，當然如果你眼明手快也是可以用金屬鑷子之類的來短接。

![▲ 建議裝個開關在RST和GND腳上。](https://1.bp.blogspot.com/-TKceHU3vb0s/Xu8SKzMqdII/AAAAAAAAChQ/xfBuaKSsOGguZcPwDfjP_43mBYOBhM-cgCK4BGAsYHg/s2796/DSC_0036.JPG)

## 進行燒錄

接下來請打開「裝置管理員」（你可以透過在左下角、工具列上的Windows標誌的開始鍵上按滑鼠右鍵來打開選單並打開它），裝置管理員內會列出目前連接到此電腦上的裝置。

打開AVRDUDESS，並跟隨以下步驟：

1. 在上方的「Programmer」選單中選擇「Ateml AppNote AVR109 BootLoader」。
2. 在下面的「Flash」中選擇點擊文字框右邊的「...」按鈕來選擇剛剛你編譯好的.hex（或.bin）檔案（如示範為kb_defaulf.hex）。
3. 在右上方的「MCU」選單中選擇「ATmega32U4」（或者你的晶片型號。Pro Micro請和我一樣選ATmega32U4）。
4. 將你的開發板（如Pro Micro）透過USB線接上電腦。這時「裝置管理員」應該會有反應。
5. 讓你的開發板進入DFU模式（例如Pro Micro是快速短接RST和GND腳2次）。
6. 這時「裝置管理員」應該也會有反應，並請特別注意「裝置管理員」中的「連接埠 (COM和LPT)」項目，開發板進入DFU模式後這裡會出現一個新的裝置，並在後面會標示其COM-Port名稱（如COM10）。
7. 回到AVRDUDESS中的「Programmer」，在其中的「Port」選單裡選擇剛剛看到的COM-Port名稱（如COM10）。
8. 按下AVRDUDESS下方的「Program!」，下方的指令列會開始動作。
9. 等待它燒錄完成。

![▲ 設定好的AVRDUDESS大概是這樣。](https://1.bp.blogspot.com/-h_kR_cbyiI0/Xu8SLCaQHQI/AAAAAAAAChU/KdGDqoghBnArI9ZTjw6yywYsBMCE1ZDmgCK4BGAsYHg/s646/AVRDUDESS-01.jpg)

**請注意！** 因為Pro Micro的DFU模式只會持續8秒，所以在上述的步驟5進入DFU模式後，接下來的步驟6～8必須要在這8秒內完成，否則失敗。

如果成功燒錄的話應該會看到類似這樣的畫面。如果失敗的話就多試幾次吧。

![▲ 燒錄成功。](https://1.bp.blogspot.com/-EgrFqZ05qvc/Xu8SLcnbmzI/AAAAAAAAChY/SjQG8nQdpNcxa4owlwivtJB_0QvFQ964QCK4BGAsYHg/s960/AVRDUDESS-02.png)

如果出現以下這種畫面的話，你的開發板可能並沒有進入DFU模式，或是COM-Port選錯，請再找找資料或多試幾次。

![▲ 出現此畫面，可能代表沒有成功進入DFU模式，或是COM-Port選錯。](https://1.bp.blogspot.com/-nBbABHCw-8w/Xu8SLuGSqfI/AAAAAAAAChc/th4vpoYxMjk3BIKszo7_oTko6pY1ADJOQCK4BGAsYHg/s960/AVRDUDESS-03.png)

燒錄過程示範影片：

<center><iframe width="800" height="450" src="https://www.youtube.com/embed/_KihNT558II" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

# 測試

這時你可以拔掉連接開發板的USB線，等待「裝置管理員」更新畫面後再次接上USB，如果這時「裝置管理員」也有反應的話，且「鍵盤」的地方有新的裝置出現（如HID Keyboard Device），代表你的開發板有被正確識別為鍵盤，也就是成功了。

如果你在燒錄時有出現成功燒錄的畫面，但是電腦卻沒有正確地辨識出你的開發板的話，請在此確定你的QMK韌體原始檔的內容有沒有錯誤（尤其是rules.mk中選擇Bootloader的部分）。找到錯誤、重新編譯、再燒一次。

接下來你就可以透過將設定好的鍵盤掃描矩陣的行列腳位短接或接上開關按鈕，來測試鍵盤是否正常運作。測試時可以使用類似[這樣的鍵盤測試工具](http://en.key-test.ru/)。

# 結語

如果到這一步都很成功的話那就恭喜了，因為你現在應該已經有一個可以當作鍵盤的開發板。接下來的硬體接線會簡單許多。不過我還想在QMK中加入一些其它的功能。

接下來請繼續觀看下一篇文章：[\[自製QMK鍵盤-4\] 瞭解QMK的基本架構與運作](/2020/06/diyqqmkkeyboard-4/)。

# 相關文章與資源

* [\[系列文章\] 自製QMK鍵盤](/pages/serial/s-diysnmkeyboard.html)
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