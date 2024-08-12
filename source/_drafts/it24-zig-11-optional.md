---
title: "Zig：可選（Optional）"
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

如果你想要一個可選的數值，那 Optional 是一個好選擇。

<!-- more -->

類似於 Rust 的 `Option<T>`，Zig 的 Optional 提供數值被賦予 `null` 的能力，以代表空、沒有。

# 基本

在宣告時個型別前加上 `?` 使其變成可選類型。

```zig
const std = @import("std");

pub fn main() void {
    var value: ?u8 = null;
    std.debug.print("Value: {?}\n", .{value});

    if (value == null) {
        value = 32;
    }
    std.debug.print("Value: {?}", .{value});
}
```

```bash
Value: null
Value: 32
```

# orelse

可以使用 `orelse` 來展開（unwrap）可選型別，將其變成一般的子型別。

```zig
const std = @import("std");

pub fn main() void {
    var a: ?u8 = null;
    const b: u8 = 32;
    var c = a orelse b;
    std.debug.print("Value: {}\n", .{c});

    a = 128;
    c = a orelse b;
    std.debug.print("Value: {}\n", .{c});

    std.debug.print("Type: {}", .{@TypeOf(c)});
}
```

```bash
Value: 32
Value: 128
Type: u8
```

# unreachable

如果你確定該可選值目前不是 `null`，可以使用 `.?` 直接展開成子型別的數值。如果對 `null` 進行 `.?` 會在執行期引發 Painc 錯誤。

`value.?` 和 `value orelse unreachable` 具有相同的效果。

```zig
const std = @import("std");

pub fn main() void {
    var a: ?u8 = 32;
    var c = a.?;
    std.debug.print("Value: {}\n", .{c});

    a = null;
    c = a.?; // painc!
    std.debug.print("Value: {}\n", .{c});
}
```

```bash
Value: 32
thread 55352 panic: attempt to use null value
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Optionals)
- [Optionals | zig.guide](https://zig.guide/language-basics/optionals)
