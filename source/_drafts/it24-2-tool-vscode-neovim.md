---
title: "工具箱之VS Code皮、Neovim骨——VSCode Neovim"
# subtitle: ""
# description: ""
tags: ["分享","Vim"]
categories: ["工具箱（鐵人 24）"]
date: 2024-MM-DDTHH:MM:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

Neovim 本身其實一個後台程序，它沒有直接的 UI，需要一個「前台」來使用它，例如在 Terminal（bash、PowerShell）中輸入 `nvim`。

而在現在，你可以將 VS Code 和 Neovim 一起使用。

<!-- more -->

以往如果你是在 VS Code 上使用 Vim 的話，你可能會安裝 [Vim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) 套件，但是這個套件是一個 Vim emulator。

而如果你是在 VS Code 上使用 Neovim 的話，可以安裝 [VSCode Neovim](https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim)，這個套件並不是 emulator，而是使用真正的 Neovim，也就是使用 Neovim 後端，將 VS Code 做爲前端顯示，所以功能性會很完整。

有了它，你就可以同時擁有 VS Code 和 Neovim。我平常都是使用這個組合在 coding 或寫 Blog。

---

安裝 [VSCode Neovim - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim)
