---
title: "Zig：型別（Types）"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-08-29T07:00:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

型別系統是程式語言的一大重點，我認爲它也影響了該語言適用的領域和應用。

<!-- more -->

正如第一篇說述，Zig 是靜態、強型別。這意味著 Zig 在編譯期進行型別檢查（靜態型別），而型別之間不允許隱式轉換（強型別）。靜態強型別的系統雖然讓 Zig 沒辦法像 Python 或 JavaScript 那樣靈活，但是它保證了安全與穩定，讓更多的錯誤在編譯期就可以被發現，這也符合 Zig 的願景。

# 數值

Zig 數值型別和 Rust 很像，它們都使用明確表達長度與有無號的名稱，對於要精確控制變數資源的低階開發者來說，這是很好的設計。

例如：

- `i8` 代表有號、8 bit 長度的整數
- `u8` 代表無號、8 bit 長度的整數
- `i16` 代表有號、16 bit 長度的整數
- `u128` 代表無號、128 bit 長度的整數
- `f32` 代表 32 bit 長度的浮點數
- `f64` 代表 64 bit 長度的浮點數
- `isize` 代表有號、指標長度的整數
- `usize` 代表無號、指標長度的整數

當然型別不只這些，Zig 的有/無號整數型別的長度從 8~128，而浮點數長度從 16~128。對，Zig 有 `f16` 半精度浮點數。其實，Zig 支援**自訂長度**的數值型別，例如 `u3` 代表無號、3 bit 長度的整數。透過自訂長度的型別，你可以更精準控制變數的值。

## 數值表達

表達數值的方式有 2、8、10、16 進制，語法和多數語言相同：

```zig
const dec_int: u8 = 129;
const hex_int: u8 = 0x81;
const oct_int: u8 = 0o201;
const bin_int: u8 = 0b10000001;
```

如果有需要，可以在數字間加上底線 `_` 作爲分隔符，提升可讀性：

```zig
const dec_int: u64 = 1_000_000_000;
const hex_int: u64 = 0xFF12_3456_789A_0001;
const bin_int: u8  = 0b1000_0001;
```

浮點數可以使用科學記號表達：

```zig
const value: f32 = 2.5e6;  // 2500000
```

# 布林

Zig 內建布林型別 `bool`，其值可以是 `true` 或 `false`。要特別注意的是，Zig 不允許隱式轉型，這包含將其它數值評估爲 `bool` 也不被允許。所以在使用 `if` 或 `while` 時，只能明確接受 `bool`，C 的那套「`0` 被評估爲 `false`、其它爲 `true`」在 Zig 不適用。

```zig
// 正確
if (true) {
    std.debug.print("Ok", .{});
}

// 正確
if (1 != 0) {
    std.debug.print("Ok", .{});
}

// 編譯錯誤 error: expected type 'bool', found 'comptime_int'
if (1) {
    std.debug.print("Ok", .{});
}
```

# ABI 兼容型別

Zig 被設計成很容易和 C 一起使用，所以對 ABI (Application binary interface) 的兼容性也很好，因此也直接提供了相關的型別，例如：

- `c_char`：C 的 `char`
- `c_int`：C 的 `int`
- `c_uint`：C 的 `unsigned int`

# 進階型別

Zig 當然也有 `enum`、`struct`、Array 等，接下來會在其它天的內容中介紹。

# 參考

- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Values)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10346758)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24/tree/main/types)
