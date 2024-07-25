---
title: 'STM32 延伸內容'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
  - 嵌入式
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-10-12 09:10:00
comments: true
toc: true
draft: false
aliases: ["/2022/10/libopencm3-stm32-29/"]
---

# 前言
在之前的篇章中，我們專注在 LibOpenCM3 這個開源的函式庫上，然而如同我在第一天所寫的，STM32 的世界是很多元的，因此在在一篇文章中，我想簡單介紹與 STM32 有關的延伸內容，希望這些對想要更進一步研究 STM32 的人提供一些方向。

<!--more-->

# Mbed
[Mbed](https://os.mbed.com/) 是 ARM 官方主導的開源 IoT OS，目的是讓開發人員可以更快速且方便的為 ARM 架構的裝置進行開發。

最大的特色應該是支援 Mbed 的裝置（如多數的 STM32 Nucleo 開發板）透過 USB 連接上電腦時會模擬成隨身碟，只要將編譯好的 Mbed 韌體用複製貼上的方式就可以完成燒錄。

# Zephyr
[Zephyr](https://zephyrproject.org/) 是一個開源的 RTOS，目前由 Linux 基金會維護。

作為一個開源的 RTOS，它相容許多不同的 MCU，甚至是非 ARM 架構的 CPU（如 x86、RISC-V 或 Tensilica Xtensa）也支援。

# Qemu STM32
[Qemu STM32](http://beckus.github.io/qemu_stm32/) 是專門針對 STM32 [Qemu](https://www.qemu.org/) 的模擬器版本。

有些時候，你可能會想要進行一些硬體模擬，那 Qemu 應該可以幫上忙。

# IAP
In-application programming（IAP）是 STM32 所提供的一項功能，讓你可以透過各種通訊介面（如 USART）來更新 STM32 中的運作程式，而不必使用燒錄器（ST-Link）。

有關 IAP 的介紹可以參考 [AN4657](https://www.st.com/content/ccc/resource/technical/document/application_note/27/38/37/58/c2/8c/40/07/DM00161366.pdf/files/DM00161366.pdf/jcr:content/translations/en.DM00161366.pdf)。

# Rust
[Rust](https://www.rust-lang.org/zh-TW/) 是一個程式語言，近年來它因為高效率與安全性聞名，進而被考慮拿來取代 C/C++。

Rust 也致力於發展嵌入式系統，因此 STM32 也不例外，像是 [stm32-rs](https://github.com/stm32-rs) 就是一個由社群主導的專案。

雖然我自己也還沒寫過 Rust，但我想這是一個可以關注的語言。

> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10306880)。
