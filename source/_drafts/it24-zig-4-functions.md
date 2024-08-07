---
title: "Zig：函式（Functions）"
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

Zig 身爲程序式編程（Procedural programming）語言，函式（Function）自然是一大重點（雖然這句話好像在 OOP 和 FP 上也適用...）。

<!-- more -->

# 基本語法

這是一個簡單的函式，它擁有兩個參數，和一個回傳值。參數名稱在前、型別後置，回傳值型別在最後。

```zig
fn doSomething(a: u8, b: u8) u16 {
    return a + b;
}
```

# 順序無關

不同於 C，Zig 的函式順序沒有限制，你可以隨意呼叫該函式前或後定義的其它函式，不必和 C 一樣要優先定義或宣告函式原型才可以呼叫。C 使用者大悅！

# 封裝

Zig 的函式和 Rust 一樣，只有加上 `pub` 的函式才是公開的，可以被外部 `@import` 存取和呼叫。否則預設爲私有的，只能在定義它的模組內部使用。

```zig
pub fn publicFunction() void {
    privateFunction();
}

fn privateFunction() void {
}
```

# 一級公民

Zig 的函式是一級公民（First class），這意味著函式可以像變數一樣傳遞、賦值。

```zig
const std = @import("std");

fn myFun(a: u8) u8 {
    return a * 2;
}

pub fn main() !void {
    const op = myFun;    // 賦值
    const value = op(6);
    std.debug.print("Value {d}\n", .{value});
}
```

```bash
$ zig build run
Value 12
```

或是傳遞函式：

```zig
const std = @import("std");

fn add(a: u8, b: u8) u8 {
    return a + b;
}

fn sub(a: u8, b: u8) u8 {
    return a - b;
}

fn doSomething(a: u8, b: u8, op: fn (u8, u8) u8) u8 {
    return op(a, b);
}

pub fn main() !void {
    const val1 = doSomething(10, 2, add);
    const val2 = doSomething(10, 2, sub);
    std.debug.print("Value1: {d}, Value2: {d}\n", .{ val1, val2 });
}
```

```bash
$ zig build run
Value1: 12, Value2: 8
```

# 明確捨棄回傳

和 Rust 一樣，如果該函式有回傳值，但是你不需要用它的話，使用底線 `_` 來承接回傳值，以明確地捨棄它。但 Zig 比 Rust 更強制要求這點。

```zig
const std = @import("std");

fn myFunc(a: u8) bool {
    std.debug.print("Value: {d}\n", .{a});
    return true;
}

pub fn main() !void {
    _ = myFunc(100);
}
```

# 內聯

Zig 和 C 一樣擁有 `inline` 修飾詞，可以將此函式直接在編譯期替換展開，可以免除調用呼叫的開銷。但是要注意的事也和 C 一樣，建議只有當你真的清楚時才使用它。無法被 `inline` 的話會造成編譯錯誤。

```zig
inline fn add(a: u8, b: u8) u8 {
    return a + b;
}
```

# 函式指標

Zig 做爲 C 替代，當然也有函式指標：

```zig
const opPtr = *const fn (a: u8, b: u8) u8;
```
