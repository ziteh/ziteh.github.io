---
title: "[Day-27]Zig：進階迴圈"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-19T07:01:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

先前已經介紹過基本的 `for` 和 `while` 迴圈用法，這裡來介紹一些更進階的功能和語法。

<!-- more -->

# Loop as Expression

Zig 的迴圈可以作爲表達式（Expression）以回傳值。將 `break` 當成 `return` 使用，在後面加上要回傳的值，並加上 `else` 分支，當迴圈到結束都沒有執行到 `break` 時會回傳 `else` 後接的值。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const target = 5;
    const list = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    var index: u8 = 0;

    // Loop as expression
    const value = while (index < list.len) : (index += 1) {
        if (list[index] == target) {
            break true;
        }
    } else false; // 如果到最後都沒有執行到 break 則會回傳 else 的值

    print("{}", .{value});
}
```

```bash
true
```

# 內聯 Inline

迴圈也可以加上 `inline` 使其內聯。但要注意和對函式使用 `inline` 時一樣，一般來說編譯器會自動做最適合的處理，只有在你明確知道該情況顯式使用 `inline` 會有更好的效果時再使用，不然多數情況下交由編譯器判斷即可。

這個範例可能不是很適合，實際情況下如何有類似的需求，[comptime](/posts/it24-zig-24-comptime) 可能是更好的選擇。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const max = 10;
    comptime var i = 0;

    var sum: u16 = 0;
    inline while (i <= max) : (i += 1) {
        sum += i;
    }

    print("{}", .{sum});
}
```

```bash
55
```

# 參考

- [Loops as Expressions | zig.guide](https://zig.guide/language-basics/loops-as-expressions)
- Inline loop
    - [Inline Loops | zig.guide](https://zig.guide/language-basics/inline-loops)
    - [while: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#inline-while)
    - [for: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#inline-for)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10354071)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/loop_advanced)
