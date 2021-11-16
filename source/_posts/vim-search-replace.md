title: 在Vim中搜尋並取代文字
author: ZiTe
tags:
  - 教學
  
categories: []
date: 2020-09-05 23:37:00
---
# 前言

在2個月前我開始使用[Visual Studio Code](https://code.visualstudio.com/)並搭配[Vim 插件](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)來進行程式編寫和做Markdown筆記。

在這段時間內我學習了不少Vim的操作方式，而「搜尋-取代」對我來說是一種滿常用的功能，而Vim也可以透過許多不同的方式來達到此功能。

故我將我自己比較會用到的搜尋-取代方式記錄在下。

<!--more-->

# 基本搜尋-取代指令

以下範例皆為將SSS取代成RRR，只是差在作用範圍不同。

* `:%s/SSS/RRR/g`：所有行。
* `:s/SSS/RRR/g`：目前游標所在行。
* `:5,12s/SSS/RRR/g`：從第5行到第12行（包括）。
* `:1,$s/SSS/RRR/g`：從第一行（`1`）到最後一行（`$`）。
* `:.,+2s/SSS/RRR/g`：從目前游標所在行（`.`）到下2行（`+2`）。

參考：[Search and replace | Vim Tips Wiki | Fandom](https://vim.fandom.com/wiki/Search_and_replace)

# 在Visual mode選取範圍並搜尋-取代

先按下<kbd>v</kbd>、<kbd>V</kbd>或<kbd>Ctrl</kbd>+<kbd>v</kbd>進入Visual mode，並選取範圍。

`:'<,'>s/SSS/RRR/g`  
在Visual mode所選的範圍中，將SSS取代成RRR。其中`:'<,'>`只要在Visual mode中按下<kbd>:</kbd>就會自動出現。  

參考：[Search and replace in a visual selection | Vim Tips Wiki | Fandom](https://vim.fandom.com/wiki/Search_and_replace_in_a_visual_selection)

# 使用Visual mode選擇搜尋並取代
1. 按下<kbd>v</kbd>、<kbd>V</kbd>或<kbd>Ctrl</kbd>+<kbd>v</kbd>進入Visual mode，並選取欲搜尋之內容。
2. 按下<kbd>y</kbd>（yank）將選取的內容複製進"暫存器。
3. 使用指令（如`:%s/SSS/RRR/g`）並搭配<kbd>Ctrl</kbd>+<kbd>r</kbd> <kbd>"</kbd>貼上"暫存器的內容。
4. 按下<kbd>Enter</kbd>進行搜尋-取代。

參考：[How to search for selected text in Vim? - Super User](https://superuser.com/questions/41378/how-to-search-for-selected-text-in-vim)

# 使用Visual mode選擇搜尋並用cgn取代

1. 按下<kbd>v</kbd>、<kbd>V</kbd>或<kbd>Ctrl</kbd>+<kbd>v </kbd>進入Visual mode，並選取欲搜尋之內容。
2. 按下<kbd>y</kbd>（yank）將選取的內容複製進"暫存器。
3. 按下<kbd>/</kbd>進入搜尋模式。
4. 按下<kbd>Ctrl</kbd>+<kbd>r</kbd> <kbd>"</kbd>貼上"暫存器的內容。
5. 按下<kbd>Enter</kbd>進行搜尋。
6. 按下<kbd>c</kbd><kbd>g</kbd><kbd>n</kbd>進入Insert mode並取代修改搜尋的結果。
7. 按下<kbd>Esc</kbd>或<kbd>Ctrl</kbd>+<kbd>[</kbd>離開Insert mode。
8. 按下<kbd>n</kbd>到下一個搜尋的結果。
9. 按下<kbd>.</kbd>重複步驟6的修改。
10. 重複步驟8和9來逐一修改。

參考：[使用gn操作增强Vim的搜索 - 晴耕雨讀](http://0x3f.org/post/enhance-search-with-gn-in-vim/)

# 結語

這次我列出了一些我自己常用的搜尋-取代在Vim中的做法，如果有其它方式的話也歡迎留言交流。

# 相關文章與資源

* [Search and replace | Vim Tips Wiki | Fandom](https://vim.fandom.com/wiki/Search_and_replace)
* [Search and replace in a visual selection | Vim Tips Wiki | Fandom](https://vim.fandom.com/wiki/Search_and_replace_in_a_visual_selection)
* [How to search for selected text in Vim? - Super User](https://superuser.com/questions/41378/how-to-search-for-selected-text-in-vim)
* [使用gn操作增强Vim的搜索 - 晴耕雨讀](http://0x3f.org/post/enhance-search-with-gn-in-vim/)