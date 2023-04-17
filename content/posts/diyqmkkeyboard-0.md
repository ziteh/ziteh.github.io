---
title: '[自製QMK鍵盤-0] 如何DIY一把鍵盤？'
author: ZiTe
tags:
  - DIY
  - 3C
  - QMK
series: ["自製QMK鍵盤"]
date: 2023-04-17 20:17:00+08:00
comment: true
toc: true
draft: true
aliases: ["/2020/06/diyqmkkeyboard-0/"]
---

自從購買了第一把機械式鍵盤後，就發現我總是少一把鍵盤，也萌生出「自己做鍵盤」的想法。經歷了近 3 年斷斷續續、三天打魚兩天曬網的查資料、學習及實作後，總算是有了點成果。多虧自製鍵盤的社群龐大且活躍，現在要 DIY 出一把鍵盤其實真的不難，我自己就曾在 2 天內就完成一把鍵盤。

但是我在學習的過程中走了不少冤枉路，故想要針對 QMK 鍵盤韌體寫一系列較完整的教學，幫助那些也想自己做鍵盤的人。希望看完這一系列的文章，大家也可以從零開始做成屬於自己的鍵盤。

而這篇作爲開頭，會先介紹製作一把鍵盤所需的要件及步驟。

<!--more-->

# 鍵盤的組成

一把鍵盤主要有兩大部分：硬體和韌體。

## 硬體

硬體（Hardware）大家應該都知道，就是 PCB 電路板、鍵軸和微控制器等，甚至外殼、定位板和鍵帽也可以算在內。

其中微控制器（MCU）是比較重要的部分，它是鍵盤的運作核心，鍵盤能有多豐富的功能幾乎通通取決或受限於它。

現在常見用於鍵盤的微控制器有：
- [ATmega32U4](https://www.microchip.com/en-us/product/ATmega32U4)
- [RP2040](https://www.raspberrypi.com/products/rp2040/)
- [STM32 系列](https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html)
- [nRF52840](https://www.nordicsemi.com/products/nrf52840)

至於這些 MCU 有何差異、要如何挑選，以及 PCB 要如何繪製詳細內容等，待未來再另做介紹。

## 韌體

韌體（Firmware）可能就不是每個人都聽過了。簡單來說，韌體就是燒錄在晶片（如微控制器）裡的程式，也就是程式碼的部分。

當前較主流的開源鍵盤韌體有：
- [QMK](https://github.com/qmk/qmk_firmware)
  - [Vial QMK](https://github.com/vial-kb/vial-qmk)
- [ZMK](https://github.com/zmkfirmware/zmk)
- [KMK](https://github.com/KMKfw/kmk_firmware)
- [TMK](https://github.com/tmk/tmk_keyboard)
- [BlueMicro](https://github.com/jpconstantineau/BlueMicro_BLE)

而本系列文的重點會放在 QMK（及 Vial QMK）上。

QMK（Quantum Mechanical Keyboard）是由 TMK 衍生而來的，在其基礎上增加了許多功能，也可以說是目前最主流的開源鍵盤韌體，許多玩家及工作室製作的鍵盤都是用 QMK。

QMK 韌體的功能眾多、使用簡單、擴展方便，相關的工具及文件也是非常的豐富，最重要的是社群相當龐大且活躍。

# 製作步驟

既然知道了一把鍵盤有哪些要件，那接下來就可以按步驟一一完成了。我自己習慣的製作步驟爲：

1. 整體設計：這把鍵盤要有幾鍵？標準佈局還是要 Ortho？或是要做成 Alice Layout 甚至分離式的？需要 Bluetooth 嗎？等等。
2. 編輯佈局：使用 [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/) 實際編排鍵盤佈局（Layout）。
3. 生成韌體：使用 [Keyboard Firmware Builder](https://kbfirmware.com/) 自動生成基礎韌體，如果有額外的功能需要啓用也一併設定。
4. 韌體測試：使用現成的開發板（如 [Pro Micro](https://www.sparkfun.com/products/12640) 或 [RP2040-Plus](https://www.waveshare.com/rp2040-plus.htm)）進行韌體功能初步驗證。在此步確認要使用的 MCU。
5. 繪製 PCB：根據完成的鍵盤佈局要使用的 MCU 進行 PCB Layout。
6. 生成定位板：使用工具（如 [Keebio Plate Generator](https://plate.keeb.io/)）自動生成定位板。
7. 設計外殼：使用 3D 建模工具設計外殼。
8. 訂購：向工廠訂購 PCB、3D 列印外殼、採購電子零件...等等
9. 組裝：焊接電子零件焊接、燒錄韌體、組合定位板及外殼等，完成鍵盤。

步驟看起來不少，但因爲許多步驟都有自動工具可以幫忙，所以只要滑鼠點幾下就可以完成了。其中 PCB Layout 和設計外殼應該是過程中比較花時間的。

根據我自己製作 [Calcite52](https://github.com/ziteh/calcite) 的經驗，如果此鍵盤沒有什麼特別的功能且先不論美觀的話，步驟 2~7 甚至可以在一個週末——兩天內——完成。

本系列文預計會根據以上的步驟分別介紹各自的詳細內容。除了上述的基本的步驟外，我還會額外介紹其它功能的啓用與設定，例如：[Vial](https://get.vial.today/)、藍牙及指標裝置。

# 相關網站

這裡順便附上一些製作鍵盤時可能會用到的網站。

- 工具  
	- [Keyboard Layout Editor (KLE)](http://www.keyboard-layout-editor.com/)：鍵盤佈局編輯器
	- [Keyboard Firmware Builder](https://kbfirmware.com/)：鍵盤韌體產生器
	- [Keyboard PCB Builder](https://kb.xyz.is/)：鍵盤 PCB 產生器
	- 鍵盤定位板產生器
	  - [ai03 Plate Generator](https://kbplate.ai03.com/)
	  - [Keebio Plate Generator](https://plate.keeb.io/)
	  - [Plate & Case Builder](http://builder.swillkb.com/)
	  - [Keyboard Plate Generator](https://eswai.github.io/plategen/plategen.html)
	- [Convert KLE to QMK info.json](https://qmk.fm/converter/)：將鍵盤佈局編輯器的資料轉換成 QMK `info.json`
	- [KiCAD KLE Placer](https://github.com/zykrah/kicad-kle-placer)：根據鍵盤佈局編輯器的資料自動擺放鍵軸的 KiCAD 插件
- 其它  
  - QMK 相關
  	- [QMK 官方網站](https://qmk.fm/)
  	- [QMK 官方文件](https://docs.qmk.fm/#/)
  	- [QMK 的 GitHub repo](https://github.com/qmk/qmk_firmware)
  - 鍵盤清單
    - [MechKey.Org - All about keyboard](https://mechkey.org/)
    - [Staggered Keyboards - Keebfolio](https://keebfolio.netlify.app/en/staggered/)
    - [KeymapDB - Database of keymaps for programmable keyboards](https://keymapdb.com/)
  - [Zykrah's PCB Guide](https://guide.zykrah.me/)：Zykrah 的 PCB 設計指南。

> 本文最早發佈於 2020-06-21，於 2023 重新編排並更新內容。
