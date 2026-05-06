---
title: ESP32-S3 PCB 電路圖研究
tags: ["嵌入式", "電子電路"]
categories: []
date: 2025-08-01T07:46:31+08:00
comments: true
toc: false
draft: false
---

最近因為一些原因想要弄個 ESP32-S3 的板子來用，所以稍微研究了一下 ESP32-S3 的電路怎麼畫。雖然這個電路暫時沒有 Layout，也沒有實際生產，但可以做個記錄。

<!--more-->

![我的電路圖](https://bucket.ziteh.dev/blog/esp32-s3-sch/esp32-s3_sch.webp)

我主要是參考官方的[設計指南](https://docs.espressif.com/projects/esp-hardware-design-guidelines/zh_CN/latest/esp32s3/schematic-checklist.html)和 [ESP32-S3-Stick](https://github.com/JosueAGtz/ESP32-S3-Stick) 這兩個資源來畫電路的。

首先是選擇 ESP32-S3 的型號，它主要分了 7 種不同的型號，由於我不想要另外接 Flash ROM，所以我把目標放在有封裝內 Flash 的 ESP32-S3**FN8**（8MB Flash）和 ESP32-S3**FH4R2**（4MB Flash + 2MB PSRAM）。**FH4R2** 雖然還多了 2MB 的 PSRAM，但是它的 IC 封裝的 QFN56 的 EP 會變成 7x7mm，而其它型號都是 4x4mm，這個可能會造成 Layou 難度稍微上升。考慮到我覺得原本內建的 512KB SRAM 應該也很夠了，所以我選擇 **FN8**。

首先是各個電源腳附近的去藕電容，我就照著官方指南的擺放。需要注意的是 `VDD_SPI` 可以當輸入也可以輸出，由於我不打算外接 Flash 和 PSRAM，所以這個腳我可以不使用，不過我還是保留焊盤和一個 0Ω 的電阻 `R6`。另外官方建議 `VDD3P3` 要有個電感抑制高頻，但我的應用可能要求沒那麼高，所以保留了一個 0Ω 的電阻 `R7` 做 Co-layout。

40MHz 振盪器的話官方也是建議接一個串聯電感來抑制，我一樣放一個 0Ω 的電阻 `R7` 做 Co-layout，如果實際應用影響不大的話可以用電阻取代電感。

ESP32-S3 有個比較麻煩的是 `CHIP_PU` 腳，這個腳就是 Enable 或一般的 Reset，要給 `HIGH` IC 才會工作，但是它的上電時序要求比電源的 3.3V 還晚至少 50µs。一般的做法是用一個簡單的 RC 充電電路來延遲，但這種方法不是很保險。我的做法是使用 LDO `LP5912` 的 `PG` (Power-good) 腳，這個 `PG` 有內建 140µs 的延遲，而且內部是 Open-drain 結構，所以我拿來接 `CHIP_PU` 應該沒問題，`C17` 應該也可以省略。 Net Tie 只是單純用來隔離走線網路名稱。

ESP32-S3 的 UART0 可以用來下載韌體，因此要拉出，雖然它也可以透過 USB 下載。官方建議 `U0TXD` 加一個串聯電阻。

USB 的部分保留兩個串聯電阻靠近 IC 方便未來做調整匹配，ESD 部分我使用小封裝的 USBLC6-2P6。

天線的話，因為其實我沒有打算用無線功能，所以就沒有特別處理和研究。

整體來說我覺得 ESP32-S3 的外圍電路元件還不少，不過官方的文件滿清楚且詳細的，所以沒什麼問題。不過這個電路目前沒有實際製作和測試，不確定這樣的電路圖是不是真的沒問題。

## 參考

- [ESP32-S3 Wi-Fi & BLE 5 SoC | Espressif Systems](https://www.espressif.com/en/products/socs/esp32-s3)
- [原理图设计 - ESP32-S3 - — ESP 硬件设计指南](https://docs.espressif.com/projects/esp-hardware-design-guidelines/zh_CN/latest/esp32s3/schematic-checklist.html)
- [JosueAGtz/ESP32-S3-Stick: ESP32-S3 is a dual-core XTensa LX7 MCU, capable of running at 240 MHz. Apart from its 512 KB of internal SRAM, it also comes with integrated 2.4 GHz, 802.11 b/g/n Wi-Fi and Bluetooth 5 (LE) connectivity that provides long-range support. It has 45 programmable GPIOs and supports a rich set of peripherals.](https://github.com/JosueAGtz/ESP32-S3-Stick)
