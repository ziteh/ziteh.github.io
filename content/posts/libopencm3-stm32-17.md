---
title: 'STM32 WWDG 窗口看門狗計時器'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
series: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-30 12:00:00
comment: true
toc: true
draft: false
aliases: ["/2022/09/libopencm3-stm32-17/"]
---

# 前言
在[上一篇](https://ziteh.github.io/2022/09/libopencm3-stm32-16/)中已經介紹了 WDG 看門狗計時器的用途以及 IWDG 與 WWDG 的差別，也示範了 IWDG 的基本用法。

這一篇要接著介紹 WWDG 窗口看門狗的基本概念。  

<!--more-->

# 基本概念
在啓用 WWDG 時有兩種情況會造成它觸發 System Reset：  
1. 當 WWDG 下數計數器的值變得小於 `0x40`。
2. 在時間窗口（Window）外時下數計數器被重新裝載（Reload）。  

> Conditional reset  
> - Reset (if watchdog activated) when the downcounter value becomes less than 0x40  
> - Reset (if watchdog activated) if the downcounter is reloaded outside the window

條件 1 就和 IWDG 是類似的情況，但它不是下數到 `0x00`，而是 `0x40`。這也是 Window 的下限，是不能調整的。  
  
條件 2 是 WWDG 與 IWDG 最大的不同，如果還沒到 Window 內就 Refresh 的話也會觸發 Reset。這也是 Window 的上限，可以由使用者調整。  
  
![▲ WWDG 的 Window 示意圖。取自 RM0390 Rev 6 P.648。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi95ZGURIwumO5WY3GiuIpFNpwEI6zJKUZs8cggiZBgqOSoEvA9zeDnp_PwH-9Rw-bU9dzsMxStwm4YhffS6XIKYMm3uLHAwaRV5SQhuLPsnd89kdX3EoPfKNPODTTRrj4uCPP5Qr62Fbo_WSmnTAWt6PIt7gWErprcFJOqBdEGWxAV6ef8nN9oVlFd/s16000/image_1662526244380_0.png)  
  
在上圖中，WWDG 下數計數器的當前計數值是 T[6:0]，而 Window 的值是 W[6:0]（上限）。  
  
透過圖可以看出，T[6:0] 會隨時間不斷下數，當數到 `0x3F`時（`0x40` 後，也就是 T6 位元從 `1` 變 `0`）會觸發 Reset（條件 1）。  
  
但是在 T[6:0] > W[6:0] 時是在 Window 外，是「Refresh not allowed」的區段，在這個區段內進行 Refresh 也會觸發 Reset（條件 2）。  
  
![▲ WWDG 的系統方塊圖。取自 RM0390 Rev 6 P.647。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiu7DJwBpxMecTTFoUX6_b463B4cBxyV_pqtqi49nwg2tCEwgBgsYlhAmuDe15KWaExiTIiALhg6-lik1CTnTdrosXW9kkN2OHzv1f0ytKGlZaqjjMXwW_hDXcb37zFn2Kvd5IhGgFs4OZJ6hnZgkYF_xDVPOJRuTL7rSRJ0NwmujuTttDDQzEA8k2Y/s16000/image_1662527020990_0.png)  

# Timeout 計算
![▲ WWDG 的 Timeout 計算公式。取自 RM0390 Rev 6 P.648。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLJOd0kVjLvFREZbFgal7bDN2U64qtQ-WLzdNKhhXWNb71g6BUun3GBzPMFvsQ5OTS4t9REMhuriMs7w_mpvu7mVXgY4jcr9K8pY5qt4so7qC6nbFE052ja_M2o2Uc-kIPrIo-ecWW1OGhKyc2sI5NMEodpXIAZprXzIPo161v6detq6bYW67FytKj/s16000/image_1662526953782_0.png)  
    
由於 WWDG 位於 APB1 底下，其時鐘會先經過一個固定除 4096 的除頻器，再經過一個可程式設定的 WDG 預除頻器。而計算公式也是相當簡單好理解，來看一下範例：  
  
![▲ WWDG 的 Timeout 計算範例（結果錯誤）。取自 RM0390 Rev 6 P.649。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZkpPZfWX2VwZZe3zYmpaNf5S0mwSHXbyEwxNUDbjALZiRhfSQdIHuiWORpAeqn_bYnkgIMoYleOt8dgsYkdQffiPoqGTGany_KFJdIBi_2GIgsdN_-MRmVtFTU7GfPMwjlTh_lpd0-ruxJ4lnyIufwXyS_RKB_c-kkZdBKC-D8SnpYigd8znIWanw/s16000/image_1662527383678_0.png)  
    
如果你真的照著上面的數字去按計算機的話，會發現結果不是 21.85，而是 87.38 ms。

爲什麼？單純是因爲官方文件打錯了，在 2021 年[此問題就被提出](https://community.st.com/s/question/0D53W00000arBraSAE/wwdg-timeout-example-calculation-in-rm-incorrect)，官方看起來有收到此問題了，並有說後續更新文件時會修正。  
  
![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiApCvsEK0-Kkmm-oRtXdXJD-OjPvMVWsUHu_pfZgSNRLIb_45VU20JQyPDdQBU0K0CS8qfhwEk77O-FTCSRCoIBzk--5d-R9biqCE7vzq3ay7oNpCe2aNw3I3srs4--9-AvryHwsPd8pkJnTu6Z5zZES_oHSjl3fQpi4kd4Ei97xhUG7g5P40FDACC/s16000/_1662527473515_0.png)  
  
可能有些人會覺得爲什麼計算公式中是 T[5:0] 而不是 T[6:0]，因爲第 6 位元 T6 實際上是用來指示是否該進行 Reset 的 Flag。

當 T[6:0] 的值從 `0x40` 變成 `0x3F`——也就是從 `0100 0000b` 變成 `0011 1111b`——時，T6 位元從 `1` 變成 `0`，就會觸發 Reset。

這部分可以參考上面的 WWDG 的系統方塊圖， T6 位反相後接到一個 OR 閘，而此 OR 閘的輸出就是 Reset。所以實際的計數公式只有 T0~T5，不包含 T6。  
  
# 小結
這次接續 IWDG 的內容，繼續介紹 WWDG 的用法。

相比於 IWDG，WWDG 多了 Windows 的概念，所以在計算 Timeout 時會多一個要計算的值，但計算的過程相信不會太複雜。

# 參考資料
* [STM32 Window Watchdog (WWDG) - Hackster.io](https://www.hackster.io/vasam2230/stm32-window-watchdog-wwdg-dda290)
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10299454)。
