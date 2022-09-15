title: 'STM32 LibOpenCM3：GPIO 輸入'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-MM-DD hh:00:00
---

# 前言
在上一篇中我們介紹了基本的 STM32 GPIO 輸出，並寫了一個簡單的 LED 閃爍程式，還教了 PIO 的多環境設定。  
  
這一篇要接續介紹 LibOpenCM3 的基本 GPIO 輸入寫法，功能爲當按下按鈕時 LED 會亮起。  
  
<!--more-->
  
# 正文
首先一樣以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  

## 完整程式
一樣先打出完整程式：  
``` c
/**
 * @file   main.c
 * @brief  Polling button example for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>

/* User LED (LD2) connected to Arduino-D13 pin. */
#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5)

/* User button (B1) connected to PC13. */
#define RCC_BUTTON_GPIO (RCC_GPIOC)
#define GPIO_BUTTON_PORT (GPIOC)
#define GPIO_BUTTON_PIN (GPIO13)

int main(void)
{
  /* Enable clock. */
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_BUTTON_GPIO);

  /*
   * Set LED pin to output push-pull,
   * and set button pin to input floating.
   */
  gpio_mode_setup(GPIO_LED_PORT,
                  GPIO_MODE_OUTPUT,
                  GPIO_PUPD_NONE,
                  GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_2MHZ,
                          GPIO_LED_PIN);

  gpio_mode_setup(GPIO_BUTTON_PORT,
                  GPIO_MODE_INPUT,
                  GPIO_PUPD_NONE,
                  GPIO_BUTTON_PIN);

  while (1)
  {
    /* Read input value. */
    bool pressed = gpio_get(GPIO_BUTTON_PORT, GPIO_BUTTON_PIN) == 0;

    if (pressed)
    {
      gpio_set(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on. */
    }
    else
    {
      gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN); /* LED off. */
    }
  }

  return 0;
}

```
## 分段說明
### Include
``` c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
```
Include 的部分和 [GPIO 輸入](https://ziteh.github.io/2022/09/libopencm3-stm32-4/)時一樣，引入 `rcc.h` 與 `gpio.h`。  

### 定義腳位
``` c
/* User LED (LD2) connected to Arduino-D13 pin. */
#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5)

/* User button (B1) connected to PC13. */
#define RCC_BUTTON_GPIO (RCC_GPIOC)
#define GPIO_BUTTON_PORT (GPIOC)
#define GPIO_BUTTON_PIN (GPIO13)
```
根據 Datasheet (UM1724)，我們得知按鈕 User Button (B1) 在 PC13 腳。一樣使用   
`#define` 定義好接腳和 RCC，方便使用與修改。而 LED 一樣是 PA5。  

### 主程式
``` c
int main(void)
{
  /* Enable clock. */
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_BUTTON_GPIO);

  /*
   * Set LED pin to output push-pull,
   * and set button pin to input floating.
   */
  gpio_mode_setup(GPIO_LED_PORT,
                  GPIO_MODE_OUTPUT,
                  GPIO_PUPD_NONE,
                  GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_2MHZ,
                          GPIO_LED_PIN);

  gpio_mode_setup(GPIO_BUTTON_PORT,
                  GPIO_MODE_INPUT,
                  GPIO_PUPD_NONE,
                  GPIO_BUTTON_PIN);

  while (1)
  {
    /* Read input value. */
    bool pressed = gpio_get(GPIO_BUTTON_PORT, GPIO_BUTTON_PIN) == 0;

    if (pressed)
    {
      gpio_set(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on. */
    }
    else
    {
      gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN); /* LED off. */
    }
  }

  return 0;
}
```
和 GPIO 輸入的時候一樣，先啓用 RCC，然後再設定 GPIO。  
  
由於 Nucleo MB1136 開發板（參考 [UM1724](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)）的 User Button 已經有 4.7kΩ 的上拉電阻（平常是 `High`，按下時爲 `Low`），因此輸入模式選擇 Floating （不用上/下拉電阻，`GPIO_PUPD_NONE`）就好了。  
  
我們使用最簡單的輪詢（Polling）方式來取得按鈕的輸入值，再依其值改變 LED 的明滅。使用 `gpio_get()` 來讀取指定的 GPIO 的值。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 系列的部分函式不同，因此 F103RB 不能直接使用上面那個程式。

以下列出主要的差異部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/gpio_input)。
``` c
int main(void)
{
  /* 省略部分程式 */

  /*
   * Set LED pin to output push-pull,
   * and set button pin to input floating.
   */
#if defined(STM32F1)
  gpio_set_mode(GPIO_LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                GPIO_LED_PIN);

  gpio_set_mode(GPIO_BUTTON_PORT,
                GPIO_MODE_INPUT,
                GPIO_CNF_INPUT_FLOAT,
                GPIO_BUTTON_PIN);
#else
  gpio_mode_setup(GPIO_LED_PORT,
                  GPIO_MODE_OUTPUT,
                  GPIO_PUPD_NONE,
                  GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT,
                          GPIO_OTYPE_PP,
                          GPIO_OSPEED_2MHZ,
                          GPIO_LED_PIN);

  gpio_mode_setup(GPIO_BUTTON_PORT,
                  GPIO_MODE_INPUT,
                  GPIO_PUPD_NONE,
                  GPIO_BUTTON_PIN);
#endif

  /* 省略部分程式 */
}
```

## 成果
  
![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJgtNZ1OAUDzWV-6opgIXYXKbB2V4NEmDFh1UCC2bzTQ55h-jDx4YoB0uSZqduDWZXjUEOgec3wuTvf8WMg5plKgaWEOA_SclRUy_KnMsy1iakdoNDIJvi1ZoaKK0i1UHs6UbsDfpZbT93bONnceWQa1phumS6ainbGw0oapwPfy4RnCfwiFcfhkLd/w225-h400/gpio_input.gif)

# 小結
這次介紹了最簡單的 GPIO 輸入寫法。說實話，這種用法比較少會實際應用到，因爲大多數情況輪詢是一件很沒效率也不夠聰明的方法。通常要使用按鈕輸入時，我都會優先考慮使用外部中斷（EXTI）的方式達成，因此下一篇要介紹的就是外部中斷。  

# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/gpio_input) 上。  
> 本文同步發表於 [iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
