---
title: '[自製QMK鍵盤-1] 編輯鍵盤佈局 (Layout)'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK
categories: ["自製QMK鍵盤"]
date: 2023-04-18 21:14:00+08:00
comments: true
toc: true
draft: false
aliases: ["/2020/06/diyqmkkeyboard-1/", "/posts/diyqmkkeyboard-1/"]
---

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6xYCyGGGes8740UwynZ1-7vRgL-NiAbQG_wQ-84Qwpp0VnqNnTvhTym-9_GQemo3IWD31zfsRhwnsCjjuo6FY9YA1Uvzw6ewqC5ZQZuifOvxs-4imiPxjeBuYCJ_Y9Wc5nkBQqNQHFN03e8RHUQi6apUVahqwfScuck0SVJ-W_c6uGn1oYKgOFfgd/s16000/Screenshot%202023-04-18%20at%2020-31-36%20Keyboard%20Layout%20Editor.png)

根據第一篇所提的[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)，當你確定完鍵盤的整體設計（要多少按鍵？標準、Ortho 或 Alice 佈局？等）後，就可以開始編輯鍵盤佈局（Layout）了。

<!--more-->

# 編輯鍵盤佈局

鍵盤 Layout，也就是各個按鍵的位置、尺寸及其數量。我們可以用線上工具 [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/) 來進行設計，往後將其簡稱爲「KLE」。

## 主頁面

- 最上面爲功能列。
- 左上角有藍色和紅色的按鈕，可以用來增加或刪除按鍵。旁邊還有一些編輯用的操作按鈕（回上一步、回下一步、剪下、複製、貼上）。
- 中間是編輯區，可以看到它現在有一個數字鍵盤。
- 下方是各種標籤頁
  - **Properties**：編輯各個按鍵的屬性，選取按鍵後可以編輯該按鍵的各種設定與數值。
  - **Keyboard Properties**：鍵盤屬性設定。
  - **Custom Styles**：鍵盤外觀樣式設定。
  - **Raw data**：鍵盤 Layout 的原始資料。
  - **Summary**：鍵盤概要。
  - **Tools**：一些編輯按鍵可以用的功能工具。

![▲ KLE 頁面](https://1.bp.blogspot.com/-tNaDVTpZNkg/Xu4t__IgDhI/AAAAAAAACcY/eLwPgAw9jpQ5hLNTgKLmSL27edMDQhYpACK4BGAsYHg/s1908/%255B01%255DKeyboard%2BLayout%2BEditor_%25E9%25A6%2596%25E9%25A0%2581.png)

最上面的功能列那邊有個「Preset」按鈕，可以匯入一些常見的鍵盤佈局，再進行修改。

![▲ 「Preset」按鈕](https://1.bp.blogspot.com/-KJ9BtlpHxkc/Xu4uAKgEj2I/AAAAAAAACcc/_q6_t2f8k6g_b4AvA_qcbPnK92Zmme1DQCK4BGAsYHg/s704/%255B02%255DKeyboard%2BLayout%2BEditor_Preset.png)

例如以下匯入了「ANSI 104」的鍵盤佈局。

![▲ 匯入「ANSI 104」](https://1.bp.blogspot.com/-hGR7m05B_Bc/Xu4uASKVfNI/AAAAAAAACcg/6Y2GJFGtcH4-vNz2CK8Bv_fvCwRvAzF2wCK4BGAsYHg/s1908/%255B03%255DKeyboard%2BLayout%2BEditor_Preset-ANSI%2B104.png)

## 編輯按鍵

在下方選擇「Properties」標籤頁。點選一或多個按鍵，就可以在下方進行按鍵的設定。其中比較常用的是由上而下的是：

- **Top Legend**：頂部的顯示文字，有左、中、右。
- **Center Legend**：中間的顯示文字，有左、中、右。
- **Bottom Legend**：底部的顯示文字，有左、中、右。
- **Front Legend**：前側面（側刻）的顯示文字，有左、中、右。
- **Legend Size**：顯示文字的大小。
- **Legend Color**：顯示文字的顏色。
- **Key Color**：顏色。
- **Width**：寬度，1代表1U。後面的第2個數字是非長方形鍵帽用的。
- **Height**：高度，1代表1U。後面的第2個數字是非長方形鍵帽用的。
- **X**：X軸位置。後面的第2個數字是非長方形鍵帽用的。
- **Y**：Y軸位置。後面的第2個數字是非長方形鍵帽用的。
- **Rotation**：旋轉角度。

![▲ 按鍵編輯區](https://1.bp.blogspot.com/-JA0T6CoKpUQ/Xu4uAj2uGiI/AAAAAAAACck/THOzxCPzfhMyQVE-4rIkk_NK4z7BqP3JQCK4BGAsYHg/s742/%255B04%255DKeyboard%2BLayout%2BEditor_Key_Properties.png)

可以透過方向鍵來移動按鍵。按鍵內的文字可以設定各自的大小和顏色。

![▲ 按鍵文字樣式](https://1.bp.blogspot.com/-yhzg5EnWmCc/Xu4uA5Xq1KI/AAAAAAAACco/XNep3M3gpd8FtkYBbdyBcu9RMEKQlTR_ACK4BGAsYHg/s546/%255B05%255DKeyboard%2BLayout%2BEditor_Key_Properties-text.png)

下方還有許多不同的標籤頁可以進行不同的設定（如作者名字或鍵盤名稱），在此就不多做介紹。

## 輸出

編輯完成後就可以輸出 Layout 了。

選到下方的「Raw data」標籤頁。這裡可以看到文字格式的 Layout 原始資料。未來要使用 [Keyboard Firmware Builder](https://kbfirmware.com/) 產生韌體或產生定位板等工具時，通常都是將此 raw data 複製過去使用。

```json
["Num Lock","/","*","-"],
["7\nHome","8\n↑","9\nPgUp",{h:2},"+"],
["4\n←","5","6\n→"],
["1\nEnd","2\n↓","3\nPgDn",{h:2},"Enter"],
[{w:2},"0\nIns",".\nDel"]
```

![▲ 輸出 Layout](https://1.bp.blogspot.com/-u-4BtExCj9Y/Xu4uBOltJ8I/AAAAAAAACcs/Gb5Yc6Tv_cg4X7R7KIMCBIi1QcFouQB0ACK4BGAsYHg/s1908/%255B06%255DKeyboard%2BLayout%2BEditor_Raw_Data.png)

畫面右上角有個綠色的「Download」可以下載各種圖片檔和 JSON 檔。下載的 JSON 檔內容其實就是上面的 raw data。儲存成 JSON 檔下次還可以重新上傳並繼續編輯。

建議**一定要儲存 JSON 檔**並保管好，並且標記好這是 KLE 的 JSON，避免與其它工具的 JSON 檔搞混。

![▲ 右上角的「Download」可以下載各種格式](https://1.bp.blogspot.com/-qydXM4etOsI/Xu4uBi6MegI/AAAAAAAACcw/MWvyrL-TyLw-v4WjefzfLY3lCcILlWP0gCK4BGAsYHg/s406/%255B07%255DKeyboard%2BLayout%2BEditor_DL_1.png)

要上傳 JSON 檔的話，在「Raw data」標籤頁的右下角有個綠色的「Upload JSON」，一旁的「Download JSON」同樣也可以下載 JSON 檔。

![▲ 在「Raw data」標籤頁的右下角可以載入 JSON 檔](https://1.bp.blogspot.com/-m-eRyos_xAU/Xu4uBp2_njI/AAAAAAAACc0/gFa3j9BQlu8fIry-IRA-nLbmnpughQ60gCK4BGAsYHg/s356/%255B07%255DKeyboard%2BLayout%2BEditor_DL_2.png)

# 相關網站

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [ijprest/keyboard-layout-editor](https://github.com/ijprest/keyboard-layout-editor)：KLE 的 GitHub repo。

> 本文最早發佈於 2020-06-21，於 2023 重新編排並更新內容。
