---
title: 'STM32 LibOpenCM3：SPI (Master mode)'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-10-07 12:00:00
comments: true
toc: true
draft: false
aliases: ["/2022/10/libopencm3-stm32-24/"]
---

# 前言
SPI（Serial Peripheral Interface）是一種常見的同步序列通訊協定，為主從式架構。有許多感測器或模組都使用 SPI 進行通訊。

這次的範例要實現 USART 與 SPI (Master mode) 的轉發器——把 USART 接收到的資料由 SPI 發送出去，而 SPI 收到的資料由 USART 發送。並且有一個 EXTI 的外部請求接腳。

<!--more-->

最典型的 SPI 有 4 條線：
* SCK：Serial clock
* MOSI：Master output, slave input
* MISO：Master input, slave output
* SS：Slave select，或 CS(Chip select)

關於 SPI 本身我並不打算詳細介紹，若讀者還不熟悉 SPI 的基本概念的話，建議先另外查詢相關文章。我覺得「[Day 13：SPI (Part 1) - 原來是 Shift Register 啊！我還以為是 SPI 呢！](https://ithelp.ithome.com.tw/articles/10245910)」與「[SPI (Serial Peripheral Interface) 串列 (序列) 週邊介面](https://magicjackting.pixnet.net/blog/post/164725144)」這兩篇寫得就很不錯。

# 正文
首先一樣以 Nucleo-F446RE 做示範。

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 為「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 與 `main.h`。

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  SPI master mode example for STM32 Nucleo-F446RE.
 */

#include "main.h"

int main(void)
{
  rcc_setup();
  usart_setup();
  spi_setup();
  spi_rq_setup();

  usart_send_blocking(USART2, 'M');
  usart_send_blocking(USART2, 'a');
  usart_send_blocking(USART2, 's');
  usart_send_blocking(USART2, 't');
  usart_send_blocking(USART2, 'e');
  usart_send_blocking(USART2, 'r');
  usart_send_blocking(USART2, '\r');
  usart_send_blocking(USART2, '\n');

  while (1)
  { }
  return 0;
}

static void spi_select(void)
{
  gpio_clear(GPIO_SPI_PORT, GPIO_SPI_CS_PIN);
}

static void spi_deselect(void)
{
  gpio_set(GPIO_SPI_PORT, GPIO_SPI_CS_PIN);
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_SYSCFG); /* For EXTI. */
  rcc_periph_clock_enable(RCC_GPIOA);
  rcc_periph_clock_enable(RCC_GPIOC);
  rcc_periph_clock_enable(RCC_USART2);
  rcc_periph_clock_enable(RCC_SPI1);
}

static void spi_setup(void)
{
  /*
   * Set SPI-SCK & MISO & MOSI pin to alternate function.
   * Set SPI-CS pin to output push-pull (control CS by manual).
   */
  gpio_mode_setup(GPIO_SPI_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN);

  gpio_set_output_options(GPIO_SPI_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_50MHZ,
                          GPIO_SPI_SCK_PIN | GPIO_SPI_MOSI_PIN);

  gpio_set_af(GPIO_SPI_PORT,
              GPIO_SPI_AF,
              GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN);

  /* In master mode, control CS by user instead of AF. */
  gpio_mode_setup(GPIO_SPI_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_SPI_CS_PIN);
  gpio_set_output_options(GPIO_SPI_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_25MHZ, GPIO_SPI_CS_PIN);

  spi_disable(SPI1);
  spi_reset(SPI1);

  /* Set up in master mode. */
  spi_init_master(SPI1,
                  SPI_CR1_BAUDRATE_FPCLK_DIV_64,   /* Clock baudrate. */
                  SPI_CR1_CPOL_CLK_TO_0_WHEN_IDLE, /* CPOL = 0. */
                  SPI_CR1_CPHA_CLK_TRANSITION_2,   /* CPHA = 1. */
                  SPI_CR1_DFF_8BIT,                /* Data frame format. */
                  SPI_CR1_MSBFIRST);               /* Data frame bit order. */
  spi_set_full_duplex_mode(SPI1);

  /*
   * CS pin is not used on master side at standard multi-slave config.
   * It has to be managed internally (SSM=1, SSI=1)
   * to prevent any MODF error.
   */
  spi_enable_software_slave_management(SPI1); /* SSM = 1. */
  spi_set_nss_high(SPI1);                     /* SSI = 1. */

  spi_deselect();
  spi_enable(SPI1);
}

static void spi_rq_setup(void)
{
  /* Set RQ pin to input floating. */
  gpio_mode_setup(GPIO_SPI_RQ_PORT, GPIO_MODE_INPUT, GPIO_PUPD_NONE, GPIO_SPI_RQ_PIN);

  /* Setup interrupt. */
  exti_select_source(EXTI_SPI_RQ, GPIO_SPI_RQ_PORT);
  exti_set_trigger(EXTI_SPI_RQ, EXTI_TRIGGER_FALLING);
  exti_enable_request(EXTI_SPI_RQ);
  nvic_enable_irq(NVIC_SPI_RQ_IRQ);
}

static void usart_setup(void)
{
  /* Set USART-Tx & Rx pin to alternate function. */
  gpio_mode_setup(GPIO_USART_TXRX_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_USART_TX_PIN | GPIO_USART_RX_PIN);

  gpio_set_af(GPIO_USART_TXRX_PORT,
              GPIO_USART_AF,
              GPIO_USART_TX_PIN | GPIO_USART_RX_PIN);

  /* Setup interrupt. */
  nvic_enable_irq(NVIC_USART2_IRQ);
  usart_enable_rx_interrupt(USART2); /* Enable receive interrupt. */

  /* Config USART params. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX_RX);

  usart_enable(USART2);
}

/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  uint8_t indata = usart_recv(USART2); /* Read received data. */

  spi_select();
  spi_send(SPI1, indata);

  /* Wait for SPI transmit complete. */
  while (!(SPI_SR(SPI1) & SPI_SR_TXE)) /* Wait for 'Transmit buffer empty' flag to set. */
  { }
  while ((SPI_SR(SPI1) & SPI_SR_BSY)) /* Wait for 'Busy' flag to reset. */
  { }

  spi_deselect();

  /* Clear 'Read data register not empty' flag. */
  USART_SR(USART2) &= ~USART_SR_RXNE;
}

/**
 * @brief EXTI9~5 Interrupt service routine.
 */
void exti9_5_isr(void)
{
  exti_reset_request(EXTI_SPI_RQ);

  spi_select();
  spi_send(SPI1, 0x00);               /* Just for beget clock signal. */
  while ((SPI_SR(SPI1) & SPI_SR_BSY)) /* Wait for 'Busy' flag to reset. */
  { }
  uint8_t indata = spi_read(SPI1);

  while ((SPI_SR(SPI1) & SPI_SR_BSY)) /* Wait for 'Busy' flag to reset. */
  { }
  spi_deselect();

  usart_send_blocking(USART2, indata);
}
```

``` c
/**
 * @file main.h
 */

#ifndef MAIN_H
#define MAIN_H

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/spi.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/stm32/exti.h>
#include <libopencm3/cm3/nvic.h>

#define USART_BAUDRATE (9600)

#define GPIO_SPI_PORT (GPIOA)
#define GPIO_SPI_SCK_PIN (GPIO5)  /* D13. */
#define GPIO_SPI_MISO_PIN (GPIO6) /* D12. */
#define GPIO_SPI_MOSI_PIN (GPIO7) /* D11. */
#define GPIO_SPI_CS_PIN (GPIO4)   /* A2. */
#define GPIO_SPI_AF (GPIO_AF5)    /* Ref: Table-11 in DS10693. */

#define GPIO_SPI_RQ_PORT (GPIOC)
#define GPIO_SPI_RQ_PIN (GPIO7) /* D9. */
#define EXTI_SPI_RQ (EXTI7)
#define NVIC_SPI_RQ_IRQ (NVIC_EXTI9_5_IRQ)

#define GPIO_USART_TXRX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* ST-Link (D1). */
#define GPIO_USART_RX_PIN (GPIO3) /* ST-Link (D0). */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

static void usart_setup(void);
static void spi_rq_setup(void);
static void spi_setup(void);
static void rcc_setup(void);

static void spi_select(void);
static void spi_deselect(void);

#endif /* MAIN_H. */
```
## 分段說明
### Include
``` c
// main.h
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/spi.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/stm32/exti.h>
#include <libopencm3/cm3/nvic.h>
```
除了基本的 `rcc.h`、`gpio.h`，這次的 `spi.h`、`usart.h`、`nvic.h` 外，我希望此 SPI 有一個獨立的 EXTI 請求接腳，所以還會用到 `exti.h`。

### 設定 SPI
``` c

static void spi_setup(void)
{
  /*
   * Set SPI-SCK & MISO & MOSI pin to alternate function.
   * Set SPI-CS pin to output push-pull (control CS by manual).
   */
  gpio_mode_setup(GPIO_SPI_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN);

  gpio_set_output_options(GPIO_SPI_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_50MHZ,
                          GPIO_SPI_SCK_PIN | GPIO_SPI_MOSI_PIN);

  gpio_set_af(GPIO_SPI_PORT,
              GPIO_SPI_AF,
              GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN);

  /* In master mode, control CS by user instead of AF. */
  gpio_mode_setup(GPIO_SPI_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_SPI_CS_PIN);
  gpio_set_output_options(GPIO_SPI_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_25MHZ, GPIO_SPI_CS_PIN);

  spi_disable(SPI1);
  spi_reset(SPI1);

  /* Set up in master mode. */
  spi_init_master(SPI1,
                  SPI_CR1_BAUDRATE_FPCLK_DIV_64,   /* Clock baudrate. */
                  SPI_CR1_CPOL_CLK_TO_0_WHEN_IDLE, /* CPOL = 0. */
                  SPI_CR1_CPHA_CLK_TRANSITION_2,   /* CPHA = 1. */
                  SPI_CR1_DFF_8BIT,                /* Data frame format. */
                  SPI_CR1_MSBFIRST);               /* Data frame bit order. */
  spi_set_full_duplex_mode(SPI1);

  /*
   * CS pin is not used on master side at standard multi-slave config.
   * It has to be managed internally (SSM=1, SSI=1)
   * to prevent any MODF error.
   */
  spi_enable_software_slave_management(SPI1); /* SSM = 1. */
  spi_set_nss_high(SPI1);                     /* SSI = 1. */

  spi_deselect();
  spi_enable(SPI1);
}
```
首先要設定 SPI 的 GPIO。除了 CS 腳設定為通用功能 Push-Pull 輸出模式外，SCK、MOSI 與 MISO 都設定成 Alternate function Push-Pull。

再來是設定 SPI 本身。在使用 SPI 通訊時有幾個比較重要的設定要注意，首先是 SPI Mode，也就是 CPOL（Clock Polarity） 與 CPHA（Clock Phase） 的設定。

CPOL 決定了 SPI 閒置時 SCK 要為 `Low`（CPOL = `0`） 還是 `High`（CPOL = `1`）；CPHA 則是定義 SPI 的資料取樣要在第 1 個邊緣（CPHA = `0`），還是第 2 個邊緣（CPHA = `1`）。因此共有 4 種組合：

| Mode | CPOL | CPHA |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 0 | 1 |
| 2 | 1 | 0 |
| 3 | 1 | 1 |

這裡我使用 CPOL = `0`（`SPI_CR1_CPOL_CLK_TO_0_WHEN_IDLE`）與 CPHA = `1`（`SPI_CR1_CPHA_CLK_TRANSITION_2`），也就是 Mode 1。根據此設定，因為閒置時 SCK 是 `Low`，而 SPI 在第 2 個邊緣進行資料取樣，也就是在 SCK 的負緣採樣。

另外使用 `spi_set_full_duplex_mode()` 將 SPI 設為全雙工模式。

要注意的是，若是使用一般的 SPI 配置（一個 Master，多個 Slave）的話，Master device 的 CS（NSS）腳是沒特殊作用的（即 AF 不會控制它，要使用者自己手動控制），且要啓用「Software NSS management（SSM=`1`）」和將 SSI（Internal slave select）設為 `1`，以避免出錯。因此呼叫 `spi_enable_software_slave_management()` 及 `spi_set_nss_high()`。

> NSS pin is not used on master side at this configuration. It has to be managed internally (SSM=1, SSI=1) to prevent any MODF error. 參考自 RM0390 Rev6 P.852。

![▲ Standard multi-slave communication 的 SPI 接線圖。取自 RM0390 Rev6 P.852](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3q5zGTwKUgtoHk9VA_u2Zudc2cCPIHnlo76N3BOs5V6gK_uZOmrFNWMR2xH_hSWokrT2OpEiSCGisnUedcldrwULizln5y2gf4r1M_PBNVAtlzcbXNrRFxlELkI8JOh2oGSL_tqdV-RxRLoQDcRLbz5cPmcmG0Kd0GUeiq65dENCr8U1cSk6BASrz/s16000/1.png)

### SPI CS 選擇/反選擇
``` c
static void spi_select(void)
{
  gpio_clear(GPIO_SPI_CS_PORT, GPIO_SPI_CS_PIN);
}

static void spi_deselect(void)
{
  gpio_set(GPIO_SPI_CS_PORT, GPIO_SPI_CS_PIN);
}
```
CS 的控制就是一般的 GPIO 輸出，將其寫成函式以方便操作。

### USART ISR
``` c
/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  uint8_t indata = usart_recv(USART2); /* Read received data. */

  spi_select();
  spi_send(SPI1, indata);

  /* Wait for SPI transmit complete. */
  while (!(SPI_SR(SPI1) & SPI_SR_TXE)) /* Wait for 'Transmit buffer empty' flag to set. */
  { }
  while ((SPI_SR(SPI1) & SPI_SR_BSY)) /* Wait for 'Busy' flag to reset. */
  { }

  spi_deselect();

  /* Clear 'Read data register not empty' flag. */
  USART_SR(USART2) &= ~USART_SR_RXNE;
}
```
由於目標功能是 USART-SPI 的轉發器，所以在 USART 接收到資料後，要將接收到的資料透過 SPI 傳送出去。

這裡的 SPI 傳送步驟為：
1. 選擇 Slave device（CS 輸出 `Low`）。
2. 使用 `spi_send()` 將要傳送的資料寫入 SPI_DR 暫存器中。此函式會先等待目前的傳輸已經結束後（`SPI_SR_TXE` flag）才將資料寫入資料暫存器。
3. 讀取 `SPI_SR_TXE`（傳送緩衝器為空） 與 `SPI_SP_BSY`（忙碌） flag，以等待 SPI 完成傳輸。
4. 取消選擇 Slave device（CS 輸出 `High`）。

### EXTI ISR
``` c
/**
 * @brief EXTI9~5 Interrupt service routine.
 */
void exti9_5_isr(void)
{
  exti_reset_request(EXTI_SPI_RQ);

  spi_select();
  spi_send(SPI1, 0x00);               /* Just for beget clock signal. */
  while ((SPI_SR(SPI1) & SPI_SR_BSY)) /* Wait for 'Busy' flag to reset. */
  { }
  uint8_t indata = spi_read(SPI1);

  while ((SPI_SR(SPI1) & SPI_SR_BSY)) /* Wait for 'Busy' flag to reset. */
  { }
  spi_deselect();

  usart_send_blocking(USART2, indata);
}
```
當 RQ 請求腳被觸發（`Low` 觸發）時，代表 Slave device 想發起通訊，因此 Master device 要拉低 CS 腳以選擇 Slave device，並讀取 MISO 的資料。

要注意的是 SPI slave device 不會自己產生 SCK 時脈訊號，SCK 是由 Master device 產生的，而在這裡單純呼叫 `spi_read()` 也不會讓 Master device 產生 SCK 訊號，因此要呼叫 `spi_send()` 並傳送一個假資料（這裡為 `0x00`）讓 SCK 產生。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

由於這次程式較長，所以完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/spi_master)。

## 成果
由於下一篇才會寫 SPI slave，因此這次就先只以邏輯分析儀查看 SPI 的輸出。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPybNvt9IvLtpR2_YSS13vsCV1R0BhmUsGVljptvTiVLLtZDsRxvKXOnRy8Y9Ws7JW2H1TSTB_S3v77jRs3ZYvt7UI9Vt2AZEWMKKLrQAvD4hcTJVxKj3OcfLr4aphcPdhQ-VSFqZTEEVVrZeqAZgz8YbBRTzSznCmcSK7sJXbhJmeG4VfjfmQca2I/s16000/spi_master_1_1662702192720_0.png)

訊號波形由上而下是 CS（D4）、SCK（D7）、MOSI（D5）與 MISO（D6）。

我傳送的資料是 `0xA7`，也就是 `1010 0111b`，以 SCK 的負緣對照 MOSI 訊號也是正確的。

# 小結
SPI 是許多感測器及模組在使用的通訊介面，會使用 SPI 才能使用這些外部元件，因此 SPI 也是很重要的功能。這次介紹了最基本的 SPI 用法，應該已經足夠應付基本的使用了。

# 參考資料
* [Day 13：SPI (Part 1) - 原來是 Shift Register 啊！我還以為是 SPI 呢！](https://ithelp.ithome.com.tw/articles/10245910)
* [SPI (Serial Peripheral Interface) 串列 (序列) 週邊介面](https://magicjackting.pixnet.net/blog/post/164725144)
* [SPI using Registers in STM32](https://controllerstech.com/spi-using-registers-in-stm32/)
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/spi_master) 上。
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10302235)。
