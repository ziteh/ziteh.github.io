---
title: "Zig：分配器（Allocator）"
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

Allocator 是 Zig 標準庫提供的功能，用來分配記憶體，尤其是涉及動態分配的情況。

<!-- more -->

# Page

最基本的是 Page Allocator，使用 `std.heap.page_allocator` 取得 Allocator，再使用 `.alloc(T, L)` 分配記憶體空間，其中 `T` 是型別，`L` 是長度。記得要使用 `defer` 和 `.free()` 來處理資源的釋放。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    const allocator = std.heap.page_allocator;

    const mem = try allocator.alloc(u8, 128);
    defer allocator.free(mem);

    print("Length: {}\n", .{mem.len});
    print("Type: {}\n", .{@TypeOf(mem)});

    mem[0] = 100;
    mem[127] = 200;
    print("{}, {}", .{ mem[0], mem[127] });
}
```

```bash
Length: 128
Type: []u8
100, 200
```

# Fixed

如果你需要從 stack（或 static）分配記憶體，而不想從 heap，可以使用 `FixedBufferAllocator`。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var stack: [128]u8 = undefined;
    var fba = std.heap.FixedBufferAllocator.init(&stack);
    const allocator = fba.allocator();

    const mem = try allocator.alloc(u8, 64); // Note the size
    defer allocator.free(mem);

    print("Length: {}\n", .{mem.len});
    print("Type: {}\n", .{@TypeOf(mem)});

    mem[0] = 100;
    mem[63] = 200;
    print("{}, {}", .{ mem[0], mem[63] });
}
```

```bash
Length: 64
Type: []u8
100, 200
```

# General Purpose

`GeneralPurposeAllocator` 是一個通用分配器，它是一個注重記憶體安全的分配器，會防止雙重釋放（double free）、釋放後使用（use after free），還會偵測記憶體泄漏（leak）。透過配置可以達成線程安全或關閉檢查。當一個區塊的記憶體不再使用時，會自動歸還。

大部分的情況下它應該都能勝任。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const mem = try allocator.alloc(u8, 128);
    defer allocator.free(mem);

    print("Length: {}\n", .{mem.len});
    print("Type: {}\n", .{@TypeOf(mem)});

    mem[0] = 100;
    mem[127] = 200;
    print("{}, {}", .{ mem[0], mem[127] });
}
```

```bash
Length: 128
Type: []u8
100, 200
```

# Arena

`ArenaAllocator` 接受一個子分配器，讓你可以多次分配，但僅釋放一次。

```zig
const std = @import("std");
const print = std.debug.print;

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit(); // Only free once
    const allocator = arena.allocator();

    // Allocate many times
    const mem1 = try allocator.alloc(u8, 64);
    const mem2 = try allocator.alloc(f32, 128);
    const mem3 = try allocator.alloc(i2, 100);

    print("Length: {}, {}, {}\n", .{ mem1.len, mem2.len, mem3.len });
    print("Type: {}, {}, {}\n", .{ @TypeOf(mem1), @TypeOf(mem2), @TypeOf(mem3) });
}
```

```bash
Length: 64, 128, 100
Type: []u8, []f32, []i2
```

# 參考

- [Allocators | zig.guide](https://zig.guide/standard-library/allocators)
- [Learning Zig - Heap Memory & Allocators](https://www.openmymind.net/learning_zig/heap_memory/)
- [zig/lib/std/heap/general_purpose_allocator.zig at master · ziglang/zig](https://github.com/ziglang/zig/blob/master/lib/std/heap/general_purpose_allocator.zig)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#toc-Choosing-an-Allocator)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/categories/Zig-入門指南（鐵人-24）/)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
