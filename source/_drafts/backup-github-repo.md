---
title: "完整備份 GitHub 上的所有 repo"
subtitle: "使用 GitHub CLI 和 clone --mirror"
# description: ""
tags: ["教學", "Git", "程式"]
# categories: [""]
date: 2024-06-26 19:17:00
# updated: 2024-MM-DD HH:MM:00
comments: true
toc: true
# RESERVE
---

資料備份在現代是一個非常重要的習慣及任務，**不要讓重要的資料只存在一個地方**是備份的第一步（例如只放在 GitHub 上），本文提供一個方法，來用一個腳本自動完整備份你在 GitHub 上的所有 repo，包含所有的 branch 和 tag。

<!-- more -->

# GitHub CLI

為了要取得我們的所有 repo，需要使用 [GitHub CLI](https://cli.github.com/)。

安裝好後要先登入：

```bash
gh auth login
```

它應該會開始互動式詢問，只要照著它的提示完成登入即可。通常應該會選擇 `GitHub.com` 和 `Login with a web browser`。

完成後，可以使用 `gh auth status` 驗證登入狀態。你應該會得到類似的回應：

```bash
$ gh auth status

github.com
  ✓ Logged in to github.com account ziteh (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_*********************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
```

再來，你可以用 `gh repo list <USERNAME>` 列出所有的 repo，`<USERNAME>` 是目標用戶或組織的 *username*。如果擁有權限的話，Private repo 也會列出。你可以試著列出自己的 repo，看看是否可以看到自己的 Private repo。例如列出 [Vim](https://github.com/vim) 的所有 repo：

```bash
$ gh repo list vim

Showing 8 of 8 repositories in @vim

NAME                         DESCRIPTION                 INFO          UPDATED
vim/vim                      The official Vim reposi...  public        about 1 hour ago
vim/vim-win32-installer      Vim Win32 Installer         public        about 1 day ago
vim/vim-appimage             AppImage for gVim           public        about 1 day ago
vim/website_next_generation  The new website             public        about 1 day ago
vim/colorschemes             colorschemes for Vim        public        about 1 day ago
vim/winget-pkgs              The Microsoft community...  public, fork  about 2 days ago
vim/killersheep              Silly game for Vim 8.2      public        about 8 months ago
vim/vim-history              Very very old history o...  public        about 1 year ago
```

# clone --mirror

`git clone` 大家都很熟，但是加上 `--mirror` 後可能就不是每個人都用過了。使用 `git clone --mirror <REPO_URL>` 會 Clone 該 repo 的所有 git 內部資訊（包含 branch、tag），也就是可以完整地備份 repo，方便進行完整的轉移。只使用一般的 `git clone` 的話，還要再另外 `fetch`/`pull` 其它 branch。

例如：

```bash
git clone --mirror https://github.com/neovim/neovim.git
```

執行完後，應該會建立一個 `neovim.git` 資料夾，內部就是各種 git 資訊。

值得一提的是，`git clone --mirror` 只會建立 git 內部資訊（Bare repo），不會包含工作目錄（即實際的檔案），不過我們可以再次使用一般的 `git clone` 來將工作目錄還原（就類似把它當成在本地的 Remote repo 操作）。例如 `clone` 我們 `clone --mirror` 下來的 `neovim.git` Bare repo 資料夾：

```bash
git clone neovim.git
```

你應該會看到一個新的 `neovim` 資料夾，而且內部完整包含了所有檔案，各個 branch 和 tag 也都在。

可以發現，這個 `neovim.git` 其實就和我們平常用的 GitHub、Remote repo 很類似，不過還是有點差別，有興趣的話可以查查 Git Bare repo[^1]。

[^1]: [Git Bare Repo - HackMD](https://hackmd.io/@hbdoy/BJz0V5tv8)

# Bash 腳本

現在我們可以使用 GitHub CLI 取得所有 repo，也知道 `git clone --mirror` 可以用來完成備份 repo，就可以用個簡單的 Bash 腳本來備份所有 repo[^2]。

[^2]: [git - How to clone all repos at once from GitHub? - Stack Overflow](https://stackoverflow.com/questions/19576742/how-to-clone-all-repos-at-once-from-github)

```bash
#!/bin/bash

# Clone all repos from GitHub, using GitHub CLI
# Usage: $ bash clone_github.sh <USER_NAME> [OPTION]

if [ -z "$1" ]; then
  echo "Usage: $0 <USER_NAME> [OPTION]"
  exit 1
fi

USER_NAME=$1
OPTION=$2

gh repo list "$USER_NAME" --limit 1000 | while read -r repo _; do
  echo "Clone: '$repo'"
  gh repo clone "$repo" "$repo" -- --mirror $OPTION 2>/dev/null
done
```

我們將此腳本命名為 `clone_github.sh`，接著就可以試著執行看看了。例如我要備份 [Neovim](https://github.com/neovim) 底下的所有 repo：

```bash
bash clone_github.sh neovim
```

有了這個腳本，我們就不用每個 repo 都手動 clone 了。當然更進一步的話，可以把它包成 Docker，在 NAS 上定期執行。

# 參考
