---
title: "Blog 新樣式：Fluid，以及歷史回顧"
subtitle: "2024 新主題"
# description: ""
tags: ["生活", "心得"]
# categories: [""]
date: 2024-06-25T19:32:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

最近這個 Blog 換了新的主題樣式，所以想來介紹一下新的 Theme，順便回顧一下這個 Blog 的歷史。

<!-- more -->

# 歷史回顧

本 Blog 的第一篇文章是 2016 年 3 月的事，距今已經 8 年多了，那時我還在高中。一開始我還是使用 Google 的 Blogger 服務來架站。當時用 Blogger 其實用得不是很順，版面格式常常跑掉，就算我已經手寫 HTML 了，一儲存還是會亂掉...但我當時也不知道有什麼其它的服務。

上了大學後，某次和學長聊天時，透露了我對於 Blogger 的抱怨，他就推薦我 [Hexo](https://hexo.io/)。這是我第一次知道什麼是*靜態網頁生成器*。不過當時的我還很菜，當時的我連 Git 和 GitHub 都還沒什麼在用，不過我覺得它看起來真的很不錯，所以我開始使用 Hexo 來嘗試靜態網頁，並部署在 GitHub Pages，第一次部署應該是 2020 年 4 月。

那時應該是用了一下預設 Theme 後，就換成 [NexT](https://theme-next.js.org/) 了，因爲它有我喜歡的會自動收折的文章目錄。

就這樣用了 1 年多吧，不知道爲什麼有些文章會出現問題，頁面會整個大爆炸，嘗試修復無果後，我決定直接換個新 Theme 來用。後來也乾脆地換成 [Hugo](https://gohugo.io/) 和 Landscape。雖然 Landscape 是預設 Theme，但是我決定它看起來也滿不錯的，畢竟我也不喜歡那些太豐富的功能，只想保持簡單。

這個方案就一路用到 2024/06/22，接下來就是本文的開端... ...

# 起因

爲什麼要換 Theme 呢？主要有以下幾個原因：

1. 程式碼區塊複製問題，複製後各行之間會多出空行。之前查可能是 CRLF `\r\n` 之類的問題，但是稍微調整了一下還是沒能解決。每次要複製程式碼，結果還有刪除一堆空行的體驗真的不是很好。
2. 文章目錄（ToC）不會收折。我一直都很喜歡 [HackMD](https://hackmd.io) 的文章目錄會自動收折，我覺得這樣的版面乾淨很多。雖然我的再前一個 Theme 其實有這個功能，但後來換的 Theme 又沒這個功能了，而我也不想自己處理。
3. 畫面不夠乾淨。我除了喜歡 HackMD 的 ToC 外，我也很欣賞它那乾淨清晰的面板，雖然我之前在調整 Theme 時已經有盡可能保持簡單了，但我現在想要更進一步。
4. 原本的 Blog 不支援 Mathjax 或 KaTeX 等數學式渲染，我原本有試著自己手動加入，雖然大部分的語法都可以被正確解析，但是有些特殊情況會解析錯誤。例如這個情況下，兩個底線 `_` 會優先被 Markdown 解析成斜體：

    ```latex
    $$
    A_1 = B_2
    $$
    ```

再加上我原本用的 [Hugo](https://gohugo.io/) 版本有點舊，GitHub 一直寄安全警告，所以我本來就要更新一輪。後來就想說那乾脆來大改一下好了，畢竟舊 Theme 也用一段時間了，是時候換換口味了。

# 尋找新 Theme

一開始我打算繼續使用 Hugo，所以在它們官網的 Theme 清單裡翻了很久，但都沒有看到喜歡的，所以最後我打算回到 [NexT](https://hugo-next.eu.org/)。但是，NexT 原本是 [Hexo](https://hexo.io/) 的，那我還不如回去用 Hexo，反正當初我也是從 Hexo 換到 Hugo，它們的 Front-matter 基本上可以通用不用特別調整（就算要，也只要寫個小腳本來處理就可以了），現在只是再換回去而已。

所以我就裝了最新的 Hexo `v7.2.0`。而 NexT 是 [next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)，GitHub 上的 NexT repo 不只一個，我看這個 repo 到現在都還有持續更新，而另外 2 個最後一個 commit 已經是幾年前了，所以我選擇這個。

由於我的 Theme 一定都會修改調整過，所以我先開了一個測試用的專案，先把 Theme 的 CSS 和 JS 等調整成我喜歡的樣子。雖然說調調這些東西感覺應該很快，但我還是花了週末一整天的時間，可能很多時候在糾結要 `1.25` 還是 `1.125` 這種事情吧。

調整完後，就只要把原本的 Markdown 文章放進來再最後確認就可以了。

確認好 Theme 都沒問題後，就可以部署了。我是直接用官方的 GitHub Action [範例](https://hexo.io/zh-tw/docs/github-pages)。一切都很順利，新的 Blog 已經上線了。

# 半路殺出的 Fluid

原本新的 Blog 就已經完成了，我準備要撰寫本文。結果，我意外發現 [Jerry Yang's Blog](https://blog.yangjerry.tw/) 也是用 Hexo，而且這個 Theme 看起來更符合我的喜好，所以在思考片刻後，我決定放棄花了一整天調整好的 NexT（上線壽命僅一天），轉而使用 [Fluid](https://github.com/fluid-dev/hexo-theme-fluid)。

Fluid 本來就很簡潔了，所以我要調整的東西不會很多。

首先是 CDN 伺服器，它原本使用的 CDN 都是中國的鏡像站，我把有用到的 CDN 都改成 [cdnjs](https://cdnjs.com/)。還有原本的 Icon 是來自阿里巴巴的 iconfont，我也替換成 [Font Awesome](https://fontawesome.com/)。字體也改成來自 Google Font。

再來就是調整 CSS 和 EJS 了，雖然 Fluid 原本就是相當乾淨，但是我想讓它看起來再更清晰點。

我還記得以前看過《留白：不一樣的平面設計第一課，”白”是一切》（費工信, 黃于倫, 陳羿安著）這本平面設計的書（當時的我比起程式碼，更熱衷於平面設計和視覺傳達設計），裡面對於「留白」的說明讓我印象深刻，也深深地影響了我。所以我花了不少時間再調整各個元素的間距。

改著改著一天又快結束了。不過目前主要是調整好了，剩下一些手機端的樣式還沒調整到最好，但這部分就等之後再處理吧。

我自己對於新的 Theme 還滿滿意的，而且也有確實解決上面列的問題，看來它可以再陪我好一段時間。也希望各位讀者們會喜歡新的 Theme。

# 比較

稍微比較一下各個 Theme。依序是最舊的 Landscape、只活一天的新-NexT、目前的最終 Fluid。

## 主畫面

![Landscape][home_landscape]

![NexT][home_next]

![Fluid][home_fluid]

## 文章標題

![Landscape][title_landscape]

![NexT][title_next]

![Fluid][title_fluid]

## Footer

![Landscape][footer_landscape]

![NexT][footer_next]

![Fluid][footer_fluid]

[home_landscape]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiPJ_Ut5YVfePYPEB5wibQ9PrnIk2WEEzSfCuWq041kweo6luKjvDWO0su6KAUkjVA6Gf09zpsjU3HMUwTZsu8yQj4Z9inBhjRAXqhO74TEkS2baAQ_-Dc2FvtEn4JRr167fQhKyDNUYmqQJXJ2N0VEvVg7OEWPTqS0POgr1pmNbAaYVf6enU6i5uysDI/s16000/home_landscape.png
[home_next]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAT_LwamIwZdrzQyyu1HaL0XZUr2iwt9fiicff2M3OI3TrLwyu17WH2-dkomwH-evQVCN4wqdPjhNqa5PXC1zaFRn_xqaLBc5GCCXFuuyJEBgXAuHCYSV7PsRcSZqEqSarjKyKyy1vAqm8YxWPPhqTFP6gtxq-7E_YGcsHvBjKgnCcledYzTbNtY5TTsQ/s16000/home_next.png
[home_fluid]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY9xypjmiSDmeSRo5vBzsnjEcjbjE0IA8LihP1wqi9S1PwxEIF17tfGuwJJ891cKGfGFfJowmA-4ByYSGGv1Y2fC5e2ZD11xb7C-ARfYcTw9xfavjWIxY6vdvSA4edP4reGVa1OnVl-fahchTET5sDk-bR1FKYLiBRVfsCR7Na6JMR-yD-FvagicrUqps/s16000/home_fluid.png

[title_landscape]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVLKVRJdQDtaUcTlK2GTWNifgfvaD9tgAex4NG1JIQQ-ibN0ZeD9QeyYHozSdIIRGZC7n631UNxi-OWENadvoRmKxMYNwix37npHRigqajk1fGcEYzp1lFNt0hLI8D-uS0VRU7cfDalrFOLkd27sbKRK8WUTWjtaAsFC9vYAELpo0CW8kPQXg_zXTJHU0/s16000/title_landscape.png
[title_next]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-mQwY_Qwvqo2EQL1EkE2tZYBUP4w271budbd_lyz6miU1GhK-FGy6VbVj6sQOCsPwOwsNhsCoUgRZDI3r5q3Q7cT84_mwI-gW99i3F4Lz1NBLhpgDFyiwRSnsWYDZkELjv7KAwzSP4qHlktx8Z6NiLXSgNdgA6Y6KMeddC03IKNjG3Fs1138Rd3e3hSU/s16000/title_next.png
[title_fluid]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgs2TYwwBrRaT_a6NeK6KyNvkGR_60jCu6ccK1EcFkjGIrLSALiadydAK-SVPobOT7AvcPZ4gtqgy5MgyEASqi-te2UwOJeaWU_4xd2gqRX5d0-TFRl-qsVK1IBiqBrA4cvbSwSPn-T1a4kppoyL87zXyL112e8CznoA7WvIxEImJ6ktCUd-ZXtyludtP4/s16000/title_fluid.png

[footer_landscape]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgR9nFe5ZduzPx4ndA3TaYmym7zWeBGS0ozcHq6vQT6V9sDEX0Z3M5aqGOkM3pTScYCgY9cnJ3HW_DYgtcllQwvw-sjL7NlmZ-9BhWV1yANPriDQISNOm0kWS84CFRyzwNWStwJUrabpCBt2hezTaSFGqpKbmC6hDNjpWDAs5itbcLvkhgHeva1jamYIq4/s16000/fotter_landscape.png
[footer_next]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfJ0wWPJ4HwSZo19W13PLQTUzAARpjLvpwm5G_a-UQSoN5RSgUW1QQCX_tXzbUiF3hxpoEFfIs2sPsvJvlQ18JzHWFcTORgEQ535pji_GrOjnfkRoUNHrkreVuGbxhwU07yglJQO5Abg8dG2fx6oGt9CpBU9RBHNiYvMa266ZnedKeptkTzddwvWKHZcI/s16000/footer_next.png
[footer_fluid]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimINxvevj5gFZOegg1rKj0FpTvi0rmGCqfG8yY9gosGvXeZt18VaiR-OAaYbX0BofReEII6MAfbjQKyxc7sRpRAqfNmmmg_TLQdc3obcB7D0nq32JUKZZGUL4_jqVIfAOH4qLaE7Vzh_V-298w6j7vG42s34DoXr3A1o8n-aavoG52pc134_N9NIDmvw8/s16000/footer_fluid.png
