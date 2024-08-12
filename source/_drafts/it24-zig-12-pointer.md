---
title: "Zig：指標（Pointer）"
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

指標（Pointer）是所有 C 語言使用者最熟悉的功能與特性，而 Zig 也延續了這種低階卻強大的記憶體操作能力。

<!-- more -->

指標，是一個指向數值的記憶體位置，不實際擁有該數值，只是該數值的一個參考。在 C 和 Zig 這樣充滿低階操作的語言中，這種操作記憶體的能力很重要。

# 基本

Zig 的指標用 `&T` 取址（參考），用 `T.*` 取值（解參考）。

```zig
const std = @import("std");

pub fn main() void {
    const value: u8 = 32;
    const ptr = &value;
    const deref = ptr.*;

    std.debug.print("Pointer: {}, Deref: {}", .{ ptr, deref });
}
```

```bash
Pointer: u8@e5068a, Deref: 32
```

# 修改性

如果原數值是 `var`，則可以透過解參考指標修改原始數值。如果指標本身是 `var`，則可以重新指向其它位置。也就是 C 中的 `int *const ptr`（常數的指標：不能重新指向，但可以修改指向的數值） 和 `const int *ptr`（指向常數的指標：可以重新指向、不能修改指向的數值） 的差別。當然，如果原數值和指標本身都是 `const`，那就是指標本身和原數值都不能修改。

我想 Zig 的語法應該滿直覺的，哪個是 `var` 哪個就可以改。

```zig
const std = @import("std");

pub fn main() void {
    var var_value: u8 = 32;
    const const_ptr = &var_value;
    std.debug.print("Value: {}\n", .{const_ptr.*});

    const_ptr.* += 100; // Modify value (value is var)
    std.debug.print("Value: {}\n", .{const_ptr.*});

    std.debug.print("-----\n", .{});

    const const_value: u8 = 32;
    var var_ptr = &const_value;
    std.debug.print("Value: {}\n", .{var_ptr.*});

    var_ptr = &var_value; // Modify pointer (pointer is var)
    std.debug.print("Value: {}\n", .{var_ptr.*});
}
```

```bash
Value: 32
Value: 132
-----
Value: 32
Value: 132
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Pointers)
- [Pointers | zig.guide](https://zig.guide/language-basics/pointers)
