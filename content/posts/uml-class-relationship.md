---
title: "UML 類別圖概述"
subtitle: ""
# description: ""
tags: ["教學", "程式"]
series: []
# categories: []
date: YYYY-MM-DDThh:mm:ss+08:00
header_img: ""
comment: true
toc: true
draft: true # false
---

[UML（Unified Modeling Language）](https://www.uml.org/index.htm)統一塑模語言是一系列用來描述程式的圖表，由 [OMG（Object Management Group）](http://www.omg.org/)訂定並發佈。其中的類別圖（Class diagram）是用來描述程式中各個類別（包含實體、抽象和介面）間的關係，在描述和分析程式架構時非常有用。

目前最新的版本是 2017 年頒佈的 [2.5.1](https://www.omg.org/spec/UML/2.5.1/About-UML)。

<!--more-->

# 描述類別

類別（Class）的圖案是一個矩形，內部分成上中下三個區域，依序爲：

- **名稱（Name）**：即該類別的名稱，必要。
    - 置中對齊、大駝峰（UpperCamelCase）、粗體字。
    - 若爲抽象（Abstract）類別則使用斜體字；若爲介面（Interface）則在名稱上加一行 `<<Interface>>`。
- **屬性（Attributes）**：該類別擁有的屬性（或著說，成員變數），非必要。
    - 每一行代表一個屬性。
    - 置左對齊、小駝峰（lowerCamelCase）。若爲靜態（Static）則加上底線（Underlined）。
    - 格式：`[封裝符號] [屬性名]: [型別]`
- **方法（Operations 或稱 Methods）**：該類別擁有的方法（或著說，成員函數），非必要。
    - 每一行代表一個方法。
    - 置左對齊、小駝峰（lowerCamelCase）。若爲靜態（Static）則加上底線（Underlined）。
    - 格式：`[封裝符號] [方法名]([參數型別1], [參數型別2]): [回傳值型別]`

> 封裝符號基本上可以根據需求省略（有時候想保持簡潔且不關心封裝時，或是像 Interface 都是 Public 所以也不用特地標註）。

## 封裝符號

|符號|封裝層級|意義|
|:-:|:-:|:--|
|`+`|Public|公開，所有對象皆可存取|
|`-`|Private|私有，僅自己可存取|
|`#`|Protected|保護，僅自己和自己的子類（衍生類）可存取|
|`~`|Package|套件，僅相同套件內可存取|
|`/`|Derived||

# 描述關係

關係的描述可以再細分爲類別（Class）或實例（Instance）之間的關係。繼承和實作是描述類別間的關係，聚合、組合、依賴和關聯是描述實例的。

|關係|原文|關鍵字|概念|圖案|
|:-:|:-:|:-:|:-|:-:|
|繼承|Generalization 或 Inheritance|is a|就如同一般 OOP 中的繼承||
|實作|Realization 或 Implementation|implement|通常用在表達實現了 Interface||
|聚合|Aggregation|owns|弱擁有，兩者的生命週期無關且獨立||
|組合|Composition|is a part of|強擁有，兩者的什麼週期相關||
|依賴|Dependency|use|使用，例如僅當作參數傳遞||
|關聯|Association|known|若上述關聯皆不適合描述，則用此表達||



舉一些比較生活化的例子：

- 繼承：***iPhone*** 繼承了/是一種 ***手機***
- 實作：***手機*** 實現了 ***通話功能***
- 聚合：***機場*** 有 ***飛機***
- 組合：***飛機跑道*** 是 ***機場*** 的一部分
- 依賴：(想不到生活化的例子)
- 關聯：(想不到生活化的例子)


