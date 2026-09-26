---
title: "雜七雜八有趣專案分享-1"
subtitle: "邏輯分析儀、致動器、步進馬達驅動器、FOC韌體庫、按鍵可視化"
author: ZiTe
tags:
  - DIY
  - 電子電路
categories: ["雜七雜八專案分享"]
date: 2023-10-29 11:50:00+08:00
comments: true
toc: true
draft: false
---

分享一些我最近在各處看到的有趣專案。

<!--more-->

## μLA 邏輯分析儀

[dotcypress/ula: μLA: Micro Logic Analyzer for RP2040](https://github.com/dotcypress/ula)

使用 RP2040 所做的簡易 16 通道 100MHz 邏輯分析儀。搭配 [PulseView](https://sigrok.org/wiki/PulseView) 或 [sigrok-cli](https://sigrok.org/wiki/Sigrok-cli) 使用。

## SpryDrive 致動器

[bbokser/sprydrive: SpryDrive is an affordable actuator based on the quasi-direct drive (QDD) scheme. It is composed of a brushless outrunner motor, a low-cost metal gearbox, and a 3D-printed housing](https://github.com/bbokser/sprydrive)

結合 BLDC 無刷馬達、減速齒輪的致動器。

## CLN17 閉迴路步進馬達驅動器

[creapunk/CLN17: Compact closed-loop stepper motor driver designed for NEMA17 motors](https://github.com/creapunk/CLN17)

針對 NEMA17 步進馬達所設計的緊湊、高性能、閉迴路驅動控制器。使用 STM32G431CB。

## MESC STM32 BLDC FOC 韌體函式庫

[davidmolony/MESC\_Firmware: FOC library for BLDC/PMSM compatible with all STM32 targets with FPU.](https://github.com/davidmolony/MESC_Firmware)

對於擁有 FPU 的 STM32 MCU 所開發的 BLDC/PMSM FOC 控制韌體函式庫。

## Keyviz 電腦按鍵與滑鼠可視化

[mulaRahul/keyviz: Keyviz is a free and open-source tool to visualize your keystrokes ⌨️ and 🖱️ mouse actions in real-time.](https://github.com/mulaRahul/keyviz)

顯示按下的按鍵，方便影片教學等情況。
