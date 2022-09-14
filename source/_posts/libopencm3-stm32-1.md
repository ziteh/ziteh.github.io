title: '簡單入門 LibOpenCM3 STM32 嵌入式系統開發 - 前言'
author: ZiTe
tags:
  - STM32
  - 教學
categories:
  - '簡單入門 LibOpenCM3 STM32 嵌入式系統開發'
date: 2022-09-14 18:35:00
---

# 前言  
此爲我參加 2022 iThome 鐵人賽的系列文章，將以簡單的方式介紹以 LibOpenCM3 進行 STM32 微控制器的開發。

<!--more-->

# 主題介紹  
我這次選擇的主題是「簡單入門 LibOpenCM3 STM32 嵌入式系統開發」，我將會介紹一系列 STM32 的基礎用法。  

多虧過去舉辦的鐵人賽，STM32 的中文技術/教學文章也越來越多，也都寫得非常好，例如「[熟悉Arduino的Maker必看！30天帶你快速入門基於STM32嵌入式開發~](https://ithelp.ithome.com.tw/users/20120093/ironman/3665)」和「[基於ARM-M0架構MCU之落摔檢測韌體開發](https://ithelp.ithome.com.tw/users/20141979/ironman/4820)」都是學習 STM32 的好道路。  

不過 STM32 的世界是很多元的，它的玩法有很多種，而這其中有我認爲可以在此分享的內容。我會以 [LibOpenCM3](http://libopencm3.org/) 爲中心，介紹要如何使用它來控制 STM32。  

LibOpenCM3 是一個開源（LGPL-3.0 or GPL-3.0）的 ARM Cortex-M 微控制器韌體庫，它不只能用在 STM32 上，NXP、Atmel 或 Nordic 等許多 ARM 架構微控制器都可以。網路上的 STM32 教學文章多以 HAL 或所謂的標準庫爲主，幾乎沒有 LibOpenCM3 的文章，但我認爲它也有其優點，除了開源以外，我自己的話在開發小型專案時會優先選擇使用 LibOpenCM3，因爲我覺得它寫起來相當「小巧」，對於簡單的專案就該用簡單的方法達成。  
	    
不過我自己其實也不敢說自己熟 STM32 和 LibOpenCM3，很多底層和細節的部分我也不是很清楚，因此我只會寫最最最基本的功能用法，並且不會詳細說明底層的東西（如暫存器操作）。若文章中有錯誤也歡迎指正。  

# 硬體  
我這次將會以 [Nucleo-F446RE](https://www.st.com/en/evaluation-tools/nucleo-f446re.html) 這塊 ST 的開發板爲主，[Nucleo-F103RB](https://www.st.com/en/evaluation-tools/nucleo-f103rb.html) 爲輔，示範 STM32 的程式寫法。  

選擇 F446RE 的原因是~~我剛好有這塊~~它所搭載的 [STM32F446RE](https://www.st.com/en/microcontrollers-microprocessors/stm32f446re.html) 是顆性能與功能都相當不錯的微控制器，使用它的話可以應用並勝任許多專案上。  

而 F103RB 的優點是學習資源豐富。根據我自己感覺，STM32F103C8T6 可以說是網路上最常見的入門 STM32 型號，兩者同屬 [F103](https://www.st.com/en/microcontrollers-microprocessors/stm32f103.html) 系列，參考用法與硬體資源時很方便，我自己就是用 F103RB 入門的。而且 F103 系列的功能其實也足夠豐富，不是太大型的專案它應該都沒問題。  
	    
另外，如果真的有人是看著這系列的文章才開始學習 STM32，且不知道要買什麼開發板的話，我很推薦使用 ST 官方的 [Nucleo 系列開發板](https://www.st.com/en/evaluation-tools/stm32-nucleo-boards.html)（例如上面那兩片），主要是因爲它們都自帶 ST-Link，在燒錄與除錯程式時很方便。而且根據需求有 Nucleo-32/64/144 這三種不同大小和 GPIO 數量的系列可以選擇，就算是最小巧的 Nucleo-32 系列也都有自帶 ST-Link。

> 本文同步發表於 [iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/articles)。
