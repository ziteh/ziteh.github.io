---
title: '[STM32學習記錄-4] 免費好用的STM32 IDE——TrueSTUDIO'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
  - C/C++
  - 程式
  - 嵌入式
categories: ["STM32學習記錄"]
date: 2020-03-31 15:18:00
comments: true
toc: true
draft: false
# aliases: ["/2020/03/learningstm32-04/"]
---

![](https://bucket.ziteh.dev/blog/learningstm32-04/4f2b34ab.webp)

## 前言

我之前搭配STM32使用的IDE為Keil uVision 5，但用了一段時間後實在是無法習慣它的操作。後來又上網找了許多不同的IDE來用，最後我就找到了今天的主角——[Atollic TrueSTUDIO for STM32](https://atollic.com/truestudio/)。

<!--more-->

TrueSTUDIO是一套由意法半導體（STMicroelectronics）公司專門為STM32開發的免費IDE。它是基於開源標準，建立於Eclipse、CDT、GCC和GDB之上的C/C++開發工具。

熟悉Java的人可能有聽過甚至用過[Eclipse](https://www.eclipse.org/)，TrueSTUDIO就是基於Eclipse框架進行開發的，所以其界面和Eclipse基本上是一模一樣，自然也傳承了它的靈活性。

## 開始使用

首先到其[官網下載](https://atollic.com/resources/download/)軟體（需填寫用戶資料），目前有Windows與Linux版。安裝過程沒什麼特別的，在此就不贅述了。安裝完成後就可以執行了。

![▲ 界面樣式。](https://bucket.ziteh.dev/blog/learningstm32-04/645ad8a3.webp)

其實IDE也沒有什麼好特別介紹的，新增專案那些功能每個軟體都大同小異。這裡就簡單介紹一下新增C專案。

![▲ 新增專案：File > New > C Project。](https://bucket.ziteh.dev/blog/learningstm32-04/eac79005.webp)

![▲ 輸入專案名稱，選擇儲存路徑（圖中選為預設位置），選擇Embedded C Project。](https://bucket.ziteh.dev/blog/learningstm32-04/09fb9bb4.webp)

![▲ 選擇裝置型號（如我的是STM32F103RB）。](https://bucket.ziteh.dev/blog/learningstm32-04/f9cd53d2.webp)

![▲ 選擇設定。這裡我通常就用預設值，有些人會勾選Generate system calls file。](https://bucket.ziteh.dev/blog/learningstm32-04/d2a129c6.webp)

![▲ 選擇Debugger（如我是板載的ST-LINK）。](https://bucket.ziteh.dev/blog/learningstm32-04/5e197bea.webp)

![▲ 完成。](https://bucket.ziteh.dev/blog/learningstm32-04/e96b9ce4.webp)

![▲ 如要新增.c或.h檔，在src右鍵 > New > Source File (或 Header File)。](https://bucket.ziteh.dev/blog/learningstm32-04/364c849f.webp)

由於TrueSTUDIO是建立於Eclipse框架之上，所以它也非常靈活，有很多東西都可以自行設定。而基本的顏色主題當然也可以隨意變化，它當然也可以使用[Eclipse的主題庫](http://eclipsecolorthemes.org/)（目前此網站似乎有問題），直接下載使用他人做好的設定。像是我使用的是William製作的Atom One Dark Syntax Clone。

![▲ 我實際使用的界面樣式。](https://bucket.ziteh.dev/blog/learningstm32-04/c79ed360.webp)

## 結語

我使用TrueSTUDIO來進行STM32的開發已經超過半年了，沒有什麼太大的問題。不過如果真的要說的話，它的“程式碼自動補全”功能對C\C++的支援度不高，必須要使用者自己按下快捷鍵才行。不過這部分或許有插件可以補全，但我目前還沒發現。

TrueSTUDIO有很高的可擴展性、插件可以使用，我自己也有裝一些，未來有機會再來介紹。

![▲ 本文使用之TrueSTUDIO為Version：9.3.0；Build id：20190212-0734。](https://bucket.ziteh.dev/blog/learningstm32-04/20febbbe.webp)
