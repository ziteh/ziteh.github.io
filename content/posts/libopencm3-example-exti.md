---
title: '[LibOpenCM3 × STM32教學-2] 按鈕觸發外部中斷 EXTI'
author: ZiTe
tags:
  - 'STM32'
  - '電子電路'
  - '教學'
series: ["LibOpenCM3 × STM32教學"]
date: 2021-11-28 22:00:00
comment: true
toc: true
draft: false
aliases: ["/2021/11/libopencm3-example-exti/"]
---

# 前言

[LibOpenCM3](https://libopencm3.org/) 是一個 Open-Source 的 ARM Cortex-M3 微控制器底層硬體函式庫，支援包含 STM32 在內的多種微控制器。

本文將以 STM32F103RB（Nucleo F103RB）作為示範，介紹如何使用 LibOpenCM3 寫出 STM32 的外部中斷（External interrupt，EXTI）。

<!--more-->

# 正文

外部中斷最基本的應用就是按鈕。雖然可以使用輪詢的方式來感測按鈕是否有觸發，但這種做法不但消耗資源，也不保險（觸發當下可能剛好錯過輪詢），而使用外部中斷就不會有這樣的問題。

本文示範一個以按鈕觸發的外部中斷，每次按下按鈕時就會觸發指定的外部中斷，讓 LED 進行一次開或關。

## 程式全文

```c
/**
 * @file   main.c
 * @brief  Basic button external interrupt(EXTI).
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/exti.h>
#include <libopencm3/cm3/nvic.h>

void led_setup(void)
{
  rcc_periph_clock_enable(RCC_GPIOA);
  gpio_set_mode(GPIOA,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                GPIO5);
}


void button_setup(void)
{
  rcc_periph_clock_enable(RCC_GPIOC);
  rcc_periph_clock_enable(RCC_AFIO);

  nvic_enable_irq(NVIC_EXTI15_10_IRQ);

  gpio_set_mode(GPIOC,
                GPIO_MODE_INPUT,
                GPIO_CNF_INPUT_FLOAT,
                GPIO13);

  exti_select_source(EXTI13, GPIOC);
  exti_set_trigger(EXTI13, EXTI_TRIGGER_FALLING);
  exti_enable_request(EXTI13);
}

/**
 * @brief EXTI15~10 Interrupt service routine.
 */
void exti15_10_isr(void)
{
  exti_reset_request(EXTI13);
  gpio_toggle(GPIOA, GPIO5);
}

int main(void)
{
  led_setup();
  button_setup();

  while (1)
  {
    __asm__("nop");
  }

  return 0;
}
```

## 程式說明

### 引入函式庫
```c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/exti.h>
#include <libopencm3/cm3/nvic.h>
```

除了基本的「RCC」與「GPIO」函式庫外，要使用外部中斷還需要「EXTI」與「NVIC」這兩個函式庫。

其中「EXTI」包含了外部中斷（External interrupt）的相關功能。「NVIC」是「Nested vectored interrupt controller」的意思，是 ARM Cortex-M3 中負責管理所有中斷的核心功能，包含了中斷優先級、中斷請求（Interrupt request，IRQ）、中斷旗標等。

> 注意是 `libopencm3/cm3/nvic.h` 而非 `libopencm3/stm32/nvic.h`。

### 設定 LED

```c
void led_setup(void)
{
  rcc_periph_clock_enable(RCC_GPIOA);
  gpio_set_mode(GPIOA,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                GPIO5);
}
```

函數 `led_setup()` 負責設定 LED。
- `rcc_periph_clock_enable()` 用來致能目標 LED 所在 GPIO Port-A 的 Clock。
- `gpio_set_mode()` 設定 LED 所在的 PA5 為最高速度 2 MHz 的推輓式（Push-Pull）輸出。

### 設定按鈕及 EXTI

```c
void button_setup(void)
{
  rcc_periph_clock_enable(RCC_GPIOC);
  rcc_periph_clock_enable(RCC_AFIO);

  nvic_enable_irq(NVIC_EXTI15_10_IRQ);

  gpio_set_mode(GPIOC,
                GPIO_MODE_INPUT,
                GPIO_CNF_INPUT_FLOAT,
                GPIO13);

  exti_select_source(EXTI13, GPIOC);
  exti_set_trigger(EXTI13, EXTI_TRIGGER_FALLING);
  exti_enable_request(EXTI13);
}
```

函數 `button_setup()` 負責按鈕的相關設定。
- RCC
    - `rcc_periph_clock_enable(RCC_GPIOC)` 致能按鈕本身所在的 GPIO Port-C 的 Clock。
    - `rcc_periph_clock_enable(RCC_AFIO)` 致能 Alternate function I/O（AFIO） 的 Clock。使用外部中斷必須啟用 AFIO。
- `nvic_enable_irq(NVIC_EXTI15_10_IRQ)` 致能「EXTI-10 到 15」的中斷請求（Interrupt request，IRQ）。我使用的 STM32 中 EXTI-10 到 15 的 IRQ 是共用的，它們都會對應到相同的中斷服務程序（ISR）。我要使用的是 EXTI-13，所以要對「EXTI15_10」進行設定。
- `gpio_set_mode()` 將按鈕所在的 PC13 設定成浮接輸入（Input float）模式。
- EXTI
    - `exti_select_source(EXTI13, GPIOC)` 選擇 EXTI 的來源為 「EXIT-13」，「GPIO Port-C」，也就是「PC13」。
    - `exti_set_trigger(EXTI13, EXTI_TRIGGER_FALLING)` 設定 「EXTI-13」的觸發方式為「Falling（負緣）」。
    - `exti_enable_request(EXTI13)` 致能「EXTI-13」的中斷請求。

### 中斷服務程序 ISR

```c
/**
 * @brief EXTI15~10 Interrupt service routine.
 */
void exti15_10_isr(void)
{
  exti_reset_request(EXTI13);
  gpio_toggle(GPIOA, GPIO5);
}
```

函數 `exti15_10_isr()` 是「EXTI-10 到 15」的中斷服務程序（Interrupt service routine，ISR）。當「EXTI-10 到 15」發生中斷時就會執行這裡的程式。此函數名稱是規定好的，不能打錯。

- `exti_reset_request(EXTI13)` 會清除來自「EXTI-13」的中斷請求旗標。
- `gpio_toggle(GPIOA, GPIO5)` 是讓 LED（PA5）的輸出反轉，進行 LED 的開關，也就是我們要的功能——每次按下按鈕 LED 就開或關一次。

### 主程式

```c
int main(void)
{
  led_setup();
  button_setup();

  while (1)
  {
    __asm__("nop");
  }

  return 0;
}
```

主程式先依序呼叫 `led_setup()` 與 `button_setup()` 來完成設定，隨後就進入一個無限空迴圈，等待中斷的觸發。

> `__asm__("nop")` 會嵌入組合語言的「nop（無操作）」指令。

# 結語

本次文章內介紹的程式我也有放在 [GitHub](https://github.com/ziteh/stm32-examples) 上，可以直接載下來並使用 PlatformIO 開始專案。

# 相關文章

- 本文的系列：[LibOpenCM3 × STM32教學](https://ziteh.github.io/categories/LibOpenCM3-%C3%97-STM32%E6%95%99%E5%AD%B8/)
- [STM32學習記錄](https://ziteh.github.io/categories/STM32%E5%AD%B8%E7%BF%92%E8%A8%98%E9%8C%84/)
