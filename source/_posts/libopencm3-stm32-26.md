title: 'STM32 LibOpenCM3：I2C'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-10-09 12:00:00
---

# 前言
在上一篇中，我簡單介紹了 SPI 的用法，而除了 SPI 外還有另一種非常常見的通訊協定——I²C（以下稱 I2C）。

I2C 和 SPI 一樣是主從式架構，I2C 的主要特色就是無論有多少 Slave device 都只需要兩條線就可以完成通訊。

在這一篇文章中，我不會詳細介紹 I2C 本身，但建議還是要對它有基本的瞭解比較好，在此推薦「[I2C bus 簡介 (Inter-Integrated Circuit Bus) @ 傑克! 真是太神奇了!](https://magicjackting.pixnet.net/blog/post/173061691-i2c-bus-%E7%B0%A1%E4%BB%8B-(inter-integrated-circuit-bus)-)」及「[【Day21】I2C的介紹 - iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10278308)」這兩篇文章。

[24C256](https://www.microchip.com/en-us/product/AT24C256C) 是一個擁有 I2C 介面的 EEPROM，這次將示範如何使用 STM32 來透過 I2C 對其進行資料的讀寫，且可以用 USART 進行操作。

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  

首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 與 `main.h`。  

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  I2C EEPROM (24C256) example for STM32 Nucleo-F446RE.
 */

#include "main.h"

int main(void)
{
  rcc_setup();
  i2c_setup();
  usart_setup();

  while (1)
  { }
  return 0;
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);

  rcc_periph_clock_enable(RCC_I2C_GPIO);
  rcc_periph_clock_enable(RCC_I2C1);
  rcc_periph_clock_enable(RCC_USART_TXRX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
}

static void i2c_setup(void)
{
  /* Set SCL & SDA pin to open-drain alternate function. */
  gpio_mode_setup(GPIO_I2C_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  gpio_set_output_options(GPIO_I2C_PORT,
                          GPIO_OTYPE_OD,
                          GPIO_OSPEED_50MHZ,
                          GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  gpio_set_af(GPIO_I2C_PORT,
              GPIO_I2C_AF,
              GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  uint32_t i2c = I2C1;

  i2c_peripheral_disable(i2c);
  i2c_reset(i2c);

  i2c_set_speed(i2c,
                i2c_speed_fm_400k,         /* 400 kHz Fast mode. */
                rcc_apb1_frequency / 1e6); /* I2C clock in MHz. */

  i2c_peripheral_enable(i2c);
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
  usart_enable_rx_interrupt(USART2);

  /* Config USART params. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX_RX);

  usart_enable(USART2);
}

static void delay(uint32_t value)
{
  for (uint32_t i = 0; i < value; i++)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  usart_disable_rx_interrupt(USART2);

  uint8_t cmd = usart_recv(USART2);
  if (cmd == 0x00) /* Write command. */
  {
    uint8_t i2c_rx_data[1];
    uint8_t i2c_tx_data[3];
    i2c_tx_data[0] = usart_recv_blocking(USART2); /* Address 1. */
    i2c_tx_data[1] = usart_recv_blocking(USART2); /* Address 2. */
    i2c_tx_data[2] = usart_recv_blocking(USART2); /* Data. */

    i2c_transfer7(I2C1,
                  I2C_SLAVE_ADDRESS,
                  i2c_tx_data, /* Tx data array. */
                  3,           /* Tx data length. */
                  i2c_rx_data, /* Rx data array. */
                  0);          /* Rx data lenght. */

    usart_send_blocking(USART2, 0xF0); /* Write done ACK. */
  }
  else if (cmd == 0x01) /* Read command. */
  {
    uint8_t i2c_rx_data[1];
    uint8_t i2c_tx_data[2];
    i2c_tx_data[0] = usart_recv_blocking(USART2); /* Address 1. */
    i2c_tx_data[1] = usart_recv_blocking(USART2); /* Address 2. */

    i2c_transfer7(I2C1,
                  I2C_SLAVE_ADDRESS,
                  i2c_tx_data, /* Tx data array. */
                  2,           /* Tx data length. */
                  i2c_rx_data, /* Rx data array. */
                  1);          /* Rx data lenght. */

    usart_send_blocking(USART2, i2c_rx_data[0]);
  }
  else /* Unknown command. */
  {
    usart_send_blocking(USART2, 0xFF); 
  }

  /* Clear 'Read data register not empty' flag. */
  USART_SR(USART2) &= ~USART_SR_RXNE;
  usart_enable_rx_interrupt(USART2);
}
```

``` c
/** @file   main.h */

#ifndef MAIN_H
#define MAIN_H

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/i2c.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/cm3/nvic.h>

#define I2C_SLAVE_ADDRESS ((uint8_t)0x50)
#define USART_BAUDRATE (9600)

#define RCC_I2C_GPIO (RCC_GPIOB)
#define GPIO_I2C_PORT (GPIOB)
#define GPIO_I2C_SCL_PIN (GPIO8) /* D15. */
#define GPIO_I2C_SDA_PIN (GPIO9) /* D14. */
#define GPIO_I2C_AF (GPIO_AF4)   /* Ref: Table-11 in DS10693. */

#define RCC_USART_TXRX_GPIO (RCC_GPIOA)
#define GPIO_USART_TXRX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* ST-Link (D1). */
#define GPIO_USART_RX_PIN (GPIO3) /* ST-Link (D0). */
#define GPIO_USART_AF (GPIO_AF7)  /* Ref: Table-11 in DS10693. */

static void rcc_setup(void);
static void i2c_setup(void);
static void delay(uint32_t value);
static void usart_setup(void);

#endif /* MAIN_H. */
```

## 分段說明
### Include
``` c
// main.h
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/i2c.h>
#include <libopencm3/stm32/usart.h>
#include <libopencm3/cm3/nvic.h>
```
除了基本的 `rcc.h` 和 `gpio.h` 及這次的 `i2c.h` 外，因爲我要使用 USART 和中斷功能，所以還會需要 `usart.h` 與 `nvic.h`。  

### 設定 I2C
``` c
static void i2c_setup(void)
{
  /* Set SCL & SDA pin to open-drain alternate function. */
  gpio_mode_setup(GPIO_I2C_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  gpio_set_output_options(GPIO_I2C_PORT,
                          GPIO_OTYPE_OD,
                          GPIO_OSPEED_50MHZ,
                          GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  gpio_set_af(GPIO_I2C_PORT,
              GPIO_I2C_AF,
              GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  uint32_t i2c = I2C1;

  i2c_peripheral_disable(i2c);
  i2c_reset(i2c);

  i2c_set_speed(i2c,
                i2c_speed_fm_400k,         /* 400 kHz Fast mode. */
                rcc_apb1_frequency / 1e6); /* I2C clock in MHz. */

  i2c_peripheral_enable(i2c);
}
```
首先一樣先設定好 I2C 要使用的 SCL 與 SDA 接腳，將其設爲 Open-Drain 的 AF 功能。

再來要設定 I2C 本身。不同於 SPI 規定比較寬鬆（或說自由），I2C 本身的通訊規範基本上都定義好了，所以我們需要調整（或說可以調整）的設定就很少。這裡我們只需要設定要使用的 I2C 速度即可。

24C256 支援的 I2C 速度模式有：
- Standard mode: 100 kbps
- Fast mode:  400 kbps
- Fast mode Plus: 1Mbps

這裡我選擇使用「Fast mode」。以 `i2c_set_speed()` 函式進行設定，此函式的第二個引數 `i2c_speed_fm_400k` 就代表要使用「Fast mode」，而第三個引數要給的是 I2C 的時脈，對於 F446RE 或大多數的 STM32，這個速度等同 APB1。

### USART ISQ
```c
/**
 * @brief USART2 Interrupt service routine.
 */
void usart2_isr(void)
{
  usart_disable_rx_interrupt(USART2);

  uint8_t cmd = usart_recv(USART2);
  if (cmd == 0x00) /* Write command. */
  {
    uint8_t i2c_rx_data[1];
    uint8_t i2c_tx_data[3];
    i2c_tx_data[0] = usart_recv_blocking(USART2); /* Address 1. */
    i2c_tx_data[1] = usart_recv_blocking(USART2); /* Address 2. */
    i2c_tx_data[2] = usart_recv_blocking(USART2); /* Data. */

    i2c_transfer7(I2C1,
                  I2C_SLAVE_ADDRESS,
                  i2c_tx_data, /* Tx data array. */
                  3,           /* Tx data length. */
                  i2c_rx_data, /* Rx data array. */
                  0);          /* Rx data lenght. */

    usart_send_blocking(USART2, 0xF0); /* Write done ACK. */
  }
  else if (cmd == 0x01) /* Read command. */
  {
    uint8_t i2c_rx_data[1];
    uint8_t i2c_tx_data[2];
    i2c_tx_data[0] = usart_recv_blocking(USART2); /* Address 1. */
    i2c_tx_data[1] = usart_recv_blocking(USART2); /* Address 2. */

    i2c_transfer7(I2C1,
                  I2C_SLAVE_ADDRESS,
                  i2c_tx_data, /* Tx data array. */
                  2,           /* Tx data length. */
                  i2c_rx_data, /* Rx data array. */
                  1);          /* Rx data lenght. */

    usart_send_blocking(USART2, i2c_rx_data[0]);
  }
  else /* Unknown command. */
  {
    usart_send_blocking(USART2, 0xFF); 
  }

  /* Clear 'Read data register not empty' flag. */
  USART_SR(USART2) &= ~USART_SR_RXNE;
  usart_enable_rx_interrupt(USART2);
}
```
這是 USART 的 ISQ。

我自己定義了一個簡單的 USART 指令格式：`<RW> <Address_1> <Address_2> <Data>`  

若要在 24C256 的 `0x0102` 位置寫入資料 `0xAB`，就是用 USART 傳送：`0x00 0x01 0x02 0xAB`，完成後會收到一個 `0xF0` 作爲 ACK 確認。同理，要在 `0x0FCD` 寫入 `0x40` 拿就是要傳送 `0x00 0x0F 0xCD 0x40`。

要讀取 `0x0102` 位置的資料的話，那就是用 USART 傳送：`0x01 0x01 0x02`，然後 STM32 就會回傳該位置的資料。

> 24C256 的定址範圍爲 `0x0000` \~ `0x7FFF` 共 32768 個位置，每個位置皆爲一個 Byte。

當 USART 接收到一筆資料時，會先判斷這是要進行寫（`0x00`）還是讀（`0x01`）。然後再使用 I2C 傳送資料。

`i2c_transfer7()` 用來進行 I2C 的傳輸，讀和寫都靠它。其參數意義依序爲：
1. 使用的 I2C。這裡是用 `I2C1`。
2. 要溝通的 Slave device I2C 7-bit 位置。24C256 的預設位置爲 `0x50`。
3. 傳送資料陣列，即要傳送的位元組陣列。
4. 傳送資料長度，要傳送幾個 Byte。填 `0` 代表不進行傳送。
5. 接收資料陣列，接收到的資料會存進來。
6. 接收資料長度，要接收幾個 Byte。填 `0` 代表不進行接收。

24C256 基本的讀寫操作也是很簡單。要寫的話就是依序傳送「`位置-高`、`位置-低`、`資料`」這 3 個位元組即可。要讀的話就是依序傳送「`位置-高`、`位置-低`」這 2 個位元組，然後就可以讀取 該位置的資料位元組。

因此寫入的程式爲：
```c
uint8_t i2c_rx_data[1];
uint8_t i2c_tx_data[3];
i2c_tx_data[0] = usart_recv_blocking(USART2); /* Address 1. */
i2c_tx_data[1] = usart_recv_blocking(USART2); /* Address 2. */
i2c_tx_data[2] = usart_recv_blocking(USART2); /* Data. */

i2c_transfer7(I2C1,
              I2C_SLAVE_ADDRESS,
              i2c_tx_data, /* Tx data array. */
              3,           /* Tx data length. */
              i2c_rx_data, /* Rx data array. */
              0);          /* Rx data lenght. */
```

而讀取的程式爲：
```c
uint8_t i2c_rx_data[1];
uint8_t i2c_tx_data[2];
i2c_tx_data[0] = usart_recv_blocking(USART2); /* Address 1. */
i2c_tx_data[1] = usart_recv_blocking(USART2); /* Address 2. */

i2c_transfer7(I2C1,
              I2C_SLAVE_ADDRESS,
              i2c_tx_data, /* Tx data array. */
              2,           /* Tx data length. */
              i2c_rx_data, /* Rx data array. */
              1);          /* Rx data lenght. */

usart_send_blocking(USART2, i2c_rx_data[0]);
```

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
由於本例的差異比較大，爲了不佔版面這裡就不列出的，完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/i2c_eeprom_24c256)。  

特別要主要的是，F103RB 要使用 PB8 和 PB9 作爲 I2C 的 SCL 及 SDA 腳時，要啓用「Remap」。詳細請參考 DS5319 的 Table 5。

```c
static void i2c_setup(void)
{
  /* Set SCL & SDA pin to open-drain alternate function. */
#if defined(STM32F1)
  gpio_set_mode(GPIO_I2C_PORT,
                GPIO_MODE_OUTPUT_50_MHZ,
                GPIO_CNF_OUTPUT_ALTFN_OPENDRAIN,
                GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  /*
   * Alternate function remap is required for
   * using I2C1_SCL & SDA on PB8 & PB9.
   * Refer to Table-5 in DS5319.
   */
  gpio_primary_remap(AFIO_MAPR_SWJ_CFG_FULL_SWJ,
                     AFIO_MAPR_I2C1_REMAP);
#else
  gpio_mode_setup(GPIO_I2C_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  gpio_set_output_options(GPIO_I2C_PORT,
                          GPIO_OTYPE_OD,
                          GPIO_OSPEED_50MHZ,
                          GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);

  gpio_set_af(GPIO_I2C_PORT,
              GPIO_I2C_AF,
              GPIO_I2C_SCL_PIN | GPIO_I2C_SDA_PIN);
#endif
  uint32_t i2c = I2C1;

  i2c_peripheral_disable(i2c);
  i2c_reset(i2c);

  i2c_set_speed(i2c,
                i2c_speed_fm_400k,         /* 400 kHz Fast mode. */
                rcc_apb1_frequency / 1e6); /* I2C clock in MHz. */

  i2c_peripheral_enable(i2c);
}
```

## 成果

我首先將 `0xAB` 寫入 `0x0000` (`00 00 00 AB`)，再寫入 `0x39` 到 `0x0001`（`00 00 01 39`）。

然後讀取 `0x0000`（`01 00 00`）得到回傳的 `0xAB`，再讀取 `0x0001`（`01 00 01`）得到 `0x39`。

最後再次寫入 `0xCD` 到 `0x0000`（`00 00 00 CD`），再讀取它（`01 00 00`）得到 `0xCD`。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqvGt56uqNr0GtoYtYM1rEO1IyzK8SsMALMEGjy6W8qtvwYFYdo0YN212yqefT1_hczl28WRviThZ5OFhsXi8TVu3gt_XPdgP0vbkccrIxsw-oFjEXH1hXWkVvMsy6-KI5D-bK4AdKe-vKV-MGY1ykFIWr_PkW4xiFDt44son1IW4HPcrK7hbIBsM1/s16000/i2c.png)

# 小結
這次介紹了 I2C 的程式寫法。SPI 與 I2C 是各種電路模組或 IC 會使用的通訊協定，只要會使用 SPI 與 I2C，那基本上常見的模組都可以使用了，因此 I2C 是一個很重要的功能，還好 STM32 本身的硬體及 LibOpenCM3 都把那些複雜的設定做好了，因此要使用 I2C 相當容易。

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/i2c_eeprom_24c256) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
