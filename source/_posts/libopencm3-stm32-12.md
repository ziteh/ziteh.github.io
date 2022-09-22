title: 'STM32 LibOpenCM3：Timer 計時器'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-09-DD 12:00:00
---

# 前言
Timer 計時器是各個 MCU 中都會有的基本功能。正如其名，當需要精確定時以進行控制時，Timer 就會派上用場，Timer 還可以用來產生 PWM 訊號，是很常用的功能。  
  
上一篇已經簡單介紹要如何計算 Timer 的 PSC 與 ARR 來得到想要的頻率了，這一篇就要來看看實際的程式。  
  
這篇的目標是使用 Timer 來讓 LED 的閃爍頻率更精確且方便修改。 

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  

## 完整程式
```c
/**
 * @file   main.c
 * @brief  Timer example for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>
#include <libopencm3/cm3/nvic.h>

#define GOAL_FREQUENCY (5) /* Goal frequency in Hz. */
#define TIMER_CLOCK (rcc_apb1_frequency * 2) /* f_timer. */
#define COUNTER_CLOCK (1000000) /* f_counter (CK_CNT). */
#define TIMER_PRESCALER (TIMER_CLOCK / COUNTER_CLOCK - 1) /* PSC */
#define TIMER_PERIOD (((TIMER_CLOCK) / ((TIMER_PRESCALER + 1) * GOAL_FREQUENCY)) - 1) /* ARR */

#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5) /* D13. */

static void rcc_setup(void)
{
  /* Setup system clock. */
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_TIM2);
  rcc_periph_reset_pulse(RST_TIM2); /* Reset TIM2 to defaults. */
}

static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
}

static void timer_setup(void)
{
  /* Setup interrupt. */
  nvic_enable_irq(NVIC_TIM2_IRQ);
  timer_enable_irq(TIM2, TIM_DIER_CC1IE);

  timer_set_mode(TIM2,
                 TIM_CR1_CKD_CK_INT,
                 TIM_CR1_CMS_EDGE,
                 TIM_CR1_DIR_UP);
  timer_disable_preload(TIM2);
  timer_continuous_mode(TIM2);

  timer_set_prescaler(TIM2, TIMER_PRESCALER); /* Setup TIMx_PSC register. */
  timer_set_period(TIM2, TIMER_PERIOD);       /* Setup TIMx_ARR register. */

  timer_enable_counter(TIM2);
}

int main(void)
{
  rcc_setup();
  led_setup();
  timer_setup();

  while (1)
  { /* Do nothing. */ }
  return 0;
}

/**
 * @brief Timer2 Interrupt service routine.
 */
void tim2_isr(void)
{
  if (timer_get_flag(TIM2, TIM_SR_CC1IF)) /* Get Capture/Compare 1 interrupt flag. */
  {
    timer_clear_flag(TIM2, TIM_SR_CC1IF);
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
  }
}
```

## 分段說明
### Include
```c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>
#include <libopencm3/cm3/nvic.h>
```
除了基本的 `rcc.h` 和 `gpio.h` 外，當然還有這次的重點——`timer.h`。因爲會用到中斷的功能，所以 `nvic.h` 也是必要的。  

### Timer 頻率
```c
#define TIMER_CLOCK (rcc_apb1_frequency * 2) /* f_timer. */
```
這裡以 `TIMER_CLOCK` 設定 Timer 的頻率。在上一篇得知要使用的 TIM2 頻率與 APB1 頻率及其預除頻值有關。
  
我們後續的 RCC 設定會讓 APB1 的預除頻器不爲 `/1`，所以 TIM2 clock = 2* APB1 clock。定義 `TIMER_CLOCK` 爲 `rcc_apb1_frequency * 2`。其中 `rcc_apb1_frequency` 的實際數值會在後續的 RCC 步驟中由 LibOpenCM3 設定好，我們只需要直接調用就好了。

### PSC 暫存器（Counter 頻率）
```c
#define COUNTER_CLOCK (1000000) /* f_counter (CK_CNT). */
#define TIMER_PRESCALER (TIMER_CLOCK / COUNTER_CLOCK - 1) /* PSC */
```
根據上一篇的內容可以知道 Counter 的頻率計算公式爲：  
`CK_CNT = CK_PSC / (PSC + 1)`  
所以  
`PSC = CK_PSC / CK_CNT - 1`  
* `CK_CNT`：Counter 的計數頻率，也就是預除頻器的輸出頻率。
* `CK_PSC`：預除頻器的輸入頻率，也就是 Timer 頻率。
* `PSC`：TIMx_PSC 暫存器的值（除頻值）。

這裡我定義了一個 `COUNTER_CLOCK` 來設定 Counter 的計數頻率 `CK_CNT`，以供下面設定 PSC 時使用。這個值不是絕對或唯一的，基本上只要不會導致算出的 PSC 值大到超出其暫存器的上限都可以。

我將預除頻值 PSC 以 `TIMER_PRESCALER` 爲名定義爲 `TIMER_CLOCK / COUNTER_CLOCK - 1`。這個值會存進 TIMx_PSC 暫存器。

### ARR 暫存器
``` c
#define GOAL_FREQUENCY (5) /* Goal frequency in Hz. */

#define TIMER_PERIOD (((TIMER_CLOCK) / ((TIMER_PRESCALER + 1) * GOAL_FREQUENCY)) - 1) /* ARR */
```
複習一下上一篇的公式：  
![image.png](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj6tOm8rGApz9SgH1ruhwO4JK_q2qoWaD1oXlHwpZLz0_sJH309rcAbSVSaHvWWfI_7Sneh-DQ63Yd0-r0OuGYWVzYcxKb6UFbOjN3CoYodhQRV6BeWOvJBjJTB2IW_b1YPcW_HADLoc2g7aDVP-F8WD3K38Gk0yeRV7LBjIXGwADGUmxu28CY83SmW/s16000/5.png)   
* `f_overflow`：Overflow 的發生頻率，也就是我們的目標頻率。
* `f_counter`：Counter 的計數頻率，也就是上面的 `CK_CNT`。
* `f_timer`：Timer 的頻率，也就是上面的 `CK_PSC`。
* `ARR`：TIMx_ARR 暫存器的值。
* `PSC`：TIMx_PSC 暫存器的值。

這裡以 `GOAL_FREQUENCY` 定義目標頻率 `f_overflow`。

再來只要套用上面的公式去設定 ARR 的值就可以了。這裡以 `TIMER_PERIOD` 爲名定義 ARR 爲 `(TIMER_CLOCK / ((TIMER_PRESCALER + 1) * GOAL_FREQUENCY)) - 1`。這個值會存進 TIMx_ARR 暫存器。

### 確認數值
雖然理論上只要照著上面的公式設定 PSC 與 ARR 就可以了，所以 PSC 與 ARR 的值會超多種組合，不過實際使用時要注意一下 PSC 與 ARR 的空間。  

TIM2_ARR 是 32 位元的暫存器，TIM2_PSC 是 16 位元的暫存器，所以 ARR 的值不能超過 2^32，而 PSC 的值不能超過 2^16。

我們來驗證一下。在後續的 RCC 設定中 `rcc_apb1_frequency` 會被設定成 `42000000`，也就是 42 MHz，而 `GOAL_FREQUENCY` 爲 `5`。
```
TIMER_CLOCK = rcc_apb1_frequency * 2
            = 84M
            
TIMER_PRESCALER = TIMER_CLOCK / COUNTER_CLOCK - 1
                = 83  // 83 < 2^16 (TIM2_PSC)
                
TIMER_PERIOD = (TIMER_CLOCK / ((TIMER_PRESCALER + 1) * GOAL_FREQUENCY)) - 1
             = (84M / 84 * 5) - 1
             = (84M / 420) - 1
             = 199999  // 199,999 < 2^32 (TIM2_ARR)
```

順便來驗證一下頻率的計算：
```
CK_CNT = CK_PSC / (PSC + 1)
       = 84M / (83 + 1)
       = 1M
```

Counter 的計數頻率是 1 MHz，也就是每秒數 1,000,000 次。而 ARR 值爲 `199999`，也就是 Counter 會從 0 數到 199,999（共計數 200,000 次）後發生 Overflow。

每計數 200 K 次就會發生 Overflow，1 秒會計數 1,000 K 次，所以每秒會發生 5 次 Overflow（5 Hz），正確無誤。

### RCC
``` c
static void rcc_setup(void)
{
  /* Setup system clock. */
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_TIM2);
  rcc_periph_reset_pulse(RST_TIM2); /* Reset TIM2 to defaults. */
}
```
這邊比較重要的是 `rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ])`  
  
這行的意思是指定時鐘源爲 HSE（High Speed External），且其頻率爲 8MHz，並將系統時鐘設定爲 168 MHz。這個函式也會一併設定好上面用到的 `rcc_apb1_frequency` 值，和決定 APB1 的預除頻值等各種與時鐘樹有關的設定。  
  
我們可以在 VSCode 中查看它實際設定了什麼，這些都定義在 `lib/stm32/f4/rcc.c` 中：  
![image.png](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgVCeGcu0lJ90BFb9Ihp35aR9DKJ6v9zM7KKC8VWjoYp-lBSiAv1AqK6VHN70MZVCVZrkdZ7CTEryFtmznALpXNG7QXxizn2tngkXkOCsc2kmwf1Zg-SaDepWqncySXFWaynz3ndLAo_y9cL6KB6NlIHRk2hClp8Yik10zxNw8L6rmJGf8dI3fL--aU/s16000/Inkedimage_1662204158734_0.jpg)   
  
可能會有人覺得奇怪，Nucleo-F446RE 上面的 X3 根本就沒有裝石英振盪器，而 X2 是 32 KHz 的 LSE，那這個 8 MHz 的 HSE 是從哪來的？  
  
答案是從 ST-Link 來的。Nucleo 預設配置好 ST-Link 的 MCO（Microcontroller Clock Output），它會固定輸出 8 MHz。當然你也可以不使用 ST-Link 的 MCO 作爲 HSE 源，只要照著 UM1724 裡的說明調整即可。  
  
![▲ Nucleo 預設使用 ST-Link MCO 做爲 HSE。取自 UM1724。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixZDXvfWw2mKihuO-_u8VVdQZEG6rtalPjWVTRmfWbfpWCd0Ub8LYP7wnzzBhorCkKzcRKOyk5OLfsaHs0OJGvMRGNZcR4IG2uVTU9LCam3dCDu2Gxi5rxWrUZfoEsIH0mgbWxfC4dH0IbXd_6PNVD8UbJgHceQg97Cof4dOwplL6exuO28izs-c95/s16000/image_1662203775952_0.png)  

### 設定 Timer
``` c
static void timer_setup(void)
{
  /* Setup interrupt. */
  nvic_enable_irq(NVIC_TIM2_IRQ);
  timer_enable_irq(TIM2, TIM_DIER_CC1IE);

  timer_set_mode(TIM2,
                 TIM_CR1_CKD_CK_INT,
                 TIM_CR1_CMS_EDGE,
                 TIM_CR1_DIR_UP);
  timer_disable_preload(TIM2);
  timer_continuous_mode(TIM2);

  timer_set_prescaler(TIM2, TIMER_PRESCALER); /* Setup TIMx_PSC register. */
  timer_set_period(TIM2, TIMER_PERIOD);       /* Setup TIMx_ARR register. */

  timer_enable_counter(TIM2);
}
```
在這裡設定好 Timer 的相關參數，包含啓用中斷、設定 PSC（`timer_set_prescaler()`）與 ARR （`timer_set_period()`）的值等。  
  
`timer_set_mode()` 的 `TIM_CR1_CKD_CK_INT` 代表 TIMx_CR1（Control register 1） 的 CKD（Clock division） 會設爲 `00` 不分頻；`TIM_CR1_CMS_EDGE` 則是 CMS（Center-aligned mode selection）會設爲 `00`，設定爲邊緣對齊模式；`TIM_CR1_DIR_UP` 是設定 DIR（Direction）爲 `0` 以使用上數計數器模式。  

`timer_disable_preload()` 會設定 TIMx_CR1 的 ARPE（Auto-reload preload enable）爲 `0`，以禁用 ARR 的 Preload 功能。  

`timer_continuous_mode()` 會將 TIMx_CR1 的 OPM（One-pulse mode）設爲 `0`，令 Counter 在 Update event 之後也不會停止，可以一直計數。  
  
> 有關 F446RE 的 TIMx_CR1 的詳細說明可以查看 [RM0390](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)。  

### Timer ISR
``` c
/**
 * @brief Timer2 Interrupt service routine.
 */
void tim2_isr(void)
{
  if (timer_get_flag(TIM2, TIM_SR_CC1IF))
  {
    timer_clear_flag(TIM2, TIM_SR_CC1IF);

    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
  }
}
```
這是 TIM2 的 ISR。每當 TIM2 發生中斷時，先清除中斷旗標，然後切換 LED on/off。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
以下列出主要的差異部分，也就是 RCC 與 GPIO 的部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/timer)。  
``` c
static void rcc_setup(void)
{
  /* Setup system clock. */
#if defined(STM32F1)
  rcc_clock_setup_in_hse_8mhz_out_72mhz();
#elif defined(STM32F4)
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);
#endif

  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_TIM2);
  rcc_periph_reset_pulse(RST_TIM2); /* Reset TIM2 to defaults. */
}
```
  
``` c
static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
#if defined(STM32F1)
  gpio_set_mode(GPIO_LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                GPIO_LED_PIN);
#else
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
#endif
}
```
## 成果
這是實際輸出的波形，D6 與 D7 分別爲設定目標頻率爲 5 Hz 與 100 Hz，可以看出相當精準。  
  
![▲ 實際輸出的波形。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5o3NcAgk25oLDFsaOcEO11b51HYMcU2m9JhXHta_inIuWfPKrP3GYuanRhDQgb2bXZfOWk6RcSecayBrVnR5oQ-7JVr0qbjdtS2jpOORa6hGD9K76CEgdHluBofcJwdlk_fQSi30bEvECUqc7iuPZF0dmbDXM6NF_vymra8OY_XFHJeAODD0mOJUv/s16000/scope_2_1662209560342_0.png)   

> 注意，我們在程式中設定的目標頻率是「切換頻率」，而示波器量測的是「波形頻率」，GPIO 的輸出要切換 2 次才是一個完整的波形，所以示波器上顯示的頻率才會是程式設定的一半。  

# 小結
這次接續上一篇的內容，寫出 Timer 的程式，也驗證了上一篇的計算公式。  

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)
  
> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/timer) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
