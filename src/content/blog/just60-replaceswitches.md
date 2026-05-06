---
title: 自組60%藍牙機械鍵盤-Just60 後續改軸
author: ZiTe
tags:
  - 電子電路
  - 3C
  - DIY
categories: []
date: 2020-03-31 16:59:00
comments: true
toc: true
draft: false
# aliases: ["/2020/03/just60-replaceswitches/"]
---

![](https://bucket.ziteh.dev/blog/just60-replaceswitches/fd301cd3.webp)

## 前言

之前在[\[開箱\]自組60%藍牙機械鍵盤-Just60](/posts/unbox-just60)一文中介紹了我組裝Just60的過程，在我使用到目前為止的3個多月下來都沒有什麼太大的問題。不過因為我的鍵位配列方案相當緊湊，尤其是左Shift從正常的2.25U變成只有1U的長度，使用起來還是多少有些不習慣，經常誤觸，甚至連帶著左Ctrl也變得容易按錯。

<!--more-->

為了解決此問題，所以我必須想辦法讓我可以透過觸覺來確認自己按下的是什麼鍵。一開始是想用不同材質的鍵帽來做區分，但1.25U的鍵帽如Ctrl就比較麻煩了。

![▲ 太豪的軟質鍵帽，用此作為觸覺的區分效果非常好。](https://bucket.ziteh.dev/blog/just60-replaceswitches/d7d69b21.webp)

再來，除了上述的誤觸問題外，因為我的使用習慣，會時常需要快速連按Backspace、Delete和方向鍵。但現在這些鍵使用的鍵軸分別是黑軸和靜音紅軸。靜音紅軸就算了，但是黑軸實在是不適合快速連打，所以我也打算換掉。

綜合上述，我最後決定透過“混軸”來解決以上兩點問題。透過混軸，我至少可以在按下的瞬間判斷出我是不是按對了。

我原本的主要按鍵（如ABC、123）和方向鍵都是用靜音紅軸，功能鍵（如Shift、Ctrl、Tab）則是用黑軸。而我打算把Shift換成Gateron青軸，Ctrl和Alt換成Gateron茶軸，而需要快速連按的Backspace、Delete和方向鍵換成更輕的Gateron白軸（觸發：35g。Cherry靜音紅軸為45g）。

![▲ 原先的鍵軸配置。](https://bucket.ziteh.dev/blog/just60-replaceswitches/d95f208e.webp)

至於選擇Gateron（佳達隆）的鍵軸而非Cherry軸主要是為了嚐鮮、玩玩，並無什麼更深層的考量，頂多也就價位的關係吧。

## 開工

我自認焊接技術還行，但拆焊的功夫就真的不太行了，畢竟沒有什麼練習的機會。而且面對一塊破千元的PCB，我不敢用“拍”的方式來將焊錫甩落，只能乖乖的使用吸錫器來進行拆焊作業。

![▲ 由左至右分別為Gateron的白軸、茶軸和青軸。](https://bucket.ziteh.dev/blog/just60-replaceswitches/e2598b7f.webp)

![▲ 先將鍵盤拆開、電池拔掉，並把鍵帽拆掉。](https://bucket.ziteh.dev/blog/just60-replaceswitches/3f6b3a0f.webp)

![▲ 備好工具來開工。右上角的Backspace已經解焊完成了。](https://bucket.ziteh.dev/blog/just60-replaceswitches/2964a1b7.webp)

![▲ 已拆焊的焊盤。](https://bucket.ziteh.dev/blog/just60-replaceswitches/96781c63.webp)

![▲ 已拆焊的鍵軸。](https://bucket.ziteh.dev/blog/just60-replaceswitches/40d87754.webp)

![▲ 要換的鍵軸都已拆下。](https://bucket.ziteh.dev/blog/just60-replaceswitches/60533088.webp)

![▲ 焊上新鍵軸。](https://bucket.ziteh.dev/blog/just60-replaceswitches/fd301cd3.webp)

最後再將鍵盤組回就完成了。

## 結語

一開始解焊的時候實在是非常難搞，但拆到約3、4顆時就可以抓到訣竅了，之後拆焊的速度也就非常快了。

值得一提的是，一開始換完軸時，我發現會有一些軸有誤觸發（長壓、連點等），一開始還以為是Gateron的鍵軸品質問題，後來發現應該是焊錫膏的關係。之後我用酒精和刷子清潔過各焊點就沒問題了。

後續使用上也沒有問題了，混軸確實也有解決我的問題，尤其Gateron白軸連按起來那輕盈的觸感實在是很棒！

所以現在我的Just60上總共混了5種鍵軸：Cherry黑、Cherry靜音紅、Gateron青、Gateron茶與Gateron白。

## 相關文章

- [\[開箱\]自組60%藍牙機械鍵盤-Just60](/posts/unbox-just60)
