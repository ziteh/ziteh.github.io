---
title: 資料儲存備份方案比較 包含雲端空間、HDD硬碟、NAS、DAS和千年光碟
author: ZiTe
tags:
  - 3C
categories: []
date: 2019-02-09 10:28:00
comments: true
toc: true
draft: false
aliases: ["/2019/02/hddnasdas/"]
---
![](https://1.bp.blogspot.com/-cV0dFgZPWAg/XppmO8WAZFI/AAAAAAAACG8/8M8Q9oJp_jcgiTlR0X7qLgL1KnQ0pc-XwCPcBGAsYHg/s640/DSC_0045.jpg)


# 前言
自從我開始拍照後，硬碟空間就是各種不夠。再加上現在勒索病毒的可怕，也讓我更加重視資料備份。而最近硬碟空間又快要不夠了，所以就剛好來比較看看現在可行的資料備份方案。

<!--more-->

那就直接來看我整理的結果：

<iframe height="1130" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRkQ-NXeQqlOE_XGwrTKusVfDjMgc0xYsIbN_DIDsBc_aH14kHWDTMvyStrQqEp-Md1jaOGG32JEhrm/pubhtml?widget=true&amp;headers=false" width="820"></iframe><br />


\*其中我將相同類型中最便宜的用紅色字體表示，最貴的用藍色字體表示。

首先我先來説明所謂的「雲端空間」和「雲端備份」有什麽不同。「雲端備份」就是單純用來備份的，最大的不同大概是它可能沒有辦法用來分享檔案；而在表中，也可以看見我把Google雲端、Dropbox和Mega這些分為雲端空間，因為它們都可以分享檔案給其他人。

那M-Disc千年光碟又是什麽？簡單講它就是用較特殊的材質做的光碟，並號稱讓光碟的壽命可以有千年之久。而要燒製M-Disc光碟的話，燒錄機也要有支援才行，不過讀取的話就用一般的DVD或BD藍光播放器就可以了。


# 淺談備份備援

數位資料可以説是現代人相當重要的「資產」之一，每當爆發勒索病毒時，網路上總是會看到一片哀嚎。而現在要避免病毒最好的方法，我認為單純資安觀念和防毒軟體是不夠的，而是要搭配良好的「備份」。

而備份也不是說你多買顆硬碟裝在電腦上，然後把檔案複製上去就好了。如果是這樣的話，如果電腦的電源供應器心情不好燒掉了，還連帶整臺電腦一起帶走，那這樣的備份還是沒用。所以關於備份的其中一個觀念就是要「異地備份」，也就是要把備份的資料放在不同的地方。像Google、Microsoft等大企業的資料中心都是片佈世界各地的。而我們個人的備份當然也要盡量做到異地備份。

而我們還要考慮到硬碟的壽命問題，現在一般的消費級HDD都是3年保固，而根據Backblaze的統計結果來看，使用超過3年的HDD硬碟故障率會大幅上升。所以這時就要使用到所謂的RAID(Redundant Array of Independent Disks，獨立硬碟冗餘陣列)也就是一般常說的磁碟陣列。RAID的類型有很多種，較常聼到的就是RAID0、RAID1、RAID5和RAID6，這四個類型出來RAID0不具有資料保護的能力外，另外三種都可以在一定數量的硬碟損毀時，保護好你的資料。而RAID説起來又一篇了，有興趣者還請上網查詢更多相關資料，在此就不贅述了。


# 總結

希望這篇文章對於你的資料備份方案可以有幫助。最後講個兩句我很喜歡的話：
「硬碟有價，資料無價。」
「意外就是要在意想不到時發生才叫意外。」
