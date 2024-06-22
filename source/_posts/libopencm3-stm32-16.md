---
title: 'STM32 LibOpenCM3：IWDG 獨立看門狗計時器'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-29 12:00:00
comments: true
toc: true
draft: false
aliases: ["/2022/09/libopencm3-stm32-16/"]
---

# 前言
看門狗計時器（Watchdog timer，WDG）是眾多 MCU 都有的功能，它是一種特殊功能的計時器，其功能爲不斷下數，如果下數到一個值之前都沒有做刷新（Refresh）的話就認定目前系統出問題了（例如進入死迴圈跳不出來），並自動觸發系統重置（System reset）。如果要系統正常運作不 Reset 的話，必須要在 WDG Timeout 前進行 Refresh，以告訴 WDG：「我還在正常運作，不要把我 Reset 掉」。

<!--more-->

STM32 中有兩種 WDG——獨立看門狗（Independent WDG，IWDG）、窗口看門狗（Window WDG，WWDG）。

IWDG 正如其名，是一個自己獨立的 WDG。它擁有的獨立時鐘源，因此不受 AHB、APB1 和 APB2 的影響。是一個雖然整合在一起，但是實際上完全獨立的功能模組。但由於它使用的是 LSI RC 震盪器作爲時鐘源，故時間精度較低。

WWDG 的特色就是它擁有時間窗口（Timing Window）的概念，必須要在指定的時間區段內進行 Refresh 才不會導致它觸發 Reset，太早太晚都不行，而這個時間區段就是 Window。

> The devices feature two embedded watchdog peripherals that offer a combination of high
safety level, timing accuracy and flexibility of use.
>
> Both watchdog peripherals (Independent and Window) serve to detect and resolve malfunctions due to software failure, and to trigger system reset or an interrupt (window watchdog only) when the counter reaches a given timeout value.
> -- From RM0390


本文將先以 IWDG 爲例，寫一個簡單的例子，以測試 IWDG 是否可以自動觸發 Reset。

# 正文
首先一樣以 Nucleo-F446RE 做示範。

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  IWDG (Independent watchdog) example for STM32 Nuclso-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/iwdg.h>
#include <libopencm3/cm3/systick.h>
#include <libopencm3/cm3/nvic.h>

#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5) /* D13. */

static volatile uint32_t systick_delay = 0;

static void delay_ms(uint32_t value)
{
  systick_delay = value;
  while (systick_delay != 0)
  {
    /* Wait. */
  }
}

static void systick_setup(void)
{
  systick_set_clocksource(STK_CSR_CLKSOURCE_AHB_DIV8);
  systick_set_reload(rcc_ahb_frequency / 8 / 1000 - 1);
  systick_interrupt_enable();
  systick_counter_enable();
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);
  rcc_periph_clock_enable(RCC_LED_GPIO);
}

static void iwdg_setup(void)
{
  iwdg_reset();
  iwdg_set_period_ms(300);
  iwdg_start();
}

static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
}

int main(void)
{
  rcc_setup();
  systick_setup();
  led_setup();

  gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(10);
  gpio_set(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(2000);

  iwdg_setup(); /* Setup and start IWDG. */

  while (1)
  {
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
    delay_ms(200);
    iwdg_reset(); /* Refresh. */
  }

  return 0;
}

/**
 * @brief  SysTick handler.
 */
void sys_tick_handler(void)
{
  if (systick_delay != 0)
  {
    systick_delay--;
  }
}
```

## 分段說明
### Include
``` c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/iwdg.h>
#include <libopencm3/cm3/systick.h>
#include <libopencm3/cm3/nvic.h>
```
爲了要更好地驗證 IWDG 的運作，所以我們要有較爲精確的 `delay()`，因此這裡我除了 `iwdg.h` 外還引入了 `systick.h` 與 `nvic.h`，利用 SysTick 來實現較精確的 ms 等級 `delay()`。

> SysTick 的用法請參考[之前的文章](https://ziteh.github.io/2022/09/libopencm3-stm32-15/)。

### RCC
``` c
static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);
  rcc_periph_clock_enable(RCC_LED_GPIO);
}
```
由於 IWDG 是完全獨立的，它不在 AHB、APB1 或 APB2 底下，所以 RCC 不用設定啓用 IWDG。

### IWDG 設定
``` c
static void iwdg_setup(void)
{
  iwdg_reset();
  iwdg_set_period_ms(300);
  iwdg_start();
}
```
這就是 IWDG 的設定部分，相當簡單，就是先重置它，然後設定 Timeout，最後再將它致能。

頻率那些的計算 LibOpenCM3 都直接實現在 `iwdg_set_period_ms()` 中了，其實際內容可以查看 [LibOpenCM3 的 repo](https://github.com/libopencm3/libopencm3/blob/44e142d4f97863e669737707a1a22bf40ed49bbc/lib/stm32/common/iwdg_common_all.c#L73-L114)。

### 主程式
``` c
int main(void)
{
  rcc_setup();
  systick_setup();
  led_setup();

  gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(10);
  gpio_set(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(2000);

  iwdg_setup(); /* Setup and start IWDG. */

  while (1)
  {
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
    delay_ms(200);
    iwdg_reset(); /* Refresh. */
  }

  return 0;
}
```
爲了要驗證 IWDG 的運作，我在啓動 IWDG（`iwdg_setup()`）前先讓 LED off 10ms，然後再 on 2s，以方便我們觀察是否進行了 System Reset。

啓動 IWDG 後進入主迴圈並讓 LED 閃爍。而這裡每次 delay 後都會 Refresh IWDG（`iwdg_reset()`）。由於目前的 IWDG timeout 設爲 300ms，而這裡每 200ms 就會進行 Refresh，所以 IWDG 不會觸發 Reset，MCU 可以一直運作下去。

但如果把 IWDG timeout 的 300ms 調短，或調慢主迴圈內的 200ms，讓系統來不及在 IWDG timeout 前 Refresh 的話，IWDG 就會自動觸發 Reset，這時觀察 LED 的話就會看到它一直在 off 10ms 後 on 2s，因爲 MCU 一直被 Reset。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

以下列出主要的差異部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/iwdg)。
``` c
static void rcc_setup(void)
{
#if defined(STM32F1)
  rcc_clock_setup_in_hse_8mhz_out_72mhz();
#elif defined(STM32F4)
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);
#endif

  rcc_periph_clock_enable(RCC_LED_GPIO);
}
```

``` c
static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
#if defined(STM32F1)
  gpio_set_mode(GPIO_LED_PORT, GPIO_MODE_OUTPUT_2_MHZ, GPIO_CNF_OUTPUT_PUSHPULL, GPIO_LED_PIN);
#else
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
#endif
}
```

## 成果
我分別用了兩塊 STM32，並將左邊的 IWDG timeout 設爲 300 ms，右邊的爲 100 ms，而主迴圈的 Refresh 前 delay 都是 200 ms。

可以看到左邊的 STM32 可以一直運作，而右邊的因爲來不及 Refresh 所以一直在 Reset。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiAyWPGZfScHMRKg2AUp4-syulcKDCuEWl1GgOjWdlEewFwb8sI7TwdQnd3AvPH_jOHXyKoPmhDB4VOGnV4SdU_4nfIKoMnLwsg4NK4zleMNhzSIhdjbStZmpoSRM4kH3uUoXv8j-K6TZkexnCzSneRWWuxdRodgVEUK_oHwVDBT7WDsmDpEFmm1ma4/s16000/ezgif.com-gif-maker.gif)

# 小結
WDG 在簡單的非正式專案中可能不太會用到，但它設定簡單、使用方便，稍微瞭解一下也很值得。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/iwdg) 上。
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10299443)。
