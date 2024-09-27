---
title: "[Day-24]Zig：編譯期 Comptime"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-16T07:28:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

`comptime` 是 Zig 的一大特色，使用它可以將許多運算帶到編譯期，從而提高運行時的效率。這個功能類似 C++11 的 `constexpr` 和 C++20 的 `consteval`。

<!-- more -->

# 表達式

將 `comptime` 加在表達式（Expression）前，Zig 就會將其結果在編譯期計算。如果無法在編譯期完成計算則會發出編譯期錯誤。

這邊的例子是以遞迴的方式計算費波那契數，並分成在 Run-time 和 Compile-time 計算的。使用 `std.time.nanoTimestamp()` 得知耗時，可以發現使用 `comptime` 的運行時耗時都是 0，代表它們確實在編譯期就已經完成求值。

```zig
const print = @import("std").debug.print;
const now = @import("std").time.nanoTimestamp;

fn fibonacci(index: u64) u64 {
    if (index < 2) return index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

fn run() void {
    const number = 25;

    // Run-time
    const start1 = now();
    const res1 = fibonacci(number);
    const end1 = now();

    // Compile-time
    const start2 = now();
    const res2 = comptime fibonacci(number);
    const end2 = now();

    print("Run-time:     {d} in {}ns\n", .{ res1, end1 - start1 });
    print("Compile-time: {d} in {}ns\n", .{ res2, end2 - start2 });
    print("\n", .{});
}

pub fn main() void {
    for (1..6) |_| {
        run();
    }
}
```

```bash
Run-time:     75025 in 1003800ns
Compile-time: 75025 in 0ns

Run-time:     75025 in 996000ns
Compile-time: 75025 in 0ns

Run-time:     75025 in 998600ns
Compile-time: 75025 in 0ns

Run-time:     75025 in 1000200ns
Compile-time: 75025 in 0ns

Run-time:     75025 in 1505500ns
Compile-time: 75025 in 0ns
```

# 泛型

泛型的型別也很適合使用 `comptime` 標記，以向編譯期表達此參數是編譯期就可以確定的。

```zig
const print = @import("std").debug.print;

fn add(comptime T: type, a: T, b: T) T {
    return a + b;
}

pub fn main() void {
    const res1 = add(u8, 5, 10);
    const res2 = add(f32, 100, -10);

    print("Result 1: {d}\n", .{res1});
    print("Result 2: {d}\n", .{res2});
}
```

```bash
Result 1: 15
Result 2: 90
```

# 參考

- [Comptime | zig.guide](https://zig.guide/language-basics/comptime)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#comptime)

本文以 Zig `0.13.0` 為主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10351749)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/comptime)
