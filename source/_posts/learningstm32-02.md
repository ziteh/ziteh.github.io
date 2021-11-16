title: '[STM32學習記錄-2] 基本輸入與輸出教學-GPIO相關暫存器簡介'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
categories:
  - STM32學習記錄
date: 2018-08-26 10:47:00
---
# 前言

MCU控制最基本的就是輸入與輸出，此篇就來簡單介紹最基本的輸出入相關暫存器。

首先我們要來認識STM32F10x和輸出入有關的暫存器。每個GPIO有：(以下x為Port名稱，也就是A，B，C，D或E)

1.  兩個32位元的設置暫存器（GPIOx\_CRH、GPIOx\_CRL）
2.  兩個32位元的資料暫存器（GPIOx\_IDR、GPIOx\_ODR）  
3.  一個32位元的位元設定/重置暫存器（GPIOx\_BSRR）
4.  一個16位元的位元重置暫存器（GPIOx\_BRR）  
5.  一個32位元的設置鎖定暫存器（GPIOx\_LCKR）

<!--more-->

## 一、設置暫存器CRH、CRL

CRH和CRL分別是Configuration Register High與Configuration Register Low的縮寫。CRL負責0～7號接腳，CRH負責8～15號接腳，而每隻接腳使用4個位元。接腳可以透過這4個位元設定成不同的功能。其設定方法如下。  

![](https://1.bp.blogspot.com/-uqsaxcbFSxI/XolLhLiIU4I/AAAAAAAACCM/3zvpEceOBNEFJDV4o_pEFGgD_fQvsA_3gCKgBGAsYHg/s1600/GPIO-CRH%2526CRL%25E8%25A8%25AD%25E7%25BD%25AE%25E8%25A1%25A8.png)

而CRH和CRL的格式如下。CNF和MODE後面的數字就是腳位標號，可以看出每隻接腳由4個位元進行設置，如CRH的31到28位元控制第15腳、CRL的15到12位元控制第3腳。而且所有位元都是可讀寫的。

![](https://1.bp.blogspot.com/-OvB2rTtC9Nk/XolLhKSs6RI/AAAAAAAACCM/VqlwJqk-awIACdKWboZmscLIfZkZ9dNKgCKgBGAsYHg/s1600/GPIO-CRH%2526CRL%25E6%25A0%25BC%25E5%25BC%258F.png)

範例：
```c
GPIOB->CRH = 0x004411EE;
// 將Port B的15、14腳設為類比輸入,
// 13、12腳設為浮空輸入,
// 11、10腳設為最快10MHz的推挽通用輸出,
// 9、8腳設為最快2MHz的汲極開路复用輸出.

GPIOA->CRL = 0x22222222;
// 將Port A的7到0腳都設為最快2MHz的推挽通用輸出
```

至於各個輸出入模式有什麼差別，我簡單的以我找到的資料說明一下：

### ※推挽和汲極開路
這兩者根本的差異在於電路結構不同。  

*   推挽（Push-Pull）使用一對互補的電晶體，輸出可以直接是高或低準位，不用再外加電路，並且能夠灌電流（Sink current）與拉電流（Sourcing current）。
*   汲極開路（Open-Drain，OD）是MOSFET版的集極開路（ Open-Collector，OC），基本上只有開路（浮接）和接地這兩種狀態，所以如果要輸出高低準位的話要外加一個上拉電阻（提升電阻，Pull-up resistor），也因為可以使用上拉電阻，所以上拉的電源電壓可以自己決定，可以當作邏輯電壓轉換，且可以提供大於晶片本身能提供的電流，因為電源已經獨立出來了。而一般情況只能灌電流（Sink current），外加上拉電阻後才行拉電流（Sourcing current）。而將多隻OD輸出接在一起後加上一上拉電阻，會形成所謂的“線接及閘（Wired AND）”

如果以上還是不瞭解的話，一般就用推挽輸出就好了。詳細可以觀看：

1.  [【Cary-生活筆記】Open-Drain 與 Push-Pull輸出方式有什麼不一樣？](http://cary1120.blogspot.com/2013/11/open-drain-push-pull.html)
2.  [【CSND】open drain和push pull](https://blog.csdn.net/tanli20090506/article/details/77450905)
3.  [【Wiki維基百科】集電極開路](https://zh.wikipedia.org/wiki/%E9%9B%86%E7%94%B5%E6%9E%81%E5%BC%80%E8%B7%AF)

<br/>

### ※通用輸出與复用輸出

*   通用輸出就是一般的輸出模式，我們可以直接透過ODR暫存器來指定要輸出高或低準位。
*   复用輸出就是讓該腳位作為第二功能（如STM32F103RB的PB10腳的第二功能是I2C\_SCL。詳細可以查Datasheet）的輸出模式，觀察表一可以發現，复用輸出模式沒辦法透過編輯ODR暫存器來控制該腳位的準位。

如果以上還是不瞭解的話，一般就用通用輸出就好了。詳細可以觀看：

1.  [挽输出、开漏输出、复用开漏输出、复用推挽输出 以及上拉输入、下拉输入、浮空输入、模拟输入的区别](http://www.voidcn.com/article/p-ktxryirx-wh.html)

<br/>

### ※四種輸入模式

*   類比輸入就如同字面上的意思，是用來輸入類比訊號的，當然要輸入類比訊號的話，該腳位要有支援才可以。
*   浮空輸入就是指晶片內部沒有上/下拉電阻，是浮接的狀態，所以一般的使用情形會要外加上/下拉電阻才可以讀取高低準位。
*   上拉輸入就是晶片內部有一個上拉電阻，所以不用再外加上拉電阻。
*   下拉輸入和上拉輸入概念相同，只是把上拉電阻變成下拉電阻。要比較注意到是，上/下拉輸入模式還要搭配ODR暫存器使用。

如果以上還是不瞭解的話，一般就用浮接輸入，然後自己外加上/下拉電阻就好了。詳細可以觀看：

1.  [大家来说说自己对GPIO 浮空输入的理解(已解决)](http://www.openedv.com/thread-424-1-1.html)
2.  [stm32的输入分浮空，上拉，下拉。帮忙教教我这是啥意思。](https://zhidao.baidu.com/question/307988354.html)

<br/>

## 二、輸出與輸入資料暫存器

ODR與IDR分別是Output Data Register和Input Data Register的縮寫。這兩個暫存器各自控制15到0號腳的輸出入資料。觀察下表可以發現ODR是可讀寫的，而IDR是唯讀的。且兩個暫存器都只是用0到15位元，16到31位元是保留的。

![](https://1.bp.blogspot.com/-UFXiYnrLcm4/XolLhJuTyUI/AAAAAAAACCM/Els8A0-NYpsOUOOCiaIQrqIDgFN-G295ACKgBGAsYHg/s1600/GPIO-ODR%2526IDR%25E6%25A0%25BC%25E5%25BC%258F.png)

範例：
```c
GPIOB->ODR = 0x0000;        // 將Port B的0到15腳都輸出為低準位
GPIOC->ODR = 0xF8A1;        // 將Port C的15到11、7、5和0號腳設為高準位，其餘為低準位

if (GPIOA->IDR & 0x0020)    // 如果PA5是輸入高準位的話
 GPIOC->ODR = 0x2000;       // PC13輸出高準位，其它為低準位
else
 GPIOC->ODR = 0x0000;       // PC13全部輸出低準位

if (!(GPIOA->IDR) & 0x0040) // 如果PA6是輸入低準位的話
... //下略
```

## 三、位元設置/重置暫存器

BSRR與BRR分別是Bit Set/Reset Register和Bit Reset Register的縮寫。BSRR的31到16位元分別控制15到0號腳的重置功能，如果該位元被設置為1的話，對應的腳位就會被重置為0。而BSRR的15到0位元分別控制15到0號腳的設置功能，如果該位元被設置為1的話，對應的腳位就會被設置為1。  

而設置的權重比重置高，所以如果該腳位同時被設置又被重置的話，其結果是該腳位會被設置為1。而BRR的功能和BSRR的31到16位元一樣。而可以注意到的是BSRR和BRR所有位元都是唯寫的。

![](https://1.bp.blogspot.com/-HYrFu6BpE3c/XolLhPIl9JI/AAAAAAAACCM/98YJgXUP7PI-YvRQKj1d-SY8BemUmMxuACKgBGAsYHg/s1600/GPIO-BSRR%2526BRR%25E6%25A0%25BC%25E5%25BC%258F.png)

範例：
```c
GPIOB->BSRR = 0x30000A00; // 將Port B的13和12腳重置為0；11和9腳設置為1
GPIOB->BRR = 0xFFFF;      // 將Port B的所有腳位重置為0
```

## 四、設置鎖定暫存器

LCKR是Configuration Lock Register的縮寫。其中15到0位元分別控制15到0號腳的設置（CRH、CRL）鎖定狀態，0是未鎖定，1是鎖定，這16位元只能在LCKK為0時寫入。而第16位元是LCKK(Lock Key)位元，用來鎖定LCKR暫存器，0代表未鎖定，1代表鎖定，直到下次系統重置前LCKR暫存器都會被鎖定。  

要特別注意到是這個鎖定的功能是用來鎖定腳位的輸出入模式設置，也就是鎖CRH和CRL的設置，不是用來鎖定腳位的高低準位的。

![](https://1.bp.blogspot.com/-bj3GEPz87D0/XolLhLa9QZI/AAAAAAAACCM/u6pZxLoBFUgg83pv-yWZLAc0kgSqt36dgCKgBGAsYHg/s1600/GPIO-LCKR%25E6%25A0%25BC%25E5%25BC%258F.png)

而LCKR的寫法比較特別，我也還不是很清楚，只知道要照著以下的格式進行寫入。日後如果有找到寫法的話我再來更新。

```
WR LCKR[16] = ‘1’ + LCKR[15:0]
WR LCKR[16] = ‘0’ + LCKR[15:0]
WR LCKR[16] = ‘1’ + LCKR[15:0]
RD LCKR
RD LCKR[16] = ‘1’（非必要，但可以確保）
```

## 五、 APB2外圍設備時鐘致能暫存器

除了以上5種暫存器外，還要在加上一個RCC\_APB2ENR暫存器，腳位才能正常的使用。  

APB2ENR是APB2 Peripheral Clock Enable Register的縮寫。每個位元都代表一個外圍設備，而當該位元為1時代表對應的功能致能（開啟），反之設為0代表禁能（關閉）。

![](https://1.bp.blogspot.com/--JWiz_-VUOg/XolLhAERcnI/AAAAAAAACCM/y4oAc9VRbWolR4LntmFY7_ybyVi5vvyvACKgBGAsYHg/s1600/GPIO-APB2ENR%25E6%25A0%25BC%25E5%25BC%258F.png)

而我們寫APB2ENR時通常使用OR的方式，請看範例：
```c
RCC->APB2ENR = RCC->APB2ENR | 0x0004;   // 開啟Port A的時鐘
RCC->APB2ENR |= 0x0004;                 // 同上行
RCC->APB2ENR |= (1<<2);                 // 同上行
```

# 相關文章

* [\[系列文章\] STM32學習記錄](/pages/serial/s-learningstm32.html)