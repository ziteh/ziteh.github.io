---
title: '[自製QMK鍵盤-番外] 0.21.3版QMK韌體'
subtitle: '2023 QMK 韌體編輯教學'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK 
series: ["自製QMK鍵盤"]
date: 2023-07-02 10:48:00+08:00
comment: true
toc: true
draft: false
---

本文是舊版本的 QMK，如果需要新版本的教學請看[新版 QMK 教學](/posts/diyqmkkeyboard-edit-qmk/)。

如果你因爲某些原因需要使用舊版 QMK 的話，可以使用下面的方法來切換 QMK 版本（需要先安裝好 QMK MSYS 環境）。

1. 打開 QMK MSYS
2. 執行 `qmk cd`
3. 執行 `git fetch --all --tags --prune`
4. 執行 `git checkout tags/0.21.3`

---

在[上一篇文章](/posts/diyqmkkeyboard-1/)中已經完成鍵盤的 Layout，這篇文章將會接續[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)的第 3 步——生成並編輯 QMK 韌體。

> 本篇是以發文當時最新的 [`0.21.3`](https://github.com/qmk/qmk_firmware/releases/tag/0.21.3) 版本的 QMK 作爲示範。  
> 本文的[前一個版本](/posts/diyqmkkeyboard-firmware-0-18/)是針對 `0.18.3` 版所撰寫的，已經不適合最新版的 QMK，故更新本文內容，舊版教學文僅作爲參考保留。

<!--more-->

# 準備環境

首先要[準備 QMK 環境](https://docs.qmk.fm/#/newbs_getting_started?id=set-up-your-environment)，現在這一步已經相當簡單。請執行以下步驟：

1. 下載並執行 [QMK MSYS](https://msys.qmk.fm/) 工具。
2. 在 QMK MSYS 中輸入並執行指令 `qmk setup` 指令。
3. 過程中它可能會請你確認一些問題，多數情況只要回答 `y` 既可。

完成後會有一行 `QMK is ready to go`。往上滾動一些會看到一行 `Repo version: 0.21.3` 代表目前的 QMK 版本。

準備好環境後，可以先編譯其它鍵盤作爲測試。在 QMK MSYS 中執行：
```cmd
qmk compile -kb clueboard/66/rev3 -km default
```

若環境沒問題的話，稍微等待後你應該會看到一排 `[OK]`，及類似這樣的結尾：
```cmd
Linking: .build/clueboard_66_rev3_default.elf                          [OK]
Creating load file for flashing: .build/clueboard_66_rev3_default.hex  [OK]
Copying clueboard_66_rev3_default.hex to qmk_firmware folder           [OK]
Checking file size of clueboard_66_rev3_default.hex                    [OK]
 * The firmware size is fine - 26356/28672 (2316 bytes free)
```

如果你因爲某些原因需要使用不同版本的 QMK，可以使用下面的方法來切換 QMK 版本。你可以在[這裡](https://github.com/qmk/qmk_firmware/tags)查看所有 QMK 的版本（Tag）。可能需要另外安裝 Git。

1. 打開 QMK MSYS
2. 導航到 QMK 的工作路徑：執行 `qmk cd`
3. 更新 Tag：執行 `git fetch --all --tags --prune`
4. 切換到指定的版本 Tag（以`0.21.3`爲例）：執行 `git checkout tags/0.21.3`

# 創建新鍵盤

在 QMK MSYS 中執行：
```cmd
qmk new-keyboard
```

這時你可能會看到這樣的回應：
```cmd
Generating a new QMK keyboard directory

Name Your Keyboard Project
For more infomation, see:
https://docs.qmk.fm/#/hardware_keyboard_guidelines?id=naming-your-keyboardproject

Keyboard Name?
```

這時請輸入你想要的鍵盤名稱後按 Enter，例如我使用「mytestkb」做示範。命名規則請參考 [Naming Your Keyboard/Project](https://docs.qmk.fm/#/hardware_keyboard_guidelines?id=naming-your-keyboardproject).

再來它回問你 Username 及 Real Name，這部分就打你自己想要的名稱即可（之後也還可以改），例如我兩者都打「ziteh」。

![▲ 使用指令建立新鍵盤](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipRq6B074RdBe4t0Uc5qIZajM0j3dS-lwJiel-cEGdwrgVwFBNWHkSDjBokQI7N9364L2eQS3B76_HAbcgsMVklbBPCllBSvPRhwkurRY7zW37mGWr9xHy45LYGZhKvf4_5H8WnezV1XLlVYv6JDWDXGkTmCSksXUbO2h7pkZ_FZtD-vOIUkRB-q7wug4/s16000/2023-07-01%2022-10-24.mkv_20230702_095338.927.jpg)

接著會問你基礎佈局，你可以選一個和你預計要做的鍵盤較爲類似的佈局，這樣後續要改的東西就會比較少。例如常見的 60% 鍵盤爲「8. 65_ansi」，那就輸入「8」後按 Enter。

最後會問你所使用的 MCU，如果你使用的是 Pro Micro 的話，可以選「13」號。當然如果你是用別的 MCU 的話就自行選擇。這些設定後續都可以再修改。

> 你可能會在意使用 Pro Micro 的話選「28」號的「atmega32u4」可以嗎？答案是可以，但是後續還要手動改掉 Bootloader，所以建議直接選「13」就好。

![▲ 選擇基底佈局與微控制器](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTN8nyl-WGZQDeSTBAFr7o2-FVoNBfXDcSmoQvBaDw-ABHSI-kEHleAzx7MduwvqTKRlGnP04BQ3-kKpBmTM-pAN5s6fht8CHbQDzlVIzdTJJbKIRH19N1P4fq7WqL0Bu3F2YPKa9gup2i9TwPvlwhEKDbe9asl487Yzbw85lB1jYVjtwuQmbX7uGTEbU/s16000/Unnamed.png)

完成後會顯示類似這樣的訊息：
```cmd
Created a new keyboard called mytestkb.
To start working on things, 'cd' into keyboards/mytestkb,
or open the directory in your preferred text editor.
And build with qmk compile -kb mytestkb -km default.
```

這樣我們的新鍵盤就在 QMK 的目錄底下建立完成了。

# 編輯韌體

現在要打開我們剛剛建立的鍵盤檔案，爲細部功能做調整。

使用文字編輯器（例如我使用 [VSCode](https://code.visualstudio.com/)）打開剛剛建立的新鍵盤的資料夾。QMK 預設的路徑是在 `C:\Users\<USERNAME>\qmk_firmware\`，而我們剛剛建立的鍵盤在其中的 `keyboards\mytestkb\`。

這時你會看到 `mytestkb` 下有這些檔案：
- `keymaps\`
  - `default\`
    - `keymap.c`
- `info.json`
- `config.h`
- `rules.mk`
- `readme.md`

## 修改 `info.json`

`info.json` 是最主要的設定檔，大部分的設定都在這裡調整。有關它的詳細說明請參考 [info.json Format](https://docs.qmk.fm/#/reference_info_json) 及 [Data Driven Configuration](https://docs.qmk.fm/#/data_driven_config)。

> [舊版 QMK](/posts/diyqmkkeyboard-firmware-0-18/) 在 `rules.mk` 和 `config.h` 中的設定現在多數都移到 `info.json` 中了。

### 鍵盤資訊

- `keyboard_name`：鍵盤名稱。這裡目前是剛剛輸入的 `mytestkb`。
- `url`：可以填該鍵盤的相關說明網址。可以留空。
- `manufacturer`：製造商，可以打你的名字。
- `maintainer`：維護者，一樣可以打你的名字。

### MCU 與 Bootloader

MCU 與 Bootloader 的設定是要互相配合的，要依照你使用的 MCU 來選擇正確的 Bootloader。

首先看到 `processor` 的部分，這裡要選擇使用的 MCU。由於我們剛剛選擇的是 Pro Micro，所以這裡目前是 `atmega32u4` 沒錯，如果你使用的是別的 MCU 就請修改。QMK 支援的 MCU 可以參考 [Compatible Microcontrollers](https://docs.qmk.fm/#/compatible_microcontrollers)。

再來是 `bootloader` 的部分，由於我們是 Pro Micro，所以這裡要是 `caterina`。如果你使用的是不同的 MCU，那 bootloader 也要改，具體的對照爲：
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

### 功能

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

### USB

`usb` 底下會設定一些 USB 相關的資料。有 `vid`、`pid` 及 `device_version` 這三個，分別代表 Vendor ID、Product ID 和 Device version。可以保持不變，也可以改成自己喜歡的。官方文件請參考 [USB](https://docs.qmk.fm/#/reference_info_json?id=usb)。

> USB VID 與 PID 是 USB 設備的識別號，正常來說是要向 USB 協會申請/購買，但是我們只是要自己做鍵盤的話通常都自行設定就好。要注意的是，如果一臺電腦同時接了多個相同 VID 和 PID 的裝置，那這些裝置可能無法運作。

例如可以使用：
```json
"usb": {
    "vid": "0xC1ED",
    "pid": "0x23B0",
    "device_version": "1.0.0"
}
```

### 佈局

一把鍵盤可以設定多個佈局（Layout），但這裡我們就僅簡單示範單一佈局。官方文件請參考 [Layout Format](https://docs.qmk.fm/#/reference_info_json?id=layout-format)。

`LAYOUT_65_ansi` 就是我們剛剛選擇的基底佈局，內部的 `layout` 就是要設定每一個按鍵的位置，包含了物理上的實際位置和在鍵矩陣中的行列位置。我這裡把 `LAYOUT_65_ansi` 這個名稱改成 `LAYOUT`。

看其中兩個鍵：
```json
{"matrix": [0, 0], "x": 0, "y": 0},
{"matrix": [0, 1], "x": 1, "y": 0},
```

`matrix` 是設定該鍵在「鍵矩陣」中的行列位置，格式爲 `[row, col]`。`x` 和 `y` 是設定該鍵的「物理」位置，也就是它擺在哪裡。另外還有 `w` 與 `h` 可以設定按鍵的寬度和高度，`label` 可以設定名稱。

`layout` 的內容可以透過一些工具來幫忙，就不用完全自己手打。打開 [Convert KLE to QMK info.json](https://qmk.fm/converter/) 頁面，並將[上一篇文章](/posts/diyqmkkeyboard-1/#輸出) 最後的 Raw data 複製並貼到裡面就可以轉換。

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

可以發現轉換出來的 `layout` 就是我們要的格式，將它複製到我們的 `info.json` 中（注意階層要看準，括號有多有少都會出錯。我通常會直接複製並取代方括號 `[]` 的內容）。

但是它還是缺少了 `matrix` 的資料，這部分我們要自己手動打。`matrix` 的部分我還沒找到比較好的方式可以自動產生，所以目前就只能自己手打，稍微有點麻煩。

如果你不太知道 `matrix` 的座標要怎麼打的話，可以使用 [Keyboard Firmware Builder](https://kbfirmware.com/)，將 [上一篇文章](/posts/diyqmkkeyboard-1/#輸出) 最後的 Raw data 複製並貼到裡面。

![▲ 在 Keyboard Firmware Builder 貼上 KLE 的 Raw data](https://1.bp.blogspot.com/-UTbRymD6jFo/Xu4uCFUmN4I/AAAAAAAACc4/Pun-2kS6qooDb3plao7F_e5sogqH_uHKQCK4BGAsYHg/s1903/%255B01%255DKeyboard%2BFirmware%2BBuilder_Import.png)

在標籤頁「Wiring」裡，你看到的是鍵盤的鍵矩陣接線圖。它會自動幫你生成一個可行的接線方式，如果你不喜歡的話也可以手動修改。

![▲ 接線頁面](https://1.bp.blogspot.com/-9pJYrEjmaXU/Xu4uCdp4PEI/AAAAAAAACc8/p8MMZuiSBUMSpTjsN0f0Xa78Turt48kzwCK4BGAsYHg/s1903/%255B02%255DKeyboard%2BFirmware%2BBuilder_Wiring_1.png)

![▲ 接線圖和 Matrix 的對應關係](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh99UeiWYdyky-hZedrvxTovnjqjoeXQg2b2nYZkCG7fIvJS5kOdSyhxP5YzMR3x7MOMoicCb6okM89xIcLfbuSmaJ3zgJoFcT2RQMg0bXmGaoRXV6pNtBOw2l9e8GmFENw_JYKeWlvF3bz2kzGefg_tD-Udxw5MTlHtRQ8VjQH2laiJI5GSOSCh9Vvd_c/s16000/mt2.png)

它提供的接線圖就很清楚地表達了每個鍵的鍵矩陣位置，請以此爲依據來編輯每個鍵的 `matrix` 內容。

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

> 注意這裡 `matrix` 設定的鍵矩陣行列大小要和下面的 `matrix_pins` 中的 `cols` 與 `rows` 數量是一致的。

### 鍵矩陣

一般來說，鍵盤的按鍵數都大於微控制器的 GPIO 接腳數，所以會使用鍵盤矩陣掃描（Keyboard Matrix Scanning）技術。如果不是很懂鍵盤矩陣掃描的話，最好先找一些資料瞭解一下，這裡就不贅述。

- `diode_direction` 表示鍵矩陣硬體的二極體方向，一般都是使用 `COL2ROW`。
- `matrix_pins` 設定鍵矩陣的各個腳位。這邊同時決定了鍵矩陣的大小和實際的腳位爲何。

鍵矩陣的 Column 及 Row 數量請參考上面佈局中的 `matrix` 設定。

要注意的是，開發板上標示的接腳名稱可能不是微控制器的原始腳位名稱，而在 QMK 中只使用微控制器的原始腳位名稱。

請參考下圖，Pro Micro 開發板上的 `D16`（綠色） 其實是 ATmega32U4 的 `PB2`（藍紫色），而在 QMK 中要打 `B2`。如果是 `D2`（綠色）腳的話，它其實是 `PD1`（藍紫色），所以 QMK 中要打 `D1`。這邊小心不要搞混了，簡單來說就是要看藍紫色的腳位。

![▲ Pro Micro 腳位對應圖(取自SparkFun)](https://1.bp.blogspot.com/-UqmjvTbo7Uo/Xu4yajqMXKI/AAAAAAAACeE/AEfdjtlknrcRsjSYvmRz5B0IxY4RIiQegCK4BGAsYHg/s1166/ProMicroPin.png)

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

這部分的官方文件請參考 [Matrix Pins](https://docs.qmk.fm/#/reference_info_json?id=matrix-pins)。


### 修改完成

完成的完整 `info.json` 大概長這樣：
```json
{
  "keyboard_name": "mytestkb",
  "url": "",
  "manufacturer": "ziteh",
  "maintainer": "ziteh",
  "processor": "atmega32u4",
  "bootloader": "caterina",
  "diode_direction": "COL2ROW",
  "matrix_pins": {
    "cols": [ "D1", "D0", "D4", "C6" ],
    "rows": [ "F4", "F5", "F6", "F7", "B1" ]
  },
  "features": {
    "bootmagic": true,
    "command": false,
    "console": false,
    "extrakey": true,
    "mousekey": true,
    "nkro": true
  },
  "usb": {
    "vid": "0xFEED",
    "pid": "0x0000",
    "device_version": "1.0.0"
  },
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
}
```

## 修改 `keymap.c`

`keymaps` 資料夾內可以放多種不同的鍵映射（Keymap），但是至少有有一個名爲 `default` 的預設 Keymap。現在已經自動產生這個預設 keymap 了。打開 `keymaps\default\keymap.c` 。

這裡要修改的是 `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {}` 的內容，也就是 Keymap。Keymap 的結構與行列數量必須要與剛剛在 `info.json` 中設定的 `layout` 中的 `matrix` 對應。

這裡要手動修改的話也是有一點麻煩，所以一樣推薦使用 [Keyboard Firmware Builder](https://kbfirmware.com/)，將 [上一篇文章](/posts/diyqmkkeyboard-1/#輸出) 最後的 Raw data 複製並貼到裡面。到最後一個標籤頁「Compile」按下「Download .zip」按鈕來儲存它產生的 QMK 韌體原始檔（舊版）。

![▲ 「Compile」標籤頁](https://1.bp.blogspot.com/-IbmnNoxPZ-s/Xu4uE8BFvvI/AAAAAAAACdg/khQpXPgiygkaVn409H394FOvf9RN8C-iACK4BGAsYHg/s800/%255B11%255DKeyboard%2BFirmware%2BBuilder_Compile.png)

將下載的 `.zip` 檔解壓縮，打開其中的 `qmk_firmware\keyboards\kb\keymaps\default\keymap.c`。你會看到和我們所需要的 `const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {}` 的內容，可以把複製到我們的鍵盤的 `keymap.c` 中。

不過它的每一個層的名稱是 `KEYMAP()`，而我們剛剛產生的名稱是 `LAYOUT_65_ansi()`，但是由於我在 `info.json` 時把 `LAYOUT_65_ansi` 改成 `LAYOUT` 了，所以這邊也要一同改成 `LAYOUT()`。你可以只先複製一塊 `KEYMAP()`/`LAYOUT()`，剩下的再自己修改。

`LAYOUT()` 中的這些就代表了鍵盤各個鍵位的按鍵功能。像是 `KC_P7` 代表了 <kbd>Numpad7</kbd>（數字鍵盤的 7），而詳細的按鍵名稱請參考 QMK 的說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。

你所需要做的就是把該按鍵的代號（如 `KC_P7`）放在對的位置就好了，之後你按下這個位置的按鍵就會是輸出這個鍵值。QMK 鍵盤支援多層 Keymap 設定，而每一塊 `[n] = LAYOUT()` 代表的是一層，最上面的是第 0 層，往下是第 1、2...n 層。

修改完的 `keymap.c` 大概長這樣：
```c
#include QMK_KEYBOARD_H

// clang-format off
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
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

有些人會加上一些圖案來讓 `LAYOUT()` 更容易閱讀：
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

> `clang-format off` 與 `clang-format on` 是讓 VSCode 的 Clang-format 格式化工具不用美化該區域的內容。  
> 如果你稍微懂一點 C 語言的話，`LAYOUT()` 其實是 Macro。

## 修改 `rules.mk`

如果你使用的是 Pro Micro 的話，Pro Micro 一般會分 16MHz/5V 和 8MHz/3.3V 這兩種版本，若你使用的是後者，那請在 `rules.mk` 中加入：
```mk
# Processor frequency
F_CPU = 8000000
```

另外如果 MCU 是 Atmel AVR 的話（包含 ATmega32U4 和 Pro Micro），還可以再加一行設定來降低韌體的大小，避免發生韌體太大無法燒錄的情況：
```mk
# Link time optimization, enable to reduce the compiled size of firmware
LTO_ENABLE = yes
```

> 請注意 `rules.mk` 中的各行結尾不能有空白，否則會導致編譯錯誤：`Compiling: .build/obj_mytestkb/src/default_keyboard.c    avr-gcc.exe: error: UL: No such file or directory`。

## 完成修改

`config.h` 的內容可以保持不變，`readme.md` 是說明文件，只要修改完 `info.json`、`keymap.c` 和 `rules.mk` 就算是完成韌體的修改了。

> 如果你使用的 MCU 是 RP2040 的話，建議在 `config.h` 中加入一行 `#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET` 來啓用 [Double-tap Reset](https://docs.qmk.fm/#/platformdev_rp2040?id=double-tap)，未來燒錄時會比較方便。

# 結語

到此為止，QMK 韌體原始檔的基本編輯就完成了，接下來就要準備進行編譯。

這一篇的內容可能比較複雜，且 QMK 也一直再更新，如果有我寫得不夠清楚或是有誤的地方，歡迎提出。

# 相關網站及參考資料

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [Keyboard Firmware Builder](https://kbfirmware.com/)
- [Qwiic Pro Micro USB-C (ATmega32U4) Hookup Guide - SparkFun Learn](https://learn.sparkfun.com/tutorials/qwiic-pro-micro-usb-c-atmega32u4-hookup-guide/all)
- [本篇的舊版（0.18.3）內容](/posts/diyqmkkeyboard-firmware-0-18/)
- QMK相關
  - [QMK 官方網站](https://qmk.fm/)
  - [QMK 官方文件](https://docs.qmk.fm/#/)
  - [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)

> 本文最早發佈於 2020-06-21，於 2023-04-21 重新編排並更新內容，再於 2023-07-02 更新爲 QMK 0.21.3 版。
