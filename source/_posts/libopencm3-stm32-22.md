title: 'STM32 LibOpenCM3：ADC 中斷'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-10-05 12:00:00
---

# 前言
ADC（Analog to Digital Converter）顧名思義是將類比訊號轉換成數位訊號的元件，現今多數 MCU 都會內建 ADC，而這也是相當基本且常用的功能。  

在之前的篇章中已經分別介紹 Regular 及 Injected 的單與多通道，之前對於等待 ADC 轉換完成的程式寫法都是單純的 Blocking（阻塞），這次要介紹中斷的寫法，使用中斷對於大量的 ADC 轉換作業會比起 Blocking 更有效率。

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 與 `main.h`。  

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  ADC interrupt example for STM32 Nucleo-F446RE.
 */

#include "main.h"

int main(void)
{
  rcc_setup();
  adc_setup();
  usart_setup();

  /* Software start the first conversion. */
  adc_start_conversion_regular(ADC1);

  while (1)
  { }
  return 0;
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);

  rcc_periph_clock_enable(RCC_USART_TX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
  rcc_periph_clock_enable(RCC_ADC_GPIO);
  rcc_periph_clock_enable(RCC_ADC1);
}

static void adc_setup(void)
{
/* Set to input analog. */
  gpio_mode_setup(GPIO_ADC_PORT,
                  GPIO_MODE_ANALOG,
                  GPIO_PUPD_NONE,
                  GPIO_ADC_IN0_PIN);

  /* Setup ADC. */
  adc_power_off(ADC1);

  adc_disable_scan_mode(ADC1);
  adc_disable_external_trigger_regular(ADC1);
  adc_set_single_conversion_mode(ADC1);
  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  /* Setup interrupt. */
  adc_enable_eoc_interrupt(ADC1);
  nvic_enable_irq(NVIC_ADC_IRQ);

  uint8_t channels[16];
  channels[0] = 0;
  adc_set_regular_sequence(ADC1, 1, channels);

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */
}

static void usart_setup(void)
{
  /* Set USART-Tx pin to alternate function. */
  gpio_mode_setup(GPIO_USART_TX_PORT, GPIO_MODE_AF, GPIO_PUPD_NONE, GPIO_USART_TX_PIN);
  gpio_set_af(GPIO_USART_TX_PORT, GPIO_USART_AF, GPIO_USART_TX_PIN);

  /* Config USART params. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX);

  usart_enable(USART2);
}

static void delay(uint32_t value)
{
  for (uint32_t i = 0; i < value; i++)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

/* For printf(). */
int _write(int file, char *ptr, int len)
{
  int i;

  if (file == 1)
  {
    for (i = 0; i < len; i++)
    {
      usart_send_blocking(USART2, ptr[i]);
    }
    return i;
  }

  errno = EIO;
  return -1;
}

/**
 * @brief ADC Interrupt service routine.
 */
void adc_isr(void)
{
  /* Clear regular end of conversion flag. */
  ADC_SR(ADC1) &= ~ADC_SR_EOC;

  uint16_t value = adc_read_regular(ADC1);
  printf("%4d\r\n", value);
  delay(5000000);

  /* Sart a new conversion. */
  adc_start_conversion_regular(ADC1);
}
```

``` c
/**
 * @file main.h
 */

#ifndef MAIN_H
#define MAIN_H

#include <stdio.h> /* For printf(). */
#include <errno.h> /* For printf(). */
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/adc.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/cm3/nvic.h>

#define USART_BAUDRATE (9600)

#define ADC_SIMPLE_TIME (ADC_SMPR_SMP_56CYC)
#define RCC_ADC_GPIO (RCC_GPIOA)
#define GPIO_ADC_PORT (GPIOA)
#define GPIO_ADC_IN0_PIN (GPIO0) /* Arduino-A0. */

#define RCC_USART_TX_GPIO (RCC_GPIOA)
#define GPIO_USART_TX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* ST-Link (Arduino-D1). */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

static void rcc_setup(void);
static void usart_setup(void);
static void adc_setup(void);
static void delay(uint32_t value);

#endif /* MAIN_H. */
```

## 分段說明
### Include
``` c
// main.h
#include <stdio.h> /* For printf(). */
#include <errno.h> /* For printf(). */
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/adc.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/cm3/nvic.h>
```
除了基本的 `rcc.h` 和 `gpio.h` 及必要的 `adc.h` 外，因爲我要使用 USART 和 `printf()`，所以還會需要 `usart.h`、`stdio.h` 與 `errno.h`。  

另外就是因爲要使用中斷功能，所以 `nvic.h` 也是必要的。
  
> USART 和 `printf()` 的詳細用法請看[之前的文章](https://ziteh.github.io/2022/09/libopencm3-stm32-9/)。  

### 設定 ADC
``` c
static void adc_setup(void)
{
/* Set to input analog. */
  gpio_mode_setup(GPIO_ADC_PORT,
                  GPIO_MODE_ANALOG,
                  GPIO_PUPD_NONE,
                  GPIO_ADC_IN0_PIN);

  /* Setup ADC. */
  adc_power_off(ADC1);

  adc_disable_scan_mode(ADC1);
  adc_disable_external_trigger_regular(ADC1);
  adc_set_single_conversion_mode(ADC1);
  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  /* Setup interrupt. */
  adc_enable_eoc_interrupt(ADC1);
  nvic_enable_irq(NVIC_ADC_IRQ);

  uint8_t channels[16];
  channels[0] = 0;
  adc_set_regular_sequence(ADC1, 1, channels);

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */
}
```
要使用 ADC 功能，首先要知道 ADC 的通道在哪些 GPIO 上，並將其設定爲類比輸入。  

接下來就是要設定 ADC。  
* `adc_disable_scan_mode()` 禁能多通道掃描模式，因爲本範例只需要讀取一個通道而已。
* `adc_disable_external_trigger_regular()` 禁能外部觸發，我們將使用軟體觸發。
* `adc_set_single_conversion_mode()` 設定成單一轉換模式，不連續轉換。
* `adc_set_right_aligned()` 讓資料的對齊方式爲靠右對齊。
* `adc_set_sample_time_on_all_channels()` 設定所有通道的取樣時間，這裡使用 56 個 Cycle。
* `adc_enable_eoc_interrupt()` 啓用 ADC 的轉換完成（EOC）中斷。
* `nvic_enable_irq()` 啓用 NVIC 的 ADC IRQ。
* `adc_set_regular_sequence()` 設定 Regular 的通道序列。這裡只有 Ch0。

### ADC ISQ
```c
/**
 * @brief ADC Interrupt service routine.
 */
void adc_isr(void)
{
  /* Clear regular end of conversion flag. */
  ADC_SR(ADC1) &= ~ADC_SR_EOC;

  uint16_t value = adc_read_regular(ADC1);
  printf("%4d\r\n", value);
  delay(5000000);

  /* Sart a new conversion. */
  adc_start_conversion_regular(ADC1);
}
```
這是 ADC 的 ISQ。

首先先清除 ADC 的轉換完成位元（EOC）。

使用 `adc_read_regular()` 讀取 ADC 轉換完成的數值。

都完成後再使用 `adc_start_conversion_regular()` 開始另一次新的轉換。
  
### 主程式
``` c
int main(void)
{
  rcc_setup();
  adc_setup();
  usart_setup();

  /* Software start the first conversion. */
  adc_start_conversion_regular(ADC1);

  while (1)
  { }
  return 0;
}
```
`adc_start_conversion_regular()` 會觸發 ADC 進行 Regular 組轉換，由於我們要使用中斷，所以不需要用 `adc_eoc()` 觀察 Injected 組是否轉換完成。一旦 ADC 轉換完成就會到 ADC 的 ISR。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
由於本例的差異比較大，爲了不佔版面這裡就不列出的，完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/adc_interrupt)。  

# 小結
但需要大量進行 ADC 轉換時，如何還是透過 Blocking 的方式讀取 EOC 或 JEOC 位元來等待 ADC 完成轉換的話會非常沒效率，因此本篇簡單介紹了 ADC 的中斷寫法，基本上和以往寫過的中斷一樣，應該不會太難。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/adc_interrupt) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
