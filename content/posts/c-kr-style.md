---
title: "C 語言用 K&R Coding Style 的最大理由不是省行數"
subtitle: "以實例分析使用 K&R 風格的優點"
# description: ""
tags: ["心得", "程式"]
series: []
# categories: []
date: 2024-05-23T19:51:00+08:00
header_img: ""
comment: true
toc: true
draft: true # false
---

多年來，就算我在寫其它語言時用的都不是 Allman 風格。但是只要我寫 C，我就會自然而然地用 Allman。而且我甚至有點反感 K&R，更不要說是花括號行爲不一致的 Linux K&R 了。

我原本只是想整理一個自己偏好的 Coding style，但是在仔細思考詳細的規則和實際寫程式會遇到的情況後，我發現 K&R 似乎才是唯一的真理。也總算理解 [Linux kernel coding style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html) 手冊裡的那段話：

<!--more-->

> Heretic people all over the world have claimed that this inconsistency is ... well ... inconsistent, but all right-thinking people know that (a) K&R are right and (b) K&R are right. Besides, functions are special anyway (you can’t nest them in C)

在此之前，我覺得 K&R 的唯一優點只有「節省行數」（然後把全部的東西擠在一起），但是我發現 K&R 的其它優點，它們甚至讓節省行數都變得微不足道。

所以我想藉由這篇文章，來說明我是如何在寫草稿時還是忠實的 Allman 用戶，突然就變成 K&R 支持者。當然還有一點很重要的是，Coding style 還是有不少主觀因素在內，你完全可以不認同我的任何看法和感覺。這只是一個分享而已。

# 定義

首先在討論各個 Coding style 前，我想先定義一下我認爲的好的 style 是什麼樣子的，有了統一的標準才有比較的依據。以下按權重排序：

0. **使用現有規定的風格**。這個不用多說，如果專案已經有規定，那就是遵守。不過這篇討論的是你有完全的控制權的情況。
1. **看得順眼**。就如同工具順手最重要。
2. **使用方便**。當然沒人想被風格影響實際功能和手感。
3. **規則簡單且明確**。規則越簡單、例外越少就越容易遵守。明確的規則就可以不用再花時間思考。

# 實例比較

## A. typedef

```c
// A
typedef struct {
    int foo;
    int bar;
} foo_bar_t;

// B
typedef struct
{
    int foo;
    int bar;
} foo_bar_t;

// C
typedef struct
{
    int foo;
    int bar;
}
foo_bar_t;
```

- A：只有一個規則 —— 左右花括號都不換行。
- B：雖然左右花括號的換行行爲不一致，但看起還是不錯，實際上這種風格也很常見。可是如果右花括號不換行的話，那 `if-else` 的右花括號也不換行嗎？還是它們的右花括號行爲也要不一致？
- C：我是沒看過這種風格。如果左右花括號都換行的話，那 `do-while` 也是嗎？

## B. 初始化 struct

```c
// A
foo_bar_t fb = {
    .foo = 0,
    .bar = 1,
};

// B
foo_bar_t fb =
{
    .foo = 0,
    .bar = 1,
};

// C
foo_bar_t fb =
    {
        .foo = 0,
        .bar = 1,
    };

// D
foo_bar_t fb = {
                    .foo = 0,
                    .bar = 1,
               };
```

- A：只有一個規則 —— 左右花括號都不換行。
- B：通常習慣上等號（賦值運算子）的右值如果換行的話會縮排。
- C：雖然 B，但是兩個花括號都縮排看起來不太自然。
- D：第1行的左花括號不一定在4的整數倍，這樣導致要嘛成員的縮排也不是4的整數倍，要嘛成員和花括號直接的差不是4，要嘛左花括號和等號之間的不是1個空白。此外太佔水平空間。

> 這邊的 `struct` 只是舉例，實務上如果成員這麼少的話從一開始就可以只寫成一行。這裡想表達的是成員很多、或成員名很長、或結構較複雜的 `struct`。
> 
> 這裡的 4 指的是我用 4 的空白做縮排爲例，實際上到底是多少都不影響。

## C. 統一初始化陣列

```c
// A
int arr[1024] = {0};

// B
int arr[1024] =
    {
        0
    };
```

- A：只有一個規則 —— 左右花括號都不換行。
- B：這種簡單的初始化，左右花括號如果強硬規定要換行明顯太不自然了，應該沒有人會這樣寫。

> 這裡同樣也適用於初始化簡單到可以寫成一行的 `struct` 的情況。

## D. if-else

```c
// A
if (foo) {
    foo = 0;    
}
if (bar) {
    bar = 0;
}
if (foobar) {
    foobar = foo;
} else {
    foobar = bar;
}
if (fb) {
    fb = 0;
}

// B
if (foo)
{
    foo = 0;    
}
if (bar)
{
    bar = 0;
}
if (foobar)
{
    foobar = foo;
}
else
{
    foobar = bar;
}
if (fb)
{
    fb = 0;
}
```

這個例子可能不是非常好，至少我在寫類似的程式時，會加一些空白行來分隔，不會讓它們就這樣黏著。但是在不加空白行的情況下，A 應該稍微更容易區分各個 `if-else` 的開頭和結尾。注意，A 的規則還是左右花括號都換行，但是這是指同一個語句（Statement），不同的 `if-else` 不會疊在一起。

## E. 宣告函式原型

你現在已經先打好了一個函數，考慮現在要幫 `foobar()` 宣告函數原型...

```c
// A
void foobar(int a, int b) {
    int foo = a;
    int bar = b;
}

// B
void foobar(int a, int b)
{
    int foo = a;
    int bar = b;
}
```

- A：整行複製後，要先刪除行末的左花括號，才能打分號。
- B：整行複製後，可以直接在行末打分號。

再考慮一下如果你一次寫了 5 個函數，現在要一次幫它們宣告函數原型。你已經把它們都整行複製到一起了，它們現在長這樣：

```c
// A
int foobar1(void) {
uint16_t foobar2(int a) {
void foobar3(int a) {
uint16_t foobar4(int a, int b, const int *c) {

// B
int foobar1(void)
uint16_t foobar2(int a)
void foobar3(int a)
uint16_t foobar4(int a, int b, const int *c)
```

如果用 Vim 的話來說可能是...

- A：`V`、`3j`、`:s/{/;`、`Enter`（使用 Visual line 搜尋 `{` 並替換成 `;`）
- B：`Ctrl-v`、`3j`、`$`、`A`、`;`、`ESC`（使用 Visual block 到行末 Append `;`）

不知道你覺得哪個操作比較快，我自己是更加熟悉 B 的那套操作，而且實際上要按的鍵數也比較少。看來這次是 B 的勝利。不過對於 Vim 的使用者來說，這個差距不是很大。

# Coding Style

讓我們來看一下主流的 Coding style 長什麼樣。首先要注意的是，一般說的 K&R 有兩種：

1. 第一種是網路上大家普遍討論時認爲的 K&R，即所有左右花括號都不換行。以下稱其爲 gen-K&R。
2. 第二種是 Linux kernel 所使用的 K&R，函數的左右花括號換行，其餘的左右花括號都不換行。以下稱其爲 linux-K&R。這種才是 Kernighan & Ritchie 的書《[The C Programming Language](https://en.wikipedia.org/wiki/The_C_Programming_Language)》中真正使用的風格。

```c
// gen-K&R
typedef struct {
    int foo;
    int bar;
} foo_bar_t;

int main(void) {
    foo_bar_t my_foobar = {
        .foo = 0,
        .bar = 1,
    };

    int arr[1024] = {0};

    if (b > 1) {
        b--;
    } else {
        b++;
    }
    
    while (1) {
        b++; 
    }
}
```

```c
// linux-K&R
typedef struct {
    int foo;
    int bar;
} foo_bar_t;

int main(void)
{
    foo_bar_t my_foobar = {
        .foo = 0,
        .bar = 1,
    };

    int arr[1024] = {0};

    if (b > 1) {
        b--;
    } else {
        b++;
    }
    
    while (1) {
        b++;
    }
}
```

```c
// Allman
typedef struct
{
    int foo;
    int bar;
} foo_bar_t;

int main(void)
{
    foo_bar_t my_foobar = {
        .foo = 0,
        .bar = 1,
    };

    int arr[1024] = {0};

    if (b > 1)
    {
        b--;
    }
    else
    {
        b++;
    }
    
    while (1)
    {
        b++;
    }
}
```

嘗試歸納並描述它們的規則：

- gen-K&R：所有的左右花括號都不換行。
- linux-K&R：所有的左右花括號都不換行，除了函數。
- Allman：流程控制、迴圈、函數的左右花括號都換行（`do-while` 的右花括號可能是例外）。`typedef` 的左花擴行換行、右花括號不換行。初始化時左右花括號不換行。

很明顯，gen-K&R 的規則最簡單且毫無例外。linux-K&R 的規則比 gen-K&R 多了一個唯一的例外。Allman 的規則就複雜多了。

# 總結

在實例比較時，我認爲風格 A——*所有的左右花括號都不換行*——在多數情況下都是最好看、自然且直覺的，除了「宣告函式原型」的地方，因爲它的操作要更多一點。而且風格 A 的規則也是最少的。

- 如果完全套用風格 A 的話，你得到的是 gen-K&R。
- 如果你想要在「宣告函式原型」的地方佔有操作優勢的話，你得到的是 linux-K&R。雖然這樣會多一個例外，但也只是多一個而已。多增加的這個例外可以幫你換到操作優勢。

恩... K&R 一家親。總之在我的定義下，K&R 風格是較具優勢的，無論是 gen- 還是 linux-。

但是還有一點，在我的定義下，「看得順眼」的權重更高。你完全有理由只憑這點就推翻上面的所有比較，然後繼續用你最熟悉的 Coding style。當然你也有可能和我一樣，瞬間跳槽。

# 參考

- [Linux kernel coding style — The Linux Kernel documentation](https://www.kernel.org/doc/html/v4.10/process/coding-style.html)
- [The C Programming Language - Wikipedia](https://en.wikipedia.org/wiki/The_C_Programming_Language)
