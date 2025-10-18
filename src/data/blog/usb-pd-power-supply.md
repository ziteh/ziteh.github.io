---
title: 基於 USB PD 供電的可程式直流電源供應器研究
tags:
    - DIY
    - 電子電路
date: 2025-10-12T12:49:22+00:00
comments: true
toc: true
draft: true
---

因為最近在開發 ErgoSNM v4 的核心板，但是手邊沒有可調直流電源供應器，所以想說來研究一下使用 USB PD（Power Delivery）來自己做一個看看。

<!-- more -->

## 現成

市面上已經有一些透過 USB PD 來供電的可調直流電源供應器，例如：

- MINIWARE MDP-P906（300W）
- FNIRSI DPS-150（150W）
- 正點原子 DP100（100W）

但我看不到這些商業化產品的內部是如何實現的，所以我需要找找 GitHub：

- [CentyLab/PocketPD_HW: Hardware repo for PocketPD](https://github.com/CentyLab/PocketPD_HW)
- [z4yx/USB-C-PPS: USB-PD charger as a programmable power supply.](https://github.com/z4yx/USB-C-PPS?utm_source=chatgpt.com)
- [tobychui/PD-Adjustable-DC-Power-Supply: A DIY, USB PD powered, pocket sized adjustable DC / lab bench power supply for electronic makers](https://github.com/tobychui/PD-Adjustable-DC-Power-Supply?utm_source=chatgpt.com)
- [wagiminator/ATtiny814-USB-PD-Adapter: USB Type-C Power Delivery Trigger and Monitoring Board](https://github.com/wagiminator/ATtiny814-USB-PD-Adapter?utm_source=chatgpt.com)

以 PocketPD 為例，它基本上就是一個 PD PPS（Programmable Power Supply）Sink，並直接向上游的 PD Source（即充電器）要求電壓和電流，這樣做有個好處就是不用實作複雜的電壓電流環控制器，通通交給上游的 PD Source 就好，壞處就是你要有支援 PD PPS 的充電器，且它要能夠提供符合你預期的電源。它所使用的關鍵零件如下：

- USB PD controller: [AP33772](https://www.diodes.com/part/view/AP33772)
- Current sensor: [INA226](https://www.ti.com/product/INA226)
- Ideal diode: [LM7310](https://www.ti.com/product/LM7310) x2
- MCU: [RP2040](https://www.raspberrypi.com/products/rp2040/)

RP2040 透過 I2C 控制 AP33772 來向 PD Source 協商電源，AP33772 有自帶電流感測但這裡沒用，AP33772 有帶 Gate driver 可以外接 FET 用來關斷 VBUS 但這裡沒用（而是靠 LM7310）。兩顆 LM3710 負責關斷電源路徑，由 RP2040 控制。INA226 透過一個 5mOhm 的 Shunt 來讀取電壓，透過 I2C 報給 RP2040，它有一個 ALERT pin 可用在故障時快速切斷 LM3710 但是這裡沒有這麼做。一個簡單的電阻分壓用來量測輸入電壓。

## 我的方案

### 要求

可以的話儘可能滿足這些規格：

- 輸出規格：1.6V~20V, 5A, 60W
- Slew rate control
- Overvoltage protection（OVP）
- Undervoltage protection（UVP）
- Overcurrent protection（OCP）
- Short-circuit protection（SCP）
- Reverse current protection（RCP）
- Overpower protection（OPP）
- Overtemperature protection（OTP）
- Inrush current protection
- Discharge

### 選零件

首先是 PD Sink Controller，我找了一些看起來不錯的 PD Sink Controller：

- AP33772
- CH224：常見於所謂的平價 PD 誘騙器
- TPS25730：Sink only，無 PPS。有兩個版本，差別是有無內建的 Back-to-back FET。有 OVP 和 RCP
- TPS25751：DRP，有 PPS。有兩個版本，差別是有無內建的 Back-to-back FET。有 UVP、 OVP 和 RCP
- STUSB4500： Sink only

eFuse 可以用來提供快速的 SCP：

- TPS1663：有 SHDN pin 可以從外部關斷
- TPS2663：有 SHDN pin 可以從外部關斷。可以增加一個 N-FET 來和內部的 FET 組成 Back-to-back 來達成 RCP。Sink only 時 PP5V pin 可以接地 [^tps2663_1][^tps2663_2]。

[^tps2663_1]: [TPS25751: Do I need to supply 5v if sinking only? - Power management forum - Power management - TI E2E support forums](https://e2e.ti.com/support/power-management-group/power-management/f/power-management-forum/1426073/tps25751-do-i-need-to-supply-5v-if-sinking-only)
[^tps2663_2]: [[FAQ] TPS25750: How do I create a Sink-Only USB-C PD port to replace a legacy Barrel Jack Connector? - Interface forum - Interface - TI E2E support forums](https://e2e.ti.com/support/interface-group/interface/f/interface-forum/988215/faq-tps25750-how-do-i-create-a-sink-only-usb-c-pd-port-to-replace-a-legacy-barrel-jack-connector)

大部分的 Buck-boost Converter 都是直接用 Feedback 分壓電阻來控制輸出電壓，但是因為我們要可程式電壓，雖然也有利用數位電位器或 DAC 的方案，但是我還是找了有 I2C 的 IC。這些其實都是 PD PPS Source，且有內建一定的保護功能:

- MP4245
- MP8859
- TPS55288
- TPS55289
- RT6190

MCU 希望有 USB，這樣未來可以方便從電腦控制：

- RP2040：很便宜且規格很好，UF2 DFU 很方便，但是外圍電路偏複雜且要外接 Flash，GPIO 沒 5V-tolerant
- STM32C071G8U6：Cortex-M0+ 48MHz，QFN-28 的小型 MCU，基本外圍電路很簡單只需要 VDD 加兩個 MLCC 去耦電容，不用外接振盪器也可以用 USB 2.0 FS 12Mbps
