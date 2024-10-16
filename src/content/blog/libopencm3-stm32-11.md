---
title: 'STM32 Timer 計時器'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
  - 嵌入式
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-24 09:00:00
comments: true
toc: true
draft: false
# aliases: ["/2022/09/libopencm3-stm32-11/"]
---

# 前言
Timer 計時器是各個 MCU 中都會有的基本功能。正如其名，當需要精確定時以進行控制時，Timer 就會派上用場，Timer 還可以用來產生 PWM 訊號，是很常用的功能。

在 STM32 上我們可以藉由設定預除頻器（Prescaler）和自動裝載（Auto-Reload）來讓 Timer 每經過一段固定的時間後就產生一個中斷。

這一篇會介紹要如何使用並計算 STM32 的 Timer 的各項參數以設定想要的頻率。

<!--more-->

# 時鐘樹
時鐘樹（Clock tree）是學習並使用 STM32 及各微控制器時很重要的事，因為各個功能都有自己的運作頻率，在使用 Timer 前最好有一定的認識。

![▲ STM32F446xx 的 Clock tree。取自 RM0390 Figure 14。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijleZb6WVH51OOoRINJGebKISLgDroPJWmEwctdUpZofGFjJli0o0ZHns7XbxlGgGg3xqbRL3l9MeX9oMCz6b60m0kkgFPCrASFtKo8EAiDCG6ku0kV7LE38vbLNarerzwIxRTwaMqpkIbPm_7nxCL-YWpZSDmjNWXyaiUdRhGntJT5dcOq6G6n1Rq/s16000/ct.jpg)

上圖即為 STM32F446xx 的時鐘樹。時鐘樹的看法基本上是由左至右——左為輸入、右為輸出（到各個 Peripheral）。時鐘訊號會從原始的時鐘源開始，經過一系列的多工器、倍頻器或分頻器變成系統時鐘（SYSCLK），之後再透過 AHB 或 APB 等分頻器輸出給各各外圍設備。

最原始的時鐘源有四種：
|名稱|英文全名|中文全名|說明|
|----|-------|-------|----|
|HSE|High-speed external|外部高速|接 4\~25 MHz 的震盪器（Oscillator）或石英震盪器（Crystal）|
|LSE|Low-speed external|外部低速|接 32.768 kHz 的振盪器或石英振盪器|
|HSI|High-speed internal|內部高速|為一個 16 MHz 的 RC 振盪器|
|LSI|Low-speed internal|內部低速|為一個 32 kHz 的 RC 振盪器|

觀察時鐘樹你會發現 LSE 和 LSI 其實和 SYSCLK 無關，它們會跑去獨立看門狗計時器（IWDG）和 RTC/AWU。真正可以作為 SYSCLK 來源的只有 HSE、HSI 或經過 PLL（Phase-locked loop，鎖相環）的這兩者。

而 RC 震盪器難以比石英振盪器還精準，所以除非該應用對時鐘頻率不敏感，不然通常還是會使用外部的 HSE 和 LSE。

> 如果你好奇為什麼 LSE 是 32.768 k 這個奇怪的數字，因為 32786 是 2^15，在二進制的微控制器中使用二的冪次方為頻率在分頻與計數上比較方便。

# Timer 頻率
每個 STM32 中都有許多不同的 Timer，各個 Timer 的規格及功能都不同。我們這次用的是 TIM2，這是一個通用功能計時器（General-purpose timer），為一個 32 位元的上/下數 Counter，擁有自動裝載（Auto-reload）功能，還有一個 16 位元的可程式預除頻器。

根據 DS10693 的 Figure 3 可以知道 TIM2 在 APB1 （Advanced Peripheral Bus 1）底下。

![▲ STM32F446xC/E 的功能方塊圖。取自 DS10693 Figure 3。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8XEh5OYupQ-3-JVsxY4sW1tWx8ZqJUhO1oenC2Yh6RuooigxKdbAmZ7wwniZZgfKVMmSj5dz492cbANOnoml1fUYGek7Qs-9rCtCERqPk3LjtxuzinSoXWc1BbQJoh2yxtVHaaXsM-ZPfhd8V7tL_u_9NIHf_FCRXBXq5JcQywR5Mbc-Sq74RE2Jf/s16000/1.png)


從 STM32F446RE 的 Clock tree 還可以知道，當 APB1 的預除頻器設定為 `/1` 時，APB1 timer  clock = APB1 clock，而 APB1 的預除頻器設定為 `/1` 以外時，APB1 timer clock = 2* APB1 clock。

![▲ STM32F446xx 的部分 Clock tree。取自 RM0390 Figure 14。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQMwCBOiY0kUEnYnyx-j6eZy9dEzhdc7Qqpa-cJF_d66O3lFPX7svRDGe7evlGih2Mx5Sv6OQr1r5bN7jRJUhncOvoDwMCHitRsOBhtjhexXiL6d0Ii5jcX5cTBgDMMBbFH3_niSvyIuvx8Vsfh-pkEyvV0BjmqV_thSEfOy0quqwUdvt07K2d5SKi/s16000/2.png)


# PSC 暫存器
PSC 是 Prescaler 的意思，它用來設定各 Timer 自己的預除頻值。

根據資料可以知道 Counter 的頻率計算公式為：
`CK_CNT= CK_PSC / (PSC + 1)`
* `CK_CNT`：Counter 的計數頻率，也就是預除頻器的輸出頻率。
* `CK_PSC`：預除頻器的輸入頻率，也就是 Timer 頻率。
* `PSC`：TIMx_PSC 暫存器的值（除頻值）。

![▲ Counter 的頻率公式。取自 RM0390。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj749vqCdyvJCuFI3OBUkU2qVAYVTRKhyT2o5MuoM4dSJXNO8TVa_dlfL-VoxQoauY1OE_Xbqz-HThxpHLdr06Okk_wUO5R0gDb0YFtl8xCozfBEOuTajgGGplEB4vZpvBvKDEXo3xKkWTYDmutRsjTFGnop58wv0dehLYdeSFQ8iRGEXwd8K8CDGQ1/s16000/3.png)

# ARR 暫存器
接下來還要計算自動裝載暫存器（Auto-Reload Register，ARR）的值。ARR 暫存器的功能我們可以從 RM0390 中得知：
> In upcounting mode, the counter counts from 0 to the auto-reload value (content of the TIMx_ARR register), then restarts from 0 and generates a counter overflow event.

在上數模式時，Counter 會從 0 數到 ARR 值，然後重新從 0 開始數並產生 Overflow 及 Update 事件（包含 Update 中斷）。

![▲ 上數模式下的 TIM2 行為範例，ARR=0x36。取自 RM0390。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhF3xphTAy7Ilwm-lYcI-j8WBflXxeNHNIIZ36-O11JIsNGPAfxB0kznVcvEpNicphzRFXKrNrSnUHW9GP6MGojyA_95GMTaM6A84V4SyDcql6m_HtzWcq-KDPVtWCe7xH2ZIu-2BUnV1m7xwiIxejgRbCMc1j0TcepXS0eafuBpf7_OoZdAdL_zz0L/s16000/4.png)


所以如果 ARR = `0` 的話，每次 Counter 計數後都會發生 Overflow，此時 Overflow 的發生頻率和 Counter 的計數頻率一樣；當 ARR = `2` 時，Counter 會數：
`0, 1, 2(Overflow), 0, 1, 2(Overflow), 0... ...`

我們可以把 ARR 再當成一個除頻器，輸入為 Counter 計數頻率，除頻值為 ARR+1，輸出為 Overflow 發生的頻率。

# 完整公式
然後我們就可以得到完整的結構：
`Timer 頻率 --[Timer 預除頻器]--> Counter 頻率 --[ARR]--> Overflow 頻率`

寫成公式：
![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6tOm8rGApz9SgH1ruhwO4JK_q2qoWaD1oXlHwpZLz0_sJH309rcAbSVSaHvWWfI_7Sneh-DQ63Yd0-r0OuGYWVzYcxKb6UFbOjN3CoYodhQRV6BeWOvJBjJTB2IW_b1YPcW_HADLoc2g7aDVP-F8WD3K38Gk0yeRV7LBjIXGwADGUmxu28CY83SmW/s16000/5.png)

* `f_overflow`：Overflow 的發生頻率，也就是我們的目標頻率。
* `f_counter`：Counter 的計數頻率，也就是上面的 `CK_CNT`。
* `f_timer`：Timer 的頻率，也就是上面的 `CK_PSC`。
* `ARR`：TIMx_ARR 暫存器的值。
* `PSC`：TIMx_PSC 暫存器的值。

有了上面這個公式，我們就可以設定 Timer 的參數並得到想要的頻率了。`f_overflow` 是我們的目標頻率，`f_timer`/`f_counter` 的值取決於 RCC Clock tree 的設定，`ARR` 及 `PSC` 就是我們主要可以調整的數值。

我通常會先選定一個大略的 `PSC` 值（即先選擇 Counter 的頻率），然後在使用上面的公式計算出精確的 `ARR` 值。

# 小結
Timer 是一個稍微比較複雜的功能，它有很多細節的設定，也要會看時鐘樹，這篇也僅僅是以最精簡的方式概略介紹而已，有很多東西實在沒辦法細講（有些我也沒詳細研究）。

但 Timer 是一個很重要的功能，我想至少設定 PSC 與 ARR 的部分要看懂，而我也盡力寫得清楚些，並將官方文件的說明都附上。

# 參考資料
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)

> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10296369)。
