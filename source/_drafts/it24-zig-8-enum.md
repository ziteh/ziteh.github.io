---
title: "Zig：列舉（Enum）"
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

列舉（Enum）也是各個語言中常見且好用的自訂型別。

<!-- more -->

和多數語言一樣，`enum` 可以用來創造一些固定的「選項」，對程式碼可讀性和強健性來說都很好用。比較特別的是，Zig 的 `enum` 也可以包含方法（method）。

# 基本

```zig
const std = @import("std");

const Color = enum {
    red,
    blue,
    green,
};

pub fn main() void {
    const my_color1 = Color.red;
    const my_color2: Color = .blue;

    if (my_color1 == Color.red) {
        std.debug.print("Ok\n", .{});
    }
    if (my_color2 == Color.blue) {
        std.debug.print("Ok", .{});
    }
}

```

# 數值

和其它語言一樣，`enum` 各項目可以賦予數值，但是要指定儲存的型別，且只能是整數型別。`enum` 的項目不會直接隱式地轉換成整數值，要用 `@intFromEnum()` 明確轉型。

```zig
const std = @import("std");

const HttpCode = enum(u16) {
    bad_request = 400,
    forbidden = 403,
    not_found = 404,
    im_a_teapot = 418,
};

pub fn main() void {
    const status = HttpCode.not_found;

    if (@intFromEnum(status) == 404) {
        std.debug.print("Ok", .{});
    }
}
```

# 預設數值

如果不指定數值，或沒有完全指定數值，Zig 會自動遞增。

```zig
const std = @import("std");

const Enum1 = enum {
    value1,
    value2,
    value3,
};

const Enum2 = enum(u8) {
    value1 = 100,
    value2,
    value3,
};

const Enum3 = enum(i8) {
    value1 = -1,
    value2,
    value3,
};

const Enum4 = enum(i8) {
    value1,
    value2 = 100,
    value3,
};

pub fn main() void {
    std.debug.print("Enum1: {}, {}, {}\n", .{
        @intFromEnum(Enum1.value1), @intFromEnum(Enum1.value2), @intFromEnum(Enum1.value3) });

    std.debug.print("Enum2: {}, {}, {}\n", .{
        @intFromEnum(Enum2.value1), @intFromEnum(Enum2.value2), @intFromEnum(Enum2.value3) });

    std.debug.print("Enum3: {}, {}, {}\n", .{
        @intFromEnum(Enum3.value1), @intFromEnum(Enum3.value2), @intFromEnum(Enum3.value3) });

    std.debug.print("Enum4: {}, {}, {}  ", .{
        @intFromEnum(Enum4.value1), @intFromEnum(Enum4.value2), @intFromEnum(Enum4.value3) });
}
```

```bash
Enum1: 0, 1, 2
Enum2: 100, 101, 102
Enum3: -1, 0, 1
Enum4: 0, 100, 101
```

# 大小

```zig
const std = @import("std");

const Enum1 = enum {
    value1,
    value2,
};

const Enum2 = enum(u16) {
    value1,
    value2,
};

pub fn main() void {
    std.debug.print("Int32: {d} byte\n", .{@sizeOf(i32)});
    std.debug.print("Enum1: {d} byte\n", .{@sizeOf(Enum1)});
    std.debug.print("Enum2: {d} byte\n", .{@sizeOf(Enum2)});
}
```

```bash
Int32: 4 byte
Enum1: 1 byte
Enum2: 2 byte
```

# 方法

`enum` 可以包含方法，這在型別轉換時很有用。

```zig
const std = @import("std");

const Color = enum {
    red,
    blue,
    green,
    others,

    pub fn from_string(str: []const u8) Color {
        if (std.mem.eql(u8, str, "Red")) {
            return Color.red;
        } else if (std.mem.eql(u8, str, "Blue")) {
            return Color.blue;
        } else if (std.mem.eql(u8, str, "Green")) {
            return Color.green;
        } else {
            return Color.others;
        }
    }
};

pub fn main() void {
    const my_color = Color.from_string("Red");

    if (my_color == Color.red) {
        std.debug.print("Ok", .{});
    }
}
```

```bash
Ok
```

# 包含變數或常數

比較特別的是 `enum` 也可以包含 `var` 或 `const`。

```zig
const std = @import("std");

const Enum1 = enum {
    var my_var: u8 = 0;
    const my_const: u8 = 100;

    value1,
    value2,
};

pub fn main() void {
    Enum1.my_var += 1;

    std.debug.print("Var: {}\n", .{Enum1.my_var});
    std.debug.print("Const: {}\n", .{Enum1.my_const});
}
```

```bash
Var: 1
Const: 100
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#enum)
- [Enums | zig.guide](https://zig.guide/language-basics/enums)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/categories/Zig-入門指南（鐵人-24）/)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
