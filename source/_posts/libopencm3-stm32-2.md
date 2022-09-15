title: 'STM32 IDE：PlatformIO'
author: ZiTe
tags:
  - STM32
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-09-15 11:04:00
---

# IDE 的尋覓過程
在開發 STM32 等 ARM 架構的 MCU 時，[Keil MDK](https://www2.keil.com/mdk5) 是很多人會使用的 IDE。筆者我最一開始學 STM32 時也是照著書上的教學，從用 Keil MDK 建工作環境開始學起，但是一段時間後我總用不習慣 Keil MDK，後來我就轉而使用 [Eclipse](https://www.eclipse.org/downloads/)，再之後發現了 ST 版本的 [TrueSTUDO](https://www.st.com/en/development-tools/truestudio.html)。  
  
到了 2020 年，我突然得知 [Visual Studio Code](https://code.visualstudio.com/)（往後簡稱爲 VS Code）這個文字編輯器，並開始慢慢地將各種程式的開發都轉到 VS Code 上。這時我也在嘗試在 VS Code 上開發 STM32，但實際建立環境的過程對我來說有點麻煩，最後就放棄了。  
  
再之後，我無意間得知 [PlatformIO](https://platformio.org/)（往後簡稱爲 PIO），嘗試過後發現它使用起來相當簡單方便，但該有的功能也都沒少，從此我終於可以在 VS Code 上輕鬆地開發 STM32 了。  

<!--more-->

# PlatformIO
對我來說，PIO 集結了眾多優點：  
* 跨平臺
* 可以搭配 VS Code 使用
* 安裝方便、設定簡單
* 整合了許多開發板與平臺
* 可以爲專案設定多種環境設定，並隨時切換
* 可以 Debugging
* 開源

## 在 VS Code 上安裝 PlatformIO
  
要在 VS Code 上安裝並使用 PIO 相當簡單，只有在 VS Code 的擴充功能（Extensions）頁面搜尋並安裝 [PlatformIO IDE](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide) 就可以了。由於 PIO 的[核心](https://github.com/platformio/platformio-core)是由 Python 寫成，因此安裝過程中可能會需要再安裝 Python。此外，PIO 不只可以在 VS Code 上使用，其它平臺的安裝方式可以參考[這份官方文件](https://docs.platformio.org/en/latest/integration/ide/index.html)。  
  
安裝完後就可以從 VS Code 左側點擊 PIO 的圖示，進入 PIO 的 Home 畫面。  
  
![▲ PIO 的 Home 畫面。 ](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsPILuVMSSfTGeLZKcLlexOWo5kV491wwGFlAJhR_zNHX3p7Nsm108mC_yzORPK6V1ZbzoFRJMBut08AFOlq54t959lCq5WdP0583eupyUt7a22hOYbG_MLVdbUQf3zZqI75j8ZxaORz8EzDPR_Wi6nPAiUR7wXP0yu51GB7TzWl2aKqse2pY9gLgW/s16000/PIO-Home_1_1661182189141_0.png)  

## 爲 PlatformIO 安裝 STM32 平臺
PIO 支援許多不同的平臺（Platforms），如 Atmel AVR、ESP、nRF5 等，而我們要安裝 [ST STM32 平臺](https://registry.platformio.org/platforms/platformio/ststm32)。  
  
在 PIO Home 的左側點擊「Platforms」，在上方的標籤頁選擇「Embedded」並搜尋「ST STM32」，然後就可以點擊「Install」進行安裝。安裝過程可能會需要一段時間。完成後就可以在「Installed」標籤頁中看到「ST STM32」。  
  
![▲ ST STM32 平臺頁面。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgm1Aibdq_4pIYptNTNwDHGaG6nW_uIo8wT5-tEKcOkY-mSmtBvK0Y9zuH4Gpz0lWtkA4tgYKLNq1hv8eXISiAvJoFMAzmPcyqt17-VqNt7bngj1pE34_GwNtIKwJfajhqS1QSJJ8EVxTd6iX50iRjs7XNE4o-t8W9eRg3VgwVBU5TckBQYjwwjjjIW/s16000/image_1661182872363_0.png)  

## 建立專案
你可以點擊 PIO Home 右上的 Quick Access，或 Projects 頁面的「+ New Project」按鈕建立新專案。  
  
在建立專案時有一些欄位需要填寫：  
* Name：專案名稱
* Board：要使用的開發板，例如：ST Nucleo F103RB
* Framework：框架，每種開發板都會有各自可以使用的框架，例如本系列預計要介紹的「libopencm3」和「STM32Cube」。STM32 可以使用的框架可以看[這篇官方說明](https://docs.platformio.org/en/stable/platforms/ststm32.html#frameworks)。
* Location：專案資料夾要儲存的路徑。  
  
填寫完後按下「Finish」就可以了。有時候（通常只有第一次）建立專案會需要花比較久的時間。  
  
![▲ 專案建立頁面。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimjNmFRhw3LB3aGcGeuyTSV8cKebcs9UxO2WCvazKEP2c8cFQ56SkabYFsEPyJHpruQaudoWnqAj_2oV0c9FbKZjSB_FmWeCccm9IurPRdHEWkjS8g0ZGYR3f_X3Y89jmfFDp7h_TM4AgPecgO1B-MxZVAgZU7AsK4Hxee5cD1Hh9yHD2mIZ7zVYhf/s16000/image_1661183230586_0.png)  

## 專案結構
PIO 新建立的專案結構大概如下：  
* `platformio.ini`：PIO 的專案設定檔，可以在這裡面調整專案設定，例如設定多種環境。
* `.gitignore`：PIO 會自動設定好基本的 `.gitignore`。
* `src/`：存放主要程式碼，如 `main.c`。
* `include/`：可以用來存 `.h` 標頭檔。
* `lib/`：存放要調用的 Library，PIO 會自動處理。
* `test/`：存放單元測試（Unit Testing）的程式。

# 結語
本篇簡單介紹了 PIO 的使用方式，但還沒教 PIO 要如何編譯和燒錄，這部分會等到下一篇要寫程式時再一併介紹。  
  
我使用 PIO 進行 STM32 的開發已經兩年了，到目前爲止都很滿意也很順手，希望大家可以嘗試使用看看，往後的所有內容我也都會使用 PIO 進行開發。

> 本文同步發表於 [iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10290514)
