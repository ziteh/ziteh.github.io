---
title: "[Day-29]Zig：依賴套件管理"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-21T08:02:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

Zig 使用一個 `build.zig.zon` 來管理專案，其中也包含使用第三方依賴套件，這個有點類似 JavaScript 的 `package.json`。

<!-- more -->

Zig 不像 Rust 有 [crates.io](https://crates.io/) 或 Python 有 [PyPI](https://pypi.org/) 這樣有官方的集中式套件儲存平台，而是直接從各個套件的 GitHub 下載。

# build.zig.zon

使用 `zig init` 建立的預設專案中會有一個 `build.zig.zon` 檔案，用來管理你的專案。

它看起來應該會像這樣（省略註解）。

```zig
.{
    .name = "package_manager",
    .version = "0.0.0",
    .dependencies = .{
    },
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "src",
    },
}
```

`.dependencies` 就是設定套件的地方，它使用這樣的格式來管理套件：

```zig
.dependencies = .{
    .myPackage = .{
        .url = "https://to/package.tar.gz",
        .hash = "HASH",
    },
},
```

# 增加套件

現在 `.dependencies` 的部分是空的。讓我們來新增一個套件，這裡用 [zul](https://github.com/karlseguin/zul) 爲例。這裡有兩種方式。

## 方法1-使用指令增加

使用 `zig fetch --save <URL>` 指令自動新增：

```bash
$ zig fetch --save git+https://github.com/karlseguin/zul
info: resolved to commit 08c989bf6871e87807a4668232913ee245425863
```

## 方法2-手動增加

首先要加入 `.url`，其值爲 `https://github.com/karlseguin/zul/archive/<TAG>.tar.gz`，其中的 `<TAG>` 要改成目標的版本，可以是 branch、tag、commit hash，這裡使用 `master` branch：

```zig
.{
    .name = "package_manager",
    .version = "0.0.0",
    .dependencies = .{
        .zul = .{
            .url = "https://github.com/karlseguin/zul/archive/master.tar.gz",
        },
    },
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "src",
    },
}
```

但現在還缺少 `.hash`，如果套件的作者沒有提供的話，我們可以讓 Zig 幫我們算，現在先執行一次 `zig build`：

```bash
$ zig build
zig-learn-it24\package_manager\build.zig.zon:6:20: error: dependency is missing hash field
            .url = "https://github.com/karlseguin/zul/archive/master.tar.gz",
                   ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
note: expected .hash = "12206f5d1e5bd4793fe952bbae891b7424a19026e0d296a1381074c7d21d5d76c1a1",
```

它會說遺失 `.hash`，並幫我們計算出正確的 hash。讓我們將這行補上：

```zig
.{
    .name = "package_manager",
    .version = "0.0.0",
    .dependencies = .{
        .zul = .{
            .url = "https://github.com/karlseguin/zul/archive/master.tar.gz",
            .hash = "12206f5d1e5bd4793fe952bbae891b7424a19026e0d296a1381074c7d21d5d76c1a1",
        },
    },
    .paths = .{
        "build.zig",
        "build.zig.zon",
        "src",
    },
}
```

# 調整 build.zig

接著要修改 `build.zig`。我們在最後增加一段：

```zig
// build.zig

// Import package
const zul = b.dependency("zul", .{
    .target = target,
    .optimize = optimize,
});
exe.root_module.addImport("zul", zul.module("zul"));
```

這樣你就可以使用 `@import("zul")` 了。

# 使用並建置

寫個簡單的範例：

```zig
const std = @import("std");
const zul = @import("zul");

pub fn main() !void {
    const dt = try zul.DateTime.parse("2028-11-05T23:29:10Z", .rfc3339);
    const unix = dt.unix(.milliseconds);
    std.debug.print("UNIX: {d}\nGMT:  {s}\n", .{ unix, dt });
    std.debug.print("Convert UNIX timestamp to human readable: https://www.unixtimestamp.com", .{});
}
```

```bash
$ zig build run
UNIX: 1857079750000
GMT:  2028-11-05T23:29:10Z
Convert UNIX timestamp to human readable: https://www.unixtimestamp.com
```

# 參考

- [Zig Package Manager - WTF is Zon - Zig NEWS](https://zig.news/edyu/zig-package-manager-wtf-is-zon-558e)
- [karlseguin/zul: zig utility library](https://github.com/karlseguin/zul)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10355399)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/package_manager)
