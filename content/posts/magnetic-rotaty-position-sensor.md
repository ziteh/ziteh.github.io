---
title: '常見磁性旋轉位置感測器/旋轉編碼器比較'
author: ZiTe
tags:
  - 電子電路
  - 馬達
date: 2022-11-30 07:15:00
comment: true
toc: true
draft: false
aliases: ["/2022/11/magnetic-rotaty-position-sensor/"]
---

# 正文

最近在研究馬達控制板，並且考慮整合一個位置 sensor，因此稍微整理了一些比較常見的磁性旋轉位置感測器。

<!--more-->

| 型號                                                                                                                                      | 解析度 (bit) | 轉速 (rpm) | 通訊        | Encoder ABI | Hall UVW | PWM        | 供電 (V)         | 封裝                  |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- | ----------- | ----------- | -------- | ---------- | ---------------- | --------------------- |
| [AS5047D](https://ams.com/as5047d)                                                                                                     | 14 or 11     | 14.5k      | SPI (10MHz) | ✔           | ✔        | ✔          | 3.3 or 5.0       | TSSOP-14              |
| [AS5047P](https://ams.com/as5047p)                                                                                                     | 14 or 12     | 28k        | SPI (10MHz) | ✔           | ✔        | ✔          | 3.3 or 5.0       | TSSOP-14              |
| [AS5047U](https://ams.com/as5047u)                                                                                                     | 14           | 28k        | SPI (10MHz) | ✔           | ✔        | ✔          | 3.3 or 5.0       | TSSOP-14              |
| [AS5147](https://ams.com/as5147)                                                                                                       | 14 or 11     | 14.5k      | SPI (10MHz) | ✔           | ✔        | ✔          | 3.3 or 5.0       | TSSOP-14              |
| [AS5147P](https://ams.com/as5147p)                                                                                                     | 14 or 12     | 28k        | SPI (10MHz) | ✔           | ✔        | ✔          | 3.3 or 5.0       | TSSOP-14              |
| [AS5147U](https://ams.com/as5147u)                                                                                                     | 14           | 28k        | SPI (10MHz) | ✔           | ✔        | ✔          | 3.3 or 5.0       | TSSOP-14              |
| [AS5045B](https://ams.com/AS5045B)                                                                                                     | 12           | 30k        | SSI         | ✔           | ❌       | ✔          | 3.3 or 5.0       | SSOP-16               |
| [AS5040](https://ams.com/AS5040)                                                                                                       | 10           | 30k        | SSI         | ✔           | ✔        | ✔          | 3.3 or 5.0       | SSOP-16               |
| [AS5601](https://ams.com/AS5601)                                                                                                       | 12           | ?          | I2C         | ✔ (AB only) | ❌       | ❌         | 3.0\~3.6 or 4.5\~5.5 | SOIC-8                |
| [AS5600](https://ams.com/as5600)                                                                                                          | 12           | ?          | I2C         | ❌          | ❌       | ✔ (or 12 bit analog) | 3.0\~3.6 or 4.5\~5.5 | SOIC-8                |
| [TLE5012B E1000](https://www.infineon.com/cms/en/product/sensor/magnetic-sensors/magnetic-position-sensors/angle-sensors/tle5012b-e1000/) | 15           | ?          | SSC         | ✔ (IIF)     | ❌       | ❌         | 3.0~5.5          | SOP-8                 |
| [MA730](https://www.monolithicpower.com/en/ma730.html)                                                                                    | 14           | 60k        | SPI         | ✔ (12 bit)  | ❌       | ✔ (14 bit) | 3.3              | QFN-16 (3x3mm)        |
| [MA702](https://www.monolithicpower.com/en/ma702.html)                                                                                    | 12           | 60k        | SPI         | ✔ (10 bit)  | ❌       | ✔ (12 bit) | 3.3              | QFN-16 (3x3mm)        |
| [MT6816](https://www.magntek.com.cn/en/list/177/517.htm)                                                                                  | 14           | 25k        | SPI (16MHz) | ✔           | ✔        | ✔ (12 bit) | 3.3~5.0          | SOP-8                 |
| [MT6701](https://www.magntek.com.cn/en/list/177/559.htm)                                                                                  | 14           | 55k        | SSI or I2C  | ✔           | ✔        | ✔ (12 bit) | 3.3~5.0          | SOP-8, QFN-16 (3x3mm) |
> 上表僅供參考，請以官方資料爲準。

- `TLE5012B` 是一個系列，其中 `TLE5012B E1000` 是有 Encoder ABI (IIF) 輸出的版本，不同版本有不同的輸出方式。
- `TLE5012B` 系列所使用的 SSC 通訊很類似 SPI，只是把 MOSI 及 MISO 合併，可以看作是半雙工版本的 SPI。
- 各種感測器所使用的技術可能不同，例如 `MT6816` 使用 Anisotropic Magneto Resistance (AMR)，`TLE5012B` 使用 Giant Magneto Resistance (GMR)。
- `AS5x47` 系列有 [DAEC (Dynamic Angle Error Compensation)](https://ams.com/en/daec)，可以改善高轉速下的輸出延遲。
- `TLE5012B` 在高轉速下的延遲表現不如擁有 DAEC 的 `AS5x47`，但是便宜。
- `TLE5012B`、`MT6816` 及 `MT6701` 有 SOP-8 封裝，就算只有電烙鐵手工焊接也可以輕鬆完成；TSSOP-14、SSOP-16 只用電烙鐵的話稍微需要一點技術與經驗；QFN-16 只用電烙鐵的話需要有很好的技術，通常會用熱風槍、加熱台或回流焊。
- `AS5x47` 系列與 `MA730` 滿多人用的，採購方便。`AS5600`相當便宜且容易購買。

# 參考資料
- [各厂商磁编码器对比，AS5047、AS5048、AS5600、TLE5012、MA730_Mark_md的博客-CSDN博客_tle5120](https://blog.csdn.net/Mark_md/article/details/100181701)
- [[STM32學習記錄-7] AS5047P 旋轉位置感測器/磁性編碼器使用教學 | ZiTe 本物誌](https://ziteh.github.io/2022/04/learningstm32-as5047p/)
- [ams OSRAM 的角度感測器列表](https://ams.com/en/angle-position-on-axis)


