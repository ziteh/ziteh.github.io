---
title: Raspberry Pi NAS 方案研究
tags:
  - 3C
  - 生活
date: 2025-11-16T20:49:00+08:00
comments: true
toc: true
draft: false
---

最近突然在想用 Raspberry Pi 來組 NAS 的想法，所以把一些資料記錄一下。

<!--more-->

## 需求

1. RAID。基本需求，軟體 RAID 的優勢是不會被硬體綁住，以 TrueNAS ZFS 來說，在 TrueNAS 上建立的 Pool 不受限於當前的 OS 或硬體，你把該硬碟（組）拔下來接到隨便一個有裝 ZFS 的 Linux 上都可以存取檔案。硬體 RAID 的話你不能期待在 A RAID 卡上做的陣列可以在 B RAID 卡上運作並存取。
2. Snapshot。最重要功能，這是現階段無論是防禦勒索病毒還是手誤的*最低成本*也是最方便的手段，而且如果要進行更進一步的離線備份或鎖定功能（WORM）也可以基於 Snapshot 之上。
3. 2.5GbE。有的話比較好，就算是 HDD，1GbE 也會造成讀寫速度瓶頸，更別說 RAID 的速度加成，甚至是 ZFS 的 Cache（ZIL、ARC、L2ARC）。
4. SATA 12V。有些人可能會遺漏的點，3.5 HDD 基本上都要 12V 的供電，但有些比較便宜的方案的 SATA 可能只有 5V 供電，這樣就無法接 3.5 HDD。這種問題在 USB-to-SATA 上很常見。

## 軟體

重點應該是 ZFS 或 Btrfs，這兩個都是有 snapshot 和 RAID 功能的檔案系統。ZFS 的話因為我現在的 NAS 是 TrueNAS CE 所以對它稍微比較熟悉，Btrfs 的話沒有實際用過。

Btrfs 比較大的缺點應該是 RAID5/6 還不夠成熟，不過我自己的話是不會用它們所以沒差。我現在的 TrueNAS 是 3 個 HDD 組 Mirror（既傳統上說的 RAID1），可以同時壞 2 顆（N-1）。Btrfs 的 RAID1 和傳統說的 RAID1 行為上比較不同，無論組成數量它都只容許單一硬碟故障，如果我要重現上述 TrueNAS 的行為要使用 RAID1c3。

由於我的 NAS 其實沒什麼特別的功能或服務要跑，嚴格說起來有 SSH 和 SMB/NFS 就差不多了，所以不一定要用 OMV 這種 OS，直接用個 Headless Linux 應該也差不多。就算真的要跑服務，再拿個獨立的 RPi 跑也可以。

雖然網路上也有其他人在 RPi 上跑 ZFS，但我可能要實驗一下是不是 Btrfs 更適合 RPi，畢竟我的資料儲存需求其實沒要求那麼硬，ZFS 可能還是有點 Overkill 了。

## 硬體

> 以下規格僅供參考

### 配件

#### Radxa Taco

基本規格參考：

- 5x SATA III (Data + Power, 2.5 or 3.5)
- 1x 2.5GbE RJ45
- 1x 1GbE RJ45
- 1x M.2 M-Key (NVMe SSD 2280)
- 1x M.2 E-Key
- 1x USB 2.0（沒有 USB 3.0）
- 1x HDMI
- 1x RTC 電池座
- 1x microSD 卡槽
- 1x 12V DC (5.5 x 2.5) power in
- 1x ATX 4-Pin power in

要連接 Radxa CM3 或 RPi CM4，不支援 RPi CM5。根據 Jeff Geerling 提供的資訊：

- PCIe Switch: ASMedia ASM1806
- NIC: Realtek RTL8125B
- SATA controller: JMB585

參考：

- [Radxa Taco](https://radxa.com/products/io-board/taco/)
- [The RETURN of the TACO! (SATA's last stand)](https://youtu.be/_wFJY7Gl3lw)
- [I built a $5,000 Raspberry Pi server (Radxa Taco NAS)](https://youtu.be/G_px298IF2k)
- [Test Radxa Taco 5x SATA NAS with 2.5G and 1G Ethernet · Issue #268 · geerlingguy/raspberry-pi-pcie-devices](https://github.com/geerlingguy/raspberry-pi-pcie-devices/issues/268)

#### Radxa Penta SATA HAT

基本規格參考：

- 4x SATA III (Data + Power, 2.5 or 3.5)
- 1x eSATA
- 1x 12V DC (5.5 x 2.5) power in
- 1x Molex 4-Pin power in

兼容於：RPi 5、Radxa ROCK 5C/5A/4A/4B/4A+/4B+/4SE/3C/3A，透過 PCIe 連接（IPEX）。SATA controller 是 JMB585。

參考：

- [Radxa Penta SATA HAT](https://radxa.com/products/accessories/penta-sata-hat)
- [The ULTIMATE Raspberry Pi 5 NAS](https://youtu.be/l30sADfDiM8)
- [Pi 5 HAT: Radxa Penta SATA HAT · Issue #615 · geerlingguy/raspberry-pi-pcie-devices](https://github.com/geerlingguy/raspberry-pi-pcie-devices/issues/615)

#### Waveshare PCIe TO 2-CH SATA HAT+

- 2x SATA III
- 2x 4-Pin 硬碟供電輸出（5V & 12V）
- 1x 12V DC power in

### 主板

#### Raspberry Pi 5

- CPU: BCM2712, 4xA76 2.4GHz
- LPDDR4X 2GB/4GB/8GB/16GB
- 1x 1GbE RJ45
- 2x USB 3.0
- 2x USB 2.0
- 1x microSD
- 2x Micro HDMI
- 1x PCIe 2.0x1
- WiFi5 & BT5.0
- 1x USB Type-C 5V/5A power in

#### Orange Pi 5 Max

- CPU: RK3588, 4xA76 2.4GHz + 4xA55 1.8GHz
- RAM: LPDDR5 4GB/8GB/16GB
- 1x 2.5GbE RJ45 (RTL8125BG)
- 1x M.2 M-Key (NVMe SSD 2280, PCIe3.0x4Lane)
- 2x USB 3.0
- 2x USB 2.0
- 1x microSD
- 1x eMMC
- 2x HDMI 2.1
- WiFi6E & BT5.3
- 1x USB Type-C 5V/5A power in

#### Radxa ROCK 5A

- CPU: RK3588S, 4xA76 2.4GHz + 4xA55 1.8GHz
- RAM: LPDDR4X 4GB/8GB/16GB/32GB
- 1x M.2 E-Key
- 1x 1GbE RJ45
- 1x USB 3.0 Host
- 1x USB 3.0 OTG
- 2x USB 2.0
- 1x microSD
- 1x eMMC
- 2x Micro HDMI
- 1x USB Type-C power in

#### Radxa ROCK 5C (非 Lite )

- CPU: RK3588S2, 4xA76 2.4GHz + 4xA55 1.8GHz
- RAM: LPDDR4X 4GB/8GB/16GB/32GB
- 1x 1GbE RJ45
- 1x USB 3.0 Host
- 1x USB 3.0 OTG/Host
- 2x USB 2.0
- 1x microSD
- 1x eMMC
- 1x HDMI
- WiFi6 & BT5.4
- 1x USB Type-C power in

### 方案

#### Radxa Taco + RPi CM4

這可能是同時需要 SATA 和 2.5GbE 下的最好方案。

Radxa Taco 可以接 RPi CM4 或 Radxa CM3，前者的 CPU 是 BCM2711 4xA72 1.5GHz 和 LPDDR4 1/2/3/8GB，後者是 RK3566 4xA55 1.8GHz 和 LPDDR4 1/2/3/8GB，兩者的 CPU 性能差異不會很大，所以我的話可能會為了穩定性和資料豐富度更傾向 RPi CM4。

比較明顯的缺點可能是沒有 USB 3.0，但是如果是要做 NAS 的話，SATA 和 2.5GbE 都已經有了，好像也不需要 USB 3.0。如果要外接硬碟做離機備份，那也可以直接接 SATA。

有直接的 RTC 電池座也很方便，不用再找接頭接。

可能的陷阱是 SATA 和 2.5GbE 都是透過 ASM1806 擴充，而且 RPi CM4 提供的應該是 PCIe 2.0x1，所以不能期望這些 SATA 和 2.5GbE 可以同時完全跑滿。

#### Radxa Penta + RPi 5

想要 SATA 且 2.5GbE 需求較低。

RPi 5 的 CPU 多少比 4 代的強，Radxa Penta 透過 PCIe FFC 連接並擴展 4+1 個 SATA。但是和 Radxa Taco + RPi CM4 的組合比就缺少了 2.5GbE，如果真的想要的話可能要用 USB RJ45 網卡擴充，但是 USB 2.5GbE 網卡的穩定性有待商榷。

如果目標只需要 2 個 SATA 的話可以改成 Waveshare PCIe TO 2-CH SATA HAT+ 比較便宜。

如果想要 CPU 多核心性能更好的話可以把 RPi 5 改成 Radxa ROCK 5A/C。跑分上 RK3588S 的多核是比 BCM2712 強一點點，不過單核的話還是後者強一點。

#### Orange Pi 5 Max

一個可能但是詭異的方案是 OPi 5 Max。

它已經板載 2.5GbE 和 M.2 M-Key PCIe3.0。如果你只需要一個 M.2 2280 SSD 的話甚至不用其它配件，但是如果需要多個 SATA 的話可能就需要從 M.2 分出來了，也就是市面上常見的 JMB585 M.2-to-SATA 轉接板，但這種搭配的穩定度如何有待商榷，而且 SATA 供電也要另外處理。或是乾脆用 USB 3.0 的硬碟外接盒。

#### M.2 SSD NAS

如果目標是 M.2 2280 SSD NAS 的話，比較方便且便宜的配件應該是 Waveshare 的擴充板，他們有好幾種擴充板，你可以為 RPi 5 接上 1、2 或 4 個 M.2 2280 SSA。

- PCIe TO M.2 Board (D)
- PCIe TO 2-CH M.2 HAT+ (B)
- PCIE TO 4-CH NVME Board (B)

#### 其他可能性

[ZimaBoard 2](https://www.zimaspace.com/products/single-board2-server) 有 2x 2.5GbE + 2x SATA III + 1x PCIe 3.0，CPU 是 Intel N150 (x86) 4C4T 3.6GHz，規格上來說很符合需求，2 個 SATA 可能有點少但是可以透過 PCIe 擴充。8GB RAM 的話跑 TrueNAS 勉強還行，焊死的 eMMC 可能是最大的隱患，但一樣可以透過 PCIe 來解決。
