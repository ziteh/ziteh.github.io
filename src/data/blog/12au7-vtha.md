---
title: 自製12AU7(ECC82) 真空管耳機擴大機
author: ZiTe
tags:
  - 電子電路
  - DIY
categories: []
date: 2019-02-18 09:59:00
comments: true
toc: true
draft: false
# aliases: ["/2019/02/12au7-vtha/"]
---
![](https://bucket.ziteh.dev/blog/12au7-vtha/f75f6344.webp)

## 前言

這學期因為有一門電子學實習的課程，而實習的期末作業就是要自己找一個電路來做，然後自己佈線、手洗電路板最後在焊接。由於我之前一直都是使用PCB電路板雕刻機，所以這次的實習作業讓我非常的期待，而這個題目也必定要好好思考，得做些特別的才有趣，於是我就想起了我國中時的夢想：真空管擴大機。

<!--more-->

我當初高職會選擇讀資訊電子類也有很大一部分的原因是因為那時候我在玩耳機音響，對於那些DAC、AMP、啥前級擴大、後級擴大、A類、B類的一堆機器有著很大的興趣。但是都已經讀到大學了，算過無數BJT、MOSFET的題目，卻沒做過實際的擴大機電路，所以我就像藉著這次的機會來完成一下這個小小夢想。

## 找資料

但是說實在的，真空管在這個時代是只會出現在計概或電子學課本第一章的東西，我完全不知道它要怎麽用，怎麽運作，所以第一步當然就是要上網找各種資料啦~經過兩周的學習，我已經瞭解了真空管的運作原理，連直流負載線、工作點都可以設計了。至於我找到的資料會放在下面的作品報告中，可能之後也可以另外出篇來介紹。

## 開始製作

雖然知道了真空管的運作原理，但要直接設計出完整實際可用的電路對我來説還是有點難，畢竟電路是有很多東西需要考慮的。所以我就上網找了些別人設計好的電路來參考。最後我找到了這篇文章：[NP-100v12：12AU7(ECC82) / IRF510 Headphone Amp](http://diyaudioprojects.com/Solid/12AU7-IRF510-LM317-Headamp/)。然後我就照著它的電路圖來用Altium Designer 17開始繪製電路。

![](https://bucket.ziteh.dev/blog/12au7-vtha/ab8ee615.webp)

這是系統電路圖(原理圖)的部分，基本上就是照著上述文章中的電路複製重繪一次，只是我把兩聲道的電路都話出來了。

這張圖的可變電阻-開關(VR-SW1)的VR部分**其實是畫反的**，一般來説是順時針轉VR要越大聲，但我這裡畫反了，所以如果有要參考的話要在多注意一下。

![](https://bucket.ziteh.dev/blog/12au7-vtha/b97fd4ec.webp)

![](https://bucket.ziteh.dev/blog/12au7-vtha/e4b7f024.webp)

再來就是PCB電路圖，也就是Layout佈線的部分了。由於我只使用Bottom Layer，但有2條零件面跳線，分別在U1和U2的Pin3。然後U2那邊的跳線會和R7交叉到，是我當初設計的失誤。

![](https://bucket.ziteh.dev/blog/12au7-vtha/2969a6c2.webp)

然後就是把電路板洗出來然後將零件焊接上去了，做完試聽一下確定有聲音。

## 照片

![](https://bucket.ziteh.dev/blog/12au7-vtha/c34abe08.webp)

![](https://bucket.ziteh.dev/blog/12au7-vtha/6f05451d.webp)

![](https://bucket.ziteh.dev/blog/12au7-vtha/f8da7ab3.webp)

![](https://bucket.ziteh.dev/blog/12au7-vtha/8437af23.webp)

![](https://bucket.ziteh.dev/blog/12au7-vtha/6740cac2.webp)

![](https://bucket.ziteh.dev/blog/12au7-vtha/9844ff38.webp)

最後附上此作業我打的結果報告，裡面有很多我找到的真空管相關資料，有需要者可以參考看看。我將此PDF檔放在我的雲端上：[Google雲端硬碟](https://drive.google.com/file/d/1H40-AUMELtlNLMlD_a0G0DIxzHOKnHU3/view?usp=sharing)

<iframe center="" height="900" src="https://drive.google.com/file/d/1H40-AUMELtlNLMlD_a0G0DIxzHOKnHU3/preview" text-align:="" width="780"></iframe>

## 相關文章

- [真空管工作原理與結構介紹](/posts/vacuumtube/)
