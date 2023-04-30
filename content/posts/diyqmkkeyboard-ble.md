---
title: '[自製QMK鍵盤-番外] 爲QMK鍵盤加上Bluetooth藍牙無線功能'
author: ZiTe
tags:
  - DIY
  - 3C
  - 教學
  - QMK
series: ["自製QMK鍵盤"]
date: 2022-02-21 13:31:00
comment: true
toc: true
draft: false
aliases: ["/2022/02/diyqmkkeyboard-8/", "/posts/diyqmkkeyboard-8/"]
---

現在的無線技術愈來愈發達，許多人更加喜歡無線的鍵盤與滑鼠，而我也是。QMK 已經有對部分藍牙（Bluetooth 或 BLE）模組的支援，只需要啓用就可以將 QMK 變成藍牙無線鍵盤。

本文將介紹如何啓用 QMK 的藍牙功能。

![](https://blogger.googleusercontent.com/img/a/AVvXsEgESsB0l38nOIjaw6wggilS9U_AjhzI82CzsDPwwsyBw_h_QdYwre_HWDzdNGZO8BW9JgFbf6KNXE8XwMKOVzlQAsnj9E2FIzB1I5NLbNBFBBQca6HLu_zFaCx1Pawflti5q0mkoTGxfVAPMA1BDQb9wD-Io8tjEpr4Zz9HPkCnXv_49Kgdn5WDMt4u=s16000)

<!--more-->

# 藍牙模組

根據 [QMK 文件](https://docs.qmk.fm/#/feature_bluetooth)的說明，目前 QMK 正式支援的藍牙模組只有 2 種：
1. Roving Networks RN-42：支援傳統藍牙（Bluetooth Classic）
2. [Adafruit Bluefruit LE SPI Friend](https://www.adafruit.com/product/2633)：支援藍牙低功耗（Bluetooth Low Energy，BLE）

而多數人使用的應該是「Adafruit Bluefruit LE SPI Friend」這個模組，以下也以它爲例。

Adafruit Bluefruit LE SPI Friend（以下簡稱 Adafruit BLE）是 Adafruit 所推出 SPI 介面藍牙模組，上面搭載了勁達 Raytac 的 [MDBT40](https://www.raytac.com/product/ins.php?index_id=74) 藍牙模組，而 MDBT40 模組則是搭載了 Nordic Semi [nRF51822](https://www.nordicsemi.com/products/nrf51822) 這個主打 BLE 與 2.4 GHz 功能的 SoC。Adafruit BLE 內有燒錄爲其所寫的專屬[韌體](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware)。

因爲 Adafruit BLE 的韌體已經有實作藍牙 HID 的相關 [AT 指令](https://learn.adafruit.com/introducing-the-adafruit-bluefruit-spi-breakout/at-commands)，所以 QMK 其實只是依照按下的按鍵，再透過 AT 指令讓 Adafruit BLE 完成與電腦間的通訊。

## 自製 Adafruit BLE 模組

Adafruit BLE 模組的價位有點高，但因爲它的韌體有在 [GitHub](https://github.com/adafruit/Adafruit_BluefruitLE_Firmware) 上，所以也可以自己買 MDBT40 或其它 nRF51822 模組來燒錄。我使用的就是自行燒錄的，詳細教學在[這裡](/posts/diyqmkkeyboard-ble-module)。

不過要注意的是，MDBT40 和 nRF51822 有不同的版本規格，要選用 32 KB RAM、256 KB Flash Memory 的版本才行，也就是 MDBT40-256RV3 或 MDBT40-P256RV3 及 nRF51822-xxAC。

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

再來就是可以在 `config.h` 中加入以下的 SPI 腳位定義（可修改）：
```c
#define ADAFRUIT_BLE_RST_PIN  D4
#define ADAFRUIT_BLE_CS_PIN   B4
#define ADAFRUIT_BLE_IRQ_PIN  E6
```

> 記得要選該微控制器上有 SPI 功能的腳位才行。

## 編譯並燒錄

完成上述 `rules.mk` 及 `config.h` 的修改就可以直接[編譯並燒錄](/posts/diyqmkkeyboard-3/)了，就是這麼簡單。

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

> 要注意 nRF51822 本身的 IO 都是 3.3V 的，不是 5V。官方的 Adafruit BLE 上已經有邏輯電平轉換電路。

![▲ 接好線後的樣子](https://blogger.googleusercontent.com/img/a/AVvXsEhgLHc-lVHPdbLy5rDceawCTrN1vwoXrG0F3hq_ehM4NgMdhS4A3rk7LeyTRPaMjLFdmoJ6myYu_gpEjdShhGqvg55U7RPeTM3mbjHNdN4dTA7_5xx3wm_VhbAGS3CB2seRigYHhQXBmxOg4ldi7MvakKEqMI3gqA1dn5tVkJqy0ggWZBySCdMdXA57=w640-h480)

只有把線接好後上電，它就有藍牙的功能了。在 Windows 10 的「裝置」裡可以搜尋並配對到此藍牙裝置。

> 你可能會想在 Keymap 中加入藍牙控制的按鍵，請參考 [Bluetooth Keycodes](https://docs.qmk.fm/#/feature_bluetooth?id=bluetooth-keycodes)。

# 效果展示

<iframe width="560" height="315" src="https://www.youtube.com/embed/OKdwwEEPLHY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- 自製 Adafruit Bluefruit LE SPI Friend 模組教學：[Adafruit Bluefruit LE SPI Friend 韌體燒錄教學](/posts/diyqmkkeyboard-ble-module)。
- [QMK 官方文件](https://docs.qmk.fm/#/)
