---
title: '[STM32學習記錄-3] 基本輸入與輸出教學-GPIO相關程式寫法'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
  - C/C++
  - 程式
  - 嵌入式
categories: ["STM32學習記錄"]
date: 2018-09-08 14:24:00
comments: true
toc: true
draft: false
# aliases: ["/2018/09/learningstm32-03/"]
---

先前已經介紹過[GPIO相關暫存器](/posts/learningstm32-02)的用法了，現在我來介紹幾個最基本的輸出入程式寫法。

由於我使用的開發板NUCLEO-F103RB上有内建LED燈（PA5）和按鈕（PC13），所以以下的程式我就直接使用這兩隻腳位。

<!--more-->

```c
// 基本輸出
#include "stm32f10x.h"

void Delay(__IO u32 nCount);

int main(void)
{
   RCC->APB2ENR |= 0x00000004; // 啟用GPIOA時鐘
   GPIOA->CRL = 0x00200000;    // 設定PA5為推挽輸出，最高輸出頻率為2MHz
   while(1)
   {
     GPIOA->ODR = 0X0020;      // PA5 = 1
     Delay(6400000);           // Delay
     GPIOA->ODR = 0X0000;      // PA5 = 0
     Delay(6400000);           // Delay
   }
}

void Delay(__IO u32 nCount)
{
   for (; nCount != 0; nCount--);
}
```

![▲ 基本輸出-中間的綠色LED會不斷閃爍。](https://bucket.ziteh.dev/blog/learningstm32-03/23d7b033.webp)

```c
// 基本輸出
#include "stm32f10x.h"

int main(void)
{
   RCC->APB2ENR |= 0X00000044;  // 啟用GPIOA、GPIOE時鐘
   GPIOA->CRL = 0x00200000;     // 設定PA5為推挽輸出，最高輸出頻率為2MHz
   GPIOC->CRH = 0x00400000;     // 設定PC13為浮空輸入

   while(1)
   {
     if(GPIOC->IDR & 0x2000)    // if PC13 = 1
       GPIOA->ODR = 0X0020;     // PA5 = 1
     else
       GPIOA->ODR = 0X0000;     // PA5 = 0
   }
}
```

![▲ 基本輸入-按下按鈕後中間的綠色LED熄滅，否則亮起。](https://bucket.ziteh.dev/blog/learningstm32-03/b5450ff8.webp)

基本輸出入除了以上這種直接寫入暫存器的方法外還可以使用函數的方式來達成，而這些函數都在stm32f10x\_rcc.c和stm32f10x\_gpio.c中（參考路徑：Libraries\STM32F10x\_StdPeriph\_Driver\src），有興趣的可以參考研究。

如果將上面的基本輸入程式改用函數的話，寫法如下。

```c
// 基本輸入-使用各種函數來達成
#include "stm32f10x.h"

int main(void)
{
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);    // 啟用GPIOA時鐘
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC, ENABLE);    // 啟用GPIOC時鐘

    // 宣告一個GPIO_InitTypeDef類型的結構GPIO_InitStructure
    GPIO_InitTypeDef GPIO_InitStructure;

    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;             // 使用Pin_5
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;      // 設定為推挽式輸出
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_2MHz;      // 設定最高輸出頻率為2MHz
    GPIO_Init(GPIOA, &GPIO_InitStructure); // 選為GPIO Port-A，傳入以上設定

    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_13;            // 使用Pin_13
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING; // 設定為浮空輸入
    GPIO_Init(GPIOC, &GPIO_InitStructure); // 選為GPIO Port-C，傳入以上設定

    while (1)
    {
        if(GPIO_ReadInputDataBit(GPIOC,GPIO_Pin_13) == 1) // if PC13 = 1
            GPIO_SetBits(GPIOA,GPIO_Pin_5);           // PA5 = 1
        else
            GPIO_ResetBits(GPIOA,GPIO_Pin_5);         // PA5 = 0
    }
}
```

以下個別介紹使用到的函數：

<br/>

RCC\_APB2PeriphClockCmd

- 函數原型：void RCC\_APB2PeriphClockCmd(uint32\_t RCC\_APB2Periph, FunctionalState NewState)
- 功能：致能（使用）或禁能（關閉）APB2外圍設備時鐘。
- 輸出參數1：RCC\_APB2Periph，選擇要設定的外圍設備（詳細用法請見下方表格整理）。
- 輸入參數2：NewState，選擇要使用還是關閉時鐘（詳細用法請見下方表格整理）。
- 輸出參數：無
- 返回值：無
- 先決條件：無
- 被調用函數：無

<br/>

GPIO\_Init

- 函數原型：void GPIO\_Init(GPIO\_TypeDef\* GPIOx, GPIO\_InitTypeDef\* GPIO\_InitStruct)
- 功能：設定GPIO的模式，也就是設定CRH、CRL暫存器。
- 輸入參數1：GPIOx，選擇GPIO。
- 輸入參數2：GPIO\_InitStruct，選擇GPIO模式。為指向GPIO\_InitTypeDef的指標。GPIO\_InitTypeDef類型的結構有以下3個成員（詳細用法請見下方表格整理）。
  - GPIO\_Pin
  - GPIO\_Speed
  - GPIO\_Mode
- 輸出參數：無
- 返回值：無
- 先決條件：無
- 被調用函數：無

<br/>

GPIO\_ReadInputDataBit

- 函數原型：uint8\_t GPIO\_ReadInputDataBit(GPIO\_TypeDef\* GPIOx, uint16\_t GPIO\_Pin)
- 功能：讀取指定端口的輸入值。
- 輸入參數1：GPIOx，選擇GPIO（詳細用法請見下方表格整理）。
- 輸入參數2：GPIO\_Pin，選擇GPIO\_Pin（詳細用法請見下方表格整理）。
- 輸出參數：無
- 返回值：端口的輸入值，1或是0。
- 先決條件：無
- 被調用函數：無

<br/>

GPIO\_SetBits

- 函數原型：void GPIO\_SetBits(GPIO\_TypeDef\* GPIOx, uint16\_t GPIO\_Pin)
- 功能：將端口設置為1。
- 輸入參數1：GPIOx，選擇GPIO（詳細用法請見下方表格整理）。
- 輸入參數2：GPIO\_Pin，選擇GPIO\_Pin（詳細用法請見下方表格整理）。
- 輸出參數：無
- 返回值：無
- 先決條件：無
- 被調用函數：無

<br/>

GPIO\_ResetBits

- 函數原型：void GPIO\_ResetBits(GPIO\_TypeDef\* GPIOx, uint16\_t GPIO\_Pin)
- 功能：將端口重置為0。
- 輸入參數1：GPIOx，選擇GPIO（詳細用法請見下方表格整理）。
- 輸入參數2：GPIO\_Pin，選擇GPIO\_Pin（詳細用法請見下方表格整理）。
- 輸出參數：無
- 返回值：無
- 先決條件：無
- 被調用函數：無

<br/>

| RCC\_APB2Periph        | 描述     |
| --------------------- | -------- |
| RCC\_APB2Periph\_AFIO   | 复用功能 |
| RCC\_APB2Periph\_GPIOA  | GPIO A   |
| RCC\_APB2Periph\_GPIOB  | GPIO B   |
| RCC\_APB2Periph\_GPIOC  | GPIO C   |
| RCC\_APB2Periph\_GPIOD  | GPIO D   |
| RCC\_APB2Periph\_GPIOE  | GPIO E   |
| RCC\_APB2Periph\_ADC1   | ADC1     |
| RCC\_APB2Periph\_ADC2   | ADC2     |
| RCC\_APB2Periph\_TIM1   | TIM1     |
| RCC\_APB2Periph\_SPI1   | SPI1     |
| RCC\_APB2Periph\_USART1 | USART1   |
| RCC\_APB2Periph\_ALL    | 全部     |

備註：可以用“|”符號（也就是OR運算）一次選取多個功能。例如：

```c
// 啟用Port-A、C時鐘
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA |
                       RCC_APB2Periph_GPIOC ,
                       ENABLE);
```

| NewState | 描述         |
| -------- | ------------ |
| ENABLE   | 致能（使用） |
| DISABLE  | 禁能（關閉） |

| GPIO\_Pin     | 描述       |
| ------------ | ---------- |
| GPIO\_Pin\_0   | 選擇Pin\_0  |
| GPIO\_Pin\_1   | 選擇Pin\_1  |
| GPIO\_Pin\_2   | 選擇Pin\_2  |
| GPIO\_Pin\_3   | 選擇Pin\_3  |
| GPIO\_Pin\_4   | 選擇Pin\_4  |
| GPIO\_Pin\_5   | 選擇Pin\_5  |
| GPIO\_Pin\_6   | 選擇Pin\_6  |
| GPIO\_Pin\_7   | 選擇Pin\_7  |
| GPIO\_Pin\_8   | 選擇Pin\_8  |
| GPIO\_Pin\_9   | 選擇Pin\_9  |
| GPIO\_Pin\_10  | 選擇Pin\_10 |
| GPIO\_Pin\_11  | 選擇Pin\_11 |
| GPIO\_Pin\_12  | 選擇Pin\_12 |
| GPIO\_Pin\_13  | 選擇Pin\_13 |
| GPIO\_Pin\_14  | 選擇Pin\_14 |
| GPIO\_Pin\_15  | 選擇Pin\_15 |
| GPIO\_Pin\_All | 選擇全部   |

備註：可以用“|”符號一次選取多個功能。例如：

```c
GPIO_SetBits(GPIOA, GPIO_Pin_10 | GPIO_Pin_15); // 將PA10、PA15設置為1
```

| GPIO\_Speed       | 描述                    |
| ---------------- | ----------------------- |
| GPIO\_Speed\_10MHz | 設定最高輸出頻率為10MHz |
| GPIO\_Speed\_2MHz  | 設定最高輸出頻率為2MHz  |
| GPIO\_Speed\_50MHz | 設定最高輸出頻率為50MHz |

| GPIO\_Mode             | 描述             |
| --------------------- | ---------------- |
| GPIO\_Mode\_AIN         | 類比輸入         |
| GPIO\_Mode\_IN\_FLOATING | 浮空輸入         |
| GPIO\_Mode\_IPD         | 下拉輸入         |
| GPIO\_Mode\_IPU         | 上拉輸入         |
| GPIO\_Mode\_Out\_OD      | 汲極開路通用輸出 |
| GPIO\_Mode\_Out\_PP      | 推挽通用輸出     |
| GPIO\_Mode\_AF\_OD       | 汲極開路复用輸出 |
| GPIO\_Mode\_AF\_PP       | 推挽复用輸出     |
