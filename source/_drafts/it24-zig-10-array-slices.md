---
title: "Zig：陣列（Array）和切片（Slices）"
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

陣列 Array 是每個語言都有的基本功能，而切片 Slices 則是現代語言常見的陣列參照。

<!-- more -->

# 陣列

## 基本

陣列在編譯期確定長度、單一型別。宣告時可以省略長度，Zig 會根據初值自行推斷。

```zig
const std = @import("std");

pub fn main() void {
    const arr1 = [_]u8{ 1, 2, 3, 4, 5 };
    const arr2 = [5]u8{ 1, 2, 3, 4, 5 };
    const arr3: [5]u8 = .{ 1, 2, 3, 4, 5 };

    std.debug.print("{}, {}, {}\n", .{ arr1[0], arr2[0], arr3[0] });
}
```

```bash
1, 1, 1
```

## 長度

要得知陣列長度（元素數量），可以直接使用 `array.len` 欄位。

```zig
const std = @import("std");

pub fn main() void {
    const arr = [_]u8{ 1, 2, 3, 4, 5 };
    const length = arr.len;
    std.debug.print("Length: {}", .{length});
}
```

```bash
Length: 5
```

## 賦值

如果是以 `var` 宣告的話，可以爲元素重新賦值。

```zig
const std = @import("std");

pub fn main() void {
    var arr = [_]u8{ 1, 2, 3, 4, 5 };
    arr[1] = 100;
    std.debug.print("{}", .{arr[1]});
}
```

```bash
100
```

## 邊界檢查

Zig 會進行邊界檢查，如果 Index 超出陣列範圍，引發編譯錯誤。

```zig
const std = @import("std");

pub fn main() void {
    const arr = [_]u8{ 1, 2, 3, 4, 5 };
    const val = arr[8]; // Error: Index outside!
    std.debug.print("{}", .{val});
}
```

```bash
$ zig run outside.zig
outside.zig:5:21: error: index 8 outside array of length 5
    const val = arr[8]; // Error: Index outside!
```

# 切片

## 基本

切片是對於一個陣列的指標和長度資訊。它是一個陣列的一部分，由於是指標，不實際儲存陣列數值，適合傳遞。切片也可以透過 `slice.len` 取代長度。

它的語法是 `array[n..m]`，其中 `n` 是開始索引，`m` 是結束索引（不包含）。所以  `array[0..3]` 就是取第 0~2。如果要取到最後的話，`m` 可以省略，也就是 `array[n..]`。

```zig
const std = @import("std");

pub fn main() void {
    const array = [_]u8{ 1, 2, 3, 4, 5 };
    const slice1 = array[0..2]; // {1, 2}
    const slice2 = array[0..4]; // {1, 2, 3}

    std.debug.print("Slice 1:\n", .{});
    std.debug.print("  {}, {}\n", .{ slice1[0], slice1[1] });
    std.debug.print("  Length: {}\n\n", .{slice1.len});

    std.debug.print("Slice 2:\n", .{});
    std.debug.print("  Length: {}", .{slice2.len});
}
```

```bash
Slice 1:
  1, 2
  Length: 2

Slice 2:
  Length: 4
```

## 型別

```zig
const std = @import("std");

pub fn main() void {
    const array = [_]u8{ 1, 2, 3, 4, 5 };
    const slice = array[0..];

    std.debug.print("Array type: {}\n", .{@TypeOf(array)});
    std.debug.print("Slice type: {}  ", .{@TypeOf(slice)});
}

```

```bash
Array type: [5]u8
Slice type: *const [5]u8
```

## 傳遞

因爲切片只是指標，所以很適合傳遞，而已它帶有長度資訊，所以可以不必另外傳遞長度。

```zig
const std = @import("std");

pub fn main() void {
    const array1 = [_]u8{ 1, 2, 3, 4, 5 };
    do_something(&array1);

    const array2 = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8 };
    do_something(&array2);

    do_something(array2[2..6]);
}

fn do_something(data: []const u8) void {
    std.debug.print("Value: {}\n", .{data[0]});
    std.debug.print("length: {}\n", .{data.len});
    std.debug.print("Type: {}\n\n", .{@TypeOf(data)});
}
```

```bash
Value: 1
length: 5
Type: []const u8

Value: 1
length: 8
Type: []const u8

Value: 3
length: 4
Type: []const u8
```

## 字串

字串實際上是 `u8` 切片。

```zig
const std = @import("std");

pub fn main() void {
    const arr = "Hello World";
    const arr_type = @TypeOf(arr);
    const length = arr.len;

    std.debug.print("Type: {}, Length: {}\n", .{ arr_type, length });
}
```

```bash
Type: *const [11:0]u8, Length: 11
```

# 參考

- [Array: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Arrays)
- [Slices: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Slices)
- [Arrays | zig.guide](https://zig.guide/language-basics/arrays)
