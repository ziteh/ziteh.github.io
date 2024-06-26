---
title: 'STM32 LibOpenCM3：ADC 單通道 Regular'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-10-03 12:00:00
comments: true
toc: true
draft: false
aliases: ["/2022/10/libopencm3-stm32-20/"]
---

# 前言
ADC（Analog to Digital Converter）顧名思義是將類比訊號轉換成數位訊號的元件，現今多數 MCU 都會內建 ADC，而這也是相當基本且常用的功能。

上一篇已經介紹過 STM32 的 ADC 基本功能，這篇文章要示範如何使用 STM32 上的 ADC Regular 通道，並使用 UART 傳到電腦上觀看。

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 為「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 與 `main.h`。

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  Single regular channel ADC example for STM32 Nucleo-F446RE.
 */

#include "main.h"

int main(void)
{
  rcc_setup();
  adc_setup();
  usart_setup();

  while (1)
  {
    uint16_t adc_value = get_adc_value(0);
    printf("%4d\r\n", adc_value);
    delay(2000000);
  }

  return 0;
}

static uint16_t get_adc_value(int channel)
{
  /* Setup channel. */
  uint8_t adc_channel[16];
  adc_channel[0] = channel;
  adc_set_regular_sequence(ADC1, 1, adc_channel);

  /* Software start conversion. */
  adc_start_conversion_regular(ADC1);

  /* Wait for ADC end of conversion. */
  while (!adc_eoc(ADC1))
  { }

  return adc_read_regular(ADC1); /* Read ADC value. */
}

static void adc_setup(void)
{
/* Set to input analog. */
  gpio_mode_setup(GPIO_ADC_PORT,
                  GPIO_MODE_ANALOG,
                  GPIO_PUPD_NONE,
                  GPIO_ADC_A0_PIN);

  /* Setup ADC. */
  adc_power_off(ADC1);

  adc_disable_scan_mode(ADC1);
  adc_disable_external_trigger_regular(ADC1);
  adc_set_single_conversion_mode(ADC1);
  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);

  rcc_periph_clock_enable(RCC_USART_TX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
  rcc_periph_clock_enable(RCC_ADC_GPIO);
  rcc_periph_clock_enable(RCC_ADC1);
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

#define USART_BAUDRATE (9600)

#define ADC_SIMPLE_TIME (ADC_SMPR_SMP_56CYC)
#define RCC_ADC_GPIO (RCC_GPIOA)
#define GPIO_ADC_PORT (GPIOA)
#define GPIO_ADC_A0_PIN (GPIO0) /* A0. */

#define RCC_USART_TX_GPIO (RCC_GPIOA)
#define GPIO_USART_TX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* ST-Link (D1). */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

static void rcc_setup(void);
static void usart_setup(void);
static void adc_setup(void);

static uint16_t get_adc_value(int channel);
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
```
除了基本的 `rcc.h` 和 `gpio.h` 及 必要的 `adc.h` 外，因為我要使用 USART 和 `printf()`，所以還會需要 `usart.h`、`stdio.h` 與 `errno.h`。

> USART 和 `printf()` 的詳細用法請看[之前的文章](https://ziteh.github.io/2022/09/libopencm3-stm32-9/)。

### 設定 ADC
``` c
static void adc_setup(void)
{
/* Set to input analog. */
  gpio_mode_setup(GPIO_ADC_PORT,
                  GPIO_MODE_ANALOG,
                  GPIO_PUPD_NONE,
                  GPIO_ADC_A0_PIN);

  /* Setup ADC. */
  adc_power_off(ADC1);

  adc_disable_scan_mode(ADC1);
  adc_disable_external_trigger_regular(ADC1);
  adc_set_single_conversion_mode(ADC1);
  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */
}
```
要使用 ADC 功能，首先要知道 ADC 的通道在哪些 GPIO 上，並將其設定為類比輸入。

接下來就是要設定 ADC。
* `adc_disable_scan_mode()` 禁能多通道掃描模式，因為本範例只需要讀取一個通道而已。
* `adc_disable_external_trigger_regular()` 禁能外部觸發，我們將使用軟體觸發。
* `adc_set_single_conversion_mode()` 設定成單一轉換模式，不連續轉換。
* `adc_set_right_aligned()` 讓資料的對齊方式為靠右對齊。
* `adc_set_sample_time_on_all_channels()` 設定所有通道的取樣時間，這裡使用 56 個 Cycle。

### 讀取 ADC 的值
``` c
static uint16_t get_adc_value(int channel)
{
  /* Setup channel. */
  uint8_t adc_channel[16];
  adc_channel[0] = channel;
  adc_set_regular_sequence(ADC1, 1, adc_channel);

  /* Software start conversion. */
  adc_start_conversion_regular(ADC1);

  /* Wait for ADC end of conversion. */
  while (!adc_eoc(ADC1))
  { }

  return adc_read_regular(ADC1); /* Read ADC value. */
}
```
每個 ADC 都有多個通道，各個通道都有對應的 GPIO，在讀取時要指定要從哪一個通道讀取類比訊號。

使用 `adc_set_regular_sequence()` 設定要讀取的 Regular 通道序列。這裡一次就只讀取一個通道。Regular 最多可以設定 16 個通道，但在本例中只需要 1 個。如果要讀取的通道是固定的話，這個序列可以只設定一次就好。

以 `adc_start_conversion_regular()` 軟體觸發轉發，並以 `adc_eoc()` 來觀察 ADC 是否結束轉換了（End of conversion）。

ADC 轉換完成後就可以使用 `adc_read_regular()` 取得讀取的 Regular 資料。

由於此 ADC 是 12-bit 解析度，因此讀值範圍是 0~4095（`0x0000` \~ `0x0FFF`）。

### 設定 RCC
``` C
static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);

  rcc_periph_clock_enable(RCC_USART_TX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
  rcc_periph_clock_enable(RCC_ADC_GPIO);
  rcc_periph_clock_enable(RCC_ADC1);
}
```
除了 GPIO 外，還要記得致能各功能本身的時鐘。

### 主程式
``` c
int main(void)
{
  rcc_setup();
  adc_setup();
  usart_setup();

  while (1)
  {
    uint16_t adc_value = get_adc_value(0);
    printf("%4d\r\n", adc_value);
    delay(2000000);
  }

  return 0;
}
```
在迴圈中每次讀取 ADC 通道的值並 Print 出去。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

以下列出主要的差異部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/adc_single_channel_regular)。

要注意的是除了以往的 RCC 與 GPIO 的設定不同外，ADC 也有部分不同，要特別注意。

``` c
static uint16_t get_adc_value(int channel)
{
  /* Setup channel. */
  uint8_t adc_channel[16];
  adc_channel[0] = channel;
  adc_set_regular_sequence(ADC1, 1, adc_channel);

  /* Software start conversion. */
#if defined(STM32F1)
  adc_start_conversion_direct(ADC1);
#else
  adc_start_conversion_regular(ADC1);
#endif

  /* Wait for ADC end of conversion. */
  while (!adc_eoc(ADC1))
  { }

  return adc_read_regular(ADC1); /* Read ADC value. */
}
```

``` c
static void adc_setup(void)
{
  /* 省略部分程式. */

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */

#if defined(STM32F1)
  /* Self-calibration. */
  adc_reset_calibration(ADC1);
  adc_calibrate(ADC1);
#endif
}
```

# 小結
這次介紹了最基本的 ADC 用法，也就是讀取單一 Regular 通道。

雖然 ADC 本身的設定與模式都比以往的其它功能複雜，但實際使用時我想這些程式並不會太難看懂。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/adc_single_channel_regular) 上。
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10301615)。
