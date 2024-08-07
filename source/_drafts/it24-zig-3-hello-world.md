---
title: "執行與測試 Zig"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-08-06T12:00:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

目前我們已經安裝好 Zig 了，總算是可以來實際寫寫 Zig 並試著運行了。

<!-- more -->

# 建立專案

首先建立一個資料夾 `zig-hello`：

```bash
mkdir zig-hello
cd zig-hello
```

初始化 Zig 專案：

```bash
zig init
```

完成後你應該會看到類似這樣的檔案結構：

```text
zig-hello
 ├── src
 │    ├── main.zig
 │    └── root.zig
 ├── build.zig
 └── build.zig.zon
```

生成的專案沒有 `.gitignore`，你可以用這個：

```gitignore
# Source: https://github.com/ziglang/zig/blob/master/.gitignore
# andrewrk

.zig-cache/
zig-cache/
zig-out/
/release/
/debug/
/build/
/build-*/
/docgen_tmp/
```

- `build.zig.zon` 是一個類似 JSON 格式的檔案，它就類似 `package.json`，會包含此專案的名稱、版本、依賴套件等資訊。
- `build.zig` 是類似 Makefile 或 CMakeLists 的檔案，用來配置建構系統如何進行編譯和連結。
- `main.zig` 就是主要執行程式。
- `root.zig` 在這裡是一個範例函式庫。

# 執行

目前的 `main.zig` 應該是這樣的（省略部分註解）：

```zig
const std = @import("std");

pub fn main() !void {
    // Prints to stderr (it's a shortcut based on `std.io.getStdErr()`)
    std.debug.print("All your {s} are belong to us.\n", .{"codebase"});

    const stdout_file = std.io.getStdOut().writer();
    var bw = std.io.bufferedWriter(stdout_file);
    const stdout = bw.writer();
    try stdout.print("Run `zig build test` to run the tests.\n", .{});

    try bw.flush(); // don't forget to flush!
}

test "simple test" {
    var list = std.ArrayList(i32).init(std.testing.allocator);
    defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
    try list.append(42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}
```

建置：

```bash
zig build
```

執行：

```bash
zig build run
```

你應該會看到回應：

```bash
All your codebase are belong to us.
Run `zig build test` to run the tests.
```

# 測試

以 `test "name" {}` 包圍的區塊是測試程式。你可以執行測試：

```bash
zig build test
```

它應該不會有輸出。試著將 17 行的 `defer list.deinit();` 註解掉再執行一次測試，應該會看到類似下面的回應：

```bash
Build Summary: 3/5 steps succeeded; 1 failed; 1/1 tests passed; 1 leaked (disable with --summary none)
test transitive failure
└─ run test 1/1 passed, 1 leaked
error: the following build command failed with exit code 1:
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Hello-World)
- [Hello World | zig.guide](https://zig.guide/getting-started/hello-world)
