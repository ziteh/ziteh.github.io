---
title: 'STM32 LibOpenCM3：USART 接收'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-23 8:51:00
comments: true
toc: true
draft: false
aliases: ["/2022/09/libopencm3-stm32-10/"]
---

# 前言
上一篇中我介紹了 USART 的發送，這次要來寫 USART 的接收了。由於透過輪詢的方式實現 USART 的接收實在是不是一個好的寫法，因此我們會直接使用中斷（Interrupt）的方式來達成。

這次的功能爲讓 STM32 將 USART 接收到的資料原封不動丟回去，且收到資料時 LED 會閃一下。

<!--more-->

# 正文
一樣先以 Nucleo-F446RE 做示範。

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。
## 完整程式
``` c
/**
 * @file   main.c
 * @brief  USART with receive interrupt for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/cm3/nvic.h>

#define USART_BAUDRATE (9600)

#define RCC_USART_TXRX_GPIO (RCC_GPIOA)
#define GPIO_USART_TXRX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* D1. */
#define GPIO_USART_RX_PIN (GPIO3) /* D0. */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5) /* D13. */

static void delay(uint32_t value)
{
  for (uint32_t i = 0; i < value; i++)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_USART_TXRX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
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

static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
}

int main(void)
{
  rcc_setup();
  led_setup();
  usart_setup();

  while (1)
  { /* Halt. */ }
  return 0;
}

/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  gpio_set(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on. */

  uint8_t indata = usart_recv(USART2); /* Read. */
  usart_send_blocking(USART2, indata); /* Send. */

  delay(100000);
  gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN); /* LED off. */

  USART_SR(USART2) &= ~USART_SR_RXNE; /* Clear 'Read data register not empty' flag. */
}
```

## 分段說明
### Include
``` c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/cm3/nvic.h>
```
因爲會用到中斷的功能，所以記得要引入 `nvic.h`。

### GPIO 腳位
``` c
#define RCC_USART_TXRX_GPIO (RCC_GPIOA)
#define GPIO_USART_TXRX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* D1. */
#define GPIO_USART_RX_PIN (GPIO3) /* D0. */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5) /* D13. */
```
這裡一樣使用 Nucleo 開發板規劃好的 USART2，其 Tx 與 Rx 腳分別爲 PA2 與 PA3。LED 一樣是 PA5。

### RCC
``` c
static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_USART_TXRX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
}
```
除了要致能 USART Tx/Rx 與 LED 所在的 GPIO Port 外，也要記得致能 USART 本身。

> 由於此例中 USART Tx/Rx 與 LED 都位於 GPIO Port-A，其實可以只致能一次就好。

### USART 設定
``` c
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
```
先設定 GPIO。我們要把 USART 的 Tx 與 Rx 都設定成 Alternate Function。

再來使用 `nvic_enable_irq()` 來致能 USART 的 IRQ，`usart_enable_rx_interrupt()` 致能 USART 的接收中斷。

最後就是設定 USART 的通訊設置（鮑率、資料位元、停止位元等），值得注意的是因爲我們這次需要同時啓用接收（Rx）與發送（Tx），所以 `usart_set_mode()` 的引數是 `USART_MODE_TX_RX`。

### USART ISR
``` c
/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  gpio_set(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on. */

  uint8_t indata = usart_recv(USART2); /* Read. */
  usart_send_blocking(USART2, indata); /* Send. */

  delay(100000);
  gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN); /* LED off. */

  USART_SR(USART2) &= ~USART_SR_RXNE; /* Clear 'Read data register not empty' flag. */
}
```
這是 USART2 的 ISR，其名稱 `usart2_isr` 是固定的，不能打錯。當 STM32 從 USART2 接收到資料時就會產生 IRQ 並執行此 ISR。

使用 `usart_recv()` 函式來讀取接收到的資料，再用 `usart_send_blocking()` 把資料直接傳回去。

`USART_SR(USART2) &= ~USART_SR_RXNE` 是用來清除「接收資料非空（RXNE）」旗標的。

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

以下列出主要的差異部分，也就是 GPIO 的部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/usart_receive_interrupt)。
``` c
static void usart_setup(void)
{
  /* Set USART-Tx & Rx pin to alternate function. */
#if defined(STM32F1)
  gpio_set_mode(GPIO_USART_TXRX_PORT,
                GPIO_MODE_OUTPUT_50_MHZ,
                GPIO_CNF_OUTPUT_ALTFN_PUSHPULL,
                GPIO_USART_TX_PIN);

  gpio_set_mode(GPIO_USART_TXRX_PORT,
                GPIO_MODE_INPUT,
                GPIO_CNF_INPUT_FLOAT,
                GPIO_USART_RX_PIN);
#else
  gpio_mode_setup(GPIO_USART_TXRX_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_USART_TX_PIN | GPIO_USART_RX_PIN);

  gpio_set_af(GPIO_USART_TXRX_PORT,
              GPIO_USART_AF,
              GPIO_USART_TX_PIN | GPIO_USART_RX_PIN);
#endif

  /* 省略部分程式 */
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

# 小結
這次介紹了 USART 的接收寫法，並且是以中斷的方式實現的。STM32 的中斷用法大同小異，都是致能 IRQ，然後實作對應的 ISR，應該不會太難。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/usart_receive_interrupt) 上。
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10292498)。
