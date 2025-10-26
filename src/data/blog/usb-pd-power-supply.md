---
title: 基於 USB PD 供電的可程式直流電源供應器研究
tags:
    - DIY
    - 電子電路
date: 2025-10-26T18:07:00+08:00
comments: true
toc: true
draft: false
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
- VBUS Discharge

### MCU

MCU 如果有 USB 可以方便從電腦控制：

- RP2040：很便宜且規格很好，UF2 DFU 很方便，但是外圍電路偏複雜且要外接 Flash，GPIO 沒 5V-tolerant
- STM32C071G8U6：Cortex-M0+ 48MHz，QFN-28 的小型 MCU，基本外圍電路很簡單只需要 VDD 加兩個 MLCC 去耦電容，不用外接振盪器也可以用 USB 2.0 FS 12Mbps
- STM32F030C8T6：Cortex-M0 48MHz，LQFP-48。沒有 USB，但是很便宜。

但是因為考慮 PD 供電和電腦之間可能不共地，所有需要做隔離保護。最直接的方式應該是直接對要接電腦的 USB 做隔離，但是就是是 USB 2.0 12mbps 的隔離 IC 也很貴，一個更便宜的方案是 USB 進來後先透過 USB-to-TTL 轉成 UART，再透過 UART 隔離 IC 接到 MCU，UART 隔離 IC 的價格比 USB 隔離 IC 便宜很多。如果是這樣的話那 MCU 就不用 USB PHY 了。如果需要單一通道的訊號隔離也可以透過光耦完成。

### 方案 A

首先最簡單的方案就是和 PocketPD 這些專案一樣，直接找個 PD Sink controller，把控制電壓電流甚至相關保護的事情都交給上游的 PD 變壓器，我們只需要負責送出協商命令即可。這樣的話基本上只需要一個 PD Sink controller 就可以了，但是畢竟目標是實驗用的電供，保護措施最好還是在前端加一下，我覺得至少 SCP 快速關斷可能要加。

找了一些看起來不錯的 PD Sink controller：

- AP33772：PocketPD 用的
- CH224：常見於所謂的平價 PD 誘騙器
- TPS25730：Sink only，無 PPS。有兩個版本，差別是有無內建的 Back-to-back FET。有 OVP 和 RCP
- TPS25751：DRP，有 PPS。有兩個版本，差別是有無內建的 Back-to-back FET。有 UVP、 OVP 和 RCP
- STUSB4500：Sink only

eFuse 可以用來提供快速的 SCP：

- TPS1663：有 SHDN pin 可以從外部關斷
- TPS2663：有 SHDN pin 可以從外部關斷。可以增加一個 N-FET 來和內部的 FET 組成 Back-to-back 來達成 RCP。Sink only 時 PP5V pin 可以接地 [^tps2663_1][^tps2663_2]。

[^tps2663_1]: [TPS25751: Do I need to supply 5v if sinking only? - Power management forum - Power management - TI E2E support forums](https://e2e.ti.com/support/power-management-group/power-management/f/power-management-forum/1426073/tps25751-do-i-need-to-supply-5v-if-sinking-only)
[^tps2663_2]: [[FAQ] TPS25750: How do I create a Sink-Only USB-C PD port to replace a legacy Barrel Jack Connector? - Interface forum - Interface - TI E2E support forums](https://e2e.ti.com/support/interface-group/interface/f/interface-forum/988215/faq-tps25750-how-do-i-create-a-sink-only-usb-c-pd-port-to-replace-a-legacy-barrel-jack-connector)

在這個方案中，我會選擇 TPS25751 + TPS1663 的組合，RCP 由前者提供，後者就專心處理 SCP 即可，另外 TPS1663 有 SHDN pin 可以由 MCU 控制，可以可以打從電供上的 OUTPUT 按鈕功能。

這個方案的優點是簡單，因為真正的電壓電流控制都不是我們做，所以實際上的可用配置要看上游，而且也會要求上游 PD 要支援 PPS 功能。一個比較明顯的問題是可調電壓範圍，有些 PD PPS 變壓器的範圍是 5.0-20V，有些是 3.3-20V，但是 3.3V 的輸出電壓對我來說可能不夠低，我希望至少可以到 1.8V。

### 方案 B

由於方案 A 的電壓控制範圍完全看上游的供電控制能力，且低電壓不夠低，因此另一個方案就是由我們來控制電壓，為此我們需要一個高功率 DC/DC Converter。大部分的 Buck-boost Converter 都是直接用 Feedback 分壓電阻來控制輸出電壓，但是因為我們要可程式電壓，雖然也有利用數位電位器或 DAC 的方案，但是我還是找了有 I2C 的 IC。這些其實都是 PD PPS Source，且有內建一定的保護功能:

- MP4245
- MP8859
- TPS55288
- TPS55289
- RT6190

在這個方案中我會選擇 MP4245，因為它有明確的說到它有定電流（CC）模式，如果負載電流超過設定電流上限，則會開始控制並降低電壓，在 TI 的那兩個型號中對於 CC 的具體行為沒有更詳細的描述。

## 設計

最後我選擇了方案 B。PD Sink 使用 CH224 來向上游要求供電，透過一個用於 RCP 的 SS54 Schottky 連接到 MP4245，MC4245 會負責將電壓和電流控制在設定值，輸出直接接到連接器，就沒再加針對輸出的 RCP 了。MCU 使用 STM32F030C8T6，一組 UART 透過 ADuM1201AR 隔離 IC 可以用來連接電腦，沒加板載 USB-to-TTL IC 所有要外掛。MCU 的供電是從 CH224 之後的 VBUS 提供，透過 TPS5431 Buck 降壓到 3.3V，選它是因為很便宜。

如果想監控電壓和電流的話，MC4245 有 I2C Reg 可以讀。

對於 MC4245 可能的 FB 電阻組合：

- 10k / 90k: ratio=10.0，Vout 範圍 ≈ 1.00 \~ 16.380 V
- 6.2k / 80.6k: ratio=14.0，Vout 範圍 ≈ 1.40 \~ 22.932 V

![Schematic 1](https://bucket.ziteh.dev/blog/usb-pd-power-supply/sch1.webp)

![Schematic 2](https://bucket.ziteh.dev/blog/usb-pd-power-supply/sch2.webp)

大功率走線都直接鋪銅，但是這個線寬在 1oz 的 PCB 上跑 3A 其實還是不太夠。

![PCB Layout](https://bucket.ziteh.dev/blog/usb-pd-power-supply/layout1.webp)

雖然 PCB 是畫好了，但是我暫時沒有生產測試的打算，也不確定現在這個方案是不是真的可以運作，就先做個記錄，如果未來真的要做下去的話再分享。

GitHub repo: <https://github.com/ziteh/pd-power-supply>
