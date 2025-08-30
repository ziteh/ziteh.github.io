---
title: ErgoSNM v4.0 開發進度-08/30
subtitle: 帶軌跡球的無線分離式鍵盤開發進度
tags:
    - DIY
    - 3C
    - QMK
categories: []
date: 2025-08-30T017:00:14+08:00
comments: true
toc: true
draft: true
---

ErgoSNM 是一把我正在開發的整合軌跡球的無線分離式鍵盤。這篇文章會說明目前的開發進度。

<!--more-->

## PCB

### Core PCB

上次提到就算使用 Raytac 的 nRF52840 方案依舊需要自行處理一些 RF 法規的事情，既然失去優勢那我就換回較便宜且好焊接的 E73 模組。因此 PCB 會需要重新 Layout。

而且舊的 PCB 有個設計問題是它左右不對稱，所以我畫完了左邊還要再畫一個右邊，實在是太麻煩了，必須改善。

再來是原本選的 Buck-boost converter 的 IQ 有點太高，可能不是很適合電池應用，所以這次改成了 TI TPS63900。

USB ESD 對策改成 USBLC6-2SC6，並且增加 Shield RC filter。

![Core Board](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/core-pcb.webp)

左邊有片以 mouse-bites 連接的 T 字形的東西，那個是要拿來焊接 SMD 排針時對位的。

PCB 為了配合 USB 插座零件厚度是 1.0mm。

> 話說 JLCPCB 的 E73 現在居然要求 Standard PCBA 製程，幾個月前還不用，這個會讓成本增加不少，這次我還是用 Economic 自己手工焊接。

### Main PCB

![Main Board](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/main-pcb.webp)

雖然原本主 PCB 算是已經 Layout 完成，已經開始在畫外殼，但是我外殼畫著畫著就覺得這個形狀和體積有點不符合預期，所以我也重新 Layout 了。

一重新 Layout 就改了 4 個版本，一直來回調整，最後才完成一個覺得比較可以的版本。和原本的設計比起來最主要的差別是兩片 PCB 的連接方式從 FPC 改成 1.27mm 雙排針。

主 PCB 一樣維持 reversible 的設計，左右手用的其實是同一片，這樣可以讓我少設計一片，而且如果未來有人沒上車想要自己向 PCB 廠訂的話，也不會因為最小訂量導致成本太高。

PCB 保持支援 MX 和 Choc V2 的 hot swap 支援，加上 reversible 的設計，導致這個 PCB 的 Layout 沒有我想象中容易。

![For Early Supporters 字樣](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/pcb-early.webp)

之前說的預計第一批 4 組的 PCB 上會有類似這樣的 For Early Supporters 字樣。

### Thumb Cluster

![Thumb Cluster & 2 Key Board](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/pcb-tc-2k.webp)

為了可以支援 MX 和 Choc V2 hot swap，Thumb cluster PCB 也重新 Layou 了，不過這個沒啥特別的。

另外就是我這次想要在右手拇指曲的部分再加上 2 個按鍵，所以有多一片 2 key PCB。受限於空間是沒辦法用 FPC 了，只能直接焊線。

### PMW3610 PCB

![紫色的 Rev 1，藍色是 Rev 2](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/pcb-pmw3610.webp)

這次也順便更新了原本的 PMW3610 滑鼠光學感測器的 PCB。紫色是舊的 v1，藍色是新的 v2。

這個更新的重點是將 FPC 連接器也改到正面，方便焊接，和增加 RESET pin。這次除了 PMW3610 PCB 維持 1.6mm，其他都是用 1.0mm。

我這個 PMW3610 PCB 好像有點名氣，網路上看過幾個不同的國外商店都在販賣。

## 外殼

！[外殼](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/case1.webp)

外殼是用 SLA 3D 列印的，也是我一直以來最不擅長的部分。而且為了貫徹開源硬體 OSHW 的精神，我這次將 CAD 軟體也改成了開源的 FreeCAD，不少小東西要新學。

實際上我目前也還沒完成底蓋的設計，因為遇到一些技術問題。這次也就先隨便畫一個腳頂著用。不過老實說正常使用時應該是看不到底蓋的，所以說底蓋什麼的只是裝飾，上面的大人物是不會懂的。

這次測試了 3 種材質，分別是白樹脂，黑樹脂，白樹脂+霧面黑噴漆。我覺得效果都不錯。

![左側。黑樹脂](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/case-left.webp)

這是左側，使用黑樹脂成型色。SLA 還是多少有點層紋，但真的要很仔細看才看得到。

![右側。白樹脂噴黑漆](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/case-right.webp)

這是右側，使用白樹脂噴黑漆。霧面黑也很不錯，比單純的黑樹脂更黑一點，而且噴漆會蓋掉原本的層紋，但是會有點垂流，漆膜不是很平均。

臨時腳柱是用白樹脂，看起來也滿不錯的。

然後就是 3D 列印件難免會遇到的翹曲變形問題，因為這次想要支援 Choc V2 所以整個外殼壁變得很薄，也沒空間加肋。

![](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/case-bug.webp)

孔位好像畫偏了。

![](https://bucket.ziteh.dev/blog/ergosnm-4-0-0-0830/case2.webp)

可以看到 2 key PCB 放不進去外殼，這個是外殼的尺寸畫錯了。

## 小結

這些 PCB 和外殼才剛到，我還沒焊接和組裝起來測試，而且可以看到還有一些問題需要修正。
