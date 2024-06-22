---
title: "一種巧妙及噁心並具的 C 語言寫法：達夫裝置 (Duff's device)"
subtitle: ""
# description: ""
tags: ["程式"]
series: []
# categories: []
date: 2024-06-17T20:25:00+08:00
header_img: ""
comment: true
toc: false
draft: false
---

[達夫裝置（Duff's device）](https://zh.wikipedia.org/zh-tw/%E8%BE%BE%E5%A4%AB%E8%AE%BE%E5%A4%87) 是一種用來進行複製的特殊寫法，它非常巧妙地運用 C 語言 `switch-case` 的特性來達成，但這種寫法真的令人覺得噁心（包含[作者自己也使用 Disgusting 來描述](http://www.lysator.liu.se/c/duffs-device.html)）。

<!--more-->

它最初被用來改善運行速度，雖然在現代，編譯器最佳化後普通寫法的效能可以輕鬆達到並超越這種寫法，所以我們確實不用再實際用到這種寫法了。

更何況 `memcpy()` 比它好看太多了，而且各個平台和編譯器可能會對它有額外的最佳化，但我覺得 Duff's device 還是相當值得看看。

```c
// Duff's device
send(to, from, count)
register short *to, *from;
register count;
{
	register n = (count + 7) / 8;
	switch (count % 8) {
	case 0:	do { *to = *from++;
	case 7:		 *to = *from++;
	case 6:		 *to = *from++;
	case 5:		 *to = *from++;
	case 4:	     *to = *from++;
	case 3:      *to = *from++;
	case 2:      *to = *from++;
	case 1:      *to = *from++;
	        } while (--n > 0);
	}
}
```

看！我第一次知道 `case` 可以打破並穿插在同一個 block 之間，在裡面像 `goto` 一樣跳轉。

# 參考

- [達夫裝置 - 維基百科，自由的百科全書](https://zh.wikipedia.org/zh-tw/%E8%BE%BE%E5%A4%AB%E8%AE%BE%E5%A4%87)
- [Tom Duff on Duff's Device](http://www.lysator.liu.se/c/duffs-device.html)
- [001 - Duff’s device | The Art in Code](https://theartincode.stanis.me/001-duffs-device/)
- [How does Duff's Device work? - GeeksforGeeks](https://www.geeksforgeeks.org/duffs-device-work/)
