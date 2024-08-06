---
title: "工具箱之無情的打字機器——Vim/Neovim"
# subtitle: ""
# description: ""
tags: ["分享"]
categories: ["鐵人 24 工具箱"]
date: 2024-MM-DDTHH:MM:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

這是我第二次參加鐵人賽，也是開始工作後第一次參加，而且這次還打算雙開（因爲這次選的兩個主題的內容都沒辦法寫很深）。我這次除了「Software Development」的「Zig 入門：現代低階語言」外，還參加了這個「佛心分享-我的私藏工具箱」。

這個主題應該就是分享一些自己常用的工具，所以我會整理 30 個我平常會使用的軟體，而且全部都是開源的，它們涵蓋的範圍很廣也會雜，但都是我喜歡用的工具。

<!-- more -->

不過每篇文我只會**非常概略**的介紹一下各個工具的基本功能，如何想知道更細節的用法的話，我會在文章下提供相關連結。

# Vim / Neovim

作爲第一篇，我就來分享我每天都在用的軟體、軟體人就算沒用過也聽過的文字編輯器 —— [Vim](https://vimdoc.sourceforge.net/) / [Neovim](https://neovim.io/)。

大家對 Vim 的印象可能是學習難度很高、進得去出不來。我大概從大三開始使用 Vim，到目前也用了 4 年，我現在已經不能沒有 Vim 了。

我可以舉個有點誇張但實際發生的例子：有一次不知道爲什麼，我的 VS code 的 Vim 掛了，所以我只能使用一般的操作方式。當時我在寫 C 並且想要「刪除一行程式」，我非常驚訝的發現，在沒有 Vim 的情況下，「刪除一行程式」居然要「將滑鼠遊標移動到行首、按下左鍵、拖著滑鼠移動到行末、再按下 Backspace 鍵」，我呆住了，我不停的在思考是否有更簡單快速的方式，但是顯然我想不到。

我第一次意識到，沒有 Vim 的話，連刪除一行程式都變得如此複雜。相較之下，如果有 Vim 的話，只要按 2 下 `d` 就可以了。

## Neovim

剛剛都是在說 Vim，那... Neovim 又是啥？Neovim 算是 Vim 的一個分支（Fork），號稱現代化的 Vim。當時其發起者 [Thiago Arruda](https://github.com/tarruda) 不滿意當時的 Vim 過於老舊、功能缺乏、難以維護，但是又不 merge 許多補丁，所以[他進行了 Fork](https://groups.google.com/g/vim_dev/c/65jjGqS1_VQ)，也就是後來的 Neovim。

這應該也是終身仁慈獨裁者（BDFL）因爲不夠「仁慈」，導致開源專案分歧而被 Fork 後，由新的人領導新專案的例子。

不過在 Neovim 逐漸熱門後，Vim 也開始積極改善並增加功能。據說在 Vim 的原作者 [Bram Moolenaar](https://github.com/brammool) 於 2023 年 8 月辭世前不久，都還在處理 Vim。半年後 Vim 發佈 [`9.1`](https://www.vim.org/vim-9.1-released.php) 版，特別紀念這位偉大的工程師。

而我目前真正使用的是 Neovim。當然，它們的操作方式及邏輯是一樣的。

從我開始接觸程式後，覺得軟體技術中有 2 個工具對我來說投資報酬率超高，第一個是 git，第二個是 vim。如果你想要一個流暢且快速、人鍵一體的編程體驗，我非常推薦你來嘗試用用看 Vim，給它一、兩週的時間，把你的滑鼠拿走。

# 連結

- [welcome home : vim online](https://www.vim.org/)
- [Home - Neovim](https://neovim.io/)
- [【Vim 編輯器 入門指南 (上)】用思維的速度寫程式](https://ithelp.ithome.com.tw/articles/10255325)
