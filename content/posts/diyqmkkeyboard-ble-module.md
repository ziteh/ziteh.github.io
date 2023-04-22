---
title: '[自製QMK鍵盤-番外] Adafruit Bluefruit LE SPI Friend 韌體燒錄教學'
author: ZiTe
tags:
  - DIY
  - 3C
  - QMK
  - 教學
series: ["自製QMK鍵盤"]
date: 2022-02-22 18:42:00
comment: true
toc: true
draft: false
aliases: ["/2022/02/diyqmkkeyboard-9/"]
---

在[上一篇文章中](/posts/diyqmkkeyboard-ble/)，我們使用 [Adafruit Bluefruit LE SPI Friend](https://www.adafruit.com/product/2633)（以下簡稱 Adafruit BLE）藍牙模組爲 QMK 添加了藍牙的功能。

不過這個模組的價格有點高，還好 Adafruit 有提供其韌體及燒錄工具，所以只要有 MDBT40 或 nRF51822 的話也可以自製 Adafruit Bluefruit LE SPI Friend 藍牙模組。

<!--more-->

# 硬體選擇

先講結論，**一定要**選用 32KB SRAM 版本的 nRF51822-**xxAC**，例如 [MDBT40-256**R**V3](https://www.raytac.com/product/ins.php?index_id=74) 。本文接下來也將使用 MDBT40-256**R**V3（[MDBT40-DB](https://www.raytac.com/product/ins.php?index_id=84)）作爲示範。

另外，爲了燒錄，還需要準備一個 Segger J-Link 或 STLink/V2 燒錄器，雖然也可以使用 Raspberry Pi 作爲燒錄器，但這比較麻煩。

## nRF51822
首先，Adafruit Bluefruit LE 是一系列的產品，Adafruit Bluefruit LE SPI Friend 只是該系列中的一個 SPI 介面的模組。其核心 SoC 就是 Nordic Semi 的 [nRF51822](https://www.nordicsemi.com/products/nrf51822)。

在 Adafruit Bluefruit LE Firmware 的 [GitHub repo](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware#firmwareboard-compatibility-chart) 中的說明有提到，`0.6.0` 及之後的韌體版本只適用於 32KB SRAM 的 nRF51822，而 16KB SRAM 的 nRF51822 只能使用 `0.5.0` 及之前的韌體版本。

但是 Adafruit Bluefruit LE SPI Friend 所屬的 **BLESPIFRIEND** 沒有 `0.5.0` 及之前的版本。

所以在購買 nRF51822 及其模組時，記得要選用 32KB SRAM 版本的 nRF51822-***xxAC***。

> 依照命名規則看，只有 nRF51822-***xxAC*** 是 32KB SRAM \ 256KB Flash 的版本，後綴爲 ***xxAA*** 或 ***xxAB*** 的 SRAM 大小都是 16KB（xxAA 與 xxAB 的差異是前者的 Flash 是128 KB，而後者是256 KB）。

## MDBT40
雖然 Adafruit BLE 使用的是 nRF51822 SoC，但它並不是直接搭載該晶片，而是搭載了勁達 Raytac 的 [MDBT40](https://www.raytac.com/product/index.php?index_m1_id=74) 模組。

MDBT40 是搭載了 nRF51822 的模組，並且整合了天線及一些週邊元件。上面有提到 nRF51822 有一些不同的版本，MDBT40 也有其相對應的細部型號。

我們要的是 32KB SRAM / 256KB Flash 的 nRF51822-xxAC，所以要選用 MDBT40-256**R**V3 或 MDBT40-**P**256**R**V3（這兩個的差異是前者爲陶瓷天線，後者爲 PCB 天線）。實際上 Adafruit Bluefruit LE 系列所使用的基本上就是 MDBT40-256**R**V3。

# 燒錄工具

Adafruit 有提供他們所使用的燒錄工具：[Adafruit nRF51822 Flasher](https://github.com/adafruit/Adafruit_nRF51822_Flasher)

## 需求

要使用這個工具，需要：
- 下列的其中一個 SWD 燒錄器，並安裝好它們的驅動程式
	- Segger J-Link（本文以 J-Link 爲例）
	- STLink/V2
	- Raspberry Pi
- 安裝好 [Python](https://www.python.org/)
- 安裝好 [Adafruit Adalink](https://github.com/adafruit/Adafruit_Adalink)
	- `git clone https://github.com/adafruit/Adafruit_Adalink.git`
	- `python setup.py develop` （Windows）；`sudo python setup.py develop`（Linux and MacOS）
- 安裝好 Python library [Click](https://click.palletsprojects.com/en/4.x/)
	- 安裝好 Python Pip
	- `sudo pip install click`

## 下載

將燒錄工具 Git clone 下來。注意，因爲這個 repo 含有 submodule，所以記得加上 `--recursive`：
```git
git clone --recursive git@github.com:adafruit/Adafruit_nRF51822_Flasher.git
```

如果你在上一個步驟忘記加上 `--recursive`，或 `Adafruit_BluefruitLE_Firmware` 資料夾是空的，那需要再執行這這指令：
```git
git submodule update --init --recursive
```

## 使用

將你的 nRF51822 或 MDBT40 連接上你的 SWD 燒錄器（J-Link、STLink/V2 或 RPi），依照你使用的硬體而定，SWD 燒錄器可能不會提供電源給 nRF51822 或 MDBT40，如果是這樣的話記得好要接好電源。

接著，就可以執行指令以使用  Adafruit nRF51822 Flasher 進行燒錄。燒錄指令有這些參數：
- `--jtag` `TEXT`：選擇你使用的燒錄器，只能是 `jlink`、`stlink` 或 `rpigpio` 的其中一種。
- `--softdevice` `TEXT`：選擇 SoftDevice 版本，例如 `8.0.0`。這個 SoftDevice 是 nRF51822 的東西。
- `--bootloader` `INTEGER`：Bootloader 版本，例如 `0` 或 `2`。
- `--board` `TEXT` (必要)：選擇你要燒錄的板子，必須爲 `blefriend16`、`blefriend32` 或 `blespifriend` 的其中一種。具體要選什麼可以看[這裡](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware/tree/03110f6819d2e8c0928ce1f3879df22dab562447#adafruit-bluefruit-le-firmware)。
- `--firmware` `TEXT` (必要)：韌體版本，例如 `0.6.5`、`0.8.1`。

以本文來說，我們要的是「Adafruit Bluefruit LE SPI Friend」，因此可以下這樣的指令（燒錄器、版本可以依實際需求與情況自行調整）：

```cmd
python flash.py --jtag=jlink --board=blespifriend --softdevice=8.0.0 --bootloader=2 --firmware=0.8.1
```

燒錄完成後會顯示：
```cmd
Flash OK
```

另外，還可以使用 `python flash.py --help` 查看說明。

> 如果燒錄的過程中出現「SyntaxError: Missing parentheses in call to 'print'.」錯誤訊息的話，請將 `flash.py` 檔中的所有 `print ""` 改成 `print("")`，也就是加上括號。這只是單純的 Python 版本問題，可以參考 [What does "SyntaxError: Missing parentheses in call to 'print'" mean in Python?](https://stackoverflow.com/questions/25445439/what-does-syntaxerror-missing-parentheses-in-call-to-print-mean-in-python)。

# 燒錄後重置

根據 [Adafruit 的說明](https://learn.adafruit.com/introducing-the-adafruit-bluefruit-spi-breakout/device-recovery)，燒錄完韌體後，還要進行一次 Factory Reset，其步驟如下：
1. 當板子接上電源時，將 DFU 腳（nRF51822 的 P0.07）接 GND。
2. 保持 DFU 與 GND 之間的連線並等待數秒，直到藍色 LED (CONNECTED state LED，nRF51822 的 P0.19) 開始閃爍。
3. 移除 DFU 與 GND 之間的連線。
4. 完成。

# 腳位對應

Bluefruit LE SPI Friend | MDBT40 (nRF51822)
-|-
SCK|P0.21
MISO|P0.22
MOSI|P0.23
CS (有上拉電阻)|P0.24
IRQ|P0.25
DFU|P0.07
FACTORYRST|P0.16
MODE LED (紅色)|P0.18
CONNECTED LED (藍色)|P0.19
SWDIO/RST|SWDIO/NRESET
SWCLK|SWCLK

另外需要注意的是，nRF51822 的 IO 是 1.8 V 或 3.3 V 的。還有 P0.03 是接地的（雖然我試過不接地好像也沒什麼影響）。

![▲ Adafruit Bluefruit LE SPI Friend 的電路圖，取自 Adafruit](https://cdn-learn.adafruit.com/assets/assets/000/026/205/original/adafruit_products_BluefruitLESPIFriend_sch.png?1436186237)

# 結語

這次介紹了要如何執行燒錄 Adafruit Bluefruit LE SPI Friend 的韌體。

基本上比較要注意的就是 nRF51822 要選擇 32KB SRAM 的版本才能用，我有試著使用 16KB 的 nRF51822-xxAA，但它確實無法正常運作。

若上述內容有錯誤還請指正。謝謝。

# 相關資料

- [Introducing the Adafruit Bluefruit LE SPI Friend | Adafruit Learning System](https://learn.adafruit.com/introducing-the-adafruit-bluefruit-spi-breakout/downloads)
- [Adafruit BluefruitLE Firmware](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware)
- [Adafruit Adalink](https://github.com/adafruit/Adafruit_Adalink)
- [Adafruit nRF51822 Flasher](https://github.com/adafruit/Adafruit_nRF51822_Flasher)
