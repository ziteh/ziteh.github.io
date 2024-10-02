---
title: '[專案:電腦風扇控制器-2] OLED-SSD1306零件簡單介紹'
author: ZiTe
tags:
  - 教學
  - 電子電路
  - DIY
categories: []
date: 2017-12-27 14:56:00
comments: true
toc: true
draft: false
aliases : ["/2017/12/fenctrl-2/"]
---
![](https://1.bp.blogspot.com/-HdFGyfRgpCI/XqUx46khu6I/AAAAAAAACIE/ODfjLdGcWiATpEiAIsihhjISX9eLH2eiQCPcBGAsYHg/s320/DSC_0357.JPG)

# 前言

我第一次接觸OLED-SSD1306是因為高中技藝競賽的題目有用到，當時我覺得這是一個很難的零件，當然我到現在也沒完全了解這個零件，但我覺得網路上可以參考的中文資源太少了，所以我藉著這次製作風扇控制器的關係，還是打了這個文章，還請各位讀者見笑了，內容如果有錯還請各位指導。(本文都是以128\*64解析度的單色OLED來做示範)

<!--more-->

# 認識零件

要了解一個零件，最直接且不會出錯的方式就是找Data Sheet來看，所以我們要來簡單的看一下SSD1306的Data Sheet。

首先是電源的部分，雖然Data Sheet上表示IC logic要1.65~3.3V，且面板要7~15V，但我實際使用的OLED模組都是只要一個3.3V就可以驅動了，而我也沒試過其他的電壓，所以這部分可能會因為每個廠商製作的模組而有差異，一定要查清楚。

然後是傳輸界面，SSD1306共有3種通訊方式可以用，但我這次只介紹I2C的部分，因為我也沒用過其他通訊界面。

![▲ 取自Data Sheet P.6](https://1.bp.blogspot.com/-Vus4lU_2mhk/XqUx4xe6ziI/AAAAAAAACIE/FB4mCvhqngsyGbj77PZO6TSaGucYuMIBQCPcBGAsYHg/s1600/OLED-Power.png)

再來是I2C的部分，文中有講到，**SDA與SCL兩支接腳都要接提升電阻**(上拉電阻)，而我平常都是用4.7KΩ的電阻，上接到電源3.3V的地方。基本上任何I2C零件的SDA與SCL就是要接提升電阻，因為這是I2C原廠設計並規定的，有興趣的話可以查查I2C的Data Sheet，裡面有更詳細的I2C規格與使用。

再來是I2C的地址部分，文中可以看到SSD1306的I2C位置是"011110 SA0+R/W#"。SA0是可以透過D/C# Pin來改變是'1'還是'0'。而R/W#是讀寫控制，'1'的時候是主控端讀取、接收資料；'0'的時候是主控端寫出、發送資料。

總結來說就是SSD1306的位置可能是"0111100+R/W#"或"0111101+R/W#"這兩種，所以要先確認好自己用的零件是哪一個地址。每一個I2C裝置都會有I2C地址，而這些地址是要和I2C原廠購買申請的，而且不同的I2C類型，地址的位元數不同，像新的I2C支援10Bits的地址。

想要更詳細了解I2C的話，可以來看這篇文章 : [I2C: Inter-Integrated Circuit - 成大資工Wiki](http://wiki.csie.ncku.edu.tw/embedded/I2C)

![▲ 取自Data Sheet P.19](https://1.bp.blogspot.com/-aPxLHDc29VY/XqUx4__yVjI/AAAAAAAACIE/CDWH3Y0kDqs04nUPtC-idcvPuOti75mewCPcBGAsYHg/s1600/I2C%25E8%25A6%258F%25E6%25A0%25BC.jpg)

下面這張圖是I2C的傳輸格式，資料一定要照著這樣的格式才行，基本上這個格式是所有I2C零件都通用的。

![▲ 取自Data Sheet P.20](https://1.bp.blogspot.com/-VWS0UUarM2E/XqUx43tkwGI/AAAAAAAACIE/RitqiAn7N1A-5q4ujK2_kyd5ieRKnaZEwCPcBGAsYHg/s1600/I2C%25E5%2582%25B3%25E8%25BC%25B8%25E8%25A6%258F%25E6%25A0%25BC.jpg)

# 運作方式

其實SSD1306的運作方式和點矩陣基本上一樣，可以把它想成一個128\*64的單色點矩陣，只要分別控制這128\*64個點要給'1'還是'0'，就可以控制它顯示的圖樣。

SSD1306的圖形顯示資料記憶體(GDDRAM)由上而下可以分為第0頁~第7頁(共8頁)，每一頁都是一個128\*8 Bits的陣列形式(本文講到有關陣列的部分 ，都是橫行直排、水平\*垂直)，這樣總共就是(128\*8)\*8頁=128\*64 Bits，而我們只要控制這128\*64 個Bits是'1'或'0'，他就會在顯示面板對應的128\*64個點上亮或是滅(可以用指令設定是要共陽型—'0'代表亮或共陰型—'1'代表亮。本文都是以共陰型來做示範)。

所以如果我把偶數頁(含第0頁)的資料全部給'1'，奇數頁的資料全部給'0'，那它就會顯示由上而下的亮暗相間的樣式，也就是由上而下顯示亮8行,暗8行,亮8行...暗8行。又如果我把每一頁的第0排(SEG0)到第63排(SEG63)都給'1'，其餘都給'0'，那它就會顯示左邊全亮，右邊全暗，且剛好是一半。

所以當你想要用SSD1306顯示一個圖案、文字或任何樣式時，只要宣告一個128\*64的二維陣列，並將'1'與'0'排列成它的樣子，然後每一頁每一排一個一個傳進SSD1306就可以成功顯示了。

![](https://1.bp.blogspot.com/-NRn-OHJHdSQ/XqUx4-u_VKI/AAAAAAAACIE/GtLeVmPX3qgexfVkEaD90B_q6EFENi_VQCPcBGAsYHg/s1600/OLED-Page-1.png)

![▲ 取自 Data Sheet P.29](https://1.bp.blogspot.com/-qyutGh_tkdE/XqUx4wtzecI/AAAAAAAACIE/LFob3m3Xn0Evd2_DM3MLQHg_VmtapLz5QCPcBGAsYHg/s1600/OLED-Page-2.png)

# 指令功能

這個部分就像許多的微控制器(MCU)一樣，可以傳送指令給SSD1306，它就會依據不同的指令，變換不同等功能，下面就介紹一些比較重要的指令。

* Set Contrast Control(設定對比度控制)
  * SSD1306可以設定256階段的對比度。這個指令要用到2個Byte，第一個Byte是(81)h，用來告訴SSD1306你要設定對比度了；第二個Byte全都是自定位元，看你想設定多高的對比度，就寫入多高的數值。例如寫入(FF)h就代表設定為最高對比度，而第二個Byte為(7F)h時為重置對比度。
* Entire Display ON(全部顯示ON)
  * (A4)h : 恢復到GDDRAM的內容顯示，輸出會依照GDDRAM的內容。
  * (A5)h : 全部顯示ON，不論GDRAM的內容為何，OLED顯示全亮。
* Set Normal/Inverse Display(設定正常/反向顯示)
  * (A6)h : 正常顯示(共陰型顯示)，GDDRAM中的'0'代表暗，'1'代表亮。
  * (A7)h : 反向顯示(共陽型顯示)，GDDRAM中的'0'代表亮，'1'代表暗。
* Set Display ON/OFF(設定顯示開關)
  * (AE)h : 關閉顯示(睡眠模式)，此時OLED不會顯示任何東西。
  * (AF)h : 開啟顯示(正常模式)，此時OLED會依照GDDRAM或是其他指令來顯示。

![▲ 取自Data Sheet P.28](https://1.bp.blogspot.com/-4-fpQZQO2fo/XqUx42TnoyI/AAAAAAAACIE/Iz3q3W1GH9UW_RWO8Ue1Dc6S23H8wSBKQCPcBGAsYHg/s1600/OLED-Command.png)

最後則是廠商附上的初始化步驟，也就是在SSD1306一開始啟動時設定一些基本的功能，只要照著下表達步驟丟指令就可以了。

![▲ 取自Data Sheet-Application Note P.5](https://1.bp.blogspot.com/-1wjmZn1XG6s/XqUx4z8hZLI/AAAAAAAACIE/qBHTNl5xcbYq5r9hybfM5IXQO2DvnHDVgCPcBGAsYHg/s1600/OLED-In.png)


# 參考資料: 

 * [OLED-SSD1306 Data Sheet](https://www.google.com.tw/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiRquzen9vXAhXGkZQKHacKC8YQFgglMAA&url=https%3A%2F%2Fcdn-shop.adafruit.com%2Fdatasheets%2FSSD1306.pdf&usg=AOvVaw295piYr-tzt5CnBsNVzI7X)
 * [I2C: Inter-Integrated Circuit - 成大資工Wiki](http://wiki.csie.ncku.edu.tw/embedded/I2C)

# 相關文章

* [\[專案:電腦風扇控制器-1\] 構想與零件選用](/posts/fenctrl-1/)
* [\[專案:電腦風扇控制器-2\] OLED-SSD1306零件簡單介紹](/posts/fenctrl-2/)(本篇)
