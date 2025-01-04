---
title: "[Day-26]Zig：迭代器（Iterator）"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-18T07:23:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

對於常寫 Python 的人應該很熟悉迭代器，在處理一些資料時比單純的陣列好用。Zig 通常使用擁有 `next()` 方法的 `struct` 來代表迭代器。

<!-- more -->

# 基礎

首先這是標準庫所提供的迭代器 `std.mem.split(T, V, S)`，其中 `T` 是型別，`V` 是資料，`S` 是分隔符。使用 `.next()` 進行迭代，如果回傳 `null` 則代表迭代完成。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() void {
    const string = "C,C++,Python,TypeScript";
    var iter = std.mem.split(u8, string, ",");

    while (true) {
        const item = iter.next();
        if (item == null) {
            break;
        }
        print("{s}\n", .{item.?});
    }
}
```

```bash
C
C++
Python
TypeScript
```

# 自製迭代器

Zig 的迭代器並不是特殊語法，只是約定俗成的慣例，如果想要自製迭代器的話，只要實作一個含有 `next()` 方法的 `struct` 即可。

```zig
const std = @import("std");
const print = std.debug.print;

const MyIterator = struct {
    list: []const i32,
    exclude: i32,
    index: usize = 0,

    fn next(self: *MyIterator) ?i32 {
        for (self.list[self.index..]) |item| {
            self.index += 1;
            if (item == self.exclude) {
                continue;
            }
            return item;
        }
        return null;
    }
};

pub fn main() void {
    var iter = MyIterator{
        .list = &[_]i32{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 },
        .exclude = 5,
    };

    while (true) {
        const item = iter.next();
        if (item == null) {
            break;
        }
        print("{}\n", .{item.?});
    }
}
```

```bash
1
2
3
4
6
7
8
9
10
```

# 參考

- [Iterators | zig.guide](https://zig.guide/standard-library/iterators)
- [Zig Iterators](https://danthedev.com/zig-iterators/)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/)

本文以 Zig `0.13.0` 為主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10353330)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/iterator)
