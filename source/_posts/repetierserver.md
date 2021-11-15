title: 用Raspberry Pi架設Repetier-Server
author: ZiTe
tags:
  - 3D列印
  - 教學
categories: []
date: 2016-03-17 13:10:00
---
![](https://1.bp.blogspot.com/-WSWJJKMLNUY/Xq0B2YDEbtI/AAAAAAAACKw/qQ71E0EYP186q4UbzQ4uBCUvtG9yHKzDACPcBGAsYHg/s400/_DSC0320.jpg)

以Raspberry Pi-樹莓派來用區域網路控制遠處的3D列印機進行列印工作

<!--more-->

# 步驟1-下載並燒錄系統映像檔

1. 到[Raspberry Pi官網](https://www.raspberrypi.org/)下載Raspbian映像檔，並以[Win32diskimager](https://sourceforge.net/projects/win32diskimager/)軟體燒錄映像檔至MicroSD卡内。
2. 詳細燒錄教學請參考[硬Pi製作](https://sites.google.com/site/raspberrypidiy/home)網站的教學。

# 步驟2-基本Raspbian系統設定與連上網路

1. 將燒好的SD卡插入Raspberry Pi，並將Raspberry Pi接上鍵盤、滑鼠、螢幕、網路線和電源，開機後等待進入X-Windows(GUI)畫面，確定好Raspberry Pi的IP位置。
2. 建議可以開啓SSH和遠端功能，方便日後連線使用。
3. 詳細查詢IP位置的方法請參考[葉難](http://yehnan.blogspot.tw/search/label/Raspberry%20Pi)老師網站的教學。使用SSH和遠端的方法請參考[硬Pi製作](https://sites.google.com/site/raspberrypidiy/home)網站的教學。
    

# 步驟3-下載並安裝Repetier-Server

1. 在LXTerminal文字指令視窗中鍵入以下指令並等待Raspberry Pi下載完成。 
```
wget http://download.repetier.com/files/server/debian-armel/Repetier-Server-0.80.0-Linux.deb
```
2. 在LXTerminal文字指令視窗中後鍵入以下指令並等待Raspberry Pi安裝完成。(可能需要一段時間)
```
sudo dpkg -i Repetier-Server-0.80.0-Linux.deb
```
    

# 步驟4-在網頁上連接Repetier-Server

1. 將Raspberry Pi使用USB接上你的3D列印機。
2. 在瀏覽器上打上步驟2找到的Raspberry Pi的IP位置，並在尾端加上\[:3344\]。
    * Ex : 192.168.16.101:3344
3. 在頁面中選擇\[+添加新打印機\]，並照著步驟新增你的3D列印機。
4. 其中\[設備/端口\]要選擇到你連接3D列印機的USB端口。
    * Ex : /dev/serial/by-id/usb-Arduino\_\_www.arduino.cc\_\_0042\_754393334353512002D2-if00
5. 等設定步驟都完成後就可以開始在網頁上控制與列印。
    

![](https://3.bp.blogspot.com/-0GQ1UJAOIdI/Xq0B2Sqb8AI/AAAAAAAACKw/r8iThmv55dg8_64m_Y2Zds-uLFgEuwDXwCPcBGAsYHg/s1600/DSC_0126.JPG)

  

# 步驟5-在Repetier-Host上連接Repetier-Server

1. 按下Repetier-Host中的\[列印機設定\]。
2. 在\[連線方式\]中選擇\[Repetier-Server 伺服器\]。
3. 在\[IP位置\]中打入Raspberry Pi的\[IP位置\]
4. 在\[通訊埠\]中打入預設通訊埠\[3344\]。
5. 按下\[連線金鑰(API Key)\]後方的\[獲取金鑰\]，即會開啓網頁版控制器，並顯示你的API金鑰。(API Key由32位英數字組成)
6. 在\[連線金鑰(API Key)\]貼上你在網頁版控制器取得的\[連線金鑰(API Key)\]。
7. 按下\[連線以便繼續\]，等待連線完成。
8. 選擇一種\[列印機設定\]，按下\[OK\]完成設定。
9. 在Repetier-Host主頁面按下左上角的\[連線\]，等待3D列印機連線完成即可控制與列印。
    

![](https://1.bp.blogspot.com/-39PlgH-Yccc/Xq0B2Vob6rI/AAAAAAAACKw/_y419lTcZRMQDJERkMcD8cuOXsrf4rFEACPcBGAsYHg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E6%2593%25B7%25E5%258F%2596%25E7%2595%25AB%25E9%259D%25A2%2B%25287%2529.png)

# 相關網站：

1. [Raspberry Pi官方網站](https://www.raspberrypi.org/)
2. [台灣Raspberry Pi](https://www.raspberrypi.com.tw/)
3. [硬Pi製作](https://sites.google.com/site/raspberrypidiy/home)
4. [葉難](http://yehnan.blogspot.tw/search/label/Raspberry%20Pi)