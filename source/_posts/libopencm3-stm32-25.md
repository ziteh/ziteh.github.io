---
title: 'STM32 LibOpenCM3：SPI (Slave mode)'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-10-08 11:00:00
comments: true
toc: true
draft: false
aliases: ["/2022/10/libopencm3-stm32-25/"]
---

# 前言
上次已經介紹了 SPI 作為 Master device 的程式，這次要接著介紹作為 Slave device 的程式寫法，讓 Master 與 Slave 可以互相溝通。

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 為「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 與 `main.h` 檔案。

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  SPI slave mode example for STM32 Nucleo-F446RE.
 */

#include "main.h"

int main(void)
{
  rcc_setup();
  usart_setup();
  spi_setup();
  spi_rq_setup();

  usart_send_blocking(USART2, 's');
  usart_send_blocking(USART2, 'l');
  usart_send_blocking(USART2, 'a');
  usart_send_blocking(USART2, 'v');
  usart_send_blocking(USART2, 'e');
  usart_send_blocking(USART2, '\r');
  usart_send_blocking(USART2, '\n');

  while (1)
  { }
  return 0;
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_GPIOA);
  rcc_periph_clock_enable(RCC_GPIOC);
  rcc_periph_clock_enable(RCC_USART2);
  rcc_periph_clock_enable(RCC_SPI1);
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

  /* Setup USART config. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX_RX);

  usart_enable(USART2);
}

static void spi_setup(void)
{
  /* Set SPI pins to alternate function. */
  gpio_mode_setup(GPIO_SPI_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN | GPIO_SPI_CS_PIN);

  gpio_set_output_options(GPIO_SPI_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_50MHZ,
                          GPIO_SPI_MISO_PIN);

  gpio_set_af(GPIO_SPI_PORT,
              GPIO_SPI_AF,
              GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN | GPIO_SPI_CS_PIN);

  spi_disable(SPI1);
  spi_reset(SPI1);

  /* SPI init. */
  spi_init_master(SPI1,
                  SPI_CR1_BAUDRATE_FPCLK_DIV_64,   /* Clock baudrate. */
                  SPI_CR1_CPOL_CLK_TO_0_WHEN_IDLE, /* CPOL = 0. */
                  SPI_CR1_CPHA_CLK_TRANSITION_2,   /* CPHA = 1. */
                  SPI_CR1_DFF_8BIT,                /* Data frame format. */
                  SPI_CR1_MSBFIRST);               /* Data frame bit order. */
  spi_set_slave_mode(SPI1);                        /* Set to slave mode. */
  spi_set_full_duplex_mode(SPI1);

  /*
   * Set to hardware NSS management and NSS output disable.
   * The NSS pin works as a standard “chip select” input in slave mode.
   */
  spi_disable_software_slave_management(SPI1); /* SSM = 0. */
  spi_disable_ss_output(SPI1);                 /* SSOE = 0. */

  /* Serup interrupt. */
  spi_enable_rx_buffer_not_empty_interrupt(SPI1);
  nvic_enable_irq(NVIC_SPI1_IRQ);

  spi_enable(SPI1);
}

static void spi_rq_setup(void)
{
  /* Set RQ pin to output push-pull. */
  gpio_mode_setup(GPIO_SPI_RQ_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_SPI_RQ_PIN);
  gpio_set_output_options(GPIO_SPI_RQ_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_25MHZ, GPIO_SPI_RQ_PIN);

  spi_rq_reset();
}

static void spi_rq_set(void)
{
  gpio_clear(GPIO_SPI_RQ_PORT, GPIO_SPI_RQ_PIN);
}

static void spi_rq_reset(void)
{
  gpio_set(GPIO_SPI_RQ_PORT, GPIO_SPI_RQ_PIN);
}

/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  uint8_t indata = usart_recv(USART2); /* Read received data. */
  spi_send(SPI1, indata);              /* Put data into buffer. */
  spi_rq_set();                        /* Request master device to select this device. */

  /* Clear 'Read data register not empty' flag. */
  USART_SR(USART2) &= ~USART_SR_RXNE;
}

/**
 * @brief SPI1 Interrupt service routine.
 */
void spi1_isr(void)
{
  /* Wait for 'Busy' flag to reset. */
  while ((SPI_SR(SPI1) & SPI_SR_BSY))
  {
  }

  uint8_t indata = spi_read(SPI1);
  spi_rq_reset();
  usart_send_blocking(USART2, indata);

  /* Clear 'Read data register not empty' flag. */
  SPI_SR(SPI1) &= ~SPI_SR_RXNE;
}
```

``` c
/* @file main.h */

#ifndef MAIN_H
#define MAIN_H

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/spi.h>
#include <libopencm3/stm32/usart.h>
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

#define GPIO_USART_TXRX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* ST-Link (D1). */
#define GPIO_USART_RX_PIN (GPIO3) /* ST-Link (D0). */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

static void rcc_setup(void);
static void usart_setup(void);
static void spi_setup(void);
static void spi_rq_setup(void);

static void spi_rq_set(void);
static void spi_rq_reset(void);

#endif /* MAIN_H. */
```
## 分段說明
### 設定 SPI
``` c
static void spi_setup(void)
{
  /* Set SPI pins to alternate function. */
  gpio_mode_setup(GPIO_SPI_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN | GPIO_SPI_CS_PIN);

  gpio_set_output_options(GPIO_SPI_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_50MHZ,
                          GPIO_SPI_MISO_PIN);

  gpio_set_af(GPIO_SPI_PORT,
              GPIO_SPI_AF,
              GPIO_SPI_SCK_PIN | GPIO_SPI_MISO_PIN | GPIO_SPI_MOSI_PIN | GPIO_SPI_CS_PIN);

  spi_disable(SPI1);
  spi_reset(SPI1);

  /* SPI init. */
  spi_init_master(SPI1,
                  SPI_CR1_BAUDRATE_FPCLK_DIV_64,   /* Clock baudrate. */
                  SPI_CR1_CPOL_CLK_TO_0_WHEN_IDLE, /* CPOL = 0. */
                  SPI_CR1_CPHA_CLK_TRANSITION_2,   /* CPHA = 1. */
                  SPI_CR1_DFF_8BIT,                /* Data frame format. */
                  SPI_CR1_MSBFIRST);               /* Data frame bit order. */
  spi_set_slave_mode(SPI1);                        /* Set to slave mode. */
  spi_set_full_duplex_mode(SPI1);

  /*
   * Set to hardware NSS management and NSS output disable.
   * The NSS pin works as a standard “chip select” input in slave mode.
   */
  spi_disable_software_slave_management(SPI1); /* SSM = 0. */
  spi_disable_ss_output(SPI1);                 /* SSOE = 0. */

  /* Serup interrupt. */
  spi_enable_rx_buffer_not_empty_interrupt(SPI1);
  nvic_enable_irq(NVIC_SPI1_IRQ);

  spi_enable(SPI1);
}
```
這部分與[設定 Master](https://ziteh.github.io/2022/10/libopencm3-stm32-24/) 時的類似。不過要注意的是，Master device 的 CS（NSS）腳不受 AF 控制，但 Slave device 的會，所以 CS 腳也要設為 AF。

SPI 本身的設定如 CPOL 與 CPHA 要與 Master 一致才可以正常通訊，這裡設為 CPOL=`0` CPHA=`1`。

然後先使用 `spi_init_master()` 初始化 SPI 的相關設定，再以 `spi_set_slave_mode()` 設定成 Slave mode。

一樣以 `spi_set_full_duplex_mode()` 設為全雙工模式。

再來，為了要使用硬體 CS，所以要將 SSM 和 SSOE 都設為 `0`。這裡呼叫 `spi_disable_software_slave_management()` 與 `spi_disable_ss_output()` 來完成設定。

> **NSS output disable (SSM=0, SSOE = 0)**: In slave mode, the NSS pin works as a standard “chip select” input and the slave is selected while NSS line is at low level.
> 節錄自 RM0390 Rev6 P.854。

之後再啓用 SPI 的中斷功能。

### SPI ISR
```c
/**
 * @brief SPI1 Interrupt service routine.
 */
void spi1_isr(void)
{
  /* Wait for 'Busy' flag to reset. */
  while ((SPI_SR(SPI1) & SPI_SR_BSY))
  {
  }

  uint8_t indata = spi_read(SPI1);
  spi_rq_reset();
  usart_send_blocking(USART2, indata);

  /* Clear 'Read data register not empty' flag. */
  SPI_SR(SPI1) &= ~SPI_SR_RXNE;
}
```
我們設定啓用 SPI 的「接收資料非空」中斷事件，因此 ISR 就負責讀取 Master 傳送的資料，若先前有 Slave 要傳送的資料也會在 CS 腳被下拉且 Master 發起 SCK 時脈訊號後傳送。

### USART ISR
``` c
/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  uint8_t indata = usart_recv(USART2); /* Read received data. */
  spi_send(SPI1, indata);              /* Put data into buffer. */
  spi_rq_set();                        /* Request master device to select this device. */

  /* Clear 'Read data register not empty' flag. */
  USART_SR(USART2) &= ~USART_SR_RXNE;
}
```
當 USART 收到資料時，會將資料先用 `spi_send()` 寫入到傳送暫存器中，然後以 `spi_rq_set()` 將 RQ 腳拉低以請求 Master 進行通訊。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

由於這次程式較長，所以完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/spi_slave)。

## 成果
我使用兩塊 STM32 Nucleo 板分別當作 Master 與 Slave。將線都接好後就可以讓兩者互相溝通了，記得要共地。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQWxce05Q7hVidOerp87jGm3OdbFC2Z6R4fT8o7EljCvE50yJ360QFM87wZq7DYdsORGyXTv_Hm7Ujjtrdhl9a9U5j0sPhTLAEehmcv-Ey53StAYgbEO_WVBDiUF5DEnAEI_jBuwArcBKY_myZj_CiiYOZZLFbCFGxnYpCGCdiE369_P9nS2cinnnW/s16000/spi_new.gif)

# 小結
這次接續上次的 SPI Master，寫了 Slave 的操作介紹。其實用法基本上是差不多的，相信不會太難。

會使用 SPI 通常是要連接其它的模組，所以 STM32 通常是當作 Master 的角色，但如果想要自己用 STM32 做一個「模組」的話，就可以用到 SPI Slave 模式了。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/spi_slave) 上。
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10302253)。
