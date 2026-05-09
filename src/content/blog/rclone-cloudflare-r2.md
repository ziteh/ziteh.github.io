---
title: "在 Windows 使用 Rclone 掛載 Cloudflare R2 物件儲存"
# subtitle: ""
# description: ""
tags: ["程式","教學"]
categories: ["快速分享"]
date: 2025-04-05 09:43:00+08:00
# header_img: ""
comments: true
toc: false
draft: false
---

在之前這個 Blog 的圖片都是存在一個 Blogger 上，把它當成圖床使用，但是這樣管理上不方便，而且它好像不支援 Webp 格式。

在我在 Cloudflare 上購買網域並將從 GitHub Pages 轉移到 Cloudflare Pages 上後，我也想用 [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) 來儲存並管理這些圖片。

<!--more-->

R2 是一個兼容 S3 的物件儲存服務，目前 R2 提供的免費額度如下（[官方說明](https://developers.cloudflare.com/r2/pricing/#free-tier)）：

| 類型                    | 免費額度(每月) |
| ----------------------- | -------------- |
| 儲存空間                | 10 GB-月       |
| A 類操作                | 1 百萬次請求   |
| B 類操作                | 1 千萬次請求   |
| 資料傳輸到網路 (Egress) | 基本免費       |

> A 類操作主要包括建立、列出、複製和刪除物件，以及管理貯體的作業。\
> B 類操作主要包括讀取物件及其相關聯中繼資料，以及讀取貯體設定的作業。

我想這個免費額度對我來說相當夠用了，而且就算真的不小心超額了，我覺得 R2 的收費也不會很貴，不會不小心就產生天價帳單。而且兼容 S3 代表未來我要再次轉移資料的話會方便很多。

那為了要把大量的圖片傳到 R2 上，我使用 [Rclone](https://rclone.org/) 將 R2 的 Bucket 掛載到電腦上，這樣就可以用平常操作檔案和資料夾的方式上傳檔案到 R2 了。

我是使用 [Scoop](https://scoop.sh/) 安裝 Rclone：

```bash
scoop bucket add main
scoop install main/rclone
```

另外還要安裝 WinFsp，一樣透過 Scoop：

```bash
scoop bucket add nonportable
scoop install nonportable/winfsp-np
```

再來要產生 R2 的 API Token（要先建立好 Bucket）。在 R2 管理頁面 > API > 管理 API 權杖 > 建立 API 權杖，選擇「系統管理員讀取和寫入」並調整你要的設定後建立 API 權杖。最主要會需要 3 個東西：存取金鑰識別碼、秘密存取金鑰
、針對 S3 用戶端使用管轄區域特定端點，將這 3 個值記好。

建立 Rclone 連線設定：

```bash
rclone config
```

依序選擇並輸入：

- name: 自己選擇，如 `cfr2`
- type: s3
- provider: Cloudflare
- access\_key\_id: 存取金鑰識別碼
- secret\_access\_key: 秘密存取金鑰
- region: auto
- endpoint: 針對 S3 用戶端使用管轄區域特定端點

或是 `rclone.conf` 看起來會類似：

```ini
[cfr2]
type = s3
provider = Cloudflare
access_key_id = a51b4y38b08xxxxxxxxxxxxxxxxxxxx
secret_access_key = 17b8z616k7fd2c3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
region = auto
endpoint = https://54218acxxxxxxxxxxxxxxxxxxxxxxxx.r2.cloudflarestorage.com
```

再來就可以實際掛載了，這裡掛載到 `X:`。`<BUCKET>` 記得改成你自己的 Bucket 名稱：

```bash
rclone mount cfr2:<BUCKET> X: --vfs-cache-mode writes
```

另外 Cloudflare 還有提供一個 [Images](https://www.cloudflare.com/developer-platform/products/cloudflare-images/) 的服務，專門針對影像的儲存和最佳化等功能，未來也可以研究看看。

參考：

- [架設Cloudflare R2免費圖床，給Hugo靜態網站託管圖片](https://ivonblog.com/posts/cloudflare-r2-image-hosting/)
- [使用CloudFlare R2作為部落格圖床](https://note.miksin.art/notes/cloudflare/r2_img_hosting)
- [从零开始搭建你的免费图床系统（Cloudflare R2 + WebP Cloud）](https://www.pseudoyu.com/zh/2024/06/30/free_image_hosting_system_using_r2_webp_cloud_and_picgo)
- [使用 WebP Cloud 与 Cloudflare WAF 为你的图床添加隐私和版权保护](https://www.pseudoyu.com/zh/2024/07/02/protect_your_image_using_webp_and_cloudflare_waf)
- [搭建一個有圖床和統計功能的 Blog | Pan in the Nutshell](https://blog.pan93.com/posts/create-a-blog-with-zeabur/)
