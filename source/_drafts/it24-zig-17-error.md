---
title: "Zig：錯誤處理 Error"
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

Zig 使用 `error` 建立錯誤集合型別。

<!-- more -->

Zig 不使用多少現代語言常見的 `try-catch`、`exception` 機制處理錯誤，而是選擇和 Rust 類似的錯誤型別，透過回傳值的方式處理。

# 基本

`error` 看起來和 `enum` 很類似，但它是專門用來處理錯誤的型別。

```zig
const print = @import("std").debug.print;

const MyError = error{
    OutOfRange,
    NotFound,
};

pub fn main() void {
    const err: MyError = MyError.OutOfRange;
    print("{}", .{err});
}
```

```bash
error.OutOfRange
```

# 超集

Zig 會依據名稱爲每個 `error` 的成員建立一個不重複的 ID（預設以 `u16`），這意味著，只要是相同名稱，就算處於不同的 `error` 內，在程式上它們就是同一個。

```zig
const print = @import("std").debug.print;

const AError = error{
    Error1,
    Error2,
};

const BError = error{
    Error1,
};

pub fn main() void {
    const err_a = AError.Error1;
    const err_b = BError.Error1;

    if (err_a == err_b) {
        print("Yes", .{});
    }
}
```

```bash
Yes
```

# 合併

你可以用 `||` 把多個 `error` 合併成一個更大的 `error`。

```zig
const print = @import("std").debug.print;

const AError = error{
    ErrorA1,
    ErrorA2,
};

const BError = error{
    ErrorB1,
    ErrorB2,
};

const CError = AError || BError;

pub fn main() void {
    const err1: CError = CError.ErrorA1;
    const err2: CError = CError.ErrorB2;
    print("{}, {}", .{ err1, err2 });
}
```

```bash
error.ErrorA1, error.ErrorB2
```

# 錯誤聯合型別

由於 Zig 採用類似 Rust 的錯誤處理機制，所以它也有類似 `Result<T, E>` 的用法，即錯誤聯合型別（Error union type），語法爲 `E!V`，其中 `E` 是錯誤型別，而 `V` 是其它型別。

使用 `catch` 在該值爲 `error` 時提供替代數值。

```zig
const print = @import("std").debug.print;

const MyError = error{
    OutOfRange,
    NotFound,
};

pub fn main() void {
    var value: MyError!u8 = 32;
    var unwrap = value catch 0;
    print("Value: {}\n", .{unwrap});

    value = MyError.OutOfRange;
    unwrap = value catch 0;
    print("Value: {}", .{unwrap});
}
```

```bash
Value: 32
Value: 0
```

# 捕獲

在處理錯誤聯合型別的回傳值時，可以利用 Capture 捕獲 `error`。

```zig
const print = @import("std").debug.print;

const MyError = error{
    OutOfRange,
    NotFound,
};

pub fn main() void {
    const value = do_something() catch |err| {
        print("Error: {}\n", .{err});
        return;
    };
    print("Value: {}\n", .{value});
}

fn do_something() MyError!u8 {
    return MyError.OutOfRange;
    // return 1;
}
```

```bash
Error: error.OutOfRange
```

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Errors)
- [Errors | zig.guide](https://zig.guide/language-basics/errors)
