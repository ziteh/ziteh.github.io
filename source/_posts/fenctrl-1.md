---
title: '[專案:電腦風扇控制器-1] 構想與零件選用'
author: ZiTe
tags:
  - 電子電路
  - DIY
categories: []
date: 2017-11-25 15:30:00
comments: true
toc: true
draft: false
aliases : ["/2017/11/fenctrl-1/"]
---
# 前言

2017年10月初，我在虎尾科大裡加入了一個我也不知道算不算社團的社團，叫做Dream Maker築夢者，不難看出和自造者有很大的關係。我加入他們並成為所謂的第二屆黃豆學習生，而成為黃豆學習生有一個重要的任務就是要在12月底前完成並發表一個專案，所以我就開始執行這個電腦風扇控制器的製作計劃。

<!--more-->

# 發想

我的電腦總共裝了5個系統散熱風扇，雖然說它們其實並不會吵，但平常用電腦只是上上網、看看影片之類的，也不用這麽多風扇，感覺有點浪費電，畢竟我現在在外租屋，一度電是5塊錢，要盡量的節能省碳。所以我之前就有想要做一個風扇控制器，可以個別調整風扇的轉速和電源，而現在剛好有個機會可以讓我把它實作出來。

# 製作概要

我的主控一樣會使用FPGA，程式使用VHDL，畢竟這些還是我目前最熟悉的方案。控制風扇轉速的部分很簡單，就用FPGA直接輸出PWM訊號就好了，而風扇電源的部分我會使用繼電器的方式來控制，雖然我之前沒用過繼電器，的相關知識還是有的。而顯示介面我選擇用128x64的單色OLED，介面操作的方式就用最簡單的4個按鈕。而整個電路都要塞入電腦的5.25前面板的空間內，且最多可以控制6個風扇。

# 零件列表

|名稱|型號規格|數量|
|--- |--- |--- |
|FPGA|EP2C5T144C8N TQFP-144|1|
|FPGA配置晶片|EPCS4I8|1|
|FPGA轉接板|--|1|
|FPGA燒錄座|10Pin 公牛座|2|
|石英震盪器|有源 48MHz|1|
|繼電器|LEG-12|6|
|穩壓晶片|LM1117S-3.3|1|
|大按鈕+蓋|--|4|
|Reset按鈕|--|1|
|OLED|SSD1306 128x64 單色 I2C|1|
|按鈕接地電阻|1KΩ|5|
|按鈕防彈跳電容|0.1μF|4|
|I2C提升電阻|4.7KΩ|2|
|繼電器電晶體|?|6|
|繼電器電阻|1KΩ|6|
|繼電器二級體|1N4004|6|
|風扇接座|4Pin 莫士接座|6|
|總電源接座|大4Pin|1|
|OLED接座|4Pin 杜邦母座|1|
|電源去耦電容|10μF|7|
|總電源開關|雙刀單擲|1|
|PWM 風扇|12V 4Pin|2|
|穩壓電路電容|?|?|
|保險絲|?|?|
|電源指示LED|SMD|3|
|LED電阻|1KΩ|3|

## FPGA部分


FPGA我選擇使用Altera Cyclone II EP2C5T144C8N TQFP-144。核心電壓(VCCINT)使用1.2V，接腳電壓(VCCIO)我使用3.3V，運作頻率為48MHz。配置晶片我使用EPCS4I8。到時候會有JTAG和AS兩種燒錄座。


這個部分我覺得比較會有問題的是電路設計的部分，因為我之前都是用現成的FPGA實驗板來做東西，第一次自己設計FPGA的完整電路，可能有很多電氣的觀念要注意。還有就是我之前也沒有用過FPGA的配置晶片，但配置晶片的可以參考的電路有很多，只要照著Data Sheet內的電路做應該就沒問題了。

![▲ EPCSxx AS模式接線圖。出自原廠Data Sheet P.4-8](https://1.bp.blogspot.com/-_z6wF1bGvPk/XqU9VsHukvI/AAAAAAAACIQ/sBOHtZP4b943GplE-Fv078OiH7xfVhIzwCPcBGAsYHg/s1600/EPCSxx-AS.jpg)

## 繼電器部分


繼電器我選擇使用LEG-12，它要用12V的電壓才能驅動，所以要搭配電晶體電路才能運作，並加上一個整流二極體1N4004來保護電路免於受到繼電器線圈的反電動勢破壞。

繼電器的電路應該不會有什麼問題，可能要比較注意的是電晶體和耐壓的部分。

![▲ LEG-12 繼電器電路](https://1.bp.blogspot.com/-JPalLluSf-4/XqU9Vmvjx0I/AAAAAAAACIQ/P2kRCuOvz6waD4NgMXer7_flv_Dn06nHQCPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%25284%2529.png)

## 穩壓晶片部分


我的3.3V穩壓晶片使用LM1117S-3.3，另外還有像是AMS1117、AMC1117之類的穩壓晶片應該也差不多。1.2V的穩壓晶片我還沒選擇好。


穩壓晶片我之前也沒有用過，但照著網路上找到的電路接應該就可以了，穩壓晶片的電路都很簡單，就幾個電容而已，但可能要注意的就是電容的規格。

![▲ LM1117S的固定電壓電路。出自原廠Data Sheet P.2](https://1.bp.blogspot.com/-JzMDgTaj7jE/XqU9VuiTtmI/AAAAAAAACIQ/l31GSXBDfVwC_a4AWMRfBeMETlzaJV6agCPcBGAsYHg/s1600/LM1117S.jpg)

# 參考資料

這些是我在網路上找到並覺得很有參考價值的資料。如有覺得連結侵犯的您的權益請告知，謝謝。

## 網站 :
1.  FPGA : [Altera Cyclone II 系列官方介紹](https://www.altera.com.cn/products/fpga/cyclone-categories/cyclone-ii/support.html#General_Power_Supplies)
2.  FPGA電路 : [Altera Cyclone II EP2C5T144 FPGA Mini Development Board – FZ0697](http://artofcircuits.com/product/altera-cyclone-ii-ep2c5t144-fpga-mini-development-board-fz0697)
3.  繼電器 : [Cooper Maa :](http://coopermaa2nd.blogspot.tw/2011/03/lab21-12v.html?m=1) [Arduino 筆記 - Lab21 用繼電器控制 12V 風扇](http://coopermaa2nd.blogspot.tw/2011/03/lab21-12v.html?m=1)
4.  穩壓晶片 : [小狐狸事務所 :](http://yhhuang1966.blogspot.tw/2015/07/ic.html) [關於電源穩壓 IC](http://yhhuang1966.blogspot.tw/2015/07/ic.html)
5.  LM1117 : [3.3V VOLTAGE REGULATOR](http://www.electronics-lab.com/project/3-3v-voltage-regulator/)
6.  LM1117S : [LM1117S-3.3](http://blog.naver.com/PostView.nhn?blogId=telius07&logNo=40034037959)
7.  PWM風扇 : [呂阿谷 : PC散熱風扇之研究三：PWM風扇進階研究](http://luyaku.pixnet.net/blog/post/341175399-pc%E6%95%A3%E7%86%B1%E9%A2%A8%E6%89%87%E4%B9%8B%E7%A0%94%E7%A9%B6%E4%B8%89%EF%BC%9Apwm%E9%A2%A8%E6%89%87%E9%80%B2%E9%9A%8E%E7%A0%94%E7%A9%B6)

## Data Sheet :
1.  Cyclone II : [Cyclone II Device Handbook - Altera](https://www.google.com.tw/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwjnwZmjndvXAhVONpQKHVFaBLQQFgglMAA&url=https%3A%2F%2Fwww.altera.com%2Fliterature%2Fhb%2Fcyc2%2Fcyc2_cii5v1.pdf&usg=AOvVaw0RzIUFQt3lfLf4CxeIyVNA)
2.  EPCS4I8 : [Serial Configuration (EPCS) Devices Datasheet - Altera](https://www.google.com.tw/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwjgxv6PntvXAhUEFJQKHbNKB58QFgglMAA&url=https%3A%2F%2Fwww.altera.com%2Fliterature%2Fhb%2Fcfg%2Fcyc_c51014.pdf&usg=AOvVaw3gRe3H3TqbR6BwOBfJI2Fh)
3.  LM1117S : [LM1117S Datasheet(PDF) - HTC Korea TAEJIN Technology Co.](https://www.google.com.tw/url?sa=t&rct=j&q=&esrc=s&source=web&cd=5&ved=0ahUKEwjD96HHodvXAhVEKJQKHeVFAHUQFghFMAQ&url=http%3A%2F%2Fwww.alldatasheet.com%2Fdatasheet-pdf%2Fpdf%2F177530%2FHTC%2FLM1117S.html&usg=AOvVaw1sJsJP7hkOuazaewM7HDWB)
4.  LEG-12 : [RAYEX ELECTRONICS](https://www.tme.eu/en/details/leg-12/miniature-electromagnetic-relays/rayex-electronics/) [](https://www.tme.eu/en/details/leg-12/miniature-electromagnetic-relays/rayex-electronics/) [LEG-12](https://www.tme.eu/en/details/leg-12/miniature-electromagnetic-relays/rayex-electronics/)
5.  SSD1306 : [SSD1306](https://www.google.com.tw/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiRquzen9vXAhXGkZQKHacKC8YQFgglMAA&url=https%3A%2F%2Fcdn-shop.adafruit.com%2Fdatasheets%2FSSD1306.pdf&usg=AOvVaw295piYr-tzt5CnBsNVzI7X)
6.  1N4004 : [1N4001 datasheet - Adafruit Industries](https://www.google.com.tw/url?sa=t&rct=j&q=&esrc=s&source=web&cd=4&ved=0ahUKEwi4tOnzn9vXAhUBuZQKHc9mAJEQFgg9MAM&url=https%3A%2F%2Fcdn-shop.adafruit.com%2Fdatasheets%2F1N4001-D.PDF&usg=AOvVaw021F3iEmxkk38CKMcf287Z)

# 相關文章

* [\[專案:電腦風扇控制器-1\] 構想與零件選用](/2017/11/fenctrl-1/)(本篇)
* [\[專案:電腦風扇控制器-2\] OLED-SSD1306零件簡單介紹](/2017/12/fenctrl-2/)
