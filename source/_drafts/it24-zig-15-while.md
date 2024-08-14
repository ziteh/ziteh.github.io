---
title: "Zig：while 迴圈"
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

`while` 是一種條件迴圈，只要條件符合，就會一直執行。

<!-- more -->

# 基本

Zig 的 `while` 語法和多數語言相同，和 `if` 一樣，普通的條件式需爲明確的 `bool` 型別（`true` 或 `false`），不支援其它數值隱式轉換。也就是說，無窮迴圈是 `while (true) {}`。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    var count: u8 = 10;
    while (count > 0) {
        count -= 1;
        print("{}, ", .{count});
    }
    print("\nEnd", .{});
}
```

```bash
9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
End
```

# continue expression

Zig 有個特別的 continue expression，會在每次 `while` 迴圈**繼續**進行後執行。請比較這裡和上一個「基本」的輸出差異。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    var count: u8 = 10;
    while (count > 0) : (count -= 1) {
        print("{}, ", .{count});
    }
    print("\nEnd", .{});
}
```

```bash
10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
End
```

# 可選值

和 `if` 一樣，條件式內也可以是 Optional，並搭配 Capture 使用。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const a: ?u8 = 10;
    while (a) |value| {
        print("value: {}\n", .{value});
        break;
    }
    print("End\n", .{});

    print("-----\n", .{});

    const b: ?u8 = null;
    while (b) |value| {
        print("value: {}\n", .{value});
        break;
    }
    print("End\n", .{});
}
```

```bash
value: 10
End
-----
End
```

# break

`break` 會直接跳出迴圈。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    var count: u8 = 10;
    while (count > 0) {
        count -= 1;
        if (count == 5) {
            break;
        }
        print("{}, ", .{count});
    }
    print("\nEnd", .{});
}
```

```bash
9, 8, 7, 6,
End
```

# continue

`continue` 會跳過迴圈內的剩餘部分，直接開始下一次。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    var count: u8 = 10;
    while (count > 0) {
        count -= 1;
        if (count == 5) {
            continue;
        }
        print("{}, ", .{count});
    }
    print("\nEnd", .{});
}
```

```bash
9, 8, 7, 6, 4, 3, 2, 1, 0,
End
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#while)
- [While loops | zig.guide](https://zig.guide/language-basics/while-loops)
