title: 'STM32 LibOpenCM3：WWDG 窗口看門狗計時器'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-10-01 12:00:00
---

# 前言
在[上一篇]()中已經介紹了 WWDG 的基本概念。這一篇要接著介紹 WWDG 窗口看門狗的程式。  

<!--more-->

# 正文
首先一樣以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  
## 完整程式
``` c
/**
 * @file   main.c
 * @brief  WWDG (Window watchdog) example for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/wwdg.h>
#include <libopencm3/cm3/systick.h>
#include <libopencm3/cm3/nvic.h>

#define WWDG_COUNTER (0x7F) /* WWDG_CR  -> T[6:0], 0x7F ~ 0x40. */
#define WWDG_WINDOWS (0x5F) /* WWDG_CFR -> W[6:0], T[6:0] ~ 0x40. */

#define WWDG_MS(v) (1.0 / (rcc_apb1_frequency / 1000) * 4096 * 8 * (v))

#define RCC_LED_GPIO (RCC_GPIOA)
#define GPIO_LED_PORT (GPIOA)
#define GPIO_LED_PIN (GPIO5) /* D13. */

static volatile uint32_t systick_delay = 0;

static void delay_ms(uint32_t value)
{
  systick_delay = value;
  while (systick_delay != 0)
  {
    /* Wait. */
  }
}

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_WWDG);
}

static void systick_setup(void)
{
  systick_set_clocksource(STK_CSR_CLKSOURCE_AHB_DIV8);
  systick_set_reload(rcc_ahb_frequency / 8 / 1000 - 1);
  systick_interrupt_enable();
  systick_counter_enable();
}

static void wwdg_refresh(void)
{
  WWDG_CR |= WWDG_COUNTER << WWDG_CR_T_LSB;
}

static void wwdg_setup(void)
{
  WWDG_CFR |= WWDG_CFR_WDGTB_CK_DIV8 << WWDG_CFR_WDGTB_LSB; /* Set WDG prescaler to div8. */

  WWDG_CR &= ~(0x7F << WWDG_CR_T_LSB);      /* Clear T[6:0]. */
  WWDG_CR |= WWDG_COUNTER << WWDG_CR_T_LSB; /* Setup T[6:0]. */

  WWDG_CFR &= ~(0x7F << WWDG_CFG_W_LSB);      /* Clear W[6:0]. */
  WWDG_CFR |= WWDG_WINDOWS << WWDG_CFG_W_LSB; /* Setup W[6:0]. */

  WWDG_CR |= WWDG_CR_WDGA; /* Enable WWDG. */
}

static void led_setup(void)
{
  gpio_mode_setup(GPIO_LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, GPIO_LED_PIN);
  gpio_set_output_options(GPIO_LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, GPIO_LED_PIN);
}

int main(void)
{
  rcc_setup();
  systick_setup();
  led_setup();

  gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(10);
  gpio_set(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(1000);

  wwdg_setup(); /* Setup and start WWDG. */

  delay_ms(WWDG_MS(WWDG_COUNTER - WWDG_WINDOWS + 1));
  wwdg_refresh();

  while (1)
  {
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
    delay_ms(WWDG_MS((WWDG_COUNTER & 0x3F) + 1)); /* 0x3F is the mask for bit[5:0]. */
    wwdg_refresh();
  }

  return 0;
}

/**
 * @brief  SysTick handler.
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
#include <libopencm3/stm32/wwdg.h>
#include <libopencm3/cm3/systick.h>
#include <libopencm3/cm3/nvic.h>
```
和 IWDG 時一樣，爲了要更方便驗證 WWDG 的運作，我使用 [SysTick]() 實現較精確的 ms 級 `delay()`，因此需要 `systick.h` 與 `nvic.h`。當然也需要今天的主角——`wwdg.h`。  

### RCC
``` c
static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);
  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_WWDG);
}
```
要注意這裡與 IWDG 不同，WWDG 在 APB1 底下，所以要記得爲它致能 Clock。  

### WWDG Timeout 計算
``` c
#define WWDG_COUNTER (0x7F) /* WWDG_CR  -> T[6:0], 0x7F ~ 0x40. */
#define WWDG_WINDOWS (0x5F) /* WWDG_CFR -> W[6:0], T[6:0] ~ 0x40. */

#define WWDG_MS(v) (1.0 / (rcc_apb1_frequency / 1000) * 4096 * 8 * (v))
```
複習一下上一篇提到的基本概念。在啓用 WWDG 時有兩種情況會造成它觸發 System Reset：  
1. 當 WWDG 下數計數器的值 T[6:0] 變得小於 `0x40`，即 T6 位元變成 `0`。
2. 在時間窗口（Window）外（即 T[6:0] > W[6:0]）時下數計數器被重新裝載（Reload）。  

![▲ WWDG 的 Window 示意圖。取自 RM0390 Rev 6 P.648。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi95ZGURIwumO5WY3GiuIpFNpwEI6zJKUZs8cggiZBgqOSoEvA9zeDnp_PwH-9Rw-bU9dzsMxStwm4YhffS6XIKYMm3uLHAwaRV5SQhuLPsnd89kdX3EoPfKNPODTTRrj4uCPP5Qr62Fbo_WSmnTAWt6PIt7gWErprcFJOqBdEGWxAV6ef8nN9oVlFd/s16000/image_1662526244380_0.png)  

![▲ WWDG 的 Timeout 計算公式。取自 RM0390 Rev 6 P.648。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLJOd0kVjLvFREZbFgal7bDN2U64qtQ-WLzdNKhhXWNb71g6BUun3GBzPMFvsQ5OTS4t9REMhuriMs7w_mpvu7mVXgY4jcr9K8pY5qt4so7qC6nbFE052ja_M2o2Uc-kIPrIo-ecWW1OGhKyc2sI5NMEodpXIAZprXzIPo161v6detq6bYW67FytKj/s16000/image_1662526953782_0.png) 

只要參考上面的公式就可以計算 WWDG 的 Timeout 長度。

我這裡以 `WWDG_COUNTER` 爲名定義 T[6:0] 爲 `0x7F`，以 `WWDG_WINDOWS` 爲名定義 W[6:0] 爲 `0x5F`。

再使用一個 Macro `WWDG_MS()` 來定義 Timeout 計算公式爲 `1.0 / (rcc_apb1_frequency / 1000) * 4096 * 8 * (v)`。  
  
依此設定，必須要在 T[6:0] = `0x5F`\~`0x40` 的這段時間內才可以 Refresh。T[6:0] = `0x7F`\~`0x60` 是 Window 外，T[6:0] ≦ `0x3F`時代表 Timeout。

### WWDG 設定
``` c
static void wwdg_setup(void)
{
  WWDG_CFR |= WWDG_CFR_WDGTB_CK_DIV8 << WWDG_CFR_WDGTB_LSB; /* Set WDG prescaler to div8. */

  WWDG_CR &= ~(0x7F << WWDG_CR_T_LSB);      /* Clear T[6:0]. */
  WWDG_CR |= WWDG_COUNTER << WWDG_CR_T_LSB; /* Setup T[6:0]. */

  WWDG_CFR &= ~(0x7F << WWDG_CFG_W_LSB);      /* Clear W[6:0]. */
  WWDG_CFR |= WWDG_WINDOWS << WWDG_CFG_W_LSB; /* Setup W[6:0]. */

  WWDG_CR |= WWDG_CR_WDGA; /* Enable WWDG. */
}
```
有沒有感受到這一段程式的風格突變？  
  
因爲截止寫文章當下，LibOpenCM3 還沒有實作任何 WWDG 的相關函式，所以只好回歸最原始的暫存器操作。還好 WWDG 是個很簡單的功能，要操作的暫存器甚至比使用 GPIO 還少。  
  
要設定的值只有四個，分別爲 WDG 預除頻器的除頻值 WDGTW、T[6:0]、W[6:0]，最後再將 WDGA 設爲 `1` 以致能 WWDG。  
  
> 注意，寫入 WWDG_CR 暫存器的值必須要在 `0xFF` 與 `0xC0` 之間。由於第 7 位 WDGA 只能在 Reset 後由硬體清爲 `0`，所以寫入 WWDG_CR 的第 7 位元一定是 `1`。而如果第 6 位 T6 被設定爲 `0` 的話會立刻觸發 Reset。  

### WWDG Refresh
``` c
static void wwdg_refresh(void)
{
  WWDG_CR |= WWDG_COUNTER << WWDG_CR_T_LSB;
}
```
Refresh 也非常單純，就是寫入 T[6:0] 讓計數器 Reload。  

### 主程式
``` c
int main(void)
{
  rcc_setup();
  systick_setup();
  led_setup();

  gpio_clear(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(10);
  gpio_set(GPIO_LED_PORT, GPIO_LED_PIN);
  delay_ms(1000);

  wwdg_setup(); /* Setup and start WWDG. */

  delay_ms(WWDG_MS(WWDG_COUNTER - WWDG_WINDOWS + 1));
  wwdg_refresh();

  while (1)
  {
    gpio_toggle(GPIO_LED_PORT, GPIO_LED_PIN); /* LED on/off. */
    delay_ms(WWDG_MS((WWDG_COUNTER & 0x3F) + 1)); /* 0x3F is the mask for bit[5:0]. */
    wwdg_refresh();
  }

  return 0;
}
```
主程式的部分和 IWDG 時差不多。在 WWDG 設定並啓動（`wwdg_setup()`）前先讓 LED off 10ms 後 on 1s，以方便觀察是否發生 Reset。  
  
在 WWDG 啓動後等待數毫秒再進行一次 Refresh，這邊是要驗證 Window（條件 2），如果更早進行 Refresh 的話就會觸發 Reset。  
  
主迴圈就是讓 LED 閃爍，並在一定時間後進行 Refresh，這裡是要驗證 WWDG 的 Timeout（條件 1），若更晚進行 Refresh 的話就會觸發 Reseet。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
以下列出主要的差異部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/wwdg)。  
``` c
static void rcc_setup(void)
{
#if defined(STM32F1)
  rcc_clock_setup_in_hse_8mhz_out_72mhz();
#elif defined(STM32F4)
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_84MHZ]);
#endif

  rcc_periph_clock_enable(RCC_LED_GPIO);
  rcc_periph_clock_enable(RCC_WWDG);
}
```
``` c
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
## 成果
這次使用 PlatformIO 的 Debug 功能來測試 WWDG 的運作。  

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhh_tAv7bqya8JkSHhhN20GaB2PWFl-iPxCtEvmQkMWOU7gR9RbB5vdfOKKb_ZvXzUUMGlnx2-XlwqMzKhjdkbJIz49BwD7T4EfQjuXfbkBLV1lfTEwmGgWrMZ4ZSWi_im9gAiPgxqhD5XwxnzOTg3aQbW5Sp3iQu9y3o9PEFhiGCsHELCg5HVvA9ae/s16000/1.png)  
  
可以看到 Refresh 前，T[6:0] 的值數到 `0x5F`，已經不大於 W[6:0] 了（條件 2），所以這時 Refresh 不會觸發 Reset。  
  
![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbYzUCOUKgvXVSQFV5fr20F_JNozWhzhZ_vFc_c-WOKUYVO6uuKP1S89jCRRF5UuiFOj1s1MQHYybG8yiBH1CnRFykDGCsui0lFCoThkJn6s0QBRl5tij11uZP2ocwSAW-n-bAZeGaX3lKTqRIN5ZHIQSXTHLzp8dfFynEnrfTTWT3vSGVDdbjF4Jj/s16000/2.png)  
  
在 Refresh 前，T[6:0] 的值爲 `0x40`，還沒到下限 `0x3F`（條件 1），所以這時還來得及 Refresh 而不會觸發 Reset。  
  
> 這裡的 delay 的最小單位是 1 ms，但實際計算 WWDG 的各項參數是會算到小數點後，這一點在實際應用上應該被考慮，例如使用 ns 級的 delay 函式。  

# 小結
這次接續 IWDG 的內容，繼續介紹 WWDG 的用法。由於 LibOpenCM3 目前沒有實作 WWDG 的相關操作函式，所以這次是使用操作暫存器的方式來示範，但因爲我幾乎沒有在直接操作暫存器，因此不確定上述的寫法是不是最好的，畢竟這種東西應該有不少細節是需要注意的，若有任何建議都歡迎提出。  
  
另外，這次也使用了 PIO 的 Debug 功能來做程式的驗證。Debug 是非常好用的功能，尤其 Nucleo 開發板上都有 ST-Link，可以直接進行 Debug，即時查看程式的運作與 STM32 中的暫存器數值。如果還沒用過的話請一定要學習並嘗試看看。  
  
# 參考資料
* [STM32 Window Watchdog (WWDG) - Hackster.io](https://www.hackster.io/vasam2230/stm32-window-watchdog-wwdg-dda290)
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/wwdg) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10299482)。
