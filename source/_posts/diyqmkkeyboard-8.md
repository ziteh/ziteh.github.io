title: '[自製QMK鍵盤-8] Bluetooth LE 藍牙無線鍵盤'
author: ZiTe
tags:
  - DIY
  - 3C
categories:
  - '自製QMK鍵盤'
date: 2022-02-21 13:31:00
---

# 前言

現在的無線技術愈來愈發達，許多人更加喜歡無線的鍵盤與滑鼠，而我也是。QMK 已經有對部分藍牙（Bluetooth，BLE）模組的支援，只需要啓用就可以將 QMK 變成藍牙無線鍵盤。

本文將介紹如何啓用 QMK 的藍牙功能。

![](https://blogger.googleusercontent.com/img/a/AVvXsEgESsB0l38nOIjaw6wggilS9U_AjhzI82CzsDPwwsyBw_h_QdYwre_HWDzdNGZO8BW9JgFbf6KNXE8XwMKOVzlQAsnj9E2FIzB1I5NLbNBFBBQca6HLu_zFaCx1Pawflti5q0mkoTGxfVAPMA1BDQb9wD-Io8tjEpr4Zz9HPkCnXv_49Kgdn5WDMt4u=s16000)

<!--more-->

# 藍牙模組

根據 [QMK 文件](https://docs.qmk.fm/#/feature_bluetooth) 的說明，目前 QMK 正式支援的藍牙模組只有 2 種：
1. Roving Networks RN-42：支援傳統藍牙（Bluetooth Classic）
2. [Adafruit Bluefruit LE SPI Friend](https://www.adafruit.com/product/2633)：支援藍牙低功耗（Bluetooth Low Energy，BLE）

而多數人使用的應該是「Adafruit Bluefruit LE SPI Friend」這個模組，以下也以它爲例。

「Adafruit Bluefruit LE SPI Friend」是 Adafruit 所推出 SPI 介面藍牙模組，上面搭載了勁達 Raytac 的 「[MDBT40](https://www.raytac.com/product/ins.php?index_id=74)」藍牙模組，而「MDBT40」模組則是搭載了 Nordic Semiconductor 「[nRF51822](https://www.nordicsemi.com/products/nrf51822)」這個主打 BLE 與 2.4 GHz 功能的 SoC。不過「Adafruit Bluefruit LE SPI Friend」內有燒錄 Adafruit 爲其所寫的專屬[韌體](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware)。

因爲「Adafruit Bluefruit LE SPI Friend」的韌體已經有實作藍牙 HID 的相關 [AT 指令](https://learn.adafruit.com/introducing-the-adafruit-bluefruit-spi-breakout/at-commands)，所以 QMK 其實只是依照按下的按鍵，再透過 AT 指令讓「Adafruit Bluefruit LE SPI Friend」完成與電腦間的通訊。

「Adafruit Bluefruit LE SPI Friend」模組的價位有點高，但因爲它的韌體有放在 [GitHub](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware) 上，所以也可以自己買「MDBT40」或甚至「nRF51822」來進行燒錄。我使用的就是自行燒錄的。

不過要注意的是，「MDBT40」和「nRF51822」有不同的版本規格，要選用 32 KB RAM、256 KB Flash Memory 的版本才行，也就是「MDBT40-256RV3」或「MDBT40-P256RV3」及「nRF51822-xxAC」。

# QMK

QMK 對於藍牙功能的相關資料在這裡：[QMK: Bluetooth](https://docs.qmk.fm/#/feature_bluetooth)

## rules.mk

要啓用藍牙功能的話首先要在 `rules.mk` 中加入這兩行：

```mk
BLUETOOTH_ENABLE = yes
BLUETOOTH_DRIVER = AdafruitBLE # or RN42
```

不過 QMK 的文件有提到「The currently supported Bluetooth chipsets do not support N-Key Rollover (NKRO)」，所以要關閉防鬼鍵（NKRO）的功能：

```mk
NKRO_ENABLE = no
```

## config.h

再來就是可以在 `config.h` 中加入以下的腳位定義（可修改）：
```c
#define ADAFRUIT_BLE_RST_PIN  D4
#define ADAFRUIT_BLE_CS_PIN   B4
#define ADAFRUIT_BLE_IRQ_PIN  E6
```

## 編譯並燒錄

完成上述 `rules.mk` 及 `config.h` 的修改就可以直接[編譯並燒錄](https://ziteh.github.io/2020/06/diyqmkkeyboard-3/)了，就是這麼簡單。

# 接線

因爲我使用的是 Pro Micro (ATmega32U4)，故以下將以它作爲示範。也需注意 `RST`、`IRQ`、`CS` 這三個的實際腳位是可以在 `config.h` 中修改的。

實際上要連接的線有 6 條訊號，再加 2 條電源（Vcc、GND）。

Adafruit Bluefruit LE SPI Friend | nRF51822 | ATmega32U4 | Pro Micro
:-:|:-:|:-:|:-:
SCK|P0.21|PB1|D15
MISO|P0.22|PB3|D14
MOSI|P0.23|PB2|D16
CS|P0.24|PB4|D8/A8
IRQ|P0.25|PE6|D7
RST(SWDIO)|SWDIO/NRESET|PD4|D4/A4
DFU|P0.07|--|--
FACTORYRST|P0.16|--|--
MODE LED (Red)|P0.18|--|--
CONNECTED LED (Blue)|P0.19|--|--

> 要注意「nRF51822」本身的 IO 都是 3.3V 的，不是 5V。「Adafruit Bluefruit LE SPI Friend」上已經有邏輯電平轉換電路。

![▲ 接好線後的樣子。](https://blogger.googleusercontent.com/img/a/AVvXsEhgLHc-lVHPdbLy5rDceawCTrN1vwoXrG0F3hq_ehM4NgMdhS4A3rk7LeyTRPaMjLFdmoJ6myYu_gpEjdShhGqvg55U7RPeTM3mbjHNdN4dTA7_5xx3wm_VhbAGS3CB2seRigYHhQXBmxOg4ldi7MvakKEqMI3gqA1dn5tVkJqy0ggWZBySCdMdXA57=w400-h300)

只有把線接好後上電，它就有藍牙的功能了。在 Windows 10 的「裝置」裡可以搜尋並配對到此藍牙裝置。

# 效果展示

<iframe width="560" height="315" src="https://www.youtube.com/embed/OKdwwEEPLHY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 結語

這次分享了要如何爲 QMK 加入藍牙的功能，使其可以變成無線藍牙鍵盤。

如果文章的內容有誤也請指正。

# 相關資訊

- QMK 版本：`0.15.13`
- [Adafruit Bluefruit LE Firmware](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware) 
	- 韌體版本：`0.8.1`
	- SoftDevice 版本：`8.0.0`
	- Bootloader 版本：`2`
- 藍牙模組開發板：[Raytac MDBT40-DB Bluetooth Module Demo Board Kit](https://www.raytac.com/product/ins.php?index_id=84)
	- MDBT40-256RV3
	- nRF51822-xxAC

# 相關文章

- 本文的系列文清單：[自製QMK鍵盤](https://ziteh.github.io/categories/%E8%87%AA%E8%A3%BDQMK%E9%8D%B5%E7%9B%A4/)
- [QMK 官方文件](https://docs.qmk.fm/#/)
