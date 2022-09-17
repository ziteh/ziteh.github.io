title: 'STM32 LibOpenCM3：USART 發送'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
---

# 前言
USART 是最常用且基本的通訊方式之一，我通常會用 USART 來讓 MCU 與電腦進行溝通，在進行設定或開發除錯時很好用。不過實際上這篇要介紹的只是 UART 而非 USART，不過我還是統一用 USART。  
  
這一篇的目標是讓 STM32 持續透過 USART 來發送資料到電腦，並且可以使用 `printf()` 函式。  

<!--more-->

# 正文
一樣先以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  USART with printf() function for STM32 Nucleo-F446RE.
 */

#include <stdio.h>
#include <errno.h>
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/usart.h>

#define USART_BAUDRATE (9600)

#define RCC_USART_TX_GPIO (RCC_GPIOA)
#define GPIO_USART_TX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* Arduino-D1. */
#define GPIO_USART_AF (GPIO_AF7)  /* Table-11 in DS10693 */

static void delay(uint32_t value)
{
  for (uint32_t i = 0; i < value; i++)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_USART_TX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
}

static void usart_setup(void)
{
  /* Set USART-Tx pin to alternate function. */
  gpio_mode_setup(GPIO_USART_TX_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_USART_TX_PIN);

  gpio_set_af(GPIO_USART_TX_PORT,
              GPIO_USART_AF,
              GPIO_USART_TX_PIN);

  /* Config USART params. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX); /* Tx-Only mode. */

  usart_enable(USART2);
}

int main(void)
{
  rcc_setup();
  usart_setup();

  int i = 0;
  while (1)
  {
    printf("Hello World! %i\r\n", i++);
    delay(500000);
  }

  return 0;
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

## 分段說明
### Include
``` c
#include <stdio.h>
#include <errno.h>
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/usart.h>
```
  
除了 LibOpenCM3 的 `rcc.h`、`gpio.h` 和 `usart.h`外，因爲我們還需要實現 `printf()` 函式，所以還需要 `stdio.h` 與 `errno.h`。

### RCC
``` c
static void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_USART_TX_GPIO);
  rcc_periph_clock_enable(RCC_USART2);
}
```
  
除了要致能 USART Tx 接腳所在的 GPIO Port 外，還要致能 USART 本身。  

### USART 選擇
``` c
#define RCC_USART_TX_GPIO (RCC_GPIOA)
#define GPIO_USART_TX_PORT (GPIOA)
#define GPIO_USART_TX_PIN (GPIO2) /* Arduino-D1. */
#define GPIO_USART_AF (GPIO_AF7)  /* Table-11 in DS10693 */
```
一個 STM32 MCU 中通常不會只有一個 USART，且各個 USART 的詳細規格可能不同，因此我們要選擇到底該使用哪一個 USART。  
  
STM32 Nucleo 開發板上其實已經設計 USART 的硬體線路好了，以我們使用的 Nucleo-64 （參考 [UM1724](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)）來說，USART2 已經連接到 ST-Link 了，也就是程式燒錄和 USART 都可以透過板載的 ST-Link 完成，只需要連接一條 USB 線就好，不需要額外的 USB-to-TTL 模組，因此使用 USART2 是最方便的選擇。而 USART2 的 Tx 腳位爲 PA2。  
  
記得除了 STM32F1 系列外，AF 功能還要設定是「AF 幾？」。根據 F446RE Datasheet ([DS10693](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)) 的「Table 11. Alternate function」我們可以知道我們所使用的「USART2」是 「AF7」，因此使用 `GPIO_USART_AF` 指定要使用的是 `GPIO_AF7`。  
  
![▲ AF 對照表，取自 DS10693。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj72ewJ_VwsOl1dP04dVnK3d0_gQgeee_F--bjtTCwmkcl6OZTakXSoeTtcYou17UQgHYwZvFe-Mf6jKQCVp_L5apdSxokQz2_58K3fSawxfjjMyu0s0ydjxmkxJ0EyR1dQ5a4lZeAMUEM0KfBjuQsl9FLQC07cwiLG_xfm9BtumOkWG-AIKIqZDxSL/s16000/Screenshot_2022-09-15_115823_1663214323550_0.png)  

### USART 設定
``` c
static void usart_setup(void)
{
  /* Set USART-Tx pin to alternate function. */
  gpio_mode_setup(GPIO_USART_TX_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_USART_TX_PIN);

  gpio_set_af(GPIO_USART_TX_PORT,
              GPIO_USART_AF,
              GPIO_USART_TX_PIN);

  /* Congif USART params. */
  usart_set_baudrate(USART2, USART_BAUDRATE);
  usart_set_databits(USART2, 8);
  usart_set_stopbits(USART2, USART_STOPBITS_1);
  usart_set_parity(USART2, USART_PARITY_NONE);
  usart_set_flow_control(USART2, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART2, USART_MODE_TX); /* Tx-Only mode. */

  usart_enable(USART2);
}
```
首先要設定好 GPIO。我們需要將 USART Tx 設定爲 Alternate Function。  
  
設定好 GPIO 後就是設定 USART 本身，也就是鮑率、資料位元、停止位元那些，這部分就照實際需求設定。  
  
由於本例只有用到傳送的部分，不需要接收，所以 `usart_set_mode()` 設定爲 `USART_MODE_TX`。  

### printf() 
``` c
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
  
透過實作 `_write()`，我們就可以透過 USART 來使用 `printf()` 函式了。`usart_send_blocking()` 用來透過 USART 發送資料。  
  
> 這部分的程式參考自 [libopencm3-example](https://github.com/libopencm3/libopencm3-examples/blob/9577cd71ebd2607fd1264bebc392187a9cce1da0/examples/stm32/f1/stm32-h103/usart_printf/usart_printf.c#L70-L82)。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。

以下列出主要的差異部分，也就是 GPIO 的部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/usart_printf)。
``` c
static void usart_setup(void)
{
  /* Set USART-Tx pin to alternate function. */
#if defined(STM32F1)
  gpio_set_mode(GPIOA,
                GPIO_MODE_OUTPUT_50_MHZ,
                GPIO_CNF_OUTPUT_ALTFN_PUSHPULL,
                GPIO2);
#else
  gpio_mode_setup(GPIO_USART_TX_PORT,
                  GPIO_MODE_AF,
                  GPIO_PUPD_NONE,
                  GPIO_USART_TX_PIN);

  gpio_set_af(GPIO_USART_TX_PORT,
              GPIO_USART_AF,
              GPIO_USART_TX_PIN);
#endif

  /* 省略部分程式 */
}
```

## 成果

可以使用 PIO 內建的 Serial Monitor 查看。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBR-Oe7CmaVN3FBpKa2ejwVBQ4OObMmO-Dl0axYofYtwgyZBinFBHStgHMejeAMVEnaUwMhPJ0yT1DcVM6xkA-f1d9kVtwc1Z5ROLOEo5dzM8GbvjHHfK9JcIJtk5ON7_U6WcQmLED6YTTilVnmxgNQz03tgmFAq_K1B5GD9U2P-fpty27HDPHrWwy/s16000/usart_printf.gif)

# 小結
這次介紹了 USART 的發送功能寫法，還一併實現了透過 `printf()` 來使用 USART。USART 是很基本且常用的功能，如果運作起來不正常的話還是先再次確定通訊的設定是否正確。  

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/usart_printf) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
