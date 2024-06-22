---
title: '[自製QMK鍵盤-2] 如何選擇微控制器 MCU？'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK
categories: ["自製QMK鍵盤"]

date: 2023-12-21T20:04:00+08:00
header_img: ""
comments: true
toc: true
draft: false
---

在正式編寫 QMK 韌體前，我們還需要先決定要使用什麼微控制器（Microcontroller，MCU）。這篇文章會介紹幾個比較常見的 MCU 並且說明它們的優缺點，讓你可以依據不同的需求來選擇要使用的 MCU。

要注意的是，本文的重點是 MCU IC 本身而非開發板。不同的開發板可能會使用相同的 MCU（例如 Pro Micro 和 Arduino Leonardo 都是使用 ATmega32U4 這顆 MCU），但其出廠預燒的 Bootloader 可能不同。

<!--more-->

本文不會把所有支援的 MCU 都介紹（太多了），只會重點介紹那些適合新手及不熟悉該領域的人的型號。如果你想知道所有 QMK 支援的 MCU 的話，請參考官網文件：[Compatible Microcontrollers](https://docs.qmk.fm/#/compatible_microcontrollers)

# MCU 影響什麼？

首先我們要知道 MCU 會影響鍵盤的什麼？
- 按鍵數量。MCU 的 GPIO 腳位數量決定了它可以做多少鍵的鍵盤。
- 功能。MCU 的硬體規格（主要是 Flash 大小）決定了這把鍵盤可以啓用多少功能（如 [Vial](https://get.vial.today)）。
- 焊接容易度。MCU 的封裝決定了焊接的容易度。
- 週邊電路。不同的 MCU 所需的必要週邊電路都不同，這會影響 PCB 佔用空間、PCB Layout 難度及最終成本。
- PCB 佔用空間。除了 MCU 本身封裝所佔用的空間，其必要的週邊電路多寡也會影響佔用空間。
- 採購容易度。有些 MCU 比較少見，不見得方便購買，而如果想要使用 PCBA 服務的話，也必須選擇廠商有提供的 MCU。
- 燒錄方式。MCU 需要燒錄器（如 ST-Link）或 Bootloader 才能夠將 QMK 韌體燒錄進去，燒錄方式會影響開發的方便性。
- 成本。MCU 的價格當然也都不同。

> - GPIO（General-purpose input/output）：通用功能輸入輸出。簡單來說就是 MCU 的 IO 腳、Pin 腳。
> - Flash（Flash memory）：快閃記憶體。簡單來說就是 MCU 上儲存韌體程式的地方，類似電腦裡的硬碟。
> - Bootloader & DFU（Device firmeare update）
>   - Bootloader 是在 MCU 上引導開機的引導程序（對，MCU 和電腦一樣也有開機流程）。
>   - DFU mode 是指 MCU 的一種更新韌體程式的模式，在此模式下更新韌體往往不需要專用的燒錄器，只需要原本就有的通訊埠（如 USB）就可以了。
>   - 雖然 Bootloader 和 DFU 本質上不太相同，但很多時候會把它們混著講，而實際上通常是指 DFU。
> - PCBA（PCB Assembly）：PCB 組裝。簡單來說就是請工廠除了要生產 PCB 外，還要用打件機幫你把零件放上去，再用回流焊或波峰焊等設備幫你焊接，等你收到時就不用再自己焊接零件了。

# 快速比較

| 項目           | ⭐ATmega32U4         | AT90USB1286         | ⭐RP2040                      | STM32F303CC          | STM32F401CC          |
| -------------- | ------------------- | ------------------- | ---------------------------- | -------------------- | -------------------- |
| CPU 架構       | 8-bit AVR           | 8-bit AVR           | 雙核心 32-bit ARM Cortex-M0+ | 32-bit ARM Cortex-M4 | 32-bit ARM Cortex-M4 |
| 運作頻率       | 16/8 MHz *(1)*      | 16/8 MHz *(1)*      | 133 MHz                      | 72 Mhz               | 84 Mhz               |
| ROM (Flash)    | 32 KB + 1 KB EEPROM | 128 KB + 4KB EEPROM | 最多 16 MB *(2)*             | 256 KB               | 256 KB               |
| RAM            | 2.5 KB              | 8 KB                | 264 KB                       | 40 KB                | 64 KB                |
| GPIO           | 25                  | 46                  | 30                           | 37                   | 36                   |
| 週邊電路       | 少                  | 少                  | 多（Flash）                  | 少                   | 少                   |
| Bootloader     | 第三方 *(3)*        | 第三方 *(3)*        | 內建                         | 內建                 | 內建                 |
| 封裝           | TQFP-44, QFN-44     | TQFP-64, QFN-64     | QFN-56                       | LQFP-48              | UFQFPN-48, WLCSP-49  |
| 常見開發板     | Pro Micro           | Teensy++ 2.0        | Paspberry Pi Pico            | Proton C             | WeAct Blackpill      |
| 單價（Mouser） | NT$ 180             | NT$ 355             | NT$ 24                       | NT$ 261              | NT$ 226              |
| 單價（臺灣）   | NT$ 280             | NT$ 510             | NT$ 80                       | NT$ 195              | --                   |
| 單價（淘寶）   | NT$ 79              | NT$ 330             | NT$ 18                       | NT$ 45               | NT$ 42               |
| 廠商           | Microchip           | Microchip           | 樹莓派                       | ST                   | ST                   |

> 1. 使用 5V 電源時可以到 16 MHz；使用 3.3V 時可以到 8MHz。
> 2. RP2040 沒有內建 Flash，你必須外接獨立的 Flash IC，如： W25Q128JVS, W25Q64JVXGIQ。
> 3. 一般來說出廠的 MCU 不會燒好第三方 Bootloader，如何你是單買 IC 而非開發板，可能需要使用燒錄器先燒好 Bootloader 後才可以使用 QMK。

對於新手我基本上只推薦 **ATmega32U4** 和 **RP2040**。如果你不知道怎麼選的話，可以參考以下的守則：

1. 如果你不想自己畫/處理 MCU 的 PCB 電路，想要使用現成的開發板的話，選擇 RP2040。
2. 如果以下 3 點**全部符合**的話，選擇 QFP 封裝的 ATmega32U4。
   1. 你不能接受成品鍵盤使用現成開發板，你一定要 MCU 直接焊在鍵盤 PCB 上。
   2. 你的焊接技術及工具無法讓你焊接 QFN 封裝的 IC。
   3. 你不想要用 PCBA（讓工廠幫你焊接）。
3. 如果你的鍵盤要啓用藍牙，選擇 ATmega32U4（或不用 QMK，改用 ZMK 和 nRF5 SoC）。
4. 如果你的鍵盤 PCB 空間嚴重不足，調整許久依然沒有足夠的空間放 RP2040 及其週邊電路，選擇 ATmega32U4。
5. 如果你**不符合**上述的任何一種情況，選擇 RP2040。

使用 ATmega32U4 需要額外注意：32KB 的 Flash 真的很小，建議你在畫 PCB 前先完成並測試 QMK 韌體，把所有你要的功能打開（包含 Vial）。如果編譯後 QMK 提示 Flash 空間不足，且你已經使用了所有優化選項，而你又不想放棄那些功能的話，就只能放棄 ATmega32U4 改用其它 MCU 了。

# MCU 細評

## ATmega32U4

[官網](32u4)

熟悉 Arduino 的人應該對「ATmega」這個名字很熟悉，ATmega32U4 是 Microchip（原本是 Atmel，已被前者併購）公司的一款 8-bit AVR MCU。與 RP2040 同爲我推薦新手的其中一種 MCU。

- 優點：
  - QMK 中最常見的 MCU，不管是想找範例或問問題都比較方便。
  - QMK 的藍牙功能原則上只支援 AVR。
  - 開發板容易購買，最常見的就是 Pro Micro。
  - 週邊電路簡單，PCB Layout 方便，佔用空間也少。
  - 有 QFP 封裝，適合手工焊接。
  - 可以使用 5V 或 3.3V。
  - 電路圖 Schematic 可以參考 Pro Micro。
- 缺點：
  - 32 KB 的 Flash 真的很小，如果鍵盤想要比較多或複雜的功能的話，空間可能會不夠。
  - 貴，從上面的比較表應該不難看出 ATmega32U4 的規格是最弱最舊的，但是它卻一點也不便宜。
  - GPIO 數量不多，如果沒有要加其它零件的話，25 腳應該還夠，但如果要加其它零件的話可能就會不夠用。
  - 如果是單買 IC 本身，出廠大概不會幫你燒 Bootloader，你可能要另外用燒錄器燒。
- 要注意的事：
  - 如果你編譯出來的韌體大小真的裝不進 32 KB 的 Flash 的話可以參考官方的文件：[Squeezing Space from AVR](https://docs.qmk.fm/#/squeezing_avr)。
  - Pro Micro 分爲紅色的「SparkFun 原廠」和藍色的「副廠/第三方」版，前者約 NT$ 600\~1000，後者約 NT$200\~400，都可以使用。
  - 工作電壓爲 5V 時 CPU 時脈可以到 16MHz；爲 3.3V 時只能到 8MHz。
  - PCB Layout 時記得保留燒錄座。

我自己畫的 ATmega32U4 開發板：[Next μ](https://github.com/siderakb/next-micro)

![Next μ：ATmega32U4 開發板](https://github.com/ziteh/next-micro/raw/v1.0/doc/pcb_render_front.jpg)

## RP2040

[官網][rp]

樹莓派 Raspberry Pi 所推出的 32-bit ARM MCU，硬體規格非常強大，卻超級便宜。與 ATmega32U4 同爲我推薦新手的其中一種 MCU。我自己的 [ErgoSNM](https://github.com/siderakb/ergo-snm-keyboard) v2.1 也是使用 RP2040。

- 優點：
  - QMK 的新寵兒。雖然還比不上 ATmega32U4 的時間累積，但是有越來越多鍵盤將 MCU 換成 RP2040。要找參考資料和問問題也滿方便了。
  - QMK 使用內建的 Bootloader，不用準備燒錄器。
  - 開發板容易購買，不管是官方的 Raspberry Pi Pico 或其它廠商自己出的開發板都很不錯，且各有特色。
  - GPIO 腳位很靈活，如果你要加額外的零件，並會用到 SPI 或 I2C 的話，這點會很方便。
  - 硬體規格強大，用來做鍵盤綽綽有餘。
  - 價格便宜。
  - 電路圖 Schematic 可以參考 Raspberry Pi 官方的參考資料。
- 缺點：
  - 僅有 QFN 封裝，手工焊接需要一定的技術。
  - 要外接 Flash IC，會佔用 PCB 空間與增加 Layout 難度。
  - 週邊電路的電容數量比較多且擠，Layout 難度較高。
- 要注意的事：
  - QMK 針對 RP2040 有個專屬頁面：[Raspberry Pi RP2040](https://docs.qmk.fm/#/platformdev_rp2040)
  - 如果你真的很想用 RP2040 但也真的無法焊接 QFN 的話，可以試著去瞭解 PCBA 服務，現在要使用不會很難也不會很貴。
  - RP2040 的 GPIO **全部都沒有** 5V 承受能力，請僅使用 3.3V。

我自己畫的 RP2040 開發板：[RP Micro](https://github.com/siderakb/rp-micro)

![RP Micro：RP2040 開發板](https://i.imgur.com/sVGqRyk.jpg)

## AT90USB1286

[官網][at90]

是 Microchip（原本是 Atmel，已被前者併購）公司的一款 8-bit AVR MCU。我幾乎沒有看到有人 QMK 鍵盤用這個 MCU，基本上不推薦新手使用，會列在這僅僅是因爲它是 QMK 支援列表中 Flash 容量比 ATmega32U4 大的 AVR MCU。

如果你因爲一些原因一定要用 AVR MCU，但是韌體又超過 32 KB 的話可以考慮這個。

常見的開發板是 Teensy++ 2.0。

## STM32F303CC

[官網][303]

ST 意法半導體龐大的 32-bit ARM MCU 系列——STM32 的一員。在上千的 STM32 型號中特別選這個型號的理由是 QMK 的官方開發板 [Proton C](https://qmk.fm/proton-c) 使用的 MCU 就是 STM32F303CCT6。

如果你想要看不同腳位數/ROM/RAM/封裝的話，可以看 [STM32F303 系列](https://www.st.com/en/microcontrollers-microprocessors/stm32f303.html)

## STM32F401CC

[官網][401]

ST 意法半導體龐大的 32-bit ARM MCU 系列——STM32 的一員。在上千的 STM32 型號中特別選這個型號的理由是它的開發板特別好買，且 QMK 的支援硬體清單中也有特別列出 F401。

如果你想要看不同腳位數/ROM/RAM/封裝的話，可以看 [STM32F401 系列](https://www.st.com/en/microcontrollers-microprocessors/stm32f401.html)

# 無線藍牙

QMK 的藍牙是透過模組支援的，且原則上僅限 AVR MCU。可以參考：[\[自製QMK鍵盤-番外\] 爲QMK鍵盤加上Bluetooth藍牙無線功能](/posts/diyqmkkeyboard-ble/)

不過在現在，如果你想要做藍牙鍵盤的話，我可能會另外推薦你 [ZMK](https://zmk.dev/) 和 nRF5 系列 SoC （如 [nRF52840](https://www.nordicsemi.com/products/nrf52840?lang=zh-TW)）。

[32u4]: https://www.microchip.com/en-us/product/atmega32u4
[at90]: https://www.microchip.com/en-us/product/AT90USB1286
[rp]: https://www.raspberrypi.com/documentation/microcontrollers/rp2040.html
[303]: https://www.st.com/en/microcontrollers-microprocessors/stm32f303cc.html
[401]: https://www.st.com/en/microcontrollers-microprocessors/stm32f401cc.html

# 相關文章

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
