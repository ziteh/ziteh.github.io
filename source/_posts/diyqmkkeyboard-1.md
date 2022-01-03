title: '[自製QMK鍵盤-1] 設計鍵盤佈局、按鍵功能和產生韌體原始檔'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
categories:
  - 自製QMK鍵盤
date: 2020-06-21 10:27:00
---
![](https://1.bp.blogspot.com/-e0HkQ9g2xgY/Xu47SK7X1SI/AAAAAAAACek/HbMx6Y7OE04_VbQHkZp9DKJkNiJWfnIrgCK4BGAsYHg/s1036/SNM60_Keyboard_Layout_Ver1.0.png)

# 前言

在上一篇文章（[\[自製QMK鍵盤-0\] QMK介紹與SNM鍵盤計劃](https://ziteh.github.io/2020/06/diyqmkkeyboard-0/)）中已經簡單介紹 QMK 是什麼了。

接下來，將開始實際製作 QMK 鍵盤，而這篇文章將會介紹如何設計鍵盤佈局（Layout）並產生韌體原始檔。

<!--more-->

# 編輯鍵盤佈局（Keyboard Layout Editor）

首先要設計並編輯鍵盤的佈局，也就是各個按鍵的位置和尺寸及其數量。

我們可以用線上工具 [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/) 來進行設計。

## 主頁面

進去看到的就是 Keyboard Layout Editor 的編輯頁面。
* 最上面黑色底的那邊是一些設定。
* 左上角有藍色和紅色的按鈕，可以用來增加或刪除按鍵。旁邊還有一些編輯用的操作按鈕（回上一步、回下一步、剪下、複製、貼上）。
* 畫面中間偏上就是鍵盤佈局編輯區，可以看到它現在有一個數字鍵盤。
* 畫面中間偏下是按鍵編輯區，點選按鍵後可以編輯該按鍵的各種設定與數值。

![▲ Keyboard Layout Editor的編輯頁面。](https://1.bp.blogspot.com/-tNaDVTpZNkg/Xu4t__IgDhI/AAAAAAAACcY/eLwPgAw9jpQ5hLNTgKLmSL27edMDQhYpACK4BGAsYHg/s1908/%255B01%255DKeyboard%2BLayout%2BEditor_%25E9%25A6%2596%25E9%25A0%2581.png)

最上面黑色底的那邊有個「Preset」按鈕，裡面可以匯入一些常見的鍵盤佈局，再進行修改。

![▲ 「Preset」按鈕。](https://1.bp.blogspot.com/-KJ9BtlpHxkc/Xu4uAKgEj2I/AAAAAAAACcc/_q6_t2f8k6g_b4AvA_qcbPnK92Zmme1DQCK4BGAsYHg/s704/%255B02%255DKeyboard%2BLayout%2BEditor_Preset.png)

例如以下匯入了「ANSI 104」的鍵盤佈局。

![▲ 匯入「ANSI 104」的鍵盤佈局。](https://1.bp.blogspot.com/-hGR7m05B_Bc/Xu4uASKVfNI/AAAAAAAACcg/6Y2GJFGtcH4-vNz2CK8Bv_fvCwRvAzF2wCK4BGAsYHg/s1908/%255B03%255DKeyboard%2BLayout%2BEditor_Preset-ANSI%2B104.png)

## 編輯按鍵

再來看到下方的按鍵編輯區。先點選一或多個按鍵，就可以在下方進行按鍵的設定。其中比較常用的是由上而下的1～12行，分別為：

1. Top Legend：鍵帽頂部的顯示文字，有左、中、右。
2. Center Legend：鍵帽中間的顯示文字，有左、中、右。
3. Bottom Legend：鍵帽底部的顯示文字，有左、中、右。
4. Front Legend：鍵帽前側面（側刻）的顯示文字，有左、中、右。
5. Legend Size：鍵帽顯示文字的大小。
6. Legend Color：鍵帽顯示文字的顏色。
7. Key Color：鍵帽的顏色。
8. Width：鍵帽的寬度，1代表1U。後面的第2個數字是非長方形鍵帽用的。
9. Height：鍵帽的高度，1代表1U。後面的第2個數字是非長方形鍵帽用的。
10. X：鍵帽的X軸位置。後面的第2個數字是非長方形鍵帽用的。
11. Y：鍵帽的Y軸位置。後面的第2個數字是非長方形鍵帽用的。
12. Rotation：鍵帽的旋轉角度。

![▲ 按鍵編輯區。](https://1.bp.blogspot.com/-JA0T6CoKpUQ/Xu4uAj2uGiI/AAAAAAAACck/THOzxCPzfhMyQVE-4rIkk_NK4z7BqP3JQCK4BGAsYHg/s742/%255B04%255DKeyboard%2BLayout%2BEditor_Key_Properties.png)

第1～4行的文字也可以設定各自的大小和顏色。如果要移動按鍵的話也可以通過方向鍵，這應該會比較方便。

![▲ 按鍵文字樣式。](https://1.bp.blogspot.com/-yhzg5EnWmCc/Xu4uA5Xq1KI/AAAAAAAACco/XNep3M3gpd8FtkYBbdyBcu9RMEKQlTR_ACK4BGAsYHg/s546/%255B05%255DKeyboard%2BLayout%2BEditor_Key_Properties-text.png)

下方還有許多不同的標籤頁可以進行不同的設定（如作者名字或鍵盤名稱），在此就不多做介紹。 

這裡就設計了一個 17 鍵的數字鍵盤（Numer Pab）作爲示範。

## 輸出佈局

編輯完成後就可以輸出佈局了。

選到下方的「Raw data」標籤頁。這裡可以看到文字形式的鍵盤佈局，把裡面的文字全部複製起來，下一步驟會用到。例如我這裡的文字是：

```json
["Num Lock","/","*","-"],
["7\nHome","8\n↑","9\nPgUp",{h:2},"+"],
["4\n←","5","6\n→"],
["1\nEnd","2\n↓","3\nPgDn",{h:2},"Enter"],
[{w:2},"0\nIns",".\nDel"]

```

![▲ 輸出鍵盤佈局。](https://1.bp.blogspot.com/-u-4BtExCj9Y/Xu4uBOltJ8I/AAAAAAAACcs/Gb5Yc6Tv_cg4X7R7KIMCBIi1QcFouQB0ACK4BGAsYHg/s1908/%255B06%255DKeyboard%2BLayout%2BEditor_Raw_Data.png)

另外，如果想要儲存此鍵盤佈局的話，畫面右上角有個綠色的「Download」可以下載各種圖片檔和 JSON 檔。

這個 JSON 檔其實就是上面那一串文字，它會保存各種數據，只要存下來的話下次還可以上傳此 JSON 檔來繼續編輯此鍵盤。**建議一定要儲存 JSON 檔並保管好**。

![▲ 右上角可以儲存各種格式。](https://1.bp.blogspot.com/-qydXM4etOsI/Xu4uBi6MegI/AAAAAAAACcw/MWvyrL-TyLw-v4WjefzfLY3lCcILlWP0gCK4BGAsYHg/s406/%255B07%255DKeyboard%2BLayout%2BEditor_DL_1.png)

上傳 JSON 檔的位置比較難找，在「Raw data」標籤頁的右下角有個綠色的「Upload JSON」，一旁的「Download JSON」同樣也可以下載 JSON 檔。

![▲ 在「Raw data」標籤頁的右下角可以載入JSON檔。](https://1.bp.blogspot.com/-m-eRyos_xAU/Xu4uBp2_njI/AAAAAAAACc0/gFa3j9BQlu8fIry-IRA-nLbmnpughQ60gCK4BGAsYHg/s356/%255B07%255DKeyboard%2BLayout%2BEditor_DL_2.png)

# 產生韌體原始檔（Keyboard Firmware Builder）

編輯好鍵盤佈局後，我們要開始做QMK的韌體了。

這裡我們使用 [Keyboard Firmware Builder](https://kbfirmware.com/) 線上工具。

## 讀入鍵盤

打開 Keyboard Firmware Builder 後，看到中間有一個文字框（深藍色的「Import」按鈕上面那一個），並把剛剛在 Keyboard Layout Editor 的「Raw data」標籤頁裡複製的文字貼上，按下深藍色的「Import」按鈕。 

![▲ Keyboard Firmware Builder頁面，貼上剛剛複製的鍵盤佈局內容。](https://1.bp.blogspot.com/-UTbRymD6jFo/Xu4uCFUmN4I/AAAAAAAACc4/Pun-2kS6qooDb3plao7F_e5sogqH_uHKQCK4BGAsYHg/s1903/%255B01%255DKeyboard%2BFirmware%2BBuilder_Import.png)

## 接線與鍵盤掃描矩陣（Wiring）

在標籤頁「WIRING」裡，你看到的是鍵盤的接線圖。

在這裡設定鍵盤的接線（或者說鍵盤掃描矩陣）。點選其中一個按鍵可以設定它的鍵盤掃描矩陣的行列，還有設定二極體的方向。

如果你不知道什麼是鍵盤掃描矩陣的話，建議不要亂碰，以免出問題而造成鍵盤運作不正常。

![▲ 鍵盤的接線編輯頁面。](https://1.bp.blogspot.com/-9pJYrEjmaXU/Xu4uCdp4PEI/AAAAAAAACc8/p8MMZuiSBUMSpTjsN0f0Xa78Turt48kzwCK4BGAsYHg/s1903/%255B02%255DKeyboard%2BFirmware%2BBuilder_Wiring_1.png)

![▲ 點選一個按鍵後可以編輯該鍵掃描矩陣的行列。](https://1.bp.blogspot.com/-Bx4OSDytWs8/Xu4uCq9KkdI/AAAAAAAACdA/8d4QLa2qTHMMXBS1Z6Fvma_u-Q5Ud22cgCK4BGAsYHg/s800/%255B03%255DKeyboard%2BFirmware%2BBuilder_Wiring_2.png)

## 腳位與微控制器（Pins）

在下一個標籤頁「PINS」裡，你可以設定使用的晶片型號和其腳位。

如果是使用現成的開發板（像是 Pro Micro）的話，記得要選有引出的接腳。如果該鍵盤有打算加入一些特別的功能需要特別的接腳（如 ADC 或 I2C），也不要忘記把該接腳留下。

因爲我是使用 Pro Micro 開發板，所以微控制器選擇「ATmega32U4」。

![▲ 「PINS」標籤頁。此圖中的接腳是隨意設定的，請勿直接套用。](https://1.bp.blogspot.com/-3_lDlu5GoMI/Xu4uCxknlCI/AAAAAAAACdE/4pwTfeQGe8cw8LW-L2a26VXxSf20eA3nwCK4BGAsYHg/s826/%255B04%255DKeyboard%2BFirmware%2BBuilder_Pins.png)

要注意的是這裡顯示的接腳名稱是該晶片原始定義的接腳名稱，可能會和開發板上的腳位號碼不同。

例如 Pro Micro 開發板上的「D16腳」其實是主晶片 ATmega32U4 的「PB2腳」，而在「PINS」標籤頁顯示的是「B2」也就是代表「PB2」，設定前記得看好腳位對照圖。

以下圖爲例，「PINS」中的「D0」其實是指「PD0（藍紫色）」，也就是下圖中的「D3（綠色）」。

> PB2、PD7...的 P 是指 Port，通常以 8 或 16 腳為一個 Port。  
> P 後面的英文字為Port 名，通常由 A 開始。  
> 再來的數字是腳位編號，通常由 0 開始。  
> 所以 PB2 就代表 Port-B 的 2 號腳，也就是 Port-B 的第 3 支接腳，因為 Port-B 的第一支腳是 PB0

![▲ Pro Micro的腳位圖。圖片取自SparkFun。](https://1.bp.blogspot.com/-UqmjvTbo7Uo/Xu4yajqMXKI/AAAAAAAACeE/AEfdjtlknrcRsjSYvmRz5B0IxY4RIiQegCK4BGAsYHg/s1166/ProMicroPin.png)

## 鍵映射（Keymap）

再來就是重要的「KEYMAP」標籤頁，按鍵的功能（鍵映射）會在這裡進行設定。

點選一個按鍵後，可以在下方選擇該按鍵的功能（如<kbd>A</kbd>、<kbd>Ctrl</kbd>、<kbd>Enter</kbd>...等）。

而 QMK 也可以設定「層（Layer）」在設定按鍵的上方有個數字就是顯示目前在設定的層，透過按上下來設定不同層的按鍵。

![▲ 「KEYMAP」標籤頁。](https://1.bp.blogspot.com/-bWzQzPwFGgI/Xu4uDJhvouI/AAAAAAAACdI/UTgEK0bLZWgvv2Sl1gTl3mLlCnSgn_RbACK4BGAsYHg/s1903/%255B05%255DKeyboard%2BFirmware%2BBuilder_Keymap_1.png)

如果你在 Keyboard Layout Editor 有設定好各個按鍵的名稱的話，它會自動讀入按鍵的功能，如果沒有的話就再慢慢改吧。

QMK 可以設定的按鍵請看說明文件：[Keycodes Overview](https://docs.qmk.fm/#/keycodes?id=keycodes-overview)。但你可能會發現這裡可以設定的按鍵並不完全，很多在「Keycodes Overview」裡面有的按鍵這裡都沒有，關於這點之後會講到。

如果要使用層的功能的話，可以參考說明文件：[Keycodes Overview-Layer Switching](https://docs.qmk.fm/#/keycodes?id=layer-switching)

![▲ 其中一種切換層的按鍵設定。](https://1.bp.blogspot.com/-AXyTVOereYY/Xu4uDQIikrI/AAAAAAAACdM/ZKoLu2A_TsMjSCcAAJVC_-EHaGEJ9w3agCK4BGAsYHg/s800/%255B06%255DKeyboard%2BFirmware%2BBuilder_Keymap_2.png)

![▲ 不同層可以設定不同的按鍵功能更。](https://1.bp.blogspot.com/-d9DCcztZXjQ/Xu4uD44T8EI/AAAAAAAACdQ/Zq8zndxEDWsZRd3Qud_NiWASE6bDZVgkwCK4BGAsYHg/s1903/%255B07%255DKeyboard%2BFirmware%2BBuilder_Keymap_3.png)

## 巨集鍵和量子功能（Macros & Quantum）

在「MACROS」標籤頁裡，你可以設定巨集鍵功能。

而在「QUANTUM」標籤頁裡，可以設定QMK特有的「量子（QUANTUM）」功能。至於量子功能是什麼呢，待未來有機會在做介紹。

這裡的設定如果你不確定是什麼的話，就不要動它，尤其是「QUANTUM」標籤頁。

![▲ 「MACROS」標籤頁。](https://1.bp.blogspot.com/-6UmwdSv5mYk/Xu4uEFGPrgI/AAAAAAAACdU/QbZ_V0elfsM458VOkhnI7aTYoktUyzVBACK4BGAsYHg/s800/%255B08%255DKeyboard%2BFirmware%2BBuilder_Macros.png)

![▲ 「QUANTUM」標籤頁。](https://1.bp.blogspot.com/-3JK9VPepotg/Xu4uEYvZriI/AAAAAAAACdY/I4z4ycD-A_YLnDOm35iWjq46P1dw1WPPQCK4BGAsYHg/s800/%255B09%255DKeyboard%2BFirmware%2BBuilder_Quantum.png)

## 設定（Settings）

在標籤頁「SETTINGS」裡可以設定一些額外的東西。有佈局名稱、Bootloader 大小、WS2812 LED 燈、背光等級。

![▲ 「SETTINGS」標籤頁。](https://1.bp.blogspot.com/-Vdfp-gzx0uQ/Xu4uEo34ilI/AAAAAAAACdc/sRvlviZR_xUQEhy6Ma0oLsFQ9c_OW50hgCK4BGAsYHg/s800/%255B10%255DKeyboard%2BFirmware%2BBuilder_Settings.png)

比較重要的是深藍色的「Save Configuration」按鈕，按下後會下載一個 JSON 檔，裡面儲存了該鍵盤的各種設定。在一開始 Keyboard Firmware Builder 的頁面裡，上方有個深藍色的「Upload」按鈕，將此 JSON 檔傳上後就可以繼續編輯或修改該鍵盤。**建議一定要儲存此 JSON 檔**。

## 編譯（Compile）

終於來到最後一個標籤頁「COMPILE」了。正常情況下是可以直接按下深藍色的「Download .hex」按鈕，讓它幫我們完成編譯的工作，並直接進行燒錄的步驟。

但如果你和我一樣是使用 Pro Micro 開發板的話，直接使用它編譯好的檔案可能會有問題，或是你想要修改更豐富的按鍵和其它功能的話，請按下白色的「Download .zip」按鈕，來儲存 QMK 韌體的原始檔，準備修改並自行編譯。

![▲ 「COMPILE」標籤頁。](https://1.bp.blogspot.com/-IbmnNoxPZ-s/Xu4uE8BFvvI/AAAAAAAACdg/khQpXPgiygkaVn409H394FOvf9RN8C-iACK4BGAsYHg/s800/%255B11%255DKeyboard%2BFirmware%2BBuilder_Compile.png)


# 結語

本篇簡單地介紹了利用「Keyboard Layout Editor」和「Keyboard Firmware Builder」這兩個線上工具進行鍵盤的相關編輯與設定。

接下來的步驟請見下一篇文章：[\[自製QMK鍵盤-2\] 手動編輯QMK韌體原始檔](/2020/06/diyqmkkeyboard-2/)。

# 相關文章與資源

* [\[系列文章\] 自製QMK鍵盤](/categories/自製QMK鍵盤/)
* 線上工具
    * [Keyboard Layout Editor](http://www.keyboard-layout-editor.com/)
    * [Keyboard Firmware Builder](https://kbfirmware.com/)
* 參考資料
	* [低端客制化，一份简单的键盘制作记录](https://zhuanlan.zhihu.com/p/79114621)
	* [机械键盘坏了怎么办？——客制化QMK改造重铸记！](https://post.smzdm.com/p/455929/)
	* [新手小白修复路透社机械键盘——超详细QMK刷机教程_值客原创_什么值得买](https://post.smzdm.com/p/aekz8pdm/)
* QMK相關
	* [QMK官方網站](https://qmk.fm/)
	* [QMK官方說明文件](https://docs.qmk.fm/#/)
	* [QMK的GitHub](https://github.com/qmk/qmk_firmware)