title: 'STM32 LibOpenCM3：EXTI 外部中斷'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-MM-DD hh:00:00
---

# 前言
在之前的文章中我們使用輪詢的方式來讀取目前的按鈕狀態，但這種方式的效率不是很好，在需要讀取按鈕狀態等情況下，我們可以使用外部中斷（External Interrupt，EXTI），讓 CPU 可以去忙其它事情，等到按鈕被按下時會產生中斷事件，才去執行按鈕被按下時要處理的事。  
  
這次要我們的目標功能是每次按下按鈕後，LED 的閃爍速度就會變化。  

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  
## 完整程式
``` c
/**
 *  @file  main.c
 *  @brief EXTI example for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/exti.h>
#include <libopencm3/cm3/nvic.h>

/* User LED (LD2) connected to Arduino-D13 pin. */
#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5)

/* User button (B1) connected to PC13. */
#define RCC_BUTTON_GPIO (RCC_GPIOC)
#define GPIO_BUTTON_PORT (GPIOC)
#define GPIO_BUTTON_PIN (GPIO13)
#define EXTI_BUTTON_SOURCE (EXTI13)
#define NVIC_BUTTON_IRQ (NVIC_EXTI15_10_IRQ)

#define DELAY_VALUE_A ((uint32_t)500000)
#define DELAY_VALUE_B ((uint32_t)200000)

uint32_t delay_value = DELAY_VALUE_A;

static void delay(uint32_t value)
{
  for (uint32_t i = 0; i < value; i++)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
}

static void button_setup(void)
{
  /* Set button pin to input floating. */
  gpio_mode_setup(GPIO_BUTTON_PORT, GPIO_MODE_INPUT, GPIO_PUPD_NONE, GPIO_BUTTON_PIN);

  /* Set up interrupt. */
  nvic_enable_irq(NVIC_BUTTON_IRQ);
  exti_select_source(EXTI_BUTTON_SOURCE, GPIO_BUTTON_PORT);
  exti_set_trigger(EXTI_BUTTON_SOURCE, EXTI_TRIGGER_FALLING);
  exti_enable_request(EXTI_BUTTON_SOURCE);
}

static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_BUTTON_GPIO);
  rcc_periph_clock_enable(RCC_SYSCFG); /* For EXTI. */
}

int main(void)
{
  rcc_setup();
  led_setup();
  button_setup();

  while (1)
  {
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
    delay(delay_value);
  }
  return 0;
}

/**
 * @brief EXTI15~10 Interrupt service routine.
 * @note User button pressed event.
 */
void exti15_10_isr(void)
{
  if (exti_get_flag_status(EXTI_BUTTON_SOURCE)) /* Check EXTI line. */
  {
    exti_reset_request(EXTI_BUTTON_SOURCE);

    if (delay_value == DELAY_VALUE_A)
    {
      delay_value = DELAY_VALUE_B;
    }
    else
    {
      delay_value = DELAY_VALUE_A;
    }
  }
}
```
## 分段說明
### Include
``` c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/exti.h>
#include <libopencm3/cm3/nvic.h>
```
除了基本的 `rcc.h` 和 `gpio.h` 外，還要引入 `exti.h` 與 `nvic.h`。  
  
`exti.h` 當然就是包含了 EXTI 的各種函式。`nvic.h` 是嵌套向量中斷控制器（Nested Vectored Interrupt Controller，NVIC），這是一個 ARM Cortex-M 中負責處理中斷的控制器，有用到中斷的話都會需要它。  
  
> 注意是 `libopencm3/cm3/nvic.h`，而不是 `libopencm3/stm32/nvic.h`。  

### 設定腳位
``` c
/* User LED (LD2) connected to Arduino-D13 pin. */
#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5)

/* User button (B1) connected to PC13. */
#define RCC_BUTTON_GPIO (RCC_GPIOC)
#define GPIO_BUTTON_PORT (GPIOC)
#define GPIO_BUTTON_PIN (GPIO13)
#define EXTI_BUTTON_SOURCE (EXTI13)
#define NVIC_BUTTON_IRQ (NVIC_EXTI15_10_IRQ)
```
  
這次處理要定義 RCC 與腳位外，還一併設定了按鈕的 IRQ 與 EXTI 來源。因爲按鈕是 PC13，所以 IRQ 是 `NVIC_EXTI15_10_IRQ`，它負責處理 EXTI 15 \~ 10，而我們實際會觸發的是 `EXTI13`。  

### 設定中斷
``` c
static void button_setup(void)
{
  /* 省略部分程式 */

  /* Set up interrupt. */
  nvic_enable_irq(NVIC_BUTTON_IRQ);
  exti_select_source(EXTI_BUTTON_SOURCE, GPIO_BUTTON_PORT);
  exti_set_trigger(EXTI_BUTTON_SOURCE, EXTI_TRIGGER_FALLING);
  exti_enable_request(EXTI_BUTTON_SOURCE);
}
```
* `nvic_enable_irq()`：致能指定的 IRQ。
* `exti_select_source()`：選擇 EXTI 的來源。
* `exti_set_trigger()`：設定觸發方式。這裡使用的是 `EXTI_TRIGGER_FALLING`，即負緣觸發，還可以選擇 `EXTI_TRIGGER_RISING`（正緣觸發）或 `EXTI_TRIGGER_BOTH`（正/負緣都觸發）。
* `exti_enable_request()`：致能 EXTI IRQ。

### 中斷服務程式 ISR
``` c
/**
 * @brief EXTI15~10 Interrupt service routine.
 * @note User button pressed event.
 */
void exti15_10_isr(void)
{
  if (exti_get_flag_status(EXTI_BUTTON_SOURCE)) /* Check EXTI line. */
  {
    exti_reset_request(EXTI_BUTTON_SOURCE);

    if (delay_value == DELAY_VALUE_A)
    {
      delay_value = DELAY_VALUE_B;
    }
    else
    {
      delay_value = DELAY_VALUE_A;
    }
  }
}
```
`exti_reset_request()` 可以用來清除 IRQ flag。  

由於 EXTI 15 \~ 10 共用一個 ISR，所以還要再用 `exti_get_flag_status()` 來讀取 EXTI_PR 暫存器的值，以確定目前是哪一個 EXTI Line 被觸發。

在 LibOpenCM3 中，各個功能的 ISR 函式名稱是固定的，如果打錯的話就無法正常執行。完整的 STM32F4 系列的 ISR 列表[在此](http://libopencm3.org/docs/latest/stm32f4/html/group__CM3__nvic__isrprototypes__STM32F4.html)。  

### RCC
``` c
static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_BUTTON_GPIO);
  rcc_periph_clock_enable(RCC_SYSCFG); /* For EXTI. */
}
```
比較要注意的是，RCC 除了 GPIO Port 外，還要致能 `RCC_SYSCFG`，否則 EXTI 不會工作。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

以下列出主要的差異部分，也就是 RCC 與 GPIO 的部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/exti_button)。
``` c
static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_BUTTON_GPIO);

  /* For EXTI. */
#if defined(STM32F1)
  rcc_periph_clock_enable(RCC_AFIO);
#else
  rcc_periph_clock_enable(RCC_SYSCFG);
#endif
}
```

```c
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

```c
static void button_setup(void)
{
  /* Set button pin to input floating. */
#if defined(STM32F1)
  gpio_set_mode(GPIO_BUTTON_PORT, GPIO_MODE_INPUT, GPIO_CNF_INPUT_FLOAT, GPIO_BUTTON_PIN);
#else
  gpio_mode_setup(GPIO_BUTTON_PORT, GPIO_MODE_INPUT, GPIO_PUPD_NONE, GPIO_BUTTON_PIN);
#endif

  /* 省略部分程式 */
}
```

# 小結
這次簡單介紹了 EXTI 的實際程式。中斷是很基本也實用的功能，而外部中斷 EXTI 也是中斷中比較單純且常用的，希望大家看完後也會使用 EXTI 了。  
  
實際上 STM32 的中斷還要許多細節我沒寫到，因爲本篇主要還是希望大家可以最快速入門，因此就先省略了。  

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)
  
> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/exti_button) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10291761)。
