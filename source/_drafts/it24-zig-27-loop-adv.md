---
title: "Zig：進階迴圈"
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

這篇來介紹 Zig 對於 `while` 和 `for` 迴圈的兩個進階用法。

<!-- more -->

# Loop as Expression

Zig 的迴圈可以有回傳值。你可以在迴圈中將 `break` 當成 `return` 使用，在其後打上回傳值，並且增加一個 `else` 分支，當迴圈直到結束時都沒有 `break` 的話，則會回傳 `else` 的值。

這個範例會遍歷並尋找 `list` 中是否含有 `target`，有的話用 `break` 回傳 `true`，整個迴圈都結束也沒進入 `break` 的話就在 `else` 分支回傳 `false`。

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

# Inline Loop

迴圈也可以使用 `inline` 顯示地標記爲內聯。但是和內聯函式時一樣，除非你明確知道這樣比較好，否則大部分的情況下，編譯器會自行判斷，任意將迴圈標記爲內聯不一定對效能有所幫助。

下面這個例子可能不是舉得很好，實際情況下如果有類似的需求，使用 `comptime` 可能會更好。

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
- [Inline Loops | zig.guide](https://zig.guide/language-basics/inline-loops)
- [inline while: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#inline-while)
- [inline for: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#inline-for)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/posts/it24-zig-27-loop-adv)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/loop_advanced)
