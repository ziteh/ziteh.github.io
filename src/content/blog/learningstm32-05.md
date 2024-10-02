---
title: '[STM32學習記錄-5] 優化STM32 GPIO設定函式'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
  - C/C++
  - 程式
  - 嵌入式
categories: ["STM32學習記錄"]
date: 2020-04-02 15:40:00
comments: true
toc: true
draft: false
aliases: ["/2020/04/learningstm32-05/"]
---

***注意***，本文的內容過於老舊，不建議實際使用，僅保留以作為參考用。

# 前言

在先前的[\[STM32學習記錄-3\] 基本輸入與輸出教學-GPIO相關程式寫法](/posts/learningstm32-03/)中已經介紹過STM32設定GPIO的相關函式，但如果是常用Arduion的人一定不太習慣這種設定方式，畢竟每設定一個GPIO就要打4行程式，雖然可以複製貼上，但程式一多難免看起來混亂複雜，所以我自己寫了一些GPIO相關的函式，方便自己未來使用。

<!--more-->

# GPIO模式設定函式

程式如下：

```c
/* Includes ------------------------------------------------------------------*/
#include "GPIO_mapping.h"

/* Private typedef -----------------------------------------------------------*/
/* Private define ------------------------------------------------------------*/
// Pin Mode and Speed
#define OUT   (0)  // Output
#define IN    (1)  // Input

#define GPPP  (0)  // General purpose Push-Pull (Output)
#define GPOD  (1)  // General purpose Open-Drain (Output)
#define AFPP  (2)  // Alternate function Push-Pull (Output)
#define AFOD  (3)  // Alternate function Open-Drain (Output)

#define FL    (0)  // Floating (Input)
#define AN    (1)  // Analog (Input)
#define PD    (2)  // Pull-Down (Input)
#define PU    (3)  // Pull-Up (Input)

#define S2M    (2)  // 2MHz
#define S10M  (10)  // 10MHz
#define S50M  (50)  // 50MHz

/* Private macro -------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/
/* Private function prototypes -----------------------------------------------*/
/* Private functions ---------------------------------------------------------*/

/**
  * @brief  Config a pin mode and speed.
  * @param  PortPin: select a pin to set.
  *         This parameter should be: 0 ~ 79
  *         0~15:PA0~PA15; 16~31:PB0~PB15; 32~47:PC0~PC15;
  *         48~63:PD0~PD15; 64~79:PE0~PE15
  * @param  INout: Input or Output.
  *         This parameter should be: 0(Output) or 1(Input).
  * @param  Mode: Pin mode.
  *         This parameter should be: 0~3.
  *         0: GPPP or FL.
  *         1: GPOD or AN.
  *         2: AFPP or PD.
  *         3: AFOD or PU.
  * @param  Speed: Pin speed.
  *         This parameter should be: 2, 10 or 50.
  *          2:  2MHz.
  *         10: 10MHz.
  *         50: 50MHz.
  * @retval None
  */
void Pin_Mod(u8 PortPin, u8 INout, u8 Mode, u8 Speed)
{
  /* Structure Declarations */
  GPIO_InitTypeDef GPIO_InitStructure;

  // GPIO_Speed
  switch(Speed)
  {
    case S2M:  // S2M:2
      GPIO_InitStructure.GPIO_Speed = GPIO_Speed_2MHz;
      break;
    case S10M:  // S10M:10
      GPIO_InitStructure.GPIO_Speed = GPIO_Speed_10MHz;
      break;
    case S50M:  // S50M:50
      GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
      break;
    default:
      break;
  }

  // GPIO_Mode
  if(INout == OUT)  // OUT:0
  {
    switch(Mode)
    {
      case GPPP:  // GPPP:0
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
        break;
      case GPOD:  // GPOD:1
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_OD;
        break;
      case AFPP:  // AFPP:2
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;
        break;
      case AFOD:  // AFOD:3
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_OD;
        break;
      default:
        break;
    }
  }
  else if(INout == IN)   // IN:1
  {
    switch(Mode)
    {
      case FL:  // FL:0
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
        break;
      case AN:  // AN:1
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;
        break;
      case PD:  // PD:2
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPD;
        break;
      case PU:  // PU:3
        GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
        break;
      default:
        break;
    }
  }

  // GPIO_Pin & GPIO_Init() function.
  if(PortPin <= 15)    // Port-A:  0~15
  {
    GPIO_InitStructure.GPIO_Pin = ((uint16_t)(0x0001 << PortPin));
    GPIO_Init(GPIOA, &GPIO_InitStructure);
  }
  else if(PortPin <= 31)  // Port-B: 16~31
  {
    GPIO_InitStructure.GPIO_Pin = ((uint16_t)(0x0001 << (PortPin - 16)));
    GPIO_Init(GPIOB, &GPIO_InitStructure);
  }
  else if(PortPin <= 47)  // Port-C: 32~47
  {
    GPIO_InitStructure.GPIO_Pin = ((uint16_t)(0x0001 << (PortPin - 32)));
    GPIO_Init(GPIOC, &GPIO_InitStructure);
  }
  else if(PortPin <= 63)  // Port-D: 48~63
  {
    GPIO_InitStructure.GPIO_Pin = ((uint16_t)(0x0001 << (PortPin - 48)));
    GPIO_Init(GPIOD, &GPIO_InitStructure);
  }
  else if(PortPin <= 79)  // Port-E: 64~79
  {
    GPIO_InitStructure.GPIO_Pin = ((uint16_t)(0x0001 << (PortPin - 64)));
    GPIO_Init(GPIOE, &GPIO_InitStructure);
  }
  else /* Null */;    // Out of range(0~79)
}

#undef OUT
#undef IN

#undef GPPP
#undef GPOD
#undef AFPP
#undef AFOD

#undef FL
#undef AN
#undef PD
#undef PU

#undef S2M
#undef S10M
#undef S50M
```


可以看到裡面就是增加了“void Pin\_Mod(u8 PortPin, u8 INout, u8 Mode, u8 Speed)”此一函式。其用法如下：

```c
/* STM32 Nucleo-64 board */
Pin_Mod(PA5, OUT, GPPP, S2M);  // PA5: LED-user
//GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;
//GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
//GPIO_InitStructure.GPIO_Speed = GPIO_Speed_2MHz;
//GPIO_Init(GPIOA, &GPIO_InitStructure);

Pin_Mod(PC13, IN, FL, S2M);  // PC13: Button-user
//GPIO_InitStructure.GPIO_Pin = GPIO_Pin_13;
//GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
//GPIO_InitStructure.GPIO_Speed = GPIO_Speed_2MHz;
//GPIO_Init(GPIOC, &GPIO_InitStructure);

/* USART */
Pin_Mod(PA2, OUT, AFPP, S50M);  // PA2: USART2_TX
//GPIO_InitStructure.GPIO_Pin = GPIO_Pin_2;
//GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;
//GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
//GPIO_Init(GPIOA, &GPIO_InitStructure);

Pin_Mod(PA3, IN, FL, S50M);  // PA3: USART2_RX
//GPIO_InitStructure.GPIO_Pin = GPIO_Pin_3;
//GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
//GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
//GPIO_Init(GPIOA, &GPIO_InitStructure);
```

這樣的話就可以更簡單方便地設定GPIO了。

至於其引入的“GPIO\_mapping.h”內容如下：（只適用於STM32F103RB，請依照自己的MCU腳位更改）

```c
/**
 ******************************************************************************
 * @file      GPIO_mapping.h
 * @author    ZiTe
 * @version   V1.0.0
 * @date      08-October-2019
 * @brief     Header for GPIO_Function.c module for STM32F103RB
 ******************************************************************************
 * @attention
 *
 * This file is used ONLY for STM32F103RB(STM32 Nucleo-64 board).
 *
 ******************************************************************************
 */

/* Define to prevent recursive inclusion -------------------------------------*/
#ifndef __GPIO_MAPPING_H
#define __GPIO_MAPPING_H

/* Includes ------------------------------------------------------------------*/
/* Exported types ------------------------------------------------------------*/
/* Exported constants --------------------------------------------------------*/

/* STM32 Pin(Morpho) */
/*
 * Default=Alternate functions Default
 * MA=Main function(after reset)
 * Remap=Alternate functions Remap
 */

// Port-A
#define PA0    (0)  // WKUP/USART2_CTS/ADC12_IN0/TIM2_CH1_ETR
#define PA1    (1)  // USART2_RTS/ADC12_IN1/TIM2_CH2
#define PA2    (2)  // USART2_TX/ADC12_IN2/TIM2_CH3
#define PA3    (3)  // USART2_RX/ADC12_IN3/TIM2_CH4
#define PA4    (4)  // SPI1_NSS/USART2_CK/ADC12_IN4
#define PA5    (5)  // SPI1_SCK/ADC12_IN5
#define PA6    (6)  // SPI1_MISO/ADC12_IN6/TIM3_CH1;Remap:TIM1_BKIN
#define PA7    (7)  // SPI1_MOSI/ADC12_IN7/TIM3_CH2;Remap:TIM1_CH1N
#define PA8    (8)  // USART1_CK/TIM1_CH1/MCO
#define PA9    (9)  // USART1_TX/TIM1_CH2
#define PA10  (10)  // USART1_RX/TIM1_CH3
#define PA11  (11)  // USART1_CTS/CANRX/USBDM/TIM1_CH4
#define PA12  (12)  // USART1_RTS/CANTX/USBDP/TIM1_ETR
#define PA13  (13)  // MA:JTMS/SWDIO;Remap:PA13
#define PA14  (14)  // MA:JTCK/SWCLK;Remap:PA14
#define PA15  (15)  // MA:JTDI;Remap:TIM2_CH1_ETR/ PA15/SPI1_NSS

// Port-B
#define PB0   (16)  // ADC12_IN8/TIM3_CH3;Remap:TIM1_CH2N
#define PB1   (17)  // ADC12_IN9/TIM3_CH4;Remap:TIM1_CH3N
#define PB2   (18)  // MA:PB2/BOOT1
#define PB3   (19)  // MA:JTDO;Remap:TIM2_CH2/PB3/TRACESWO/SPI1_SCK
#define PB4   (20)  // MA:JNTRST;Remap:TIM3_CH1/PB4/SPI1_MISO
#define PB5   (21)  // I2C1_SMBAl;Remap:TIM3_CH2/SPI1_MOSI
#define PB6   (22)  // I2C1_SCL/TIM4_CH1;Remap:USART1_TX
#define PB7   (23)  // I2C1_SDA/TIM4_CH2;Remap:USART1_RX
#define PB8   (24)  // TIM4_CH3;Remap:I2C1_SCL/CANRX
#define PB9   (25)  // TIM4_CH4;Remap:I2C1_SDA/CANTX
#define PB10  (26)  // I2C2_SCL/USART3_TX;Remap:TIM2_CH3
#define PB11  (27)  // I2C2_SDA/USART3_RX;Remap:TIM2_CH4
#define PB12  (28)  // SPI2_NSS/I2C2_SMBAl/USART3_CK/TIM1_BKIN
#define PB13  (29)  // SPI2_SCK/USART3_CTS/TIM1_CH1N
#define PB14  (30)  // SPI2_MISO/USART3_RTS/TIM1_CH2N
#define PB15  (31)  // SPI2_MOSI/TIM1_CH3N

// Port-C
#define PC0   (32)  //
#define PC1   (33)  //
#define PC2   (34)  //
#define PC3   (35)  //
#define PC4   (36)  //
#define PC5   (37)  //
#define PC6   (38)  //
#define PC7   (39)  //
#define PC8   (40)  //
#define PC9   (41)  //
#define PC10  (42)  //
#define PC11  (43)  //
#define PC12  (44)  //
#define PC13  (45)  //
#define PC14  (46)  //
#define PC15  (47)  //

// Port-D
#define PD0   (48)  //
#define PD1   (49)  //
#define PD2   (50)  //
#define PD3   (51)  //
#define PD4   (52)  //
#define PD5   (53)  //
#define PD6   (54)  //
#define PD7   (55)  //
#define PD8   (56)  //
#define PD9   (57)  //
#define PD10  (58)  //
#define PD11  (59)  //
#define PD12  (60)  //
#define PD13  (61)  //
#define PD14  (62)  //
#define PD15  (63)  //

// Port-E
#define PE0   (64)  //
#define PE1   (65)  //
#define PE2   (66)  //
#define PE3   (67)  //
#define PE4   (68)  //
#define PE5   (69)  //
#define PE6   (70)  //
#define PE7   (71)  //
#define PE8   (72)  //
#define PE9   (73)  //
#define PE10  (74)  //
#define PE11  (75)  //
#define PE12  (76)  //
#define PE13  (77)  //
#define PE14  (78)  //
#define PE15  (79)  //

/* Arduino Pin */
// Analog(CN8)
#define A0    (0)   // PA0
#define A1    (1)   // PA1
#define A2    (4)   // PA4
#define A3    (16)  // PB0
#define A4    (33)  // PC1(or PB9,change by solder bridges)
#define A5    (32)  // PC0(or PB8,change by solder bridges)

// Digital(CN9)
#define D0    (3)   // PA3(USART2_RX)
#define D1    (2)   // PA2(USART2_TX)
#define D2    (10)  // PA10
#define D3    (19)  // PB3(PWM)
#define D4    (21)  // PB5
#define D5    (20)  // PB4(PWM)
#define D6    (26)  // PB10(PWM)
#define D7    (8)   // PA8

// Digital(CN5)
#define D8    (9)   // PA9
#define D9    (39)  // PC7(PWM)
#define D10   (22)  // PB6(PWM/CS)
#define D11   (7)   // PA7(PWM/MOSI)
#define D12   (6)   // PA6(MISO)
#define D13   (5)   // PA5(SCK)
#define D14   (25)  // PB9(SDA)
#define D15   (24)  // PB8(SCL)

/* STM32 Nucleo-64 board */
#define Button_User (45)  // PC13. B1. When push the button, the I/O is LOW value.
#define B1          (45)
#define LED_User    (5)   // PA5. LD2. When the I/O is HIGH value, the LED is on.
#define LD2         (5)

/* Exported macro ------------------------------------------------------------*/
/* Exported functions ------------------------------------------------------- */

#endif /* __GPIO_MAPPING_H */

/********************************END OF FILE***********************************/
```


# 結語

這次簡單地分享了自己打的程式，不敢說自己的程式很完善、漂亮，但希望它有幫助到你。
如有問題或錯誤也歡迎提出討論！

> ***注意***，本文的內容過於老舊，不建議實際使用，僅保留以作為參考用。
