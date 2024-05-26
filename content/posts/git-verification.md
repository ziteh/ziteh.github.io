---
title: '簽署 commit 並設定 GitHub GPG Key 以驗證'
subtitle: 'Git commit signature verification & GPG key'
author: ZiTe
tags:
  - 教學
  - 程式
series: []
date: 2024-05-11 15:04:00+08:00
comment: true
toc: true
draft: false
---

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbS1awMSWll3iWn0eyymEKwcIK7OyjTvZ8RNxl3jHDaJHpWmJrwU8G0e1e0xKm-KEVq069BrngyRKphQJDaaDZ_Y7mQG4OQ1tu9BJA1yecJc8nmizcnxVcZvr3Qu1fx-di9L0IgAtWjo9uEZdm7Tyyw3x7zm4UxOgS8U5YkE0MKyyZEFJXaT25YBT6wwY/s16000/5%20-%20ugAQ8rK.png)

在 GitHub 看 commit 記錄時，可能會發現有些 commit 被標記爲已驗證（Verified），代表這個 commit 可以確認是真的由此使用者提交的。因爲 commit 是可以[僞造](https://medium.com/starbugs/how-to-fake-the-author-of-git-commit-f44453b70afc)的，你只要知道某人的 username 和 email 就可以用 `git config --global user.name` 和 `user.email` 設定並假冒 commit 的作者。然而這兩項資訊在現代來說超級公開。

<!--more-->

爲了避免被僞造 commit（雖然我不知道有誰會想來假冒我），你可以設定驗證金鑰和爲 commit 加上簽名，來讓 GitHub 確認那些 commit 確實是你提交的。


> 本文以 Windows 11 爲主。

# 安裝工具

首先要安裝用來產生金鑰對的工具。在 Windows 上最簡單的方式是安裝 [Gpg4win](https://www.gpg4win.org/)，它是 [GnuPG](https://www.gnupg.org/) 的 Windows 官方發行版。安裝過程就不贅述了。

# 產生金鑰

這裡有兩種方式可以產生金鑰，分別是 GUI 圖形化介面和 CLI 命令行，根據自己的喜好擇一即可。

完成此步驟以取得 Key ID 和公鑰（Public Key）。

## GUI 圖形化

安裝好 Gpg4win 後應該會有個軟體 Kleopatra 也被一併安裝，這是一個憑證管理軟體。開啓它並選擇「File > New OpenPGP Key Pair...」（或 Ctrl+N）。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-gleIAljQS2xfDv2YyNYyTl8o5wstoDf_WETUdmyYmikFjwFkPUw7AucRhri9RrQ9CaLz9Y6eZZJwMhiOsW_aU7uVfZsA03uiQa49ut8zhXFMcqYYQ3zPe4R01FhyDMEuq7Dr0azlgYKopZ1k0QnCXauAn8hXMiYlR-NjNvxVzKunfMHHK1P_BiIoP1E/s16000/7%20-%20Hc51k6F.png)

填入你的名字與 Email。如果你想要使用密碼來進一步保護此金鑰的話，可以勾選下面的「Protext the generated key with a passphrase.」，如果有密碼的話，往後每次要爲 commit 簽名時都會要求輸入此密碼。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTO6c_QXTNxojWXVCWmfUdSaGgMId9yOz3l2aRXkx5wfERO0v6RExISnQLhrAITGOc_9lqiwRPRToRfX8mYla8ADcQkiJ_GmTIf1loebndywhwLv9OvZhgaatXuKPpYoege6G7poWH44HSvgjGFheVuG1wnSV2UbaGsSS6Frlk9K75TTvD8cVxR8BQ14Y/w400-h379/4%20-%200xEpVbf.png)

按下「Advanced Settings...」開啓進階設定。

首先是金鑰加密算法，以往比較常見的是使用 RSA 4096 bits，不過這裡有提供 ECDSA/EdDSA 算法，這種算法通常被認爲更加先進，且 GitHub 也支援此算法，所以我就使用 ECDSA/EdDSA ed25519 + ECDH cv25519。

如果想要此金鑰對在一段時間後會過期的話，可以設定「Vaild until」的時間。不需要的話（永久有效）就不要勾選即可。

![Advanced Settings](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB60n9PtXZcpFNTsyDqJBeX9CAaoEX0flMCFsPKvI8jrlzK_hUuvfcUYeluXL678CTdKDpOoPHW2s2NIkKz1ai0koV0DnURZhZ_fjeQoOtn14YIG596vnAxVB-r7oS0pXeTKlqwEYyA33IMzmNRo7AjlmWzRD3TLFRH163OC5RxH2q3fDfARrO2NByukA/w286-h400/1%20-%20WKN7s2s.png)

確認沒問題後按 OK 就會提示成功產生。並且附上一段密碼指紋 Fingerprint。清單上也會多出剛剛產生的證書資訊。

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0OdKPc7MXiJOS5wsfdgNZq6H6pZB8GRWd2qIkeUjqMh3Tpk7l65D2Doks49KzW6Zf-VDYVcLm6P2Gog19uu_BWKeYC5JB016VHr1g8DylrU48akYU_DRSUMVhsDDeQXtawgO86-cVcClbx5XH0D6elhr4WxEgIu85Yi78BzeRwcu5Ie2jXzh3VEjv93Q/s16000/2%20-%20QlGGD4k.png)

再來有 2 個資訊需要被使用。一個是 Key ID，另一個是你的公鑰（Public Key）。

- Key ID 的話就在清單上，例如這裡是 `D54135B170193E40`。
- 公鑰的話要雙擊清單中的證書（金鑰對），在新開始的視窗按下面的「Export」按鈕。會再開啓一個新視窗，顯示的一大串文字就是公鑰。會以 `-----BEGIN PGP PUBLIC KEY BLOCK-----` 開頭， `-----END PGP PUBLIC KEY BLOCK-----` 結尾。你可以直接整段複製。

## CLI 命令行

參考 GitHub 文件：[Generating a new GPG key - GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)

開始 PowerShell。開始互動式嘗試金鑰對：

```bash
gpg --full-generate-key
```

它會依序提示你各個選項，依照你的需求選擇即可。（例如 RSA、4096 或 ECC、Curve 25519）

確認完資訊後，會提示你輸入用於保護此金鑰對的密碼（如果有密碼的話，往後每次要爲 commit 簽名時都會要求輸入此密碼），如果不需要的話留空並確認即可。開始產生金鑰時它會提示你可以動動滑鼠、打打鍵盤之類的來協助亂數生成。過一段時間後就完成了。

接下來要取得 Key ID 及公鑰。

列出金鑰對以查看 Key ID：

```bash
gpg --list-secret-keys --keyid-format=long
```

它可能會回覆類似這樣的訊息：

```bash
[keyboxd]
---------
sec   ed25519/D54135B170193E40 2024-05-11 [SC]
      0F65BDEE517E693D23F4BCF295FF8Q01CDE31413
uid                 [ultimate] your_name <my@email.com>
ssb   cv25519/196D7ACDB8D502QF 2024-05-11 [E]
```

其中 `D54135B170193E40` 就是你要的 Key ID。可以先複製起來，後續的步驟會需要。

再來要輸出公鑰：

```bash
gpg --armor --export D54135B170193E40
```

這裡的 `D54135B170193E40` 記得換成你真正的 Key ID。它會輸出一大段文字，這就是你的公鑰，請整段複製起來。（連同開頭和結尾的 `-----BEGIN PGP PUBLIC KEY BLOCK-----`、`-----END PGP PUBLIC KEY BLOCK-----`）

# GitHub 設定 GPG Key

開啓 GitHub 設定頁面的 [SSH and GPG keys](https://github.com/settings/keys) 頁。按下「New GPG key」按鈕以新增金鑰。

取個名字並填入 Title 欄位，並在下方的 Key 文字框中完整貼上剛剛產生的整段公鑰。

按下「Add GPG Key」即可。

![新增 GPG Key 示意](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgINvNdBT_g9tqH0bDIaQbQdt0glR2bPIwroIHWnrfQnhM0Whrou2NcCY3nZ0RkXp2NJ1tGA8A__SVg7y4SvzAB80O36VPmcp-IDN1VDnL8qJS-mNbXHp790mGFVJQphZMVN4_GrzDbuUIW2NrFxn9_MKpggIRghD1Lemslh19cK9RyOZsSeqLunAojw4I/s16000/8%20-%204ystOtj.png)

> 注意，如果你把某個 GPG Key 刪除的話，原先使用這個金鑰對簽名的 commit 就會失去驗證變成 Unverified（因爲 GitHub 失去了這個公鑰當然無法驗證）。
>
> 你可以開一個測試用的 repo，先送幾個有簽名且可被認證的 commit，接著刪除 GitHub 上對應的 GPG Key，這些 commit 會從 Verified 變成 Unverified。如果再把對應的 GPG Key 加回去的話，又會變回到 Verified。

# Git 設定

接下來要設定讓 Git 使用該金鑰對爲 commit 簽名。

> 以下範例的設定皆使用全局 `--global`，你可以視需求調整。

## GPG 路徑

首先要知道你的 GPG 程式路徑。可以開啓 PowerShell 查詢：

```ps
where.exe gpg
```

通常會是 `C:\Program Files (x86)\GnuPG\bin\gpg.exe`。

爲 Git 設定 GPG 程式路徑：

```bash
git config --global gpg.program "<GPG_PATH>"
```

請將 `<GPG_PATH>` 替換成你在上一步得到的實際路徑。例如：

```bash
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

## 設定 Key ID

設定 Git 要用來簽名的 Key ID：

```bash
git config --global user.signingkey "<KEY_ID>"
```

這裡的 `<KEY_ID>` 請替換成你實際的 Key ID（例如本文的 `D54135B170193E40`）。

## 簽署所有 commit

設定讓 Git 爲所有 commit 簽署：

```bash
git config --global commit.gpgsign true
```

或是如果你不想要每個 commit 都簽名的話，可以只在要簽名的 commit 時加上 `-S` 選項。([git commit](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt--Sltkeyidgt))

## 確認設定

確認是否設定成功：

```bash
git config --global gpg.program
git config --global user.signingkey
git config --global commit.gpgsign
```

# 完成

如果沒問題的話，現在你就可以嘗試 commit 並 push 到 GitHub 上看看了。

![認證的 commit](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMwrB0a-HhD1i-cbCTegVrpUdi5hgn2AYgAWBmLrAUhg5lrbBUgTdJqX7h_w4p5yayTlxjsm_jR6WIn3ng-1pHQEEvpnG9IxtgZVzdURNFfIPHKlJNFd9Ev8alu0jb0ZjCIhgi9V1K9hBcAAQPMl0IIi3rEKjN8zoUP93i1ga1Tz_8DlM5T78V_tgH_0s/w400-h292/6%20-%20MsSco5U.png)

> 上圖的 Key ID 和文中的不同是因爲文中的是範例用的，不是我真正的金鑰對。

# 參考資料

- [Use GPG Signing Keys with Git (and GitHub) on Windows 10 | by Ryan Miller | Medium](https://medium.com/@ryanmillerc/use-gpg-signing-keys-with-git-on-windows-10-github-4acbced49f68)
- [Setting Up GPG on Windows (The Easy Way) | Tower Blog](https://www.git-tower.com/blog/setting-up-gpg-windows/)
- [Generating a new GPG key - GitHub Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
- [用 Git 這麼久了，你知道 commit 是可以偽造的嗎.](https://medium.com/starbugs/how-to-fake-the-author-of-git-commit-f44453b70afc)

撰寫本文時的版本資訊：

- git: `2.42.0`
- Gpg4win: `4.3.1`
- Kleopatra: `3.2.2.231170`
- GPG: `2.4.5`
- Libgcrypt: `1.10.3`
