---
title: 'STM32 EXTI 外部中斷'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
  - 嵌入式
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-20 12:00:00
comments: true
toc: true
draft: false
# aliases: ["/2022/09/libopencm3-stm32-7/"]
---

# 前言
在上一篇中我簡單介紹了 STM32 的中斷，而中斷又分成很多種，由於我們的最終目標是需要讀取按鈕狀態，所以要使用的是外部中斷（External Interrupt，EXTI）功能。

在這一篇文章中，我將簡單介紹 STM32 的 EXTI。

<!--more-->

# EXTI 線路分配
基本上 STM32 大部分甚至所有的 GPIO 都可以分配為 EXTI（即可當作 EXTI 使用），但實際上的 EXTI 線路（EXTI Line）數量並沒有像 GPIO 一樣多，所以有些 GPIO 們會共用一個 EXTI。

![▲ EXTI 與 GPIO 的對應關係圖。取自 RM0390 Rev6 P.246。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhO-0XJzlz2uhtlbllMNTacnAzWomY3BvlmzCjdUInbUbmlM10EMzVlaPUG3xEsypjaXmlAV8PChiGd-7BlotHymcGEu6b1EylORMv-hhaLTWp1Tc2GdMR1IBYXIUPHmT97ziibmQ6ID9meF7HA9dJrPhRuZNp9-nfjh6GAZVrL3FfJfAhQlv6YMZj6/s16000/image_1663301101772_0.png)

上圖是 STM32F446xx 系列的 EXTI-GPIO 對應圖，可以看到 Port-A \~ Port-H 的 `0` 號腳都被分配並共用 EXTI0，所有 Port 的 `1` 號腳都被分配並共用 EXTI1，以此類推。

# 中斷向量分配
但是即便有 EXTI 線路分配，NVIC 的中斷向量也還是不夠分配所有的 EXTI 線路，因此有些 EXTI 也要共用一個中斷向量。通常是 EXTI5\~9 會共用一個，而 EXTI10\~15 再共用一個，EXTI0\~4 則是各自分配一個自己獨立的 ISR。

![▲ 中斷向量表。取自 RM0390 Rev6 P.240。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDEEbeiREpV-gQxGw--ozflXCPW5ajOdOTsz9yMH_PJccqKEbqcDQEXxlB_em8pkPLtA7-GjdyUeWbMFQ22nHOXQxSj-ijlTGYaXKrp8bSa8KIXpcqYkY9IE1tMK-ETPn9ZxtooZ2ouzD7jpQDZfDHMFU-eBxwcTkgS_nfZZoqAYefYqjXeefYAiDM/s16000/image_1663302242964_0.png)

# 判斷觸發源
但是中斷向量共用的話要如何分辨現在觸發的到底是哪一個 EXTI 呢？

檔案是靠讀取 EXTI_PR (Pending Register) 暫存器。若此暫存器的對應位元為 `1` 的話，代表有中斷請求發送。

例如 EXTI10\~15 都會觸發相同的 ISR（因為其中斷向量共用/相同，都是 `0x0000 00E0`），但只要進入 EXTI10\~15 的 ISR 後，再讀取 EXTI_PR 並查看第 10 到 15 位元哪個是 `1` 就知道實際被觸發的到底是 10~15 的哪一個了。

![▲ EXTI_PR 暫存器。取自 RM0390 Rev6 P.249。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuQqEmZOMh7vIrLyKeAcQ9EoZxidc5ZjKZav_ecwNkDhmP2_IJnRupgVEGE_tFzVQWBIcEpesvDBRs2UbtdbEMvarGexfoNLV_M_HPTF1ZB0w3gYEAbXb1FaJgdyOq7tmiTMOm6Q_TUCI-n5R9EyA-6ouF4lQwMmmEUWZo1ZtBnMq-08cYoDtei353/s16000/image_1663302880003_0.png)

# 小結
這次介紹了STM32 的 EXTI。一開始用 STM32 的 EXTI 時因為分配與共用的關係，可能會有點搞混，但我想把 EXTI Line 的分配圖多一下應該就可以瞭解了。


下一篇文章將會正式介紹要如何寫程式。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文同步發表於 [iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10291748)。
