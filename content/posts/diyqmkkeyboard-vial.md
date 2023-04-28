---
title: "[自製QMK鍵盤-番外] QMK啓用Vial教學"
subtitle: ""
# description: ""
tags:
  - 教學
  - DIY
  - 3C
  - QMK
series: ["自製QMK鍵盤"]
# categories: []
date: 2023-04-28T23:26:49+08:00
header_img: ""
comment: true
toc: true
draft: false
---

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKm5YevuV_KIbJUCILuzB1_1jl_IttPrKgmzhFeJyo61ee6dWGH0-5PJqbqN1pe5Jby-jsUf7dkk-Fko_dKERc72ugLOs-Pmhnful-jaXOzQxAIMZtDjpup8Z_97G2PotA1SOclV0eTKU3Q8dqLjVONAoNF7zHXinC-ZMmUFIW0qMg9uCjOAVxH2ce/s16000/image.png)

[Vial](https://get.vial.today/) 是一個可以讓你隨時修改 QMK 鍵盤的各種設定的軟體，其中就包含可以即時編輯 Keymap（也就是改鍵位）。如果要自製 QMK 鍵盤的話，加入 Vial 絕對會方便很多。

這篇文章會教你如何爲你自己的 QMK 鍵盤啓用 Vial 功能。

> 除了 Vial 外，還有一個類似的功能稱爲 [Via](https://www.caniusevia.com/)，雖然功能相近但用法不同，不要搞混了。

# 建立 vial.json

要啓用 Vial，首先要準備所謂的鍵盤定義檔，這是一個 JSON 檔。

> 此步驟的官方文件爲：[Build support 1 - Create JSON](https://get.vial.today/docs/porting-to-via.html)。

## 鍵盤佈局

到 [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/)（KLE）完成你鍵盤的 Layout。當然，如果你之前使用 KLE 時有儲存 JSON 檔的話，可以把它重新上傳。

接著，你需要在 KLE 中的各個鍵上標註此鍵的鍵矩陣掃描行列。以 `row,column` 的格式將其標記在左上，編號由 0 開始。例如 row1-col0 的鍵要標註爲 `1,0`。

![依照鍵矩陣的物理位置編輯 KLE 的各鍵標記](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmGmK-I0FxhPe0YjU61k0yghJYEcoYZTxGoFfwPn5VaUhtwbhB891raKLTWgmyJLFZLHWjZ4eFOU903iyHjp8vb7rHDa8dbRE9Qsjzrw8TEsx0OYRjuAZLzkDAENqVF5SbYRo0toVkiwtazgkN2YVx99tgj0eT5tg7JRWL1amIVKK3-_A2-DkZ00-B/s16000/c.jpg)

編輯完成後就下載此 KLE 的 JSON 檔。以我的例子，它的內容大概是：
```json
[
  [
    "0,0",
    "0,1",
    "0,2",
    "0,3",
    "0,4",
    "0,5",
    "0,6",
    "0,7",
    "0,8",
    "0,9",
    "0,10",
    "0,11"
  ],
  [
    "1,0",
    "1,1",

    ... ...

    "4,7"
  ]
]
```

## 建立定義檔

使用以下的樣板格式建立一個新的 JSON 檔，命名爲 `vial.json`：
```json
{
    "name": "Calcite52",
    "matrix": {
        "rows": 5,
        "cols": 12
    },
    "layouts": {
        "keymap":
    }
}
```

其中，`keymap` 要填入上一步在 KLE 下載的 JSON 檔內容，包含最外圍的方括號。例如：
```json
{
    "name": "Calcite52",
    "matrix": {
        "rows": 5,
        "cols": 12
    },
    "layouts": {
        "keymap":
            [
              [
                "0,0",
                "0,1",
                "0,2",
                "0,3",
                "0,4",
                "0,5",
                "0,6",
                "0,7",
                "0,8",
                "0,9",
                "0,10",
                "0,11"
              ],
              [
                "1,0",
                "1,1",
          
                ... ...
          
                "4,7"
              ]
            ]
    }
}
```

如果你想看看實例，可以參考我的 [Calcite52](https://github.com/ziteh/vial-qmk/blob/0a033db5d5e62cb101c11700999de2607543693a/keyboards/zite/calcite52/keymaps/vial/vial.json) 及 Vial 官方的[多重佈局範例](https://github.com/vial-kb/vial-qmk/blob/12950db4d8ec1f294b1285e9b554a8fdc0a4bc6d/keyboards/idb/idb_60/keymaps/vial/vial.json)。

## 測試

完成 `vial.json` 定義檔後可以先驗證，因爲 QMK 的編譯器不會對它的錯誤報錯，因此你需要自行確認。

打開 Vial 軟體，於上方工具列 File > Load dummy JSON 並選擇你的 `vial.json`，你應該會看到一個與你在 KLE 上一樣的鍵盤 Layout。

![載入 vial.json](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjW2wdMdBjUa_JKNz1uzibGiYa-7kv3Db6cKCkTBFpvwx_RXpinY5d5NeKVawY4KjODhwqtAwj8rph3IP7kGkz_sVhUDFDoRrh6T7XLGe_o4bkmaNfVasMlnE4flep2FGylDOZMjwt_EhbrxoAkF3Cs3UeGQc6qiMHlyajW7JPyuY9LuKaQ2NiDjr66/s16000/vial.jpg)

# 移植到 Vial

有了 `vial.json` 檔後就可以進行移植。

> 此步驟的官方文件爲：[Build support 2 - Port to Vial](https://get.vial.today/docs/porting-to-vial.html)。

## 下載 Vial QMK

Vial 不使用 [QMK 的 repo](https://github.com/qmk/qmk_firmware)，他們有自己的 [Vial QMK repo](https://github.com/vial-kb/vial-qmk)，請 git clone 此 repo。不要把它 clone 到 `qmk_firmware` 資料夾內，請爲它指定另一個獨立的路徑。

```git
git clone https://github.com/vial-kb/vial-qmk
```

> 如果你不太熟悉 git，或想要 GUI 的話，可以用 [GitHub Desktop](https://desktop.github.com/) 或 [GitKraken](https://www.gitkraken.com/)。


## 準備環境

打開你的 QMK 環境（例如 QMK MSYS），用 `cd` 指令導航到你剛剛下載的 `vial-qmk` 資料夾下，然後 clone git submoduels。

```cmd
~$ cd <PATH>/vial-qmk/
vial-qmk$ make git-submodule
```

![使用 QMK MSYS 準備環境](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggMAGuJtrEFViq0hb2CzDZpsZFm5AR7gLsbVdLy5t2zE9IpwPSoOqCZhzWlcTyKlpGXV3BaJNpg0C0kiHlvttOx--ltQjRqBUgmgji_opAYNTjWvuDLn3VWC4J_o6atZVfEI5bzSSsH3HacUd9mlmTcLwv-oyeuTRWS8XUJ1zVD6SajaxH17YF4rnq/s16000/vial-env.jpg)

完成後可以進行一下簡單的驗證：
```
qmk doctor
```

你可能會看到「The official repository does not seem to be configured as git remote "upstream"」警告訊息，這很正常，因爲這是 Vial QMK，確實不是官方 QMK。

接下來你可以進行一下編譯測試，例如：
```cmd
make vial_example/vial_atmega32u4:default
```

這裡的路徑是 `vial-qmk/keyboards/` 底下的路徑，不用前導斜線 `/`。如果這時有編譯錯誤的話，你可能要先確定你的 QMK 環境及相關工具。

> 使用 Vial 時建議使用 `make` 而非 `qmk compile`，當然你可能要另外安裝 [*make*](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows)。

## 建立 Keymap

要爲 Vial 建立其專屬的 Keymap。

在 `keymaps` 資料夾底下新增一個資料夾 `vial`，複製 `keymaps/default` 資料夾內的所有內容（應該只會有一個 `keymap.c`），貼上到剛剛新增的 `vial` 資料夾底下。 

在 `keymaps/vial` 內新增一個 `rules.mk`，並增加以下內容：
```mk
VIA_ENABLE = yes
VIAL_ENABLE = yes
```

將建立好的定義檔 `vial.json` 也複製到 `keymaps/vial` 資料夾內。

## 生成識別碼

接下來要爲你的鍵盤生成唯一的識別 ID。用 `cd` 指令回到 `vial-qmk` 的根目錄並執行：
```cmd
python3 util/vial_generate_keyboard_uid.py
```

它應該會回傳類似這樣的內容：
```cmd
#define VIAL_KEYBOARD_UID {0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX}
```

在 `keymaps/vial` 內新增一個 `config.h`，並增加以下內容：
```c
/* SPDX-License-Identifier: GPL-2.0-or-later */

#pragma once

#define VIAL_KEYBOARD_UID {0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX}
```

`VIAL_KEYBOARD_UID` 後面的內容要替換成你上面實際執行指令所得到的。

## 設定安全解鎖組合鍵

Vial 必須要你設定一個安全解鎖組合鍵，以避免惡意軟體寫入你的鍵盤中。詳細請參考 [Security](https://get.vial.today/docs/security.html)。

在 `keymaps/vial/config.h` 中的 `VIAL_KEYBOARD_UID` 下方增加：
```c
#define VIAL_UNLOCK_COMBO_ROWS { 0, 3 }
#define VIAL_UNLOCK_COMBO_COLS { 0, 11 }
```

該組合鍵應該至少包含兩個按鍵，通常會用 ESC+Enter 的組合。上面的數字必須改成你按鍵的物理位置（也就是[這裡](/posts/diyqmkkeyboard-vial/#鍵盤佈局)編輯的 row 與 colume）。上面的例子就是指定 row0-col0 與 row3-col11 這兩個鍵。

> 如果你不想要這個功能，可以在 `keymaps/vial/rules.mk` 中增加一行 `VIAL_INSECURE = yes`。但增加這行的鍵盤不會被允許提交並合併進 vial-qmk 的 repo 中。

![設定 row0-col0 與 row3-col11 爲解鎖組合鍵](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiewtmovfv3rZfXMVOrWBdN3027MZVp0Vxfc47FuMFisgZXSweLn6awXprFMQjwAI6aPXnXKmgI4a1IHacKDKiyr1_k4f2qrGfeFCjaBp_vrSD6JXbZQt4OZnMZbiLYwz2g5GxvJf5HqIGDuDcGPdts0teKKFvJ4B6SZEqB3_iUPXWSmSlyXAGyKhlx/s16000/Screenshot%202023-04-28%20at%2022-55-09%20Keyboard%20Layout%20Editor.png)

## 確認檔案

完成上面的步驟後，你的 `keymaps/vial` 資料夾底下應該會有這些檔案：
- `keymap.c`
- `rules.mk`
- `config.h`
- `vial.json`

其中 `config.h` 大概會有以下的內容：
```c
/* SPDX-License-Identifier: GPL-2.0-or-later */

#pragma once

#define VIAL_KEYBOARD_UID {0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX, 0xXX}

#define VIAL_UNLOCK_COMBO_ROWS { 0, 3 }
#define VIAL_UNLOCK_COMBO_COLS { 0, 11 }
```

> 可以參考[官方範例](https://github.com/vial-kb/vial-qmk/blob/8356266e078cefeec7c1e4a8c1d59118ad5a0755/keyboards/vial_example/vial_atmega32u4/keymaps/vial/config.h)

# 編譯

都完成後就可以進行編譯了。

編譯與燒錄的方式基本上和官方 QMK 一樣，只是要記得 Keymap 要選擇 vial。到 `vial-qmk` 根目錄，執行 `make path/keyboard:vial` 指令。例如：
```cmd
make zite/calcite52:vial
```

> 如果你使用 Pro Micro 或 ATmega32U4 的話，有可能會遇到空間不夠的問題，這時你可以參考[此指南](https://get.vial.today/docs/firmware-size.html)降低韌體大小。如果最後無論如何都不夠小的話，可能只能考慮改用其它容量更大的 MCU 了。

完成編譯並燒錄後，就可以鍵鍵盤接上電腦並打開 Vial 軟體了。Vial 可以編輯的各個功能介紹請看 [User manual](https://get.vial.today/manual/)。

# 相關網站

- [Vial](https://get.vial.today/)
- [vial-kb/vial-qmk](https://github.com/vial-kb/vial-qmk) GitHub repo
- [vial 官方範例](https://github.com/vial-kb/vial-qmk/tree/vial/keyboards/vial_example)
- [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/)
- 我的 [Calcite52](https://github.com/ziteh/calcite) 鍵盤
