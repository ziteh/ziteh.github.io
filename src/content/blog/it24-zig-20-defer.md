---
title: "[Day-20]Zig：defer"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-12T06:38:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

`defer` 對於 C 和 Rust 的使用者是個比較陌生的語法，它是用來在離開目前的作用域（Scope）時自動執行表達式（expression）。

<!-- more -->

它通常用來處理資源釋放。只要在分配資源程式下增加一個 `defer`，就可以確保程式離開 Scope 後會呼叫 `defer` 並釋放資源。

# 基礎

語法爲 `defer expression`。在離開該 `defer` 所在的 Scope （例如 `{}` 或函式）時會自動執行所接的 expression。

```zig
const print = @import("std").debug.print;

pub fn main() !void {
    var x: u8 = 10;
    {
        defer x += 1;
        print("X: {}\n", .{x});
    }
    print("X: {}\n", .{x});
}
```

```bash
X: 10
X: 11
```

# 順序

如果有多個 `defer`，會以相反的順序執行。

以此例來說，會先執行 `x *= 2`，再執行 `x += 1`。

```zig
const print = @import("std").debug.print;

pub fn main() !void {
    var x: u8 = 10;
    {
        defer x += 1;
        defer x *= 2;
        print("X: {}\n", .{x});
    }
    print("X: {}\n", .{x});
}
```

```bash
X: 10
X: 21
```

# 區塊

如果要執行的表達式有多行，也可以使用 `{ }` 包圍它們。請注意此處的輸出結果和執行順序！

```zig
const print = @import("std").debug.print;

pub fn main() !void {
    var x: u8 = 10;
    {
        defer {
            x += 1;
            x *= 2;
        }
        print("X: {}\n", .{x});
    }
    print("X: {}\n", .{x});
}
```

```bash
X: 10
X: 22
```

# 函式

函式也算是 Scope，離開函式時也會觸發 `defer`。

```zig
const print = @import("std").debug.print;

var x: u8 = 10;

pub fn main() !void {
    foo();
    print("X: {}\n", .{x});
}

fn foo() void {
    defer x += 1;
    print("X: {}\n", .{x});
}
```

```bash
X: 10
X: 11
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#defer)
- [Defer | zig.guide](https://zig.guide/language-basics/defer)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10349578)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/defer)
