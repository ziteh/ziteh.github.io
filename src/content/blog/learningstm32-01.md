---
title: "[STM32學習記錄-1] 建立工程環境教學"
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
  - C/C++
  - 程式
  - 嵌入式
categories: ["STM32學習記錄"]
date: 2018-08-04 15:05:00
comments: true
toc: true
draft: false
# aliases: ["/2018/08/learningstm32-01/"]
---

![](https://bucket.ziteh.dev/blog/learningstm32-01/598d898d.webp)

## 前言

由於最近在接觸ARM，而我選擇STM32系列的微控制器，它們和FPGA/CPLD的用法有著不少的差別，讓我一時之間無法很好理解用法，而台灣相關的資源也不是很豐富，所以我想來寫有關STM32系列微控制器的文章。

<!--more-->

雖然我不是很厲害，但是想說一邊學習一邊將我學到的知識或遇到的問題做一個整理，讓和我一樣的初學者可以和我一起學習與討論，也希望如果我的內容有錯誤的時候有前輩可以指導一番。

我使用的開發板為NUCLEO-F103RB，上面的晶片型號是STM32F103RBT6。此開發板自帶ST-Link/V2，所以只要USB接上電腦就可以進行燒錄工作。而我使用的IDE是Keil uVision 5。

## 建立工程環境

以下為建立工程環境的簡單介紹。老實講我也不知道為什麼要這樣建，但我看書和網路上的教學大概都是如此，所以我也就先照著做了。

### 一、下載Library

 下載Library有2種方法，2種方法是沒有差別的。

#### 方法一

1.到ST網站的[STM32 Embedded Software](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software.html?querycriteria=productId=SC961)，滾動到頁面下方的清單處，在清單上方選擇\[STM32 Standard Peripheral Libraries] 2.找到對的型號。如我使用的是STM32F103RBT6，所以選擇STM32F10x系列用的STSW-STM32054。

![](https://bucket.ziteh.dev/blog/learningstm32-01/6e2ff93c.webp)

3.點擊三角形展開。4.點擊名稱後方的箭頭按鈕開啟下載頁面。

![](https://bucket.ziteh.dev/blog/learningstm32-01/7ea90dd2.webp)

5.在新開啟的頁面滾至底下，點藍色的\[Download]，確認同意並登錄ST帳號後開始下載。

![](https://bucket.ziteh.dev/blog/learningstm32-01/80d62046.webp)

6.將下載好的檔案解壓縮。等一下會用到的是Libraries和Project這2個資料夾。

![](https://bucket.ziteh.dev/blog/learningstm32-01/b09eae76.webp)

#### 方法二

1.到ST網站的[STM32 Embedded Software](https://www.st.com/content/st_com/en/products/embedded-software/mcus-embedded-software/stm32-embedded-software.html?querycriteria=productId=SC961)，滾動到頁面下方的清單處，點擊清單右上方的\[Download]開始下載。

![](https://bucket.ziteh.dev/blog/learningstm32-01/b3bc4140.webp)

2.打開剛剛下載的\[ProductsList.xlsx]檔案。

![](https://bucket.ziteh.dev/blog/learningstm32-01/6d8ea4ad.webp)

3.選擇要的型號，點擊前方的鏈接，會開啟方法一第5步相同的頁面，接下來步驟與方法一相同。

![](https://bucket.ziteh.dev/blog/learningstm32-01/81bdff6f.webp)

### 二、下載並安裝Pack

1.先到Keil網站的[MDK5 Software Pack](https://www.keil.com/dd2/pack/#/eula-container)，找到要的型號後按右方的下載按鈕開始下載。

![](https://bucket.ziteh.dev/blog/learningstm32-01/7d5146a7.webp)

2.開啟uVision軟體，點擊\[Pack Installer]按鈕開啟視窗。

![](https://bucket.ziteh.dev/blog/learningstm32-01/c1f7d710.webp)

3.點擊File>Import後選擇下載好的Pack檔案，軟體就會開始安裝。

![](https://bucket.ziteh.dev/blog/learningstm32-01/cd7d997e.webp)

### 三、建立工程環境

1.新增User、Project、Doc這三個資料夾，並將【一、下載Library】部分中的Libraries資料夾直接整個複製過來。

![](https://bucket.ziteh.dev/blog/learningstm32-01/5de52b9c.webp)

2.在User資料夾中新增一個txt檔，並改名為\[main.c]。然後將【一、下載Library】部分中的Project\STM32F10x_StdPeriph_Template裡以下4個檔案直接複製過來。

- system_stm32f10x.c
- stm32f10x_it.c
- stm32f10x_it.h
- stm32f10x_conf.h

![](https://bucket.ziteh.dev/blog/learningstm32-01/c9174255.webp)

3.在Doc資料夾中新增一個txt檔，並改名為\[Readme.txt]。此檔案基本上只是當作說明文件用，不加並不會有太大的影響。

![](https://bucket.ziteh.dev/blog/learningstm32-01/7a60e533.webp)

4.開啟uVision軟體，點擊Project>New uVision Project。5.選擇路徑到步驟1新增的Project資料夾。打上專案名稱後儲存。

![](https://bucket.ziteh.dev/blog/learningstm32-01/16e9ed48.webp)

6.選擇使用的裝置。可以在下方的清單找，也可以在\[Search]中直接搜尋。如果【二、下載並安裝Pack】部分沒有完成的話，這裡可能會沒有要的裝置。

![](https://bucket.ziteh.dev/blog/learningstm32-01/ad08dfca.webp)

7.會跳出\[Manage Run-Time Environment]視窗，直接按下方的\[Cancel]或按右上方的\[X]關閉此視窗就好了。

![](https://bucket.ziteh.dev/blog/learningstm32-01/b52ee2e3.webp)

8.點擊上方的\[Manage Project Items]開啟視窗。9.點擊\[New]新增Startup、CMSIS、FWLib、User和Doc這5個Group。

![](https://bucket.ziteh.dev/blog/learningstm32-01/fe4a53e6.webp)

10.點選要加入檔案的Group。11.按左下方的\[Add Files]加入檔案（注意選擇路徑視窗下方的檔案類型，不然會看不到所有檔案）。

- 在\[Startup]中加入\[startup_stm32f10x_hd.s]。（參考路徑：Libraries\CMSIS\CM3\DeviceSupport\ST\STM32F10x\startup\arm）
- 在\[CMSIS]中加入\[core_cm3.c]與\[core_cm3.h]。（參考路徑：Libraries\CMSIS\CM3\CoreSupport）
- 在\[CMSIS]中加入\[system_stm32f10x.c]、\[system_stm32f10x.h]與\[stm32f10x.h]。（參考路徑： Libraries\CMSIS\CM3\DeviceSupport\ST\STM32F10x）
- 在\[FWLib]中加入\[src]中所有檔案。（參考路徑： Libraries\STM32F10x_StdPeriph_Driver\src）
- 在\[User]中加入\[main.c]與\[stm32f10x_it.c]。（參考路徑：步驟1中新增的User）
- 在\[Doc]中加入\[Readme.txt]。（參考路徑：步驟1中新增的Doc）

![](https://bucket.ziteh.dev/blog/learningstm32-01/701758a2.webp)

可以參考以下圖片加入檔案。

![](https://bucket.ziteh.dev/blog/learningstm32-01/157e4f32.webp)

12.點擊上方的\[Options for Target]開啟視窗。13.選擇上方的\[Output]標籤。14.將\[Create HEX File]打勾。

![](https://bucket.ziteh.dev/blog/learningstm32-01/7c02489f.webp)

15.選擇上方的\[C/C++]標籤。16.在\[Define]中輸入USE_STDPERIPH_DRIVER。17.點擊\[Include Paths]後方的按鈕。

![](https://bucket.ziteh.dev/blog/learningstm32-01/76161beb.webp)

18.在開啟的\[Folder Setup]視窗中點擊右上方的\[New]按鈕新增以下路徑。(參考用，請依照個人電腦進行修正調整)

- \Libraries\CMSIS
- \Libraries\STM32F10x_StdPeriph_Driver\inc
- \Libraries\STM32F10x_StdPeriph_Driver\src
- \User
- C:\Keil_v5\ARM\PACK\ARM\CMSIS\5.3.0\CMSIS\Include

![](https://bucket.ziteh.dev/blog/learningstm32-01/bf413504.webp)

19.選擇上方的\[Debug]標籤。20.選擇要使用的Debugger。例如我是使用ST-Link。

![](https://bucket.ziteh.dev/blog/learningstm32-01/f3d5c174.webp)

21.選擇上方的\[Utilities]標籤。22.點選\[Settings]開啟視窗。23.將\[Reset and Run]打勾。24.點擊\[OK]完成設定。

![](https://bucket.ziteh.dev/blog/learningstm32-01/3593e7f7.webp)

### 四、測試

1.點擊\[main.c]就可以開始編寫程式。2.點擊左上方的\[Build]（或使用快捷鍵-F7）來進行程式編譯。3.編譯成功。0 Error、0 Warning。

![](https://bucket.ziteh.dev/blog/learningstm32-01/77a86117.webp)

這裡我也提供我建立好的STM32F10x工程環境，可以下載來用。[Google雲端硬碟](https://drive.google.com/file/d/15isC9-bOByzT3277Wwwy-JUH-gqdCzil/view?usp=sharing)

撰寫此文章使用的軟體版本資訊：MDK-Lite uVision Ver 5.25.2.0

![](https://bucket.ziteh.dev/blog/learningstm32-01/1cd06ce6.webp)
