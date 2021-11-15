title: '[教學:3D列印-1] 使用3D列印機的步驟'
author: ZiTe
tags:
  - 3D列印
  - 教學
categories: []
date: 2017-03-25 13:04:00
---
![](https://1.bp.blogspot.com/-yLX9tUKZ2EI/Xq0AMyYj-wI/AAAAAAAACKk/0y5YFIsiqIIhFeFGAvNYhZKxCM8P1Hv-QCPcBGAsYHg/s400/DSC_0084.JPG)

使用3D列印機的步驟主要有3項:  

1. 取得3D模型
2. 將3D模型進行切片
3. 開始列印

看起來很簡單,也確實很簡單.但要如何完成以上的3個步驟呢?  

<!--more-->

# 第一步-取得3D模型

目前全世界較通用的3D模型是STL檔,而STL檔的取得方式主要有3種:

1. 上模型分享網站下載其他人分享的3D模型
2. 自己使用3D繪圖軟體畫3D模型
3. 利用3D掃描機將實體掃描成3D模型檔

第一種最簡單,什麼都不用買,什麼都不用學,只要花點時間上網找自己想要的就好了.以下我列出幾個自己覺得很不錯的3D模型分享網站.

* [Thingiverse](http://www.thingiverse.com/) (我自己最常用的網站)
* [Cults](https://cults3d.com/)
* [Pinshape](https://pinshape.com/)
* [Instructables](http://www.instructables.com/)

但有時候網路上都找不到自己想要的模型怎麽辦?這時就只好自己畫啦.現在市面上有許多3D繪圖軟體,也有很多是免費使用的,一下列出幾項常見的3D繪圖軟體.

* [SketchUp](https://www.sketchup.com/zh-TW) (Google的軟體.有**免費**的版本,也有免下載的**網頁版**.使用簡單,功能豐富.**是我第一個會用的3D繪圖軟體**)
* [Blender](https://www.blender.org/) (**免費開源**的自由軟體.由於是開源軟體,其功能其實已經遠遠超過單純的3D繪圖軟體了,可以做到渲染.動畫.物理模擬等功能,可以說是最強大的免費3D繪圖軟題)
* [123D](http://www.123dapp.com/) (由世界知名的Autodesk公司開發的**免費線上**軟體,可以說是入門的最佳選擇)
* [Inventor](https://www.autodesk.com/products/inventor/overview) (一樣是由世界知名的Autodesk公司開發,功能強大的**付費專業**軟體)
* [SolidWorks](http://www.solidworks.com/) (由Dassault Systemes旗下的SolidWorks公司開發.和Inventor一樣是**付費專業**軟體,功能非常強大)

![我使用SolidWorks進行我高中專題的模型繪製](https://2.bp.blogspot.com/-DRYqrZ8eTQM/Xq0AM2wsKcI/AAAAAAAACKk/yav1v8efY0Yn2UjABhAuKvnVlNaleuecQCPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%252811%2529.png)

還有一種是使用3D掃描機實體物件掃描成3D模型檔案,但這部分需要有相關設備,所以暫時先不討論.

# 第二步-將3D模型進行切片

由於3D列印機的成型方式就是將許多的2D平面堆疊起來,最後形成3D模型,所以要有一個軟體幫忙把3D模型切成一層一層,一片一片的,而這種軟體就叫做切片軟體.以下列出幾項常見的切片軟體.(**皆免費**)

* [Slic3r](http://slic3r.org/) (目前我最喜歡也最熟悉的切片軟體)
* [Cura](https://ultimaker.com/en/products/cura-software) (我第二熟悉的切片軟體)
* [KISSlicer](http://www.kisslicer.com/) (我目前還沒深入研究的切片軟體)

![切片軟體-Slic3r](https://1.bp.blogspot.com/-HHCmE1juXrU/Xq0AM3_9iuI/AAAAAAAACKk/bEf7eQFFEs8QAf3hH7ZK5ZzHe88gbsH0ACPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%25288%2529.png)

# 第三步-開始列印

將3D模型切片好後,就可以開始進行3D列印.控制3D列印機的方式主要用2種.

1. 使用USB與電腦進行連接,再用控制軟體進行控制,並將要列印的檔案傳輸給3D列印機.控制軟體通常是[Repetier-Host](https://www.repetier.com/documentation/repetier-host/).(**Fika就是這種)**
2. 用3D列印機上的操控界面進行控制,並將要列印的檔案放在SD記憶卡中插入3D列印機的讀卡槽.

![](https://4.bp.blogspot.com/-uxd2isu8kyQ/Xq0AM55yoqI/AAAAAAAACKk/Qbvoef1C1HANE-vuWRpMYEwf8qkOo8BjwCPcBGAsYHg/s1600/DSC_0194.JPG)

當然市面上也有這兩種方法都可以使用的3D列印機.(像我自己的Graber i3)

以上就是使用3D列印機的步驟,也是這個系列的第一篇文章,未來還會更詳細的進行相關教學.敬請期待!謝謝!

# 相關文章

* [\[教學:3D列印-1\] 使用3D列印機的步驟](/2017/03/3dp-1-step/)(本篇)
* [\[教學:3D列印-2\] Slic3r 切片軟體教學](/2017/05/3dp-2-slic3r/)
* [\[教學:3D列印-3\] 常用G-code指令解讀](/2017/05/3dp-3-gcode/)