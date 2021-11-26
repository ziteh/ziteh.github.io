title: '[LibOpenCM3 × STM32教學-1] 用LibOpenCM3來開發STM32-LED閃爍範例'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
categories:
  - 'LibOpenCM3 × STM32教學'
date: 2021-11-26 21:17:00
---

# 前言

[LibOpenCM3](https://libopencm3.org/) 是一個 Open-Source（LGPL） 的 ARM Cortex-M3 微控制器底層硬體函式庫，支援包含 STM32、NXP LPC1000、Atmel SAM3U 等各種微控制器。

本篇文章將會示範如何以 LibOpenCM3 寫出可以在 STM32 上執行的 LED 閃爍程式。本文的程式也有一併放在 GitHub 上：[ziteh/libopencm3-stm32-examples](https://github.com/ziteh/libopencm3-stm32-examples)。

<!--more-->

# 正文

## 環境與專案

我使用的 IDE 為 [PlatformIO IDE for VSCode（Visual Studio Code）](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)，並安裝了 [ST STM32](https://platformio.org/platforms/ststm32) `Ver 15.0.0` 平臺。有關 PlatformIO 的介紹可以看我寫的另一篇文章：[\[STM32學習記錄-6\] 在VS Code與PlatformIO上開發STM32](https://ziteh.github.io/2021/11/learningstm32-platformio/)。

安裝完相關軟體後就可以建立一個 PlatformIO 專案。我示範使用的開發板為「ST Nucleo-F103RB（STM32F103RB）」，並選擇「Framework」為「libopencm3」。

## 程式全文

在「src」資料夾中新增檔案「main.c」，並在加入以下的程式：
```c
/**
 * @file   main.c
 * @brief  Blinking LED example.
 */
 
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>

#define RCC_LED_PORT (RCC_GPIOA)
#define LED_PORT     (GPIOA)
#define LED_PIN      (GPIO5)

void delay(unsigned int value)
{
  while(value--)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

int main(void)
{
  /* Enable clock. */
  rcc_periph_clock_enable(RCC_LED_PORT);

  /* Configure GPIO as push-pull output and maximum speed of 2 MHz. */
  gpio_set_mode(LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                LED_PIN);

  /* Start blinking. */
  while (1)
  {
    gpio_toggle(LED_PORT, LED_PIN); /* LED on/off. */
    delay(500000);                  /* Wait a bit. */
  }

  return 0;
}
```

## 程式說明

接下來會依序介紹各部分程式。

### 引入函式庫

```c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
```

就如同其它程式一樣，首先要做的是引入要用的 LibOpenCM3 函式庫。在本範例中需要用到 `rcc.h` 與 `gpio.h` 這兩個檔案，因此將其引入。

其中 `rcc.h` 的「RCC」是「Reset and Clock Controller」的意思，基本上所有 STM32 的功能都與它有關，通常一定會用到。而 `gpio.h` 的「GPIO」當然就是「General-Purpose Input/Output」的意思，要控制 IO 接腳的話就會需要。

> PlatformIO 在建立專案的時候就會依照設定來準備好 LibOpenCM3 的相關檔案了，因此不用另外下載和設定，直接打 `#include` 就可以了。

### 設定接腳

```c
#define RCC_LED_PORT (RCC_GPIOA)
#define LED_PORT     (GPIOA)
#define LED_PIN      (GPIO5)
```

因為每個開發板的板載 LED 腳位可能不同，因此透過 `#define` 的方式宣告要使用的腳位，這樣要修改腳位的話只要修改一個地方，會比較方便且不易出錯。

我使用的 Nucleo-F103RB 的板載 LED 位於「PA5」，因此需要設定 Port 與 Pin 為 `GPIOA` 及 `GPIO5`。另外 RCC 也會需要 Port 的設定，因為一併設定一個 `RCC_GPIOA`。

### Delay 函數 `delay()`

```c
void delay(unsigned int value)
{
  while(value--)
  {
    __asm__("nop"); /* Do nothing. */
  }
}
```

這是一個最簡單的 Delay 函數，雖然它基本上無精準可言，但以本範例來說也不需要精確的定時。

其中 `__asm__("nop")` 代表的是嵌入組合語言「nop」指令，也就是無操作（No Operation）。

> 如果想要把 Delay 函數放在主程式 `main()` 之後，記得要宣告函數原型或使用標頭檔。

### 主程式 `main()`
```c
int main(void)
{
  /* Enable clock. */
  rcc_periph_clock_enable(RCC_LED_PORT);

  /* Configure GPIO as push-pull output and maximum speed of 2 MHz. */
  gpio_set_mode(LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                LED_PIN);

  /* Start blinking. */
  while (1)
  {
    gpio_toggle(LED_PORT, LED_PIN); /* LED on/off. */
    delay(500000);                  /* Wait a bit. */
  }

  return 0;
}
```

- `rcc_periph_clock_enable()` 會致能特定功能的 Clock。在這裡我們啟用的是 `RCC_LED_PORT`，也就是先前用 `#define` 所設定的 LED 所在腳位的 Port（Port-A）的Clock。
- `gpio_set_mode()` 會對指定的 GPIO 進行設定。
  - `LED_PORT` 是先前用 `#define` 所設定的 LED 所在腳位的 Port，也就是 Port-A。
  - `GPIO_MODE_OUTPUT_2_MHZ` 代表設定為輸出模式，且最高速度為 2 MHz。
  - `GPIO_CNF_OUTPUT_PUSHPULL` 代表使用推輓式（Push-Pull）輸出。關於推輓式的介紹可以看我之前的[文章](https://ziteh.github.io/2018/08/learningstm32-02/#%E2%80%BB%E6%8E%A8%E6%8C%BD%E5%92%8C%E6%B1%B2%E6%A5%B5%E9%96%8B%E8%B7%AF)。
  - `LED_PIN` 是先前用 `#define` 所設定的 LED 所在腳位的 Pin，也就是 Pin-5。可以使用 `|` 來同時選擇多個 Pin。
- `gpio_toggle()` 會反轉指定的 GPIO 輸出，如果目前是輸出 High 的話就變成輸出 Low；如果現在是 Low 的話就變成 High。

# 結語

本次文章內介紹的程式我也有放在 [GitHub](https://github.com/ziteh/libopencm3-stm32-examples/tree/main/blink) 上，可以直接載下來並使用 PlatformIO 開始專案。

各位也可以參考 [PlatformIO 所提供的範例](https://github.com/platformio/platform-ststm32/blob/develop/examples/libopencm3-blink/src/main.c)。

# 相關文章

- [STM32學習記錄](https://ziteh.github.io/categories/STM32%E5%AD%B8%E7%BF%92%E8%A8%98%E9%8C%84/)
