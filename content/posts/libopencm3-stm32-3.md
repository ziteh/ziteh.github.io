---
title: 'STM32 GPIO 簡介'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
series: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-16 12:00:00
comment: true
toc: true
draft: false
aliases: ["/2022/09/libopencm3-stm32-3/"]
---

# 前言
GPIO（General Purpose Input/Output）可以說是微控制器最基本的功能，因此第一堂當然要先教 GPIO 的使用方式。  
  
在本文中，將會介紹 STM32 的基本輸出與輸入的設定及模式。  

<!--more-->

# STM32 的 GPIO 簡介
相比與 Arduino，STM32 在使用 GPIO 時，要設定和注意的地方有很多，因此我先簡單介紹一下 STM32 的 GPIO。  
  
首先最基本的，在設定 GPIO 時除了可以指定這個 Pin 腳是要是「General Purpose」的 Input 還是 Output 外，還有所謂的「Alternate Function（AF，復用功能）」，也可以設定是否啓用 STM32 內建的 上/下拉電阻（Pull-Up/Down Resistor）。  

若選擇的是 Output 的話，還要設定輸出電路組態是「Push-Pull（PP，推挽）」或「Open-Drain（OD，汲極開路）」，和設定 IO 的速度（如 2MHz）。

如果是 Input 的話則有「類比（Analog）」與「浮接（Floating）」輸入，使用浮接輸入時也常常搭配 STM32 內建的上/下拉電阻使用。
  
功能模式：  
* General Purpose（通用功能）：一般的控制模式，由使用者透過程式碼直接控制該 Pin 腳要輸出 `High` 還是 `Low`，也可以由程式碼直接讀取該 Pin 腳的值。
* Alternate Function（復用功能）：使用該 Pin 腳所擁有的特殊功能（例如：UART、PWM、I2C），使用者沒辦法用程式碼直接控制該 Pin 腳的 `High` 或 `Low`，而是由指定的特殊功能來控制。  
  
輸出電路組態：
* [Push-Pull（推挽）](https://zh.wikipedia.org/zh-tw/%E6%8E%A8%E6%8C%BD%E8%BE%93%E5%87%BA)：由一對互補的電晶體組成，可以直接輸出 `High` 或  `Low` 電位。
* [Open-Drain（汲極開路）](https://zh.wikipedia.org/zh-tw/%E9%9B%86%E7%94%B5%E6%9E%81%E5%BC%80%E8%B7%AF)：FET 版的 Open-Collector。由一個 N 通道 FET 構成，只能輸出 `Low（GND）` 或 `Open（開路）`狀態，因此要外加一上拉電阻才能使其輸出的 `Open` 狀態變成 `High`，而 `High` 狀態的實際電壓根據上拉電阻所接的電源而定，可以高或低於 IC 本身的電壓值。擁有線接及閘（Wired AND）的特性。  
  
輸入模式：
* Analog（類比）：用於使用 ADC 讀取類比的數值時。需要分配爲 ADC Channel 的 Pin 腳上才能正常使用。
* Floating（浮接）：一般的讀取模式。若不啓用 STM32 內部的上/下拉電阻，使用時外部電路應要有上/下拉電阻，否則該 Pin 腳浮空時可能無法正確讀值（或你保證它不會有浮空的情況）。  
  
上面的內容涉及一些基本電學或電子學的知識，以上僅簡單介紹。  

![▲ GPIO 內部架構圖。取自 ST Wiki: GPIO internal peripheral。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhaPgVXld6m8H6bdFlCS8p2p1Qatn2PVDH2VBMzcyoO7i1FzXOf_Mwt3E8eJ2eKL_oK7gspo2X7AiYDcOAVmmrOnRjTOjFjdaKvZwwAB4XXSJj0-sfuEJYXQcPoRMnGXQL2TChNd_b8TeXqHQ-y-butpBBAGzfeJN8EYBO2yUJjecL9VrEe-iZvETyu/s16000/IO_port.png)

剛開始使用 STM32 時可能會搞不太懂上面這些，尤其是 AF 的部分，簡單來說，「General Purpose」就是可以單純地人爲控制輸出 `High/Low`，而使用「Alternate Function」則會將控制 `High/Low` 的權利和責任交給指定的特殊功能，例如指定該 Pin 腳爲 UART-Tx，那我就沒辦法直接設定它要 `High` 還是 `Low`，因爲 UART-Tx 的 `High/Low` 要依據其通訊協定和資料來決定，我們只能告訴 UART 要傳送的資料是什麼，再由 UART 來依據此資料自動控制該 Pin 腳的 `High/Low` 以完成通訊。  
  
而「Push-Pull」和「Open-Drain」不知道要怎麼選的話，一般都是用「Push-Pull」，因爲它可以直接輸出強高或強低，但最好還是去詳細瞭解它們的差異。  
  
另外，STM32 並非所有 Pin 腳都可以相容/承受 5V 的電壓，有些僅能 3.3V，且每個型號每支接腳都不一樣，在接電路或購買電子零件時，請查看 Datasheet 並多加留意是否需要電平轉換。

# 指定 Alternate Function
  
對於非 F1 系列的 STM32，要使用 AF 功能時，還有知道目標功能是「AF 幾？」。  
  
以 STM32F446RE 爲例，在其 Datasheet [DS10693](https://www.st.com/resource/en/datasheet/stm32f446re.pdf) 中的「Table 11. Alternate function」有把各個 AF 及其功能對應好。  
  
例如要把 PA2 及 PA3 腳當成 USART2 的 Tx 與 Rx 使用的話，要設定這兩腳要啓用的 AF 爲「AF7」。   

![▲ GPIO 與 AF 功能的對應表。取自 DS10693 Rev10 P.57。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj72ewJ_VwsOl1dP04dVnK3d0_gQgeee_F--bjtTCwmkcl6OZTakXSoeTtcYou17UQgHYwZvFe-Mf6jKQCVp_L5apdSxokQz2_58K3fSawxfjjMyu0s0ydjxmkxJ0EyR1dQ5a4lZeAMUEM0KfBjuQsl9FLQC07cwiLG_xfm9BtumOkWG-AIKIqZDxSL/s16000/Screenshot_2022-09-15_115823_1663214323550_0.png)  

# 小結
今天簡單說明了 STM32 GPIO 的模式，這些算是基本中的基本，只要弄清楚，未來在使用時就會輕鬆很多，明天終於要正式寫程式了。  
  
另外，在 STM32 中，STM32F1 是一個比較特別的系列，它的一些設計及用法和其它系列不同（例如 AF 的設定、GPIO Remap），這點可以多注意一下。  
  
> p.s. 我其實一直不確定要怎麼翻譯「Alternate Function」比較貼切，只好先使用簡體圈常見的用詞。  

# 參考資料
* [【Cary-生活筆記】: Open-Drain 與 Push-Pull輸出方式有什麼不一樣？](http://cary1120.blogspot.com/2013/11/open-drain-push-pull.html)
* [推輓輸出 - 維基百科，自由的百科全書](https://zh.wikipedia.org/zh-tw/%E6%8E%A8%E6%8C%BD%E8%BE%93%E5%87%BA)
* [集電極開路 - 維基百科，自由的百科全書](https://zh.wikipedia.org/wiki/%E9%9B%86%E7%94%B5%E6%9E%81%E5%BC%80%E8%B7%AF)
* [ST Wiki: GPIO internal peripheral](https://wiki.st.com/stm32mpu/wiki/GPIO_internal_peripheral)

> 本文同步發表於 [iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10290881)。
