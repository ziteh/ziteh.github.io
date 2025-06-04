---
title: "NXP MCUXpresso 入門踩雷記錄"
subtitle: "第一次用 NXP MCU（MCX N947）"
# description: ""
tags: ["教學", "嵌入式"]
# categories: [""]
date: 2024-07-09T19:50:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

我以前都是使用 STM32 系列的 MCU 較多，也有稍微用過 Nordic nRF5 系列，最近想玩玩看 NXP 的 MCU，所以我買了片 [FRDM-MCXN947](https://www.nxp.com/design/design-center/development-boards-and-designs/general-purpose-mcus/frdm-development-board-for-mcx-n94-n54-mcus:FRDM-MCXN947) 開發板來用，它搭載了 [MCX N947](https://www.nxp.com/products/processors-and-microcontrollers/arm-microcontrollers/general-purpose-mcus/mcx-arm-cortex-m/mcx-n-series-microcontrollers/mcx-n94x-54x-highly-integrated-multicore-mcus-with-on-chip-accelerators-intelligent-peripherals-and-advanced-security:MCX-N94X-N54X) 雙核心 Arm-M33 MCU。

不過我在入門的時候遭遇了一些問題，因此寫了這一篇文章記錄一下。

<!-- more -->

> 我使用的是 [MCUXpresso for VScode](https://www.nxp.com/products/processors-and-microcontrollers/arm-microcontrollers/general-purpose-mcus/mcx-arm-cortex-m/mcx-a-series-microcontrollers/mcuxpresso-for-visual-studio-code:MCUXPRESSO-VSC)

# 變更燒錄器

我在一開始的燒錄就遇到問題，它一直找不到板載燒錄器。NXP 的 MCU-Link 可以支援多種不同的燒錄器韌體，所以我試著換一個試試：

在 `C:\nxp\MCU-LINK_installer_3.146\scripts` 路徑下會有這 2 個腳本可以用來變更燒錄器的韌體：

- `program_CMSIS.cmd`
- `program_JLINK.cmd`

出廠預設應該是用 CMSIS-DAP，因此我試著將其改成 J-Link。

首先要將開發板置於 ISP 模式，以我的 FRDM-MCXN947 來說就是將 jumper `J21` 短路起來。然後使用 USB 接上電腦，再執行 `program_JLINK.cmd` 就可以了。完成後 VScode 上燒錄器確實變成 J-Link 了，也可以正確燒錄和 debug 了。

# Config Tools 網路問題

我的 [MCUXpresso Config Tools](https://www.nxp.com/design/design-center/software/development-software/mcuxpresso-software-and-tools-/mcuxpresso-config-tools-pins-clocks-and-peripherals:MCUXpresso-Config-Tools?&lang=en) 不知道為何總是連不上網路，這會導致我建立新專案時一直跳出「the toolchain project detection failed in the specified directory, Detected ARM GCC project file, but parsing failed.」錯誤。後來我是參考「How to use MCUXpresso Config Tools on offline computer」這個 PDF 的內容，改使用離線的方式。

在 [SDK Builder - MCUXpresso Config Tools data download](https://mcuxpresso.nxp.com/en/select_config_tools_data) 搜尋你的硬體（例如我是 FRDM-MCXN947） 並下載數據。

它應該會是一個名稱類似 `FRDM-MCXN947_ConfigTools_data` 的壓縮檔，將解壓縮後的 `boards`、`components`、`processors` 資料夾直接複製並貼上到此 `C:\ProgramData\NXP\mcu_data_v16\`。完成後看起來會是：

```txt
C:\ProgramData\NXP\
  └── mcu_data_v16
       ├── boards
       ├── components
       └── processors
```

這樣就完成了，重新打開應該就可以了。

# 參考

- [NXP MCXA Microcontroller Programming Tutorial | by Pallav Aggarwal | Medium](https://pallavaggarwal.medium.com/nxp-mcxa-microcontroller-programming-tutorial-2cacf5834afc)
