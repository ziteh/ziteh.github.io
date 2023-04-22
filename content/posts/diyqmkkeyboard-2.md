---
title: '[自製QMK鍵盤-2] 產生並編輯QMK韌體'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK 
series: ["自製QMK鍵盤"]
date: 2023-04-21 22:48:00+08:00
comment: true
toc: true
draft: true
aliases: ["/2020/06/diyqmkkeyboard-2/"]
---

在[上一篇文章](/posts/diyqmkkeyboard-1/)中已經完成鍵盤的 Layout，這篇文章將會接續[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)的第 3 步——生成並編輯 QMK 韌體。

這一篇的內容對不熟悉微控制器或 C 程式語言的人可能會稍有難度，且隨著 QMK 的更新有不少需要修改的地方要注意。

<!--more-->

# 自動產生韌體

首先使用 [Keyboard Firmware Builder](https://kbfirmware.com/) 來自動生成基本的 QMK 韌體，這樣就不用全部從頭開始，工具會生成基本的韌體程式。

> [Keyboard Firmware Builder](https://github.com/ruiqimao/qmkbuilder) 已經有好一段時間沒更新了，它產生的韌體在較新的 QMK 版本下會有多處出錯，本文後半段會一一提醒需要修改的部分。

## 讀入鍵盤

到 Keyboard Layout Editor 並載入你編輯好的鍵盤，複製其 [raw data](/posts/diyqmkkeyboard-1/#輸出) 並貼到 Keyboard Firmware Builder 中間的文字框，按下深藍色的「Import」按鈕。

![▲ 在 Keyboard Firmware Builder 貼上 KLE 的 Raw data](https://1.bp.blogspot.com/-UTbRymD6jFo/Xu4uCFUmN4I/AAAAAAAACc4/Pun-2kS6qooDb3plao7F_e5sogqH_uHKQCK4BGAsYHg/s1903/%255B01%255DKeyboard%2BFirmware%2BBuilder_Import.png)

## 接線（Wiring）

在標籤頁「Wiring」裡，你看到的是鍵盤的接線圖。

一般來說，鍵盤的按鍵數都大於微控制器的 GPIO 接腳數，所以會使用鍵盤矩陣掃描（Keyboard Matrix Scanning）技術。如果不是很懂鍵盤矩陣掃描的話，最好先找一些資料瞭解一下，這裡就不贅述。

在這裡設定鍵盤的接線（或者說鍵盤掃描矩陣）。點選其中一個按鍵可以設定它的鍵盤掃描矩陣的行列，還有設定二極體的方向（一般都是 Column to Row）。

![▲ 編輯接線](https://1.bp.blogspot.com/-9pJYrEjmaXU/Xu4uCdp4PEI/AAAAAAAACc8/p8MMZuiSBUMSpTjsN0f0Xa78Turt48kzwCK4BGAsYHg/s1903/%255B02%255DKeyboard%2BFirmware%2BBuilder_Wiring_1.png)

![▲ 點選一個按鍵後可以編輯該鍵位於掃描矩陣的行列](https://1.bp.blogspot.com/-Bx4OSDytWs8/Xu4uCq9KkdI/AAAAAAAACdA/8d4QLa2qTHMMXBS1Z6Fvma_u-Q5Ud22cgCK4BGAsYHg/s800/%255B03%255DKeyboard%2BFirmware%2BBuilder_Wiring_2.png)

## 腳位（Pins）

在標籤頁「Pins」裡可以設定使用的微控制器型號及其腳位。

首先選擇你使用的微控制器，例如用 Pro Micro 那就是「ATmega32U4」。如果這裡沒有列出你所用的微控制器器的話，那就可以先選「ATmega32U4」，等之後再手動修改。

如果你沒有使用微控制器的經驗，或是不知道要選哪個腳位才行，只要你的鍵盤沒有要加什麼特別的功能（如螢幕、搖桿、可條亮度的LED 或分離式鍵盤）的話，使用任何腳位都可以。如果你的鍵盤有這些需要特殊硬體功能（UART、SPI、I²C、PWM）的話，記得保留，不要被矩陣掃描佔用了。

當然，如果是使用現成的開發板（像是 Pro Micro）的話，記得要選有引出的接腳（開發板可能不會把微控制器的所有接腳都拉出）。

![▲ 「Pins」標籤頁示意](https://1.bp.blogspot.com/-3_lDlu5GoMI/Xu4uCxknlCI/AAAAAAAACdE/4pwTfeQGe8cw8LW-L2a26VXxSf20eA3nwCK4BGAsYHg/s826/%255B04%255DKeyboard%2BFirmware%2BBuilder_Pins.png)

要注意的是，這裡顯示的接腳名稱是該微控制器原始的接腳名稱，可能會和開發板上的腳位號碼不同。

例如 Pro Micro 開發板上的 `D16` 其實是 ATmega32U4 的 `PB2`，而在「Pings」標籤頁顯示的是 `B2` 代表的是 `PB2`，設定前記得看好腳位對照圖。

以下圖爲例，「Pins」頁面中的 `D0` 其實是指 `PD0`（藍紫色），它也被稱爲 `D3`（綠色）。要注意你現在看到的腳位名稱到底是微控制器（藍紫色）的還是開發板（綠色）的，「Pins」頁面顯示的是微控制器的腳位名。

> PB2、PD7...的 P 是指 Port，通常以 8 或 16 腳為一個 Port。  
> P 後面的英文字為 Port 名，通常由 A 開始。再來的數字是腳位編號，通常由 0 開始。  
> 所以 PB2 就代表 Port-B 的 2 號腳，也就是 Port-B 的第 3 支接腳，因為 Port-B 的第一支腳是 PB0。

![▲ Pro Micro 腳位對應圖(取自SparkFun)](https://1.bp.blogspot.com/-UqmjvTbo7Uo/Xu4yajqMXKI/AAAAAAAACeE/AEfdjtlknrcRsjSYvmRz5B0IxY4RIiQegCK4BGAsYHg/s1166/ProMicroPin.png)

## 鍵映射（Keymap）

再來就是「Keymap」標籤頁，按鍵的功能（鍵映射）會在這裡進行設定。

點選一個按鍵後，可以在下方選擇該按鍵的功能（如<kbd>A</kbd>、<kbd>Ctrl</kbd>、<kbd>Enter</kbd>...等）。

而 QMK 也可以設定「層（Layer）」在設定按鍵的上方有個數字就是顯示目前在設定的層，透過按上下來設定不同層的按鍵。

![▲ 「Keymap」標籤頁](https://1.bp.blogspot.com/-bWzQzPwFGgI/Xu4uDJhvouI/AAAAAAAACdI/UTgEK0bLZWgvv2Sl1gTl3mLlCnSgn_RbACK4BGAsYHg/s1903/%255B05%255DKeyboard%2BFirmware%2BBuilder_Keymap_1.png)

如果你在 Keyboard Layout Editor 有設定好各個按鍵的名稱的話，它會自動讀入按鍵的功能，如果沒有的話就需要在此手動編輯。

QMK 可以設定的按鍵請看說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。但你可能會發現這裡可以設定的按鍵並不完全，很多在「Keycodes Overview」裡面有的按鍵這裡都沒有。如果有你想要的按鍵，但沒有出現在選單中的話，可以先隨便選其它的按鍵，等之後再手動修改。

如果要使用層的功能的話，可以參考說明文件：[Keycodes Overview-Layer Switching](https://docs.qmk.fm/#/keycodes?id=layer-switching)

> 歸功於 [Vial](https://get.vial.today/)，QMK 鍵盤可以很方便地隨時編輯 Keymap，甚至連下載軟體都不用，所以在「Keymap」頁面你可以不用真的把它編輯成最終的樣子，可以先用個大概，等之後再用 Vial 修改。  
> 但不建議完全空白，至少預設的第 0 層的每個鍵都要分配按鍵，方便未來測試。

![▲ 其中一種切換層的按鍵設定](https://1.bp.blogspot.com/-AXyTVOereYY/Xu4uDQIikrI/AAAAAAAACdM/ZKoLu2A_TsMjSCcAAJVC_-EHaGEJ9w3agCK4BGAsYHg/s800/%255B06%255DKeyboard%2BFirmware%2BBuilder_Keymap_2.png)

![▲ 不同層可以設定不同的按鍵功能更](https://1.bp.blogspot.com/-d9DCcztZXjQ/Xu4uD44T8EI/AAAAAAAACdQ/Zq8zndxEDWsZRd3Qud_NiWASE6bDZVgkwCK4BGAsYHg/s1903/%255B07%255DKeyboard%2BFirmware%2BBuilder_Keymap_3.png)

## 巨集鍵（Macros）

在「Macros」標籤頁裡，你可以設定巨集鍵功能。巨集鍵也可以等之後再用 Vial 設計。

![▲ 「Macros」標籤頁](https://1.bp.blogspot.com/-6UmwdSv5mYk/Xu4uEFGPrgI/AAAAAAAACdU/QbZ_V0elfsM458VOkhnI7aTYoktUyzVBACK4BGAsYHg/s800/%255B08%255DKeyboard%2BFirmware%2BBuilder_Macros.png)

## Quantum

在「Quantum」標籤頁裡，可以設定更詳細且複雜的功能。如果你不知道這是什麼的話，請不要編輯它，保持預設即可。

![▲ 「Quantum」標籤頁](https://1.bp.blogspot.com/-3JK9VPepotg/Xu4uEYvZriI/AAAAAAAACdY/I4z4ycD-A_YLnDOm35iWjq46P1dw1WPPQCK4BGAsYHg/s800/%255B09%255DKeyboard%2BFirmware%2BBuilder_Quantum.png)

## 設定（Settings）

在標籤頁「Settings」裡可以編輯一些其它的設定。包含名稱、Bootloader 大小、WS2812 LED 燈數量、背光等級。

「Save Configuration」按鈕可以下載一個 JSON 檔，裡面儲存了目前爲止的各種設定。在[一開始的頁面](/posts/diyqmkkeyboard-2/#讀入鍵盤)裡，上方有個「Upload」按鈕，將此 JSON 檔傳上後就可以繼續編輯或修改該鍵盤。**建議一定要儲存此 JSON 檔**，且重新命名以避免與 Keyboard Layout Editor 的 JSON 搞混。

![▲ 「Settings」標籤頁](https://1.bp.blogspot.com/-Vdfp-gzx0uQ/Xu4uEo34ilI/AAAAAAAACdc/sRvlviZR_xUQEhy6Ma0oLsFQ9c_OW50hgCK4BGAsYHg/s800/%255B10%255DKeyboard%2BFirmware%2BBuilder_Settings.png)


## 編譯（Compile）

最後一個標籤頁「Compile」可以透過「Download .hex」按鈕，讓它幫我們完成編譯的工作，並直接進行燒錄的步驟。

但如果你和我一樣是使用 Pro Micro 開發板的話，直接使用它編譯好的檔案可能會有問題，或是你想要修改更豐富的按鍵和其它功能的話，請按下「Download .zip」按鈕，來儲存 QMK 韌體的原始檔，準備對其手動修改與編譯。

![▲ 「Compile」標籤頁](https://1.bp.blogspot.com/-IbmnNoxPZ-s/Xu4uE8BFvvI/AAAAAAAACdg/khQpXPgiygkaVn409H394FOvf9RN8C-iACK4BGAsYHg/s800/%255B11%255DKeyboard%2BFirmware%2BBuilder_Compile.png)

# 手動編輯韌體

接下來的步驟會需要編寫程式碼，請確保你的電腦裝有一個好用的文字編輯軟體（記事本？不太建議）。我自己是使用 [Visual Studio Code](https://code.visualstudio.com/)，或是你可以參考 [QMK 的建議](https://docs.qmk.fm/#/newbs_learn_more_resources?id=text-editor-resources)。

將 Keyboard Firmware Builder 「Compile」標籤頁下載的 `.zip` 檔解壓縮。

## 修改 rules.mk

在解壓縮資料夾 `\qmk_firmware\keyboards\kb\` 底下，找到檔案 `rules.mk`，使用你的文字編輯軟體打開它。

> 此 `kb\` 資料夾就是這把鍵盤的根目錄，資料夾名稱就是此鍵盤在編譯時的名稱。如果想修改名稱的話，資料夾內的 `kb.h` 和 `kb.c` 及 `keymaps\default\keymap.c` 的 `#include "kb.h"` 的名稱都要統一改掉。詳細的 QMK 鍵盤資料夾結構請參考 [Keyboard Guidelines - Keyboard Folder Structure](https://docs.qmk.fm/#/hardware_keyboard_guidelines?id=keyboard-folder-structure)。

我的**原始** `rules.mk` 長這樣（省略部分註解）：

```mk
# MCU name
MCU = atmega32u4

# Processor frequency.
F_CPU = 16000000

# LUFA specific
# Target architecture (see library "Board Types" documentation).
ARCH = AVR8

# Input clock frequency.
F_USB = $(F_CPU)

# Interrupt driven control endpoint task(+60)
OPT_DEFS += -DINTERRUPT_CONTROL_ENDPOINT

# Boot Section Size in *bytes*
OPT_DEFS += -DBOOTLOADER_SIZE=4096

# Build Options
BOOTMAGIC_ENABLE ?= yes	# Virtual DIP switch configuration(+1000)
MOUSEKEY_ENABLE ?= yes	# Mouse keys(+4700)
EXTRAKEY_ENABLE ?= yes	# Audio control and System control(+450)
CONSOLE_ENABLE ?= no	# Console for debug(+400)
COMMAND_ENABLE ?= no    # Commands for debug and configuration
SLEEP_LED_ENABLE ?= no  # Breathing sleep LED during USB suspend
NKRO_ENABLE ?= yes      # USB Nkey Rollover
BACKLIGHT_ENABLE ?= no  # Enable keyboard backlight functionality
AUDIO_ENABLE ?= no
RGBLIGHT_ENABLE ?= no
```

### 微控制器型號

首先確認 `MCU = atmega32u4` 這行。請將等號右側改成你實際使用的微控制器晶片型號。例如用 Pro Micro 的話是 ATmega32U4，所以就是 `MCU = atmega32u4`；如果用的是 Raspberry Pi RP2040 的話就是 `MCU = RP2040`。

QMK 支援的晶片型號可以參考 [Compatible Microcontrollers](https://docs.qmk.fm/#/compatible_microcontrollers)。

### 微控制器頻率

再來是 `F_CPU = 16000000` 這行。請確認你的晶片的運作頻率是多少，像是 Pro Micro 的話主要有 16MHz 和 8MHz 兩種型號，要分清楚。

如果你用的 Pro Micro 是 8MHz 的，要將原本代表 16MHz 的 `F_CPU = 16000000` 改成 8MHz：`F_CPU = 8000000`。

如果你是用 RP2040 的話，可以把 `F_CPU = ?`、`ARCH = AVR8`、`F_USB = $(F_CPU)`、`OPT_DEFS += -DINTERRUPT_CONTROL_ENDPOINT` 及 `OPT_DEFS += -DBOOTLOADER_SIZE=4096` 這幾行刪除。

### 選擇 Bootloader

然後要選擇 Bootloader 種類，這個部分原本的 `rules.mk` 裡面沒有，要自己加入。你可以把它加在`F_CPU = ?` 的下面（位置其實沒什麼差別）。要加入的內容為：

```mk
# Bootloader selection
#   Pro Micro    caterina
#   RP2040       rp2040
#   Teensy       halfkay
#   Atmel DFU    atmel-dfu
#   QMK DFU      qmk-dfu
#   LUFA DFU     lufa-dfu
#   ATmega328P   usbasploader
BOOTLOADER = ?
```

| 微控制器/開發板 | Bootloader     |
| :-------------: | :------------- |
|    Pro Micro    | `caterina`     |
|     RP2040      | `rp2040`       |
|     Teensy      | `halfkay`      |
|    Atmel DFU    | `atmel-dfu`    |
|    LUFA DFU     | `lufa-dfu`     |
|     QMK DFU     | `qmk-dfu`      |
|   ATmega328P    | `usbasploader` |

至於 `BOOTLOADER = ?` 這行，請依照你的晶片去做選擇。例如是用 Teensy 開發板的話，就是打 `BOOTLOADER = halfkay`；Pro Micro 是 `BOOTLOADER = caterina`；RP2040 是 `BOOTLOADER = rp2040`。

QMK 支援的微控制器和 Bootloader 很多，如果是上面沒有寫到的話，請自行參考 QMK 文件。更詳細的說明可以看 [Flashing Instructions and Bootloader Information](https://docs.qmk.fm/#/flashing?id=flashing-instructions-and-bootloader-information) 。

> 我以前在這一步卡了好久，上網找問題找了好久才發現這個地方要注意。

### 其它功能

`rules.mk` 底下還有一段 Build Options：
```mk
# Build Options
#   comment out to disable the options.
#
BOOTMAGIC_ENABLE ?= yes	# Virtual DIP switch configuration(+1000)
MOUSEKEY_ENABLE ?= yes	# Mouse keys(+4700)
EXTRAKEY_ENABLE ?= yes	# Audio control and System control(+450)
CONSOLE_ENABLE ?= no	# Console for debug(+400)
COMMAND_ENABLE ?= no    # Commands for debug and configuration
SLEEP_LED_ENABLE ?= no  # Breathing sleep LED during USB suspend
NKRO_ENABLE ?= yes      # USB Nkey Rollover - if this doesn't work, see here: https://github.com/tmk/tmk_keyboard/wiki/FAQ#nkro-doesnt-work
BACKLIGHT_ENABLE ?= no  # Enable keyboard backlight functionality
AUDIO_ENABLE ?= no
RGBLIGHT_ENABLE ?= no
```

這邊可以啓用/禁用一些特定的功能，可以參考 [Feature Options](https://docs.qmk.fm/#/config_options?id=feature-options) 來瞭解各個功能。

另外，如果你使用的是 ATmega32U4 的話，爲了儘可能地降低最終韌體的大小，可以加入 `LTO_ENABLE = yes`，詳細可以參考 [Squeezing Space from AVR](https://docs.qmk.fm/#/squeezing_avr?id=rulesmk-settings)。

### 修改完成

`rules.mk` 的部分大概就是這些，裡面還有更多的設定可以調整，這裡就不細講了。

**修改完**的 `rules.mk` 長這樣（省略部分註解）：

```mk
# 【Pro Micro (ATmega32U4) 範例 rules.mk】
# MCU name
MCU = atmega32u4

# Processor frequency.
F_CPU = 8000000

# Bootloader selection
BOOTLOADER = caterina

# LUFA specific
# Target architecture (see library "Board Types" documentation).
ARCH = AVR8

# Input clock frequency.
F_USB = $(F_CPU)

# Interrupt driven control endpoint task(+60)
OPT_DEFS += -DINTERRUPT_CONTROL_ENDPOINT

# Boot Section Size in *bytes*
OPT_DEFS += -DBOOTLOADER_SIZE=4096

# Build Options
BOOTMAGIC_ENABLE ?= yes	# Virtual DIP switch configuration(+1000)
MOUSEKEY_ENABLE ?= yes	# Mouse keys(+4700)
EXTRAKEY_ENABLE ?= yes	# Audio control and System control(+450)
CONSOLE_ENABLE ?= no	# Console for debug(+400)
COMMAND_ENABLE ?= no    # Commands for debug and configuration
SLEEP_LED_ENABLE ?= no  # Breathing sleep LED during USB suspend
NKRO_ENABLE ?= yes      # USB Nkey Rollover
BACKLIGHT_ENABLE ?= no  # Enable keyboard backlight functionality
AUDIO_ENABLE ?= no
RGBLIGHT_ENABLE ?= no

#LTO_ENABLE = yes       # Link time optimization, enable to reduce the compiled size of firmware.
```

```mk
# 【RP2040 範例 rules.mk】
# MCU name
MCU = RP2040

# Bootloader selection
BOOTLOADER = rp2040

# Build Options
BOOTMAGIC_ENABLE ?= yes	# Virtual DIP switch configuration(+1000)
MOUSEKEY_ENABLE ?= yes	# Mouse keys(+4700)
EXTRAKEY_ENABLE ?= yes	# Audio control and System control(+450)
CONSOLE_ENABLE ?= no	# Console for debug(+400)
COMMAND_ENABLE ?= no    # Commands for debug and configuration
SLEEP_LED_ENABLE ?= no  # Breathing sleep LED during USB suspend
NKRO_ENABLE ?= yes      # USB Nkey Rollover
BACKLIGHT_ENABLE ?= no  # Enable keyboard backlight functionality
AUDIO_ENABLE ?= no
RGBLIGHT_ENABLE ?= no
```

## 修改 config.h

在鍵盤路徑下有個 `config.h` 檔案，裡面可以修改腳位、USB 資訊等。使用文字編輯軟體打開它。

### 修改 USB 資訊

在 `config.h` 裡有以下這幾行：

```c
/* USB Device descriptor parameter */
#define VENDOR_ID       0xFEED
#define PRODUCT_ID      0x6060
#define DEVICE_VER      0x0001
#define MANUFACTURER    qmkbuilder
#define PRODUCT         keyboard
```

- `VENDOR_ID`：USB VID。可以保持不變
- `PRODUCT_ID`：USB PID。可以保持不變
- `DEVEICE_VER`：裝置版本。可以保持不變
- `MANUFACTURER`：製造商/開發者
- `PRODUCT`：鍵盤的名稱

***請注意***，原本有一行 `#define DESCRIPTION`，但新版的 QMK 已經不使用，請將此行刪除。

例如我可以改成：
```c
#define VENDOR_ID       0x5A69  /* ASCII "Zi" */
#define PRODUCT_ID      0xE000
#define DEVICE_VER      0x0001
#define MANUFACTURER    ZiTe
#define PRODUCT         KeyPad
```

> USB VID 與 PID 是 USB 設備的識別號，正常來說是要向 USB 協會申請/購買，但是我們只是要自己做鍵盤的話通常都自行設定就好。要注意的是，如果一臺電腦同時接了多個相同 VID 和 PID 的裝置，那這些裝置可能無法運作。

### 修改腳位

在 `config.h` 裡有以下這幾行，用來修改鍵盤矩陣掃描所用的微控制器腳位。請注意，這裡的腳位名稱是微控制本身的腳位，不是開發板上的，可以回顧一下[腳位（Pins）](/posts/diyqmkkeyboard-2/#腳位pins)內的說明。

```c
/* key matrix pins */
#define MATRIX_ROW_PINS { B0, B1, B2, B3, B4 }
#define MATRIX_COL_PINS { B5, B6, B7, C0 }
```

如果你用的是 RP2040 的話，腳位名稱使用的是 `GPx`，可以參考 [RP2040 Pin nomenclature](https://docs.qmk.fm/#/platformdev_rp2040?id=pin-nomenclature)。例如：
```c
#define MATRIX_ROW_PINS { GP0, GP1, GP2, GP3, GP4 }
#define MATRIX_COL_PINS { GP10, GP11, GP12, GP13 }
```

***請注意***，原本還有 `#define UNUSED_PINS`，但是新版的 QMK 已經不使用，請將該行刪除。詳見 [QMK Breaking Changes - 2022 August 27 Changelog](https://www.reddit.com/r/olkb/comments/wznmtn/qmk_breaking_changes_2022_august_27_changelog/) 及 [Pull Request #17931 · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/pull/17931)。

### 鍵盤矩陣大小

鍵盤矩陣的大小可以在此修改。Row 與 Colume 的數量要和設定的腳位數量一致：

```c
/* key matrix size */
#define MATRIX_ROWS 5
#define MATRIX_COLS 4
```

### 防彈跳

***請注意***，原本的防彈跳是使用：

```c
/* Set 0 if debouncing isn't needed */
#define DEBOUNCING_DELAY 5
```

但新版的 QMK 將 `DEBOUNCING_DELAY` 改成 `DEBOUNCE`，所以要將該行修改成：

```c
/* Set 0 if debouncing isn't needed */
#define DEBOUNCE 5
```

### 其它

***請注意***，原本的 `config.h` 內有：

```c
/* prevent stuck modifiers */
#define PREVENT_STUCK_MODIFIERS
```

但新版的 QMK 已經不使用 `PREVENT_STUCK_MODIFIERS`，請將該行刪除。詳見 [Issue #2518 · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/issues/2518)。

另外，原本的 `config.h`（及其它 `.h` 檔案） 的 Include Guard 是使用傳統的預處理器寫法，你可以將其改成較先進的 `#pragma once`。例如：
```c
/* 舊 */
#ifndef CONFIG_H
#define CONFIG_H

...

#endif
```

改成以下
```c
/* 新 */
#pragma once

...
```

> 如果你沒有改用 `#pragma once`，且你有更改鍵盤的名稱（不是 `#define PRODUCT` 的名稱，是預設爲 kb 的[資料夾與檔案名稱](/posts/diyqmkkeyboard-2/#修改-rulesmk)），那原本的 `kb.h` 被修改成 `my_new_keyboard.h` 後，其內的 `KB_H` 要修改成 `MY_NEW_KEYBOARD_H`，即這裡也要改成你鍵盤的名稱且習慣全大寫。當然，如果你熟悉 C 的話可以用你喜歡的方式。

如果你使用的是 RP2040 的話，可以在 `config.h` 中加入：
```c
#define RP2040_BOOTLOADER_DOUBLE_TAP_RESET
```

這樣就可以啓用 [Double-tap Reset](https://docs.qmk.fm/#/platformdev_rp2040?id=double-tap) 功能，未來燒錄時會比較方便。

### 修改完成

修改完成的 `config.h` 範例：
```c
#pragma once

#include "config_common.h"

/* USB Device descriptor parameter */
#define VENDOR_ID       0x5A69  /* ASCII "Zi" */
#define PRODUCT_ID      0xE000
#define DEVICE_VER      0x0001
#define MANUFACTURER    ZiTe
#define PRODUCT         KeyPad

/* key matrix size */
#define MATRIX_ROWS 5
#define MATRIX_COLS 4

/* key matrix pins */
#define MATRIX_ROW_PINS { B0, B1, B2, B3, B4 }
#define MATRIX_COL_PINS { B5, B6, B7, C0 }

/* COL2ROW or ROW2COL */
#define DIODE_DIRECTION COL2ROW

/* number of backlight levels */
#ifdef BACKLIGHT_PIN
#define BACKLIGHT_LEVELS 3
#endif

/* Set 0 if debouncing isn't needed */
#define DEBOUNCE 5

/* Mechanical locking support. Use KC_LCAP, KC_LNUM or KC_LSCR instead in keymap */
#define LOCKING_SUPPORT_ENABLE

/* Locking resynchronize hack */
#define LOCKING_RESYNC_ENABLE

/* key combination for command */
#define IS_COMMAND() ( \
    keyboard_report->mods == (MOD_BIT(KC_LSHIFT) | MOD_BIT(KC_RSHIFT)) \
)

#ifdef RGB_DI_PIN
#define RGBLIGHT_ANIMATIONS
#define RGBLED_NUM 0
#define RGBLIGHT_HUE_STEP 8
#define RGBLIGHT_SAT_STEP 8
#define RGBLIGHT_VAL_STEP 8
#endif
```

## 修改 keymap.c

在`\kb\keymaps\default\` 底下，有個 `keymap.c` 檔案，這是用來指定鍵映射的，使用文字編輯軟體打開它。

### 刪除 even

首先找到 `const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt)` 這一段，將其用 `//` 註解掉（或直接刪除），也就是把該區塊變成：

```c
// const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {
//   keyevent_t event = record->event;
// 
//   switch (id) {
// 
//   }
//   return MACRO_NONE;
// }
```

這邊預設會造成編譯錯誤 `unused variable 'event' [-Werror=unusued-variable] keyevent_t event = record->event;`，當然，如果你懂 C 的話就知道這是什麼意思，可以透過其它你自己喜歡的方式解決。可以參考 [QMK issue - error: unused variable 'event' [-Werror=unused-variable] : olkb](https://www.reddit.com/r/olkb/comments/72f66p/qmk_issue_error_unused_variable_event/)。

### 改按鍵映射

在[先前的段落](/posts/diyqmkkeyboard-2/#鍵映射keymap)有提到 Keyboard Firmware Builder 裡的「Keymap」標籤頁可以設定的按鍵並不完全，如果想要自行修改的話就要再此編輯。

在 `keymap.c` 裡你會看到許多像是這樣的內容：

```c
KEYMAP(
	KC_NLCK, KC_SLSH, KC_ASTR, KC_MINS,
	KC_P7,   KC_P8,   KC_F9,
	KC_P4,   KC_P5,   KC_P6,   KC_PLUS,
	KC_P1,   KC_P2,   KC_P3,
	KC_P0,   MO(1),   KC_PENT),
```

這些就代表了鍵盤各個鍵位的按鍵功能。像是 `KC_P7` 代表了 <kbd>Numpad7</kbd>（數字鍵盤的 7），而詳細的按鍵名稱請參考 QMK 的說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。

你所需要做的就是把該按鍵的代號（如 `KC_P7`）放在對的位置就好了。而每一塊 `KEYMAP(...)` 代表的是一層，最上面的是第 0 層，往下是第 1、2...n 層。

> 新版的 QMK 習慣使用 `LAYOUT` 爲名而非 `KEYMAP`，你可以將 `keymap.c` 及 `kb.h` 內的 `KEYMAP` 都改成 `LAYOUT`。但是不修改應該還是可以完成編譯。

# 結語

到此為止，QMK 韌體原始檔的基本編輯就完成了，接下來就要準備進行編譯。

這一篇的內容可能比較難，且 QMK 也一直再更新，如果有我寫得不夠清楚或是有誤的地方，歡迎提出。

# 相關網站及參考資料

- [Keyboard Firmware Builder](https://kbfirmware.com/)
- [Qwiic Pro Micro USB-C (ATmega32U4) Hookup Guide - SparkFun Learn](https://learn.sparkfun.com/tutorials/qwiic-pro-micro-usb-c-atmega32u4-hookup-guide/all)
- [QMK Breaking Changes - 2022 August 27 Changelog : olkb](https://www.reddit.com/r/olkb/comments/wznmtn/qmk_breaking_changes_2022_august_27_changelog/)
- [Remove `UNUSED_PINS` by tzarc · Pull Request #17931 · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/pull/17931)
- [PREVENT_STUCK_MODIFIERS should be the default · Issue #2518 · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/issues/2518)
- [QMK issue - error: unused variable 'event' [-Werror=unused-variable] : olkb](https://www.reddit.com/r/olkb/comments/72f66p/qmk_issue_error_unused_variable_event/)
- [RESET key not working with pro micro #3091](https://github.com/qmk/qmk_firmware/issues/3091)
- [Replace Pro Micro bootloader with QMK DFU](https://www.reddit.com/r/olkb/comments/8sxgzb/replace_pro_micro_bootloader_with_qmk_dfu/)
- QMK相關
  - [QMK 官方網站](https://qmk.fm/)
  - [QMK 官方文件](https://docs.qmk.fm/#/)
  - [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)

> 本文最早發佈於 2020-06-21，於 2023 重新編排並更新內容。
