---
title: "工具箱之把你的滑鼠丟掉吧——flash.nvim"
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

今天還是 Vim~ 當你的 Vim 越用越熟後，就會開始想要尋求更高效又精準的導航方式。你或許有聽過鼎鼎大名的 [Easy Motion](https://github.com/easymotion/vim-easymotion)，但是現在你有更現代的選擇：[Flash](https://github.com/folke/flash.nvim)。

<!-- more -->

Flash 是一個導航、跳轉插件。可以讓你很輕鬆快速又精準的將遊標移動到任何位置。它的作者和上週介紹的 Lazy.nvim 一樣。

最常用的操作是 `s` + 搜尋文字。而且 Flash 的搜尋文字不限字數，如何搜尋結果太多的話可以繼續打字來更準確的匹配。匹配完後只要再按下畫面上顯示的相對應的 label 字符即可跳轉，而且跳轉行爲可以跨分隔畫面（可設定）。

![鍵入 sun 以搜尋 un](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsmKKhFqR0JYDZRZHeOXDHXqUacfTUG6CfT5tVXN0KRMYn3kKoxQZxwXaSm-dO9FLtdWn7RQCg3f5QzFENFr8tq0mxfBTaNdNpsKB6VlxNGINOOfbv2etEFmF90kg6ykWj5AmXOjQwCKa8Xqw7PueLB6IRgRmIvbG8zhbXbjycrjJnbcD661XnIQGBk0A/s16000/op-s.png)

如果要在 Lazy.nvim 中安裝的話，可以在 `init.lua` 中新增：

```lua
-- init.lua
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

另外如果你不想要它取代原本的 `s` 鍵，可以重新 mapping key，例如將上面的第 14 行改成下面這樣，就可以改用空白鍵觸發。

```lua
{ "<space>", mode = { "n", "x", "o" }, function() require("flash").jump() end, desc = "Flash" },
```

我以前有寫過一篇「[在 NeoVim 中使用 Flash 取代 Easy Motion 來快速跳轉](https://ziteh.github.io/posts/vim-flash/)」，裡面有更詳細的說明。

---

- GitHub：[folke/flash.nvim: Navigate your code with search labels, enhanced character motions and Treesitter integration](https://github.com/folke/flash.nvim)
