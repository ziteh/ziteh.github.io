---
title: "KiCanvas——線上預覽KiCAD電路圖"
# subtitle: ""
# description: ""
tags:
  - 電子電路
categories: []

date: 2023-04-25T23:23:49+08:00
# header_img: ""
comments: true
toc: false
draft: false
---

[KiCanvas](https://kicanvas.org/) 是一個基於瀏覽器的開源 [KiCAD](https://www.kicad.org/) Schematic、PCB 電路板檢視器。可以透過直接貼上 GitHub 連結或開啓本機檔案來查看 KiCAD 電路圖。

以往如果我想要查看 GitHub 上的 KiCAD 電路圖，都要把整個 repo 載下來，再用 KiCAD 開啓。但用 KiCanvas 就可以直接貼上網址，不用特別下載下來，對我來說還滿方便的。

<!--more-->

> 目前還處在 alpha 開發階段，但基本功能都已經有了。

![KiCanvas 主畫面](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpD8NFgRtcWxRtqCKinbuZXZUDZWuzFe6MmucNcSzcU1bVX2sGnSAmYBolnkRzUDcRtCKDRoXUhXx1KI6efW9mCpnOdUvu2DJHID44ibjJ2IydyJ6SE6-ckD7nRY9eOtLv-t6Br2smYn_oXsCs1gq0sHGtb1cIp-R6S4ZMwC-cdA1WFJy-aMNTElWg/s16000/Screenshot%202023-04-25%20at%2023-29-52%20https%20__kicanvas.org.png)

如果想要直接查看 GitHub repo 中的 KiCAD 檔案的話，只要貼上 `.kicad_sch` 與 `.kicad_pcb` 檔案所在的 GitHub 連結即可。

例如我的 [RP Micro](https://github.com/ziteh/rp-micro) 開發板，KiCad 檔案在 repo 中的 `hardware/` 資料夾中，那就是貼上網址：`https://github.com/ziteh/rp-micro/tree/main/hardware`。

![預覽 RP Micro 的 Schematic](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgr8gdN5_nTa7Rga7NtiuF7bhd8M6XlYz13C-0oplJFh2E6QPz08AI07-RAwCDMawo_RUkaewAbj3vKOtxTrKO7XFCVjEQJX-gJnzZUh5yzzDkPRSleVPSTd-R4FD-XBrHtI8HJsqvKaq82PmlJ_MmSA893yoB4nFEvg6-8B1WKllzbRfdBGBWulNIJ/s16000/Screenshot%202023-04-25%20at%2023-35-45%20https%20__kicanvas.org.png)

要查看 PCB Layers 或其它檔案的話，點選左上角的資料夾圖樣按鈕，再選擇要查看的檔案即可。

![透過左上角的資料夾按鈕切換要檢視的檔案](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWcP5_i3etRO_qSXTY_NhQXRoALRQysMm2kPrLWlFk8fVMY5fxnfTXtLmnxZv6g0jchFFA_bhcaRd07vbBkcAvWG5d5z-OI1stBwYrv_NdDSda28QdIyqQk1GxwZ0WDV1HPbbUcwdBcmgUzA_ONFiyaDhcJfkXH3KFoYxFRKtcLvXnTNkAndnIjS_q/s16000/Screenshot%202023-04-25%20at%2023-36-55%20https%20__kicanvas.org.png)

![預覽 RP Micro 的 PCB Layers](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-IAwlH2SbUcSeT6R8J-7QdudNboZW9rzLECGVqPUSDcle-6JQn_l43iVXyxgEdAHRaBlRL8xH_0DcmSnmpBWmwogj3hsKNjW1xl7tC6EPGH7NCA6FKtcqh6JYKxmoUaqaQZ0aG7ORyIIWPlmyXE5Lz8Nd0UJ05Rod9qMg50gQvmT0tUvNyTuZroiE/s16000/Screenshot%202023-04-25%20at%2023-44-32%20https%20__kicanvas.org.png)

在右側的不同選單中，也可以切換要顯示的 Layers、調整不同物件的透明度或查看各個零件的屬性。

![切換要顯示的 Layers](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiqyzJ2lc5USauqMFKqreOHu2mwSXb6qG9yrnvZrRNf61r1eyc8c25nqwv2AfTSEGggVVKSoi9s6k2weDg9inP4IH292ranTq1iZlDkjevPclW73ONWubOLL-g07XbBltmFbwWI9WIJnw2z23T_x4b09kWu288KKc-fW1ZpMcMtPsDKaI7bgnLOqa-/s16000/Screenshot%202023-04-25%20at%2023-44-54%20https%20__kicanvas.org.png)

![調整物件的透明度](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBuWhZO7S2n6jKOVwCXhekumk-f9ubJdrwClOKQv3ptpsxSNrHf_q_slgQ2ti5JDKs629azeWn9-h5Y9gZbHc19WvAvKEwUGtAyPT9rD6XHeLVPXhuqPlKQ6W9TQRP8aOT0Tt-TUqfMl2vAsJBQHA0gdaAI47LNnvqO4uRdIYwxvBK_Cjcf9iEDOjG/s16000/Screenshot%202023-04-25%20at%2023-41-59%20https%20__kicanvas.org.png)

![查看零件屬性](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFabLGHKZ-wguj96OqgcUDWBYdG6beVEgA3VHEH1IzXm6_x2C_2YA2f5oNH_53kCPfdHpCE5VIGNW4KvheNKMXjZkfN7DP7yRca1xfFPkHUjK-I9JRkzwb3Cfzpkw7tIk0N0DZKMIj2YsT4MS6QrOxLLwaomBpKXnzh7SRdzS2D1YplRlR1mCsjsY1/s16000/Screenshot%202023-04-25%20at%2023-42-34%20https%20__kicanvas.org.png)

最後附上 KiCanvas 的 GitHub repo：[theacodes/kicanvas: The KiCAD web viewer](https://github.com/theacodes/kicanvas)

相關文章：
- [KiCanvas Helps Teach And Share KiCad Projects In Browsers | Hackaday](https://hackaday.com/2023/01/31/kicanvas-helps-teach-and-share-kicad-projects-in-browsers/)
- [Thea Flowers' KiCanvas Lets You View KiCad Projects Directly in Your Browser - Hackster.io](https://www.hackster.io/news/thea-flowers-kicanvas-lets-you-view-kicad-projects-directly-in-your-browser-c610d16c558e)
