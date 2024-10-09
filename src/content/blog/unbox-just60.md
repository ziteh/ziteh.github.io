---
title: '[開箱]自組60%藍牙機械鍵盤-Just60'
author: ZiTe
tags:
  - 3C
  - 開箱
  - 電子電路
  - DIY
categories: []
date: 2020-03-08 17:38:00
comments: true
toc: true
draft: false
# aliases: ["/2020/03/unbox-just60/"]
---
![](https://1.bp.blogspot.com/-w0fao2bdCd0/XomqiW0jgWI/AAAAAAAACDY/1wlDE8Qf2L0khbeXGFc3ntvnL9kEorsvACKgBGAsYHg/s640/cover.JPG)

# 前言

一直以來我用的都是100%鍵盤（標準104鍵），但是因為右側的控制鍵區（方向鍵、Home和PageUp等）還有數字鍵區讓右手從鍵盤到滑鼠的移動距離非常遠，長時間使用或頻繁移動的話對右手來說非常累。雖然我個人認為最好的方式就是好筆電一樣，在空白鍵下放一個觸控板，這樣指標的動作就交給左右大拇指就可以了，但是觸控板產品實在不多，而就算用手機裝相關App其操作手感也還是比不上一般的筆電，故此想法目前還無法實現。

<!--more-->

因此只好捨棄掉控制鍵區與數字鍵區了，反正這些按鍵對我來說也不是很常用到，因此我必須買一個所謂的60%鍵盤。而我在幾個月前趁著特價以1千左右的價格上網買了把60%鍵盤——RK61，看名字就知道這是61鍵的鍵盤，而且它有藍牙可以無線使用。其實單純用用是沒什麼問題，但是最大的問題是它沒有辦法自定義鍵位、功能或組合鍵——我認為這對小鍵盤，尤其是已經非常精簡的60%鍵盤來說非常致命。

即使60%鍵盤犧牲了控制鍵區和數字鍵區的按鍵，但這些按鍵偶爾還是看會有需要的，但如果無法自訂鍵位的話，就只能照著官方設定的Fn鍵，不能多也不能少。

**「只能讓使用者去適應鍵盤，而不是鍵盤去配合使用者——這絕對不是一個好工具。」**


畢竟工具還是順手的最重要，因此我也開始物色新鍵盤，這次選擇有幾項要求：

1.  60%鍵盤的尺寸。
2.  有獨立（而不是透過Fn鍵等方式）方向鍵。
3.  有獨立（而不是透過Fn鍵等方式）Delete鍵。
4.  可以無線連接，不管是藍牙還是2.4GHz都可以。
5.  USB要是Type-C。（都2020年了，這個要求不過分吧？）
6.  可以全鍵自定義。


經過了幾個禮拜的挑選、查資料和看介紹，我最後選擇了今天的主角——**YDKB Just60**。

# 主要特色

首先Just60的PCB尺寸就是一般的60%鍵盤的大小，其外殼就選GH60的就可以通用了。再來按鍵的部分，它可支援的配列方式有很多種，一般常見的Poker2、Minila或是其它怪異的配列都可以，最多可以一次塞68鍵（就是67鍵的Minila配置再把2U的左Shift變成2個1U的鍵）。


![▲ Just60可以選擇的幾個常見配列例子。](https://1.bp.blogspot.com/-OVeOyDo0MpY/XomqiWb1fSI/AAAAAAAACDY/y1upvLOgm0oftqMRTaO2T1n4YpsBEt3oACKgBGAsYHg/s1600/030819154718_0HHKB-7U.png)

![▲ Just60最多可以一次塞入68鍵。](https://1.bp.blogspot.com/-4sfEmRP-hZM/XomqiTNoU-I/AAAAAAAACDY/FDd_cuUv3XoaEmEMOROJ-RgN_19EABwJACKgBGAsYHg/s1600/Screenshot_2020-03-08%2BYD%2BKeymap%2BBuilder_%25E5%2581%259A%25E5%25A5%25BD%25E7%2594%25A8%25E7%259A%2584%25E9%2594%25AE%25E7%259B%2598_%25281%2529.png)

它有一個[網站](http://ydkb.io/#)可以去設定鍵盤配列和鍵位，可以很方便地預覽並調整。而它也有藍牙4.0連線的功能，理論上是可以連2台裝置做切換。USB也是Type-C接口。所以Just60完全達到我的要求。

![▲ YDKB 鍵盤設定網站。](https://1.bp.blogspot.com/-rjoQsMni2d0/XomqiQJXziI/AAAAAAAACDY/c0W0aSKiM1YdgV9Jxb3T_mkyHnmfqu6EgCKgBGAsYHg/s1600/Screenshot_2020-03-08%2BYD%2BKeymap%2BBuilder_%25E5%2581%259A%25E5%25A5%25BD%25E7%2594%25A8%25E7%259A%2584%25E9%2594%25AE%25E7%259B%2598_.png)

![▲ Just60可設定的配列選項。](https://1.bp.blogspot.com/-R8S1YZ_8Uak/Xomqid2LfBI/AAAAAAAACDY/S_-iNoGmDrcmlLioS6AQmtsT45qXLTxEQCKgBGAsYHg/s640/web2.png)

至於詳細的介紹可以看它們的[官方說明文件](http://help.ydkb.io/doku.php)，裡面寫得非常仔細。

# 設計

因為Just60可以設定的配列很多，所以我也稍微設計了一下要怎麼配才能最適合自己，這時就覺得它可以直接在[網站](http://ydkb.io/#)上完成設定真的很方便。我最後決定是使用一種很奇怪的65鍵配列方式，我也不知道這種配列其他鍵盤有沒有。

因為我要用獨立方向鍵和Delete鍵，所以選用Minila的配置方式就很適合，但我的只有右下角的地方和Minila一樣使用方向鍵；我左上的Backspace還是維持1個2U的長鍵，而不是Minila的2個1U；空白鍵也是維持標準的6.25U而不是3U空白鍵+2個1.25U；再來就是我把左Shift設成2個1U鍵。詳細效果還請見下圖。


![▲ 鍵盤配列-鍵位：Layer0（預設）。](https://1.bp.blogspot.com/-HnVxoNWq4Tk/XomqiQUwLgI/AAAAAAAACDY/joDGGTV3L4crFmLG5LHtbGwWGBNbSjx3ACKgBGAsYHg/s1600/Just60%25E9%2585%258D%25E5%2588%2597-L0.png)

![▲ 鍵盤配列-鍵位：Layer1（長壓Fn/L1）。](https://1.bp.blogspot.com/-0N96-86rf8g/XomqiSXRDQI/AAAAAAAACDY/B-WotcEoBWw-ZywZ92343pBlF6b0KfcugCKgBGAsYHg/s1600/Just60%25E9%2585%258D%25E5%2588%2597-L1.png)

![▲ 鍵盤配列-鍵位：Layer2（長壓LT2）。](https://1.bp.blogspot.com/-TMQaNded3-c/XomqibuIo7I/AAAAAAAACDY/hZZBNA6UYbwCFo4vdco8BI0x-1dAliyTgCKgBGAsYHg/s1600/Just60%25E9%2585%258D%25E5%2588%2597-L2.png)

![▲ 鍵盤配列-鍵帽長度。](https://1.bp.blogspot.com/-3l2EEdT1p2I/XomqiZvaB_I/AAAAAAAACDY/tDXh1f1SJAA-RzWWaWTIULJpu3NEun5FQCKgBGAsYHg/s1600/Just60%25E9%2585%258D%25E5%2588%2597-%25E9%258D%25B5%25E9%2595%25B7.png)

可以看到我設計了3層的鍵位，其中比較特別的有幾點：

1.  我的左Shift是在靠Z鍵的那邊，另一個靠外側的是Fn/L1鍵（長壓時會切至Layer1）。一開始這兩鍵的位置是反過來的（靠Z的是Fn/L1、靠外是左Shift），但用了一下發現怪怪的就換成現在這樣。
2.  我的大寫鎖定鍵（Caps Lock）同時也是LT2鍵。這樣的設定會令快速單擊此鍵是會和平常一樣切換大寫鎖定，但在長壓時會是切換至Layer2的功能。因為我自己很少用到大寫鎖定鍵，但直接把整個大寫鎖定鍵拿掉也不太好，所以就這樣設定，非常方便。
3.  我的ESC在Layer1是按鍵「\`」和「\~」，但我只要按下Shift+ESC就可以直接打出波浪符「\~」了，不用按Fn/L1切去Layer1再按Shift（這樣也是可以打出波浪符，但要多按Fn/L1鍵）。
4.  Layer1的V我直接設定成Ctrl+Shift+V的組合鍵，因為我滿常用的。
5.  Layer1和Layer2的Enter鍵我設定為數字鍵區的Enter（Pad Enter）。這兩個鍵並不一樣，在有些遊戲裡會需要分開（如Arma3），所以我如此設定。
6.  Layer2主要是設定成數字鍵區，因為我打程式或是CAD的時候還是很需要一直打數字。
7.  Layer2的上方數字「1」、「2」和「3」設計為配合[Ditto](https://ditto-cp.sourceforge.io/)可以快速貼上暫存區的前3項。這樣我就可以直接貼上「上個」、「上上個」和「上上上個」複製的內容。

再來就是選擇鍵軸了。難得自己組鍵盤，所以將想來試試看混軸（還有靜音紅軸太貴了）。我把最常按的主鍵區和方向鍵都安排成靜音紅軸，其它就是黑軸。

![▲ 鍵盤配列-鍵軸。紅圈為靜音紅軸；黑圈為黑軸。](https://1.bp.blogspot.com/-_rE4XcJQNiY/XomqidjPRoI/AAAAAAAACDY/HHIaMjzXZGYZAI73pUlgc3kd-fapytH9ACKgBGAsYHg/s640/Just60%25E9%2585%258D%25E5%2588%2597-L0-jj.png)

確定好此鍵盤確實可以完全勝任我的要求後，就是訂購零件並準備製作了。

# 零件

首先定位板的部分，因為我的配列方式為左Shift是2U（1U+1U）長度，而不是標準的2.25U長度，所以要選擇「左移版」的定位板。再來因為我有使用藍牙的需求，而金屬會有屏遮電磁波的效果，會造成無線通訊的訊號不好或連線不穩定，故我選用碳纖維材質的定位板，比起金屬和壓克力材質都還要適合我。

PCB的話，除了鍵軸和鍵軸上的LED外，其它零件都焊接好了。零件基本上都是SMD的，只有一些接頭是插板。它的電池接口有2個位置，可以依照你的外殼來做選擇，已經焊接好其中一個了，還有多附一個接口可以再自行焊接。

在USB Type-C（左上角）的地方有一個紅色的LED燈，用來指示充電狀態。背面有一些RGB-LED燈，但我自己沒有要用就是了。

![▲ PCB部分零件：左移碳纖維定位板（左上）、PCB板（左下）、衛星軸（右上）、LED與電線（右下）。](https://1.bp.blogspot.com/-xdN6uLvNaLA/XomqiRn64YI/AAAAAAAACDY/_U5L_tp--esIBwWZwHCa-5zFxSgzs1GHQCKgBGAsYHg/s1600/PCB-1.JPG)

![▲ Just60 v1.0。](https://1.bp.blogspot.com/-wfUxeq7JFTE/XomqiY0XNRI/AAAAAAAACDY/Fz7k21T3f64SHss6jrkrJzY4Of1fnUmhACKgBGAsYHg/s1600/ZPH_0020.JPG)

![▲ 鍵盤的晶片是ATmega32U4。是DIY鍵盤中常見的AVR微控制器。](https://1.bp.blogspot.com/-N83Ngqdh0Z4/XomqiUt5dgI/AAAAAAAACDY/jUhnNAcmgRU2hwizZlow5r44w3LaMsq7wCKgBGAsYHg/s1600/ZPH_0021.JPG)

![▲ 藍牙模組型號為MDBT40。其中的主晶片是nRF51822，為ARM架構之SoC。](https://1.bp.blogspot.com/-aNc6kkLoYfU/XomqiU8JU0I/AAAAAAAACDY/U1urkZFkcnAW8FZFyKpkRxv3mpfzKqMgwCKgBGAsYHg/s1600/ZPH_0022.JPG)

![▲ USB Type-C。](https://1.bp.blogspot.com/-flWSASasaTQ/XomqiaiBfFI/AAAAAAAACDY/hgcGjSagMIspj7F2diml1UMX5JD32VPOACKgBGAsYHg/s1600/ZPH_0023.JPG)

外殼的部分就隨便找來一個GH60的來用。為了確保藍牙連線的品質，所以和定位板一樣，我選擇非金屬材質的，一方面也比較便宜。

![▲ 外殼零件：GH60黑色塑膠外殼（上）、螺絲（左下）和腳墊貼片（右下）。](https://1.bp.blogspot.com/-OMvy3OWlj2Q/XomqiYa4dnI/AAAAAAAACDY/kL2Mx3Tpi38ekyybztsEaCYEVZBQ49negCKgBGAsYHg/s1600/ZPH_0018.JPG)

鍵軸的部分如同設計的，買了Cherry MX 黑軸和靜音紅軸。這些可是機械鍵盤的靈魂呀～

![▲ 鍵軸：Cherry MX 黑軸20顆（左）、Cherry MX 靜音紅軸50顆（右）。](https://1.bp.blogspot.com/-hf5loEamPrk/XomqiUUC2SI/AAAAAAAACDY/9lcIzODKEbQLaTpWEKAn7ZYAg5D8LZZ_wCKgBGAsYHg/s1600/ZPH_0015.JPG)

# 開始製作

零件到齊後就開始進行製作了。

![▲ 首先將衛星軸插上PCB板。注意鋼條的上下位置要去看賣家或官方的說明。](https://1.bp.blogspot.com/-xoHSSqs-7yc/Xomqia6IvCI/AAAAAAAACDY/aDGvCMJjySsF-qWGXN_qVTs8RLRn0fkOwCKgBGAsYHg/s1600/ZPH_0030.JPG)

![▲ 再來就是插上鍵軸，以定位板固定住位置。](https://1.bp.blogspot.com/-VGZIUeZQ4eY/XomtTFvTtcI/AAAAAAAACDs/64BrsfDRFtcMSlHj2X-ZJM9JqiIqWTFvgCKgBGAsYHg/s1600/ZPH_0032.JPG)

![▲ 確認後鍵軸都有固定好，沒有歪斜或凸起。](https://1.bp.blogspot.com/-HJV7JBhwIzs/XomqiTsCeDI/AAAAAAAACDY/GsIj0h7IHhgcDhV2yNc6qI9UKfsJQ-7yQCKgBGAsYHg/s1600/ZPH_0025.JPG)

![▲ 長鍵也可以先裝上鍵帽來試試看衛星軸的手感如何，可以用潤滑劑來調整。（我是沒潤滑）](https://1.bp.blogspot.com/-tAKJ5DeBlfw/XomqiRw_CAI/AAAAAAAACDY/9AbKMcV_HPMIE8_ifkpSESPmSxW3M8zCQCKgBGAsYHg/s1600/ZPH_0026.JPG)

等鍵軸都確定好後就可以來焊接了。全部才65個鍵+1個大寫鎖定的LED指示燈——

**「兩分鐘，便可以結束。」**

不過我有段時間沒焊接了，焊點不是非常漂亮。

![▲ 焊接好的焊點。](https://1.bp.blogspot.com/-IzIBpq3Y0u4/XomqiUmseVI/AAAAAAAACDY/zs5H1w_FPLQx19tVILkos1Xq0wSYMsFDQCKgBGAsYHg/s1600/ZPH_0033.JPG)

電池的部分我是買鋰聚電池 3.7V 1300mAh，尺寸為5×37×59（mm，厚、寬、長）。要注意的是要在電池會與PCB板接觸的那面加一個絕緣的塑膠片，以確保PCB上尖刺的Pin腳不會刺穿電池而造成危險。

![▲ 將電池黏在外殼上。](https://1.bp.blogspot.com/-yqDa2JDbNJg/XomqiWIFznI/AAAAAAAACDY/Z8OyJFDj0gEmdtCgjFMt1C9qFdNLeMhYACKgBGAsYHg/s1600/ZPH_0036.JPG)

此時只剩下將它們組合在一起來，可以先接上電腦進行基本的測試，確定都沒問題後再繼續進行組裝。

它的設定檔燒錄方式非常簡單，只要在[網站](http://ydkb.io/#)上設定好鍵盤，然後按右上的下載，就會下載一個「JUST60.bin」設定檔。而鍵盤只要壓著ESC時插上USB線，電腦就會將Just60辨識為磁碟機（或者說隨身碟、硬碟），再將剛剛的設定檔複製進（並取代原設定檔）Just60裡就好了。接下來重新連接電腦就已經完成了。

![▲ 把PCB板接上電池後放入外殼，再以螺絲固定好。可以看到左上角USB處有充電指示燈。](https://1.bp.blogspot.com/-xcs-RhA82G0/XomqiVLvUAI/AAAAAAAACDY/fZdN7c00-pcs3_YZkX7dMDzh0AfNbs1pACKgBGAsYHg/s1600/ZPH_0037.JPG)

最後就剩下鍵帽了。因為我設計的配列太奇怪了，所以標準104鍵的鍵帽沒辦法完全吻合，至少要有Minila的增補鍵。而我這套太豪的鍵帽沒出任何增補鍵，所以我只好先隨便那個鍵帽來將就一下，等未來再買適合的鍵帽。

![▲ 將鍵帽從舊的RK61上拔下，並裝到Just60上。剩下的是因鍵帽長度不同無法裝上的鍵帽。](https://1.bp.blogspot.com/-CvQ_USieS8Y/XomqiZeLpxI/AAAAAAAACDY/UcoqXrxcrBoZOhBsuyqwC17e1QxK5v8rgCKgBGAsYHg/s1600/ZPH_0038.JPG)

![▲ 右下的區域。右Alt、Ctrl、Shift與Delete都先隨便插個鍵帽。](https://1.bp.blogspot.com/-mPKJ6WcESWc/XomqiVQr2kI/AAAAAAAACDY/z2tT089aVrY7bhqKYKElRR7MeuG043AAQCKgBGAsYHg/s1600/ZPH_0040.JPG)

![▲ 左下的區域。左Shift與Fn/L1先隨便插個鍵帽。](https://1.bp.blogspot.com/-36YvfFNV9No/Xomqif6g4PI/AAAAAAAACDY/MaoIavpul6kLaxbXuGN41Nkkm0bxkNEJwCKgBGAsYHg/s1600/ZPH_0041.JPG)

![▲ 最後完成的樣子。](https://1.bp.blogspot.com/-YxJ01pa76k4/XomqiVldN_I/AAAAAAAACDY/7jHNcWlE_2A8OMkb97E8Dt5BwxV_pmXCACKgBGAsYHg/s1600/ZPH_0039.JPG)

# 結語

這是我的第3把機械式鍵盤，第一把是keychron K1（104鍵版），再來是RK61，接下來就是本次介紹的Just60。我使用機械式鍵盤的時間並不長，第一把keychron K1是大概一年前買的，目前也有很多機械式鍵盤的東西並不是很清楚。但這次組了這把Just60我非常滿意，估計它可以陪我好一陣子了。

至於成本方面，我大概整理了一下，各位可以參考看看：


品名 |單價(NTD) |數量 |總價(NTD)
-|-|-|-
PCB板|1200|1|1200
左移碳纖維定位板|390|1|390
2U衛星軸組|22|3|66
6.25U衛星軸組|50|1|50
GH60黑色塑膠外殼|135|1|135
鋰聚電池 3.7V 1300mAh|150|1|150
Cherry MX 黑軸|10|20|200
Cherry MX 靜音紅軸|17|50|850

**總價為：$ 3041 NTD**

以上價錢還不含鍵帽。以機械式鍵盤來說，不算很貴但也不便宜了。主要還是靜音紅軸一顆17$實在很貴，還有就是碳纖維的定位板也是不便宜。PCB板的話，因為實在懶得自己去找廠商洗板子、自己焊SMD，所以我也認了。

總而言之，從我組好此鍵盤，到我寫完這篇文章的2個多月，我非常滿意！

另外，如果想要參考我使用的配列或鍵位設定的話可以[點此連接](http://ydkb.io/?just60-10343521#H4sIAAAAAAAAA+2Ta4obQQyEL1Q/Wm/1Wcze/xop9djJsi8CyQ8vLAI1Y7dqpE81t9vNbQckU/rkOnnBEUgUGht8FIEoxCAOiRfcJDF3WbShCypQhRrUoQFNaEEbumELJqwwhRnMYQFLWMEatuELKc7sCje4wwOe8GKRN3wjFkIQijAEOwsE/5egejRiI0cDqUhjUTqS3SeykI3cqIUSlKIM5ahAcbhCNWqzohda0Io2tKMDnWhO3+iNvbAFW7EN27Fn/p3YhU08nJ8TyyIhzieLDFYNBuY4OU+uk/vkYVY2WIeMDNphO3CFWmQjNifx2uiTiXhQYbRGaXRGhRpKuhS5SRhbuCKD089ZnGOeZsU+i34d8+rfFb6vimMERnHY14a4VOsCPpD/IMdr4ETGLdVZapwiEry2kLKv/ajSNal1Gk517iO9il549MNZP2n0TXCh5xizzGZ7lvvZ5a+E3t+4Sz9iTHr/ZXZ9mCctWFgYPPSHHJ/4OOMz0bOD/VAeF00tEUnzA2IaQDz8TWN9bYX+pOfu5vRxbpzG9C9n+jjGjMpbc8rdmpdN/w/JtxGmsS6kcx6UGl/s7Z/f+P1uDJP1FJ08y40fIh8ReY5OnuXGD5F3RF5+AYB2vzflCQAA)線上預覽，或在[這裡](https://drive.google.com/file/d/1AjuOwTBrjMcKHmRhm-1OQJiBNJLSPhMC/view?usp=sharing)（Google雲端硬碟）下載我的設定檔。

# 同場加映：黑胡桃木鍵帽

因為在買零件的時候被旁邊的廣告影響，覺得黑胡桃木的空白鍵帽好像不錯，所以就買了一個回來看看。裝上後覺得有點特色也不錯。

![▲ 黑胡桃木空白鍵帽（6.25U）。](https://1.bp.blogspot.com/-OsJS2N5x-xs/XomqiaYZdmI/AAAAAAAACDY/rYH-dnIQBdYOvpj0C9-zdd9A913Ql5NWgCKgBGAsYHg/s1600/ZPH_0027.JPG)

![▲ 黑胡桃木鍵帽表面的紋理。](https://1.bp.blogspot.com/-2Yb1BbK6OBY/XomqiUr3O3I/AAAAAAAACDY/KDUp_OdQr0wFmKClyiztRhtMBskWyNEKQCKgBGAsYHg/s1600/ZPH_0028.JPG)

![▲ 後面的固定座是塑膠材質的。](https://1.bp.blogspot.com/-LwDkyZh6YN8/XomqiUSJPgI/AAAAAAAACDY/nvVaU5Voq7wjVUY5FxYzHA0KrIPPjX9uwCKgBGAsYHg/s1600/ZPH_0029.JPG)

![▲ 裝上黑胡桃木空白鍵帽的樣子。](https://1.bp.blogspot.com/-9_BjXyOtd_w/XomqiUPPwdI/AAAAAAAACDY/SRE5JansEq4QPMJf4clbUY4ONSFwDuvtQCKgBGAsYHg/s1600/ZPH_0042.JPG)

![▲ 黑胡桃木空白鍵帽特寫。](https://1.bp.blogspot.com/-Jv_6116iqy4/XomqiWmI1gI/AAAAAAAACDY/lx_Qeyt1EtEoF1EfjMIwfoLyaqqBKK2ZgCKgBGAsYHg/s1600/ZPH_0044.JPG)

![▲ 黑胡桃木空白鍵帽特寫。](https://1.bp.blogspot.com/-anBILzR4TUE/XomqiemAhaI/AAAAAAAACDY/zAJt8yD8lDsUQjnGxI3PxJe_-eP1mprhwCKgBGAsYHg/s1600/ZPH_0043.JPG)

![▲ 鍵盤整體。](https://1.bp.blogspot.com/-P81cvmrISPo/XomqiR1xGkI/AAAAAAAACDY/nfNnUb-p17Y4JvDKPNM80RchkRITEm0GACKgBGAsYHg/s1600/ZPH_0100.JPG)

![▲ 鍵盤特寫。](https://1.bp.blogspot.com/--_zUJvlRwho/XomqiYemVmI/AAAAAAAACDY/_K-5dUg-URsJZtrce0R8DmF-aDIXxEdjQCKgBGAsYHg/s1600/ZPH_0101.JPG)

![▲ 鍵盤特寫。](https://1.bp.blogspot.com/-joyVnZ1P2lA/XomqicMQraI/AAAAAAAACDY/SOtAedyohWwH2n3QJREjIf0-OkwNQCfBQCKgBGAsYHg/s1600/ZPH_0102.JPG)


# 相關文章

*   [自組60%藍牙機械鍵盤-Just60 後續改軸](/posts/just60-replaceswitches/)


# 參考文章

*   [DIY機械鍵盤組裝教學 Mechanical Keyboards Building Guide](https://playkeyboard01.pixnet.net/blog/post/200804099-diy%E6%A9%9F%E6%A2%B0%E9%8D%B5%E7%9B%A4%E7%B5%84%E8%A3%9D%E6%95%99%E5%AD%B8-mechanical-keyboards-building-gu)（這篇文章的教學寫得非常詳細）
