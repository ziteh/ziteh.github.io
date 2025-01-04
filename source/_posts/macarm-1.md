---
title: '[心得:機械手專題-1] 製作過程'
author: ZiTe
tags:
  - 電子電路
  - 心得
  - 3D列印
categories: []
date: 2017-08-02 12:30:00
comments: true
toc: true
draft: false
# aliases : ["/2017/08/macarm-1/"]
---
![](https://3.bp.blogspot.com/-a1H0Poj7P-E/XqY2wqNljhI/AAAAAAAACJk/VVi0FlUmY1s8Cn8DFY7u0RTMGbuZe-v2wCPcBGAsYHg/s400/DSC_0421.JPG)

# 起源

電子機械手義肢是我讀高職資訊科的畢業專題，雖然說是三年級的畢業專題，但我在一升二年級的暑假時就已經對此專題進行一些初步的構想，也在二年級的寒假時正式開始了這項專題。當時我就開始將我所有的想法都整理起來，包括列出要加入的功能、要買的零件、要做的實驗和可以參考的資料等。

<!--more-->

![我在Evernote上進行專題製作的規劃](https://2.bp.blogspot.com/-C0HAyHcElm8/XqY2wicxB-I/AAAAAAAACJk/1paKGlkhEUE3tzT6-Dv2HmWnyEY1Il6wwCPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%25281%2529.png)

# 主控晶片

當時大家都在學Arduino，但我的專題是從一開始就完全不考慮Arduino的，我第一個考慮的是Raspberry Pi-樹莓派，但後來我覺得我的專題並不適合用RPi製作，因為它無法展現出RPi的特別處。後來因為我參加全國技能競賽的關係，我接觸到了PIC單晶片，所以我就決定使用PIC來做。

但馬上就發現問題了，我使用的PIC18F4550的CCP(PWM)只有2個，但我的機械手至少要5個PWM輸出才能分別控制5個手指的伺服馬達，雖然我後來有找到PCA9685-I2C通訊的16路PWM輸出晶片，但我用來2個禮拜的時間都沒辦法成功使用I2C。這時我也已經在準備工業類技藝競賽了，所以我就想直接用CPLD/FPGA當主控就好了，PWM輸出要幾個就寫幾個，多方便呀!

![我使用的FPGA-EP3C16Q240C8N](https://3.bp.blogspot.com/-DaoyMW_TFMs/XqY2wmUHArI/AAAAAAAACJk/A_hs_4y25OkQ8UHSUygb1hFoq88iRoWsgCPcBGAsYHg/s1600/DSC_0010.JPG)

# 類比訊號

接下來我用了一天的時間就完成5個PWM的部分，但下一個問題馬上就浮現出來了。我手指的動作是使用彎曲可變電阻來感應的，因為是可變電阻，所以我就設計了一個分壓電路，這樣我只要用ADC就可以讀取彎曲可變電阻的彎曲程度了，但一般的ADC都只有一個類比的讀取接腳，我卻有5個彎曲可變電阻，這樣一來就要買5個ADC。但8-bits解析度的ADC輸出會有8個腳，我用5個ADC的話，就要在CPLD/FPGA上使用40支腳來輸入資料，這樣不止成本提高(5個ADC)，耗用的主控資源也很多。

雖然也有串列輸出的ADC，但我真的很怕我買來不會用。後來我就想到用MUX(多工器)輪掃的方式進行讀取，先讀第一個彎曲可變電阻的資料，存在主控裡，再讀第二個。這是我覺得最好的方法來，但現在問題又來了，一般的MUX都是只能用數位訊號的，所以我要特別去找可以傳類比訊號的MUX來用，找來找去就只有找到一個CD4067而已。零件和想法都有了，我馬上進行製作。

製作時比較麻煩的是輪掃的速度，太慢的話機械手會動得卡卡的，太快的話會超過CD4067切換的最高操作頻率，造成動作不正確。再來就是我要將ADC讀到的電壓轉換為PWM訊號，這種數學的東西我實在不是很擅長，想了很久才列出一個可以完美轉換的公式出來。

![上面的IC是CD4067B，下面的是ADC0804](https://4.bp.blogspot.com/-ecA2RqOjk8o/XqY2wng896I/AAAAAAAACJk/0b71jY_L64s9Ei4v5ZgV2V-LMIEzThB4ACPcBGAsYHg/s1600/DSC_0191.JPG)

![輪掃輸入資料架構圖](https://2.bp.blogspot.com/-90d38FLYXPs/XqY2wkksL6I/AAAAAAAACJk/OQ8wiswQmt43n4sLdpu_ZwpURwUmIvYUACPcBGAsYHg/s1600/01-2.png)

# 手掌模型

程式都完成後，就要開始進行手的製作了，一開始我還打算用塑膠瓦楞板做，但這樣的話實在太累又太醜，所以我決定用3D列印的。一開始我是使用網路上別人做好的手來印的，但後來覺得我還是自己畫會比較好，所以我就開始進行3D繪圖的準備。當時的我只會用SketchUp而已，但我連一個指節都畫不出來，實在太難畫了。後來我就開始學習SolidWorks，就花2~3小時做它內建的教學，再上Youtube看看影片，然後就開始畫了，我大慨花了2個禮拜的時間畫完我所有的零件。

畫好後就要開始進行3D列印了，我的手都使用科內的Fika印的，然而零件非常的多，所以我就一邊印一邊深入了解3D列印的知識。從一開始一根手指要印1小時到後來能用15分鐘就印出相同品質的成品出來。雖然說後來我還是硬給它加速，讓我的手印得很醜，但Fika其實可以印得很好也比很多機器要快很多了。

![使用Solidworks畫手掌](https://3.bp.blogspot.com/-nZm2IAJFK3o/XqY2wvx7_XI/AAAAAAAACJk/IWZ3e9uB4rwuJ2XDRxHudbxXycuqhms0wCPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%252811%2529.png)

![我用Fika 3DP印出我畫出來的模型](https://1.bp.blogspot.com/--S6cfCC1Tc8/XqY2wuciW9I/AAAAAAAACJk/VJqQzbqpZxARY-IjSZetKYrCwTAsP829gCPcBGAsYHg/s1600/DSC_0065.JPG)

# PCB電路板

再來就是硬體電路的部分了，因為有了工業類技藝競賽的電路板陰影，所以我決定用PCB電路板。之前在我比完全國技能競賽-北部分區賽後，魏新展老師有教我用Altium Designer和科內的電路雕刻機，所以我就憑著記憶和上網找的教學來畫電路板。因為是第一次畫比較複雜且有實用性的電路板，所以設計過程錯誤很多，還整個打掉從畫了好幾次。也有一些零件是找不到零件庫的，最後我就照著網路上的教學，自己畫零件出來用。就在一次又一次的重畫後，終於畫好了。

但電路雕刻機的操作步驟比較複雜且麻煩，錯一步就刻不出來，而且也很難知道是錯哪一步，後來向科主任請求幫忙後，主任表示會請之前學校唯一會用雕刻機的老師回來教我。而這位老師就是許老師，老師教完我雕刻機的使用方式後還順便給了我一些參加科展的建議。

![使用Altium Designer設計電路板](https://2.bp.blogspot.com/-anW5W-SJ0nI/XqY2wh75_TI/AAAAAAAACJk/ekZYM0FpfSEReyKOBpbv3B6toVnRrAgowCPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%252827%2529.png)

![使用電路雕刻機製作電路板](https://4.bp.blogspot.com/-ley8gWsz504/XqY2wtguVrI/AAAAAAAACJk/aos_QdqHtlg-JO3ad8gXyHK-4L7fcNC8gCPcBGAsYHg/s1600/DSC_0217.JPG)

# 組合

此時是北二區科展的3天前，正當我覺得所有東西都準備齊全，只要把它們都組在一起就好的時候，出來一個超級大問題 : 我的程式無法在我要用的CPLD上通過編譯，因為我之前寫程式的時候都是用我技藝競賽時的FPGA，但我想要讓我的機械手可以斷電後記憶資料，所以一開始我就是以CPLD為設計基準。

我以為CPLD和FPGA在編譯與程式編寫上沒有差異，但在後來研究編譯錯誤的原因後發現，CPLD只適合用來做簡單的組合邏輯電路，時序邏輯電路只要稍微多一點或複雜一些就會有問題，所以現在主控晶片都是FPGA了，而我也不可能改程式了，當時只好馬上重新畫一個PCB後刻出來，然後將所有東西組合起來再測試調整一下。

![全部組合起來進行測試](https://1.bp.blogspot.com/-a1_4GbBg_94/XqY2wvotBAI/AAAAAAAACJk/Mdd81OxJJL4Cx4SAT0rgateUckHBUSgbwCPcBGAsYHg/s1600/DSC_0287.JPG)

# OLED顯示

這時我已經比完北二區的科展，要為全國科展做準備，我就想了很多可以加入的新功能，而OLED是我覺得比較容易做到的，因為只要把技藝競賽的程式複製過來就好了，而我只要改變顯示的內容就好了，所以我就趁著統測完到畢業的這段時間完成這個功能。OLED顯示的是GUI(圖形使用者介面)，因為我希望不要只是用LED來顯示，而是有文字和圖形的操作介面，這樣才方便，一目了然。

![使用OLED顯示操作介面，並且用4個按鈕控制](https://1.bp.blogspot.com/-t-zIdhGLmyQ/XqY2wppXSHI/AAAAAAAACJk/77HLyBv6k10Jsnl3kMY3C6HNFVEQrptVQCPcBGAsYHg/s1600/DSC_0356.JPG)

# 成品展示

<div style="text-align: center;">
<iframe allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" height="315" src="https://www.youtube.com/embed/wEU1gOaUeIQ" width="600"></iframe>
</div>

# 後記

雖然我還有很多功能是已經想好也買好零件了，但後來還是沒有加入的，但我做這個專題也有些累了，就看看之後有沒有機會再把這個機械手拿出來，到時候再將那些功能加進去。

還有就是這個專題是完全開源的! (雖然我還沒想好要用什麼開源協定)。從一開始我就打算將此專題的所有資料開源，讓世界上的所有人都可以不用經過任何許可就可以自由的使用、修改再分享於網路上，我真的希望我今天做的這項專題可以幫助到人，就算只是讓一些人產生一點點想法也好。

## 電子機械手義肢相關資料下載

1.  [作品說明書](https://drive.google.com/file/d/1zd2PWH0bIP4IHQUnNhcAyapQXLunEQno/view?usp=sharing)
2.  [完整程式、3D模型與電路檔案](https://drive.google.com/file/d/1dCmUrsjqtGno23lvRdPM4k_bl11wRBxb/view?usp=sharing) (Ver1.0的資料夾是我在比北二區科展時的資料；Ver2.0的資料是比全國科展時的資料)

# 相關文章

* [\[心得:機械手專題-1\] 電子機械手義肢製作過程](/posts/macarm-1/)(本篇)
* [\[心得:機械手專題-2\] 科展中的所見所聞](/posts/macarm-2/)
* [\[心得:機械手專題-3\] 這是科展，不是技藝競賽 — 我對科展的反思](/posts/macarm-3/)
