title: 'STM32 LibOpenCM3：CRC'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-10-10 09:18:00
---

# 前言
CRC（Cyclic redundancy check）即循環冗餘校驗是一種雜湊函式，通常用於通訊，用以讓接收方確認資料是否正確。

多數的 STM32 家族都有內建 CRC 計算單元，本篇要來介紹如何使用。

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c`。  

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  CRC example for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/stm32/crc.h>
#include <libopencm3/cm3/nvic.h>

#define USART_BAUDRATE (9600)

#define RCC_USART_TXRX_GPIO (RCC_GPIOA)
#define GPIO_USART_TXRX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* ST-Link (Arduino-D1). */
#define GPIO_USART_RX_PIN (GPIO3) /* ST-Link (Arduino-D0). */
#define GPIO_USART_AF (GPIO_AF7)  /* Table-11 in DS10693. */

static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_USART_TXRX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
  rcc_periph_clock_enable(RCC_CRC);
}

static void usart_setup(void)
{
  /* Set USART-Tx and Rx pin to alternate function. */
  gpio_mode_setup(GPIO_USART_TXRX_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_USART_TX_PIN | GPIO_USART_RX_PIN);

  gpio_set_af(GPIO_USART_TXRX_PORT,
              GPIO_USART_AF,
              GPIO_USART_TX_PIN | GPIO_USART_RX_PIN);

  /* Config USART params. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX_RX);

  /* Setup interrupt. */
  usart_enable_rx_interrupt(USART2); /* Enable receive interrupt. */
  nvic_enable_irq(NVIC_USART2_IRQ);

  usart_enable(USART2);
}

int main(void)
{
  rcc_setup();
  usart_setup();

  usart_send_blocking(USART2, 'C');
  usart_send_blocking(USART2, 'R');
  usart_send_blocking(USART2, 'C');
  usart_send_blocking(USART2, '\r');
  usart_send_blocking(USART2, '\n');

  while (1)
  { }
  return 0;
}

/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  usart_disable_rx_interrupt(USART2);
  crc_reset(); /* Resets the CRC calculation unit and sets the data register to 0xFFFF FFFF. */

  uint8_t data[4];
  for (int i = 0; i < 4; i++)
  {
    data[i] = usart_recv_blocking(USART2);
  }

  uint32_t comb = data[3] + (data[2] << 8) + (data[1] << 16) + (data[0] << 24);
  uint32_t result = crc_calculate(comb);

  usart_send_blocking(USART2, (result >> 24) & 0xFF);
  usart_send_blocking(USART2, (result >> 16) & 0xFF);
  usart_send_blocking(USART2, (result >> 8) & 0xFF);
  usart_send_blocking(USART2, result & 0xFF);

  USART_SR(USART2) &= ~USART_SR_RXNE; /* Clear 'Read data register not empty' flag. */
  usart_enable_rx_interrupt(USART2);
}
```

## 分段說明
### CRC 計算
``` c
/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  usart_disable_rx_interrupt(USART2);
  crc_reset(); /* Resets the CRC calculation unit and sets the data register to 0xFFFF FFFF. */

  uint8_t data[4];
  for (int i = 0; i < 4; i++)
  {
    data[i] = usart_recv_blocking(USART2);
  }

  uint32_t comb = data[3] + (data[2] << 8) + (data[1] << 16) + (data[0] << 24);
  uint32_t result = crc_calculate(comb);

  usart_send_blocking(USART2, (result >> 24) & 0xFF);
  usart_send_blocking(USART2, (result >> 16) & 0xFF);
  usart_send_blocking(USART2, (result >> 8) & 0xFF);
  usart_send_blocking(USART2, result & 0xFF);

  USART_SR(USART2) &= ~USART_SR_RXNE; /* Clear 'Read data register not empty' flag. */
  usart_enable_rx_interrupt(USART2);
}
```
CRC 計算單元的使用方式很單純，因此我直接寫在 USART2 的 ISR 中。

但 ISR 執行後，先禁能 USART2 的中斷，以方便之後連續讀取 4 Byte 的資料。

以 `crc_reset()` 重設 CRC 單元，並將資料暫存器重置爲 `0xFFFF FFFF`（即 CRC Init = `0xFFFF FFFF`）。

以 `for` 迴圈連續接收 4 Byte 的資料，並使用 `crc_calculate()` 將要計算的資料寫入 CRC 的資料暫存器，該函式會自行 Blocking 直到 CRC 計算完就會回傳結果。

最後再將結果用 USART2 傳出，再重新致能其中斷以等待下次接收。


## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
以下列出主要的差異部分，也就是 GPIO 的部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/crc)。  

```c
static void usart_setup(void)
{
  /* Set USART-Tx and Rx pin to alternate function. */
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
  /* 省略部分程式. */
}
```

## 成果

從 RM0390 或 AN4187 中可以得知，STM32 使用的多項式是 `0x4C1 1DB7`（部分系列可修改），初始值爲 `0xFFFF FFFF`。

我依序輸入 32 位元的資料並各別得到其結果：
- 輸入 `0x9D 12 3A D4` 得到 `0xC9 68 5F 5E`。
- 輸入 `0x00 00 00 00` 得到 `0xC7 04 DD 7B`。
- 輸入 `ABCD` (ASCII) 得到 `0xAB CF 9A 63`。

可以到一些線上的 CRC 計算機（如[這個](https://crccalc.com/?crc=9D%2012%203A%20D4&method=CRC-32/MPEG-2&datatype=hex&outtype=0)）驗證其結果是正確的（算法選擇「CRC-32/MPEG-2」）。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjTB1JUYk01LWrq9SkXyDnTWBqR2Y13DoYuRtasxiWT0hecVBqLGljUTx3wOp4CO-xHuj-lybXSbU8V6kgUMRtbfjq40ds1I7UnQ_X2DfTSouKfWTS6CFpWiOcxSXIvcuTjOvV-FqV2LUexwB--Nwul7-zgGF64mQVPbIDrq4Bt_-RfrbGX8nNL3XIm/s16000/CRC.png)

![▲ STM32 各系列的 CRC 單元功能比較。取自 AN4187 Rev1 P.13。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSpgzxyQogU3pWHzk8Wv82Vie6PPeTy0dNVVSlkATIqoEjjzTOCfQCw7gZtN2rAOlJksQnSytiBwFRHbxVWWNRBO9HlKAq9hDnuC5Ca3ycFpZRyEKKjcXDEGKFsN9yyQP61A8KOCd5hEdSp9pjwNcSo9gFIBQvEs-MwgQg-5cLXKCSDj_YmAhLa6Tb/s16000/crc%E2%80%94%E2%80%942.png)

# 小結
CRC 的使用還是滿單純的，就只要致能 RCC 後呼叫計算函式，將要計算的資料傳入後就可以得到結果了。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32 CRC application note (AN4187)](https://www.st.com/resource/en/application_note/an4187-using-the-crc-peripheral-in-the-stm32-family-stmicroelectronics.pdf)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/crc) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10306443)。
