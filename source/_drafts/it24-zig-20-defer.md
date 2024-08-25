---
title: "Zig：defer"
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


<!-- more -->


# 參考

- [Allocators | zig.guide](https://zig.guide/standard-library/allocators)
- [Learning Zig - Heap Memory & Allocators](https://www.openmymind.net/learning_zig/heap_memory/)
- [zig/lib/std/heap/general_purpose_allocator.zig at master · ziglang/zig](https://github.com/ziglang/zig/blob/master/lib/std/heap/general_purpose_allocator.zig)
- [Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#toc-Choosing-an-Allocator)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- [我的 Blog](https://ziteh.github.io/categories/Zig-入門指南（鐵人-24）/)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
