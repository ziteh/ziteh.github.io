title: '[STM32學習記錄-1] 建立工程環境教學'
author: ZiTe
tags:
  - 教學
  - 電子電路
  - ARM-STM32F10x
categories: []
date: 2018-08-04 15:05:00
---
![](https://1.bp.blogspot.com/-lN8BAf_D-F0/Xoh7te-zqZI/AAAAAAAACAs/ff1cV3v-KAMA_kYaM8sPZXr6xg4EhYDvACKgBGAsYHg/s480/MOV_0032.mp4_20180823_233924.884.png)

# 前言

由於最近在接觸ARM，而我選擇STM32系列的微控制器，它們和FPGA/CPLD的用法有著不少的差別，讓我一時之間無法很好理解用法，而台灣相關的資源也不是很豐富，所以我想來寫有關STM32系列微控制器的文章。

<!--more-->

雖然我不是很厲害，但是想說一邊學習一邊將我學到的知識或遇到的問題做一個整理，讓和我一樣的初學者可以和我一起學習與討論，也希望如果我的內容有錯誤的時候有前輩可以指導一番。  

我使用的開發板為NUCLEO-F103RB，上面的晶片型號是STM32F103RBT6。此開發板自帶ST-Link/V2，所以只要USB接上電腦就可以進行燒錄工作。而我使用的IDE是Keil uVision 5。  

# 建立工程環境

以下為建立工程環境的簡單介紹。老實講我也不知道為什麼要這樣建，但我看書和網路上的教學大概都是如此，所以我也就先照著做了。

## 一、下載Library

 下載Library有2種方法，2種方法是沒有差別的。

### 方法一

1.到ST網站的[STM32 Embedded Software](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software.html?querycriteria=productId=SC961)，滾動到頁面下方的清單處，在清單上方選擇\[STM32 Standard Peripheral Libraries\]
2.找到對的型號。如我使用的是STM32F103RBT6，所以選擇STM32F10x系列用的STSW-STM32054。

![](https://1.bp.blogspot.com/-Fn41tqvnEGY/Xoh7taDL_kI/AAAAAAAACAs/W9rVWH00tJM85yt10K0LDw8vpbnysPebQCKgBGAsYHg/s800/1-1-%25E6%2594%25B9.png)

3.點擊三角形展開。
4.點擊名稱後方的箭頭按鈕開啟下載頁面。

![](https://1.bp.blogspot.com/-e86OaVgEwlc/Xoh7tVGf1HI/AAAAAAAACAs/qt8l0RkIXxEQM_l17es4ON_H_VovrNxzQCKgBGAsYHg/s640/1-2-%25E6%2594%25B9.png)

5.在新開啟的頁面滾至底下，點藍色的\[Download\]，確認同意並登錄ST帳號後開始下載。

![](https://1.bp.blogspot.com/-rWcNce64LxU/Xoh7tSr7SsI/AAAAAAAACAs/CtAGJdyNrvEE5ogN7a__pnxwmIZDzv22QCKgBGAsYHg/s640/1-3-%25E6%2594%25B9.png)

6.將下載好的檔案解壓縮。等一下會用到的是Libraries和Project這2個資料夾。

![](https://1.bp.blogspot.com/-yRoGvNO3DHc/Xoh7tTar9uI/AAAAAAAACAs/PeXs-R_TXUws_chYP8kOO5qRC8OXqgTTACKgBGAsYHg/s640/Library.png)

### 方法二

1.到ST網站的[STM32 Embedded Software](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software.html?querycriteria=productId=SC961)，滾動到頁面下方的清單處，點擊清單右上方的\[Download\]開始下載。

![](https://1.bp.blogspot.com/-6GBNzrTcrOg/Xoh7tVPFccI/AAAAAAAACAs/zY047Sw5Sso3TP21f1mgX9hXBTgse3d5ACKgBGAsYHg/s640/2-1-%25E6%2594%25B9.png)

2.打開剛剛下載的\[ProductsList.xlsx\]檔案。

![](https://1.bp.blogspot.com/-pdoN4_6QiZU/Xoh7tanz6DI/AAAAAAAACAs/8JN6gZF4roE7aGvgmtGxO2YuUqu427DLgCKgBGAsYHg/s640/2-2-%25E6%2594%25B9.jpg)

3.選擇要的型號，點擊前方的鏈接，會開啟方法一第5步相同的頁面，接下來步驟與方法一相同。

![](https://1.bp.blogspot.com/-K_s5yTs_hs0/Xoh7tabJ1-I/AAAAAAAACAs/Bnt-u6jB5GEiglHa46YQBraZSHAuBhXIwCKgBGAsYHg/s640/2-3-%25E6%2594%25B9.png)

## 二、下載並安裝Pack

1.先到Keil網站的[MDK5 Software Pack](https://www.keil.com/dd2/pack/#/eula-container)，找到要的型號後按右方的下載按鈕開始下載。

![](https://1.bp.blogspot.com/-6SEQIiDfeQE/Xoh7tV03y1I/AAAAAAAACAs/KxMs-4kXPTE_pP3jMH2-TAu812nmTfVtgCKgBGAsYHg/s640/Pack-%25E6%2594%25B9.png)

2.開啟uVision軟體，點擊\[Pack Installer\]按鈕開啟視窗。

![](https://1.bp.blogspot.com/-t0VO3i_tP6w/Xoh7tdX7jHI/AAAAAAAACAs/WvH3uxKAHuIAO6IyhqrYR4iNXHUKMT_gACKgBGAsYHg/s640/Pack%2BInstaller-%25E6%2594%25B9.png)

3.點擊File>Import後選擇下載好的Pack檔案，軟體就會開始安裝。

![](https://1.bp.blogspot.com/-0Sy4-p2ynqk/Xoh7tQYhz9I/AAAAAAAACAs/0jJPtR5RTJMGKIwdjshuFzet4ziQ0I87ACKgBGAsYHg/s640/Import-%25E6%2594%25B9.png)

## 三、建立工程環境

1.新增User、Project、Doc這三個資料夾，並將【一、下載Library】部分中的Libraries資料夾直接整個複製過來。

![](https://1.bp.blogspot.com/-KBYZnDDbYhk/Xoh7tSJjb4I/AAAAAAAACAs/FH8P6CzTRZYPbaX9NsXf9lFfdi4Wef2OQCKgBGAsYHg/s640/1-%25E5%25BB%25BA%25E7%25AB%258B%25E8%25B3%2587%25E6%2596%2599%25E5%25A4%25BE.png)

2.在User資料夾中新增一個txt檔，並改名為\[main.c\]。然後將【一、下載Library】部分中的Project\\STM32F10x\_StdPeriph\_Template裡以下4個檔案直接複製過來。
* system\_stm32f10x.c  
* stm32f10x\_it.c  
* stm32f10x\_it.h  
* stm32f10x\_conf.h

![](https://1.bp.blogspot.com/-4xQ9w8Y01iE/Xoh7tUvGofI/AAAAAAAACAs/_riuRWr5OHYVBz9Y1qExDEqQzwAMhOZHwCKgBGAsYHg/s640/2-User%25E8%25B3%2587%25E6%2596%2599%25E5%25A4%25BE%25E6%2596%25B0%25E5%25A2%259E%25E6%25AA%2594%25E6%25A1%2588.png)

3.在Doc資料夾中新增一個txt檔，並改名為\[Readme.txt\]。此檔案基本上只是當作說明文件用，不加並不會有太大的影響。

![](https://1.bp.blogspot.com/-0igflyzklGU/Xoh7tZxuXmI/AAAAAAAACAs/YhX0ooAa1MgeHCT1YgOU4wF3qpI5oM0cgCKgBGAsYHg/s640/3-Doc%25E8%25B3%2587%25E6%2596%2599%25E5%25A4%25BE%25E6%2596%25B0%25E5%25A2%259E%25E6%25AA%2594%25E6%25A1%2588.png)

4.開啟uVision軟體，點擊Project>New uVision Project。
5.選擇路徑到步驟1新增的Project資料夾。打上專案名稱後儲存。

![](https://1.bp.blogspot.com/-FwydGZlYaz4/Xoh7tYig6jI/AAAAAAAACAs/UT3Bc0J9GscYgqeCvB6E4MMX7-AtQVUfQCKgBGAsYHg/s640/4-%25E6%2596%25B0%25E5%25A2%259EProject-%25E6%2594%25B9.png)

6.選擇使用的裝置。可以在下方的清單找，也可以在\[Search\]中直接搜尋。如果【二、下載並安裝Pack】部分沒有完成的話，這裡可能會沒有要的裝置。

![](https://1.bp.blogspot.com/-ybfq6zHZ6zQ/Xoh7tU2B5tI/AAAAAAAACAs/qjZveow8QzkEQ6cuZQGmpFPv9Wu_M6IxwCKgBGAsYHg/s640/6-%25E9%2581%25B8%25E6%2593%2587%25E6%2599%25B6%25E7%2589%2587%25E5%259E%258B%25E8%2599%259F.png)

7.會跳出\[Manage Run-Time Environment\]視窗，直接按下方的\[Cancel\]或按右上方的\[X\]關閉此視窗就好了。

![](https://1.bp.blogspot.com/-2h3JQLAo9QM/Xoh7tecV4II/AAAAAAAACAs/EYldEYKMAqEHTlkTFYb5bstuuIn-oPsqACKgBGAsYHg/s640/7-%25E5%258A%25A0%25E5%2585%25A5%25E4%25BB%25A3%25E7%25A2%25BC-%25E6%2594%25B9.png)

8.點擊上方的\[Manage Project Items\]開啟視窗。
9.點擊\[New\]新增Startup、CMSIS、FWLib、User和Doc這5個Group。

![](https://1.bp.blogspot.com/-oTO40mTJ4S0/Xoh7tSBi3WI/AAAAAAAACAs/M8W6vxq5Qa8zm8kS5mlsI_MNI71hWAsgQCKgBGAsYHg/s640/8-%25E6%2596%25B0%25E5%25A2%259EGroup-%25E6%2594%25B9.png)

10.點選要加入檔案的Group。
11.按左下方的\[Add Files\]加入檔案（注意選擇路徑視窗下方的檔案類型，不然會看不到所有檔案）。
* 在\[Startup\]中加入\[startup\_stm32f10x\_hd.s\]。（參考路徑：Libraries\\CMSIS\\CM3\\DeviceSupport\\ST\\STM32F10x\\startup\\arm）
* 在\[CMSIS\]中加入\[core\_cm3.c\]與\[core\_cm3.h\]。（參考路徑：Libraries\\CMSIS\\CM3\\CoreSupport）
* 在\[CMSIS\]中加入\[system\_stm32f10x.c\]、\[system\_stm32f10x.h\]與\[stm32f10x.h\]。（參考路徑： Libraries\\CMSIS\\CM3\\DeviceSupport\\ST\\STM32F10x）
* 在\[FWLib\]中加入\[src\]中所有檔案。（參考路徑： Libraries\\STM32F10x\_StdPeriph\_Driver\\src）
* 在\[User\]中加入\[main.c\]與\[stm32f10x\_it.c\]。（參考路徑：步驟1中新增的User）
* 在\[Doc\]中加入\[Readme.txt\]。（參考路徑：步驟1中新增的Doc）

![](https://1.bp.blogspot.com/-98JqiJakcf4/Xoh7tT1Vw5I/AAAAAAAACAs/ZYeipCuOu7cQeULfC98h9sNPSRW2TRy9wCKgBGAsYHg/s640/9-%25E6%2596%25B0%25E5%25A2%259EFile-%25E6%2594%25B9.png)

可以參考以下圖片加入檔案。

![](https://1.bp.blogspot.com/-c5CcxuoBwkI/Xoh7tWGtQHI/AAAAAAAACAs/lVT7_be174wtgo_CN7uUEY8ZJFc6Y8CZQCKgBGAsYHg/s320/10-File%25E5%2585%25A7%25E5%25AE%25B9-%25E6%2594%25B9.png)

12.點擊上方的\[Options for Target\]開啟視窗。
13.選擇上方的\[Output\]標籤。
14.將\[Create HEX File\]打勾。

![](https://1.bp.blogspot.com/-Bcecs0quIOY/Xoh7tVBVZCI/AAAAAAAACAs/Nanv9msWZVQiurAZXLFFwSu2HK8_Rc5nQCKgBGAsYHg/s640/11-%25E8%25BC%25B8%25E5%2587%25BA%25E8%25A8%25AD%25E5%25AE%259A-%25E6%2594%25B9.png)

15.選擇上方的\[C/C++\]標籤。
16.在\[Define\]中輸入USE\_STDPERIPH\_DRIVER。
17.點擊\[Include Paths\]後方的按鈕。

![](https://1.bp.blogspot.com/-wJjRIZJoUkg/Xoh7tc1T_7I/AAAAAAAACAs/1VX-PFOuehYIJJEO8XR7Qb8s_NN35PbQwCKgBGAsYHg/s640/12-CC%252B%252B%25E8%25A8%25AD%25E5%25AE%259A-%25E6%2594%25B9.png)

18.在開啟的\[Folder Setup\]視窗中點擊右上方的\[New\]按鈕新增以下路徑。(參考用，請依照個人電腦進行修正調整)
* \\Libraries\\CMSIS
* \\Libraries\\STM32F10x\_StdPeriph\_Driver\\inc
* \\Libraries\\STM32F10x\_StdPeriph\_Driver\\src
* \\User
* C:\\Keil\_v5\\ARM\\PACK\\ARM\\CMSIS\\5.3.0\\CMSIS\\Include

![](https://1.bp.blogspot.com/-wwFb5NmuGMo/Xoh7tWhhABI/AAAAAAAACAs/_SZZh3-c2gsMbIrP_aH9l9VfYYW81Vi3gCKgBGAsYHg/s640/13-CC%252B%252B%25E8%25B7%25AF%25E5%25BE%2591-%25E6%2594%25B9.png)

19.選擇上方的\[Debug\]標籤。
20.選擇要使用的Debugger。例如我是使用ST-Link。

![](https://1.bp.blogspot.com/-TLXbqT00zwg/Xoh7tcyM6GI/AAAAAAAACAs/9HF0zwh1B_s2C3EBJ1R8faL9dbRIaKZsACKgBGAsYHg/s640/14-Debugger%25E8%25A8%25AD%25E5%25AE%259A-%25E6%2594%25B9.png)

21.選擇上方的\[Utilities\]標籤。
22.點選\[Settings\]開啟視窗。
23.將\[Reset and Run\]打勾。
24.點擊\[OK\]完成設定。

![](https://1.bp.blogspot.com/-pEX8t3nBRHQ/Xoh7tYoUW1I/AAAAAAAACAs/2jfoAkfS9gwqcec0yjqtZ5pM2nwK1NhOwCKgBGAsYHg/s640/15-Reset%2Band%2BRun%25E8%25A8%25AD%25E5%25AE%259A-%25E6%2594%25B9.png)

## 四、測試

1.點擊\[main.c\]就可以開始編寫程式。
2.點擊左上方的\[Build\]（或使用快捷鍵-F7）來進行程式編譯。
3.編譯成功。0 Error、0 Warning。

![](https://1.bp.blogspot.com/-bQqynDij-nU/Xoh7tS4wT7I/AAAAAAAACAs/8yjLsgq3vjUOYymUZcyyMQX7Wr-jF2Z2ACKgBGAsYHg/s640/16-%25E6%2588%2590%25E5%258A%259F%25E7%25B7%25A8%25E8%25AD%25AF-%25E6%2594%25B9.png)

這裡我也提供我建立好的STM32F10x工程環境，可以下載來用。[Google雲端硬碟](https://drive.google.com/file/d/15isC9-bOByzT3277Wwwy-JUH-gqdCzil/view?usp=sharing)

撰寫此文章使用的軟體版本資訊：MDK-Lite uVision Ver 5.25.2.0

![](https://1.bp.blogspot.com/-DYAfcXY47TI/Xoh7tURI6FI/AAAAAAAACAs/tmXpKpxrYVwNOM1nJKsfesEEWK6iB9cQACKgBGAsYHg/s640/%25E8%25BB%259F%25E9%25AB%2594%25E7%2589%2588%25E6%259C%25AC%25E8%25B3%2587%25E8%25A8%258A.png)

# 相關文章

* [\[系列文章\] STM32學習記錄](/pages/serial/s-learningstm32.html)