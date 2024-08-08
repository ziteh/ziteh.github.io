---
title: "Zig：結構（Struct）"
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

`struct` 可以用來組織個複雜的自訂型別。

<!-- more -->

就會大多數的程式語言一樣，Zig 也有 `struct`，可以用來組合其它型別成爲一個新的型別。和 C 不同、但是和 Rust 類似的是，Zig 可以爲 `struct` 實作函式（在 Zig 中稱爲方法 method），這使得它很接近 OOP 中的 Class。

> 純 C 真的要包含函式的 `struct` 的話也可以用指標函式來達成，但這種做法不常見。

# 基本

使用 `const` 來宣告 `struct`：

```zig
const std = @import("std");

const Point = struct {
    x: f32,
    y: f32,
};

pub fn main() void {
    // 賦值
    const p1 = Point{
        .x = 10,
        .y = 123.45,
    };

    // 用 . 存取成員
    std.debug.print("X: {d}, Y: {d}", .{ p1.x, p1.y });
}
```

```bash
$ zig build run
X: 10, Y: 123.45
```

# 方法

可以爲 `struct` 定義 method：

```zig
const std = @import("std");

const Point = struct {
    x: f32,
    y: f32,

    pub fn add(self: Point) f32 {
        return self.x + self.y;
    }
};

pub fn main() void {
    const p1 = Point{
        .x = 10,
        .y = 123.45,
    };

    const add = p1.add();
    std.debug.print("Add: {d}", .{add});
}
```

```bash
$ zig build run
Add: 133.45
```

> 目前成員方法不用加 `pub` 也可被外部存取，我不確定是原本設計就是如此還是 bug。

靜態方法或建構子：

```zig
const std = @import("std");

const Point = struct {
    x: f32,
    y: f32,

    pub fn init(x: f32, y: f32) Point {
        return Point{
            .x = x,
            .y = y,
        };
    }
};

pub fn main() void {
    const p1 = Point.init(20, 3.5);
    std.debug.print("X: {d}, Y: {d}", .{ p1.x, p1.y });
}
```

```bash
$ zig build run
X: 20, Y: 3.5
```

# 預設值

可以自訂預設值：

```zig
const std = @import("std");

const Point = struct {
    x: f32 = 0,
    y: f32 = 100,
};

pub fn main() void {
    const p1 = Point{ .y = 12.5 };
    const p2 = Point{ .x = 245.8 };
    std.debug.print("X: {d}, Y: {d}\n", .{ p1.x, p1.y });
    std.debug.print("X: {d}, Y: {d}  ", .{ p2.x, p2.y });
}
```

```bash
$ zig build run
X: 0, Y: 12.5
X: 245.8, Y: 100
```

# 嵌套

如果要建構複雜的 `struct`，也可以互相嵌套：

```zig
const std = @import("std");

const Point = struct {
    x: f32,
    y: f32,
    pub fn init(x: f32, y: f32) Point {
        return Point{ .x = x, .y = y };
    }
};

const Line = struct {
    p1: Point,
    p2: Point,
};

pub fn main() void {
    const l1 = Line{
        .p1 = Point.init(10, 12.5),
        .p2 = Point.init(20.2, 110),
    };
    std.debug.print("X: {d}, Y: {d}\n", .{ l1.p1.x, l1.p1.y });
    std.debug.print("X: {d}, Y: {d}  ", .{ l1.p2.x, l1.p2.y });
}
```

```bash
$ zig build run
X: 10, Y: 12.5
X: 20.2, Y: 110
```

# 參考

- 本文的程式也儲存在 [GitHub](https://github.com/ziteh/zig-learn-it24/tree/main/struct)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#struct)
- [Structs | zig.guide](https://zig.guide/language-basics/structs)

> 本篇基於 Zig `0.13.0`
