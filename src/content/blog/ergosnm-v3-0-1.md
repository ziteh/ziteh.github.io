---
title: "ErgoSNM v3.0 帶軌跡球的無線分離式人體工學QMK鍵盤"
subtitle: "A wireless split ergonomic keyboard with trackball"
# description: ""
tags:
  - DIY
  - 3C
  - QMK
categories: []

date: 2023-12-30T12:55:00+08:00
header_img: ""
comments: true
toc: true
draft: false
featured: true
---

![][pcb1]

[ErgoSNM](https://github.com/siderakb/ergo-snm-keyboard) 是我自己設計並製作的分離式人體工學機械式鍵盤，並且有可以取代滑鼠功能的軌跡球。

之前我已經完成有線版本了，現在是要把它改成無線的。

<!--more-->

更多資訊請看[ErgoSNM——有軌跡球的分離式人體工學QMK鍵盤 (v2.1)](/posts/ergosnm-v2-1-intro/) 與 [ErgoSNM Keyboard | SideraKB](https://siderakb.github.io/docs/category/ergosnm)。

# 架構

雖然就目前來說，我認為無線鍵盤的首選韌體應該是 [ZMK](https://zmk.dev/) 而非 QMK，但是我對 ZMK 和 Zephyr 還不夠熟悉，而且我想要有 [Vial](https://get.vial.today/) 的功能，所以目前還是用 QMK。

為此我參考了 [Mitosis](https://github.com/reversebias/mitosis) 的設計。左右半鍵盤各使用一個 nRF52840 做鍵掃描，再將鍵狀態透過 Gazell 2.4GHz 無線通訊傳給接收器。接收器由一個 nRF52840 和一個 ATmega32U4 組成，nRF52840 為 Gazell central 端接收兩半鍵盤的鍵狀態，再透過 UART 傳給 ATmega32U4。ATmega32U4 運行 QMK 並直接使用 UART 傳入的鍵狀態。

另外，右半還有一個軌跡球（PMW3360），其資料一樣是透過上述的方式傳到 QMK 內處理。

```css
                     [PC]
                       │
                   <USB HID>
                       │
                  [32U4-QMK]
                       │
                    <UART>
                       │
                 [nRF5 Central]
                       │
[nRF52 Left]──<Gazell>─┴─<Gazell>──[nRF52 Right]
                                         │
                                       <SPI>
                                         │
                                     [PMW3360]
```

# PCB

這次一樣請 JLCPCB 生產 PCB。

![左右 PCB][pcb2]

目前的版本是 [Rev 3.0-Alpha](https://github.com/siderakb/ergo-snm-keyboard/releases/tag/v3.0.0-alpha)，只變更了左右半的主 PCB，其餘零件就延續 Rev2.1 的使用。

![右 PCB][layout]

主要就是把 MCU 從 RP2040 改成 nRF52840，但是因為我不想處理天線，所以用的是現成的模組 E73-2G4M08S1C。我原本也有考慮 Raytac 的 MDBT50Q，但是底部焊盤對我這個焊接技術不怎麼樣的人實在是有點麻煩（雖然我有加熱台就是了）。

另外是電池我預計採用的是 eneloop 3 號電池 1.2V。不使用鋰電池是因為我覺得如果兩半同時沒電的話要接兩條 USB 充電，好像有點怪，所以我選擇用換電池的方式。到底適不適合還要再看。

另外 LDO 的輸出入電容我畫成 0402 的了，之後應該會改成 0603。

# 測試

這是第一版的測試，可以看出延遲相當嚴重。

<iframe
  src="https://www.youtube.com/embed/BIOsrYmRqe4?si=dvUb97Nf2RI7gblD"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
  style="width: 100%; height: 315px; border: 0; margin: 20px 0">
</iframe>

這個修改後的版本，延遲已經改善許多了。修改的部分主要是把 QMK 的 UART 接收程式從 `matrix_scan()` 改到 `pointing_device_task_kb()` 內。

<iframe src="https://www.youtube.com/embed/EPGxoYIOgcI?si=n5n0IPBgmPbb8iIb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width: 100%; height: 315px; border: 0; margin: 20px 0"></iframe>

# 後續

其實無線版的 ErgoSNM 對我來說最大的困難是 Zephyr，我花了不少時間在看 Devicetree 怎麼用。

目前的傳輸看起來還不夠好，可能會再想辦法改善。還有比較重要的是耗電量的問題。

不夠如果 QMK 實在是無法滿足需求的話，我還是會直接換去 ZMK。對我來說 ZMK 有這些好處：

1. ZMK 是寬鬆的 MIT License，而 QMK 是 GPL。
2. 用 ZMK 的話就不用額外的接收器，可以直接用 BLE 藍牙。
3. ZMK 已經有包含功耗在內各方面最佳化。

# 相關連結

- [ErgoSNM——有軌跡球的分離式人體工學QMK鍵盤 (v2.1)](/posts/ergosnm-v2-1-intro/)
- [ErgoSNM Keyboard | SideraKB](https://siderakb.github.io/docs/category/ergosnm)
- [ErgoSNM GitHub repo](https://github.com/siderakb/ergo-snm-keyboard)
- [ErgoSNM YouTube 播放清單](https://youtube.com/playlist?list=PL1kBTdTo-vGbdUH9_YovZvkGXuNMB03fa)
- [我的 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [QMK 官網](https://qmk.fm/)

[pcb1]: https://bucket.ziteh.dev/blog/ergosnm-v3-0-1/pcb1.webp
[pcb2]: https://bucket.ziteh.dev/blog/ergosnm-v3-0-1/pcb2.webp
[layout]: https://bucket.ziteh.dev/blog/ergosnm-v3-0-1/layout.webp
