---
title: "C 語言 Coding Style 風格規範"
subtitle: ""
# description: ""
tags: ["教學", "程式"]
series: []
# categories: []
date: YYYY-MM-DDThh:mm:ss+08:00
header_img: ""
comment: true
toc: true
draft: true # false
---

<!--more-->

# 簡述

1. `const` 全域常數、`#define` 使用大寫蛇形（`SCREAMING_SNAKE_CASE`）
2. 函數和自定義型別（Enum、Struct、Union）使用一般蛇形（`snake_case`）
3. 參數、區域變數、型別成員使用小駝峰（`lowerCamelCase`）
4. 僅全域變數使用大駝峰（`UpperCamelCase`）
5. 全域範圍命名偏好用更多文字描述，區域範圍的命名偏好簡短。
6. 使用常見的縮寫，但不能打破命名風格。

> 規則的優先度由上而下遞減，即最上面（數字最小）的規則優先度最高。

---

# A. 定義

## a. 強度

1. 不允許：MUST NOT
1. 必須：MUST
2. 應該：SHOULD
2. 不應該：SHOULD NOT
3. 可以：MAY

> RFC2119

## b. 命名風格

1. 大駝峰（Upper camel case aka Pascal Case）：`UpperCamelCase`、`TheName`
1. 小駝峰（Lower camel case）：`lowerCamelCase`、`theName`
1. 一般蛇型（Snake case）：`snake_case`、`the_name`
2. 大寫蛇型（Screaming snake case）：`SCREAMING_SNAKE_CASE`、`THE_NAME`

> 命名風格規則皆爲**必須**。

## c. 命名偏好

- 具描述性：代表用更多文字精確描述。
- 簡潔有力：代表盡可能簡短。

> 命名偏好皆爲**應該**。

# B. 通則

1. 縮排**必須**使用 4 個空白（`Space`），**不允許**用 `Tab` 字元。（可以使用軟 Tab，即按 Tab 出空白）
2. 任何左/右花括號 `{}` **必須**獨立一行（無論是函式、if、struct 或其它任何），並縮進其內容一次，即 Allman 風格。
    3. ***例外***：除非這對花括號本來就在同一行。
5. 任何名稱都...  
    6. **不允許**加上單/雙底線（`_` 或 `__`）的前/後綴。
    7. **不允許**使用阿拉伯數字作爲開頭。
    8. **可以**使用*常見*的縮寫，*常見*代表這個縮寫（在此專業領域內）同時滿足：不會造成歧義、一目瞭然、足夠通用。
    9. **不允許**打破命名風格，尤其是使用縮寫時。
9. 16 進制數的數值部分的英文**必須**爲大寫，如：`0x3A`、`0xFF8D`。
10. 描述陣列的名稱**應該**使用複數形、集合名詞或容器等可以表示多個的名詞。
11. 指標**可以**加上 `Ptr` 後綴。

縮寫例如：

- 使用 `len` 代表 `length`。此縮寫在 C 語言中足夠*常見*。
- 使用 `buf` 代表 `buffer`。此縮寫在 C 語言中足夠*常見*。
- 使用 `uart` 代表 `universalAsynchronousReceiverTransmitter`。此縮寫在嵌入式領域中足夠*常見*。

縮寫名稱**不允許**打破命名風格。例如使用`ipAddress` 而非 `IPAddress`；使用 `uart_send` 而非 `UART_send`。

> C is a Spartan language, and your naming conventions should follow suit. Unlike Modula-2 and Pascal programmers, C programmers do not use cute names like `ThisVariableIsATemporaryCounter`. A C programmer would call that variable `tmp`, which is much easier to write, and not the least more difficult to understand.
> -- [Linux kernel coding style](https://www.kernel.org/doc/html/latest/process/coding-style.html#naming)

# C. 函式（Function）

1. 函式名稱**必須**使用**一般蛇型**風格，命名**應該**偏好**具描述性**。
2. 參數（Parameter）
   1. 名稱**必須**使用**小駝峰**風格，命名**應該**偏好**簡潔有力**，爲名詞。
   3. 若指標形式的參數不會或不應該在函式內變更，**必須**加上 `const`。
   2. 無參數也**必須**要補上 `void`。

```c
void timer_init(void);
void uart1_send(const uint8_t* data, size_t len);
void module_setup(uint8_t longParam)
uint16_t temp_sensor_get_state(void);

void led_set(uint32_t port, uint32_t pin, uint8_t state)
{
    uint8_t foo = port;
    uint8_t bar = pin;
}
```

# D. 變數（Variable）

1. 全域範圍
    1. 一般全域變數名稱**必須**使用**大駝峰**風格，命名**應該**偏好**具描述性**，爲名詞。
    1. `const` 全域常數名稱**必須**使用**大寫蛇形**風格，命名**應該**偏好**具描述性**，爲名詞。
2. 區域變數名稱**必須**使用**小駝峰**風格，命名**應該**偏好**簡潔有力**，爲名詞。

```c
int8_t GlobalVariable = 0;
int8_t Uart1RxIndex = 0;

uint8_t Uart1RxBuffer[256] = {0};
uint16_t AnalogChannels[100];

const uint16_t UART1_BAUDRATE = 9600;
static const uint16_t UART1_TIMEOUT = 10000;

void func(void)
{
    int8_t tmp = 0;
    uint8_t rxBuf[16];
    uint8_t txBuf[16];
    static uint16_t cnt;
    
    for (int i = 0; i < 100; i++);
}
```

# E. 資料型別（Data Type）

1. 列舉（Enum）、結構（Struct）與聯合（Union）
    1. 本身的名稱**必須**使用**一般蛇型**風格，命名**應該**偏好**具描述性**，爲名詞。
    2. 成員的名稱**必須**使用**小駝峰**風格，命名**應該**偏好**簡潔有力**，爲名詞。
    3. 多行形式下，最後一個成員**必須**加上尾隨逗號。
2. 使用 `typedef` 定義的...
    1. 型別名稱要加上 `_t` 後綴。
    2. 函式指標名稱要加上 `_fn` 後綴。
3. 結構視情況使用 bit-field。

```c
enum gpio_state
{
    off = 0,
    on = 1,
};

typedef enum
{
    keyRelease,
    keyDebounce,
    keyAccept,
} key_stage_t;

typedef struct
{
    uint8_t age;
    uin16_t id;
} human_info_t;

union control_reg
{
    struct
    {
        uint8_t bit1 : 1;
        uint8_t bit2 : 1;
        uint8_t bit34 : 2;
        const uint8_t unusedBit : 7;
    } bits;
    uint8_t byte;
}


typedef uint8_t (*event_callback_fn)(uint8_t longParam);
```

# F. 預處理器（Preprocessor）

1. 預處理器標籤 （Preprocessor Flag）
    1. 名稱**必須**使用**大寫蛇形**風格，命名**應該**偏好**具描述性**，爲名詞。
    2. 值**必須**使用括號 `()` 包圍。
    3. **可以**加上強制轉型（Casting）作爲型別標記。
4. 巨集（Macro）
    1. 本身的名稱**必須**使用**大寫蛇形**風格，命名**應該**偏好**具描述性**。
    2. 參數的名稱**必須**使用**小駝峰**風格，命名**應該**偏好**簡潔有力**（更甚至使用單一字母）。
    3. 所有參數皆**必須**使用括號 `()` 包圍。
    4. 複雜（內有邏輯處理）的巨集**應該**使用 `do-while(0)` 包圍。
    5. **可以**加上強制轉型（Casting）作爲型別標記。

```c
#define UART_RX_PIN   (GPIO5)
#define UART_BAUDRATE ((uint16_t)19200)

#define ADD2(a, b)    ((a) + (b))
```

3. `#endif` 後**不應該**加上用於標註其對應的開頭的註解。


1. 所有 `.h` 標頭檔皆**必須**有引用保護（Include Guard）。
2. 若使用的編譯器支援 `#pragma once` 則優先使用，否則使用預處理器達成，其格式爲：

```c
// my_file.h

#ifndef MY_FILE_H
#define MY_FILE_H
    
// Your code.
    
#endif
```

1. 視情況加入 C++ 檢查。如果需要的話，格式爲：

```c
// my_file.h

#ifndef MY_FILE_H
#define MY_FILE_H

#ifdef __cplusplus
extern "C" {
#endif

// Your code.

#ifdef __cplusplus
}
#endif
    
#endif
```

# G. 註解

3. 註解行末統一加句號，無論是一般程式註解還是 Doc 註解。
4. 文件註解使用 Doxygen 格式。

```c

```

# X. 其它

1. 檔案名稱**必須**使用**一般蛇形**，副檔名**必須**爲小寫。
2. 檔案末行**必須**有一個換行符號。

- `my_code.h`
- `my_code.c`
- `algo.c`

# 附錄

## Q&A

### 爲何 `const` 只在全域才實施**大寫蛇形**，而區域變數、成員和參數不實施？

`const` 全域常數實施**大寫蛇形**是爲了替換/取代/兼容 `#define`。使用 `#define` 定義值的名稱使用**大寫蛇形**是多數 C 專案的共同習慣，所以作爲替換的 `const` 全域常數也使用相同的規則（此規則甚至在其它語言也適用）。區域變數、成員和參數不實施是因爲它們本來就沒有「替換 `#define`」的這層意義與功能在。

另外，爲了鼓勵使用者爲本來就不會也不該改變的值使用不可變變數（Immutable variable），`const` 區域變數、成員和參數不實施**大寫蛇形**，而是遵照原始規則，可以讓使用者不會爲了「避免程式碼出現一堆難看的全大寫」而進一步避免使用 `const`。所以如果你確定這個區域變數、成員或參數的值不會也不該改變，請考慮加上 `const`。這是來自 Rust 的一個啓發。[^ge_const][^so_const]

### 爲何要用 `const` 全域常數替換或取代 `#define`？

實際上 `const` 和 `#define` 的處理方式不同。`#define` 是預處理器會使用「替換」的方式處理，`const` 是表明此變數不可變（在編譯期檢查）。

在各種編譯器中，使用 `const` 或 `#define` 對編譯出來的程式大小或效能並不會有差異，所以性能不是區分何時該使用這兩者的考量。 [^so_const_def]

`const` 的好處是明確型別，編譯器會對它進行型別檢查（有寫過動態型別語言的使用者應該很清楚這件事的好處），而 `#define` 只是單純的替換文字。

再來，`const` 可以用 `static` 限制存取範圍，有助於封裝（Encapsulation），而 `#define` 基本上是跨檔案的。

最後，在一些 IDE 中，Debug 模式下是看不到 `#define` 的實際值的，而 `const` 可以。

當然，如果有特殊需求（例如刻意不想進行型別檢查）或充分理由時，還是可以使用 `#define`。

### 爲何要用 `inline` 取代 `#define` 巨集？

基本上和「爲何要用 `const` 全域常數替換或取代 `#define`？」的理由類似。

`#define` 的特性單純是不會進行型別檢查。大多數情況下，我們總是喜歡型別檢查，這會把錯誤顯式的帶到編譯期而非執行期。也同樣的，如果你有刻意不想進行型別檢查（例如想要參數不限型別）的充分理由或需求的話，使用巨集。

在可讀性上巨集也差很多。多行的 `#define` 要在行末加上 `\`，複雜的甚至還要使用 `do-while(0)` 包圍才可以確保編譯器將其展開爲一個 Block。而 `inline` 函數就只是比一般的函數前面多一個修飾詞而已。當然，如果這個巨集足夠單純的話，使用巨集無可厚非，但是還是要注意巨集的非預期行爲。

非預期行爲。想像一下如何用巨集實現一個 `MAX(a, b)` 函數，他會比較兩個參數並回傳較大的那個。感覺很簡單？[^ge_linux_max]

```c
#define MAX(a, b) (a) > (b) ? (a) : (b)
```

這是 Linux kernel 的實現：

```c
#define MAX(a, b) ({ \
    typeof (a) _a = (a); \
    typeof (b) _b = (b); \
    _a > _b ? _a : _b; \
})
```

### 爲何標頭檔的 C++ 檢查不是**必須**？

就如同在 OOP 中，爲了只會有一種實作的類別專門抽象化一個 Interface（而且沒有其它依賴問題要解決的話）我認爲是要避免的（違反 YAGNI 原則）。[^one_interface]

同理，如果你知道或認爲這個程式就是不會被 C++ 使用，只會在純 C 中的話，那加入 C++ 檢查就是多餘且干擾的。我參與的專案中有很多都是嵌入式系統，它們基本上永遠都只會是純 C，完全沒有必要讓 C++ 檢查爲**必要**的，你自行判斷是否該加入。

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

但是，對於使用 `#ifndef` 作引入保護的標頭檔，誰不知道最後一個 `#endif` 對應的是引入保護？又或者是 C++ 檢查的部分，它們各自也只有3行而已，一看就知道對應的開頭是那個。

那如果是其它預處理器判斷式呢？我會說，如果那些判斷式寫的很複雜或很多行（尤其無法在一個螢幕上顯示）的話，可以考慮加上註解。但同時也要優先考慮是否真的有必要使用這麼複雜或長的預處理器判斷式？就如同 Linux Kenal 風格的縮排使用 8 個空白，如果有人抱怨「用 8 個空白的話一下就縮排到最右邊了！」，那他們會回應：「不要讓你的程式碼使用超過 3 層縮排就不會有這個問題。如果你的程式超過 3 層，那代表它不夠簡潔，需要重新檢視」

如果你有 N 個預處理器 Flag，那這個程式就有 2^N 種變化性（或著說狀態），這可能是難以掌握的。而且這是不是預處理或是檔案層級的單一職責問題？

##  Formatter

clang-format:

```yaml
---
BasedOnStyle: LLVM
AccessModifierOffset: '-2'
AlignAfterOpenBracket: Align
AllowShortBlocksOnASingleLine: 'true'
BinPackArguments: 'false'
BinPackParameters: 'false'
BreakBeforeBraces: Allman
ColumnLimit: '0'
FixNamespaceComments: 'false'
IndentPPDirectives: BeforeHash
IndentWidth: '2'
IndentWrappedFunctionNames: 'true'
KeepEmptyLinesAtTheStartOfBlocks: 'false'
MaxEmptyLinesToKeep: '1'
NamespaceIndentation: All
SortIncludes: 'false'
TabWidth: '2'
UseTab: Never

...

```

# References

- [My favorite C programming practices.](https://github.com/mcinglis/c-style)
- [Recommended C style and coding rules](https://github.com/MaJerle/c-code-style)

[^so_const]: [c++ - Should I use const for local variables for better code optimization? - Stack Overflow](https://stackoverflow.com/questions/10747927/should-i-use-const-for-local-variables-for-better-code-optimization)
[^ge_const]: [[106] const 變數有助理解程式碼並協助編譯器優化](https://samtsai.org/2016/07/24/106-const-bian-shu-you-zhu-li-jie-cheng-shi-ma-bing-xie-zhu-bian-yi-qi-you-hua/)

[^so_const_def]: [What is the difference between #define and const?](https://stackoverflow.com/a/6442372/25089375)
[^ge_linux_max]: [Linux 核心原始程式碼巨集: max, min - HackMD](https://hackmd.io/@sysprog/linux-macro-minmax)
[^one_interface]: [常見的 Java Interface 錯誤用法](https://kaisheng714.github.io/articles/anti-pattern-of-java-interface-impl-style)
