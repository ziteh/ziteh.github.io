---
title: "工具箱之管理你的Neovim插件——Lazy.nvim"
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

![Lazy.nvim][lazy-nvim]

[lazy-nvim]: http

隨著你越來越熟悉 Neovim，你的插件也越來越多，現在你需要一個簡單方便的套件管理工具，[Lazy.nvim](https://lazy.folke.io/) 是一個好選擇。

<!-- more -->

Neovim 的套件管理工具有很多種，其中我爲 Lazy.nvim 應該是最簡單好上手的，也足夠現代。你可以透過它很輕鬆地管理你的各個插件。

而配置它僅需要一個 `init.lua` 檔案即可。你只需要把它放在 `C:\Users\<USER>\AppData\Local\nvim\` (Windows) 或 `~/.config/nvim/` (Linux) 下，打開你的 Neovim，就會看到它開始處理了。

分享一下[我的 Lazy.nvim](https://github.com/ziteh/vim-config/tree/lazy-nvim) `init.lua`：

```lua
----- Lazy.nvim -----
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system(
    {
      "git",
      "clone",
      "--filter=blob:none",
      "https://github.com/folke/lazy.nvim.git",
      "--branch=stable",       -- latest stable release
      lazypath
    }
  )
end
vim.opt.rtp:prepend(lazypath)

local plugins = {
  {   -- Main theme
    "navarasu/onedark.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      require("onedark").setup({ style = "warm" })
      vim.cmd.colorscheme "onedark"
    end,
  },
  { "AlexvZyl/nordic.nvim" },
  { "EdenEast/nightfox.nvim" },   -- nordfox
  { "sheerun/vim-polyglot" },     -- Syntax
  {
    "nvim-lualine/lualine.nvim",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
      require("lualine").setup({
        options = {
          theme = "auto",
          component_separators = "|",
          section_separators = { left = "", right = "" },
          globalstatus = false,
        },
        sections = {
          lualine_a = { "branch" },
          lualine_b = { "filename" },
          lualine_c = { "diff", "diagnostics" },
          lualine_x = { "mode" },
          lualine_y = { "encoding", "filetype" },
          lualine_z = { "location", "progress" },
        },
      })
    end,
  },
  {
    "folke/flash.nvim",
    event = "VeryLazy",
    ---@type Flash.Config
    opts = {
      labels = "asdfghjklqwertyuiopzxcvbnm",
      label = { uppercase = false, },
      search = { multi_window = true, },
    },
    -- stylua: ignore
    keys = {
      { "s",     mode = { "n", "x", "o" }, function() require("flash").jump() end,              desc = "Flash" },
      { "S",     mode = { "n", "x", "o" }, function() require("flash").treesitter() end,        desc = "Flash Treesitter" },
      { "r",     mode = "o",               function() require("flash").remote() end,            desc = "Remote Flash" },
      { "R",     mode = { "o", "x" },      function() require("flash").treesitter_search() end, desc = "Treesitter Search" },
      { "<c-s>", mode = { "c" },           function() require("flash").toggle() end,            desc = "Toggle Flash Search" },
    },
  },
}

require("lazy").setup(plugins)
```

另外要注意一下，Lazy.nvim 和 [LazyVim](http://www.lazyvim.org/) 是不一樣的，後者是使用前者的 Neovim 配置，它可以讓你把 Neovim 從單純的文字編輯器變成完整功能的 IDE。

---

- 網站：[🚀 Getting Started | lazy.nvim](https://lazy.folke.io/)
- GitHub：[folke/lazy.nvim: 💤 A modern plugin manager for Neovim](https://github.com/folke/lazy.nvim)
