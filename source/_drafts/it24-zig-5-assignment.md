---
title: "Zig：賦值（Assignment）"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-MM-DDTHH:MM:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

賦值（Assignment）是各種程式語言中最基本的操作。

<!-- more -->

在 Zig 中只有兩種賦值關鍵字：

- `const`：不可變的常數（immutable constant）
- `var`：可變的變數（mutable variable）

型別在後。無論是 `const` 還是 `var` 都要求一定要在宣告時給值。如果初始值爲止或想留空，明確地賦予 `undefined`，這是 Zig 的「沒有隱藏」的宗旨。

```zig
pub fn main() !void {
    // var a: u8;           // 這行會導致編譯錯誤
    var a: u8 = undefined;  // 這是對的

    a = 100;
    std.debug.print("Value: {d}\n", .{a});
}
```

不像 Rust 會明確區分編譯期常數（`const`）和執行期不可變變數（`let`），Zig 只使用 `const` 表達不可變的值。至於它究竟是在執行期還是編譯期確認，Zig 會盡可能將其在編譯期處理完成（如何可能的話）。

# 自動型別推斷

Zig 擁有自動型別推斷，可以省略型別標記，但僅限於 `const`。

```zig
pub fn main() !void {
    const a = 100;
    std.debug.print("Value: {d}\n", .{a});
}
```

# 全域變數

在 Zig 中更精準的名稱可能是模組級變數（和常數），但我還是以 C 的習慣稱其全域變數。定義在函式以外的 `const` 和 `var` 會成爲全域變數，所有在此模組內的函式都可以直接存取。

只有 `const` 可以加上 `pub` 關鍵字，使其成爲公開常數，讓其它模組 `@import` 時可以使用，就和 `pub fn` 是一樣的。`var` 不行加上 `pub`，Zig 不允許公開的變數。

# static 區域變數

在 C 中有時會使用 `static` 區域變數，讓該變數的生命週期變成整個程式，但一樣只有該函式可以存取它（因爲是區域的）。Zig 沒有相似的設計，如果需要變數數值在離開函式後依舊保持，直接使用全域變數，其生命週期會延續到整個模組。

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Assignment)
- [Assignment | zig.guide](https://zig.guide/language-basics/assignment)
