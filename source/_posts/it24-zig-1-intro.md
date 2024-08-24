---
title: "Zig：延續了 C 使用者最喜歡的低級操作，再加上 Rust 的現代特性"
subtitle: "Zig 程式語言簡介"
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-08-24T08:29:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

![][zig-logo]

[zig-logo]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDIzO_N019K6RXkxJu-iDAbbcTfYkK6Qho6bId246ayGFMVPNPmDLMHC5tZAQ9ntsjFMAMPK7G4877j0tTm4bOXNi-0rnCSP0swQ9xbLnyq5f4KY5NDe-YThChesfkjJ2JYvy8zMWuA9VeBANgtIrbwR13Mr9-atZotQghIxhso6gQFXpSYShuPlV8AJA/s16000/zig-logo.png

[Zig](https://ziglang.org/) 是一個通用功能程式語言及工具鏈（Toolchain），主打**強健**、**最佳化**和**重複利用**。

> Zig is a general-purpose programming language and toolchain for maintaining **robust**, **optimal** and **reusable** software.

<!-- more -->

Zig 是一個靜態強型別的程序式編程（Procedural programming）語言。於 2016 首次提出、2024 年 6 月發佈目前最新的 `0.13.0` 版本。它甚至還沒進入 Major 版號，作爲程式語言來說很年輕。

作爲一個現代化的語言，擁有許多令人喜歡的現代語法，包含型別後置、自動型別推論、遍歷對象的 for-loop、模組化。其中不少設計與 Rust 相當相似，但同時，它又擁有 C 語言的指標操作、程序式編程。

對我來說，它滿足了我想要編寫低階操作的程式，但又可以使用現代化語法的需求。而且它很強調編譯期功能，可以降低運行期的負擔。相當符合我對於「現代化 C」的想象。

> 可能有人會好奇，C 這麼舊的語言，不是 OOP 也不是 FP，還有人在用嗎？
>
> 實際上在嵌入式/韌體領域，C 還是有很大的份量。我們要使用的可能是僅有 4KB 的 RAM 和 16 KB 的 ROM，加上頻率 48 MHz 的核心，但是又期望它在 ms 單位作出回應。而且嵌入式系統常常存在於攸關安全的機器中，例如電力電網設備、交通工具甚至醫療儀器。
>
> 而且就算不說嵌入式，Python 的官方實作：[CPython](https://github.com/python/cpython) 也是 C 寫的。所以雖然 C 確實老舊，但現在還是很多人使用。

![這是我看完 Zig 後的第一個想法][you-low]

[you-low]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg60A47naXk_Vkl1KGIUZ0cv4qSUBZHngA2t2l1eFGZzVllKrOei0dzy33ocT7goVEuHy0ATFKgj-g2TnIYFr0tVMzqqoSeMuYVSKFOeXyZWZ0fi5eOMIIbbBXR81-bTUZYODdKk7SSr-vAIHKSNdqzaof22pYk4oJgTsVojQxdjRe5SLZ9bxuUJvY4gw0/s16000/you-low.png

使用 Zig 的專案中比較有名的應該是 [Bun](https://bun.sh/)，這是一個強調速度的 JavaScript 運行環境（runtime），號稱擁有比 Node 和 Deno 更好的處理量和效能。

還有一個特別的是，在 [StackOverflow 2023 Developer Survey](https://survey.stackoverflow.co/2023/) 的統計中，Zig 是「[Top paying technologies](https://survey.stackoverflow.co/2023/#section-top-paying-technologies-top-paying-technologies)」和「[Salary and experience by language](https://survey.stackoverflow.co/2023/#section-salary-salary-and-experience-by-language)」兩項統計的**榜首**。這也是我特別注意到 Zig 的起因。

> - Zig is the highest-paid language to know this year (a new addition).
> - Zig developers are paid the most per years of experience compared to other languages (11 years average) with the same or more experience.

![StackOverflow 2023 Survey - Top paying technologies][zig-top-paying]

![StackOverflow 2023 Survey - Salary and experience by language][zig-salary-and-exp]

[zig-top-paying]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEglM8dw4QJvFR-QTimBFyj4CuHgFbcPxcN4Vt-E3uvSFcYdT2JjydTQ-jPZxo8OQYuLLjmF_nkaHG9nRNAVzdoIpauXnMs_uiCaLYD9EuddV18HnNwAkhfQ4jgb7uXGKBBuaKVXhuZHqgd_m7P5OmQxbWC4EMi7acZRsSvmhQDaw8Yc24C3wM7Bjc11rJM/s16000/zig-top-paying.png
[zig-salary-and-exp]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjeFEfTfIvjq3Gz3yeqKVN1coC30NS7vTEtnxWD2Oh2UdOrVtVMJPMd13s9uw4r9GzSacYpZKi1Yac7eBwJcsLL6eHdm7MVICf83D99eaDJEn9WigQoKYWvqbJHJYaJE0zKVeWtsMDOmTeQOn_KHOGS-bGUvE8GjmPHHmGhe8VUPzLaK2k_w_tpnLVnO28/s16000/zig-salary-and-exp.png

這次是我第二次參加 iThome 鐵人賽（第一次是 2022 年），也是我開始工作後第一次參加。總之，我想利用這 30 天，**非常概略**地介紹 Zig 這門語言，特別會以 C 或 Rust 的使用者來看待和比較它，所以需要對 C 有基本的瞭解再看本系列會比較適合，希望熟悉低階操作的你也會喜歡上 Zig。但是由於我接觸 Zig 的資歷也還非常淺，所以沒辦法分享中高階的內容，如果內容有誤，也請指正。謝謝。

本系列將會以目前 Zig 的最新版本 `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽]()
- [我的 Blog](https://ziteh.github.io/categories/Zig-入門指南（鐵人-24）/)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
