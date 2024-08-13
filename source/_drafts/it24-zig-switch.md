---
title: "Zig：模式配對 switch"
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

`switch` 通常用來匹配一個變數的多種數值。

<!-- more -->

如果你和我一樣，原本是寫 C，後來接觸了 Rust，那你一定對 Rust 的 `match` 模式配對愛不釋手，希望 C 也有這樣的語法。 Zig 的 `switch` 雖然叫 switch，但設計上更類似 Rust 的 `match`，比 C 的還更靈活也很容易閱讀。

# 基本

語法和 Rust 的 `match` 類似。Zig 的 `switch` 要求處理所有情況，未配對成功的使用 `else` 來捕獲（如果你真的把所有可能的情況都列出來的話，則可以省略 `else`，特別是配對 `enum` 時）。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const http_code: u16 = 404;

    print("Statue: ", .{});
    switch (http_code) {
        400 => {
            print("Bad Request", .{});
        },
        403 => {
            print("Forbidden", .{});
        },
        404 => {
            print("Not Found", .{});
        },
        418 => {
            print("I'm a teapot", .{});
        },
        else => {
            @panic("Unknown");
        },
    }
}
```

```bash
Statue: Not Found
```

# 多重配對

如果有多個數值要使用同一套處理方式，可以使用逗號 `,` 組合多個數值來配對。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const value: u16 = 5;

    switch (value) {
        1, 2, 5 => {
            print("1, 2, 5 ({})", .{value});
        },
        3, 4 => {
            print("3, 4 ({})", .{value});
        },
        else => {
            @panic("Unknown");
        },
    }
}
```

```bash
1, 2, 5 (5)
```

# 範圍配對

如果要配對的的一個連續的數值範圍，可以使用 `S...E` 來配對，包含 `S` 和 `E`。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const value: u16 = 5;

    switch (value) {
        0 => {
            print("Zero", .{value});
        },
        1...5 => {
            print("1~5 ({})", .{value});
        },
        else => {
            print("Others ({})", .{value});
        },
    }
}
```

```bash
1~5 (5)
```

# 賦值

和 Rust 一樣，Zig 的 `switch` 可以作爲表達式，爲變數賦值。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const a: u8 = 10;
    const b = switch (a) {
        0 => 100,
        10 => 110,
        else => 0,
    };
    print("Value: {}", .{b});
}
```

```bash
Value: 110
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#switch)
- [Switch | zig.guide](https://zig.guide/language-basics/switch)
