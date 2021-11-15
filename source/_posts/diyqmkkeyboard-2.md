title: '[自製QMK鍵盤-2] 手動編輯QMK韌體原始檔'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
categories: []
date: 2020-06-21 10:28:00
---
# 前言

會來到這一篇文章代表你是不辛的，因為接下來的步驟可麻煩了；但同時也是幸運的，因為即使艱苦，前人也已經盡可能地鋪設好道路和指示，你只需要勇敢且小心地往前跨步就行了。

<!--more-->

# 前期準備

接下來的步驟會需要編寫程式碼，請確保你的電腦裝有一個好用的文字編輯軟體（記事本？建議不要）。我自己是使用GitHub開發的的[Atom](https://atom.io/)，或是你可以參考[QMK的建議](https://docs.qmk.fm/#/newbs_getting_started?id=text-editor)。

還記得[上一篇文章](/2020/06/diyqmkkeyboard-1/)中，最後從Keyboard Firmware Builder的「COMPILE」標籤頁下載的[.zip檔](/2020/06/diyqmkkeyboard-1/#編譯)嗎？請把它解壓縮。

# 修改rules.mk（使用Pro Micro請注意）

在解壓縮資料夾\qmk_firmware\keyboards\kb底下，找到檔案rules.mk。使用你準備好的文字編輯軟體打開它。

我的rules.mk長這樣：

<script src="https://gist.github.com/ZiTe-H/1a6945bf7b2cd35280cdcebd15a9fb51.js?file=(source)rules.mk"></script>

## 晶片型號

首先確認`MCU = atmega32u4`這行（我的[第2行](https://gist.github.com/ZiTe-H/1a6945bf7b2cd35280cdcebd15a9fb51#file-source-rules-mk-L2)），如果你的晶片是ATmega32U4（如Pro Micro）的話那`MCU = atmega32u4`是正確的，如果不是的話請改成你的晶片型號。QNK支援的晶片型號可以參考[這裡](https://docs.qmk.fm/#/compatible_microcontrollers)。

## 晶片頻率

再來是`F_CPU = 16000000`這行（我的[第15行](https://gist.github.com/ZiTe-H/1a6945bf7b2cd35280cdcebd15a9fb51#file-source-rules-mk-L15)），請確認你的晶片的操作頻率是多少。如果是Pro Micro的話主要有16MHz和8MHz兩種型號，要分清楚。

我的Pro Micro是8MHz的，所以要將原本代表16MHz的`F_CPU = 16000000`改成8MHz：`F_CPU = 8000000`。

## 選擇Bootloader

然後是要選擇晶片的Bootloader種類，這個部分原本的rules.mk裡面沒有，要自己加入。你可以把它加在`F_CPU = `的下面（位置其實沒什麼差別）。要加入的內容為：

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

至於`BOOTLOADER = caterina`這行，請依照你的晶片去做選擇，可以選就是上面那一段說寫的。例如是用Teensy開發板的話，就是打`BOOTLOADER = halfkay`。因為我是用Pro Micro，對照後可以發現是要打`BOOTLOADER = caterina`。（我在這一步卡了好久，上網找問題找了好久才發現這個地方要注意。）

QMK的相關說明可以看[這裡](https://docs.qmk.fm/#/flashing?id=caterina)。

## rules.mk修改完成

修改rules.mk的部分大概就是這些，裡面還有更多的設定可以調整，這裡就不細講了。可以參考我[修改完的rules.mk](https://gist.github.com/ZiTe-H/1a6945bf7b2cd35280cdcebd15a9fb51#file-edited-rules-mk)

# 修改config.h（改腳位）

在與rules.mk相同路徑下有個config.h檔案，裡面可以修改腳位、名稱等。使用文字編輯軟體打開它。

## 修改名稱

在config.h裡有以下這幾行：
```c
#define MANUFACTURER    qmkbuilder
#define PRODUCT         keyboard
#define DESCRIPTION     Keyboard
```

其中MANUFACTURER後面可以打上開發者的名字；PRODUCT後面可以打上鍵盤的名稱；DESCRIPTION後可以打上簡短的敘述。

例如我可以改成：
```c
#define MANUFACTURER    ZiTe
#define PRODUCT         KeyPad
#define DESCRIPTION     QMK keyboard firmware for KeyPad
```

## 修改腳位

在config.h裡有以下這幾行，可以用來修改晶片腳位。
```c
#define MATRIX_ROW_PINS { B0, B1, B2, B3, B4 }
#define MATRIX_COL_PINS { B5, B6, B7, C0 }
```

# 修改keymap.c（重要）

在解壓縮資料夾\qmk_firmware\keyboards\kb\keymaps\default底下，有個keymap.c檔案，這是用來指定按鍵功能（鍵映射）的，使用文字編輯軟體打開它。

## 刪除even

首先找到`keyevent_t event = record->event;`這一行（例如我的在[這裡](https://gist.github.com/ZiTe-H/1a6945bf7b2cd35280cdcebd15a9fb51#file-source-keymap-c-L120)），在它前面加上2個「/」，也就是把該區塊變成：
```c
const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {
//	keyevent_t event = record->event;

	switch (id) {

	}
	return MACRO_NONE;
}
```

這一行會造成編譯時的錯誤，雖然我其實不確定這行是做什麼的，但上網找答案後看到[這篇](https://www.reddit.com/r/olkb/comments/72f66p/qmk_issue_error_unused_variable_event/)，所以最後決定就直接把它註解掉。如果你願意的話，可以在該行加上一點提醒會比較好，也就是將該區塊變成：
```c
const macro_t *action_get_macro(keyrecord_t *record, uint8_t id, uint8_t opt) {
//	keyevent_t event = record->event;  // This will cause an error whent compile

	switch (id) {

	}
	return MACRO_NONE;
}
```

## 改按鍵

在上一篇有提到Keyboard Firmware Builder裡的「KEYMAP」標籤頁可以設定的按鍵並不完全，如果想要自行修改的話就要再此編輯。

在keymap.c裡你會看到許多像是這樣的內容：
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

這些就代表了鍵盤各個鍵位的按鍵功能。像是`KC_P7`代表了<kbd>Numpad7</kbd>（數字鍵盤的7），而詳細的按鍵名稱請參考QMK的說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。

你所需要做的就是把該按鍵的代號（如`KC_P7`）放在對的位置就好了。而每一塊
```c
KEYMAP(
	KC_TRNS, KC_TRNS, KC_TRNS, KC_TRNS,
	KC_H, KC_MS_U, KC_J,
	KC_MS_L, KC_TRNS, KC_MS_UR, KC_TRNS,
	KC_B, KC_MS_D, KC_D,
	KC_A, KC_TRNS, KC_TRNS),
```
代表的是一層，最上面的是第0層，往下是第1、2...層。

# 結語

到此為止，QMK韌體的基本編輯就完成了，檔艱辛的路途還有一半。

接下來請見下一篇文章：[\[自製QMK鍵盤-3\] 編譯並燒錄QMK](/2020/06/diyqmkkeyboard-3/)。

# 相關文章與資源

* [\[系列文章\] 自製QMK鍵盤](/pages/serial/s-diysnmkeyboard.html)
* 參考資料
	* [RESET key not working with pro micro #3091](https://github.com/qmk/qmk_firmware/issues/3091)
	* [QMK issue - error: unused variable 'event' \[-Werror=unused-variable\]](https://www.reddit.com/r/olkb/comments/72f66p/qmk_issue_error_unused_variable_event/)
	* [Replace Pro Micro bootloader with QMK DFU](https://www.reddit.com/r/olkb/comments/8sxgzb/replace_pro_micro_bootloader_with_qmk_dfu/)
* QMK相關
	* [QMK官方網站](https://qmk.fm/)
	* [QMK官方說明文件](https://docs.qmk.fm/#/)
	* [QMK的GitHub](https://github.com/qmk/qmk_firmware)