---
title: "Zig：ArrayList"
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

ArrayList 是一種動態的數組容器，可以儲存相同型別、不定長度的資料（執行期分配），類似 Rust 中的 `Vec<T>`。

<!-- more -->

# 基礎

ArrayList 是由標準庫提供的。由於是動態分配的型別，所以要使用它的話需要透過 Allocator 來分配，並且也需要做好釋放資源的處理。只要系統可以成功分配空間，ArrayList 的長度就可以一直加。使用 `items` 欄位存取成員。

`defer` 還沒介紹到，目前只要知道那兩行 `deinit()` 是用來處理資源釋放的就好。

```zig
const std = @import("std");
const print = std.debug.print;
const ArrayList = std.ArrayList;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    const allocator = gpa.allocator();
    var list = ArrayList(i8).init(allocator);
    defer list.deinit();

    try list.append(1);
    try list.append(2);
    try list.append(-3);

    print("{}, {}, {}\n", .{ list.items[0], list.items[1], list.items[2] });
}
```

```bash
1, 2, -3
```

# for

其成員也可以用 `for` 迴圈處理。

```zig
const std = @import("std");
const print = std.debug.print;
const ArrayList = std.ArrayList;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    const allocator = gpa.allocator();
    var list = ArrayList(i8).init(allocator);
    defer list.deinit();

    try list.append(1);
    try list.append(2);
    try list.append(-3);

    for (list.items) |item| {
        print("{}, ", .{item});
    }
}
```

```bash
1, 2, -3,
```

# 型別

使用 `@TypeOf()` 查看具體型別。

```zig
const std = @import("std");
const print = std.debug.print;
const ArrayList = std.ArrayList;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    const allocator = gpa.allocator();
    var list = ArrayList(i8).init(allocator);
    defer list.deinit();

    try list.append(1);
    try list.append(2);
    try list.append(-3);

    print("{}\n", .{@TypeOf(list)});
    print("{}", .{@TypeOf(list.items)});
}
```

```bash
array_list.ArrayListAligned(i8,null)
[]i8
```

# 參考

- [ArrayList | zig.guide](https://zig.guide/standard-library/arraylist)
- [Learning Zig - Coding in Zig](https://www.openmymind.net/learning_zig/coding_in_zig/#arraylist)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#toc-Zig-Standard-Library)
