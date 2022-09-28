title: 'STM32 LibOpenCM3：SysTick delay'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-09-28 12:00:00
---

# 前言
在前面的篇章中，我們已經學會使用 Timer 來精確定時了，而在使用 MCU 的過程中最常會需要精確定時的莫過於 `delay()` 函式，在此之前我都是單純的讓 MCU 空跑一定的次數，但這樣很難知道它實際上到底 delay 了多久的時間，而已同樣的數值在不同的 Clock Tree 設定下 delay 的長度也不同，因此我們可以使用 Timer 來做出一個更好的 `delay()`。

但是如果只是要實現 `delay()` 功能的話，並不用像之前的 Timer 那樣計算並設定一大堆數值，因爲 ARM Cortex M3 有一個特殊的計時器——SysTick，我們可以使用它來完成 `delay()` 函式。

這次的目標是使用 SysTick 來實現一個 `delay_ms()` 函式，它可以以毫秒爲單位進行 delay，並且用來寫 LED 閃爍的程式。

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  

## 完整程式
``` c
/**
 * @file   main.c
 * @brief  SysTick delay example for STM32 Nucleo-F446RE
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/cm3/systick.h>
#include <libopencm3/cm3/nvic.h>

#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5) /* D13. */

static volatile uint32_t systick_delay = 0;

static void delay_ms(uint32_t ms)
{
  systick_delay = ms;
  while (systick_delay != 0)
  {
    /* Wait. */
  }
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);
  rcc_periph_clock_enable(RCC_LED_GPIO);
}

static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
}

static void systick_setup(void)
{
  systick_set_clocksource(STK_CSR_CLKSOURCE_AHB_DIV8);
  systick_set_reload(rcc_ahb_frequency / 8 / 1000 - 1);

  systick_counter_enable();
  systick_interrupt_enable();
}

int main(void)
{
  rcc_setup();
  systick_setup();
  led_setup();

  while (1)
  {
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
    delay_ms(500);
  }

  return 0;
}

/**
 * @brief SysTick handler.
 */
void sys_tick_handler(void)
{
  if (systick_delay != 0)
  {
    systick_delay--;
  }
}
```
## 分段說明
### Include
``` c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/cm3/systick.h>
#include <libopencm3/cm3/nvic.h>
```
重點在於要記得引入 `systick.h`。值得注意的是如果不引入 `nvic.h` 的話，程式應該也可以完成編譯甚至執行，但 SysTick 的 ISR 函式原型其實是宣告在這裡面的，所以我還是把它加入。  

### 設定 SysTick
``` c
static void systick_setup(void)
{
  systick_set_clocksource(STK_CSR_CLKSOURCE_AHB_DIV8);
  systick_set_reload(rcc_ahb_frequency / 8 / 1000 - 1);

  systick_counter_enable();
  systick_interrupt_enable();
}
```
SysTick（System tick timer）是 ARM Cortex M3 系列內建的功能，這是一個 24 位元的下數計數器，擁有自動裝載與中斷功能。  
  
從 Clock Tree 中可以看到 SysTick 在 AHB 底下，並且前面有一個可程式設定的預分頻器（圖上雖然看起來是固定 `/8`，但根據我實測的結果與 STM32CubeMX 中顯示的設定，這應該是可以選擇 `/1` 或 `/8`）。  
  
![▲ SysTick 的時鐘源。取自 RM0390。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgVy0ddkXOGgBvgTb2fp0pYGGXxCuNUE0BODLoYido2400V2_OWev7rSIktKLzKhNeI8dyPfoQtwREg2R3R8qrpC5-u_w3RrgxkBO28fV4VUz-8k0GZbJmG3_ckhEaV8igVGVcnlMUPFS7I_WvAK2CcAwvgiJax5a3_Vxz7pOzE6uINKDFyHaYBYyVW/s16000/image_1662288150837_0.png)   
  
這裡使用 `systick_set_clocksource()` 來指定 SysTick 時鐘源爲 AHB 並啓用 `/8` 預分頻器，因此目前的 SysTick 頻率爲 `rcc_ahb_frequency / 8`。  
  
然後要設定 SysTick 的 RVR（Reload Value Register）暫存器，這個數值決定了 SysTick 發生中斷的頻率，SysTick 每次下數到 0 時都會自動載入 RVR 的值到 CVR（Current Value Register）中，所以 SysTick 會計數 RVR\~0 共 RVR + 1 次。  
  
所以 SysTick 中斷發生的頻率爲：  
`f_int = f_systick / (RVR + 1)`  
因此  
`RVR = f_systick / f_int - 1`  
  
最後只要套用上面的公式，並用 `systick_set_reload()` 設定 RVR 的值就好。因爲這裡預計要實現 ms 等級的 delay，所以我希望 SysTick 可以每 1 ms 就中斷一次，也就是中斷頻率爲 1 kHz，故設定 RVR 的值爲 `rcc_ahb_frequency / 8 / 1000 - 1`。  
  
> RVR 是一個 24 位元的暫存器，它的容許範圍爲 `0x000001`~`0xFFFFFF`，實際在設定時要注意一下。[官方說明](https://developer.arm.com/documentation/dui0552/a/cortex-m3-peripherals/system-timer--systick/systick-reload-value-register)  

### Delay 與 SysTick ISR
``` c
static volatile uint32_t systick_delay = 0;

static void delay_ms(uint32_t ms)
{
  systick_delay = ms;
  while (systick_delay != 0)
  {
    /* Wait. */
  }
}
			  
/**
 * @brief SysTick handler.
 */
void sys_tick_handler(void)
{
  if (systick_delay != 0)
  {
    systick_delay--;
  }
}
```
首先宣告一個全域變數 `systick_delay`，並加上 `volatile` 以防止編譯器優化它。  
  
`delay_ms()` 要做的就是把其參數 `ms` 傳遞給 `systick_delay`，然後等待 `sys_tick_handler()` 將 `systick_delay` 的值減到 0。  
  
而 `sys_tick_handler()` 是 SysTick 的 ISR，它只要負責每次都把 `systick_delay` 減 1 即可。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
以下列出主要的差異部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/systick)。  
``` c
static void rcc_setup(void)
{
#if defined(STM32F1)
  rcc_clock_setup_in_hse_8mhz_out_72mhz();
#elif defined(STM32F4)
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);
#endif

  rcc_periph_clock_enable(RCC_LED_GPIO);
}
```

``` c
static void led_setup(void)
{
  /* Set LED pin to output push-pull. */
#if defined(STM32F1)
  gpio_set_mode(GPIO_LED_PORT,
                GPIO_MODE_OUTPUT_2_MHZ,
                GPIO_CNF_OUTPUT_PUSHPULL,
                GPIO_LED_PIN);
#else
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
#endif
}
```
## 成果
  
這裡使用兩個 STM32，並分別設定 LED 開關的 delay 爲 500ms 和 5ms，結果也是滿精準的。  
  
> 請注意 LED 要切換 2 次才是一個完整的波形。  
  
![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1oDElh7QVdLnp0dBHirtYj0soQpKlO9mdaDhkBDHdpHKfDPbsg1OZ4XFpEIioKv-ULOZd2z009SHox0fwk4TkcnBr3AFFWIdThHNeNGc2Nyk6Kzynyly8ZBmVVIQtk63vH-Y9XOCaQxgWU76elGfqKsl5WqNM6tLYt3RQumN_MAdR4DaYGCrrCxpZ/s16000/SysTick_1662287817519_0.png)  

# 小結
  
`delay_ms()` 是在用 MCU 時非常常用到的功能，而這次介紹如何使用 SysTick 來實現它，這樣就可以得到一個相對精準的 delay，也不用大費周章去設定一般的 Timer。  

# 參考資料
* [Cortex-M3 Devices Generic User Guide](https://developer.arm.com/documentation/dui0552/a/cortex-m3-peripherals/system-timer--systick/systick-control-and-status-register?lang=en)
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/systick) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10298985)。
