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

![▲ 主機板](https://1.bp.blogspot.com/-x7dp6JOc8-4/XppnpsjDQbI/AAAAAAAACHI/Wuh-IGCGuZM-0R0WJOD6Pw5BMOsyJSVtwCPcBGAsYHg/s640/DSC_0020.jpg)

我把我之前壞掉的2.5寸外接硬碟的電路板拿來用。不過因為2.5寸的HDD好像不用12V的電，所以該電路板上的Sata電源接座的12V是空接的。但是3.5寸的HDD需要12V的電才能運作，所以我在Sata電源接座的12V處焊上了2條線，分別是+12V（黃線）和GND（棕線）。

![▲ 從2.5寸外接硬碟拆下來的USB-to-Sata板](https://1.bp.blogspot.com/-ZvOLPwbKQ9A/Xppnpg8NXiI/AAAAAAAACHI/hHe4ZGf5wbUcvj_C6mfIp_elj1mKinQ_wCPcBGAsYHg/s1600/DSC_0038.jpg)

然後我就拿了一個電源供應器和另一顆舊的3.5寸HDD來測試。然後因為Seagate Personal Cloud原本的電源供應器就是輸出12V的，所以我就將外加的12V電線焊上DC電源接座，就可以用原本的變壓器了。

![▲ 測試](https://1.bp.blogspot.com/-moZb8s4vIRs/Xppnpo1VKII/AAAAAAAACHI/lny_48929VIPfbevah21RbAJsGdV26sTgCPcBGAsYHg/s1600/DSC_0036.jpg)

![▲ 焊上電源接座](https://1.bp.blogspot.com/-s3dxPY4la3A/XppnptsoGKI/AAAAAAAACHI/_pXPIWNKrBY1XTLM3Kcp13dT_gdLPqJ-ACPcBGAsYHg/s1600/DSC_0080.jpg)

總之一個簡單的小改裝就完成了。未來如果有時間的話還可以考慮加上樹莓派，再度變回網路硬碟。
