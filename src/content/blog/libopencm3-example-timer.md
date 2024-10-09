---
title: '[LibOpenCM3 × STM32教學-3] Timer計時器中斷'
author: ZiTe
tags:
  - 'STM32'
  - '電子電路'
  - '教學'
  - C/C++
  - 程式
  - 嵌入式
categories: ["LibOpenCM3 × STM32教學"]
date: 2022-04-26 12:53:00
comments: true
toc: true
draft: false
# aliases: ["/2022/04/libopencm3-example-timer/"]
---

我在 2022 年 9 月重新寫了與本文內容相近的文章，建議可以觀看新文章：
- [STM32 Timer 計時器](/posts/libopencm3-stm32-11/)
- [STM32 LibOpenCM3：Timer 計時器](/posts/libopencm3-stm32-12/)

# 前言

[LibOpenCM3](https://libopencm3.org/) 是一個 Open-Source 的 ARM Cortex-M3 微控制器底層硬體函式庫，支援包含 STM32 在內的多種微控制器。

本文將以 STM32F103RB（Nucleo F103RB）作為示範，介紹如何使用 LibOpenCM3 寫出 STM32 的計時器（Timer）中斷功能。

<!--more-->

# 正文

計時器可以用來精確的計時，或設定每過一段時間就觸發中斷，以執行特定的中斷服務程序。

本次的程式範例功能是每個一段時間將切換 LED On/Off，使其閃爍。這個程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples) 上。

## 程式全文

```c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>
#include <libopencm3/cm3/nvic.h>

/* Timer */
#define TIMER_FREQUENCY (5) /* Goal frequency in Hz. */

#define TIMER_CLOCK (rcc_apb1_frequency * 2)
#define TIMER_PRESCALER (480 - 1)
#define TIMER_PERIOD ((TIMER_CLOCK / ((TIMER_PRESCALER + 1) * TIMER_FREQUENCY)) - 1)

/* User-LED */
#define RCC_LED_PORT (RCC_GPIOA)
#define LED_PORT (GPIOA)
#define LED_PIN (GPIO5)

void led_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_PORT);
  gpio_set_mode(LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                LED_PIN);
}

void timer_setup(void)
{
  rcc_periph_clock_enable(RCC_TIM2);
  rcc_periph_reset_pulse(RST_TIM2);

  nvic_enable_irq(NVIC_TIM2_IRQ);

  timer_set_mode(TIM2,
                 TIM_CR1_CKD_CK_INT,
                 TIM_CR1_CMS_EDGE,
                 TIM_CR1_DIR_UP);
  timer_disable_preload(TIM2);
  timer_continuous_mode(TIM2);

  timer_set_prescaler(TIM2, TIMER_PRESCALER);
  timer_set_period(TIM2, TIMER_PERIOD);

  timer_enable_counter(TIM2);
  timer_enable_irq(TIM2, TIM_DIER_CC1IE);
}

int main(void)
{
  /* Setup system clock = 48MHz. */
  rcc_clock_setup_in_hsi_out_48mhz();

  led_setup();
  timer_setup();

  /* Halt. */
  while (1)
  {
    __asm__("nop");
  }

  return 0;
}

/**
 * @brief Timer2 Interrupt service routine.
 */
void tim2_isr(void)
{
  /*
   * SR: Status register.
   * CC1IF: Capture/Compare 1 interrupt flag.
   */

  if (timer_get_flag(TIM2, TIM_SR_CC1IF))
  {
    timer_clear_flag(TIM2, TIM_SR_CC1IF);

    gpio_toggle(LED_PORT, LED_PIN);
  }
}

```

## 程式說明

### 引入函式庫 #include

要使用 Timer，需要以下這些函式庫：
- `stm32/rcc.h`：Reset and Clock Controller，基本的時鐘設定。
- `stm32/gpio.h`：General-Purpose Input/Output，通用功能 IO 的相關功能。
- `stm32/timer.h`：計時器的相關功能。
- `cm3/nvic.h`：Nested vectored interrupt controller，中斷相關功能。

```c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>
#include <libopencm3/cm3/nvic.h>
```

### 設定 LED led_setup()

這部分就是設定好 LED，將其 GPIO 設定成推輓式（Push-Pull）輸出模式。

```c
/* User-LED */
#define RCC_LED_PORT (RCC_GPIOA)
#define LED_PORT (GPIOA)
#define LED_PIN (GPIO5)

void led_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_PORT);
  gpio_set_mode(LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                LED_PIN);
}
```

### 設定計時器 timer_setup()

這裡設置了 Timer 的相關設定，包含了用來決定計數的預除頻器（Prascaler）與週期（Period），並且啟用中斷功能（`nvic_enable_irq(NVIC_TIM2_IRQ)` 與 `timer_enable_irq(TIM2, TIM_DIER_CC1IE)`），`timer_enable_counter(TIM2)` 會讓指定的 Timer 開始計數。

而要精確設定 Timer 的頻率就需要進行計算：

首先：
```
f_int = f_tim / [(PRS + 1) * (PER + 1)]
```

所以：
```
PER = {f_tim / [(PRS + 1) * f_int]} - 1
```

其中：
-  `f_int`: Interrupt frequency，中斷觸發頻率.
- `f_tim`: Timer frequency， Timer 的原始頻率.
- `PRS`:   Timer prescaler，Timer 的預除頻器數值.
- `PER`:   Timer period，Timer 的週期數值.

透過時鐘樹（[Datasheet](https://cdn-shop.adafruit.com/datasheets/2127datasheet.pdf) P.12, Figure 2. Clock tree）可以知道，我們使用的「Timer 2」的時鐘源是「APB 1」，而在本例中，我們會在主程式呼叫 `rcc_clock_setup_in_hsi_out_48mhz()` 以將系統時鐘設為 48 MHz，這樣將會一併讓「APB 1」的預除頻器（Prescaler）被設定為「除 2」，所以我們的「APB 1」時鐘頻率為 48 MHz / 2 = 24 MHz。

然而，當「APB 1」的預除頻器不等於「除 1」時，「APB 1」的時鐘會先乘 2 再給「Timer 2」，因此「Timer 2」的時鐘頻率 `f_tim` 為 24 MHz * 2 = 48 MHz。

最後我將 `PRS` 設定為 `480 - 1`，將 `PER` 以上面的公式帶入。

```c
/* Timer */
#define TIMER_FREQUENCY (5) /* Goal frequency in Hz. */

#define TIMER_CLOCK (rcc_apb1_frequency * 2)
#define TIMER_PRESCALER (480 - 1)
#define TIMER_PERIOD ((TIMER_CLOCK / ((TIMER_PRESCALER + 1) * TIMER_FREQUENCY)) - 1)
```

```c
void timer_setup(void)
{
  rcc_periph_clock_enable(RCC_TIM2);
  rcc_periph_reset_pulse(RST_TIM2);

  nvic_enable_irq(NVIC_TIM2_IRQ);

  timer_set_mode(TIM2,
                 TIM_CR1_CKD_CK_INT,
                 TIM_CR1_CMS_EDGE,
                 TIM_CR1_DIR_UP);
  timer_disable_preload(TIM2);
  timer_continuous_mode(TIM2);

  timer_set_prescaler(TIM2, TIMER_PRESCALER);
  timer_set_period(TIM2, TIMER_PERIOD);

  timer_enable_counter(TIM2);
  timer_enable_irq(TIM2, TIM_DIER_CC1IE);
}
```

### 中斷服務程序 ISR tim2_isr()

中斷服務程序（Interrupt service routine，ISR）是當中斷發生時會執行的程式，在這裡也就是每此計時器達到指定的時間後會執行的程式。

首先清除計時器的捕獲/比較中斷旗標（Capture/Compare 1 interrupt flag，CC1IF），此中斷旗標在 Status register（SR） 中。

然後執行要做的事情，在此就是切換一次 LED On/Off（`gpio_toggle()`），使其閃爍。

注意此函數名稱 `tim2_isr` 是規定好的，打錯將無法正常運行。

```c
/**
 * @brief Timer2 Interrupt service routine.
 */
void tim2_isr(void)
{
  /*
   * SR: Status register.
   * CC1IF: Capture/Compare 1 interrupt flag.
   */

  if (timer_get_flag(TIM2, TIM_SR_CC1IF))
  {
    timer_clear_flag(TIM2, TIM_SR_CC1IF);

    gpio_toggle(LED_PORT, LED_PIN);
  }
}
```

### 主程式 main()

首先依序設定好 LED 與 Timer，接著就直接進入一個無限空迴圈，等待 Timer 觸發。

> `__asm__("nop")` 會嵌入組合語言的「nop（無操作）」指令。

```c
int main(void)
{
  /* Setup system clock = 48MHz. */
  rcc_clock_setup_in_hsi_out_48mhz();

  led_setup();
  timer_setup();

  /* Halt. */
  while (1)
  {
    __asm__("nop");
  }

  return 0;
}
```

# 成果

這是輸出的波形。

![▲ 波形圖](https://i.imgur.com/bjGkUuG.png)

值得注意的一點是，我們在程式中設定的頻率是 5 Hz，但示波器上量測的是 2.5 Hz。之所以頻率會變一半是因為，5 Hz 是 Timer 中斷的觸發頻率，也就是每秒觸發 5 次 ISR，即每秒反轉 5 次 LED 的 ON/OFF。

但示波器量測的是完整的波形頻率，也就是示波器所量測的週期是包含 High 和 Low 的，而完整的一次 High-Low 需要反轉 2 次 LED ON/OFF，所以示波器的量測頻率才會是程式設定的一半。

所以實際上 Timer 確實是以 5 Hz 的頻率觸發中斷並執行 ISR，與示波器上顯示的不同是因為程式裡的頻率和示波器量測的頻率定義不同，前者為切換/變化頻率，後者為 High-Low 頻率。

# 結語

本次文章內介紹的程式我也有放在 [GitHub](https://github.com/ziteh/stm32-examples) 上，可以直接載下來並使用 PlatformIO 開始專案。

# 相關連結

- [STM32 Timer 計時器](/posts/libopencm3-stm32-11/)
- [STM32 LibOpenCM3：Timer 計時器](/posts/libopencm3-stm32-12/)
