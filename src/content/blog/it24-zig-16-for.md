---
title: "[Day-16]Zig：for 迴圈"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-08T15:43:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

`for` 是一種基於可迭代（Iterate）陣列的迴圈。

<!-- more -->

Zig 的 `for` 是比較接近如 Python 這種直接針對可迭代的迴圈，而不是傳統 C 的那種針對數值範圍及條件的 `for`。

# 基本

`for` 可以直接使用陣列或切片迭代，並且使用 Capture `|v|` 來取得值。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const number_set = [_]u8{ 1, 3, 4, 5, 7, 8 };

    for (number_set) |num| {
        print("{}, ", .{num});
    }
}
```

```bash
1, 3, 4, 5, 7, 8,
```

# 包含 Index

如果除了數值還需要索引值 Index，可以這樣寫：

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const number_set = [_]u8{ 1, 3, 4, 5, 7, 8 };

    for (number_set, 0..) |num, index| {
        print("Value{}: {}, ", .{ index, num });
    }
}
```

```bash
Value0: 1, Value1: 3, Value2: 4, Value3: 5, Value4: 7, Value5: 8,
```

如果你想要基於陣列或切片數量的 Index，但又用不到其數值本身，可以以底線 `_` 明確捨棄。

```zig
const number_set = [_]u8{ 1, 3, 4, 5, 7, 8 };

for (number_set, 0..) |_, index| {
    print("Value{}, ", .{ index });
}
```

# 僅數值範圍

如果只需要單純的數值範圍，可以直接使用範圍語法，不用另外建立陣列。範圍語法為 `S..E`，為從 `S` 開始遞增的到 `E`（不包含）。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    for (1..6) |i| {
        print("{}, ", .{i});
    }
}
```

```bash
1, 2, 3, 4, 5,
```

# break 和 continue

`for` 和 `while` 一樣支援 `break` 和 `continue`，其用法效果也相同，這裡就不多贅述了。

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#for)
- [For loops | zig.guide](https://zig.guide/language-basics/for-loops)

本文以 Zig `0.13.0` 為主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10348358)
- [我的 Blog](https://ziteh.github.io/posts/it24-zig-16-for)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/for)
