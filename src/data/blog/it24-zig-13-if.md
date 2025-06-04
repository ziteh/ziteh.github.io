---
title: "[Day-13]Zig：流程控制 if"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-05T07:21:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

`if` 是各種語言的最基本的語法。

<!-- more -->

# 基本

Zig 的普通 `if` 語法使用 `if`、`else if`、`else`，且條件需要使用括號 `()` 包圍。條件式需要是明確的 `bool` 型別（只能是 `true` 或 `false`），不存在整數及其它型別的隱式轉換（即不能用 `0` 代表 `false`，或 `1` 代表 `true`）。

```zig
const std = @import("std");

pub fn main() void {
    const a: u8 = 32;
    const b: u8 = 128;

    if (a > b) {
        std.debug.print("A", .{});
    } else if (a < b) {
        std.debug.print("B", .{});
    } else {
        std.debug.print("eq", .{});
    }
}
```

```bash
B
```

# 三元運算子

Zig 沒有 C 那樣的三元運算子（Ternary operation）`A ? T : F`，但是可以直接使用 `if-else` 來達成相同的效果，也就是說，Zig 的 `if` 可以作為表達式（Expressions）。這樣的設計和 Python 有點類似。我個人覺得這樣的可讀性更好，因為它更接近自然語言，而不是用符號代替意義。

```zig
const std = @import("std");

pub fn main() void {
    const a: u8 = 32;
    const b: u8 = 128;

    const c = if (a > b) "A" else "B";

    std.debug.print("{s}", .{c});
}
```

```bash
B
```

# 可選值

除了 `bool` 型別，`if` 的括號內也可以填入可選型別（Optionals），它會變成判斷其值是否為 `null`，並且可以搭配捕獲（Capture）語法來提取子數值。

```zig
const std = @import("std");

pub fn main() void {
    var a: ?u8 = 32;
    check(a);

    a = null;
    check(a);
}

fn check(a: ?u8) void {
    if (a) |value| { // Capture
        std.debug.print("Value: {}\n", .{value});
    } else {
        std.debug.print("Value: null\n", .{});
    }
}
```

```bash
Value: 32
Value: null
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#if)
- [If Expressions | zig.guide](https://zig.guide/language-basics/if)

本文以 Zig `0.13.0` 為主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10347981)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/if)
