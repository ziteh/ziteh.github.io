---
title: "C 語言 Coding Style 規範"
subtitle: "我的編程風格"
# description: ""
tags: ["心得", "程式"]
series: []
# categories: []
date: 2024-05-25T14:55:00+08:00
header_img: ""
comment: true
toc: true
draft: false
---

稍微整理了一下我自己習慣的 C 語言 Coding style。這些規則只是我自己的喜好。

<!--more-->

# 簡述

1. 所有的左右花括號 `{ }` 都不換行。
2. 縮排使用 4 個空白，而非 `Tab` 字元。
3. 僅 `const` 全域常數、`#define` 巨集常數和巨集這三者使用大寫蛇形（`SCREAMING_SNAKE_CASE`），其餘全部使用蛇形（`snake_case`）命名風格。
4. 全域範圍命名偏好用更多文字描述，區域範圍的命名偏好簡短。
5. 使用常見的縮寫，但不能打破命名風格。

```c
const int LOOP_TIMEOUT = 1000;
char tx_buffer[128] = {0};

typedef struct {
    int age;
    const int id_number;
} human_info_t;

void do_something(int my_param) {
    int local_var = my_param;
}

int main(void) {
    do_something(0xF3);

    if (foo > 0) {
        bar = 1;
    } else {
        bar = 0;
    }

    while (1) {  // Main loop
        bar++;
    }
}
```

# A. 定義

提及這些關鍵字時會以粗體標示。

1. 強度：以下特定關鍵字按照 [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119) 中的描述解釋。
    - **必須**：MUST
    - **不允許**：MUST NOT
    - **應該**：SHOULD
    - **不應該**：SHOULD NOT
    - **可以**：MAY
2. 命名風格：皆爲**必須**。
    - **蛇型**（Snake case）：`snake_case`、`the_name`
    - **大寫蛇型**（Screaming snake case）：`SCREAMING_SNAKE_CASE`、`THE_NAME`
3. 命名偏好：皆爲**應該**。
    - **具描述性**：代表用更多文字精確描述。
    - **簡潔有力**：代表盡可能簡短。

# B. 通則

1. 縮排**必須**使用 4 個空白（`Space`），**不允許**用 `Tab` 字元。（建議設定爲軟 Tab，即按 Tab 出空白）
2. 任何左/右花括號 `{ }` 都**必須**置於同一行，並縮進其內容一次，即 LLVM 或（類）K&R Coding style。
3. 任何名稱都...
    1. **不允許**加上單/雙底線（`_` 或 `__`）的前/後綴。
    2. **不允許**使用阿拉伯數字作爲開頭。
    3. **可以**使用*常見*的縮寫，*常見*代表這個縮寫（在此專業領域內）同時滿足：不會造成歧義、一目瞭然、足夠通用。但是需要注意**不允許**打破命名風格規則。
4. 16 進制數的數值部分的英文**必須**爲大寫，如：`0x3A`、`0xFF8D`。
5. 描述陣列的名稱**應該**使用複數形、集合名詞或容器等可以表示多個的名詞。
6. 指標**可以**加上 `_p` 後綴。
7. **應該**盡可能使用 `const` 常數取代巨集常數 `#define`。
8. **應該**盡可能使用 `inline` 取代巨集 `#define`。
9. 如果呼叫的函數有非 `void` 回傳值，但你不需要用到它時，**必須**使用 `(void)` 明確地捨棄它。
10. 檔案名稱**必須**使用**蛇形**，副檔名**必須**爲小寫。
11. 檔案末行**必須**有一個換行符號。
12. 特別對於嵌入式應用，**應該**使用明確大小和有無號的型別，例如 `uint8_t`。

```c
int main(void) {
    char rx_buf[32] = {0}; 

    if (cnt > 0xF3) {
        // Do somethings
    } else if (cnt < 0) {
        // Do somethings
    } else {
        // Do somethings
    }
    
    while (1) {
        (void)my_function(cnt);
    }
}

int my_function(int param) {
    return param;
}
```

縮寫例如：

- 使用 `len` 代表 `length`。此縮寫在 C 語言中足夠*常見*。
- 使用 `buf` 代表 `buffer`。此縮寫在 C 語言中足夠*常見*。
- 使用 `uart` 代表 `universalAsynchronousReceiverTransmitter`。此縮寫在嵌入式領域中足夠*常見*。

縮寫名稱**不允許**打破命名風格。例如：

- 使用`ip_address` 而非 `IP_address`
- 使用 `uart_send` 而非 `UART_send`。

# C. 函數（Function）

1. 函數名稱**必須**使用**蛇型**風格，命名**應該**偏好**具描述性**。
2. 參數（Parameter）
   1. 名稱**必須**使用**蛇形**風格，命名**應該**偏好**簡潔有力**，爲名詞。
   2. 若指標形式的參數不會或不應該在函數內變更，**必須**加上 `const`。
   3. 無參數的函數也**必須**要補上 `void`。
   4. 所有的參數**必須**要全部都在同一行或都在不同行，**不允許**有些在同行、有些獨立一行。

```c
// OK
void timer_setup(void);
int module_is_enabled(void);
void uart1_send(const char* data, size_t len);
void foobar(int long_param) {
    int foo = long_param;
}

void loooooooooooooooooooooonooooooooooong_function(
    int param1, int param2, int param3
) {
    int foo = 0;
}

void looooooooooooooooooooooooooooonoooong_function(
    int param1,
    int param2,
    int looooooooooooooooong_param3
) {
    int foo = 0;
}

// Wrong
void timer_setup();           // 遺失 `void`
void looooooooooooooooooooooooooooonoooong_function(
    int param1, int param2,   // 只要有一個參數換行，那所有的參數都需要獨立一行
    int looooooooooooooooong_param3
) {
    int foo = 0;
}
```

# D. 變數（Variable）

1. 全域範圍
    1. 一般全域變數名稱**必須**使用**蛇形**風格，命名**應該**偏好**具描述性**，爲名詞。
    1. `const` 全域常數名稱**必須**使用**大寫蛇形**風格，命名**應該**偏好**具描述性**，爲名詞。
2. 區域變數名稱**必須**使用**蛇形**風格，命名**應該**偏好**簡潔有力**，爲名詞。

```c
// OK
int uart1_rx_index = 0;
int analog_channels[5];
const int UART1_BAUDRATE = 9600;
static const int UART1_TIMEOUT = 10000;
void func(void) {
    int tmp = 0;
    static int cnt;
    char rx_buf[16];
    for (int i = 0; i < 100; i++);
}

// Wrong
int rx_i = 0;            // 太短
int UART1_rx_index = 0;  // 縮寫不能打破命名風格規則，即使是首字母縮寫
int analog_channel[5];   // 在陣列使用複數形、集合名稱或容器
void func(void) {
    static int CNT;      // `static` 不會改變命名風格
}
```

# E. 資料型別（Data Type）

1. 列舉（Enum）、結構（Struct）與聯合（Union）
    1. 本身的名稱**必須**使用**蛇型**風格，命名**應該**偏好**具描述性**，爲名詞。
    2. 成員的名稱**必須**使用**蛇形**風格，命名**應該**偏好**簡潔有力**，爲名詞。
    3. 多行形式下，最後一個成員**必須**加上尾隨逗號（Trailing comma）。
2. 使用 `typedef` 定義的...
    1. 型別名稱要加上 `_t` 後綴。
    2. 函數指標名稱要加上 `_fn` 後綴。
3. Enum 的成員名稱**可以**加上某些統一的前綴，以避免與其它 Enum 成員重複。
4. Struct 的成員...
    1. 如果其值不會或不應該改變的話，**必須**加上 `const`。
    2. 視情況使用 bit-field。

```c
// OK
struct human_info {
    int age;
    int id;
};

typedef enum {
    key_release = 0,
    key_debounce,
    key_accept,
} key_stage_t;

union control_reg {
    struct {
        int bit1: 1;
        int bit2: 1;
        int bit34: 2;
        const int unused: 7;
    } bits;
    int byte;
};

typedef int (*event_callback_fn)(int long_param);
```

# F. 流程控制

1. `switch-case` 語法的 `case` 或 `default` **不允許**縮排。其內容**必須**要縮排。
2. `switch-case` 語法的最後一個 `case` 或 `default` 也**必須**要加上 `break`，即使它在語法上是可以省略的。
3. 如果要在 `case` 或 `default` 中加入花括號，且該區塊末的 `break` **必須**放在其外。
4. 總是**必須**明確地加上 `default`，即使它的內容爲空。

```c
void function(int param) {
    int foo;

    switch (param) {
    case 0:
        foo = 100;
        break;
    case 1:
    case 2:
        foo = 250;
        break;
    case -1: {
        foo = -99;
    } break;
    default:
        break;
    }
}
```

# G. 預處理器（Preprocessor）

1. 巨集常數（Macro constants，以 `#define` 定義的值）
    1. 名稱**必須**使用**大寫蛇形**風格，命名**應該**偏好**具描述性**，爲名詞。
    2. 值**必須**使用括號 `()` 包圍，以避免展開錯誤。
    3. **可以**加上強制轉型（Casting）作爲型別標記。
2. 巨集（Macro）
    1. 本身的名稱**必須**使用**大寫蛇形**風格，命名**應該**偏好**具描述性**。
    2. 參數的名稱**必須**使用**蛇形**風格，命名**應該**偏好**簡潔有力**（更甚至使用單一字母）。
    3. 所有參數皆**必須**使用括號 `()` 包圍，以避免展開錯誤。
    4. 複雜（內有邏輯處理）的巨集**應該**使用 `do-while(0)` 包圍，確保讓編譯器將其解釋爲一個獨立的 Block。
    5. **可以**加上強制轉型（Casting）作爲型別標記。

```c
// OK
#define UART_RX_PIN   (GPIO5)
#define UART_BAUDRATE ((uint16_t)19200)

#define ADD2(a, b)          ((a) + (b))
#define FOO_BAR(foo_bar)    (foo_bar++)

// Wrong
#define UART_RX_PIN  GPIO5           // 遺失括號包圍
#define ADD2(a, b)          (a + b)  // 參數遺失括號包圍
```

3. `#endif` 後**不應該**加上用於標註其對應的開頭的註解。
4. 所有 `.h` 標頭檔皆**必須**有引用保護（Include Guard）。
    1. 若使用的編譯器支援 `#pragma once` 則優先使用，否則使用預處理器達成，其格式爲：

```c
/// @file my_file.h

#ifndef MY_FILE_H
#define MY_FILE_H
 
// Your code
    
#endif
```

5. 視情況而定，**可以**加入 C++ 檢查。格式爲：

```c
/// @file my_file.h

#ifndef MY_FILE_H
#define MY_FILE_H

#include "something.h"

#ifdef __cplusplus
extern "C" {
#endif

// Your code

#ifdef __cplusplus
}
#endif
    
#endif
```

# H. 註解

1. 所有註解句子的第一個字**必須**要大寫，除非句子的開頭不是英文。
2. 如果註解前有程式碼，**必須**間隔 2 該空白。
3. 一般註解**必須**使用單行註解形式，即雙斜線，即使它會寫成多行的形式。行末**不允許**加句號，即使行中有其它標點符號。
4. 文件註解**必須**使用 Doxygen 的三斜線 `///` 註解形式。如果是描述性的句子，各行末**必須**加句號。
    1. *例外*：URL 網址或檔案名等特殊字段行末**不允許**加句號，以避免感染閱讀或複製。
5. 對於檔案的 Doxygen 格式**必須**遵守以下規則與順序：
    1. 使用 `@file <FILENAME>` 標記此檔案的名稱。
    2. 使用 `@brief <TEXT>` 簡述此檔案。
    3. 使用 `@attention <TEXT>` 描述特別需要注意的事情。
    4. 使用 `@author <NAME>` 標記作者。**可以**在作者的名字後面加上以角括號 `< >` 包圍的 Email。
    5. 使用 `@copyright <LICENSE>` 標記此檔案的授權許可。`<LICENSE>` **應該**使用 `SPDX-License-Identifier: <SPDX_ID>` 這樣的格式，除非此授權不在 [SPDX](https://spdx.org/licenses/) 內。或是嵌入授權許可的所有內容。
    6. 使用 `@note <TEXT>` 寫其它說明，尤其是段落性質的筆記。
6. 對於函數的 Doxygen 格式**必須**遵守以下規則與順序：
    1. 使用 `@brief <TEXT>` 簡述此函數。
    2. 使用 `@note <TEXT>` 寫其它說明，尤其是段落性質的筆記。
    3. 使用 `@param <NAME> <TEXT>` 描述各個參數。**可以**使用下述帶資料方向標記的版本。
    4. 使用 `@param[<DIR>] <NAME> <TEXT>` 描述帶有方向的各個參數。`[<DIR>]` **必須**是 `[in]`、`[out]`或 `[in, out]`。
    5. 使用 `@return <TEXT>` 描述函數的回傳值。
7. 對於全域變數、常數的 Doxygen 格式**必須**遵守以下規則與順序：
    1. 使用 `@brief <TEXT>` 簡述此變數或常數。
    2. 使用 `@note <TEXT>` 寫其它說明，尤其是段落性質的筆記。
8. 如果是段落性質的 Doxygen 文字，換行後**必須**要保持縮排。
9. Doxygen 文字**可以**使用 Markdown 語法.
10. **不允許** 結構化註解，例如：`// ########## //`

```c
/// @file foobar.c
/// @brief Awesome code.
/// @author ZiTe <honmonoh@gmail.com>
/// @copyright SPDX-License-Identifier: MIT

/// @brief Comment, comment and comment.
uint8_t foobar = 0;

/// @brief Do something, doc comment end with a period.
///        Url without period: https://github.com/git/git
/// 
/// @param data A pointer to the data.
/// @param len The length of data.
/// @return 0 if successful, otherwise an error code.
uint16_t do_something(const uint8_t *data, uint16_t len) {
    // Multi line comment
    // foo, bar
    uint8_t val = *data;  // Without period    
    return 0;             // Success
}

/// @brief Copies the values of `len` bytes from `src` to `des`.
/// 
/// @param[out] des Pointer to the destination array.
/// @param[in] src Pointer to the source of data.
/// @param[in] len Number of bytes to copy.
void array_copy(uint8_t *des, const uint8_t *src, uint16_t len) {
}
```

# I. 空白

1. 函數（包含宣告、定義、呼叫）和 `sizeof` 運算子的左圓括號前**不允許**插入空白，其餘都**必須**在前有 1 個空白。
2. 右圓括號前**不允許**插入空白。
3. 若逗號 `,` 或分號 `;` 前**不允許**插入空白，若其後還有其它內容，其後**必須**有 1 個空白。除了三元運算子以外的冒號 `:` 也套用此規則。
4. 除了下述的運算子與其它數值或變數間**必須**有 1 個空白、以及 `sizeof` 運算子套用函數規則外，其餘運算子與數值或變數之間**不允許**有空白。
    1. 三元條件 `? :`。
    2. 各種賦值：`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `<<=`, `=>>`, `&=`, `|=`, `^=`。
    3. 邏輯 AND `&&`，邏輯 OR `||`。
    4. 位元 AND `&`，位元 OR `|`，位元 XOR `^`。
    5. 各種關係：`==`, `!=`, `<`, `<=`, `>`, `>=`。
    6. 左移 `<<`，右移 `>>`。
    7. 基本運算的：`+`, `-`, `*`, `/`, `%`。

```c
void func(uint8_t p1, uint8_t p2);

int main(void) {
    func(1, 2);
    uint8_t len = sizeof(foobar);
    uint8_t a = 1 + 2;
    uint8_t b = 1 + (1 * 10) % (len / (a * 3.14));
    ++a;
    if (a);
    for (uint8_t i = 0; i < 10; i++);
    while (1);  // Main loop
}
```

# 附錄

## Q&A

### 爲何所有的花括號 `{}` 都不換行？爲何不是 Allman 風格？

因爲：[C 語言用 K&R Coding Style 的最大理由不是省行數](/posts/c-kr-style/)

### 爲何要使用 `(void)` 捨棄非 `void` 的函數回傳值？

爲了明確表達你知道這個函數有回傳值，但是你不需要它，因爲很多情況下函數的回傳值會是錯誤代碼之類的。

> 這是來自 Rust 的啓發。  
> [Casting function returns to void](https://stackoverflow.com/a/3998815)

### 爲什麼函數的參數只能有全部同行和全部不同行兩種？

1. 保持規則單純。
2. 參數寫成多行的情況表示此函數的參數有一定的複雜性（無論是數量還是名稱），各自獨立一行更方便閱讀和修改。

> 這是來自 Rust 的啓發。

### 使用縮寫不會影響閱讀和判斷嗎？

所以你只能使用常見、不會造成歧義和一目瞭然的縮寫。

> C is a Spartan language, and your naming conventions should follow suit. Unlike Modula-2 and Pascal programmers, C programmers do not use cute names like `ThisVariableIsATemporaryCounter`.  
> A C programmer would call that variable `tmp`, which is much easier to write, and not the least more difficult to understand.  
> -- From [Linux kernel coding style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html#naming)

### 爲何 `switch-case` 的最後一個案例也要加 `break`？

主要有兩個理由：1. 保持一致，2. 如果哪天修改了這些案例，明確的 `break` 是一種保護。

讓我節錄一些看法：

> Refactorability. If all your branches end with break or return, you can reorder them without changing the meaning. This makes it less likely for such a reordering to introduce a regression.  
> -- From @tdammers [Break on default case in switch](https://softwareengineering.stackexchange.com/a/201786)

> As a matter of good form, put a break after the last case (the default here) even though it's logically unnecessary. Some day when another case gets added at the end, this bit of defensive programming will save you.  
> -- From *The C Programming Language, 2/e*, [Should we break the default case in switch statement?](https://stackoverflow.com/a/26139061)

### 爲何使用花括號的 `switch-case` 的 `break` 要在其外？

絕大多數的情況下 `case` 都會以 `break` 結束，以避免執行了預期外的程式。某些較複雜的案例會使用花括號包圍，將 `break` 放在其外可以更明確地確認你沒有遺漏結尾的 `break`。

### 爲何 `typedef` 要加上後綴？

加上 `_t` 後綴是來自標準庫的習慣，實際上大多數的專案也延續了此規則，而且這樣可以明確知道這個是一種型別，而非變數等。

指標函數加上 `_fn` 後綴是對於 `_t` 行爲的擴充。

### 爲何要爲指標加上後綴？

因爲指標代表的是該數值的記憶體位置，而不是該數值本身。例如「台北101」和「台北市信義區信義路五段7號」，雖然後者可以指向前者，但它們在概念上終究不是完全一樣的。

當然，這個後綴是可選的，請根據實際需求選擇。

### 爲何 `const` 只在全域才實施**大寫蛇形**，而區域變數、成員和參數不實施？

`const` 全域常數實施**大寫蛇形**是爲了替換/取代/兼容 `#define` 的巨集常數。使用 `#define` 定義值的名稱使用**大寫蛇形**是多數 C 專案的共同習慣，所以作爲替換的 `const` 全域常數也使用相同的規則（此規則甚至在其它語言也適用）。區域變數、成員和參數不實施是因爲它們本來就沒有「替換 `#define`」的這層意義與功能在。

另外，爲了鼓勵使用者爲本來就不會也不該改變的值使用不可變變數（Immutable variable），`const` 區域變數、成員和參數不實施**大寫蛇形**，而是遵照原始規則，可以讓使用者不會爲了「避免程式碼出現一堆難看的全大寫」而進一步避免使用 `const`。所以如果你確定這個區域變數、成員或參數的值不會也不該改變，請考慮加上 `const`。這是來自 Rust 的一個啓發。

> you should use `const` wherever possible but for *maintainability reasons* & *preventing yourself from doing stupid mistakes*.  
> -- From [Should I use const for local variables for better code optimization?](https://stackoverflow.com/a/10747948)

> [[106] const 變數有助理解程式碼並協助編譯器優化](https://samtsai.org/2016/07/24/106-const-bian-shu-you-zhu-li-jie-cheng-shi-ma-bing-xie-zhu-bian-yi-qi-you-hua/)

### 爲何要用 `const` 全域常數取代 `#define`？

實際上 `const` 和 `#define` 的處理方式不同。`#define` 是預處理器會使用「替換」的方式處理，`const` 是表明此變數不可變（在編譯期檢查）。

使用 `const` 或 `#define` 對編譯出來的程式大小或效能並不會有差異，所以性能不是區分何時該使用這兩者的考量。

`const` 的好處是：

1. 明確型別，編譯器會對它進行型別檢查（有寫過動態型別語言的使用者應該很清楚這件事的好處），而 `#define` 只是單純的替換文字。
2. `const` 可以用 `static` 限制存取範圍，有助於封裝（Encapsulation），而 `#define` 基本上是跨檔案的。
3. 在一些 IDE 中，Debug 模式下是看不到 `#define` 的實際值的，而 `const` 可以。

當然，如果有特殊需求（例如刻意不想進行型別檢查）或充分理由時，還是可以使用 `#define`。

> [What is the difference between #define and const?](https://stackoverflow.com/a/6442372)

### 爲何要用 `inline` 取代 `#define` 巨集？

基本上和「爲何要用 `const` 全域常數替換或取代 `#define`？」的理由類似。

`#define` 的特性單純是不會進行型別檢查。大多數情況下，我們總是喜歡型別檢查，這會把錯誤顯式的帶到編譯期而非執行期。也同樣的，如果你有刻意不想進行型別檢查（例如想要參數不限型別）的充分理由或需求的話，使用巨集。

在可讀性上巨集也差很多。多行的 `#define` 要在行末加上 `\`，複雜的甚至還要使用 `do-while(0)` 包圍才可以確保編譯器將其解釋爲一個 Block。而 `inline` 函數就只是比一般的函數前面多一個修飾詞而已。當然，如果這個巨集足夠單純的話，使用巨集無可厚非，但是還是要注意巨集的非預期行爲。

巨集可能在展開後出現非預期行爲。想像一下如何用巨集實現一個 `MAX(a, b)` 函數，它會比較兩個參數並回傳較大的那個。感覺很簡單？

```c
#define MAX(a, b) (a) > (b) ? (a) : (b)
```

實際上上面的寫法在某些情況下會有非預期行爲，這是比較實務的寫法（[Linux 核心原始程式碼巨集: max, min](https://hackmd.io/@sysprog/linux-macro-minmax)）：

```c
#define MAX(a, b) ({     \
    typeof (a) _a = (a); \
    typeof (b) _b = (b); \
    _a > _b ? _a : _b;   \
})
```

> [Inline functions vs Preprocessor macros](https://stackoverflow.com/a/1137627)

### 爲何標頭檔的 C++ 檢查不是**必須**？

簡單來說，我認爲這違反 YAGNI（You Aren't Gonna Need It，你不會需要它）原則。我認爲它可能是一種對於未來情況的假設。

如果你知道或認爲這個程式*就是不會*被 C++ 使用，只會在純 C 中的話，那加入 C++ 檢查就是多餘且干擾的。我參與的專案中有很多都是嵌入式系統，它們基本上永遠都只會是純 C，完全沒有必要讓 C++ 檢查爲強制**必須**的，你自行判斷是否該加入。但是我認爲這個判定可以寬鬆一點，即只要稍微有一點會在 C++ 中使用的可能，那就可以加。

### 爲何 `#endif` 後不加對應開頭的註解？

在 `#endif` 後面加對應的 `#if`/`#ifdef`/`#ifndef` 名稱的註解是很多 C 專案的習慣，例如：

```c
#ifndef MY_CODE_H
#define MY_CODE_H

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif /* MY_CODE_H */
```

但是，對於使用 `#ifndef` 作引入保護的標頭檔，誰不知道最後一個 `#endif` 對應的是引入保護？又或者是 C++ 檢查的部分，它們各自也只有3行而已，一看就知道對應的開頭是哪個。而且如果中間有一個 `#elif` 的話呢？

那如果是其它預處理器判斷式呢？我認爲，如果那些判斷式寫的很複雜或很多行（尤其無法在一個螢幕上顯示）的話，可以考慮加上註解。但同時也要優先考慮是否真的有必要使用這麼複雜或長的預處理器判斷式？

就如同 Linux Kernal 風格的縮排使用 8 個空白，如果有人抱怨「用 8 個空白的話一下就縮排到最右邊了！」，那他們會回應：「不要讓你的程式碼使用超過 3 層縮排就不會有這個問題。如果你的程式超過 3 層，那代表它不夠簡潔，需要重新檢視」

如果你有 N 個預處理器 Flag，那這個程式就有 2^N 種變化性（或著說狀態），這可能是難以掌握的。而且這是不是預處理或是檔案層級的單一職責問題？

## 自動格式化

推薦使用 [clang-format](https://clang.llvm.org/docs/ClangFormat.html) 工具來自動完成程式碼格式化（已整合在 VS Code [C/C++ 套件](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)中），這是 LLVM 專案下的開源工具。可以在 [Clang-format configurator v2](https://clang-format-configurator.site/) 網站測試並預覽格式化設定。

參考設定檔 `.clang-format`

```yaml
---
# clang-format v18.1.3

BasedOnStyle: LLVM
Language: Cpp
TabWidth: 4
IndentWidth: 4
AccessModifierOffset: -4
ColumnLimit: 0
UseTab: Never
SortIncludes: Never
AlignAfterOpenBracket: BlockIndent
AlignArrayOfStructures: Left
AlignConsecutiveMacros:
  Enabled: true
  AcrossComments: true
AlignEscapedNewlines: Left
AlignOperands: AlignAfterOperator
AllowShortBlocksOnASingleLine: Always
AllowShortFunctionsOnASingleLine: None
AllowShortIfStatementsOnASingleLine: AllIfsAndElse
AllowShortLoopsOnASingleLine: true
BinPackArguments: false
BinPackParameters: false
BitFieldColonSpacing: After
BreakBeforeBraces: Custom
BraceWrapping:
  AfterCaseLabel: false
  AfterClass: false
  AfterControlStatement: Never
  AfterEnum: false
  AfterFunction: false
  AfterNamespace: false
  AfterObjCDeclaration: false
  AfterStruct: false
  AfterUnion: false
  AfterExternBlock: true  # Make `IndentExternBlock: NoIndent` work. https://github.com/llvm/llvm-project/issues/49804
  BeforeCatch: false
  BeforeElse: false
  BeforeLambdaBody: false
  BeforeWhile: false
  IndentBraces: false
  SplitEmptyFunction: true
  SplitEmptyRecord: true
  SplitEmptyNamespace: true
BreakBeforeBinaryOperators: NonAssignment
CommentPragmas: ''
IncludeIsMainRegex: ''
IndentExternBlock: NoIndent
IndentPPDirectives: BeforeHash
InsertNewlineAtEOF: true
InsertTrailingCommas: Wrapped
KeepEmptyLinesAtTheStartOfBlocks: false
LineEnding: DeriveLF
...
```

如果你使用的是 VS Code，也可以使用 key-value 格式直接設定（推薦設定在 `C_Cpp.clang_format_fallbackStyle` 內）：

```json
{BasedOnStyle: LLVM, Language: Cpp, TabWidth: 4, IndentWidth: 4, AccessModifierOffset: -4, ColumnLimit: 0, UseTab: Never, SortIncludes: Never, AlignAfterOpenBracket: BlockIndent, AlignArrayOfStructures: Left, AlignConsecutiveMacros: {Enabled: true, AcrossComments: true}, AlignEscapedNewlines: Left, AlignOperands: AlignAfterOperator, AllowShortBlocksOnASingleLine: Always, AllowShortFunctionsOnASingleLine: None, AllowShortIfStatementsOnASingleLine: AllIfsAndElse, AllowShortLoopsOnASingleLine: true, BinPackArguments: false, BinPackParameters: false, BitFieldColonSpacing: After, BreakBeforeBraces: Custom, BraceWrapping: {AfterCaseLabel: false, AfterClass: false, AfterControlStatement: Never, AfterEnum: false, AfterFunction: false, AfterNamespace: false, AfterObjCDeclaration: false, AfterStruct: false, AfterUnion: false, AfterExternBlock: true, BeforeCatch: false, BeforeElse: false, BeforeLambdaBody: false, BeforeWhile: false, IndentBraces: false, SplitEmptyFunction: true, SplitEmptyRecord: true, SplitEmptyNamespace: true}, BreakBeforeBinaryOperators: NonAssignment, CommentPragmas: '', IncludeIsMainRegex: '', IndentExternBlock: NoIndent, IndentPPDirectives: BeforeHash, InsertNewlineAtEOF: true, InsertTrailingCommas: Wrapped, KeepEmptyLinesAtTheStartOfBlocks: false, LineEnding: DeriveLF}
```

如果你想要另外下載執行檔的話，可以在 [LLVM 的 GitHub](https://github.com/llvm/llvm-project/releases) 下載並安裝。安裝完的預設路徑應該是在 `C:\Program Files\LLVM\bin\clang-format.exe`。

# 參考

- [Recommended C style and coding rules](https://github.com/MaJerle/c-code-style)
- [Linux kernel coding style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html)
- [My favorite C programming practices.](https://github.com/mcinglis/c-style)
- [C 語言用 K&R Coding Style 的最大理由不是省行數](/posts/c-kr-style/)
