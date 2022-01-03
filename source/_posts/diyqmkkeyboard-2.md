title: '[自製QMK鍵盤-2] 手動編輯QMK韌體原始檔'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
categories:
  - 自製QMK鍵盤
date: 2020-06-21 10:28:00
---
# 前言

在上一篇文章（[\[自製QMK鍵盤-1\] 設計鍵盤佈局、按鍵功能和產生韌體原始檔](/2020/06/diyqmkkeyboard-1/)）中我們已經完成鍵盤的佈局設計並得到 QMK 的原始檔案了，在這篇文章中將會手動修改原始檔，以加入更多的功能。

<!--more-->

# 前期準備

接下來的步驟會需要編寫程式碼，請確保你的電腦裝有一個好用的文字編輯軟體（記事本？建議不要）。我自己是使用 [Visual Studio Code](https://code.visualstudio.com/)，或是你可以參考 [QMK的建議](https://docs.qmk.fm/#/newbs_getting_started?id=text-editor)。

還記得上一篇文章中，最後從 Keyboard Firmware Builder 的「COMPILE」標籤頁下載的 `.zip` 檔嗎？請把它解壓縮。

# 修改 rules.mk（使用 Pro Micro 請注意）

在解壓縮資料夾 `\qmk_firmware\keyboards\kb` 底下，找到檔案 `rules.mk`。使用你的文字編輯軟體打開它。

我的**原始** `rules.mk` 長這樣：

```mk
# MCU name
MCU = atmega32u4

# Processor frequency.
#     This will define a symbol, F_CPU, in all source code files equal to the
#     processor frequency in Hz. You can then use this symbol in your source code to
#     calculate timings. Do NOT tack on a 'UL' at the end, this will be done
#     automatically to create a 32-bit value in your source code.
#
#     This will be an integer division of F_USB below, as it is sourced by
#     F_USB after it has run through any CPU prescalers. Note that this value
#     does not *change* the processor frequency - it should merely be updated to
#     reflect the processor speed set externally so that the code can use accurate
#     software delays.
F_CPU = 16000000

#
# LUFA specific
#
# Target architecture (see library "Board Types" documentation).
ARCH = AVR8

# Input clock frequency.
#     This will define a symbol, F_USB, in all source code files equal to the
#     input clock frequency (before any prescaling is performed) in Hz. This value may
#     differ from F_CPU if prescaling is used on the latter, and is required as the
#     raw input clock is fed directly to the PLL sections of the AVR for high speed
#     clock generation for the USB and other AVR subsections. Do NOT tack on a 'UL'
#     at the end, this will be done automatically to create a 32-bit value in your
#     source code.
#
#     If no clock division is performed on the input clock inside the AVR (via the
#     CPU clock adjust registers or the clock division fuses), this will be equal to F_CPU.
F_USB = $(F_CPU)

# Interrupt driven control endpoint task(+60)
OPT_DEFS += -DINTERRUPT_CONTROL_ENDPOINT


# Boot Section Size in *bytes*
OPT_DEFS += -DBOOTLOADER_SIZE=4096


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

## 晶片型號

首先確認 `MCU = atmega32u4` 這行。請將 `=` 右側改成你實際使用的微控制器晶片型號。例如我使用的 Pro Micro 是 ATmega32U4，所以就是 `MCU = atmega32u4` 每錯。

QNK支援的晶片型號可以參考[這裡](https://docs.qmk.fm/#/compatible_microcontrollers)。

## 晶片頻率

再來是`F_CPU = 16000000`這行。請確認你的晶片的操作頻率是多少。如果是 Pro Micro 的話主要有 16MHz 和 8MHz 兩種型號，要分清楚。

我的 Pro Micro 是 8MHz 的，所以要將原本代表 16MHz 的 `F_CPU = 16000000` 改成 8MHz：`F_CPU = 8000000`。

## 選擇 Bootloader

然後是要選擇晶片的 Bootloader 種類，這個部分原本的 `rules.mk` 裡面沒有，要自己加入。你可以把它加在`F_CPU = `的下面（位置其實沒什麼差別）。要加入的內容為：

```mk
# Bootloader selection
#   Teensy       halfkay
#   Pro Micro    caterina
#   Atmel DFU    atmel-dfu
#   LUFA DFU     lufa-dfu
#   QMK DFU      qmk-dfu
#   ATmega32A    bootloadHID
#   ATmega328P   USBasp
BOOTLOADER = caterina
```

至於 `BOOTLOADER = caterina` 這行，請依照你的晶片去做選擇，可以選就是上面那一段說寫的。例如是用 Teensy 開發板的話，就是打 `BOOTLOADER = halfkay`。因為我是用 Pro Micro，對照後可以發現是要打`BOOTLOADER = caterina`。

QMK的相關說明可以看[這裡](https://docs.qmk.fm/#/flashing?id=caterina)。

> 我在這一步卡了好久，上網找問題找了好久才發現這個地方要注意。

## 啓用 VIA（非必要）

你可以在 `rules.mk` 中加入 `VIA_ENABLE = yes` 以啓用 [VIA](https://caniusevia.com/) 功能。你可以把這行加在 `# Build Options` 區塊的最下面。

這不是必要的功能，但很推薦。VIA 可以讓你不用重新編譯和燒錄 QMK 就可以改變按鍵功能（鍵映射，Keymap），現在多數的自製鍵盤都會使用此功能。

QMK 與 VIA 的相關說明可以看[這裡](https://docs.keeb.io/via)。

## rules.mk 修改完成

修改rules.mk的部分大概就是這些，裡面還有更多的設定可以調整，這裡就不細講了。

**修改完**的 `rules.mk` 長這樣：

```mk
# MCU name
MCU = atmega32u4

# Processor frequency.
#     This will define a symbol, F_CPU, in all source code files equal to the
#     processor frequency in Hz. You can then use this symbol in your source code to
#     calculate timings. Do NOT tack on a 'UL' at the end, this will be done
#     automatically to create a 32-bit value in your source code.
#
#     This will be an integer division of F_USB below, as it is sourced by
#     F_USB after it has run through any CPU prescalers. Note that this value
#     does not *change* the processor frequency - it should merely be updated to
#     reflect the processor speed set externally so that the code can use accurate
#     software delays.
F_CPU = 8000000

# Bootloader selection
#   Teensy       halfkay
#   Pro Micro    caterina
#   Atmel DFU    atmel-dfu
#   LUFA DFU     lufa-dfu
#   QMK DFU      qmk-dfu
#   ATmega32A    bootloadHID
#   ATmega328P   USBasp
BOOTLOADER = caterina

#
# LUFA specific
#
# Target architecture (see library "Board Types" documentation).
ARCH = AVR8

# Input clock frequency.
#     This will define a symbol, F_USB, in all source code files equal to the
#     input clock frequency (before any prescaling is performed) in Hz. This value may
#     differ from F_CPU if prescaling is used on the latter, and is required as the
#     raw input clock is fed directly to the PLL sections of the AVR for high speed
#     clock generation for the USB and other AVR subsections. Do NOT tack on a 'UL'
#     at the end, this will be done automatically to create a 32-bit value in your
#     source code.
#
#     If no clock division is performed on the input clock inside the AVR (via the
#     CPU clock adjust registers or the clock division fuses), this will be equal to F_CPU.
F_USB = $(F_CPU)

# Interrupt driven control endpoint task(+60)
OPT_DEFS += -DINTERRUPT_CONTROL_ENDPOINT


# Boot Section Size in *bytes*
OPT_DEFS += -DBOOTLOADER_SIZE=4096


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
VIA_ENABLE = yes
```

# 修改 config.h（改腳位）

在與 `rules.mk` 相同路徑下有個 `config.h` 檔案，裡面可以修改腳位、名稱等。使用文字編輯軟體打開它。

## 修改名稱

在 `config.h` 裡有以下這幾行：

```c
#define MANUFACTURER    qmkbuilder
#define PRODUCT         keyboard
#define DESCRIPTION     Keyboard
```

- `MANUFACTURER` 後面可以打上開發者的名字。
- `PRODUCT` 後面可以打上鍵盤的名稱。
- `DESCRIPTION` 後可以打上簡短的敘述。

例如我可以改成：

```c
#define MANUFACTURER    ZiTe
#define PRODUCT         KeyPad
#define DESCRIPTION     QMK keyboard firmware for KeyPad
```

## 修改腳位

在 `config.h` 裡有以下這幾行，可以用來修改晶片腳位。

```c
#define MATRIX_ROW_PINS { B0, B1, B2, B3, B4 }
#define MATRIX_COL_PINS { B5, B6, B7, C0 }
```

# 修改 keymap.c（重要）

在解壓縮資料夾 `\qmk_firmware\keyboards\kb\keymaps\default` 底下，有個 `keymap.c` 檔案，這是用來指定按鍵功能（鍵映射）的，使用文字編輯軟體打開它。

## 刪除 even

首先找到 `keyevent_t event = record->event;` 這一行（例如我的在[這裡](https://gist.github.com/ziteh/1a6945bf7b2cd35280cdcebd15a9fb51#file-source-keymap-c-L120)），在它前面加上2個斜線`/`（主要斜線反向）把它註解掉，也就是把該區塊變成：

```c
const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {
  //keyevent_t event = record->event;

  switch (id) {

  }
  return MACRO_NONE;
}
```

這一行會造成編譯時的錯誤，上網找答案後看到[這篇](https://www.reddit.com/r/olkb/comments/72f66p/qmk_issue_error_unused_variable_event/)，所以最後決定就直接把它註解掉。

如果你願意的話，可以在該行加上一點提醒會比較好，也就是將該區塊變成：

```c
const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {
  //keyevent_t event = record->event;  // This will cause an error when compile

  switch (id) {

  }
  return MACRO_NONE;
}
```

## 改按鍵

在上一篇有提到 Keyboard Firmware Builder 裡的「KEYMAP」標籤頁可以設定的按鍵並不完全，如果想要自行修改的話就要再此編輯。

在 `keymap.c` 裡你會看到許多像是這樣的內容：

```c
KEYMAP(
	KC_NLCK, KC_SLSH, KC_ASTR, KC_MINS,
	KC_P7, KC_P8, KC_F9,
	KC_P4, KC_P5, KC_P6, KC_PLUS,
	KC_P1, KC_P2, KC_P3,
	KC_P0, MO(1), KC_PENT),

KEYMAP(
	KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
	KC_H, KC_MS_U, KC_J,
	KC_MS_L, KC_TRNS, KC_MS_UR, KC_TRNS,
	KC_B, KC_MS_D, KC_D,
	KC_A, KC_TRNS, KC_TRNS),
```

這些就代表了鍵盤各個鍵位的按鍵功能。像是 `KC_P7` 代表了 <kbd>Numpad7</kbd>（數字鍵盤的 7），而詳細的按鍵名稱請參考 QMK 的說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。

你所需要做的就是把該按鍵的代號（如 `KC_P7`）放在對的位置就好了。而每一塊
```c
KEYMAP(
	KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
	KC_H, KC_MS_U, KC_J,
	KC_MS_L, KC_TRNS, KC_MS_UR, KC_TRNS,
	KC_B, KC_MS_D, KC_D,
	KC_A, KC_TRNS, KC_TRNS),
```
代表的是一層，最上面的是第 0 層，往下是第 1、2... 層。

# 結語

到此為止，QMK 韌體原始檔的基本編輯就完成了。

接下來請見下一篇文章：[\[自製QMK鍵盤-3\] 編譯並燒錄QMK](/2020/06/diyqmkkeyboard-3/)。

# 相關文章與資源

* [\[系列文章\] 自製QMK鍵盤](/categories/自製QMK鍵盤/)
* 參考資料
	* [RESET key not working with pro micro #3091](https://github.com/qmk/qmk_firmware/issues/3091)
	* [QMK issue - error: unused variable 'event' \[-Werror=unused-variable\]](https://www.reddit.com/r/olkb/comments/72f66p/qmk_issue_error_unused_variable_event/)
	* [Replace Pro Micro bootloader with QMK DFU](https://www.reddit.com/r/olkb/comments/8sxgzb/replace_pro_micro_bootloader_with_qmk_dfu/)
* QMK相關
	* [QMK官方網站](https://qmk.fm/)
	* [QMK官方說明文件](https://docs.qmk.fm/#/)
	* [QMK的GitHub](https://github.com/qmk/qmk_firmware)
