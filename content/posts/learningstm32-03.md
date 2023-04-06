---
title: '[STM32學習記錄-3] 基本輸入與輸出教學-GPIO相關程式寫法'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
series: ["STM32學習記錄"]
date: 2018-09-08 14:24:00
comment: true
toc: true
draft: false
aliases: ["/2018/09/learningstm32-03/"]
---
先前已經介紹過[GPIO相關暫存器](/2018/08/learningstm32-02/)的用法了，現在我來介紹幾個最基本的輸出入程式寫法。

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

![▲ 基本輸出-中間的綠色LED會不斷閃爍。](https://1.bp.blogspot.com/-ct3JBzB9eSc/XomEJe9LfFI/AAAAAAAACCY/1_9B4X2lI30ukU6soP9mk6EF_qL7TD6vgCKgBGAsYHg/s1600/%25E5%259F%25BA%25E6%259C%25AC%25E8%25BC%25B8%25E5%2587%25BA-01.gif)

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

![▲ 基本輸入-按下按鈕後中間的綠色LED熄滅，否則亮起。](https://1.bp.blogspot.com/-n3Of_FG-F64/XomEJXHpiFI/AAAAAAAACCY/CaogFO97DFoZjwpXmZRy5AsfxXBJrkELQCKgBGAsYHg/s1600/%25E5%259F%25BA%25E6%259C%25AC%25E8%25BC%25B8%25E5%2585%25A5-01.gif)

基本輸出入除了以上這種直接寫入暫存器的方法外還可以使用函數的方式來達成，而這些函數都在stm32f10x\_rcc.c和stm32f10x\_gpio.c中（參考路徑：Libraries\\STM32F10x\_StdPeriph\_Driver\\src），有興趣的可以參考研究。

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
    GPIO_Init(GPIOC, &GPIO_InitStructure); // 選爲GPIO Port-C，傳入以上設定

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

*   函數原型：void RCC\_APB2PeriphClockCmd(uint32\_t RCC\_APB2Periph, FunctionalState NewState)
*   功能：致能（使用）或禁能（關閉）APB2外圍設備時鐘。
*   輸出參數1：RCC\_APB2Periph，選擇要設定的外圍設備（詳細用法請見下方表格整理）。
*   輸入參數2：NewState，選擇要使用還是關閉時鐘（詳細用法請見下方表格整理）。
*   輸出參數：無
*   返回值：無
*   先決條件：無
*   被調用函數：無

<br/>

GPIO\_Init

*   函數原型：void GPIO\_Init(GPIO\_TypeDef\* GPIOx, GPIO\_InitTypeDef\* GPIO\_InitStruct)
*   功能：設定GPIO的模式，也就是設定CRH、CRL暫存器。
*   輸入參數1：GPIOx，選擇GPIO。
*   輸入參數2：GPIO\_InitStruct，選擇GPIO模式。爲指向GPIO\_InitTypeDef的指標。GPIO\_InitTypeDef類型的結構有以下3個成員（詳細用法請見下方表格整理）。
	*   GPIO\_Pin
	*   GPIO\_Speed
	*   GPIO\_Mode
*   輸出參數：無
*   返回值：無
*   先決條件：無
*   被調用函數：無

<br/>

GPIO\_ReadInputDataBit

*   函數原型：uint8\_t GPIO\_ReadInputDataBit(GPIO\_TypeDef\* GPIOx, uint16\_t GPIO\_Pin)
*   功能：讀取指定端口的輸入值。
*   輸入參數1：GPIOx，選擇GPIO（詳細用法請見下方表格整理）。
*   輸入參數2：GPIO\_Pin，選擇GPIO\_Pin（詳細用法請見下方表格整理）。
*   輸出參數：無
*   返回值：端口的輸入值，1或是0。
*   先決條件：無
*   被調用函數：無

<br/>

GPIO\_SetBits

*   函數原型：void GPIO\_SetBits(GPIO\_TypeDef\* GPIOx, uint16\_t GPIO\_Pin)
*   功能：將端口設置為1。
*   輸入參數1：GPIOx，選擇GPIO（詳細用法請見下方表格整理）。
*   輸入參數2：GPIO\_Pin，選擇GPIO\_Pin（詳細用法請見下方表格整理）。
*   輸出參數：無
*   返回值：無
*   先決條件：無
*   被調用函數：無

<br/>

GPIO\_ResetBits

*   函數原型：void GPIO\_ResetBits(GPIO\_TypeDef\* GPIOx, uint16\_t GPIO\_Pin)
*   功能：將端口重置為0。
*   輸入參數1：GPIOx，選擇GPIO（詳細用法請見下方表格整理）。
*   輸入參數2：GPIO\_Pin，選擇GPIO\_Pin（詳細用法請見下方表格整理）。
*   輸出參數：無
*   返回值：無
*   先決條件：無
*   被調用函數：無

<br/>

|RCC_APB2Periph|描述|
|-|-|
|RCC_APB2Periph_AFIO|复用功能|
|RCC_APB2Periph_GPIOA|GPIO A|
|RCC_APB2Periph_GPIOB|GPIO B|
|RCC_APB2Periph_GPIOC|GPIO C|
|RCC_APB2Periph_GPIOD|GPIO D|
|RCC_APB2Periph_GPIOE|GPIO E|
|RCC_APB2Periph_ADC1|ADC1|
|RCC_APB2Periph_ADC2|ADC2|
|RCC_APB2Periph_TIM1|TIM1|
|RCC_APB2Periph_SPI1|SPI1|
|RCC_APB2Periph_USART1|USART1|
|RCC_APB2Periph_ALL|全部|

備註：可以用“|”符號（也就是OR運算）一次選取多個功能。例如：
```c
// 啟用Port-A、C時鐘
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA |
                       RCC_APB2Periph_GPIOC ,
                       ENABLE);                   
```

NewState|描述
-|-
ENABLE|致能（使用）
DISABLE|禁能（關閉）

GPIO_Pin|描述
-|-
GPIO_Pin_0|選擇Pin_0
GPIO_Pin_1|選擇Pin_1
GPIO_Pin_2|選擇Pin_2
GPIO_Pin_3|選擇Pin_3
GPIO_Pin_4|選擇Pin_4
GPIO_Pin_5|選擇Pin_5
GPIO_Pin_6|選擇Pin_6
GPIO_Pin_7|選擇Pin_7
GPIO_Pin_8|選擇Pin_8
GPIO_Pin_9|選擇Pin_9
GPIO_Pin_10|選擇Pin_10
GPIO_Pin_11|選擇Pin_11
GPIO_Pin_12|選擇Pin_12
GPIO_Pin_13|選擇Pin_13
GPIO_Pin_14|選擇Pin_14
GPIO_Pin_15|選擇Pin_15
GPIO_Pin_All|選擇全部

備註：可以用“|”符號一次選取多個功能。例如：
```c
GPIO_SetBits(GPIOA, GPIO_Pin_10 | GPIO_Pin_15); // 將PA10、PA15設置為1
```

GPIO_Speed|描述
-|-
GPIO_Speed_10MHz|設定最高輸出頻率為10MHz
GPIO_Speed_2MHz|設定最高輸出頻率為2MHz
GPIO_Speed_50MHz|設定最高輸出頻率為50MHz

GPIO_Mode|描述
-|-
GPIO_Mode_AIN|類比輸入
GPIO_Mode_IN_FLOATING|浮空輸入
GPIO_Mode_IPD|下拉輸入
GPIO_Mode_IPU|上拉輸入
GPIO_Mode_Out_OD|汲極開路通用輸出
GPIO_Mode_Out_PP|推挽通用輸出
GPIO_Mode_AF_OD|汲極開路复用輸出
GPIO_Mode_AF_PP|推挽复用輸出
