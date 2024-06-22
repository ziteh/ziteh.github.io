---
title: '[自製QMK鍵盤-4] 編譯與燒錄'
subtitle: 'QMK 韌體編譯及燒錄教學'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK
categories: ["自製QMK鍵盤"]
date: 2023-07-02 10:50:00+08:00
comments: true
toc: true
draft: false
aliases: ["/2020/06/diyqmkkeyboard-3/", "/posts/diyqmkkeyboard-3/"]
---

在[上一篇文章](/posts/diyqmkkeyboard-2/)中我們已經有了 QMK 韌體原始檔，接下來就可以進行編譯和燒錄，也就是[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)的第 4 步。

編譯和燒錄的步驟對於不熟悉程式和開發板的人可能會覺得複雜，但是其實沒有這麼困難，只要仔細地遵循步驟應該是不會出什麼問題。

<!--more-->

> QMK 本身是用 C 及少部分的 C++ 寫的，如果你熟悉 C/C++ 的話，可以使用你喜歡的方式編譯。本篇主要是寫給不熟悉的人，可以用最簡單的方式編譯 QMK。
> 本文以 Windows 系統爲主，macOS 與 Linux 還請參考[官方文件](https://docs.qmk.fm/#/newbs_getting_started)。

# 編譯

在上一篇我們已經準備好 QMK MSYS 的環境了，可以直接進行編譯，在 QMK MSYS 中執行：
```cmd
qmk compile -kb mytetstkb -km default
```

> `qmk compile -kb <keyboard> -km <keymap>` 是 QMK 的編譯指令。
> `<keyboard>` 代表了你要編譯的鍵盤，這裡的是 `kb`。`<keymap>` 是要編譯的鍵映射（Keymap），這裡是 `default`。

如果有問題的話會顯示問題出在哪裡。如果都沒問題的話，應該會看到一整排的 `[OK]`，並且會告訴你編譯好的 `.hex` 檔儲存的路徑（Creating load file for flashing: .build/mytestkb_default.hex，參考路徑：`C:\Users\<USERNAME>\qmk_firmware\.build\mytestkb_default.hex`）。

![▲ 編譯完成並顯示編譯好的檔案](https://1.bp.blogspot.com/-hENkr6oUTL4/Xu8SKl2cmPI/AAAAAAAAChM/o6l8dhizAMIrAk5i4xCmnjFTJ_iXLlPQQCK4BGAsYHg/s754/MSYS2-02.png)

這樣就完成編譯了。有了這個 `.hex`（或 `.bin`、`.uf2` 等）檔就可以進行燒錄了。

# 燒錄

不同的硬體（微控制器、開發板）可以使用的燒錄方式可能不同，以下僅示範 Pro Micro（ATmega32U4）及 RP2040 的方法，其它硬體請參考官方文件 [Flashing Firmware](https://docs.qmk.fm/#/newbs_flashing)。

## Pro Micro

### 準備軟體

燒錄韌體前要先安裝好用來燒錄的軟體。

QMK 有個官方的燒錄工具——[QMK Toolbox](https://github.com/qmk/qmk_toolbox/releases/latest)，也可以透過 QMK MSYS 執行 `qmk flash -kb <keyboard> -km <keymap>` 指令來燒錄。一般情況下你可以先試試這兩種方式，對於 Pro Micro 也可以使用 [AVRDUDESS](https://blog.zakkemble.net/avrdudess-a-gui-for-avrdude/) 來進行燒錄。

以下為將示範使用 AVRDUDESS 進行燒錄，如果想要使用 QMK Toolbox 或 CLI 的話可以參考 QMK 的官方文件 [Flashing Firmwate](https://docs.qmk.fm/#/newbs_flashing)。

### DFU 模式

再來要確認好你使用的微控制器要如何進入所謂的 DFU（或 Bootloader）模式，不同的硬體可能會有所不同，通常都是透過短接 RST（Reset）和 GND 接腳。

以 Pro Micro 來說，進入 DFU 模式要快速地短接 RST 和 GND 接腳**2次**，然後它在 8 秒內會是 DFU 模式。詳細可以看官方說明：[SparkFun Pro Micro: Reset to Bootloader](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide/troubleshooting-and-faq#ts-reset)。

為了方便作業，建議可以裝個按鈕或開關之類的，當然如果你眼明手快也是可以用金屬鑷子之類的來短接。如果你使用的開發板已經有 Reset 按鈕的話，可以直接使用該按鈕。

![▲ 建議裝個開關在 RST 和 GND 腳上](https://1.bp.blogspot.com/-TKceHU3vb0s/Xu8SKzMqdII/AAAAAAAAChQ/xfBuaKSsOGguZcPwDfjP_43mBYOBhM-cgCK4BGAsYHg/s2796/DSC_0036.JPG)

### 進行燒錄

接下來請打開「裝置管理員」（你可以透過在左下角、工具列上的 Windows 標誌的開始鍵上按滑鼠右鍵來打開選單並打開它），裝置管理員內會列出目前連接到此電腦上的裝置。

打開 AVRDUDESS，並跟隨以下步驟：

1. 在上方的「Programmer」選單中選擇「Ateml AppNote AVR109 BootLoader」。
2. 在下面的「Flash」中選擇點擊文字框右邊的「...」按鈕來選擇剛剛編譯好的 `.hex` 檔案（如示範為 `mytestkb_defaulf.hex`）。
3. 在右上方的「MCU」選單中選擇「ATmega32U4」（或者你的晶片型號，Pro Micro 爲 ATmega32U4）。
4. 將你的開發板透過 USB 線接上電腦。這時「裝置管理員」可能會有反應。
5. 讓你的開發板進入 DFU 模式（Pro Micro 就是快速短接 RST 和 GND 腳 2 次）。
6. 這時「裝置管理員」應該會有反應，並請特別注意其中的「連接埠 (COM 和 LPT)」項目，進入 DFU 模式後這裡應該會出現一個新的裝置，並在後面會標示其 COM Port 名稱（如 `COM10`）。
7. 回到「Programmer」，在其中的「Port」選單裡選擇剛剛看到的 COM Port 名稱（如 `COM10`）。
8. 按下「Program!」，下方的指令列會開始燒錄。
9. 等待它燒錄完成。

![▲ AVRDUDESS 設定示意](https://1.bp.blogspot.com/-h_kR_cbyiI0/Xu8SLCaQHQI/AAAAAAAAChU/KdGDqoghBnArI9ZTjw6yywYsBMCE1ZDmgCK4BGAsYHg/s646/AVRDUDESS-01.jpg)

***請注意***，因為 Pro Micro 的 DFU 模式只會持續 8 秒，所以在上述的步驟 5 進入 DFU 模式後，接下來的步驟 6～8 必須要在這 8 秒內完成，否則失敗。

如果你覺得要在 8 秒內完成有難度，那可以試試先進入 DFU 模式後，到「裝置管理員」中查看 Pro Micro 的 COM Port，然後直接將此 COM Port 手動輸入到 AVRDUDESS 中（即使現在 DFU 模式可能已經結束了、此 COM Port 已經不存在），隨後再次進入 DFU 模式，確認「裝置管理員」有偵測到裝置變更（畫面有更新）後立刻按下「Program!」進行燒錄。

如果成功燒錄的話應該會看到類似這樣的畫面。如果失敗的話就多試幾次吧。

![▲ 燒錄成功示意](https://1.bp.blogspot.com/-EgrFqZ05qvc/Xu8SLcnbmzI/AAAAAAAAChY/SjQG8nQdpNcxa4owlwivtJB_0QvFQ964QCK4BGAsYHg/s960/AVRDUDESS-02.png)

如果出現以下這種畫面的話，你的開發板可能並沒有進入 DFU 模式，或是 COM Port 選錯等錯誤，請再試試。

![▲ 出現此畫面代表燒錄未成功](https://1.bp.blogspot.com/-nBbABHCw-8w/Xu8SLuGSqfI/AAAAAAAAChc/th4vpoYxMjk3BIKszo7_oTko6pY1ADJOQCK4BGAsYHg/s960/AVRDUDESS-03.png)

燒錄過程示範影片：

<center><iframe width="800" height="450" src="https://www.youtube.com/embed/_KihNT558II" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>

## RP2040

### DFU 模式

RP2040 進入 DFU 模式的方法主要有以下幾種：
- RP2040 接上電腦，快速雙擊 Reset 按鈕。需已燒錄有啓用 [Double-tap Reset](https://docs.qmk.fm/#/platformdev_rp2040?id=double-tap) 的 QMK 韌體才能用此方法。
- RP2040 接上電腦，先按著 Boot 按鈕不放，單擊 Reset 按鈕後放開 Boot 按鈕。
- RP2040 先不接電腦，按著 Boot 按鈕不放，接上電腦後放開 Boot 按鈕。

如果 RP2040 成功進入 DFU 模式，那你的電腦應該會多出一個名爲 `RPI-RP2` 的儲存裝置，可以在檔案總管的本機中確認。RP2040 的 DFU 模式不像 Pro Micro 有時間限制，要退出就是按一下 Reset 或直接拔除 USB 線。

### 進行燒錄

RP2040 可以透過以下任一種方式燒錄韌體：
- 複製 `.uf2` 檔案。
  1. 編譯韌體以生成 `.uf2` 檔。
  2. 進入 DFU 模式。
  3. 複製 `.uf2` 檔並貼上/覆蓋到 `RPI-PR2` 裝置內。
- QMK CLI
  1. 開始 QMK MSYS。
  2. 執行指令 `qmk flash -kb <keyboard> -km <keymap>`。
  3. 等待編譯完成。當出現等待裝置提示時，進入 DFU 模式。

> 我沒試過用 QMK Toolbox 燒錄 RP2040，但是其[文件](https://github.com/qmk/qmk_toolbox#flashing)中似乎也沒有提到有對 RP2040 的支援。

# 測試

這時你可以拔掉連接開發板的 USB 線，等待「裝置管理員」更新畫面後再次接上 USB，如果這時「裝置管理員」也有反應的話，且「鍵盤」的地方有新的裝置出現（如 HID Keyboard Device），代表你的開發板有被正確識別為鍵盤，也就是成功了。

如果你在燒錄時有出現成功燒錄的畫面，但是電腦卻沒有正確地辨識出你的鍵盤的話，請再次確定 QMK 韌體的內容有沒有錯誤。

接下來你就可以透過杜邦線短接或裝開關在鍵盤掃描矩陣的腳位，來測試鍵盤是否正常運作。測試時可以使用類似[這樣的鍵盤測試工具](http://en.key-test.ru/)。

> 你可能會需要安裝 QMK 的驅動程式，通常如果你是用 QMK Toolbox 的話它會問你要不要安裝。如果你不是用 QMK Toolbox 或想另外安裝的話，你可以從 [GitHub](https://github.com/qmk/qmk_driver_installer/releases) 下載。

# 結語

如果到這一步都很成功的話那就恭喜了，到目前爲止 QMK 韌體的部分都完成了。

# 相關網頁

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- 參考資料
	- [\[2020\] 新版 QMK 教學](https://ergotaiwan.tw/install-qmk-tutorials-2020/)
	- [SparkFun Pro Micro: Reset to Bootloader](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide/troubleshooting-and-faq#ts-reset)
	- [Trouble flashing QMK - No device present](https://www.keebtalk.com/t/trouble-flashing-qmk-no-device-present/5871/21)
	- [Installing an Arduino Bootloader](https://learn.sparkfun.com/tutorials/installing-an-arduino-bootloader)
	- [Replace Pro Micro bootloader with QMK DFU](https://www.reddit.com/r/olkb/comments/8sxgzb/replace_pro_micro_bootloader_with_qmk_dfu/)
- QMK相關
	- [QMK 官方網站](https://qmk.fm/)
	- [QMK 官方文件](https://docs.qmk.fm/#/)
	- [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)

> 本文最早發佈於 2020-06-21，於 2023 重新編排並更新內容。
