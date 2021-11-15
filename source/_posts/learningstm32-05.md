title: '[STM32學習記錄-5] 優化STM32 GPIO設定函式'
author: ZiTe
tags:
  - ARM-STM32F10x
  - 電子電路
  - 教學
categories: []
date: 2020-04-02 15:40:00
---
# 前言

在先前的[\[STM32學習記錄-3\] 基本輸入與輸出教學-GPIO相關程式寫法](/2018/09/learningstm32-03/)中已經介紹過STM32設定GPIO的相關函式，但如果是常用Arduion的人一定不太習慣這種設定方式，畢竟每設定一個GPIO就要打4行程式，雖然可以複製貼上，但程式一多難免看起來混亂複雜，所以我自己寫了一些GPIO相關的函式，方便自己未來使用。

<!--more-->

# GPIO模式設定函式

程式如下：~~（GitHub Gist的預覽格式都會跑掉，看起來傷眼，未來再找方法解決，還請見諒）~~（我把縮排的Tab改成Space就沒問題了）

<script src="https://gist.github.com/ziteh/b91e9f29c4af6d990b8c77b6fb39eba8.js?file=GPIO_Mode.c"></script>


可以看到裡面就是增加了“void Pin\_Mod(u8 PortPin, u8 INout, u8 Mode, u8 Speed)”此一函式。其用法如下：

<script src="https://gist.github.com/ziteh/b91e9f29c4af6d990b8c77b6fb39eba8.js?file=GPIO_Setup.c"></script>

這樣的話就可以更簡單方便地設定GPIO了。

至於其引入的“GPIO\_mapping.h”內容如下：（只適用於STM32F103RB，請依照自己的MCU腳位更改）  

<script src="https://gist.github.com/ziteh/b91e9f29c4af6d990b8c77b6fb39eba8.js?file=GPIO_mapping.h"></script>


# 結語

這次簡單地分享了自己打的程式，不敢說自己的程式很完善、漂亮，但希望它有幫助到你。  
如有問題或錯誤也歡迎提出討論！  

# 相關文章

* [\[系列文章\] STM32學習記錄](/pages/serial/s-learningstm32.html)