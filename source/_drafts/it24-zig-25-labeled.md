---
title: "Zig：標籤 Labeled"
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

有時候會需要寫一些比較複雜的多層迴圈程式，但這時如何要使用 `break` 或 `continue` 時會沒辦法控制要對哪一層迴圈進行。對於這種情況，只要爲迴圈打上標籤，就可以明確指定了。

<!-- more -->

# while

只要在 `while` 前打上 `LABEL:`，這個 While-loop 就會被標記，隨後只要使用 `break: LABEL` 或 `continue: LABEL` 就可以了

```zig
const print = @import("std").debug.print;

pub fn main() void {
    outer: while (true) {
        var val: u16 = 0;

        while (true) {
            print("Value: {}\n", .{val});
            val += 1;

            if (val == 4) {
                print("Break\n", .{});
                break :outer;
            }
        }
    }
}
```

```bash
Value: 0
Value: 1
Value: 2
Value: 3
Break
```

# for

For-loop 也是相同的方式。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    outer: for (1..100) |_| {
        for (1..10) |i| {
            print("Value: {}\n", .{i});
            if (i == 4) {
                print("Break\n", .{});
                break :outer;
            }
        }
    }
}
```

```bash
Value: 0
Value: 1
Value: 2
Value: 3
Break
```

# Block

Zig 的區塊 Block 可以作爲表達式回傳值。

這個範例提供一個類似 C/C++ 的 `#ifdef` 預處理器條件編譯的寫法。

```zig
const print = @import("std").debug.print;

const DEBUG = false;

pub fn main() void {
    const mode = blk: {
        if (DEBUG) {
            break :blk "Debug";
        } else {
            break :blk "Production";
        }
    };

    print("Running in {s} mode", .{mode});
}
```

```bash
Running in Production mode
```

# 參考

- [Labelled Loops | zig.guide](https://zig.guide/language-basics/labelled-loops)
- [Labelled Blocks | zig.guide](https://zig.guide/language-basics/labelled-blocks)
- [while: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Labeled-while)
- [for: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Labeled-for)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/posts/it24-zig-25-labeled)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/labeled)
