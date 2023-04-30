---
title: '[自製QMK鍵盤-番外] QMK的基本架構與運作方式'
author: ZiTe
tags:
  - 3C
  - DIY
  - 教學
  - QMK
series: ["自製QMK鍵盤"]
date: 2020-06-23 23:53:00
comment: true
toc: true
draft: false
aliases: ["/2020/06/diyqmkkeyboard-4/", "/posts/diyqmkkeyboard-4/"]
---

如果要深入修改 QMK 的話，最好還是要瞭解一下 QMK 的架構及其運作方式。這可能會有點無聊，但擁有足夠的知識總是可以讓我們少走一點冤枉路。

以下內容皆譯自[ QMK 官方說明文件](https://docs.qmk.fm/#/)。我並沒有完全翻譯，只有翻譯其中比較重要的部分內容。如有翻譯錯誤還請指教，並以 QMK 官方文件為準。

<!--more-->

# 鍵盤的運作
本節內容譯自 QMK 官方說明文件：[How Keys Are Registered, and Interpreted by Computers](https://docs.qmk.fm/#/how_keyboards_work)。

## 1.按下按鍵
當使用者按下一個按鍵時，鍵盤的韌體就會登記一個事件。該事件可以在按下（pressed）、按住（held）或釋放（released）時被登記。

這些事通常在定期的鍵盤掃描中發生，其速度通常受限於機械鍵軸的反映時間、傳輸按鍵的協定（在這裡指USB HID）和使用的軟體。

## 2.韌體傳送了什麼
[HID](https://www.usb.org/sites/default/files/documents/hut1_12v2.pdf)規範了鍵盤可以透過USB發送、且有機會被正確識別的內容。這包含了掃描碼（scancodes）的預定義列表（pre-defined list），這些掃描碼是從`0x00`到`0xE7`（0到231）的簡單數字。韌體將掃描碼分配給鍵盤的每個鍵。

韌體並不會直接傳送實際的字母或字符，只會傳送掃描碼。所以修改韌體時，你只能修改通過USB傳送的按鍵掃描碼。

## 3.輸入事件/內核的作用
掃描碼映射（mapped）到依賴於[ 60-keyboard.hwdb](https://github.com/systemd/systemd/blob/master/hwdb.d/60-keyboard.hwdb)的鍵碼（Keycode）。如果沒有此映射關係，作業系統無法收到有效的鍵碼，也無法對該按鍵執行任何有用的操作。

## 4.作業系統做了什麼
當鍵碼傳送到作業系統時，某個軟體會依照鍵盤佈局（Layout）來配對一個字符。例如QWERTY佈局的配對表如下：

鍵碼|字符
-|-
0x04|a/A
0x05|b/B
0x06|c/C
...|...
0x1C|y/y
0x1D|z/Z
...|...

# 鍵盤項目結構
本節內容譯自QMK官方說明文件：[Introduction](https://docs.qmk.fm/#/getting_started_introduction)。

在`keyboards`資料夾裡，每個鍵盤項目都會有類似以下的架構：
* keymaps資料夾: 可以建構的不同的按鍵映射（Keymap）。
	* keymap.c：按鍵映射的程式。必填。
	* config.h: 此按鍵映射的設定。
	* rules.mk: 啟用的QMK功能。
	* readme.md: 此按鍵映射的說明。
* rules.mk: 設定預設的「make」設定。
* config.h: 設定預設的編譯設定。
* info.json: 給[QMK Configurator](https://config.qmk.fm/#/)用的鍵盤佈局（Layout）設定。更詳細的說明請看：[Supporting Your Keyboard in QMK Configurator](https://docs.qmk.fm/#/reference_configurator_support)。
* readme.md: 該鍵盤的簡要說明。
* \<keyboardName\>.h: 根據鍵盤的按鍵矩陣（Switch matrix）來定義鍵盤佈局位置。
* \<keyboardName\>.c: 可以在此檔案中增加自定義的功能程式。

更詳細的結構介紹可以看QMK官方說明文件：[QMK Keyboard Guidelines](https://docs.qmk.fm/#/hardware_keyboard_guidelines)。

# 瞭解QMK的程式碼
本節內容譯自QMK官方說明文件：[Understanding QMK’s Code](https://docs.qmk.fm/#/understanding_qmk?id=process-record)。

## 開始
你可以認為QMK和任何其它的電腦程式沒有什麼不同。它開始、執行、然後結束。

和一般的C語言程式一樣，QMK的進入點是`main()`函數，但是對於不熟悉QMK的人來說可能會有點混亂，因為`main()`函數不只出現在一個地方，會不知道要看哪一個。

這是因為QMK支援的平台不同，最常見的平台是「[lufa](https://github.com/abcminiuser/lufa)（Lightweight USB Framework for AVRs）」，它運作在如ATmega32U4這樣的AVR微控制器（處理機，Processors）上。其它還有「chibios」和「vusb」。

以下將重點放在使用「lufa」平台上的AVR微控制器。你可以在[tmk_core/protocol/lufa/lufa.c](https://github.com/qmk/qmk_firmware/blob/e1203a222bb12ab9733916164a000ef3ac48da93/tmk_core/protocol/lufa/lufa.c#L1028)中找到`main()`函數。瀏覽該函數可以發現它會初始化已配置的硬體（包含了主機的USB），然後在[`while(1)`](https://github.com/qmk/qmk_firmware/blob/e1203a222bb12ab9733916164a000ef3ac48da93/tmk_core/protocol/lufa/lufa.c#L1069)中開始核心的部分。這是所謂的「主迴圈（Main loop）」。

## 主迴圈

主迴圈的程式負責永遠地重複執行同一組指令。這是QMK分配令鍵盤執行它應該做的所有事情的地方。雖然它看起來包含了很多功能，但多數情況下它們會被`#define`給禁用（disable）。

`keyboard_task()`函數負責調度所有的鍵盤功能。其原始碼可在[tmk_core / common / keyboard.c](https://github.com/qmk/qmk_firmware/blob/e1203a222bb12ab9733916164a000ef3ac48da93/tmk_core/common/keyboard.c#L216)中找到，它負責檢測鍵盤矩陣的變化和各狀態LED燈的亮滅。

在`keyboard_task()`函數中，你可以找到要處理的程式碼：
* 矩陣掃描
* 處理滑鼠
* 串列連接
* 可視化器
* 鍵盤狀態LED燈（大寫鎖定、數字鎖定和滾動鎖定（Scroll Lock））


### 矩陣掃描

矩陣掃描（Matrix scanning）是鍵盤韌體的核心功能。這是檢測目前按下了那些按鍵的過程，鍵盤每秒鐘都會執行很多次此功能。不誇張地說，韌體有99%的CPU時間都在做矩陣掃描。

實際執行矩陣掃描有很多種不同的策略，但已超出本文的範圍，在此就當它是一個黑盒子就好。你會要求矩陣提供目前的狀態，並得到如以下的數據結構：

```c
{
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0}
}
```

此數據結構是一個4×5（4 row by 5 column）的數字鍵盤矩陣。一個鍵按下後，該鍵在矩陣中的位置會回傳`1`而不是`0`。

矩陣掃描的精確速度並不一定，但通常每秒至少執行10次，以避免明顯的延遲（lag）。


#### 矩陣到物理佈局映射

一旦得知鍵盤上每個按鍵的狀態，就必須將其映射（map）到鍵碼（Keycode）。在QMK中，這是透過C語言的巨集（macro）來完成的，這讓我們可以將物理佈局和鍵碼定義分開來。如果你不是很熟係C語言的巨集功能，[這篇文章](http://catforcode.com/define-and-macro/)或許可以幫助到你。

在鍵盤層次，我們定義一個C語言的巨集（通常命名為`LAYOUT()`）以將鍵盤的矩陣映射到物理按鍵。有時矩陣中不是每一個位置都有按鍵，我們可以透過填上`KC_NO`來使鍵盤映射的定義更容易使用。

這是一個數字鍵盤的`LAYOUT()`巨集範例：

```c
#define LAYOUT( \
    k00, k01, k02, k03, \
    k10, k11, k12, k13, \
    k20, k21, k22, \
    k30, k31, k32, k33, \
    k40,      k42 \
) { \
    { k00, k01, k02, k03, }, \
    { k10, k11, k12, k13, }, \
    { k20, k21, k22, KC_NO, }, \
    { k30, k31, k32, k33, }, \
    { k40, KC_NO, k42, KC_NO } \
}
```

請注意該`LAYOUT()`巨集的第二區塊（block）是如何與上面的「矩陣掃描」做匹配的？該巨集將矩陣掃描映射到鍵碼。但是數字鍵盤只有17鍵，會有3個鍵的位置在矩陣上可以有、但實際上並沒有按鍵。我們在其位置填上`KC_NO`，因為它們在鍵盤映射定義中不是必須要的。

你也可以利用此巨集來處理不常見的矩陣佈局，例如[Clueboard rev2](https://github.com/qmk/qmk_firmware/blob/e1203a222bb12ab9733916164a000ef3ac48da93/keyboards/clueboard/66/rev2/rev2.h)。在此不為其多做說明。

#### 鍵碼分配
在鍵盤映射層次，我們利用上面的`LAYOUT()`巨集將鍵碼映射到物理位置，再映射到矩陣位置。像是這樣：

```c
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
[0] = LAYOUT(
  KC_NLCK, KC_PSLS, KC_PAST, KC_PMNS, \
  KC_P7,   KC_P8,   KC_P9,   KC_PPLS, \
  KC_P4,   KC_P5,   KC_P6, \
  KC_P1,   KC_P2,   KC_P3,   KC_PENT, \
  KC_P0,            KC_PDOT)
}
```

請注意這些引數（Argument）是如何與`LAYOUT()`巨集的前半部分匹配的？這就是取得鍵碼並映射到矩陣掃描的方法。

我們在`const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS]`呼叫了`LAYOUT()`巨集，並傳遞如以下的引數給`LAYOUT()`巨集：

|         |         |         |         |
|---------|---------|---------|---------|
| KC_NLCK | KC_PSLS | KC_PAST | KC_PMNS |
| KC_P7   | KC_P8   | KC_P9   | KC_PPLS |
| KC_P4   | KC_P5   | KC_P6   |         |
| KC_P1   | KC_P2   | KC_P3   | KC_PENT |
| KC_P0   |         | KC_PDOT |         |

以上這些引數傳遞進`LAYOUT()`巨集後，一一對應了`LAYOUT()`巨集的前半部分，也就是：

|     |     |     |     |
|-----|-----|-----|-----|
| k00 | k01 | k02 | k03 |
| k10 | k11 | k12 | k13 |
| k20 | k21 | k22 |     |
| k30 | k31 | k32 | k33 |
| k40 |     | k42 |     |

接著`LAYOUT()`巨集開始動作，也就是進行「替換」。它將傳遞給它的引數對應其前半部分的參數（Parameter）名稱，並將`LAYOUT()`巨集的後半部分「替換」成各自對應的引數。

例如在`LAYOUT()`巨集的前半部分中，引數`KC_NLCK`的位置對應了參數名`k00`，那麼在`LAYOUT()`巨集後半部分的`k00`就會被替換成`KC_NLCK`。

以下是`LAYOUT()`巨集的後半部分，請注意我特別標示成斜體的*KC_NO*在什麼位置。

|     |       |     |       |
|-----|-------|-----|-------|
| k00 | k01   | k02 | k03   |
| k10 | k11   | k12 | k13   |
| k20 | k21   | k22 | *KC_NO* |
| k30 | k31   | k32 | k33   |
| k40 | *KC_NO* | k42 | *KC_NO* |

當`LAYOUT()`巨集完成所有的替換工作後，它會回傳如以下的內容：

|         |         |         |         |
|---------|---------|---------|---------|
| KC_NLCK | KC_PSLS | KC_PAST | KC_PMNS |
| KC_P7   | KC_P8   | KC_P9   | KC_PPLS |
| KC_P4   | KC_P5   | KC_P6   | *KC_NO*   |
| KC_P1   | KC_P2   | KC_P3   | KC_PENT |
| KC_P0   | *KC_NO*   | KC_PDOT | *KC_NO*   |

以上為了方便理解，所以我使用表格的方式表示，但實際情況會更加類似以下：

傳入`LAYOUT()`巨集的引數為：

![](https://1.bp.blogspot.com/-Eh75tH4zEmg/XvK8bBXn6qI/AAAAAAAACiw/Y3g378GMICIR1w71Brk4mAN94EYH3GnGgCK4BGAsYHg/w2383-h208/%25E6%2589%25B9%25E6%25B3%25A8%2B2020-06-24%2B103457.png)

以上的引數透過位置來對應到以下`LAYOUT()`巨集的前半部分。

|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| k00 | k01 | k02 | k03 | k10 | k11 | k12 | k13 | k20 | k21 | k22 | k30 | k31 | k32 | k33 | k40 | k42 |

以上`LAYOUT()`巨集的前半部分透過名稱（如`k00`）來對應到以下的`LAYOUT()`巨集後半部分。

|     |       |     |       |
|-----|-------|-----|-------|
| k00 | k01   | k02 | k03   |
| k10 | k11   | k12 | k13   |
| k20 | k21   | k22 | *KC_NO* |
| k30 | k31   | k32 | k33   |
| k40 | *KC_NO* | k42 | *KC_NO* |

當巨集完成替換後會變成像這樣：

|         |         |         |         |
|---------|---------|---------|---------|
| KC_NLCK | KC_PSLS | KC_PAST | KC_PMNS |
| KC_P7   | KC_P8   | KC_P9   | KC_PPLS |
| KC_P4   | KC_P5   | KC_P6   | *KC_NO*   |
| KC_P1   | KC_P2   | KC_P3   | KC_PENT |
| KC_P0   | *KC_NO*   | KC_PDOT | *KC_NO*   |

#### 檢測狀態變化
上面講述了矩陣掃描可以告訴我們某一時刻的矩陣狀態，但是電腦只想知道狀態的變化，而不是目前的狀態。QMK會儲存最後一次矩陣掃描的結果，並透過比較來確認何時按下或釋放了什麼按鍵。

以下舉例在鍵盤掃描中，之前的掃描看起來是這樣：
```c
{
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0}
}
```

然後等目前的掃描結束後，新的掃描結果是這樣：
```c
{
    {1,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0}
}
```
透過比對鍵盤映射，我們知道按下的按鍵是`KC_NLCK`。這裡我們調用`process_record`函數集。

#### Process Record
`process_record()` 是通往 QMK 各個層級功能的入口（gateway）。[這裡](https://docs.qmk.fm/#/understanding_qmk?id=process-record)列出了一系列的事件與詳細的介紹。

# 相關文章與資源

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [【C/C++】define用法整理|macro巨集小技巧](http://catforcode.com/define-and-macro/)
- QMK相關
	- [QMK官方網站](https://qmk.fm/)
	- [QMK官方說明文件](https://docs.qmk.fm/#/)
		- [How Keys Are Registered, and Interpreted by Computers](https://docs.qmk.fm/#/how_keyboards_work)
		- [Introduction](https://docs.qmk.fm/#/getting_started_introduction)
		- [Understanding QMK’s Code](https://docs.qmk.fm/#/understanding_qmk?id=process-record)
	- [QMK的GitHub](https://github.com/qmk/qmk_firmware)
