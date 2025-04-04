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

![KiCanvas 主畫面](https://bucket.ziteh.dev/blog/kicanvas-intro/68cc8242.webp)

如果想要直接查看 GitHub repo 中的 KiCAD 檔案的話，只要貼上 `.kicad_sch` 與 `.kicad_pcb` 檔案所在的 GitHub 連結即可。

例如我的 [RP Micro](https://github.com/ziteh/rp-micro) 開發板，KiCad 檔案在 repo 中的 `hardware/` 資料夾中，那就是貼上網址：`https://github.com/ziteh/rp-micro/tree/main/hardware`。

![預覽 RP Micro 的 Schematic](https://bucket.ziteh.dev/blog/kicanvas-intro/b9265a04.webp)

要查看 PCB Layers 或其它檔案的話，點選左上角的資料夾圖樣按鈕，再選擇要查看的檔案即可。

![透過左上角的資料夾按鈕切換要檢視的檔案](https://bucket.ziteh.dev/blog/kicanvas-intro/fd66513d.webp)

![預覽 RP Micro 的 PCB Layers](https://bucket.ziteh.dev/blog/kicanvas-intro/089ef9e0.webp)

在右側的不同選單中，也可以切換要顯示的 Layers、調整不同物件的透明度或查看各個零件的屬性。

![切換要顯示的 Layers](https://bucket.ziteh.dev/blog/kicanvas-intro/ff6ad886.webp)

![調整物件的透明度](https://bucket.ziteh.dev/blog/kicanvas-intro/74ebee5b.webp)

![查看零件屬性](https://bucket.ziteh.dev/blog/kicanvas-intro/2805d2c6.webp)

最後附上 KiCanvas 的 GitHub repo：[theacodes/kicanvas: The KiCAD web viewer](https://github.com/theacodes/kicanvas)

相關文章：
- [KiCanvas Helps Teach And Share KiCad Projects In Browsers | Hackaday](https://hackaday.com/2023/01/31/kicanvas-helps-teach-and-share-kicad-projects-in-browsers/)
- [Thea Flowers' KiCanvas Lets You View KiCad Projects Directly in Your Browser - Hackster.io](https://www.hackster.io/news/thea-flowers-kicanvas-lets-you-view-kicad-projects-directly-in-your-browser-c610d16c558e)
