---
title: "[Day-30]完賽，再談談 Zig"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-09-22T08:01:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

總算是到最後一天了。在先前的內容中，我們從安裝 Zig 開始，一步步介紹 Zig 的各種基本語法和特性，我也是一邊寫文章、一邊寫程式一同學習 Zig。

Zig 作為一個現代化的語言，提供了諸如基於遍歷對象的 `for` 迴圈、模組化的 `import` 能力，靈活的 `switch` 模式配對，來讓我們可以專注在功能，而不是麻煩的語法。

Zig 作為一個面向低階應用的語言，提供了 `comptime`、`packed`、自訂長度數值型別，讓我們可以更方便地寫出高效率的程式。

Zig 作為 C 的取代者，保留了直接操作記憶體的指標、`asm volatile` 語法以直接嵌入組合語言，已經方便與 C 接合的 ABI 支援。

<!-- more -->

我曾經看到有人這樣形容：
> Rust 可能像是一個更好的 C++，那 Zig 就是一個更好的 C。

而且 Zig 現在也有 [Bun](https://github.com/oven-sh/bun) 這個專案證明它的效能。

雖然現在 Zig 還很年輕，有很多配套功能都還不完善，尤其是最為人詬病的套件管理能力遠遠不如 Rust、JavaScript 和 Python。它現在還僅僅是一個單純的 Package manager，而非完整的 Dependency manager。但是它所展現的魅力已經讓我相當驚豔，也希望它未來可以變得更好。

我個人的話是比較關注 Zig 在嵌入式上的發展，畢竟我現在會想要用 C 寫的也只有韌體了，相信 Zig 的編譯期和低階操作特性會和適合 MCU 專案。有個 [Zig Embedded Group](https://github.com/ZigEmbeddedGroup) 已經處理了一些 MCU 的支援，包含 STM32、RP2040、ESP 等 MCU 的 HAL，還有一些基礎函式庫例如 FAT、UF2、USB。

希望這系列的入門文章可以讓你學到 Zig 的基礎，如果內容有誤的也歡迎指出。謝謝閱讀。

# 參考

- [ziglang/zig: General-purpose programming language and toolchain for maintaining robust, optimal, and reusable software.](https://github.com/ziglang/zig)
- [Welcome | zig.guide](https://zig.guide/)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/)
- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
