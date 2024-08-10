---
title: "工具箱之 Kanban 專案管理——Planka"
subtitle: "Trello 的開源替代品"
# description: ""
tags: ["分享"]
categories: ["工具箱（鐵人 24）"]
date: 2024-MM-DDTHH:MM:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

![][planka]

[planka]: http

如果你用過類似 Trello 或 GitHub Project 等類似的專案管理服務，且想要一個功能類似的開源（Open source）方案，那 [Planka](https://planka.app/) 應該是不錯的選擇。

<!-- more -->

因爲我自己的 side project 有點多，有事沒事看到什麼新奇的玩意兒就會想要試試看，久了就常常陷入不受控制的狀態，常常忘記某個專案的進度到底到哪？還有什麼沒做？

爲了更好的管理那些專案的進度狀態，我開始使用 Kanban 的方式來管理。一開始我是使用 Trello，但後來我想要一個本機的開源服務，後來就找到了 Planka，它的介面和功能都和 Trello 非常相似。我通常會建立 3 個清單：Todo、Doing、Done（可能還會有個額外的 Note 清單）

安裝使用也很簡單，官方有提供 Docker Compose，你只要設定好網域名、Port和 Admin 就可以在瀏覽器上使用了。

當然，我這次常見鐵人賽也使用它管理文章進度。

---

- 官網：[Home - Planka](https://planka.app/)
- [plankanban/planka: The realtime kanban board for workgroups built with React and Redux.](https://github.com/plankanban/planka)
