---
title: '[STM32學習記錄-4] 免費好用的STM32 IDE——TrueSTUDIO'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
categories: ["STM32學習記錄"]
date: 2020-03-31 15:18:00
comments: true
toc: true
draft: false
aliases: ["/2020/03/learningstm32-04/"]
---
![](https://1.bp.blogspot.com/-jpislKTRwlY/XomHrzCsbVI/AAAAAAAACCk/ambFVA1uD4guODQ_Zurcc9CNpkfhFiiQwCKgBGAsYHg/s640/Screenshot%2B%252811%2529.png)

# 前言

我之前搭配STM32使用的IDE為Keil uVision 5，但用了一段時間後實在是無法習慣它的操作。後來又上網找了許多不同的IDE來用，最後我就找到了今天的主角——[Atollic TrueSTUDIO for STM32](https://atollic.com/truestudio/)。

<!--more-->

TrueSTUDIO是一套由意法半導體（STMicroelectronics）公司專門為STM32開發的免費IDE。它是基於開源標準，建立於Eclipse、CDT、GCC和GDB之上的C/C++開發工具。

熟悉Java的人可能有聽過甚至用過[Eclipse](https://www.eclipse.org/)，TrueSTUDIO就是基於Eclipse框架進行開發的，所以其界面和Eclipse基本上是一模一樣，自然也傳承了它的靈活性。

# 開始使用

首先到其[官網下載](https://atollic.com/resources/download/)軟體（需填寫用戶資料），目前有Windows與Linux版。安裝過程沒什麼特別的，在此就不贅述了。安裝完成後就可以執行了。

![▲ 界面樣式。](https://1.bp.blogspot.com/-tq_EUl3acBg/XomHr6bMzAI/AAAAAAAACCk/GsC-z1-5ZWw0yuHSo8wpEqrhkviURouIACKgBGAsYHg/s1600/Screenshot%2B%252812%2529.png)

其實IDE也沒有什麼好特別介紹的，新增專案那些功能每個軟體都大同小異。這裡就簡單介紹一下新增C專案。

![▲ 新增專案：File > New > C Project。](https://1.bp.blogspot.com/-GvkgWX6JYcQ/XomHr8uDR3I/AAAAAAAACCk/YCdA0MHFjWkhNssZSor_jdMVb1bbGwYhwCKgBGAsYHg/s1600/Screenshot%2B%252815%2529.png)

![▲ 輸入專案名稱，選擇儲存路徑（圖中選為預設位置），選擇Embedded C Project。](https://1.bp.blogspot.com/-SPbqGREFSJs/XomHrwgbY9I/AAAAAAAACCk/lY-WPeuBrXAILbIM8csga7w6nwCCDmA9gCKgBGAsYHg/s1600/Screenshot%2B%252816%2529_LI.jpg)

![▲ 選擇裝置型號（如我的是STM32F103RB）。](https://1.bp.blogspot.com/-Vm1ztTY0_-8/XomHr0suhOI/AAAAAAAACCk/pzukkC1dhRMnawtO1HILrexAwlukifBRgCKgBGAsYHg/s1600/Screenshot%2B%252817%2529.png)

![▲ 選擇設定。這裡我通常就用預設值，有些人會勾選Generate system calls file。](https://1.bp.blogspot.com/-d9-LvMwLYIQ/XomHr7_5y4I/AAAAAAAACCk/mNizOlEnykcNU7YwSTUbDI8DQ4YE0TrJgCKgBGAsYHg/s1600/Screenshot%2B%252818%2529.png)

![▲ 選擇Debugger（如我是板載的ST-LINK）。](https://1.bp.blogspot.com/-kQdAbyrZ6L4/XomHr_bmSKI/AAAAAAAACCk/N-tBisDjSKQdNmkk0oTMpNa-6br_4QZ_QCKgBGAsYHg/s1600/Screenshot%2B%252819%2529.png)

![▲ 完成。](https://1.bp.blogspot.com/-N43j_FUjMeM/XomHr4gkTUI/AAAAAAAACCk/QyzTLiL25kgGLZ6blIxRNV1v0J4BWVkagCKgBGAsYHg/s1600/Screenshot%2B%252820%2529.png)

![▲ 如要新增.c或.h檔，在src右鍵 > New > Source File (或 Header File)。](https://1.bp.blogspot.com/-96OhBtd2iTw/XomHr7_lnbI/AAAAAAAACCk/JqsDHSwIS9035Onm6WFFEj3nbD8FM54JQCKgBGAsYHg/s1600/Screenshot%2B%252821%2529.png)

由於TrueSTUDIO是建立於Eclipse框架之上，所以它也非常靈活，有很多東西都可以自行設定。而基本的顏色主題當然也可以隨意變化，它當然也可以使用[Eclipse的主題庫](http://eclipsecolorthemes.org/)（目前此網站似乎有問題），直接下載使用他人做好的設定。像是我使用的是William製作的Atom One Dark Syntax Clone。

![▲ 我實際使用的界面樣式。](https://1.bp.blogspot.com/-MrrPmveWI7A/XomHr7ooq5I/AAAAAAAACCk/iSThUurHcq8iMAgnaWhpBjsfPB1Z13jxACKgBGAsYHg/s1600/Screenshot%2B%252828%2529.png)

# 結語

我使用TrueSTUDIO來進行STM32的開發已經超過半年了，沒有什麼太大的問題。不過如果真的要說的話，它的“程式碼自動補全”功能對C\\C++的支援度不高，必須要使用者自己按下快捷鍵才行。不過這部分或許有插件可以補全，但我目前還沒發現。

TrueSTUDIO有很高的可擴展性、插件可以使用，我自己也有裝一些，未來有機會再來介紹。

![▲ 本文使用之TrueSTUDIO為Version：9.3.0；Build id：20190212-0734。](https://1.bp.blogspot.com/-XRXvwadDtVs/XomHrwMB8wI/AAAAAAAACCk/4qRVLrqHApYbyNlYXsg_ks_ZMPqKOtGRACKgBGAsYHg/s1600/Screenshot%2B%252813%2529.png)
