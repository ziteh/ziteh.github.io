---
title: "[Day-2]安裝 Zig"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-08-25T09:18:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

這篇來介紹一下如何在電腦上安裝 Zig 及相關工具，讓你可以執行 Zig。

> 注意，因爲 Zig 還很年輕，也還沒進入 Major 版號，各個版本之間的差異可能很大，本系列會以目前最新的 `0.13.0` 爲主，因此安裝時要注意版本。

<!-- more -->

Zig 可以在其官網的 [Download](https://ziglang.org/download/) 直接下載，也可以透過各種[套件管理器](https://github.com/ziglang/zig/wiki/Install-Zig-from-a-Package-Manager)下載。以 Windows 來說的話，可以用 winget、Chocolatey 和 scoop 安裝。我個人使用 [Chocolatey](https://community.chocolatey.org/packages/zig) 安裝。

1. 安裝 Chocolatey（以 Admin 執行 PowerShell）

   ```ps
   Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   ```

2. 安裝 Zig（指定爲 `0.13.0` 版）

   ```ps
   choco install zig --version 0.13.0 -y
   ```

3. 可以注意一下安裝完後會提示安裝路徑。如果有需要的話，可以將此路徑加到 PATH 環境變數中。正常情況下，它應該會被安裝在類似 `C:\ProgramData\chocolatey\lib\zig\tools\zig-windows-x86_64-0.13.0` 這樣的路徑下。
4. 接著你可以確認是否可以執行 Zig：

   ```ps
   zig version
   ```

5. 如果你使用 VS code 的話，可以安裝 Zig 的語言支援套件：[Zig Language](https://marketplace.visualstudio.com/items?itemName=ziglang.vscode-zig)

這樣就完成了！

# 參考

- [Download ⚡ Zig Programming Language](https://ziglang.org/download/)
- [Install Zig from a Package Manager · ziglang/zig Wiki](https://github.com/ziglang/zig/wiki/Install-Zig-from-a-Package-Manager)
- [Installation | zig.guide](https://zig.guide/getting-started/installation)

本文以 Zig `0.13.0` 爲主。並同時發佈在：

- [2024 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20151756/ironman/7460)
- 範例程式 [GitHub repo](https://github.com/ziteh/zig-learn-it24)
