---
title: "Zig：向量（Vector）"
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

Vector 可以用來儲存一組相同型別的資料，其長度和型別需在宣告時指定且不能變更，支援 SIMD（Single instruction, multiple data）。

<!-- more -->

# 基礎

使用 `@Vector(L, T)` 宣告，其中 `L` 代表長度，`T` 代表型別，可以是布林、整數、浮點數、指標。

注意 Vector 不像 Array 和 Slice 那樣擁有 `.len` 欄位，也無法使用 `for` 迴圈遍歷。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const a: @Vector(3, i8) = .{ 1, 1, 5 };
    const b: @Vector(3, i8) = .{ 2, 5, -10 };
    const c = a + b;
    print("{}, {}, {}", .{ c[0], c[1], c[2] });
}
```

```bash
3, 6, -5
```

# 乘法

Vector 也可以用乘法。實際上它支援：

- 算數：`+`, `-`, `/`, `*`, `@divFloor`, `@sqrt`, `@ceil`, `@log`, etc.
- 位元操作：`>>`, `<<`, `&`, `|`, `~`, etc.
- 比較：`<`, `>`, `==`, etc.

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const a: @Vector(3, i8) = .{ 1, 1, 5 };
    const b: @Vector(3, i8) = .{ 2, 5, -10 };
    const c = a * b;
    print("{}, {}, {}", .{ c[0], c[1], c[2] });
}
```

```bash
2, 5, -50
```

# 填充

如果你需要用相同數值填滿整個 Vector，可以用 `@splat(V)`，其中 `V` 就是要填入的數值。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const a: @Vector(3, i8) = .{ 1, 1, 5 };
    const b: @Vector(3, i8) = @splat(2);
    const c = a + b;
    print("{}, {}, {}", .{ c[0], c[1], c[2] });
}
```

```bash
3, 3, 7
```

# 陣列

Vector 和 Array 可以互相轉換。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const arr = [_]i8{ 1, 2, 3 };
    const vec: @Vector(3, i8) = arr;
    print("{}, {}, {}", .{ vec[0], vec[1], vec[2] });
}
```

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const vec: @Vector(3, i8) = .{ 1, 2, 3 };
    const arr: [3]i8 = vec;
    print("{}, {}, {}", .{ arr[0], arr[1], arr[2] });
}
```

```bash
1, 2, 3
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Vectors)
- [Vectors | zig.guide](https://zig.guide/language-basics/vectors)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/categories/Zig-入門指南（鐵人-24）/)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
