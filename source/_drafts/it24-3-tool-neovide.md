---
title: "工具箱之 Rust+Neovim GUI——Neovide"
# subtitle: ""
# description: ""
tags: ["分享","Vim","Rust"]
categories: ["工具箱（鐵人 24）"]
date: 2024-MM-DDTHH:MM:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

![我的 Neovide][neovide]

[neovide]: http

上一篇提過，Neovim 實際上只是一個後台程式，需要搭配前台才可以真正使用它。而除了使用 Terminal 和上一篇提到的 VSCode 外，如果你想要一個獨立、專門的 Neovim GUI，我推薦 [Neovide](https://neovide.dev/)。

<!-- more -->

Neovide 是一個以 Rust 寫的跨平台 Neovim GUI。有時候我想開一個獨立的檔案（例如 JSON、YAML、CSV），又不想開 VScode 的話，就會用 Neovide 來開。使用獨立 Neovim GUI 的一個好處是你的文字樣式可以比較方便單獨設定，不必和 Terminal 綁在一起，而且它也支援其它更豐富的顯示設定和功能。

順便分享一下我使用的 Neovide 設定：

```lua
-- init.lua

if vim.g.neovide then
  vim.g.neovide_scale_factor = 0.8
  vim.g.neovide_hide_mouse_when_typing = true
  vim.g.neovide_remember_window_size = true
  vim.g.neovide_fullscreen = false
  vim.g.neovide_confirm_quit = true

  vim.g.neovide_scroll_animation_length = 0.1
  vim.g.neovide_cursor_animation_length = 0
  vim.g.neovide_cursor_trail_size = 0

  -- IME auto switch
  vim.g.neovide_input_ime = false
  local function set_ime(args)
    if args.event:match("Enter$") then
      vim.g.neovide_input_ime = true
    else
      vim.g.neovide_input_ime = false
    end
  end

  local ime_input = vim.api.nvim_create_augroup("ime_input", { clear = true })

  vim.api.nvim_create_autocmd({ "InsertEnter", "InsertLeave" }, {
    group = ime_input,
    pattern = "*",
    callback = set_ime
  })

  vim.api.nvim_create_autocmd({ "CmdlineEnter", "CmdlineLeave" }, {
    group = ime_input,
    pattern = "[/\\?]",
    callback = set_ime
  })
end
```

---

安裝：[Neovide](https://neovide.dev/)
