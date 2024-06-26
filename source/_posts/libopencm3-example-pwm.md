---
title: '[LibOpenCM3 × STM32教學-4] 輸出PWM並控制Duty Cycle及頻率'
author: ZiTe
tags:
  - 'STM32'
  - '電子電路'
  - '教學'
categories: ["LibOpenCM3 × STM32教學"]
date: 2022-04-26 12:55:00
comments: true
toc: true
draft: false
aliases: ["/2022/04/libopencm3-example-pwm/"]
---

我在 2022 年 9 月重新寫了與本文內容相近的文章，建議可以觀看新文章：
- [STM32 PWM 脈波寬度調變](https://ziteh.github.io/posts/libopencm3-stm32-13/)
- [STM32 LibOpenCM3：PWM 脈波寬度調變](https://ziteh.github.io/posts/libopencm3-stm32-14/)

# 前言
[LibOpenCM3](https://libopencm3.org/) 是一個 Open-Source 的 ARM Cortex-M3 微控制器底層硬體函式庫，支援包含 STM32 在內的多種微控制器。

本文將以 STM32F103RB（Nucleo F103RB）作為示範，介紹如何使用 LibOpenCM3 寫出 STM32 的 PWM（Pulse-Width Modulation） 功能，並且可以控制頻率與 Duty Cycle（佔空比）。

<!--more-->

# 正文

在 STM32 中，PWM 的功能是由 Timer 所實現的，並藉由設定 CCR（捕獲/比較暫存器） 的值來調整 Duty Cycle。

## 完整程式
```c
/**
 * @file   main.c
 * @brief  Basic PWM(Pulse-width modulation) output example.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>

#define PWM_FREQUENCY (1000)  /* PWM frequency in Hz. */
#define PWM_DUTY_CYCLE (72.5) /* PWM duty-cycle in %. */

/*
 * PER = {f_tim / [(PRS + 1) * f_pwm]} - 1
 *
 * f_pwm: PWM frequency.
 * f_tim: Timer frequency. The value is 'rcc_apb1_frequency * 2' equal 48MHz in this case.
 * PRS:   PWM timer prescaler.
 * PER:   PWM timer period.
 */
#define PWM_TIMER_PRESCALER (48 - 1)
#define PWM_TIMER_PERIOD (((rcc_apb1_frequency * 2) / ((PWM_TIMER_PRESCALER + 1) * PWM_FREQUENCY)) - 1)

void gpio_setup(void)
{
  /* Timer3-Channel2 on PA7 (NUCLEO-F103RB). */
  rcc_periph_clock_enable(RCC_GPIOA);
  gpio_set_mode(GPIOA,
                GPIO_MODE_OUTPUT_50_MHZ,
                GPIO_CNF_OUTPUT_ALTFN_PUSHPULL,
                GPIO7);
}

/**
 * @brief Setup PWM on Timer3-Channel2.
 */
void pwm_setup(void)
{
  rcc_periph_clock_enable(RCC_TIM3);

  timer_set_mode(TIM3,
                 TIM_CR1_CKD_CK_INT,
                 TIM_CR1_CMS_EDGE,
                 TIM_CR1_DIR_UP);
  timer_disable_preload(TIM3);
  timer_continuous_mode(TIM3);

  timer_set_prescaler(TIM3, PWM_TIMER_PRESCALER);
  timer_set_period(TIM3, PWM_TIMER_PERIOD);

  timer_set_oc_mode(TIM3, TIM_OC2, TIM_OCM_PWM1);
  timer_set_oc_value(TIM3,
                     TIM_OC2,
                     (PWM_TIMER_PERIOD + 1) * (PWM_DUTY_CYCLE / 100.0));

  timer_enable_oc_output(TIM3, TIM_OC2);
  timer_enable_counter(TIM3);
}

int main(void)
{
  /* Setup system clock = 48MHz. */
  rcc_clock_setup_in_hsi_out_48mhz();

  gpio_setup();
  pwm_setup();

  /* Halt. */
  while (1)
  {
    __asm__("nop");
  }

  return 0;
}
```

## 程式分段說明
### 引入函式庫
```c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>
```

除了基本的「RCC」及「GPIO」外，由於 PWM 是透過 Timer 所實現的，所以還要引入「Timer」。

### PWM 數值宣告
```c
#define PWM_FREQUENCY (1000)  /* PWM frequency in Hz. */
#define PWM_DUTY_CYCLE (72.5) /* PWM duty-cycle in %. */
```

宣告 PWM 的目標頻率及 Duty Cycle 以供後續計算。

### PWM 頻率設定
```c
#define PWM_TIMER_PRESCALER (48 - 1)
#define PWM_TIMER_PERIOD (((rcc_apb1_frequency * 2) / ((PWM_TIMER_PRESCALER + 1) * PWM_FREQUENCY)) - 1)
```

這裡算是本文的重點之一，也就是如何設定 PWM 的頻率。

首先：
```
f_pwm = f_tim / [(PRS + 1) * (PER + 1)]
```

所以：
```
PER = {f_tim / [(PRS + 1) * f_pwm]} - 1
```

其中：
-  `f_pwm`: PWM frequency，PWM 的頻率.
- `f_tim`: Timer frequency， Timer 的頻率.
- `PRS`:   Timer prescaler，Timer 的預除頻器數值.
- `PER`:   Timer period，Timer 的週期數值.

透過時鐘樹（[Datasheet](https://cdn-shop.adafruit.com/datasheets/2127datasheet.pdf) P.12, Figure 2. Clock tree）可以知道，我們使用的「Timer 3」的時鐘源是「APB 1」，而在本例中，我們會在主程式呼叫 `rcc_clock_setup_in_hsi_out_48mhz()` 以將系統時鐘設為 48 MHz，這樣將會一併讓「APB 1」的預除頻器（Prescaler）被設定為「除 2」，所以我們的「APB 1」時鐘頻率為 48 MHz / 2 = 24 MHz。

然而，當「APB 1」的預除頻器不等於「除 1」時，「APB 1」的時鐘會先乘 2 再給「Timer 3」，因此「Timer 3」的時鐘頻率 `f_tim` 為 24 MHz * 2 = 48 MHz。

最後我將 `PRS` 設定為 `48 - 1`，將 `PER` 以上面的公式帶入。

> `rcc_apb1_frequency` 的數值會在呼叫 `rcc_clock_setup_in_hsi_out_48mhz()` 時設定。

### GPIO 設定
```c
void gpio_setup(void)
{
  /* Timer3-Channel2 on PA7 (NUCLEO-F103RB). */
  rcc_periph_clock_enable(RCC_GPIOA);
  gpio_set_mode(GPIOA,
                GPIO_MODE_OUTPUT_50_MHZ,
                GPIO_CNF_OUTPUT_ALTFN_PUSHPULL,
                GPIO7);
}
```

設定 GPIO 以輸出 PWM 訊號。注意，每個 Timer 的 Channel 能輸出的 GPIO 腳位都不同，像這裡「Timer 3」的「Channel 2」是對應「PA7」，在使用不同 Timer、Channel 時請參考 STM32 Datasheet。

### PWM Timer 設定
```c
void pwm_setup(void)
{
  rcc_periph_clock_enable(RCC_TIM3);

  timer_set_mode(TIM3,
                 TIM_CR1_CKD_CK_INT,
                 TIM_CR1_CMS_EDGE,
                 TIM_CR1_DIR_UP);
  timer_disable_preload(TIM3);
  timer_continuous_mode(TIM3);

  timer_set_prescaler(TIM3, PWM_TIMER_PRESCALER);
  timer_set_period(TIM3, PWM_TIMER_PERIOD);

  timer_set_oc_mode(TIM3, TIM_OC2, TIM_OCM_PWM1);
  timer_set_oc_value(TIM3,
                     TIM_OC2,
                     (PWM_TIMER_PERIOD + 1) * (PWM_DUTY_CYCLE / 100.0));

  timer_enable_oc_output(TIM3, TIM_OC2);
  timer_enable_counter(TIM3);
}
```

這裡也是本文的重點之一，在這裡設定好要使用的 Timer 及 PWM Duty Cycle。

`timer_set_oc_value()` 就是改變 CCR 的值，以調整 Duty Cycle。因為我們使用的是「Channel 2」，所以 Output channel 是`TIM_OC2`。

在 `TIM_OCM_PWM1` 模式下，想要輸出 `X`% Duty Cycle 的 PWM，只要把 CCR 的數值也設定成 Timer 週期的 `x`% 就可以了，也就是 `CCR_Value = (PWM_TIMER_PERIOD + 1) * (PWM_DUTY_CYCLE / 100.0)`。

最後以 `timer_enable_oc_output()` 啟動 PWM 的輸出，`timer_enable_counter()` 啟動整個 Timer。

### 主程式
```c
int main(void)
{
  /* Setup system clock = 48MHz. */
  rcc_clock_setup_in_hsi_out_48mhz();

  gpio_setup();
  pwm_setup();

  /* Halt. */
  while (1)
  {
    __asm__("nop");
  }

  return 0;
}
```

主程式先將系統時鐘設定為 48 MHz，並依序完成 GPIO 及 PWM 的初始化設定，在執行完 `pwm_setup()` 後就會開始輸出 PWM 了，最後就進入一個無限空迴圈。

# 成果

![▲ 輸出波形圖](https://i.imgur.com/GanKqb1.png)

可以看到輸出的波形誤差很小（設定值為：Duty Cycle 72.5%，頻率 1 kHz）。

# 結語
本次的程式我一樣有放在 [GitHub](https://github.com/ziteh/stm32-examples) 上，可以使用 PlatformIO 開始專案。

若有什麼問題或錯誤歡迎留言討論。

# 相關連結
- [STM32 PWM 脈波寬度調變](https://ziteh.github.io/posts/libopencm3-stm32-13/)
- [STM32 LibOpenCM3：PWM 脈波寬度調變](https://ziteh.github.io/posts/libopencm3-stm32-14/)
- 參考資料
	- [STM32F0 with libopencm3 - Part 1: Simple Timer - Collection of useful, and useless information](https://bdebyl.net/post/stm32-part1/)
	- [Wiki - Pulse-Width Modulation (PWM)](http://wiki.csie.ncku.edu.tw/embedded/PWM)
	- [STM32F103x8/B Datasheet (DocID 13587, Rev 17)](https://cdn-shop.adafruit.com/datasheets/2127datasheet.pdf)
