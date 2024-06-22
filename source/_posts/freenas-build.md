---
title: 自組 FreeNAS
author: ZiTe
tags:
  - 3C
  - DIY

categories: []
date: 2020-12-03 16:19:00
comments: true
toc: true
draft: false
aliases: ["/2020/12/freenas-build/"]
---
![](https://1.bp.blogspot.com/-gu_QKiKQcY8/X8ieYisKAXI/AAAAAAAACtM/oibWqubpBFocWo7czgWtGE7ai6VAk2i0wCPcBGAsYHg/s4544/IMG_20201103_225204.jpg)

# 前言

隨著 Google 宣佈 Google Photos 在 2021 年 6 月 後不會有無限儲存高畫質相片的服務後，大家也紛紛開始擔心再未來連學術帳號的雲端無限空間也會被影響。

而且在現代，數位資料的安全性是非常重要的，有許多重要的照片或文件都只會以電子檔案的方式保存，一旦儲存這些檔案的硬碟出現問題，往往都是非常麻煩的事情，就算資料救援有成功，但其花費也是不少。

因此越來越多人開始使用 NAS。對於一般人，買有現成的品牌 NAS 其實就非常好用了，但是如果對於電腦方面比較在行的話，也是有自己組裝一臺 NAS 的選擇，這樣做的話雖然會比較麻煩，但可以讓自己擁有更大的選擇彈性。

而本文要介紹的就是現在在自組 NAS 中非常多人使用的作業系統——[FreeNAS](https://www.freenas.org/)。

FreeNAS 是基於 FreeBSD 的開源 NAS 系統，作爲開源軟體，它也是免費的，因此世界上有非常多人在使用它，使用者社群可以說是非常完善，官方文件也很豐富。

<!--more-->

# 硬體規格

首先是硬體規格的部分。由於 FreeNAS 使用的檔案系統爲 ZFS，對硬體的要求與其它常見的 NAS 系統如 OpenMediaVault 是比較高的。

根據[ FreeNAS 官方硬體需求手冊](https://www.freenas.org/hardware-requirements/)，建議你要有 64 位元的 CPU、至少 8GB 以上的硬碟來儲存作業系統、至少 8GB 以上的記憶體，甚至非常建議使用 ECC RAM。

其中以 ECC RAM 這部分是比較麻煩的，因爲一般人的電腦不會用 ECC RAM，也不是所有的 CPU、MB 都支援 ECC RAM，通常是偏伺服器的零件才會支援、例如 Intel Xeon CPU。如果要使用 ECC RAM 的話，處了需要 ECC RAM 外，CPU 及 MB 也都要支援 ECC RAM 才可以。值得一提的是 AMD Ryzen CPU 全部都支援 ECC RAM，不過 MB 的部分就還是要再看看各產品是否有支援 ECC RAM。

不過我這臺就只是先拿一堆舊的零件來試用看看，所以就沒有使用 ECC RAM。以下的零件都是舊電腦換下來的，只有 CPU、CASE 和 其中一條 RAM 是又另外買的二手貨。價格方面就只是個參考。

機殼的話我選了一個套裝機的舊機殼，這種套裝機殼的特色就是會有許多免工具拆裝的設計。而我選的這個殼的其中一個很重要的原因是它有 4 個 3.5” 與 2 個 5.25" 槽，可以裝最多 4+3 個 3.5“ 硬碟，對於 NAS 的機殼來說可以裝多少硬碟是很重要的。

▼ 硬體零件列表
| 項目 | 型號                                       | 價格($NT) |
| ---- | ------------------------------------------ | --------- |
| CPU  | Intel Pentium G3260 3.3GHz 2C2T (1150腳位) | 300       |
| MB   | ASUS B85M-G R2.0 (mATX)                    | 2000      |
| RAM  | Kingston DDR3 1600MHz 4GB*2                | 500       |
| PSU  | Corsair CX500 500W                         | 1500      |
| CASE | acer Veriton 套裝機殼                      | 200       |

![▲ 組裝完成的硬體。](https://1.bp.blogspot.com/-l95qJ_1T8sw/X8ieYiN8cSI/AAAAAAAACtM/ViRcu5-SbKksvSF4KPuJkXqHEZM7_9frQCPcBGAsYHg/s4549/IMG_20201103_224301.jpg)

# 安裝 FreeNAS

就和其它作業系統一樣，要安裝 FreeNAS 的話通常會使用開機碟的方式。準備一個隨身碟來將 FreeNAS 燒入，並在組裝好的電腦上以此開機碟開機。成功後就會進入 FreeNAS 的安裝程式。

![▲ FreeNAS 安裝畫面](https://1.bp.blogspot.com/-aAMHiIQJI00/X8ieYsHKcHI/AAAAAAAACtM/gwPav_5ptBAOihi9AiSLqjlKOEjCtpXKQCPcBGAsYHg/s3877/IMG_20201029_235227.jpg)

安裝過程中除了要設定 root 使用者的密碼外，沒有什麼特別要設定的，唯一要注意的就是在選擇要將系統安裝進哪一個（或多個）硬碟時，因爲被選擇作爲系統硬碟的該硬碟就只能儲存系統資料，也就是它不能用來出處其它的檔案，因此要注意系統碟要與資料碟分開，像是我就是拿了一個 16 GB 的隨身碟來當做系統碟。

安裝完成後就可以將開機碟移除，以系統碟開機。如果你的 FreeNAS 主機有接螢幕與網路的話，在開機完成後它會顯示該 FreeNAS 的網路位置，只要在瀏覽器上輸入該網址就可以進入 FreeNAS 的管理介面，並以 root 帳號密碼登入就可以了。

![▲ FreeNAS 管理介面](https://1.bp.blogspot.com/-i-Ciaw6tjSA/X8ieYu0BnmI/AAAAAAAACtM/-cZhZDbYpFgLh4Zw2Q1nhWjoj23KBUfIwCPcBGAsYHg/s1920/Screenshot_2020-12-03%2BFreeNAS%2B-%2B140%2B130%2B32%2B69.png)

# 結語

由於目前這臺 FreeNAS 只是我先組起來測試用的，因此資料碟也只裝了一個舊 HDD，所以我就只是簡單地記錄一下第一次組裝的過程。

FreeNAS 上面有非常多的功能，例如檔案快照系統、擴充功能及虛擬機。未來如果我有用到的話就再另做介紹。
