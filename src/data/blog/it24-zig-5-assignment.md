---
title: "[Day-5]Zig：賦值（Assignment）與運算子（Operator）"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-08-28T06:50:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

賦值（Assignment）與運算子（Operator）是各種程式語言中最基本的操作。

<!-- more -->

# 賦值

在 Zig 中只有兩種賦值關鍵字：

- `const`：不可變的常數（immutable constant）
- `var`：可變的變數（mutable variable）

型別在後。無論是 `const` 還是 `var` 都要求一定要在宣告時給值。如果初始值未知或想留空，明確地賦予 `undefined`，這是 Zig 的「沒有隱藏」的宗旨。

```zig
pub fn main() !void {
    // var a: u8;           // 這行會導致編譯錯誤
    var a: u8 = undefined;  // 這是對的

    a = 100;
    std.debug.print("Value: {d}\n", .{a});
}
```

不像 Rust 會明確區分編譯期常數（`const`）和執行期不可變變數（`let`），Zig 只使用 `const` 表達不可變的值。至於它究竟是在執行期還是編譯期確認，Zig 會盡可能將其在編譯期處理完成（如果可能的話）。

## 自動型別推斷

Zig 擁有自動型別推斷，可以省略型別標記，但僅限於 `const` 和 `comptime var`，一般的 `var` 必須明確指定型別。

```zig
pub fn main() !void {
    const a = 100;
    std.debug.print("Value: {d}\n", .{a});
}
```

## 全域變數

在 Zig 中更精準的名稱可能是模組級變數（和常數），但我還是以 C 的習慣稱其全域變數。定義在函式以外的 `const` 和 `var` 會成為全域變數，所有在此模組內的函式都可以直接存取。

只有 `const` 可以加上 `pub` 關鍵字，使其成為公開常數，讓其它模組 `@import` 時可以使用，就和 `pub fn` 是一樣的。`var` 不行加上 `pub`，Zig 不允許公開的變數。

## static 區域變數

在 C 中有時會使用 `static` 區域變數，讓該變數的生命週期變成整個程式，但一樣只有該函式可以存取它（因為是區域的）。Zig 沒有相似的設計，如果需要變數數值在離開函式後依舊保持，直接使用全域變數，其生命週期會延續到整個模組。

## 強制轉型

有時會需要明確進行強制轉型。使用內建函式 `@as()` 達成。

```zig
const std = @import("std");

pub fn main() !void {
    const a: u8 = 5;
    const b = @as(u16, a);
    std.debug.print("Type a: {}\n", .{@TypeOf(a)});
    std.debug.print("Type b: {}\n", .{@TypeOf(b)});
}
```

```bash
Type a: u8
Type b: u16
```

> 在此例中，就算不用 `@as()`，直接打 `const b: u16 = a;` 也是可以通過編譯並正確執行，因為有 Integer Widening。

# 運算子

## 基本

Zig 的基本運算子和多數語言一樣，這裡僅列出一些常用的。

- 數學：`+`、`-`、`*`、`/`、`%`
- 位元：`<<`、`>>`、`&`、`|`、`^`、`~`
- 邏輯：`and`、`or`、`!`
- 比較：`==`、`!=`、`>`、`>=`、`<`、`<=`

一般的運算後賦值（如 `+=`、`*=`、`<<=`）也都有。

但是要注意 Zig 的 `++` 是陣列串聯，不是 C 的遞增算子。

還有雖然取址（Address of）和 C 一樣是 `&T`，但是指標解參考（Dereference、取值）是 `T.*`，和 C 不太一樣。

```zig
const std = @import("std");

pub fn main() void {
    const a: u8 = 100;
    const b: u8 = 2;
    const sum: u8 = a + b;

    std.debug.print("Sum: {}", .{sum});
}
```

```bash
Sum: 102
```

## 溢位

Zig 對於運算的要求相當嚴格，如果運算會發生溢位（Overflow），則必須指定溢位發生時的處理方式是飽和還是繞回，否則引發編譯期錯誤。

> - 繞回運算：數值溢位後，會從最低值繞回。例如 `u8` 的範圍是 0~255，如果 255 + 1 的話結果就會繞回到 0，255 + 2 就會繞回到 1.
> - 飽和運算：數值溢位後、會保持在最大/小值。例如 `u8` 的範圍是 0~255，如果 255 + a，只要 a>0，那結果也會一直保持在 `u8` 的最大值255。

所以 Zig 除了上面的一般運算子外，還分別有 Wrapping 和 Saturating 運算的變體。繞回運算的變體是加上 `%`；飽和運算的變體是加上 `|`。例如繞回加法是 `a +% b`、飽和加法是 `a +| b`；繞回加法賦值是 `a +%= b`、飽和加法賦值是 `a +|= b`。

```zig
const std = @import("std");

pub fn main() void {
    // u8: 0~255
    const a: u8 = 255;
    const b: u8 = 2;

    // const nor: u8 = a + b; // Error: overflow
    const wrp: u8 = a +% b;   // Wrapping addition
    const sat: u8 = a +| b;   // Saturating addition

    std.debug.print("Wrapping:   {}\n", .{wrp});
    std.debug.print("Saturating: {}\n", .{sat});
}
```

```bash
Wrapping:   1
Saturating: 255
```

# 參考

- [Documentation - The Zig Programming Language: Assignment](https://ziglang.org/documentation/0.13.0/#Assignment)
- [Documentation - The Zig Programming Language: Operators](https://ziglang.org/documentation/0.13.0/#Operators)
- [Assignment | zig.guide](https://zig.guide/language-basics/assignment)

本文以 Zig `0.13.0` 為主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10346602)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/assignment)
