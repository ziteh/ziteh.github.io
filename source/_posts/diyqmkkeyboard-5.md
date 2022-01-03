title: '[自製QMK鍵盤-5] 旋轉編碼器 (Encoder)'
author: ZiTe
tags:
  - 3C
  - DIY
  - 教學
categories:
  - 自製QMK鍵盤
date: 2020-11-21 17:39:00
---
![](https://1.bp.blogspot.com/--DVn7BXoSVM/X7jhXa4wzwI/AAAAAAAACrk/5-7dhQnH1kgKadvIJFRDvJypUmhe44QUACPcBGAsYHg/w640-h480/DSC_0020.JPG)

# 前言

在這之前的文章中我們已經完成了 QMK 的基本操作，已經可以作出一個基本鍵盤。

不過我想做的鍵盤並不是普通的鍵盤，畢竟若是如此也不用自己研究 QMK 了。因此我的鍵盤會在加上許多不同的功能，而第一個功能，也是很多鍵盤上可以看到的功能——旋轉編碼器（Encoder，以下簡稱編碼器）。編碼器最常見的地方就是滑鼠的滾輪，它可以朝兩個不同的方向無限地一直旋轉下去，用在音量調整或選單控制會非常方便。

在 QMK 中加入編碼器的功能是非常簡單的，只需要多加幾行程式碼就可以。

<!--more-->

# 修改程式碼

以下個步驟將示範爲 QMK 加入編碼器的程式。詳細可以參考 [QMK 官方文件-Encoder](https://docs.qmk.fm/#/feature_encoders)。

## 修改 rules.mk

首先要在 `rules.mk` 檔案中啓用編碼器。在該檔案中加入以下之程式碼:

```mk
ENCODER_ENABLE = yes  # 致能編碼器
```

## 修改 config.h

接著要定義腳位。每個編碼器都有 2 隻腳（通常分別稱爲 A 腳與 B 腳）需要接到你的微控制器（開發板）上。在 `config.h` 中加入以下之程式碼：

```c
// 編碼器接腳定義
#define ENCODERS_PAD_A { B12 }
#define ENCODERS_PAD_B { B13 }
```

如果你需要使用多個編碼器的話，可以像下面這樣來編輯。如果這樣打的話，就是第一個編碼器的 A 腳接到微控制器的 B12 腳、B 腳接到 B13 腳；第二個編碼器的 A 腳接到微控制器的 D1 腳、B 腳接到 D2 腳。要加入更多的編碼器就以此類推。

```c
// 多個編碼器接腳定義
#define ENCODERS_PAD_A { B12, D1 }
#define ENCODERS_PAD_B { B13, D2 }
```

如果你想法改變編碼器的旋轉方向的話，可以透過互換 A、B 兩腳的接腳定義，或是加上這一含程式：

```c
// 反轉編碼器方向
#define ENCODER_DIRECTION_FLIP
```

此外還可以改變其解析度（預設爲 4）:

```c
// 調整編碼器解析度
#define ENCODER_RESOLUTION 4
```

## 修改 keymap.c

最後要來設定觸發編碼器時要按下的按鍵，需要在 `keymap.c` 中加入該程式碼。下面程式中的 `KC_PGDN`、`KC_PGUP` 就分別是編碼器在順/逆時鐘轉動時會按下的按鍵，請自行修改成自己想要的按鍵，至於 QMK 的按鍵代碼（Keycodes）請參考[ QMK 官方文件-Keycodes](https://docs.qmk.fm/#/keycodes)。

```c
// 編碼器程式
void encoder_update_user(uint8_t index, bool clockwise) {
    if (index == 0) { /* First encoder */
        if (clockwise) {
            tap_code(KC_PGDN);
        } else {
            tap_code(KC_PGUP);
        }
    }
}
```

如果有多個編碼器的話可以這樣打：

```c
// 編碼器程式
void encoder_update_user(uint8_t index, bool clockwise) {
    if (index == 0) { /* First encoder */
        if (clockwise) {
            tap_code(KC_PGDN);
        } else {
            tap_code(KC_PGUP);
        }
    } else if (index == 1) { /* Second encoder */
        if (clockwise) {
            tap_code(KC_DOWN);
        } else {
            tap_code(KC_UP);
        }
    }
}
```

## 完成程式修改

完成修改後就可以將程式編譯、燒錄。其方法請參考[\[自製QMK鍵盤-3\] 編譯並燒錄QMK ](/2020/06/diyqmkkeyboard-3/)。

# 硬體

硬體的部分就只有接線。編碼器通常有 3 個接腳，照順序分別是 A、Gnd、B。將編碼器 Gnd 與微控制器的 Gnd 接起來，而 A、B 就接到上面在 `config.h` 中設定的腳位。這樣就完成硬體的部分了。

值得注意的是有些編碼器會整合一個按鈕，所以可能會有 5 個接腳，使用時還請確認清楚。

# 結語

這次簡單地介紹了在 QMK 中加入編碼器功能的方法，接下來我還會繼續增加更多不同零件的介紹，盡情期待。

# 相關文章與資源

* [\[系列文章\] 自製QMK鍵盤](/categories/自製QMK鍵盤/)
* QMK 相關
	* [QMK 官方網站](https://qmk.fm/)
	* [QMK 官方說明文件](https://docs.qmk.fm/#/)
	* [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)