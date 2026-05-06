---
title: 把Seagate Personal Cloud改裝成USB外接硬碟
author: ZiTe
tags:
  - 3C
  - DIY
  - 電子電路
categories: []
date: 2018-11-10 10:33:00
comments: true
toc: true
draft: false
# aliases: ["/2018/11/seagatepersonalcloud/"]
---

前幾天我的Seagate Personal Cloud 3TB壞掉了，拆開來測試後發現是主機板掛了，而我就想說反正它也過保了，我也懶得送修，所以就想把它改成一般的USB外接硬碟，於是這篇文章就產生了。

<!--more-->

第一步當然就是拆開外殼啦，然後就可以看到壞掉的主機板了。

![▲ 主機板](https://bucket.ziteh.dev/blog/seagatepersonalcloud/700511d0.webp)

我把我之前壞掉的2.5寸外接硬碟的電路板拿來用。不過因為2.5寸的HDD好像不用12V的電，所以該電路板上的Sata電源接座的12V是空接的。但是3.5寸的HDD需要12V的電才能運作，所以我在Sata電源接座的12V處焊上了2條線，分別是+12V（黃線）和GND（棕線）。

![▲ 從2.5寸外接硬碟拆下來的USB-to-Sata板](https://bucket.ziteh.dev/blog/seagatepersonalcloud/bfa4b5f1.webp)

然後我就拿了一個電源供應器和另一顆舊的3.5寸HDD來測試。然後因為Seagate Personal Cloud原本的電源供應器就是輸出12V的，所以我就將外加的12V電線焊上DC電源接座，就可以用原本的變壓器了。

![▲ 測試](https://bucket.ziteh.dev/blog/seagatepersonalcloud/f78aef5e.webp)

![▲ 焊上電源接座](https://bucket.ziteh.dev/blog/seagatepersonalcloud/480c1778.webp)

總之一個簡單的小改裝就完成了。未來如果有時間的話還可以考慮加上樹莓派，再度變回網路硬碟。
