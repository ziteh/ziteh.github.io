title: 'STM32 LibOpenCM3：PWM 脈波寬度調變'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-09-27 12:00:00
---

# 前言
在之前的內容中已經介紹過基本的 Timer 用法，及 PWM 的計算。  
  
在使用 PWM 時我們會需要控制兩種參數：頻率與 Duty Cycle（佔空比）。頻率的部分和 Timer 一樣，由 TIMx_PSC 與 TIMx_ARR 暫存器的值來設定，而 Duty Cycle 則由 TIMx_CCRx 暫存器來指定。  
  
這篇的目標是寫出一個可以設定 PWM 頻率與 Duty Cycle 的程式，並讓 STM32 輸出 PWM 訊號。  
  
<!--more-->
  
# 正文
首先一樣以 Nucleo-F446RE 做示範。  
  
首先[建立一個 PIO 的專案](https://ziteh.github.io/2022/09/libopencm3-stm32-2/#%E5%BB%BA%E7%AB%8B%E5%B0%88%E6%A1%88)，選擇 Framework 爲「libopencm3」，並在 `src/` 資料夾中新增並開啓 `main.c` 檔案。  
## 完整程式
``` c
/**
 * @file   main.c
 * @brief  PWM(Pulse-width modulation) example for STM32 Nucleo-F446RE.
 */

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>

#define PWM_GOAL_FREQUENCY (1000)  /* f_goal, PWM goal frequency in Hz. */
#define PWM_GOAL_DUTY_CYCLE (72.5) /* dc_goal, PWM goal duty-cycle in %. */

#define PWM_TIMER_CLOCK (rcc_apb1_frequency * 2) /* f_timer. */
#define PWM_COUNTER_CLOCK (1000000) /* f_counter (CK_CNT). */

#define PWM_TIMER_PRESCALER (PWM_TIMER_CLOCK / PWM_COUNTER_CLOCK - 1) /* PSC. */
#define PWM_TIMER_PERIOD (((PWM_TIMER_CLOCK) / ((PWM_TIMER_PRESCALER + 1) * PWM_GOAL_FREQUENCY)) - 1) /* ARR. */
#define PWM_TIMER_OC_VALUE ((PWM_TIMER_PERIOD + 1) * PWM_GOAL_DUTY_CYCLE / 100) /* CCR. */

#define RCC_PWM_GPIO (RCC_GPIOA)
#define GPIO_PWM_PORT (GPIOA)
#define GPIO_PWM_PIN (GPIO7)   /* D11. */
#define GPIO_PWM_AF (GPIO_AF2) /* Ref: Table-11 in DS10693. */

static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_PWM_GPIO);
  rcc_periph_clock_enable(RCC_TIM3);
  rcc_periph_reset_pulse(RST_TIM3); /* Reset TIM3 to defaults. */
}

static void pwm_setup(void)
{
  /* Set PWM pin to alternate function push-pull. */
  gpio_mode_setup(GPIO_PWM_PORT, GPIO_MODE_AF, GPIO_PUPD_NONE, GPIO_PWM_PIN);
  gpio_set_output_options(GPIO_PWM_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_50MHZ, GPIO_PWM_PIN);
  gpio_set_af(GPIO_PWM_PORT, GPIO_PWM_AF, GPIO_PWM_PIN);

  timer_set_mode(TIM3, TIM_CR1_CKD_CK_INT, TIM_CR1_CMS_EDGE, TIM_CR1_DIR_UP);
  timer_disable_preload(TIM3);
  timer_continuous_mode(TIM3);

  timer_set_prescaler(TIM3, PWM_TIMER_PRESCALER);        /* Setup TIMx_PSC register. */
  timer_set_period(TIM3, PWM_TIMER_PERIOD);              /* Setup TIMx_ARR register. */
  timer_set_oc_value(TIM3, TIM_OC2, PWM_TIMER_OC_VALUE); /* Setup TIMx_CCRx register. */
  timer_set_oc_mode(TIM3, TIM_OC2, TIM_OCM_PWM1);

  timer_enable_oc_output(TIM3, TIM_OC2);
  timer_enable_counter(TIM3);
}

int main(void)
{
  rcc_setup();
  pwm_setup();

  while (1)
  { /* Halt. */ }
  return 0;
}
```

## 分段說明
### Include
``` c
#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/timer.h>
```
和 [Timer](https://ziteh.github.io/2022/09/libopencm3-stm32-12/) 時相比只少了中斷的 `nvic.h`，要使用 PWM 就只需要這 3 個功能就可以了。  

### 計算並設計 Timer 參數（PSC、ARR、CCR 暫存器）
``` c
#define PWM_GOAL_FREQUENCY (1000)  /* f_goal, PWM goal frequency in Hz. */
#define PWM_GOAL_DUTY_CYCLE (72.5) /* dc_goal, PWM goal duty-cycle in %. */

#define PWM_TIMER_CLOCK (rcc_apb1_frequency * 2) /* f_timer. */
#define PWM_COUNTER_CLOCK (1000000) /* f_counter (CK_CNT). */

#define PWM_TIMER_PRESCALER (PWM_TIMER_CLOCK / PWM_COUNTER_CLOCK - 1) /* PSC. */
#define PWM_TIMER_PERIOD (((PWM_TIMER_CLOCK) / ((PWM_TIMER_PRESCALER + 1) * PWM_GOAL_FREQUENCY)) - 1) /* ARR. */
#define PWM_TIMER_OC_VALUE ((PWM_TIMER_PERIOD + 1) * PWM_GOAL_DUTY_CYCLE / 100) /* CCR. */
```

這部分的 `PWM_TIMER_CLOCK`、`PWM_COUNTER_CLOCK`、`PWM_TIMER_PRESCALER`(PSC)、 `PWM_TIMER_PERIOD`(ARR) 和 [Timer](https://ziteh.github.io/2022/09/libopencm3-stm32-12/) 的部分一樣，就不再贅述。  

這次的重點是 CCR 暫存器。在[上一篇](https://ziteh.github.io/2022/09/libopencm3-stm32-13/)中已經說明其關係式爲：  
`Duty_Cycle% = CCR / (ARR + 1) * 100%`  
所以  
`CCR = (ARR + 1) * Duty_Cycle%  / 100%`  
  
因此這裡以 `PWM_TIMER_OC_VALUE` 爲名定義 CCR 的計算公式 `(PWM_TIMER_PERIOD + 1) * PWM_GOAL_DUTY_CYCLE / 100`。  

### RCC
``` c
static void rcc_setup(void)
{
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);

  rcc_periph_clock_enable(RCC_PWM_GPIO);
  rcc_periph_clock_enable(RCC_TIM3);
  rcc_periph_reset_pulse(RST_TIM3); /* Reset TIM3 to defaults. */
}
```
這部分還是和 [Timer](https://ziteh.github.io/2022/09/libopencm3-stm32-12/) 一樣。重點一樣是指定時鐘源爲 8 MHz 的 HSE，並設定系統時鐘爲 168 MHz。  

### PWM 與 Timer 設定
``` c
static void pwm_setup(void)
{
  /* Set PWM pin to alternate function push-pull. */
  gpio_mode_setup(GPIO_PWM_PORT, GPIO_MODE_AF, GPIO_PUPD_NONE, GPIO_PWM_PIN);
  gpio_set_output_options(GPIO_PWM_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_50MHZ, GPIO_PWM_PIN);
  gpio_set_af(GPIO_PWM_PORT, GPIO_PWM_AF, GPIO_PWM_PIN);

  timer_set_mode(TIM3, TIM_CR1_CKD_CK_INT, TIM_CR1_CMS_EDGE, TIM_CR1_DIR_UP);
  timer_disable_preload(TIM3);
  timer_continuous_mode(TIM3);

  timer_set_prescaler(TIM3, PWM_TIMER_PRESCALER);        /* Setup TIMx_PSC register. */
  timer_set_period(TIM3, PWM_TIMER_PERIOD);              /* Setup TIMx_ARR register. */
  timer_set_oc_value(TIM3, TIM_OC2, PWM_TIMER_OC_VALUE); /* Setup TIMx_CCRx register. */
  timer_set_oc_mode(TIM3, TIM_OC2, TIM_OCM_PWM1);

  timer_enable_oc_output(TIM3, TIM_OC2);
  timer_enable_counter(TIM3);
}
```
要使 GPIO 可以輸出 PWM 訊號的話，要將 Timer 的 Channel 對應的 GPIO 設定爲 Alternate function。我們使用 TIM3 的 Channel 2。  
  
Timer 大部分的設定都和和[上一篇](https://ziteh.github.io/2022/09/libopencm3-stm32-12/)的一樣，主要差異爲要使用 `timer_set_oc_mode()` 指定使用 Channel 2（`TIM_OC2`），並設定爲 `TIM_OCM_PWM1` 模式。  
  
使用 `timer_set_oc_value()` 函式將 CCR 的值傳給 TIMx_CCRx 暫存器。  

## 多環境程式（F446RE + F103RB）
由於 STM32F1 的部分函式不同，所以 F103RB 沒辦法直接使用上面的 F446RE 的程式。  
  
以下列出主要的差異部分，也就是 RCC 與 GPIO 的部分。完整的程式請看 [GitHub repo](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/pwm)。  
``` c
static void rcc_setup(void)
{
#if defined(STM32F1)
  rcc_clock_setup_in_hse_8mhz_out_72mhz();
#elif defined(STM32F4)
  rcc_clock_setup_pll(&rcc_hse_8mhz_3v3[RCC_CLOCK_3V3_168MHZ]);
#endif

  rcc_periph_clock_enable(RCC_PWM_GPIO);
  rcc_periph_clock_enable(RCC_TIM3);
  rcc_periph_reset_pulse(RST_TIM3); /* Reset TIM3 to defaults. */
}
```
``` c
static void pwm_setup(void)
{
  /* Set PWM pin to alternate function push-pull. */
#if defined(NUCLEO_F103RB)
  gpio_set_mode(GPIO_PWM_PORT,
                GPIO_MODE_OUTPUT_50_MHZ,
                GPIO_CNF_OUTPUT_ALTFN_PUSHPULL,
                GPIO_PWM_PIN);
#else
  gpio_mode_setup(GPIO_PWM_PORT, GPIO_MODE_AF, GPIO_PUPD_NONE, GPIO_PWM_PIN);
  gpio_set_output_options(GPIO_PWM_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_50MHZ, GPIO_PWM_PIN);
  gpio_set_af(GPIO_PWM_PORT, GPIO_PWM_AF, GPIO_PWM_PIN);
#endif
  /* 省略部分程式 */
}
```

## 成果
我使用兩組開發板並分別設定爲頻率 `1kHz`, Duty Cycle `72.5%` 以及頻率 `2kHz`, Duty Cycle `15.0%`。  
可以看到 PWM 的輸出結果是相當精準的。  
  
![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOn_sfqobeIN5fd6t3YzeHgUqWPUcpKCv0rEsTLt0UZLSM4ajE4QotX185KoVKkUVnGJMPa32G5Yt2vgXxYap2fxN_kzshZFhyHudJ5okK9OL4w_nhmeR0BSd7jRALq5fJdZkYmqZjClsU7WJpr-0y9MphcnPmL8NxiN9lrdlSAqBDAoxr7_rLM7Xo/s16000/pwm_1662278743101_0.png)  

# 小結
  
這次介紹了 STM32 的 PWM 用法，PWM 是 Timer 的延伸功能，因此大部分的設定都和 Timer 有關，如果 Timer 有理解的話 PWM 應該不會太難。  
  
# 參考資料
* [libopencm3/libopencm3-examples](https://github.com/libopencm3/libopencm3-examples)
* [platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/stm32-examples/tree/main/libopencm3/pwm) 上。  
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/5382)。
