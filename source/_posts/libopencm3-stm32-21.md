title: 'STM32 LibOpenCM3：ADC 多通道 Injected'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-10-04 12:00:00
---

# 前言
ADC（Analog to Digital Converter）顧名思義是將類比訊號轉換成數位訊號的元件，現今多數 MCU 都會內建 ADC，而這也是相當基本且常用的功能。  

上一篇已經介紹過最基本的 ADC 單一 Regular 通道用法，這篇文章要繼續示範如何使用 ADC Injected 多通道讀取，並使用 UART 傳到電腦上觀看。  

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 與 `main.h`。  

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  Multi injected channel ADC example for STM32 Nucleo-F446RE.
 */

#include "main.h"

int main(void)
{
  rcc_setup();
  adc_setup();
  usart_setup();

  while (1)
  {
    /* Software start ADC injected conversion. */
    adc_start_conversion_injected(ADC1);

    /* Wait for ADC injected end of conversion. */
    while (!adc_eoc_injected(ADC1))
    { }

    /* Clear ADC injected end of conversion flag. */
    ADC_SR(ADC1) &= ~ADC_SR_JEOC;

    /* Read ADC injected. */
    uint16_t value1 = adc_read_injected(ADC1, 1);
    uint16_t value2 = adc_read_injected(ADC1, 2);
    uint16_t value3 = adc_read_injected(ADC1, 3);

    printf("%4d, %4d, %4d\r\n", value1, value2, value3);
    delay(5000000);
  }

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
                  GPIO_ADC_IN0_PIN | GPIO_ADC_IN1_PIN | GPIO_ADC_IN4_PIN);

  /* Setup ADC. */
  adc_power_off(ADC1);

  adc_enable_scan_mode(ADC1);
  adc_set_single_conversion_mode(ADC1);
  adc_disable_discontinuous_mode_regular(ADC1);
  adc_disable_discontinuous_mode_injected(ADC1);

  /* We want to start the injected conversion in sofrware. */
  adc_enable_external_trigger_injected(ADC1,
                                       ADC_CR2_JSWSTART,
                                       ADC_CR2_JEXTEN_DISABLED);

  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  uint8_t channels[4];
  channels[0] = 0;
  channels[1] = 1;
  channels[2] = 4;
  adc_set_injected_sequence(ADC1, 3, channels);

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
#define GPIO_ADC_IN0_PIN (GPIO0) /* Arduino-A0. */
#define GPIO_ADC_IN1_PIN (GPIO1) /* Arduino-A1. */
#define GPIO_ADC_IN4_PIN (GPIO4) /* Arduino-A2. */

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
```
除了基本的 `rcc.h` 和 `gpio.h` 及必要的 `adc.h` 外，因爲我要使用 USART 和 `printf()`，所以還會需要 `usart.h`、`stdio.h` 與 `errno.h`。  
  
> USART 和 `printf()` 的詳細用法請看[之前的文章](https://ziteh.github.io/2022/09/libopencm3-stm32-9/)。  

### 設定 ADC
``` c
static void adc_setup(void)
{
/* Set to input analog. */
  gpio_mode_setup(GPIO_ADC_PORT,
                  GPIO_MODE_ANALOG,
                  GPIO_PUPD_NONE,
                  GPIO_ADC_IN0_PIN | GPIO_ADC_IN1_PIN | GPIO_ADC_IN4_PIN);

  /* Setup ADC. */
  adc_power_off(ADC1);

  adc_enable_scan_mode(ADC1);
  adc_set_single_conversion_mode(ADC1);
  adc_disable_discontinuous_mode_regular(ADC1);
  adc_disable_discontinuous_mode_injected(ADC1);

  /* We want to start the injected conversion in sofrware. */
  adc_enable_external_trigger_injected(ADC1,
                                       ADC_CR2_JSWSTART,
                                       ADC_CR2_JEXTEN_DISABLED);

  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  uint8_t channels[4];
  channels[0] = 0;
  channels[1] = 1;
  channels[2] = 4;
  adc_set_injected_sequence(ADC1, 3, channels);

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */
}
```
要使用 ADC 功能，首先要知道 ADC 的通道在哪些 GPIO 上，並將其設定爲類比輸入。  
  
接下來就是要設定 ADC。  
* `adc_enable_scan_mode()` 由於本例要讀取 3 個通道，所以要致能掃描模式。
* `adc_set_single_conversion_mode()` 設定成單一轉換模式，不連續轉換。
* `adc_disable_discontinuous_mode_regular()` 與 `adc_disable_discontinuous_mode_injected()` 禁能 Regular 與 Injected 的不連續模式。
* `adc_enable_external_trigger_injected()` 設定以使用 Injected 的軟體觸發。
* `adc_set_right_aligned()` 讓資料的對齊方式爲靠右對齊。
* `adc_set_sample_time_on_all_channels()` 設定所有通道的取樣時間，這裡使用 56 個 Cycle。
* `adc_set_injected_sequence()` 設定 Injected 通道組的序列。本例要讀取的是 Ch0、Ch1 與 Ch4 這 3 個通道。

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
    /* Software start ADC injected conversion. */
    adc_start_conversion_injected(ADC1);

    /* Wait for ADC injected end of conversion. */
    while (!adc_eoc_injected(ADC1))
    { }

    /* Clear ADC injected end of conversion flag. */
    ADC_SR(ADC1) &= ~ADC_SR_JEOC;

    /* Read ADC injected. */
    uint16_t value1 = adc_read_injected(ADC1, 1);
    uint16_t value2 = adc_read_injected(ADC1, 2);
    uint16_t value3 = adc_read_injected(ADC1, 3);

    printf("%4d, %4d, %4d\r\n", value1, value2, value3);
    delay(5000000);
  }

  return 0;
}
```
`adc_start_conversion_injected()` 會觸發 ADC 進行 Injected 組轉換，並以 `adc_eoc_injected()` 觀察 Injected 組是否轉換完成。

確認 ADC 轉換完成後使用 `adc_read_injected()` 來讀取各個轉換完的資料。雖然 Injected 組最多只能設定 4 個，但是它的 4 個通道的資料暫存器是各自獨立的（ADC_JDRx），這裡的第二個參數就是選擇要讀取 1\~4 哪一個 Injected 資料暫存器。要注意這裡的第二個引數是 1\~4 而非 0\~3。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
以下列出主要的差異部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/adc_multi_channel_injected)。  

要注意的是除了以往的 RCC 與 GPIO 的設定不同外，ADC 也有部分不同，要特別注意。

``` c
static void adc_setup(void)
{
  /* 省略部分程式. */

  /* We want to start the injected conversion in sofrware. */
#if defined(STM32F1)
  adc_enable_external_trigger_injected(ADC1,
                                       ADC_CR2_JSWSTART);
#else
  adc_enable_external_trigger_injected(ADC1,
                                       ADC_CR2_JSWSTART,
                                       ADC_CR2_JEXTEN_DISABLED);
#endif

  adc_set_right_aligned(ADC1);
  adc_set_sample_time_on_all_channels(ADC1, ADC_SIMPLE_TIME);

  uint8_t channels[4];
  channels[0] = 0;
  channels[1] = 1;
  channels[2] = 4;
  adc_set_injected_sequence(ADC1, 3, channels);

  adc_power_on(ADC1);
  delay(800000); /* Wait a bit. */

#if defined(STM32F1)
  adc_reset_calibration(ADC1);
  adc_calibrate(ADC1);
#endif
}
```

# 小結
這次延續了上一篇的內容，介紹多通道的 Injected 用法。

一般來說，由於 Regular 組只有一個 16 位元的資料暫存器，若要使用掃描模式讀出序列中的多個通道的話，就必須要設定 DMA。但 Injected 組的 4 個資料暫存器是各自獨立的，因此如過要讀取的 ADC 通道在 4 個內的話，可以考慮使用 Injected 組，這樣就不用設定 DMA 了。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/adc_multi_channel_injected) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
