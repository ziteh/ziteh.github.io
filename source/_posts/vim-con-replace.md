---
title: "Vim 複製並連續取代文字"
subtitle: ""
# description: ""
tags: ["教學", "Vim"]
categories: []

date: 2023-09-30T20:33:00+08:00
header_img: ""
comments: true
toc: false
draft: false
---

我在使用 Vim 撰寫程式時，常常需要複製一段文字，然後連續在多個地方貼上/取代。這篇文章簡單記錄一下我目前比較順手的做法。

<!--more-->

例如我要把以下的 `IndexOri` 和 `IndexSource` 取代成 `IndexWithLongLongLongLongLongLongName`。
```c
int IndexWithLongLongLongLongLongLongName = 0;

if (Data[IndexOri].Max > 100) {
  Data[IndexOri].Value = Data[IndexSource].Max / 2.0;
  Data[IndexOri].Digits = GetDigits(Data[IndexOri].Max);
}
```

1. 遊標移動到要複製的目標文字上。
1. 選取要複製的目標文字，主要有以下方法。
    1. 如果是整串文字，按 `viw`。
    1. 若非整串文字，按 `v` 使用 Visual mode 選取。
    1. ~~用滑鼠選取。~~
1. 按 `y` 複製。
1. 將遊標移動到第 1 個要取代的地方。
1. 選取要取代的目標文字。
1. 按 `"0p` 指定貼上 Register 0 的內容。在選取狀態下，`p` 指令會變成取代選取的文字並貼上。
1. 移動到剩餘要取代的地方，按 `.` 重複上一步的操作。

這個操作的重點是使用指定貼上 Reg 0 的 `"0p` 而不是單純的 `p`。若使用普通的 `P` 只會貼上預設暫存器 Reg " 的內容，這時當第一次貼上並取代時，Reg " 就會更新成第 5 步時選取的內容，而不是一開始複製的目標內容，所以之後再 `p` 的話就會出錯。而 Reg 0 是複製專用的暫存器，只有 `y` 指令的資料會自動存入，`p`、`x` 等操作不會。

Vim 有許多暫存器，有些暫存器有特別的功能，Vim 用久了後就會慢慢碰到，可以使用 `:reg` 查看暫存器內容。

除了這篇的做法，我之前也有寫過[另一篇](/posts/vim-search-replace/)也可以參考，不同的情況適合的做法也不同。上面這個例子不適合使用 Visual mode 的 `:'<,'>s/OLD/NEW/g` 的原因是要被取代的舊字串有兩種，而且新字串很長，自己打很累，而且要替換的目標也沒真的很多或很分散。如果熟悉 EasyMotion 的話，本文的這種操作也可以滿快的。
