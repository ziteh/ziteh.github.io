---
title: "Git 相關"
date: 2025-06-05T11:15:00+08:00
draft: false
---

## SSH

產生 Key

```bash
ssh-keygen -t rsa -b 4096 -C "YOUR@email.com"
```

看 pub key

```bash
cat ~/.ssh/id_rsa.pub
```

複製 pub key 並貼到 Git Server 上

## 建立獨立的分支

建立完全獨立，沒有 Parent 的 branch

```bash
git checkout --orphan newbranch
git rm -rf .    # 砍掉所有檔案重來

...  # 加新檔案

git add .
git commit -m 'create new branch'
```
