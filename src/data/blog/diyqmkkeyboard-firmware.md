---
title: '[自製QMK鍵盤-3] 產生並編輯QMK韌體教學'
subtitle: '2025 QMK 韌體編輯教學'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK
categories: ["自製QMK鍵盤"]
date: 2025-01-05 14:20:00+08:00
comments: true
toc: true
draft: false
---

在[上一篇文章](/posts/diyqmkkeyboard-kle/)中已經完成鍵盤的 Layout，這篇文章將會接續[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)的第 3 步——生成並編輯 QMK 韌體。

<!--more-->

> 本篇是以發文當時最新的 [`0.27.5`](https://github.com/qmk/qmk_firmware/releases/tag/0.27.5) 版本的 QMK 作為示範。
>
> 如果你想要切換 QMK 版本的話，可以使用下面的方法（需要先安裝好 QMK MSYS 環境與 Git）。
>
> 1. 打開 QMK MSYS
> 2. 移到 QMK 工作目錄： `qmk cd`
> 3. 更新 Repo： `git fetch --all --tags --prune`
> 4. 切換指定版本： `git checkout tags/<VERSION>`，其中 `<VERSION>` 替換成目標版本。例如 `git checkout tags/0.27.5`
> 5. 可以忽略提示「detached HEAD」狀態。
> 6. 確認：`git status`。可能會看到類似 `HEAD detached at 0.27.5` 的回應，就代表目前已經切換到 `0.27.5` 版了。

## 準備環境

首先要[準備 QMK 環境](https://docs.qmk.fm/#/newbs_getting_started?id=set-up-your-environment)，現在這一步已經相當簡單。請執行以下步驟：

1. 下載並執行 [QMK MSYS](https://msys.qmk.fm/) 工具。
2. 在 QMK MSYS 中輸入並執行指令 `qmk setup` 指令。
3. 過程中它可能會請你確認一些問題，基本上只要回答 `y` 即 yes 就好。首次設定會有一步是 Clone repo，這個步驟是把整個 QMK 的檔案從 GitHub 上下載下來，所以會需要一段時間。

完成後會有一行 `QMK is ready to go`。往上滾動一些會看到一行 `Repo version: x.y.z`，`x.y.z` 代表目前的 QMK 版本。

準備好環境後，可以先編譯其它鍵盤作為測試。在 QMK MSYS 中執行：

```bash
qmk compile -kb clueboard/66/rev3 -km default
```

若環境沒問題的話，稍微等待後你應該會看到一排 `[OK]`，及類似這樣的結尾：

```bash
Linking: .build/clueboard_66_rev3_default.elf                          [OK]
Creating load file for flashing: .build/clueboard_66_rev3_default.hex  [OK]
Copying clueboard_66_rev3_default.hex to qmk_firmware folder           [OK]
Checking file size of clueboard_66_rev3_default.hex                    [OK]
 * The firmware size is fine - 26356/28672 (2316 bytes free)
```

QMK 的檔案預設會在：`C:/Users/<USERNAME>/qmk_firmware`。上面這個訊息中的 `.build/clueboard_66_rev3_default.hex` 代表的就是 `C:/Users/<USERNAME>/qmk_firmware/.build/clueboard_66_rev3_default.hex`。

環境建立好後就可以編輯一些設定了。[如何選擇微控制器 MCU](/posts/diyqmkkeyboard-mcu-sel/) 一文中已經說明了如何挑選適合的 MCU，這時你應該已經決定好要用什麼 MCU 來製作了。

如果你對嵌入式不是很熟悉的話，我只推薦 RP2040 和 ATmega32U4（Pro Micro），而 RP2040 是我目前認為製作 QMK 鍵盤的**首選**，因為它價格便宜、性能很好、功能完善、空間充足、購買方便、使用者也多。如果沒有特殊原因的話建議使用 RP2040。以下將分別介紹 RP2040 和 Pro Micro 的步驟。

## RP2040

### 創建新鍵盤

在 QMK MSYS 中執行：

```bash
qmk new-keyboard
```

這時你可能會看到這樣的回應：

```bash
Generating a new QMK keyboard directory

Name Your Keyboard Project
For more infomation, see:
https://docs.qmk.fm/#/hardware_keyboard_guidelines?id=naming-your-keyboardproject

Keyboard Name?
```

這時請輸入你想要的鍵盤名稱後按 Enter，例如我使用「0_my_kb_rp2040」做示範。命名規則請參考 [Naming Your Keyboard/Project](https://docs.qmk.fm/hardware_keyboard_guidelines#naming-your-keyboard-project)。名稱以「0」開頭單純是因為名稱排序下比較好找資料夾。

再來它回問你 Username 及 Real Name，這部分就打你自己想要的名稱即可（之後也還可以改），例如我兩者都打「ziteh」。

```bash
Attribution
Used for maintainer, copyright, etc

Your GitHub Username?  [ziteh]

More Attribution
Used for maintainer, copyright, etc

Your Real Name?  [ziteh]
```

![▲ 使用指令建立新鍵盤](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/b5aa9bec.webp)

接著會問你基礎佈局，你可以選一個和你預計要做的鍵盤較為類似的佈局，這樣後續要改的東西就會比較少。例如常見的 60% 鍵盤為「11. 65_ansi」，那就輸入其編號「11」後按 Enter。我這裡就選擇「none of the above」表示不使用現成的特定 Layout。

> 實際編號可能會因為版本而不同，請以選項名稱和你看到的為主。

然後會問你是否使用現成的開發板「Using a Development Board?」，對於 RP2040 即使你確實是使用現成的開發板，我也建議在這裡回答「n」以使用基於 MCU 的設定，這樣如果未來你的鍵盤想要變更不同的 RP2040 開發板也不會需要修改 GPIO，靈活度會比較高。

最後會問你所使用的 MCU（Microcontroller），這裡就選擇「RP2040」。

![▲ 選擇基底佈局與微控制器示意。這裡是舊版的圖，編號請以實際為主](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/2f34c4d4.webp)

完成後會顯示類似這樣的訊息：

```bash
Created a new keyboard called 0_my_kb_rp2040.
Build Command: qmk compile -kb 0_my_kb_rp2040 -km default.
Project Location: C:/Users/<USERNAME>/qmk_firmware/keyboards/0_my_kb_rp2040.
Now update the config files to match the hardware!
```

這樣我們的新鍵盤就在 QMK 的目錄底下建立完成了。接下來要打開我們剛剛建立的鍵盤檔案，為細部功能做調整。

使用文字編輯器（例如我使用 [VS Code](https://code.visualstudio.com/)）打開剛剛建立的新鍵盤的資料夾。QMK 預設的路徑是在 `C:\Users\<USERNAME>\qmk_firmware\`，而我們剛剛建立的鍵盤在其中的 `keyboards\0_my_kb_rp2040\`。

這時你應該會看到 `0_my_kb_rp2040` 下有這些檔案：

- `keymaps\`
  - `default\`
    - `keymap.c`
- `keyboard.json`
- `readme.md`

### 修改 `keyboard.json`

這是最主要的設定檔（也就是舊版的 `info.json`），大部分的設定都在這裡調整。有關它的詳細說明請參考 [info.json Format](https://docs.qmk.fm/#/reference_info_json) 及 [Data Driven Configuration](https://docs.qmk.fm/#/data_driven_config)。以下各個項目無需按照順序，請以名稱為主，但是在編輯時要注意 [JSON 禁止尾逗號](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Trailing_commas#json_%E4%B8%AD%E7%9A%84%E5%B0%BE%E5%90%8E%E9%80%97%E5%8F%B7)。

> [舊版 QMK](/posts/diyqmkkeyboard-firmware-0-18/) 在 `rules.mk` 和 `config.h` 中的設定現在多數都移到 `keyboard.json` 中了。

#### 鍵盤資訊

- `keyboard_name`：鍵盤名稱。這裡目前是剛剛輸入的 `0_my_kb_rp2040`。這個無強硬格式規範。
- `manufacturer`：製造商，通常可以打你的名字。
- `maintainer`：維護者，通常可以打你的名字。
- `url`：可以填該鍵盤的相關說明網址。可以留空。

#### MCU 與 Bootloader

MCU 與 Bootloader 的設定是要互相配合的，要依照你使用的 MCU 來選擇正確的 Bootloader。

首先看到 `processor` 的部分，這裡要選擇使用的 MCU。由於我們剛剛選擇的是 RP2040，所以這裡目前是 `RP2040` 沒錯，如果你使用的是別的 MCU 就請修改。QMK 支援的 MCU 可以參考 [Compatible Microcontrollers](https://docs.qmk.fm/#/compatible_microcontrollers)。

再來是 `bootloader` 的部分，由於我們是 RP2040，所以這裡要是 `rp2040`。如果你使用的是不同的 MCU，那 bootloader 也要改。這裡有個簡單的對照表：

| 微控制器/開發板 | Bootloader     |
| :-------------: | :------------- |
|    Pro Micro    | `caterina`     |
|     RP2040      | `rp2040`       |
|     Teensy      | `halfkay`      |
|    Atmel DFU    | `atmel-dfu`    |
|    LUFA DFU     | `lufa-dfu`     |
|     QMK DFU     | `qmk-dfu`      |
|   ATmega328P    | `usbasploader` |

QMK 支援的微控制器和 Bootloader 很多，如果是上面沒有寫到的話，請自行參考 QMK 文件。更詳細的說明可以看 [Flashing Instructions and Bootloader Information](https://docs.qmk.fm/#/flashing?id=flashing-instructions-and-bootloader-information) 。

#### 功能

`features` 中可以設定要啓用的功能，像是 `nkro` 是 N 鍵防衝突（USB N-Key Rollover），`mousekey` 是滑鼠按鍵支援。更詳細的設定請參考 [Config Options](https://docs.qmk.fm/#/config_options?id=configuring-qmk)。

```json
"features": {
    "bootmagic": true,
    "command": false,
    "console": false,
    "extrakey": true,
    "mousekey": true,
    "nkro": true
},
```

#### USB

`usb` 底下會設定一些 USB 相關的資料。有 `vid`、`pid` 及 `device_version` 這三個，分別代表 Vendor ID、Product ID 和 Device version，`vid`，`pid` 為十六進制數值。可以保持不變，也可以改成自己喜歡的。官方文件請參考 [USB](https://docs.qmk.fm/#/reference_info_json?id=usb)。

> USB VID 與 PID 是 USB 設備的識別號，正常來說是要向 USB 協會申請/購買，但是我們只是要自己做鍵盤的話通常都自行設定就好。要注意的是，如果一臺電腦同時接了多個相同 VID 和 PID 的裝置，那這些裝置可能無法運作。

例如：

```json
"usb": {
    "vid": "0xC1ED",
    "pid": "0x23B0",
    "device_version": "1.0.0"
}
```

#### 佈局 Layouts

一把鍵盤可以設定多個佈局（Layout），但這裡我們就僅簡單示範單一佈局。官方文件請參考 [Layout Format](https://docs.qmk.fm/#/reference_info_json?id=layout-format)。

`LAYOUT` 就是我們目前的佈局名稱，內部的 `layout` 就是要設定每一個按鍵的位置，包含了物理上的實際位置和在鍵矩陣中的行列位置。

看其中兩個鍵：

```json
{"matrix": [0, 0], "x": 0, "y": 0},
{"matrix": [0, 1], "x": 1, "y": 0},
```

`matrix` 是設定該鍵在「鍵掃描矩陣」中的行列位置，格式為 `[row, col]`。`x` 和 `y` 是設定該鍵的「物理」位置，也就是它的鍵軸/鍵帽實際擺在哪裡。另外還有 `w` 與 `h` 可以設定鍵帽的寬度和高度，`label` 可以設定名稱。

`layout` 的內容可以透過一些工具來幫忙，就不用完全自己手打。打開 [Convert KLE raw to QMK info.json](https://qmk.fm/converter/) 頁面，並將[上一篇文章](/posts/diyqmkkeyboard-kle/#輸出) 最後的 Raw data 複製並貼到裡面就可以轉換。

例如我貼上：

```json
["Num Lock","/","*","-"],
["7\nHome","8\n↑","9\nPgUp",{h:2},"+"],
["4\n←","5","6\n→"],
["1\nEnd","2\n↓","3\nPgDn",{h:2},"Enter"],
[{w:2},"0\nIns",".\nDel"]
```

轉換後會得到：

```json
{
  "keyboard_name": "",
  "url": "",
  "maintainer": "qmk",
  "layouts": {
    "LAYOUT": {
      "layout": [
        {"label":"Num Lock", "x":0, "y":0},
        {"label":"/", "x":1, "y":0},
        {"label":"*", "x":2, "y":0},
        {"label":"-", "x":3, "y":0},
        {"label":"7", "x":0, "y":1},
        {"label":"8", "x":1, "y":1},
        {"label":"9", "x":2, "y":1},
        {"label":"+", "x":3, "y":1, "h":2},
        {"label":"4", "x":0, "y":2},
        {"label":"5", "x":1, "y":2},
        {"label":"6", "x":2, "y":2},
        {"label":"1", "x":0, "y":3},
        {"label":"2", "x":1, "y":3},
        {"label":"3", "x":2, "y":3},
        {"label":"Enter", "x":3, "y":3, "h":2},
        {"label":"0", "x":0, "y":4, "w":2},
        {"label":".", "x":2, "y":4}
      ]
    }
  }
}
```

可以發現轉換出來的 `layout` 就是我們要的格式，將它複製到我們的 `keyboard.json` 中（注意階層要看準，括號有多有少都會出錯。我通常會直接複製並取代方括號 `[]` 的內容）。

但是它還是缺少了 `matrix` 的資料，這部分我們要自己手動打。`matrix` 的部分我還沒找到比較好的方式可以自動產生，所以目前就只能自己手打，稍微有點麻煩。

如果你不太知道 `matrix` 的座標要怎麼打的話，可以使用 [Keyboard Firmware Builder](https://kbfirmware.com/)，將 [上一篇文章](/posts/diyqmkkeyboard-kle/#輸出) 最後的 Raw data 複製並貼到裡面。

![▲ 在 Keyboard Firmware Builder 貼上 KLE 的 Raw data](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/adea4962.webp)

在標籤頁「Wiring」裡，你看到的是鍵盤的鍵矩陣接線圖。它會自動幫你生成一個可行的接線方式，如果你不喜歡的話也可以手動修改。

![▲ 接線頁面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/e35af54c.webp)

![▲ 接線圖和 Matrix 的對應關係](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/e0bf62be.webp)

它提供的接線圖就很清楚地表達了每個鍵的鍵矩陣位置，請以此為依據來編輯每個鍵的 `matrix` 內容。

修改完成後：

```json
"layouts": {
  "LAYOUT": {
    "layout": [
        {"label": "NumLock", "matrix": [0, 0], "x": 0, "y": 0},
        {"label": "/",       "matrix": [0, 1], "x": 1, "y": 0},
        {"label": "*",       "matrix": [0, 2], "x": 2, "y": 0},
        {"label": "-",       "matrix": [0, 3], "x": 3, "y": 0},

        {"label": "7",       "matrix": [1, 0], "x": 0, "y": 1},
        {"label": "8",       "matrix": [1, 1], "x": 1, "y": 1},
        {"label": "9",       "matrix": [1, 2], "x": 2, "y": 1},

        {"label": "4",       "matrix": [2, 0], "x": 0, "y": 2},
        {"label": "5",       "matrix": [2, 1], "x": 1, "y": 2},
        {"label": "6",       "matrix": [2, 2], "x": 2, "y": 2},
        {"label": "+",       "matrix": [2, 3], "x": 3, "y": 1, "h": 2},

        {"label": "1",       "matrix": [3, 0], "x": 0, "y": 3},
        {"label": "2",       "matrix": [3, 1], "x": 1, "y": 3},
        {"label": "3",       "matrix": [3, 2], "x": 2, "y": 3},

        {"label": "0",       "matrix": [4, 1], "x": 0, "y": 4, "w": 2},
        {"label": ".",       "matrix": [4, 2], "x": 2, "y": 4},
        {"label": "Enter",   "matrix": [4, 3], "x": 3, "y": 3, "h": 2}
    ]
  }
}
```

這一步可能比較複雜，要多看幾次比對。

> 注意這裡 `matrix` 設定的鍵矩陣行列大小要和下面的 `matrix_pins` 中的 `cols` 與 `rows` 數量是一致的。

#### 鍵矩陣

一般來說，鍵盤的按鍵數都大於微控制器的 GPIO 接腳數，所以會使用鍵盤矩陣掃描（Keyboard Matrix Scanning）技術。如果不是很懂鍵盤矩陣掃描的話，最好先找一些資料瞭解一下，這裡就不贅述。

- `diode_direction` 表示鍵矩陣硬體的二極體方向，一般都是使用 `COL2ROW`。
- `matrix_pins` 設定鍵矩陣的各個腳位。這邊同時決定了鍵矩陣的大小和實際的腳位為何。

由於我們是使用 RP2040，雖然有很多不同的 RP2040 開發板，但它的原始腳位名稱都是 `GPxx`。這時只要選擇你需要的 GPIO 腳即可。

例如如果你用的是 KB2040，那就是看下圖中**黃色的名稱**，其中 `GPIO2` 代表 `GP2`、`GPIO10` 代表 `GP10`。

![▲ KB2040 腳位對應圖(取自Adafruit)](https://cdn-learn.adafruit.com/assets/assets/000/106/984/original/adafruit_products_Adafruit_KB2040_Pinout.png?1638564074)

又或者你用的是 RP2040-Zero，那就是看下圖的**綠色的名稱**。

![▲ RP2040-Zero 腳位對應圖(取自WaveShare)](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/f5a6b21e.webp)

例如我可以這樣設定：

```json
"diode_direction": "COL2ROW",
"matrix_pins": {
  "cols": ["GP2", "GP3", "GP4", "GP5"],
  "rows": ["GP29", "GP28", "GP27", "GP26", "GP22"]
},
```

如果你沒有使用微控制器的經驗，或是不知道要選哪個腳位才行，只要你的鍵盤沒有要加什麼特別的功能（如螢幕、搖桿、可條亮度的 LED 或分離式鍵盤）的話，基本上使用任何腳位都可以。如果你的鍵盤有這些需要特殊硬體功能（UART、SPI、I²C、PWM）的話，記得保留，不要被矩陣掃描佔用了。

這部分的官方文件請參考 [Matrix Pins](https://docs.qmk.fm/reference_info_json#matrix)。

#### 修改完成

完成的完整 `keyboard.json` 大概長這樣：

```json
{
  "$schema": "https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/data/schemas/keyboard.jsonschema",
  "keyboard_name": "0_my_kb_rp2040",
  "manufacturer": "ziteh",
  "maintainer": "ziteh",
  "url": "",
  "processor": "RP2040",
  "bootloader": "rp2040",
  "diode_direction": "COL2ROW",
  "features": {
    "bootmagic": true,
    "command": false,
    "console": false,
    "extrakey": true,
    "mousekey": true,
    "nkro": true
  },
  "usb": {
    "device_version": "1.0.0",
    "pid": "0x0000",
    "vid": "0xFEED"
  },
  "matrix_pins": {
    "cols": ["GP2", "GP3", "GP4", "GP5"],
    "rows": ["GP29", "GP28", "GP27", "GP26", "GP22"]
  },
  "layouts": {
    "LAYOUT": {
      "layout": [
        { "label": "NumLock", "matrix": [0, 0], "x": 0, "y": 0 },
        { "label": "/",       "matrix": [0, 1], "x": 1, "y": 0 },
        { "label": "*",       "matrix": [0, 2], "x": 2, "y": 0 },
        { "label": "-",       "matrix": [0, 3], "x": 3, "y": 0 },

        { "label": "7",       "matrix": [1, 0], "x": 0, "y": 1 },
        { "label": "8",       "matrix": [1, 1], "x": 1, "y": 1 },
        { "label": "9",       "matrix": [1, 2], "x": 2, "y": 1 },

        { "label": "4",       "matrix": [2, 0], "x": 0, "y": 2 },
        { "label": "5",       "matrix": [2, 1], "x": 1, "y": 2 },
        { "label": "6",       "matrix": [2, 2], "x": 2, "y": 2 },
        { "label": "+",       "matrix": [2, 3], "x": 3, "y": 1, "h": 2 },

        { "label": "1",       "matrix": [3, 0], "x": 0, "y": 3 },
        { "label": "2",       "matrix": [3, 1], "x": 1, "y": 3 },
        { "label": "3",       "matrix": [3, 2], "x": 2, "y": 3 },

        { "label": "0",       "matrix": [4, 1], "x": 0, "y": 4, "w": 2 },
        { "label": ".",       "matrix": [4, 2], "x": 2, "y": 4 },
        { "label": "Enter",   "matrix": [4, 3], "x": 3, "y": 3, "h": 2 }
      ]
    }
  }
}
```

你會注意到我這裡多了一行 `$schema`，這個是用來設定這個 JSON 的欄位格式。如果你是使用 VS Code 的話還會有自動補全和提示的功能。假如你怕自己編輯 JSON 檔案的格式或拼字有錯，可以多加這行，讓文字編輯器幫你做檢查，不然不加也可以，不會影響 QMK 的功能。

### 修改 `keymap.c`

`keymaps` 資料夾內可以放多種不同的鍵映射（Keymap），但是至少有有一個名為 `default` 的預設 Keymap。現在已經自動產生這個預設 keymap 了。打開 `keymaps\default\keymap.c` 。

這裡要修改的是 `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {}` 的內容，也就是 Keymap。Keymap 的結構與行列數量必須要與剛剛在 `keyboard.json` 中設定的 `layout` 中的 `matrix` 對應。

這裡要手動修改的話也是有一點麻煩，所以一樣推薦使用 [Keyboard Firmware Builder](https://kbfirmware.com/)，將 [上一篇文章](/posts/diyqmkkeyboard-kle/#輸出) 最後的 Raw data 複製並貼到裡面。到最後一個標籤頁「Compile」按下「Download .zip」按鈕來儲存它產生的 QMK 韌體原始檔（舊版）。

![▲ 「Compile」標籤頁](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/0ff41c43.webp)

將下載的 `.zip` 檔解壓縮，打開其中的 `qmk_firmware\keyboards\kb\keymaps\default\keymap.c`。你會看到和我們所需要的 `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {}` 的內容，可以把複製到我們的鍵盤的 `keymap.c` 中。

不過它的每一個層的名稱是 `KEYMAP()`，而我們剛剛產生的名稱是 `LAYOUT`，所以這邊也要一同改成 `LAYOUT()`。

`LAYOUT()` 中的這些就代表了鍵盤各個鍵位的按鍵功能。像是 `KC_P7` 代表了 <kbd>Numpad7</kbd>（數字鍵盤的 7），而詳細的按鍵名稱請參考 QMK 的說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。

你所需要做的就是把該按鍵的代號（如 `KC_P7`）放在對的位置就好了，之後你按下這個位置的按鍵就會是輸出這個鍵值。QMK 鍵盤支援多層 Keymap 設定，而每一塊 `[n] = LAYOUT()` 代表的是一層，最上面的是第 0 層，往下是第 1、2...n 層。

修改完的 `keymap.c` 大概長這樣：

```c
#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
// clang-format off
    [0] = LAYOUT(
      KC_NUM,  KC_PSLS, KC_PAST, KC_PMNS,
      KC_P7,   KC_P8,   KC_P9,
      KC_P4,   KC_P5,   KC_P6,   KC_PPLS,
      KC_P1,   KC_P2,   KC_P3,
               KC_P0,   MO(1),   KC_PENT
    ),

    [1] = LAYOUT(
      _______, _______, _______, _______,
      KC_HOME, KC_UP,   KC_PGUP,
      KC_LEFT, _______, KC_RGHT, _______,
      KC_END,  KC_DOWN, KC_PGDN,
               KC_INS,  _______, KC_DEL
    )};
// clang-format on
```

有些人可能會喜歡加上一些圖案：

```c
[0] = LAYOUT(
// ┌────────┬─────────┬──────────┬─────────┐
     KC_NUM,  KC_PSLS,  KC_PAST,   KC_PMNS,
// ├────────┼─────────┼──────────┼─────────┤
     KC_P7,   KC_P8,    KC_P9,
// ├────────┼─────────┼──────────┤         │
     KC_P4,   KC_P5,    KC_P6,     KC_PPLS,
// ├────────┼─────────┼──────────┼─────────┤
     KC_P1,   KC_P2,    KC_P3,
// ├────────┴─────────┼──────────┤         │
          KC_P0,        MO(1),     KC_PENT
// └──────────────────┴──────────┴─────────┘
),
```

> `clang-format off` 與 `clang-format on` 是讓 VS Code 的 Clang-format 格式化工具不用美化該區域的內容，和功能無關可以不加。
>
> 如果你稍微懂一點 C 語言的話，`LAYOUT()` 就是是 `#define` 巨集 Macro。

### 修改 `config.h`

原始建立的檔案中沒有這個檔案，我們自行新增即可，放在和 `keyboard.json` 同一個層級。

我們要在 `config.h` 中加入一行 `#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET` 來啓用 [Double-tap Reset](https://docs.qmk.fm/#/platformdev_rp2040?id=double-tap)，未來燒錄要進入 Bootloader 模式只要雙擊 Reset 就好會比較方便。

```c
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET
```

## Pro Micro (ATmega32U4)

### 創建新鍵盤

在 QMK MSYS 中執行：

```bash
qmk new-keyboard
```

這時你可能會看到這樣的回應：

```bash
Generating a new QMK keyboard directory

Name Your Keyboard Project
For more infomation, see:
https://docs.qmk.fm/#/hardware_keyboard_guidelines?id=naming-your-keyboardproject

Keyboard Name?
```

這時請輸入你想要的鍵盤名稱後按 Enter，例如我使用「0_my_kb_promicro」做示範。命名規則請參考 [Naming Your Keyboard/Project](https://docs.qmk.fm/hardware_keyboard_guidelines#naming-your-keyboard-project)。名稱以「0」開頭單純是因為名稱排序下比較好找資料夾。

再來它回問你 Username 及 Real Name，這部分就打你自己想要的名稱即可（之後也還可以改），例如我兩者都打「ziteh」。

```bash
Attribution
Used for maintainer, copyright, etc

Your GitHub Username?  [ziteh]

More Attribution
Used for maintainer, copyright, etc

Your Real Name?  [ziteh]
```

![▲ 使用指令建立新鍵盤](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/b5aa9bec.webp)

接著會問你基礎佈局，你可以選一個和你預計要做的鍵盤較為類似的佈局，這樣後續要改的東西就會比較少。例如常見的 60% 鍵盤為「11. 65_ansi」，那就輸入其編號「11」後按 Enter。我這裡就選擇「none of the above」表示不使用現成的特定 Layout。

> 實際編號可能會因為版本而不同，請以選項名稱和你看到的為主。

然後會問你是否使用現成的開發板「Using a Development Board?」，這裡回答「y」，然後它會再問你用的是什麼開發板，回答「promicro」。

![▲ 選擇基底佈局與微控制器示意。這裡是舊版的圖，編號請以實際為主](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/2f34c4d4.webp)

完成後會顯示類似這樣的訊息：

```bash
Created a new keyboard called 0_my_kb_promicro.
Build Command: qmk compile -kb 0_my_kb_promicro -km default.
Project Location: C:/Users/<USERNAME>/qmk_firmware/keyboards/0_my_kb_promicro.
Now update the config files to match the hardware!
```

這樣我們的新鍵盤就在 QMK 的目錄底下建立完成了。接下來要打開我們剛剛建立的鍵盤檔案，為細部功能做調整。

使用文字編輯器（例如我使用 [VS Code](https://code.visualstudio.com/)）打開剛剛建立的新鍵盤的資料夾。QMK 預設的路徑是在 `C:\Users\<USERNAME>\qmk_firmware\`，而我們剛剛建立的鍵盤在其中的 `keyboards\0_my_kb_promicro\`。

這時你會看到 `0_my_kb_promicro` 下有這些檔案：

- `keymaps\`
  - `default\`
    - `keymap.c`
- `keyboard.json`
- `readme.md`

### 修改 `keyboard.json`

這是最主要的設定檔（也就是舊版的 `info.json`），大部分的設定都在這裡調整。有關它的詳細說明請參考 [info.json Format](https://docs.qmk.fm/#/reference_info_json) 及 [Data Driven Configuration](https://docs.qmk.fm/#/data_driven_config)。以下各個項目無需按照順序，請以名稱為主，但是在編輯時要注意 [JSON 禁止尾逗號](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Trailing_commas#json_%E4%B8%AD%E7%9A%84%E5%B0%BE%E5%90%8E%E9%80%97%E5%8F%B7)。

> [舊版 QMK](/posts/diyqmkkeyboard-firmware-0-18/) 在 `rules.mk` 和 `config.h` 中的設定現在多數都移到 `keyboard.json` 中了。

#### 鍵盤資訊

- `keyboard_name`：鍵盤名稱。這裡目前是剛剛輸入的 `0_my_kb_promicro`。這個無強硬格式規範。
- `manufacturer`：製造商，通常可以打你的名字。
- `maintainer`：維護者，通常可以打你的名字。
- `url`：可以填該鍵盤的相關說明網址。可以留空。

#### 開發板

MCU 與 Bootloader 的設定是要互相配合的，要依照你使用的 MCU 來選擇正確的 Bootloader。但是由於我們已經選擇使用開發板 `"development_board": "promicro"` 所以應該不會有什麼問題，也不用設定 `processor` 和 `bootloader`。

> 特別說明一下，Pro Micro 的 MCU 是 ATmega32U4，而它的 Bootloader *基本上*是 `caterina`。很久以前我在學習 QMK 時因為 Bootloader 選錯所以一直失敗，如果你在使用 Pro Micro 遇到了一些問題的話，可能可以試試明確指定 `"bootloader": "caterina"`。

這裡簡單的整理了一些 MCU 和 Bootloader 的對應表作為參考。

| 微控制器/開發板 | Bootloader     |
| :-------------: | :------------- |
|    Pro Micro    | `caterina`     |
|     RP2040      | `rp2040`       |
|     Teensy      | `halfkay`      |
|    Atmel DFU    | `atmel-dfu`    |
|    LUFA DFU     | `lufa-dfu`     |
|     QMK DFU     | `qmk-dfu`      |
|   ATmega328P    | `usbasploader` |

QMK 支援的微控制器和 Bootloader 很多，如果是上面沒有寫到的話，請自行參考 QMK 文件。更詳細的說明可以看 [Flashing Instructions and Bootloader Information](https://docs.qmk.fm/#/flashing?id=flashing-instructions-and-bootloader-information) 。

#### 功能

`features` 中可以設定要啓用的功能，像是 `nkro` 是 N 鍵防衝突（USB N-Key Rollover），`mousekey` 是滑鼠按鍵支援。更詳細的設定請參考 [Config Options](https://docs.qmk.fm/#/config_options?id=configuring-qmk)。

```json
"features": {
    "bootmagic": true,
    "command": false,
    "console": false,
    "extrakey": true,
    "mousekey": true,
    "nkro": true
},
```

#### USB

`usb` 底下會設定一些 USB 相關的資料。有 `vid`、`pid` 及 `device_version` 這三個，分別代表 Vendor ID、Product ID 和 Device version，`vid`，`pid` 為十六進制數值。可以保持不變，也可以改成自己喜歡的。官方文件請參考 [USB](https://docs.qmk.fm/#/reference_info_json?id=usb)。

> USB VID 與 PID 是 USB 設備的識別號，正常來說是要向 USB 協會申請/購買，但是我們只是要自己做鍵盤的話通常都自行設定就好。要注意的是，如果一臺電腦同時接了多個相同 VID 和 PID 的裝置，那這些裝置可能無法運作。

例如可以使用（`vid`，`pid` 為十六進制數值）：

```json
"usb": {
    "vid": "0xC1ED",
    "pid": "0x23B0",
    "device_version": "1.0.0"
}
```

#### 佈局 layouts

一把鍵盤可以設定多個佈局（Layout），但這裡我們就僅簡單示範單一佈局。官方文件請參考 [Layout Format](https://docs.qmk.fm/#/reference_info_json?id=layout-format)。

`LAYOUT` 就是我們目前的佈局名稱，內部的 `layout` 就是要設定每一個按鍵的位置，包含了物理上的實際位置和在鍵矩陣中的行列位置。

看其中兩個鍵：

```json
{"matrix": [0, 0], "x": 0, "y": 0},
{"matrix": [0, 1], "x": 1, "y": 0},
```

`matrix` 是設定該鍵在「鍵掃描矩陣」中的行列位置，格式為 `[row, col]`。`x` 和 `y` 是設定該鍵的「物理」位置，也就是它的鍵軸/鍵帽實際擺在哪裡。另外還有 `w` 與 `h` 可以設定鍵帽的寬度和高度，`label` 可以設定名稱。

`layout` 的內容可以透過一些工具來幫忙，就不用完全自己手打。打開 [Convert KLE raw to QMK info.json](https://qmk.fm/converter/) 頁面，並將[上一篇文章](/posts/diyqmkkeyboard-kle/#輸出) 最後的 Raw data 複製並貼到裡面就可以轉換。

例如我貼上：

```json
["Num Lock","/","*","-"],
["7\nHome","8\n↑","9\nPgUp",{h:2},"+"],
["4\n←","5","6\n→"],
["1\nEnd","2\n↓","3\nPgDn",{h:2},"Enter"],
[{w:2},"0\nIns",".\nDel"]
```

轉換後會得到：

```json
{
  "keyboard_name": "",
  "url": "",
  "maintainer": "qmk",
  "layouts": {
    "LAYOUT": {
      "layout": [
        {"label":"Num Lock", "x":0, "y":0},
        {"label":"/", "x":1, "y":0},
        {"label":"*", "x":2, "y":0},
        {"label":"-", "x":3, "y":0},
        {"label":"7", "x":0, "y":1},
        {"label":"8", "x":1, "y":1},
        {"label":"9", "x":2, "y":1},
        {"label":"+", "x":3, "y":1, "h":2},
        {"label":"4", "x":0, "y":2},
        {"label":"5", "x":1, "y":2},
        {"label":"6", "x":2, "y":2},
        {"label":"1", "x":0, "y":3},
        {"label":"2", "x":1, "y":3},
        {"label":"3", "x":2, "y":3},
        {"label":"Enter", "x":3, "y":3, "h":2},
        {"label":"0", "x":0, "y":4, "w":2},
        {"label":".", "x":2, "y":4}
      ]
    }
  }
}
```

可以發現轉換出來的 `layout` 就是我們要的格式，將它複製到我們的 `keyboard.json` 中（注意階層要看準，括號有多有少都會出錯。我通常會直接複製並取代方括號 `[]` 的內容）。

但是它還是缺少了 `matrix` 的資料，這部分我們要自己手動打。`matrix` 的部分我還沒找到比較好的方式可以自動產生，所以目前就只能自己手打，稍微有點麻煩。

如果你不太知道 `matrix` 的座標要怎麼打的話，可以使用 [Keyboard Firmware Builder](https://kbfirmware.com/)，將 [上一篇文章](/posts/diyqmkkeyboard-kle/#輸出) 最後的 Raw data 複製並貼到裡面。

![▲ 在 Keyboard Firmware Builder 貼上 KLE 的 Raw data](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/adea4962.webp)

在標籤頁「Wiring」裡，你看到的是鍵盤的鍵矩陣接線圖。它會自動幫你生成一個可行的接線方式，如果你不喜歡的話也可以手動修改。

![▲ 接線頁面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/e35af54c.webp)

![▲ 接線圖和 Matrix 的對應關係](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/e0bf62be.webp)

它提供的接線圖就很清楚地表達了每個鍵的鍵矩陣位置，請以此為依據來編輯每個鍵的 `matrix` 內容。

修改完成後：

```json
"layouts": {
  "LAYOUT": {
    "layout": [
        {"label": "NumLock", "matrix": [0, 0], "x": 0, "y": 0},
        {"label": "/",       "matrix": [0, 1], "x": 1, "y": 0},
        {"label": "*",       "matrix": [0, 2], "x": 2, "y": 0},
        {"label": "-",       "matrix": [0, 3], "x": 3, "y": 0},

        {"label": "7",       "matrix": [1, 0], "x": 0, "y": 1},
        {"label": "8",       "matrix": [1, 1], "x": 1, "y": 1},
        {"label": "9",       "matrix": [1, 2], "x": 2, "y": 1},

        {"label": "4",       "matrix": [2, 0], "x": 0, "y": 2},
        {"label": "5",       "matrix": [2, 1], "x": 1, "y": 2},
        {"label": "6",       "matrix": [2, 2], "x": 2, "y": 2},
        {"label": "+",       "matrix": [2, 3], "x": 3, "y": 1, "h": 2},

        {"label": "1",       "matrix": [3, 0], "x": 0, "y": 3},
        {"label": "2",       "matrix": [3, 1], "x": 1, "y": 3},
        {"label": "3",       "matrix": [3, 2], "x": 2, "y": 3},

        {"label": "0",       "matrix": [4, 1], "x": 0, "y": 4, "w": 2},
        {"label": ".",       "matrix": [4, 2], "x": 2, "y": 4},
        {"label": "Enter",   "matrix": [4, 3], "x": 3, "y": 3, "h": 2}
    ]
  }
}
```

這一步可能比較複雜，要多看幾次比對。

> 注意這裡 `matrix` 設定的鍵矩陣行列大小要和下面的 `matrix_pins` 中的 `cols` 與 `rows` 數量是一致的。

#### 鍵矩陣

一般來說，鍵盤的按鍵數都大於微控制器的 GPIO 接腳數，所以會使用鍵盤矩陣掃描（Keyboard Matrix Scanning）技術。如果不是很懂鍵盤矩陣掃描的話，最好先找一些資料瞭解一下，這裡就不贅述。

- `diode_direction` 表示鍵矩陣硬體的二極體方向，一般都是使用 `COL2ROW`。
- `matrix_pins` 設定鍵矩陣的各個腳位。這邊同時決定了鍵矩陣的大小和實際的腳位為何。

要注意的是，開發板上標示的接腳名稱可能不是微控制器的原始腳位名稱，而在 QMK 中只使用 MCU 的**原始腳位名稱**。

請參考下圖，Pro Micro 開發板上的 `D16`（綠色） 其實是 ATmega32U4 的 `PB2`（藍紫色），在 QMK 中要打 `B2`。如果是 `D2`（綠色）腳的話，它的原始腳位是 `PD1`（藍紫色），所以 QMK 中要打 `D1`。這邊小心不要搞混了，簡單來說就是**要看藍紫色的腳位**。

![▲ Pro Micro 腳位對應圖(取自SparkFun)](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/3e97fdee.webp)

例如我可以這樣設定：

```json
"diode_direction": "COL2ROW",
"matrix_pins": {
    "cols": [ "D1", "D0", "D4", "C6" ],
    "rows": [ "F4", "F5", "F6", "F7", "B1" ]
},
```

如果你沒有使用微控制器的經驗，或是不知道要選哪個腳位才行，只要你的鍵盤沒有要加什麼特別的功能（如螢幕、搖桿、可條亮度的 LED 或分離式鍵盤）的話，基本上使用任何腳位都可以。如果你的鍵盤有這些需要特殊硬體功能（UART、SPI、I²C、PWM）的話，記得保留，不要被矩陣掃描佔用了。

> PB2、PD7...的 P 是指 Port，通常以 8 或 16 腳為一個 Port。P 後面的英文字為 Port 名，通常由 A 開始。再來的數字是腳位編號，通常由 0 開始。所以 PB2 就代表 Port-B 的 2 號腳，也就是 Port-B 的第 3 支接腳，因為 Port-B 的第一支腳是 PB0。
> 使用現成的開發板（像是 Pro Micro）的話，記得要選有引出的接腳（開發板可能不會把微控制器的所有接腳都拉出）。

這部分的官方文件請參考 [Matrix Pins](https://docs.qmk.fm/reference_info_json#matrix)。

#### LTO

LTO 是 Link-Time Optimization（連接時間最佳化）的意思，它可以幫助減少最終燒錄檔案的大小。由於 ATmega32U4 的 ROM 容量真的很小，可能功能開多一點就爆錶了，所以一般來說會建議開啓這個功能。更多減少燒錄檔大小的說明請參考：[Squeezing the most out of AVR](https://docs.qmk.fm/squeezing_avr)

```json
"build": {
    "lto": true
},
```

> 在舊版 QMK 中，這個設定是在 `rules.mk` 中的 `LTO_ENABLE = yes`。

#### 修改完成

完成的完整 `keyboard.json` 大概長這樣：

```json
{
  "$schema": "https://raw.githubusercontent.com/qmk/qmk_firmware/refs/heads/master/data/schemas/keyboard.jsonschema",
  "keyboard_name": "0_my_kb_promicro",
  "manufacturer": "ziteh",
  "maintainer": "ziteh",
  "url": "",
  "development_board": "promicro",
  "diode_direction": "COL2ROW",
  "features": {
    "bootmagic": true,
    "command": false,
    "console": false,
    "extrakey": true,
    "mousekey": true,
    "nkro": true
  },
  "build": {
      "lto": true
  },
  "usb": {
    "device_version": "1.0.0",
    "pid": "0x0000",
    "vid": "0xFEED"
  },
  "matrix_pins": {
    "cols": ["D1", "D0", "D4", "C6"],
    "rows": ["F4", "F5", "F6", "F7", "B1"]
  },
  "layouts": {
    "LAYOUT": {
      "layout": [
        { "label": "NumLock", "matrix": [0, 0], "x": 0, "y": 0 },
        { "label": "/",       "matrix": [0, 1], "x": 1, "y": 0 },
        { "label": "*",       "matrix": [0, 2], "x": 2, "y": 0 },
        { "label": "-",       "matrix": [0, 3], "x": 3, "y": 0 },

        { "label": "7",       "matrix": [1, 0], "x": 0, "y": 1 },
        { "label": "8",       "matrix": [1, 1], "x": 1, "y": 1 },
        { "label": "9",       "matrix": [1, 2], "x": 2, "y": 1 },

        { "label": "4",       "matrix": [2, 0], "x": 0, "y": 2 },
        { "label": "5",       "matrix": [2, 1], "x": 1, "y": 2 },
        { "label": "6",       "matrix": [2, 2], "x": 2, "y": 2 },
        { "label": "+",       "matrix": [2, 3], "x": 3, "y": 1, "h": 2 },

        { "label": "1",       "matrix": [3, 0], "x": 0, "y": 3 },
        { "label": "2",       "matrix": [3, 1], "x": 1, "y": 3 },
        { "label": "3",       "matrix": [3, 2], "x": 2, "y": 3 },

        { "label": "0",       "matrix": [4, 1], "x": 0, "y": 4, "w": 2 },
        { "label": ".",       "matrix": [4, 2], "x": 2, "y": 4 },
        { "label": "Enter",   "matrix": [4, 3], "x": 3, "y": 3, "h": 2 }
      ]
    }
  }
}
```

你會注意到我這裡多了一行 `$schema`，這個是用來設定這個 JSON 的欄位格式。如果你是使用 VS Code 的話還會有自動補全和提示的功能。假如你怕自己編輯 JSON 檔案的格式或拼字有錯，可以多加這行，讓文字編輯器幫你做檢查，不然不加也可以，不會影響 QMK 的功能。

### 修改 `keymap.c`

`keymaps` 資料夾內可以放多種不同的鍵映射（Keymap），但是至少有有一個名為 `default` 的預設 Keymap。現在已經自動產生這個預設 keymap 了。打開 `keymaps\default\keymap.c` 。

這裡要修改的是 `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {}` 的內容，也就是 Keymap。Keymap 的結構與行列數量必須要與剛剛在 `keyboard.json` 中設定的 `layout` 中的 `matrix` 對應。

這裡要手動修改的話也是有一點麻煩，所以一樣推薦使用 [Keyboard Firmware Builder](https://kbfirmware.com/)，將 [上一篇文章](/posts/diyqmkkeyboard-kle/#輸出) 最後的 Raw data 複製並貼到裡面。到最後一個標籤頁「Compile」按下「Download .zip」按鈕來儲存它產生的 QMK 韌體原始檔（舊版）。

![▲ 「Compile」標籤頁](https://bucket.ziteh.dev/blog/diyqmkkeyboard-firmware/0ff41c43.webp)

將下載的 `.zip` 檔解壓縮，打開其中的 `qmk_firmware\keyboards\kb\keymaps\default\keymap.c`。你會看到和我們所需要的 `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {}` 的內容，可以把複製到我們的鍵盤的 `keymap.c` 中。

不過它的每一個層的名稱是 `KEYMAP()`，而我們剛剛產生的名稱是 `LAYOUT`，所以這邊也要一同改成 `LAYOUT()`。

`LAYOUT()` 中的這些就代表了鍵盤各個鍵位的按鍵功能。像是 `KC_P7` 代表了 <kbd>Numpad7</kbd>（數字鍵盤的 7），而詳細的按鍵名稱請參考 QMK 的說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。

你所需要做的就是把該按鍵的代號（如 `KC_P7`）放在對的位置就好了，之後你按下這個位置的按鍵就會是輸出這個鍵值。QMK 鍵盤支援多層 Keymap 設定，而每一塊 `[n] = LAYOUT()` 代表的是一層，最上面的是第 0 層，往下是第 1、2...n 層。

修改完的 `keymap.c` 大概長這樣：

```c
#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
// clang-format off
    [0] = LAYOUT(
      KC_NUM,  KC_PSLS, KC_PAST, KC_PMNS,
      KC_P7,   KC_P8,   KC_P9,
      KC_P4,   KC_P5,   KC_P6,   KC_PPLS,
      KC_P1,   KC_P2,   KC_P3,
               KC_P0,   MO(1),   KC_PENT
    ),

    [1] = LAYOUT(
      _______, _______, _______, _______,
      KC_HOME, KC_UP,   KC_PGUP,
      KC_LEFT, _______, KC_RGHT, _______,
      KC_END,  KC_DOWN, KC_PGDN,
               KC_INS,  _______, KC_DEL
    )};
// clang-format on
```

有些人可能會喜歡加上一些圖案：

```c
[0] = LAYOUT(
// ┌────────┬─────────┬──────────┬─────────┐
     KC_NUM,  KC_PSLS,  KC_PAST,   KC_PMNS,
// ├────────┼─────────┼──────────┼─────────┤
     KC_P7,   KC_P8,    KC_P9,
// ├────────┼─────────┼──────────┤         │
     KC_P4,   KC_P5,    KC_P6,     KC_PPLS,
// ├────────┼─────────┼──────────┼─────────┤
     KC_P1,   KC_P2,    KC_P3,
// ├────────┴─────────┼──────────┤         │
          KC_P0,        MO(1),     KC_PENT
// └──────────────────┴──────────┴─────────┘
),
```

> `clang-format off` 與 `clang-format on` 是讓 VS Code 的 Clang-format 格式化工具不用美化該區域的內容，和功能無關可以不加。
>
> 如果你稍微懂一點 C 語言的話，`LAYOUT()` 就是是 `#define` 巨集 Macro。

### 修改 `rules.mk`

Pro Micro 一般會分 16MHz/5V 和 8MHz/3.3V 這兩種版本，若你使用的是後者才需要執行這個修改 `rules.mk` 的步驟。

原始建立的檔案中沒有這個檔案，我們自行新增即可，放在和 `keyboard.json` 同一個層級。

請在 `rules.mk` 中加入：

```makefile
## Processor frequency
F_CPU = 8000000
```

> 這部分的說明請參考：[AVR MCU Options](https://docs.qmk.fm/config_options#avr-mcu-options)
>
> 請注意 `rules.mk` 中的各行結尾不能有空白，否則可能會導致奇怪的編譯錯誤，例如：`Compiling: .build/obj_mytestkb/src/default_keyboard.c    avr-gcc.exe: error: UL: No such file or directory`。

## 結語

到此為止，QMK 韌體原始檔的基本編輯就完成了，接下來就要準備進行編譯。

這一篇的內容可能比較複雜，且 QMK 也一直再更新，如果有我寫得不夠清楚或是有誤的地方，歡迎提出。

⭐ [本文的完整範例檔案](https://github.com/siderakb/qmk-example)

## 相關網站及參考資料

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [Keyboard Firmware Builder](https://kbfirmware.com/)
- [Qwiic Pro Micro USB-C (ATmega32U4) Hookup Guide - SparkFun Learn](https://learn.sparkfun.com/tutorials/qwiic-pro-micro-usb-c-atmega32u4-hookup-guide/all)
- QMK相關
  - [QMK 官方網站](https://qmk.fm/)
  - [QMK 官方文件](https://docs.qmk.fm/#/)
  - [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)
- 撰寫本文時的工具版本
  - QMK MSYS: `1.10.0`
  - QMK CLI：`1.1.6`
