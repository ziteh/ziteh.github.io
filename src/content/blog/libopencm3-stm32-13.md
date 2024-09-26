---
title: 'STM32 PWM 脈波寬度調變'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
  - 嵌入式
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-09-26 11:48:00
comments: true
toc: true
draft: false
aliases: ["/2022/09/libopencm3-stm32-13/"]
---

# 前言
在上一篇中已經介紹過基本的 Timer 用法，而 Timer 除了單純的定時外，最常見的應用就是產生 PWM（Pulse width modulation）訊號。

在使用 PWM 時我們會需要控制兩種參數：頻率與 Duty Cycle（佔空比）。頻率的部分和 Timer 一樣，由 TIMx_PSC 與 TIMx_ARR 暫存器的值來設定，而 Duty Cycle 則由 TIMx_CCRx 暫存器來指定。

這篇會先從理論的部分說明要如何計算並設定 CCR 的值以精確地控制 Duty Cycle。

<!--more-->

# CCR 暫存器
當我們要使用 PWM 時，我們最在意的是 PWM 的頻率與 Duty Cycle。在 STM32 中，PWM 由 Timer 產生，其頻率的計算方式與 Timer 的部分一樣，這裡就不再贅述，可以參考[之前的文章](https://ziteh.github.io/2022/09/libopencm3-stm32-11/)。
而 Duty Cycle 由 CCR（Capture/Compare Register，捕獲/比較暫存器） 來控制。

> The reference PWM signal OCxREF is high as long as TIMx_CNT < TIMx_CCRx else it becomes low.

在邊緣對齊、上數模式及 PWM mode 1 下，只要 Counter 的計數值 CNT < CCR，那 PWM 就會輸出 `High`，否則輸出 `Low`。而 PWM mode 2 模式可以視為 mode 1 的反相——只要 Counter 的計數值 CNT < CCR，那 PWM 就會輸出 `Low`，否則輸出 `High`。

![▲ PWM 的波形範例，上數 PWM mode 1 模式。取自 RM0390。](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIKVkj3NgvUUj5ZZvegkFmet7d3aC_Y8CQg8Uo010RhlIKGCVW0qNN_yQuE8rGa9J9dUcdU-7Ij8QHcHJCCGVHgUJ3S596Lktihw0tdbHqE7kbJ6qkloKggNSj4bXMcwElSwNw6gGNzd1qnHjPX-zR6MuMXG0fgOjlB-HD7MjaPJ0wKasLpJTZmy7p/s16000/image_1662216176986_0.png)

若 ARR = 9，CCR = 5，在 CNT = 0\~4（共 5 次計數） 時會是 `High`，CNT = 5\~9（共 5 次計數） 時會是 `Low`，此時的 Duty Cycle 是 50%。

假設 ARR = 99，CCR = 30，在 CNT = 0\~29（共 30 次計數）時會是 `High`，CNT = 30\~99（共 70 次計數）時會是 `Low`，此時的 Duty Cycle 是 30%。

再假設 ARR = 499，CCR = 350，在 CNT = 0\~349（共 350 次計數）時會是 `High`，CNT = 350\~499（共 150 次計數）時會是 `Low`，此時的 Duty Cycle 是 70%。

由此可以得知其關係為：
`Duty_Cycle% = CCR / (ARR + 1) * 100%`
所以
`CCR = (ARR + 1) * Duty_Cycle%  / 100%`

因此我們只要照著這個公式去設定 CCR 的值就可以了。

從上面的關係式也可以發現，Duty Cycle 的控制精度與 ARR 值有關。若 ARR = 9，那 Duty Cycle 只能以 10% 為單位進行調整；若 ARR = 999，那 Duty Cycle 就能以 0.1% 為單位進行調整。因此實際在使用時 ARR 的值不能太小，不然 Duty Cycle 的調整刻度會太大。

實際上在使用 PWM 時可以依照以下的方向來設定數值：
* CCR 決定 Duty Cycle。
* ARR 決定 Duty Cycle 的控制精度。
* PSC 配合 ARR 以決定頻率。

# 小結

這次介紹了 STM32 的 PWM 用法，PWM 是 Timer 的延伸功能，因此大部分的設定都和 Timer 有關，如果 Timer 有理解的話 PWM 應該不會太難。

# 參考資料
* [STM32F446RE datasheet (DS10693)](https://www.st.com/resource/en/datasheet/stm32f446re.pdf)
* [STM32F446xx reference manual (RM0390)](https://www.st.com/resource/en/reference_manual/rm0390-stm32f446xx-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
* [STM32F103RB datasheet (DS5319)](https://www.st.com/resource/en/datasheet/stm32f103rb.pdf)
* [STM32 Nucleo-64 board user manual (UM1724)](https://www.st.com/resource/en/user_manual/um1724-stm32-nucleo64-boards-mb1136-stmicroelectronics.pdf)

> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10297647)。
