---
title: 小狼豪輸入法 模糊拼音設置
author: ZiTe
tags:
  - 教學

categories: []
date: 2020-09-14 12:54:00
comments: true
toc: true
draft: false
aliases: ["/2020/09/ime-weasel-fuzzypinyin/"]
---
# 前言

小狼毫輸入法（Weasel）是開源的[中州韻輸入法引擎（Rime 輸入法）](https://rime.im/)在 Windows 上的官方發行版。另外它在Linux上的發行版為中州韻（ibus-rime）、macOS 為鼠鬚管（Squirrel），也有許多第三方的版本。

身為開源軟體，其最大的特色就在於高度自訂的各種設定，想要什麼樣子或功能都可以自己修改。

<!--more-->

我從高中二年級就開始使用漢語拼音輸入法，但漢語拼音的主要用戶為中國大陸，而我又不太喜歡中國那裡較常見的幾款拼音輸入法（如搜狗、QQ），而 Windows 內建的我也覺得不好用，所以一直以來我都是使用 Google 拼音輸入法。

然而 Google 拼音輸入法老早就沒在更新了，有時運作起來也不穩定。故我開始找尋其它適合的拼音輸入法，便找到了小狼毫輸入法。

而我當初會開始使用漢語拼音的原因就是因為多數漢語拼音輸入法都有「模糊拼音」的功能，而小狼毫的拼音輸入法並未直接內建該功能，但是我們可以透過其強大的自訂功能來達成。

小狼毫也有內建注音輸入法，但是我現在已經沒有、也不太會打注音了，所以也不知道和其它輸入法比較起來如何。

# 開始設定模糊拼音

小狼毫在設定方面沒有圖形界面，所以你會需要使用文字編輯器來進行設定的修改。關於文字編輯器，我個人首先推薦 [Visual Studio Code (VSCode)](https://code.visualstudio.com/)，不過用記事本來編輯也是可以的。

## 一、 到用戶資料夾

需要修改的文件檔案都在用戶資料夾裡。有2種方式可以到達用戶資料夾：

1. 在檔案總管上的路徑欄輸入以下路徑：
   1. `%APPDATA%\Rime` (Windows)
   2. `~/.config/ibus/rime`  (Linux)
   3. `~/Library/Rime`  (Mac OS)
2. 在電腦上安裝好小狼毫輸入法後，切換輸入法到小狼毫，並在其右下角的圖示按下滑鼠右鍵顯示選單，並點擊「用戶文件夾」。

![▲ 在右鍵選單中點選用戶文件夾。](https://1.bp.blogspot.com/-iueiNPsmSM0/X172CNmVbqI/AAAAAAAACm8/BNsoDld4biYAgqkl9V3pGt8ZFiqLD-1WgCPcBGAsYHg/s272/rime-%25E5%258F%25B3%25E9%258D%25B5%25E9%2581%25B8%25E5%2596%25AE-1.png)

## 二、 取得設定檔

到達用戶資料夾後應該會看到一些YAML檔，這些都是小狼毫的設定檔。

這時要看各位所選擇使用的小狼毫輸入方案是那一種，像我是使用「朙月拼音」和「朙月拼音-臺灣正體」，而它們的設定檔分別為「luna_pinyin.schema.yaml」和「luna_pinyin_tw.schema.yaml」。這兩個檔案可能會在`用戶資料夾/build/`裡。

接着請到[我的 GitHub ](https://gist.github.com/ziteh/beac7b7038652b79864fbab7a7254183)下載設定檔。

可以發現其檔名為「luna_pinyin.custom.yaml」，對應了上述的「luna_pinyin.schema.yaml」。請將「luna_pinyin.custom.yaml」放到用戶資料夾中（不是`用戶資料夾/build/`）。

另外因為我還有選擇「朙月拼音-臺灣正體」方案，所以我將「luna_pinyin.custom.yaml」複製一份並修改檔名為「luna_pinyin_tw.custom.yaml」。

![▲ 加入設定檔的用戶資料夾。](https://1.bp.blogspot.com/-PM-9gfp0-ho/X172CCwKZHI/AAAAAAAACm8/U9OoEY-gKFEzN4b_ZaGeT5Kk0kg7hI5PwCPcBGAsYHg/s264/rime-%25E7%2594%25A8%25E6%2588%25B6%25E8%25B3%2587%25E6%2596%2599%25E5%25A4%25BE-1.png)

## 三、 修改設定檔

以文字編輯軟體打開「luna_pinyin.custom.yaml」。你會看到有許多行，其中每一行都是一種模糊音的規則。如果你想啓用該模糊音規則，就請將改行前的`#`（井號）刪除；反之要停用的話就在該行前加上井號。

例如以下示範啓用規則「zh, ch, sh => z, c, s」、「z, c, s => zh, ch, sh」，並停用規則「n => l」、「l => n」。
```yaml
- derive/^([zcs])h/$1/             # zh, ch, sh => z, c, s
- derive/^([zcs])([^h])/$1h$2/     # z, c, s => zh, ch, sh

#- derive/^n/l/                     # n => l
#- derive/^l/n/                     # l => n
```

修改完成後儲存該檔案，然後在右下角的圖示按下滑鼠右鍵顯示選單，並點擊「重新部署」。這樣就完成設定了。

![▲ 在右鍵選單中點選重新部署。](https://1.bp.blogspot.com/-eH1rXjLq344/X172CCCFjQI/AAAAAAAACm8/0aPqPZ75mdUFHa8tHO4OypI6W8mzO86RgCPcBGAsYHg/s255/rime-%25E5%258F%25B3%25E9%258D%25B5%25E9%2581%25B8%25E5%2596%25AE-2.png)

# 結語

上述步驟二所提供的設定檔是我從[【朙月拼音】模糊音定製模板](https://gist.github.com/lotem/2320943) fork 並自行測試並修改而成的，我以該設定檔在 Windows10 和 Ubuntu 上都可以正常運作。

而設定檔內的那些模糊音規則使用的是 Perl 正規表示式，可以參考[正規表示式 - 維基百科](https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F#PCRE%E8%A1%A8%E9%81%94%E5%BC%8F%E5%85%A8%E9%9B%86)

# 相關文章與資源
* [RIME | 中州韻輸入法引擎](https://rime.im/)
* [GitHub · rime/home Wiki](https://github.com/rime/home/wiki)
* [Rime 定製指南](https://github.com/rime/home/wiki/CustomizationGuide#%E6%9C%99%E6%9C%88%E6%8B%BC%E9%9F%B3%E6%A8%A1%E7%B3%8A%E9%9F%B3%E5%AE%9A%E8%A3%BD%E6%A8%A1%E6%9D%BF)
* [Rime 設定項手冊](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md)
* [【朙月拼音】模糊音定製模板](https://gist.github.com/lotem/2320943)
* [正規表示式 - 維基百科](https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F#PCRE%E8%A1%A8%E9%81%94%E5%BC%8F%E5%85%A8%E9%9B%86)
