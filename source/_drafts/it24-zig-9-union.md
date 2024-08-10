---
title: "Zig：聯合（Union）"
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

`union` 用來定義多型別單一值。

<!-- more -->

如有某一個數值在概念上可以用多種型別表達，但同時只會是一直型別的話，就可以用 `union` 處理。

# 基本

```zig
const std = @import("std");

const Result = union {
    int: u8,
    boolean: bool,
};

pub fn main() void {
    const res1 = Result{ .int = 32 };
    const res2 = Result{ .boolean = true };
    std.debug.print("Result: {}\n", .{res1.int});
    std.debug.print("Result: {}\n", .{res2.boolean});

    // Error
    // std.debug.print("Result: {}\n", .{res1.boolean});
    // std.debug.print("Result: {}\n", .{res2.int});
}
```

```bash
Result: 32
Result: true
```

# Tagged

你可以爲 `union` 加上 `enum` 標記，這樣它會變成 Tagged union，隨後你可以使用其 `enum` 來判斷目前是那個型別在作用中。通常搭配 `switch` 和 Payload 語法使用。

```zig
const std = @import("std");

const ResultTag = enum { int, boolean };

const Result = union(ResultTag) {
    int: u8,
    boolean: bool,
};

pub fn main() void {
    const res1 = Result{ .int = 32 };
    switch (res1) {
        ResultTag.int => |value| std.debug.print("int: {}\n", .{value}),
        ResultTag.boolean => |value| std.debug.print("boolean: {}\n", .{value}),
    }

    const res2 = Result{ .boolean = false };
    switch (res2) {
        ResultTag.int => |value| std.debug.print("int: {}\n", .{value}),
        ResultTag.boolean => |value| std.debug.print("boolean: {}\n", .{value}),
    }
}
```

```bash
int: 32
boolean: false
```

如果覺得這樣還要多打一個 `enum` 很麻煩的話，可以直接在 `union()` 內鍵入 `enum`。注意 `switch` 配對的對象。

```zig
// 這裡和上面的程式效果一樣
const std = @import("std");

const Result = union(enum) {
    int: u8,
    boolean: bool,
};

pub fn main() void {
    const res1 = Result{ .int = 32 };
    switch (res1) {
        Result.int => |value| std.debug.print("int: {}\n", .{value}),
        Result.boolean => |value| std.debug.print("boolean: {}\n", .{value}),
    }

    const res2 = Result{ .boolean = false };
    switch (res2) {
        Result.int => |value| std.debug.print("int: {}\n", .{value}),
        Result.boolean => |value| std.debug.print("boolean: {}\n", .{value}),
    }
}
```

# 方法

如同 `struct` 和 `enum`，Zig 的 `union` 也可以包含方法。

```zig
const std = @import("std");

const Result = union(enum) {
    int: u8,
    boolean: bool,

    pub fn print(self: Result) void {
        switch (self) {
            Result.int => |value| std.debug.print("int: {}\n", .{value}),
            Result.boolean => |value| std.debug.print("boolean: {}\n", .{value}),
        }
    }
};

pub fn main() void {
    const res1 = Result{ .int = 32 };
    res1.print();

    const res2 = Result{ .boolean = true };
    res2.print();
}
```

```bash
int: 32
boolean: true
```

# Tag Name

Tagged union 如果要取得字串形式的 tag name，可以用 `@tegName`。

```zig
const std = @import("std");

const Result = union(enum) {
    int: u8,
    boolean: bool,
};

pub fn main() void {
    std.debug.print("Name: {s}\n", .{@tagName(Result.int)});
}
```

```bash
Name: int
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#union)
- [Unions | zig.guide](https://zig.guide/language-basics/unions)
