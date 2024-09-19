---
title: "[Day-28]Zig：建置 build.zig"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-20T07:01:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

Zig 使用一個 `build.zig` 來配置建置，有點類似 Makefile。

<!-- more -->

# build.zig

使用 `zig init` 建立的預設專案中會有一個 `build.zig` 檔案，Zig 會使用這個檔案來建置你的程式。

它看起來應該會像這樣（省略部分註解）。

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const lib = b.addStaticLibrary(.{
        .name = "project",
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(lib);

    const exe = b.addExecutable(.{
        .name = "project",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);

    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const lib_unit_tests = b.addTest(.{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const exe_unit_tests = b.addTest(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
    test_step.dependOn(&run_exe_unit_tests.step);
}
```

## 分段解析

首先是建置目標（Target）和最佳化（Optimize）設定。使用 `standardTargetOptions()` 和 `standardOptimizeOption()` 會將目標設定爲本機原生（Native）及 debug Optimize。

```zig
const target = b.standardTargetOptions(.{});
const optimize = b.standardOptimizeOption(.{});
```

再來是設定函式庫。在此專案目錄下有個 `root.zig`，在這裡將其使用 `addStaticLibrary()` 連結爲靜態函式庫。使用 `installArtifact()` 將此函式庫增加到 install step。

```zig
const lib = b.addStaticLibrary(.{
    .name = "project",
    .root_source_file = b.path("src/root.zig"),
    .target = target,
    .optimize = optimize,
});

b.installArtifact(lib);
```

可執行原始檔 `main.zig` 也是，使用 `addExecutable()` 和 `installArtifact()` 將其加入到 install step 中。

```zig
const exe = b.addExecutable(.{
    .name = "project",
    .root_source_file = b.path("src/main.zig"),
    .target = target,
    .optimize = optimize,
});

b.installArtifact(exe);
```

這裡使用 `addRunArtifact()` 來增加一個 Artifact `run_cmd`。使用 `dependOn(b.getInstallStep())` 將其設定依賴於 install step。使用 `addArgs()` 加入其它引數。使用 `step("run", "Run the app")` 新增一個名爲 `run` 的 step，`Run the app` 是說明文字，再將其用 `run_step.dependOn(&run_cmd.step)` 和 `run_cmd` 連結起來。這樣最後我們就會有個 `run` 的 step 可以使用。

```zig
const run_cmd = b.addRunArtifact(exe);

run_cmd.step.dependOn(b.getInstallStep());

if (b.args) |args| {
    run_cmd.addArgs(args);
}

const run_step = b.step("run", "Run the app");
run_step.dependOn(&run_cmd.step);
```

這裡在建立另一個名爲 `test` 的 step 來執行測試。步驟和上面的 `run` 一樣。

```zig
const lib_unit_tests = b.addTest(.{
    .root_source_file = b.path("src/root.zig"),
    .target = target,
    .optimize = optimize,
});

const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

const exe_unit_tests = b.addTest(.{
    .root_source_file = b.path("src/main.zig"),
    .target = target,
    .optimize = optimize,
});

const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);

const test_step = b.step("test", "Run unit tests");
test_step.dependOn(&run_lib_unit_tests.step);
test_step.dependOn(&run_exe_unit_tests.step);
```

# 執行

使用 `--help` 會有類似這樣的回應：

```bash
$ zig build --help
Usage: path\to\zig.exe build [steps] [options]

Steps:
  install (default) Copy build artifacts to prefix path
  uninstall         Remove build artifacts from prefix path
  run               Run the app
  test              Run unit tests

...
```

可以看到上面新增的 `run` 和 `test` step。

建置：

```bash
zig build
```

建置完成後，應該會產生 `zig-out` 資料夾，其中的 `bin` 有一個執行檔 `project.exe`。可以執行它：

```bash
$ ./zig-out/bin/project.exe
All your codebase are belong to us.
Run `zig build test` to run the tests.
```

或使用 `run` step 執行：

```bash
$ zig build run
All your codebase are belong to us.
Run `zig build test` to run the tests.
```

# 參考

- [Zig Build | zig.guide](https://zig.guide/build-system/zig-build/)
- [Zig Build System ⚡ Zig Programming Language](https://ziglang.org/learn/build-system/)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10354747)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/build_project)
