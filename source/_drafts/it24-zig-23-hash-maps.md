---
title: "Zig：Hash Maps 鍵值對"
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

Hash Map 是一種 key-value pair（鍵值對），類似於 Rust 的 `HashMap<K, V>` 或 Python 的 `dict`。

<!-- more -->

# 基礎

Hash Map 由 std 標準庫提供，一般來說可以使用 `std.AutoHashMap(K, V)` 來宣告，其中 `K` 是 Key 的型別，`V` 是 Value 的型別。由於涉及動態分配，所以也需要使用 allocator，並且搭配 `defer` 和 `deinit()` 來釋放資源。

插入資料使用 `put(K, V)`。取得資料使用 `get(K)`。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    const allocator = gpa.allocator();
    var map = std.AutoHashMap(u8, []const u8).init(allocator);
    defer map.deinit();

    // Insert
    try map.put(0, "Zero");
    try map.put(1, "One");
    try map.put(2, "Two");

    const value = map.get(1);
    if (value) |v| {
        print("{s}", .{v});
    }
}
```

```bash
One
```

# 預設

`hash_map.get()` 回傳的型別是 Optional `?`，所以也可以搭配 `orelse` 來簡化 Key 不存在的處理。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    const allocator = gpa.allocator();
    var map = std.AutoHashMap(u8, []const u8).init(allocator);
    defer map.deinit();

    // Insert
    try map.put(0, "Zero");
    try map.put(1, "One");
    try map.put(2, "Two");

    const value = map.get(99) orelse "Default";
    print("{s}", .{value});
}
```

```bash
Default
```

# String

如果你想要使用 String 作爲 Key，可以直接使用 `std.StringHashMap(V)`。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    const allocator = gpa.allocator();
    var map = std.StringHashMap(u8).init(allocator);
    defer map.deinit();

    // Insert
    try map.put("Zero", 0);
    try map.put("One", 1);
    try map.put("Two", 2);

    const value = map.get("One");
    if (value) |v| {
        print("{}", .{v});
    }
}
```

```bash
1
```

# 參考

- [Hash Maps | zig.guide](https://zig.guide/standard-library/hashmaps)
- [Zig hashmaps explained | Hexops' devlog](https://devlog.hexops.com/2022/zig-hashmaps-explained/)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#toc-Zig-Standard-Library)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/categories/Zig-入門指南（鐵人-24）/)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
