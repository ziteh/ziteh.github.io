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

UML（Unified Modeling Language）統一塑模語言是一系列用來描述程式的圖表。其中的類別圖（Class diagram）是用來描述程式中各個類別（包含實體、抽象和介面）間的關係，在描述和分析程式架構時非常有用。

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
- **方法（Methods 或 Operations）**：該類別擁有的方法（或著說，成員函數），非必要。
    - 每一行代表一個方法。
    - 置左對齊、小駝峰（lowerCamelCase）。若爲靜態（Static）則加上底線（Underlined）。
    - 格式：`[封裝符號] [方法名]([參數型別1], [參數型別2]): [回傳值型別]`

## 封裝符號

|符號|封裝層級|意義|
|:-:|:-:|:--|
|`+`|Public|公開，所有對象皆可存取|
|`-`|Private|私有，僅自己可存取|
|`#`|Protected|保護，僅自己和自己的子類（衍生類）可存取|
|`~`|Package|套件，僅相同套件內可存取|
|`/`|Derived||

# 描述關係

- 類別間
    - 繼承（Inheritance 或 Generalization）：A is a type of B
    - 實作（Implementation 或 Realization）：A implements B
- 實體間
    - 聚合（Aggregation）：A owns B
    - 組合（Composition）：B is a part of A
    - 依賴（Dependency）：A uses B
    - 關聯（Association）：A knows B

