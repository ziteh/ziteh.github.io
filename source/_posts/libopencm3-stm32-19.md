title: 'STM32 ADC 類比數位轉換器'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-10-02 12:00:00
---

# 前言
ADC（Analog to Digital Converter）顧名思義是將類比訊號轉換成數位訊號的元件，現今多數 MCU 都會內建 ADC，而這也是相當基本且常用的功能。

STM32 中的 ADC 功能相當多樣，也造成它的使用有一定程度的複雜度，搭配組合很多，因此本文會以 STM32F446RE 爲主，簡單介紹各種基本的模式及設定。

<!--more-->

# 基本介紹
STM32F446RE 擁有三個 12-bit 的 ADC，且擁有 19 個通道，其中包含 16 個來自外部、2 個來自內部，還有一個是 `V_BAT` 通道。ADC 的輸入電壓範圍爲 `V_REF-` \~ `V_REF+`，也就是最大 `0` \~ `3.6` V。

![▲ ADC 容許電壓範圍。取自 DS106893 Rev10 P.139。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuWWHI4rT9elX1Q6tVOq6ihHGnvlt0Nw63soBztR2k6zU2yCfZmtkdZnZXYkdF-uyh94ru_NNA-hX-VT9EmstBHldvGbAZeWLuV1lSZNrrvlaJBzuKKauU8hat2q5xfeiIvhRBjCoNjcVr1wwuc8s6DFmGtzAxgqibYBrcBuHr8s3PB4xlk1PCTOti/s16000/image_1664365176174_0.png) 
  
![▲ 單一 ADC 的方塊圖。取自 RM0390 Rev6 P.356。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9ap5_i4X5FTeUcZtJVWPF4PaMDRQIpMnTBl94o8bVIIAFRZ3CQBpDjj0ZCgVtCBuWwZWjYnBBTYKQPamB5kvbd1WLzJ7q9htO0ZoCh1VXME9nbOXCiNth-xJ3sW9HA7iggds_Z6_TWl5tNX1Vi6-NRYelHUFSpERWZj5JOJYdf0xs2spD0IB8QCwi/s16000/image_1664363794814_0.png)
 
ADC 有兩個 Clock：
* 類比電路時鐘：所有 ADC 皆相同。此時鐘訊號來自 APB2，經過一個可程式的預除頻器（\2、\4、\6 或 \8）。此時鐘頻率的上限爲 18 MHz（`V_DDA` = 1.7 ~ 2.4 V）或 36 MHz（`V_DDA` = 2.4 ~ 3.6 V）。參考 DS10693 的 Table 74. ADC characteristics。
* 數位介面時鐘：用於相關暫存器的讀寫操作。此時鐘等同 APB2，可以透過設定 RCC 來單獨致/禁能特定的 ADC。

# 通道分組
在 STM32 中，ADC 通道可分爲 Regular（常規）和 Injected（注入）兩組。組，或著說序列（Sequence）是由一到數個 ADC 通道以任一順序組成。
* Regular group
  * 由最多 16 個通道組成。
  * 僅有一個 16 位元的資料暫存器（ADC_DR：ADC regular data register）。
* Injected group
	* 由最多 4 個通道組成。
	* 有 4 個 16 位元的資料暫存器（ADC_JDR*x*：ADC injected data register *x*, *x*=1\~4）。

Regular 與 Injected 的主要差異除了上面列的外，還有就是 Injected 有著類似中斷（Interrupt）的功能。一般狀態下，使用者可以將平常要量測的類比訊號源設爲「 Regular 常規組」，當特殊事件發生時，「Injected 注入組」可以中斷 Regular 的轉換，優先進行 A/D 轉換，完成後再回去進行 Regular 組的轉換。

> Regular 比較常見翻譯成「規則」通道，但在此我認爲翻成「常規」比較能夠區分其與 Injected 的功能差異。  

# 內部通道
F446RE 中有 3 個內部通道：溫度感測器、內部參考電壓 `V_REFINT` 與電池 `V_BAT`。

其中，溫度感測器與 `V_BAT` 共用 ADC1_IN18 通道。它們無法同時使用，若同時被啓用，那只有 `V_BAT` 的轉換會運作。而 `V_REFINT` 使用 ADC1_IN17 通道。

# 轉換模式
## Single conversion mode 單次轉換模式
在此模式下，每次觸發 ADC 都只會進行一次轉換，轉換完成後就停止。

透過將 ADC_CR2 暫存器的 CONT 位元設爲 `0` 以使用此模式。

觸發源可以是：
* 將 ADC_CR2 的 SWSTART 位元設爲 `1`，即軟體觸發轉換。僅限 Regular 通道。
* 將 ADC_CR2 的 JSWSTART 位元設爲 `1`，即軟體觸發轉換。僅限 Injected 通道。
* 外部觸發（如 Timer 或 EXTI）。Regular 及 Injected 通道皆適用。

## Continuous conversion mode 連續轉換模式
在此模式下，ADC 在完成一次轉換後會儘快開始另一次新的轉換。

透過將 ADC_CR2 暫存器的 CONT 位元設爲 `1` 以使用此模式。

觸發源可以是：
* 將 ADC_CR2 的 SWSTART 位元設爲 `1`，即軟體觸發轉換。僅限 Regular 通道。
* 外部觸發（如 Timer 或 EXTI）。僅限 Regular 通道。

> Injected 通道無法使用連續轉換，除非設定 JAUTO 位元以啓用 Auto-injection，在此就不詳細說明。  

# 其它模式
## Scan mode 掃描模式

此模式用來以組爲單位，爲多個 ADC 通道進行轉換。Regular 和 Injected 通道都適用。

當其中一個通道轉換完成後，組（或序列 Sequence）中的下一個通道會自動開始進行轉換，若啓用了 Continuous conversion mode（CONT=`1`），當 Regular 組的最後一個通道轉換完後，會繼續從組中的第一個通道重新開始另一輪轉換，不會停止。

由於 Regular 組只有一個 16 位元的資料暫存器，所以通常會搭配 DMA 來存取轉換完成的資料，避免資料被下一個通道的資料覆蓋。而 Injected 組的 4 個通道都有自己獨立且專用的 16 位元資料暫存器，故其轉換完成的資料會儲存進各自的資料暫存器中，不必擔心資料會被其它通道所覆蓋。

此模式透過設定 ADC_CR1 中的 SCAN 位元來啓用。
  
## Discontinuous mode 不連續模式
此模式的概念是可以將組（或序列 Sequence）再分成更短的小組，當觸發轉換時，會以小組爲單位進行轉換，也就是可以不一次轉換組內的全部通道，而是分批掃描。

例如設定 Regular 組所包含的通道依序爲「0，1，2，3，6，7，9，10」，並將小組的長度 `n` 設爲 3：
* 第一次觸發：轉換「0，1，2」通道。
* 第二次觸發：轉換「3，6，7」通道。
* 第三次觸發：轉換「9，10」通道。
* 第四次觸發：轉換「0，1，2」通道。
* 以此類推... ...

此模式透過設定 ADC_CR1 的 DISCEN（對於 Regular）或 JDISCEN（對於 Injected）位元來啓用。Regular 和 Injected 不能同時啓用 Discontinuous mode。

> Auto-injected 與 Discontinuous mode 無法同時使用。  
> Discontinuous mode 與 Continuous conversion mode 雖然名稱相近但其「連續」的意義不同。前者是可以將組再細分成小組，後者是在每次轉換完成後自動觸發下一次的轉換。  

# 小結
ADC 的功能相當複雜與多元，以上也只是簡單介紹最基本的概念，還有很多進階的功能沒有提到，像是 ADC watchdog、Multi ADC 或電池監控等，這些進階的功能可以參考 RM0390（STM32F446RE）。

  # 參考資料
* [STM32 ADC Tutorial - Complete Guide With Examples - DMA / Interrupt](https://deepbluembedded.com/stm32-adc-tutorial-complete-guide-with-examples/)
* [How to use ADC with STM32? - The Engineering Projects](https://www.theengineeringprojects.com/2021/11/how-to-use-adc-with-stm32.html)
* [What is the difference between an injected and regular STM32 ADC channel? - Electrical Engineering Stack Exchange](https://electronics.stackexchange.com/questions/83426/what-is-the-difference-between-an-injected-and-regular-stm32-adc-channel)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)

> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10300851)。
