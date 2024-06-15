---
title: "在 NeoVim 中使用 Flash 取代 Easy Motion 來快速跳轉"
subtitle: ""
# description: ""
tags: ["Vim", "教學"]
series: []
# categories: []
date: 2024-06-15T12:33:00+08:00
header_img: ""
comment: true
toc: true
draft: true # false
---

對於常用 Vim 的人來說，[Easy Motion](https://github.com/easymotion/vim-easymotion) 絕對是一個好用的插件，它可以讓你在使用 Vim 時更快速且方便的將遊標移動到螢幕上任何想要的位置。不過，對於 Easy Motion 不少人也有一些意見，例如太久沒人維護（筆者寫本文當下最後一筆 commit 是 2022 年，且只是修改文件）、實現方式老舊、慢...

爲了有一個更現代、快速的*類-Easy Motion* 體驗，我開始轉而使用 [Flash](https://github.com/folke/flash.nvim)。目前已經用了半年，我認爲 Flash 可以完全取代 Easy Motion，而且可以做得更好。

<!--more-->

# 安裝

Flash 使用 Lua 寫成，需要有 LuaJIT 的環境（例如 Neovim）。

如果你是使用 [Lazy Nvim](https://github.com/folke/lazy.nvim) 的話，可以在 `init.lua` 內加入：

```lua
local plugins = {
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

如果你是用 [AstroNvim](https://github.com/AstroNvim/AstroNvim) 的話，可以在 `plugins` 資料夾下新增 `flash.lua`，並加入內容：

```lua
return {
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
            { "s", mode = { "n", "x", "o" }, function() require("flash").jump() end, desc = "Flash" },
            { "S", mode = { "n", "x", "o" }, function() require("flash").treesitter() end, desc = "Flash Treesitter" },
            { "r", mode = "o", function() require("flash").remote() end, desc = "Remote Flash" },
            { "R", mode = { "o", "x" }, function() require("flash").treesitter_search() end, desc = "Treesitter Search" },
            { "<c-s>", mode = { "c" }, function() require("flash").toggle() end, desc = "Toggle Flash Search" },
        },
    },
}
```

# 操作

我最常使用的操作有 2 種。第一種是 `s`+ 搜尋文字，這個操作就很類似 Easy Motion 的 `<leader><leader>`，不過 Flash `s` 後面的搜尋文字不限數量，如果你要跳轉的目標字串開頭重複性很高的話，你可以打 2~3 個字符來匹配，被匹配的文字會高亮顯示，這時你只要再鍵入各個匹配項後的 label 就可以跳轉，而且 Flash 的跳轉可以跨分隔畫面（可以設定）。

![鍵入 `sun` 以搜尋 `un` 的範例][op-s]

第二個常用的是 `f` 和 `F`。`f` 只會搜尋並配對目前遊標以下的範圍，而 `F` 則只會搜尋以上的範圍。後面一樣鍵入要匹配的字符，成功匹配的文字會高亮，你可以透過重複按 `f` 來移動到下一個匹配項，或使用 `;` 或 `.` 來移動到下/上一個匹配項目。匹配範圍超過螢幕顯示，即會捲動螢幕繼續搜尋。

![鍵入 `fr` 向下搜尋 `r` 的範例][op-f]

# 延伸

Flash 還有其它功能和設定我就不一一細講了。

還有一個 [vim-sneak](https://github.com/justinmk/vim-sneak) 也是可以達成類似 Easy Motion 的操作，不過它好像只能限定向下或上搜尋，沒辦法全螢幕搜尋（Flash 的 `s`），所以我試用一下後就改成用 Flash 了。


附帶一提，如果有人想看我的完整 Neovim 配置，可以參考 [ziteh/vim-config](https://github.com/ziteh/vim-config)，透過 branch 切換。

[op-s]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsmKKhFqR0JYDZRZHeOXDHXqUacfTUG6CfT5tVXN0KRMYn3kKoxQZxwXaSm-dO9FLtdWn7RQCg3f5QzFENFr8tq0mxfBTaNdNpsKB6VlxNGINOOfbv2etEFmF90kg6ykWj5AmXOjQwCKa8Xqw7PueLB6IRgRmIvbG8zhbXbjycrjJnbcD661XnIQGBk0A/s16000/op-s.png
[op-f]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcErCEr_JSKjS5fb0OyXvWj4OvihMl7PGoxKBGKngt74UHe5hyyfJLAbm23sQcXvbqTGjvaqgjSJ8nGuXKljvE8iWJYdFZdDU0PRZYYL0p4poHhcNczkl2PfY5Rr1Uq7KdFrKBoCHMRPoo86olNEmQGtt66xB4LfQM9aVfdTo4HsDu3G-hLqSVW6n1exE/s16000/op-f.png
