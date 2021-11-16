title: '[STM32學習記錄-6] 在VS Code與PlatformIO上開發STM32'
author: ZiTe
tags:
  - STM32
  - 電子電路
  - 教學
categories: []
date: 2021-11-15 22:15:00
---
![](https://blogger.googleusercontent.com/img/a/AVvXsEitW-RvmJa7RDSr_52UGweZc-G7pHkN0GECSLKrNoD0olnhbHNcsn0ogqQtQo1iBYTdPskq7LNuMicgjj_PQj_JQAMtZc5uKaiq-kIqjZHO36tTTcIcLKR7DL_jqpZENUUZTbuAsey8m4klKbUhXVoxQ4yTiy872IhnfLmTQ6Tmdysq2dFZQ6czBWwd=s1920)

# 前言

[PlatformIO](https://platformio.org/) 是一個開源的嵌入式系統整合開發平臺，你可以在上面使用各式各樣的開發板進行開發，包括 Arduino、ESP8266 與今天的主角 STM32。我認為它的重點特色為：

- 跨平臺。
- 可以搭配 VS Code（Visual Studio Code） 使用。
- 安裝方便，設定簡單。
- 整合了眾多開發板、平臺、函式庫及框架。
- 可以設定多種開發環境，並隨時切換。
- 擁有 Debugging 功能。
- 擁有單元測試（Unit test）的功能。
- 靜態程式碼分析。
- 遠端開發。

本篇文章將會介紹並示範如何在 VS Code 上使用 PlatformIO 開發 STM32。

<!--more-->

# 正文

- [安裝 PlatformIO](#安裝-PlatformIO)
- [安裝 ST STM32 平臺](#安裝-ST-STM32-平臺)
- [建立專案](#建立專案)
- [專案結構](#專案結構)
- [編寫程式](#編寫程式)
- [建置&燒錄程式](#建置-amp-燒錄程式)

## 安裝 PlatformIO

最一開始當然就是安裝相關軟體了，而 PlatformIO 其實並不綁定 VS Code，它可以和許多不同的 IDE 或文字編輯器整合，甚至獨立運作。本篇就以 VS Code 為主，其它種類的安裝方式請參考[官方文件](https://docs.platformio.org/en/latest/integration/ide/index.html)。

VS Code 的安裝沒什麼特別的，就不再贅述。安裝完 VS Code 後只要去擴充功能（Extensions）處搜尋並安裝 [PlatformIO IDE](https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide)，並等待其安裝完成就可以了，超級簡單。

![▲ 安裝 PlatformIO IDE。](https://blogger.googleusercontent.com/img/a/AVvXsEiqHeJoDrG_Hv24rT50Ivj5zfVs1oBYr-j5Lo_YbFPPLJrRhgTGTqvNqRLOpdJ4U3JOT0ckyXPWNhJ4SRB4apVZ32OYnVB8EQJWRdM5IgUEvZOanfoXfHroRhTwfcqh4EPxEfnSJ3I6rQ1XNl4fSDF6-Ha8BllKyBGxUmSGI5h1RKcYvAa7nDXkgGCF=s1920)

安裝完成後就可以看到 VS Code 的側邊多了 PlatformIO 的 Icon，點擊它並點選「QUICK ACCESS > PIO Home > Open」就可以進入其主要畫面——PIO Home。
![▲ PIO Home。](https://blogger.googleusercontent.com/img/a/AVvXsEitW-RvmJa7RDSr_52UGweZc-G7pHkN0GECSLKrNoD0olnhbHNcsn0ogqQtQo1iBYTdPskq7LNuMicgjj_PQj_JQAMtZc5uKaiq-kIqjZHO36tTTcIcLKR7DL_jqpZENUUZTbuAsey8m4klKbUhXVoxQ4yTiy872IhnfLmTQ6Tmdysq2dFZQ6czBWwd=s1920)

## 安裝 ST STM32 平臺

PlatformIO 支援許多平臺（Platforms），例如 Atmel AVR、Espressif 8266、ST STM32等，而本篇要使用的是 STM32，所以需要安裝 [ST STM32 平臺](https://platformio.org/platforms/ststm32)。

在 PIO Home 的左側欄位點擊「Platforms」，點擊上方的「Embedded」頁面並搜尋「ST STM32」，找到後就可以點擊「Install」進行安裝，安裝可能需要花一點時間。完成後就可以在「Installed」頁面中看到「ST STM32」。

![▲ 安裝 ST STM32 平臺。](https://blogger.googleusercontent.com/img/a/AVvXsEh2T6vNQ2_GQ6Dn83CetGVlEzM09CdTwpbAjcKOOi0qUvWiAlBs1OGTq72oay6cXq8-mSqIovIMNTyDGTLdof2h1E9wqUT_MYpxV8rbsLm1OdG8CMoveYKh6qetbNv2K3U7d8UNUu9-WV3Vh2FP811liegqR1-klUKVFZlXPYbapQzXIXA-1uLvYNND=s1498)

## 建立專案

接下來就可以建立專案了。在 PIO Home 的左側欄位中點擊「Projects」，再頁面中點擊「+ Create New Project」。

在創建專案頁面（Project Wizard）中有幾個欄位需要填寫：
- **Name**：專案名稱。
- **Board**：選擇你要使用的開發板。例如我使用的「ST Nucleo F103RB」。
- **Framework**：框架。各種開發板都有各自可以使用的框架，例如 ST Nucleo F103RB 有以下幾種。
    - **Arduino**：可以讓你使用 Arduino 的語法及函數開發 STM32，適合熟悉 Arduino 的 STM32 新手。
    - **CMSIS**：Cortex-M 系列微控制器的標準通用界面，無關各個供應商。
    - **Mbed**：一種基於 32-bit ARM Cortex-M 的微型作業系統。
    - **libopencm3**：開源的 ARM Cortex-M 函式庫。
    - **STM32Cube**：相信很多人剛入門 STM32 都是使用 STM32Cube，包括我之前使用 TrueSTUDIO 也是使用 STM32Cude。
    - **Zephyr RTOS**：一個 Linux 基金會主導的開源小型即時作業系統（RTOS）， 常用於 IoT 應用。
 - **Location**：專案的路徑。

![▲ 建立專案。](https://blogger.googleusercontent.com/img/a/AVvXsEiGYQPhKPuGKSftjNuManasaGjwcDjDs3cy3sqc3Tuy89YlKSXt2KCr0CQ3iSKz9yoW0PY3O16K3fyoZxs-rChRPaVa_mpjEHIVg0WQda-nbs9wYBg5qfeVrcZ8e05mzPbaV1WzY6FskWzf8hhHmFq7BlRBz32zL5n8NS5leERudgm-R6TTltHTmVHh=s550)

剛開始接觸比較會有問題的應該是「Framework」的選擇。依據我的經驗，有關 STM32 市面上的書和網路上的教學通常使用的就是「STM32Cube」，所以如果你剛入門 STM32 對它的使用不是這麼熟悉的話就選「STM32Cube」，這樣出問題時會有比較多的資源可以參考。

本次範例使用「STM32Cube」。不過我個人其實相當推薦使用「[libopencm3](https://github.com/libopencm3/libopencm3)」，如果你對 STM32 或嵌入式系統有一定的瞭解的話可以試試看。我有寫一些簡單的範例並放在 [GitHub](https://github.com/ziteh/libopencm3-stm32-examples) 上，預計之後也會寫一些文章來介紹它。

最後就按下「Finish」就會開始創建專案了。

## 專案結構

PlatformIO 的專案結構大致如下（有方括弧的是資料夾）：

- **platformio.ini**：PlatformIO 的專案設定檔。
- **.gitignore**：PlatformIO 會自己設定好 .gitignore。
- [**src**]：存放主要程式碼。
- [**include**]：存放調用的函式庫。
- [**lib**]：存放對外的檔案（Public interface），如標頭檔（.h）。
- [**test**]：存放 PlatformIO 的單元測試（Unit test）功能的程式。
- [**.vscode**]：VS Code 的相關設定。
- [**.pio**]

其中比較重要的是「platformio.ini」這個檔案，該檔案就儲存了此專案的設定，其內容大致如下：

```ini
; PlatformIO Project Configuration File
;
;   Build options: build flags, source filter
;   Upload options: custom upload port, speed and extra flags
;   Library options: dependencies, extra library storages
;   Advanced options: extra scripting
;
; Please visit documentation for the other options and examples
; https://docs.platformio.org/page/projectconf.html

[env:nucleo_f103rb]
platform = ststm32
board = nucleo_f103rb
framework = stm32cube
```

從「platformio.ini」的內容可以看出以下資訊：

- `[env:nucleo_f103rb]`代表目前有一個名為「nucleo_f103rb」環境，且此環境擁有以下的設定：
    - 平臺為「ST STM32」（`platform = ststm32`）。
    - 開發板為「ST Nucleo F103RB」（`board = nucleo_f103rb`）。
    - 框架為「STM32Cube」（`framework = stm32cube`）。

不難看出 PlatformIO 可以在一個專案中設定多種不同的環境，以配合不同的開發需求，這也是我認為 PlatformIO 好用的一大重點。


## 編寫程式

接下來就寫個簡單的 LED 閃爍程式作為示範。

在資料夾「src」中新增檔案「main.c」，並加入以下的程式碼：

<script src="https://gist.github.com/ziteh/b6bd1a9af2d1ac61cdfcc55e7d0580db.js"></script>

PlatformIO 的 GitHub 上也有一些範例程式可以看：[platformio/platform-ststm32](https://github.com/platformio/platform-ststm32)

## 建置&燒錄程式

寫完程式後就是進行建置與燒錄了。

點擊 VS Code 左側欄位的 PlatformIO Icon，並點擊「PROJECT TASKS」中對應環境的「Build」進行建置。本範例只有一個環境「nucleo_f103rb」，故點擊「nucleo_f103rb > Gereral > Build」。也可以點擊下方狀態條的「PlatformIO: Build」按鈕。

![▲ Build 與 Upload 按鈕。](https://blogger.googleusercontent.com/img/a/AVvXsEhCLowlJe9yhNqMX2RsozYFQksf-pzfmMYKB69xWsvMkFkWv1j60fUOOc4HN9ZnkHwVI5YuDBPCjugQaq1vqCkK1LSg17GETqe0DId_2BARwXfbH7K25_TB0U6ohK87FWg2Wf7U9sN_fmSAresx-MIOnIQXIzTmlb9YiU6sTQk3LXx7GteMxufohvQq=s1920)

如果都沒問題的話會在終端機看到「SUCCESS」，那就可以接上開發板繼續進行燒錄了。如果你是使用 ST-Link 的話，記得要安裝 [ST-Link 的驅動程式](https://www.st.com/content/st_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-utilities/stsw-link009.html)。

![▲ 建置（Build）成功訊息。](https://blogger.googleusercontent.com/img/a/AVvXsEgGhzAC5lP1xILR8xKpE5nFkb0GT_PsCSjljKyGG2J87rhX1iPsptB5a-z1LJN8thNJdrQ-Vw4K_KykHNZz7tIjzeGTOthZPYtaoXSCxGZTfIAKO-zB11P6JfBmbrI4kxP9YUe-MSSwN93LDSlz1wU2lgBaPPqCFT7MgTknwuclp5K96KdYAzY4iOWC=w640-h356)

燒錄（上傳）的按鈕和建置在相同的地方，按下「Upload」就可以進行燒錄了，同樣也可以點擊下方狀態條的「PlatformIO: Upload」按鈕。第一次可能會花比較久的時間，看到終端機顯示「SUCCESS」就代表程式燒錄成功。

![▲ 燒錄（Upload）成功訊息。](https://blogger.googleusercontent.com/img/a/AVvXsEjGDrZX0XtCx70I_hP0wUfyJMG9qUoAIks-00OFRMdOBjNuDmi3Yb9v2Y06i-57eilCO_7YR1XfN46SltBgqxa0h07qKbN4d1b8NAbKjDx8Tjzw-8WpQb5qYJpwOq3651pGUU9ulwXEMIn6bv76o1sCscrefup4RZPr3bq_rF3Uup6Ydb736w06dNoB=s1388)

# 結語

這次簡單介紹了如何在 VS Code 上透過 PlatformIO 來開發 STM32。

我覺得不管是 VS Code、PlatformIO 還是 STM32 都是非常好用的東西，所以當他們整合在一起就令我感到非常滿意。

在之前，我一直是使用 TrueSTUDIO 這個 由 ST 官方所維護的 IDE 進行 STM32 的開發，甚至還寫了一篇[文章](https://ziteh.github.io/2020/03/learningstm32-04/)來介紹它。後來隨著 VS Code 逐漸在程式圈流行，我越來越常使用 VS Code，也開始想要在 VS Code 上開發 STM32。但是開發環境的設置就讓我忙了好久，最後也沒搞定就放棄了。

就在幾個禮拜前，我無意間得知 PlatformIO，並且看到它也可以用來開發 STM32，而有支援 VS Code，我就馬上進行測試，而結果令我相當滿意，也就誕生了這篇文章，希望大家也可以試著透過 PlatformIO 與 VS Code 開發 STM32。

# 相關文章

- [\[系列文章\] STM32學習記錄](/pages/serial/s-learningstm32.html)

# 參考資料

- [PlatformIO 訣竅 - 快速切換不同開發板進行測試-黑暗執行緒](https://blog.darkthread.net/blog/platformio-multi-env/)
- [SDpower | 制霸 IoT 30Day！ Day 09 開發工具介紹(二)](https://blog.sd.idv.tw/posts/2019-09-24-iot30day-day09/)
- [platformio/platform-ststm32: ST STM32: development platform for PlatformIO](https://github.com/platformio/platform-ststm32)

# 其它資訊

撰寫本文時的相關資訊：

- PlatformIO
    - PlatformIO IDE，VS Code 擴充套件版本：`2.4.0`
    - PlatformIO Core 版本：`5.2.3`
    - PlatformIO Home 版本：`3.4.0`
    - Platform-ST STM32 版本：`15.0.0`
- VS Code 版本：`1.62.0`
- 開發板：NUCLEO-F103RB（STM32F103RB）