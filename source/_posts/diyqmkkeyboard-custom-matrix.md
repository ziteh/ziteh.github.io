---
title: '[自製QMK鍵盤-番外] 在Custom Matrix中使用UART與控制滑鼠遊標，並加上無線模組'
author: ZiTe
tags:
  - DIY
  - 3C
  - 教學
  - QMK
categories: ["自製QMK鍵盤"]
date: 2022-02-05 21:40:00
comments: true
toc: true
draft: false
aliases: ["/2022/02/diyqmkkeyboard-7/", "/posts/diyqmkkeyboard-7/"]
---

在[這篇文章](/posts/mitosis-keyboard-intro)中我簡單地介紹了 Mitosis 這個基於 QMK 的無線分離式人體工學鍵盤，而在這篇文章中，我將參考其架構來做出一個我自己的無線分離式鍵盤的雛形。

要達成這樣的功能，會需要用到 QMK 的 [Custom Matrix](https://docs.qmk.fm/#/custom_matrix) 和 UART 功能，並且使用 LoRa 無線通訊模組 HC-12 來暫時替代藍牙作為無線通訊。

![](https://blogger.googleusercontent.com/img/a/AVvXsEh23-UqK5AQeWB-A4o5h_LPG0SIaIlC-GztC4eKfsTX8H2FMCodib8pZtAbyoWirD0ZXoQBExe1vncnQf1nYHZTyfLCW4fDuxhrmR8I608NxoxttwwQi9YyPmhMMvBXkEwbsuYppXw5H61Smc1ApNGVr6Lu-h5Lpu6qFU_DDWL-9Ha0zI1R6pLUSmUw=s16000)

<!--more-->

# 在 QMK 中使用 Custom Matrix 與 UART

由於 Mitosis 不是和一般的鍵盤一樣透過按鍵掃描來取得按鍵狀態，而是藉由 UART 通訊，所以我們需要改變 QMK 的掃描程式，改成使用 UART 取得按鍵狀態。以下將會說明要如何達成。

## rules.mk

首先，要完整地啓用「[Custom Matrix](https://docs.qmk.fm/#/custom_matrix)」功能的話，要在 `rules.mk` 中增加 `CUSTOM_MATRIX = yes` 與 `SRC += matrix.c`，並在鍵盤資料夾中增加 `matrix.c` 檔案。而自定的掃描程式就要按照格式寫在 `matrix.c` 中。

然後，因為我們還會需要使用 UART 功能，所以在 `rules.mk` 中還要增加 `SRC += uart.c` 。因此，`rules.mk` 大概會長這樣：

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

# Bootloader selection
#   Teensy       halfkay
#   Pro Micro    caterina
#   Atmel DFU    atmel-dfu
#   LUFA DFU     lufa-dfu
#   QMK DFU      qmk-dfu
#   ATmega32A    bootloadHID
#   ATmega328P   USBasp
BOOTLOADER = caterina

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
NKRO_ENABLE ?= yes		# USB Nkey Rollover - if this doesn't work, see here: https://github.com/tmk/tmk_keyboard/wiki/FAQ#nkro-doesnt-work
BACKLIGHT_ENABLE ?= no  # Enable keyboard backlight functionality
AUDIO_ENABLE ?= no
RGBLIGHT_ENABLE ?= no
ENABLE_VIA = yes
POINTING_DEVICE_ENABLE = yes
CUSTOM_MATRIX = yes

SRC += matrix.c uart.c
```

## matrix.c

自行新增的程式檔案 `matrix.c` 是用來放自定的掃描程式的，我們要在掃描程式中使用 UART 進行通訊。

根據 QMK 文件的說明，`matrix.c` 需要實作以下的函式：

```c
/* Implement the following functions in a matrix.c file in your keyboard folder: */
matrix_row_t matrix_get_row(uint8_t row) {
    // TODO: return the requested row data
}

void matrix_print(void) {
    // TODO: use print() to dump the current matrix state to console
}

void matrix_init(void) {
    // TODO: initialize hardware and global matrix state here

    // Unless hardware debouncing - Init the configured debounce routine
    debounce_init(MATRIX_ROWS);

    // This *must* be called for correct keyboard behavior
    matrix_init_quantum();
}

uint8_t matrix_scan(void) {
    bool matrix_has_changed = false;

    // TODO: add matrix scanning routine here

    // Unless hardware debouncing - use the configured debounce routine
    debounce(raw_matrix, matrix, MATRIX_ROWS, changed);

    // This *must* be called for correct keyboard behavior
    matrix_scan_quantum();

    return matrix_has_changed;
}

/* And also provide defaults for the following callbacks: */
__attribute__((weak)) void matrix_init_kb(void) { matrix_init_user(); }
__attribute__((weak)) void matrix_scan_kb(void) { matrix_scan_user(); }
__attribute__((weak)) void matrix_init_user(void) {}
__attribute__((weak)) void matrix_scan_user(void) {}
```

對我們來說，只需要注意 `matrix_init()` 與 `matrix_scan()` 這兩個函式就好了。`matrix_init()` 就是初始化矩陣掃描（只會被呼叫一次），我們要在此函式中完成 UART 的初始化，而 `matrix_scan()` 就是矩陣掃描的程式，也就是每次要進行掃描是要執行的程式，我們要在此函式中接收 UART 的封包並告訴 QMK 有哪些按鍵狀態改變了（被壓下或釋放）。

一個簡單的測試程式大概長這樣：（我根據 Mitosis 的程式進行修改的，未檢查是否有不必要的程式）

```c
/*
Copyright 2012 Jun Wako
Copyright 2014 Jack Humbert

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
#include <stdint.h>
#include <stdbool.h>
#if defined(__AVR__)
#    include <avr/io.h>
#endif
#include "wait.h"
#include "print.h"
#include "debug.h"
#include "util.h"
#include "matrix.h"
#include "timer.h"
#include "uart.h"
//#include "quantum.h"

#if (MATRIX_COLS <= 8)
#    define print_matrix_header() print("\nr/c 01234567\n")
#    define print_matrix_row(row) print_bin_reverse8(matrix_get_row(row))
#    define matrix_bitpop(i) bitpop(matrix[i])
#    define ROW_SHIFTER ((uint8_t)1)
#elif (MATRIX_COLS <= 16)
#    define print_matrix_header() print("\nr/c 0123456789ABCDEF\n")
#    define print_matrix_row(row) print_bin_reverse16(matrix_get_row(row))
#    define matrix_bitpop(i) bitpop16(matrix[i])
#    define ROW_SHIFTER ((uint16_t)1)
#elif (MATRIX_COLS <= 32)
#    define print_matrix_header() print("\nr/c 0123456789ABCDEF0123456789ABCDEF\n")
#    define print_matrix_row(row) print_bin_reverse32(matrix_get_row(row))
#    define matrix_bitpop(i) bitpop32(matrix[i])
#    define ROW_SHIFTER ((uint32_t)1)
#endif

/* matrix state(1:on, 0:off) */
static matrix_row_t matrix[MATRIX_ROWS];

__attribute__((weak)) void matrix_init_kb(void) { matrix_init_user(); }
__attribute__((weak)) void matrix_scan_kb(void) { matrix_scan_user(); }
__attribute__((weak)) void matrix_init_user(void) {}
__attribute__((weak)) void matrix_scan_user(void) {}

inline uint8_t matrix_rows(void) { return MATRIX_ROWS; }
inline uint8_t matrix_cols(void) { return MATRIX_COLS; }

void matrix_init(void) {
    uart_init(9600);
    matrix_init_quantum();  // This *must* be called for correct keyboard behavior.
}

uint8_t matrix_scan(void) {
    if (uart_available()) {
        uint8_t indata = uart_read();
        switch (indata) {
            case 0x00:
                matrix[0] = 0;
                break;

            case 0x01:
                matrix[0] = 1;
                break;

            case 0x10:
                matrix[1] = 0;
                break;

            case 0x11:
                matrix[1] = 1;
                break;

            default:
                break;
        }
    }

    matrix_scan_quantum();  // This *must* be called for correct keyboard behavior.
    return 1;
}

inline bool matrix_is_on(uint8_t row, uint8_t col) { return (matrix[row] & ((matrix_row_t)1 << col)); }

inline matrix_row_t matrix_get_row(uint8_t row) { return matrix[row]; }

void matrix_print(void) {
    print_matrix_header();

    for (uint8_t row = 0; row < MATRIX_ROWS; row++) {
        print_hex8(row);
        print(": ");
        print_matrix_row(row);
        print("\n");
    }
}

uint8_t matrix_key_count(void) {
    uint8_t count = 0;
    for (uint8_t i = 0; i < MATRIX_ROWS; i++) {
        count += matrix_bitpop(i);
    }
    return count;
}
```

上面這段程式比較重要的有幾點：
- `#include "uart.h"`：引用 QMK 的 UART 功能，否則會編譯錯誤。
- `uart_init(9600)`：在 `matrix_init()` 中初始化 UART，並將鮑率（Baud Rate）設定為 9600 bps。
- `uart_available()`：有用過 Arduino 的 Serial Port 的人應該都看得懂這一段，就是只要 UART 的接收緩衝區有值（有接收到資料），就使用 `uart_read()` 將收到的資料讀出，在透過 `switch-case` 來處理並改寫 `matrix[]` 的值，以完成按鍵狀態的更新。

## 利用 QMK 移動滑鼠遊標

因為我要做的無線分離式鍵盤上預計裝有軌跡球，所以我也一併測試了 QMK 要如何控制滑鼠遊標。

首先，在 `rules.mk` 中增加 `MOUSEKEY_ENABLE = yes`、`POINTING_DEVICE_ENABLE = yes` 和 `POINTING_DEVICE_DRIVER = custom` 就可以啓用滑鼠與遊標的相關功能。

在 `matrix.c` 中加入 `#include "quantum.h"`，並將剛剛的 `matrix_scan()` 的程式改成：

```c
#include "quantum.h"

uint8_t matrix_scan(void) {
    if (uart_available()) {
            uint8_t indata = uart_read();
            report_mouse_t report = {};
            report.x = (int8_t)indata;
            pointing_device_set_report(report);
            pointing_device_send();
        }
    }

    matrix_scan_quantum();
    return 1;
}
```

其中，`report_mouse_t` 就是 QMK 中滑鼠遊標的 Data type，其原型為：
```c
// File：qmk_firmware/tmk_core/protocol/report.h
// URL：https://github.com/qmk/qmk_firmware/blob/master/tmk_core/protocol/report.h

typedef struct {
#ifdef MOUSE_SHARED_EP
    uint8_t report_id;
#endif
    uint8_t buttons;
    int8_t  x;
    int8_t  y;
    int8_t  v;
    int8_t  h;
} __attribute__((packed)) report_mouse_t;
```

- `x` 與 `y` 分別代表滑鼠遊標 X 軸與 Y 軸移動的距離，範圍是 `-128 ~ 127`。
- `v` 與 `h` 代表滑鼠滾輪垂直與水平滾動的距離，範圍是 `-128 ~ 127`。
- `buttons` 代表各個滑鼠按鈕按下的情況。

# LoRa 無線通訊模組 HC-12

因為我手邊沒有其它適合的無線通訊模組，所以就先拿「HC-12」這款 LoRa 模組來使用。

這個模組的好處是使用簡單方便，就自己把它當成一般的 UART 就好，Tx 與 Rx 接好，不用特別設定什麼就可以無線通訊了。

而我用來控制 HC-12 的是 Nucleo-F302R8（STM32F302R8），因為只是要簡單的測試無線通訊及 QMK，所以就寫了一個按下按鈕會透過 UART 傳送特定資料的程式作為測試。STM32 韌體函式庫使用「libopencm3」，IDE 為「PlatformIO for VS Code」。

```c
/**
 * @file   main.c
 */

#define CFG_0
//#define CFG_1

#include <libopencm3/stm32/rcc.h>
#include <libopencm3/stm32/gpio.h>
#include <libopencm3/stm32/usart.h>

#define USART (USART2)

/* USART2-Tx = PA2 */
#define USART_TX_PORT (GPIOA)
#define USART_TX_PIN (GPIO2)

/* User-LED = PB13 */
#define LED_PORT (GPIOB)
#define LED_PIN (GPIO13)

/* User-Button = PC13 */
#define BUTTON_PORT (GPIOC)
#define BUTTON_PIN (GPIO13)

uint8_t state = 0;

void rcc_setup(void)
{
  rcc_periph_clock_enable(RCC_GPIOA);
  rcc_periph_clock_enable(RCC_GPIOB);
  rcc_periph_clock_enable(RCC_GPIOC);
  rcc_periph_clock_enable(RCC_USART2);
}

void usart_setup(void)
{
  /* Setup Tx pin. */
  gpio_mode_setup(USART_TX_PORT, GPIO_MODE_AF, GPIO_PUPD_NONE, USART_TX_PIN);
  gpio_set_af(USART_TX_PORT, GPIO_AF7, USART_TX_PIN);

  /* Setup UART config with 9600, 8-N-1. */
  usart_set_baudrate(USART, 9600);
  usart_set_databits(USART, 8);
  usart_set_stopbits(USART, USART_STOPBITS_1);
  usart_set_parity(USART, USART_PARITY_NONE);
  usart_set_flow_control(USART, USART_FLOWCONTROL_NONE);
  usart_set_mode(USART, USART_MODE_TX);

  /* Enable. */
  usart_enable(USART);
}

void led_setup(void)
{
  gpio_mode_setup(LED_PORT, GPIO_MODE_OUTPUT, GPIO_PUPD_NONE, LED_PIN);
  gpio_set_output_options(LED_PORT, GPIO_OTYPE_PP, GPIO_OSPEED_2MHZ, LED_PIN);
}

void button_setup(void)
{
  gpio_mode_setup(BUTTON_PORT, GPIO_MODE_INPUT, GPIO_PUPD_NONE, BUTTON_PIN);
}

int main(void)
{
  rcc_setup();
  led_setup();
  button_setup();
  usart_setup();

  usart_send_blocking(USART, 'O');
  usart_send_blocking(USART, 'K');
#if defined(CFG_0)
  usart_send_blocking(USART, '0');
#elif defined(CFG_1)
  usart_send_blocking(USART, '1');
#else
#error CFG_0 or CFG_1
#endif
  usart_send_blocking(USART, '\r');
  usart_send_blocking(USART, '\n');

  while (1)
  {
    if (gpio_get(BUTTON_PORT, BUTTON_PIN) == 0)
    {
      // Pressed.
      gpio_set(LED_PORT, LED_PIN);

#if defined(CFG_0)
      usart_send_blocking(USART, 0x01);
#elif defined(CFG_1)
      usart_send_blocking(USART, 0x11);
#else
#error CFG_0 or CFG_1
#endif
state = 1;
    }
    else if(state != 0)
    {
      // Not pressed.
      gpio_clear(LED_PORT, LED_PIN);
#if defined(CFG_0)
      usart_send_blocking(USART, 0x00);
#elif defined(CFG_1)
      usart_send_blocking(USART, 0x10);
#else
#error CFG_0 or CFG_1
#endif
state = 0;
    }
  }

  return 0;
}
```


最終效果如影片所示：
<iframe width="560" height="315" src="https://www.youtube.com/embed/L6DrpNg0moA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 結語

這次簡單地分享了 QMK 使用 Custom Matrix、UART 和控制滑鼠遊標的方法，有些功能我自己也是找了不少資料才知道要怎麼做，並且也測試了很多次。

然而對 QMK 的瞭解也還很粗淺，很多細節沒辦法講解，而如果上述內容有任何錯誤也請指正。

# 相關文章

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [Mitosis 無線分離式鍵盤介紹](/posts/mitosis-keyboard-intro)
- [QMK 官方文件](https://docs.qmk.fm/#/)
