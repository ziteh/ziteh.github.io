---
title: 一種 TrueNAS/ZFS-to-S3 的備份工具概念
tags:
    - 生活
    - 程式
    - Rust
categories: []
date: 2025-09-09T08:40:00+08:00
comments: true
toc: true
draft: false
---

為了將 TrueNAS 上的檔案有效的備份到 AWS S3 Glacier Deep Archive 上，我構思了一個基本的備份工具概念。雖然目前這個工具沒有實現，但我可以記錄一些想法。

<!--more-->

## 問題

我現在的 NAS 是 TrueNAS Scale，為了符合[備份 3-2-1](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/)，我需要一個離機的遠端備份。之前我都是買 Dropbox 的 2TB 空間來儲存，但是這種方式有一些缺點：

1. 離機備份屬於最後一道防線，除非其它備份手段都失效了，才會從離機備份還原。也就是說基本上可以將離機備份的資料視為冷資料，但是用 Dropbox 或 Google Drive 這種雲端儲存來存冷資料其實不太划算，因為他們允許資料隨時都可以存取。
2. 很多雲端儲存服務都只提供最大 2TB 的空間，再上去就只有企業方案了。我用過 [IDrive](https://www.idrive.com/) 可以提供更大的空間，而且也很便宜，但是我不是很喜歡它們的工具，而且它們看起來也不提供 API 來繞過工具使用服務。

### 儲存方案

為了解決這些缺點，我將目標放在 [AWS S3 Glacier Deep Archive](https://aws.amazon.com/tw/s3/storage-classes/glacier/)。AWS S3 是所謂的物件儲存，和一般人用的 Dropbox 或 Google Drive 不同，基本上是公司企業在用，至少也是開發人員，因為它不會提供什麼好看方便的 GUI，大多數情況都是透過 CLI 或 SDK 讓程式去處理檔案的管理作業，而不是人工。它們的使用場景不同。

AWS S3 有這些特色（根據實際方案而定）：

1. [資料安全與可用性](https://docs.aws.amazon.com/zh_tw/AmazonS3/latest/userguide/DataDurability.html)。AWS 作為面向公司企業的服務，資料的安全可用就很重要。AWS 都是以*區域*進行儲存，而每個*區域*至少都有 3 個*可用區*，而每個*可用區*都是一或多個獨立的資料中心，各自擁有電源和網路，且各個*可用區*之間都會距離數公里遠。也就是說撇除特定的方案，儲存在 AWS S3 的資料實際上會同時存放在至少 3 個距離數公里遠的獨立資料中心，就算其中一個資料中心出事了，那資料還是安全。
2. 用多少付多少。大部分的物件儲存都是這種模式，通常不會限制你的最低或最高空間，你要 1GB 那就付 1GB 的錢，你要 10TB 那就付 10TB 的錢，相當靈活。
3. 版本控制和物件鎖定。版本控制這個很好理解，物件鎖定就是可以鎖定一個檔案的*狀態*，以免人禍導致的資料損壞，也就是誤刪之類的情況。
4. 不同的區域價格不同。AWS 有很多*區域*可供選擇，不過不同的*區域*各種價格可能不同，最便宜的通常是 **美國東部-維吉尼亞北部 `us-east-1`**。

### Glacier Deep Archive

S3 有很多種不同的方案，適合不同的情景。對我的離機備份來說最適合的是 Glacier 的 Deep Archive。Glacier 是專門為不常存取的冷資料提供的方案，它們通常有更多的儲存空間成本，但是相對的如果你要*讀取*上面的資料就會有比較多的限制。Deep Archive 是 Glacier 裡最深層的資料封存方案，用於儲存那些最少存取的資料，相應的它也擁有全 S3 方案中**最低的儲存空間成本**。

如果要使用 S3 Glacier Deep Archive，可能要注意的*缺點*有：

1. 極高的資料傳輸費用。和 Google Drive 不同，大多數的物件儲存都會對資料傳輸收取流量費用。從 [AWS S3 定價頁面](https://aws.amazon.com/tw/s3/pricing/?nc=sn&loc=4) 可以看到以標準的計費每 1000 個資料截取請求需要 USD 0.1，且每 GB 要 USD 0.02。如果你一天到晚在下載檔案的話那帳單會很精彩。
2. 各種指令都要錢。不只是資料傳輸，物件儲存通常也會對各種指令計費，也就是 API 次數費用。簡單說就是你下個 `LIST` 看看有什麼檔案都會被收費，而 Glacier Deep Archive 的費用會比較高。
3. 生命週期轉換費用。*生命週期轉換* 是指你把儲存在 S3 上的一個檔案從 A 方案轉換成 B 方案，例如一個檔案原本是屬於 S3 Standard，但是後來發現它不常存取，那就可以透過生命週期轉換直接把它改成適合冷資料的 S3 Glacier。生命週期轉換也需要計費，且 Glacier Deep Archive 是最貴的。
4. 最低儲存期間。S3 Glacier 都有最低儲存天數的限制，如果你在最低天數前刪除、覆寫或轉換一個檔案的話，還是會依比例收取剩餘天數的費用。Glacier Deep Archive 的最低儲存天數是 180 天，簡單說就是一旦檔案傳上去那就是半年不能刪，否則不划算。
5. 存取時間慢。S3 Glacier 當你下達資料截取請求後，你還沒辦法直接下載檔案，它們會需要一些準備時間。Glacier Deep Archive 需要最長 12hr 的時間。

但是前面也說了，我的離機備份屬於冷資料，而且是冷到不能再冷的那種，只有其它備份手段都失效時才會存取的。也就是說如果我其它備份手段沒有什麼問題的話，理論上我一輩子也不會需要存取 Glacier Deep Archive 一次，那上面這些缺點就不是那麼重要了。相對的，我們可以很好的享受它最大的優點——最低的儲存空間成本。

## 構思方案

最重要的儲存空間決定了，那接下來就有設計備份該如何進行，以確保這個過程可以更好的配合 Glacier Deep Archive 的特性。

首先我想要訂一些 spec

1. 儘可能減少 API 操作數以降低費用
2. 資料客戶端加密，加密後無法存取其內容，甚至也無法辨識檔名和資料夾名稱
3. 要能夠差異、增量備份，減少資料傳輸量以降低費用
4. 要能夠確保並驗證資料完整性，避免備份過程資料損壞
5. 確保遠端資料安全
6. 備份過程的各種資訊要以非揮發性介質儲存，且要可以隨時恢復，因為我的 NAS 是會關機的

首先我想到的是 [Rclone](https://rclone.org/)。這是一個很有名的檔案同步軟體，支援包含 S3 在內的很多不同的後端，而且它有差異備份和加密和其它各種功能。不過我架了一個 [MinIO](https://www.min.io/) 來測試後發現我沒有辦法很好的控制 API 數量，雖然它有一些選項可以降低整體的 API 操作數，但是我覺得應該可以降得更低。

### 可行性

我在想，如果想要更低的 API 操作數，還是要自己寫一個量身定做的程式才行。

首先是客戶端加密，這個是沒什麼難度，隨便找一個成熟的加密工具和算法就可以了，例如 [GnuPG](https://www.gnupg.org/) 或 [age](https://github.com/FiloSottile/age)。

差異和增量備份比較複雜，因為我需要有一套手段可以檢查目前的檔案和上一次的檔案具體變化差異是什麼，但是因為 Glacier Deep Archive 的資料截取和 API 價格，檢查必須完全在本地端完成，如果需要讀取遠端的資料的話那價格會很高。後來我想來想去覺得最適合的方式是利用 ZFS 的 snapshot 快照系統。因為我的資料本來就是存在 TrueNAS Scale 上，也本來就有啟用 snapshot，而 ZFS 有提供一個 `zfs send` 指令可以匯出指定的 snapshot 成檔案，而且本身就支援增量。

驗證資料完整性的話基本上就是透過計算 Hash 來達到的。在本地端的話我傾向使用 [BLAKE3](https://github.com/BLAKE3-team/BLAKE3)，這是一個現代雜湊算法，擁有比傳統 SHA-256、SHA-1、MD5 更快的加密速度，同時提供更好的安全性，因為做完整備份時整個快照檔案會達數 TB，所以有一個快速高效的 Hash 算法很重要。至於遠端的部分是要確保資料在從本地到遠端的網路傳輸過程沒有發生問題，因為我的目標是 AWS S3，而 S3 提供了一些[檢查資料完整性的功能](https://docs.aws.amazon.com/zh_tw/AmazonS3/latest/userguide/checking-object-integrity.html)。其實還是透過 Hash，每個檔案或者說物件在上傳到 S3 時可以帶上指定的 Hash 算法和 Hash 值，例如你可以在本地端計算好 SHA-256 值，並且在上傳時附上這些資訊，上傳完成後 AWS 會自動計算 SHA-256，如果和使用者計算的值不同的話會提示失敗。不過要注意大於 5GB 的單一檔案會有分割上傳的事情要考慮，如果不想處理的話要在本地端就自行處理分割。

最後要確保遠端資料的安全，畢竟世上很多事故都是人禍，在 S3 上基本上就是透過物件鎖來阻止包含我自己在內的任何刪除或覆寫手段。作為物件儲存，S3 還可以設定一些參數，例如使用 lifecycle policy 讓檔案過了 6 個月後會自動刪除，這樣我的程式就不用另外管理 S3 上面的空間了，只要在當初上傳時帶上指定好的 metadata 和 tag 就可以完成 S3 上的管理。

### 流程

這是我設想的實際流程：

1. 匯出時直接分割，避免佔用太多空間

   ```bash
   zfs send pool/dataset@snap1 | split -b 4G - snapshot.stream.part-
   ```

2. 匯出後立刻進行還原測試，這裡要測試還原到不同的 dataset

   ```bash
   cat snapshot.stream.part-* | zfs recv pool/dataset_test
   ```

3. 用 BLAKE3 計算每個分割檔案的 Hash 並儲存
4. 為每個分割檔案進行壓縮（例如 Zstd），壓縮完成後要進行解壓縮測試，以 Hash 驗證。雖然在 `zfs send` 時可以選擇以原本壓縮的形式匯出，但是我覺得作為封存檔案可能還是再以較高的壓縮率壓縮一次更好
5. 各個壓縮完的檔案使用 age 進行加密，不過就不進行解密測試了。會選擇 age 是因為這個是一個使用起來很簡單的非對稱加密，在 TrueNAS 上我不是很清楚如何安全的管理密鑰（網路上查到的功能都是企業版的），所以我想說使用非對稱加密的話就只需要儲存公鑰，不用煩惱私鑰的儲存，但也因此無法進行解密測試了。不過使用 age 加密備份檔案還有一些需要注意的事情，例如 [Why not use the "age" tool for encrypted backups?](https://security.stackexchange.com/questions/281767/why-not-use-the-age-tool-for-encrypted-backups) 這篇文章提到的因為缺乏身份驗證所帶來的 silent replacement 攻擊。但是我覺得這個攻擊對我來說比較還好，因為它要求攻擊者可以替換遠端上的檔案，但是如果我的 S3 被入侵的話那才是更嚴重的問題，而且我的 S3 會設定相應週期的物件鎖，確保這份備份檔案有效期間無法修改。
6. 加密後的檔案 計算 SHA-256，設定好指定的 mataddata 和 tag 後上傳 AWS S3

上傳到 S3 的物件至少需要這些資訊：

- tags
  - snapshot-type
    - full
    - diff
    - incr
- metadata
  - pool
  - base-snapshot
  - incr-snapshot
  - trigger
    - auto
    - manual
  - split-amount
  - date
  - key-created

### 實作

接下來就要考慮實作。

原本一開始我是想說用 Docker + Python 來處理，但是 `zfs send` 是對 Host 本身的操作，就算把整個 dataset mount 進 Docker 內也需要加上 `--privileged` 使用特權模式才可以，這個感覺不是很安全理想。

既然無法做到在 Docker 內隔離的話，比較好的方式就是寫一個 CLI 執行檔程式再透過 TrueNAS 排程腳本呼叫，所以最好是使用編譯型的語言。我首先想試試看 Go，但是用了一下後覺得不是很喜歡它的錯誤處理，所以後來還是用了 Rust。雖然我也考慮過用 TypeScript 搭配 Node.js 的 Single executable applications，但感覺還是乖乖用編譯語言比較好。至於第三方工具如 age 加密、Zstd 壓縮和 BLAKE3 Hash，它們都有 SDK 套件，也可以透過下載可執行檔直接呼叫。

## 小結

這個專案還沒完成，可能也不會真的做完，其實程式方面沒有什麼技術難度，就是把各個工具流程串在一起，我花比較多的時間還是在規劃整個備份邏輯和流程，中間改來改去的。[ziteh/zfs-remote-backup](https://github.com/ziteh/zfs-remote-backup)

其實 GitHub 上面已經有一些類似的工具可以用，像是 [someone1/zfsbackup-go](https://github.com/someone1/zfsbackup-go)，說不定我只會就直接用這個了。

另外，在使用 AWS 前還有很多細節要注意，例如 [How an empty S3 bucket can make your AWS bill explode](https://medium.com/@maciej.pocwierz/how-an-empty-s3-bucket-can-make-your-aws-bill-explode-934a383cb8b1) 這篇文章建議的 Bucket 名稱要夠長且摻入亂碼，以及操作時要明確指定區域。
