title: '[自製QMK鍵盤-6] 無線分離式人體工學鍵盤Mitosis的分析與介紹'
author: ZiTe
tags:
  - DIY
  - 3C
categories:
  - '自製QMK鍵盤'
date: 2022-01-09 22:11:00
---

![▲ 此圖取自 [Mitosis 原作者的文章](https://imgur.com/a/mwTFj)。](https://i.imgur.com/JTzXTCD.jpeg)

# 前言

[Mitosis](https://github.com/qmk/qmk_firmware/tree/master/keyboards/mitosis) 是一款使用 [QMK](https://qmk.fm/) 作爲韌體所開發的無線分離式鍵盤，它不僅僅是與電腦之間無線，它的左右兩部分之間也沒有實體連線，可謂是「真 • 無線」。就我所知，有許多基於 QMK 的無線分離式鍵盤都是受到 Mitosis 的啓發。

本文將會概略性地分析並介紹 Mitosis 是如何做到無線的。

<!--more-->

# 硬體與基本架構

首先，Mitosis 是擁有並需要自製的專用接收器，而 QMK 實際上只在此接收器上運作。

Mitosis 的架構中，主要擁有這些硬體：
- 1 個 Pro Micro（ATmega32U4）。接收器的一部分，QMK 實際上只在 Pro Micro 上運作，以 USB 線連接電腦。
- 3 個 nRF51822。這是一個整合了 BLE（Bluetooth Low Energy，藍牙低功耗）功能的 SoC（System On Chip）。
	- 第 1 個 nRF51822 作爲接收器的一部分，負責接收來自左右兩部分鍵盤的訊號，並將其透過 UART 傳給 Pro Micro。
	- 第 2、3 個 nRF51822 分別在左右兩鍵盤上，負責讀取鍵盤上的按鍵狀態，並將其透過 BLE 傳給接收器的 nRF51822。

```
             PC
              |
            <USB>
              |
        Pro Micro(QMK)
              |
           <UART>
              |
         nRF51822(#1)
          /        \
       <BLE>        <BLE>
        /              \
  nRF51822(#2)        nRF51822(#3)
      |                   |
 Left Keyboard      Right Keyboard
```

可以看出，Mitosis 的架構其實很簡單。雖然這樣的架構要用上更多的 IC，以導致它感覺起來不夠精簡，但這也其容易達成、理解或修改。

總的來說，左右鍵盤上的 nRF51822 會處理各自的按鍵狀態，並各自將其透過 BLE 傳輸給接收器上的 nRF51822，接收器受到新的按鍵狀態後，會將左右部分的按鍵狀態組合在一起，並透過 UART 傳給 Pro Micro，Pro Micro 收到來自 UART 的封包後就解析按鍵狀態，並交由 QMK 處理。

# 程式

從基本架構可以得知，Mitosis 總共有 4 個 MCU（1 個 Pro Micro 的 ATmega32U4，3 個 nRF51822）,而它們執行的程式當然也不一樣，以下就一一介紹不同部分的程式。

## 左右手鍵盤（nRF51822）

首先，這部分的程式在：[reversebias/mitosis/mitosis-keyboard-basic/](https://github.com/reversebias/mitosis/tree/master/mitosis-keyboard-basic)。主要有：
- `main.c` 是主程式。
- `config/mitosis.h` 是包含了腳位設定的標頭檔。

左右手鍵盤上 nRF51822 的程式是同一個，僅透過 `#define COMPILE_RIGHT` 或 `#define COMPILE_LEFT` 來切換不同的腳位設定和 BLE 通道編號（Pipe number）而已。

在這裡有幾個重要的函數（僅列出函數名稱）：
- `read_keys()`
- `send_data()`
- `handler_maintenance()`
- `handler_debounce()`

### handler_debounce()

先看到 [`handler_debounce()` ](https://github.com/reversebias/mitosis/blob/f2bb956f8565762212d361a42f830390ef5c6845/mitosis-keyboard-basic/main.c#L115) 這個函數，它負責處理按鍵防彈跳（Debounce）。內容如下：

```c
// 1000Hz debounce sampling
static void handler_debounce(nrf_drv_rtc_int_type_t int_type)
{
    // debouncing, waits until there have been no transitions in 5ms (assuming five 1ms ticks)
    if (debouncing)
    {
        // if debouncing, check if current keystates equal to the snapshot
        if (keys_snapshot == read_keys())
        {
            // DEBOUNCE ticks of stable sampling needed before sending data
            debounce_ticks++;
            if (debounce_ticks == DEBOUNCE)
            {
                keys = keys_snapshot;
                send_data();
            }
        }
        else
        {
            // if keys change, start period again
            debouncing = false;
        }
    }
    else
    {
        // if the keystate is different from the last data
        // sent to the receiver, start debouncing
        if (keys != read_keys())
        {
            keys_snapshot = read_keys();
            debouncing = true;
            debounce_ticks = 0;
        }
    }

    // looking for 500 ticks of no keys pressed, to go back to deep sleep
    if (read_keys() == 0)
    {
        activity_ticks++;
        if (activity_ticks > ACTIVITY)
        {
            nrf_drv_rtc_disable(&rtc_maint);
            nrf_drv_rtc_disable(&rtc_deb);
        }
    }
    else
    {
        activity_ticks = 0;
    }
}
```

`handler_debounce()` 每秒會觸發 1000 次（也就是以 1000 Hz運作，[由 `RTC1` 處理](https://github.com/reversebias/mitosis/blob/f2bb956f8565762212d361a42f830390ef5c6845/mitosis-keyboard-basic/main.c#L180)）。

它會先判斷目前是否在防彈跳中（`if (debouncing)`），如果沒有的話會去判斷目前的按鍵狀態是否和最後一次一樣，如果不一樣代表有按鍵按下或放開了，透過 `read_keys()` 讀取目前的按鍵狀態，並儲存爲快照 `keys_snapshot`，同時開始防彈跳（將 `deboducing` 設爲 `true`）。

一旦開始防彈跳，它就會一直確認快照與目前的按鍵狀態是否一樣，一旦不一樣就停止防彈跳，若累計達到設定的防彈跳次數就會承認快照的按鍵狀態，並將快照的值給目前的鍵值 `keys`，並呼叫 `send_data()` 開始傳送。


### handler_maintenance()

```c
// 8Hz held key maintenance, keeping the reciever keystates valid
static void handler_maintenance(nrf_drv_rtc_int_type_t int_type)
{
    send_data();
}
```

此函數的功能顯而易見，就是以 8 Hz 的頻率次數呼叫 `send_data()` 傳送資料。此函數[由 RTC0 處理](https://github.com/reversebias/mitosis/blob/f2bb956f8565762212d361a42f830390ef5c6845/mitosis-keyboard-basic/main.c#L179)。

### send_data()
```c
// Assemble packet and send to receiver
static void send_data(void)
{
    data_payload[0] = ((keys & 1<<S01) ? 1:0) << 7 | \
                      ((keys & 1<<S02) ? 1:0) << 6 | \
                      ((keys & 1<<S03) ? 1:0) << 5 | \
                      ((keys & 1<<S04) ? 1:0) << 4 | \
                      ((keys & 1<<S05) ? 1:0) << 3 | \
                      ((keys & 1<<S06) ? 1:0) << 2 | \
                      ((keys & 1<<S07) ? 1:0) << 1 | \
                      ((keys & 1<<S08) ? 1:0) << 0;

    data_payload[1] = ((keys & 1<<S09) ? 1:0) << 7 | \
                      ((keys & 1<<S10) ? 1:0) << 6 | \
                      ((keys & 1<<S11) ? 1:0) << 5 | \
                      ((keys & 1<<S12) ? 1:0) << 4 | \
                      ((keys & 1<<S13) ? 1:0) << 3 | \
                      ((keys & 1<<S14) ? 1:0) << 2 | \
                      ((keys & 1<<S15) ? 1:0) << 1 | \
                      ((keys & 1<<S16) ? 1:0) << 0;

    data_payload[2] = ((keys & 1<<S17) ? 1:0) << 7 | \
                      ((keys & 1<<S18) ? 1:0) << 6 | \
                      ((keys & 1<<S19) ? 1:0) << 5 | \
                      ((keys & 1<<S20) ? 1:0) << 4 | \
                      ((keys & 1<<S21) ? 1:0) << 3 | \
                      ((keys & 1<<S22) ? 1:0) << 2 | \
                      ((keys & 1<<S23) ? 1:0) << 1 | \
                      0 << 0;

    nrf_gzll_add_packet_to_tx_fifo(PIPE_NUMBER, data_payload, TX_PAYLOAD_LENGTH);
}
```

此函數就是將目前的鍵值 `keys` 打包成資料封包並傳輸出去。`keys` 的值會在 `handler_debounce()` 中更新。

`PIPE_NUMBER` 的值左右鍵盤不同（在 [`mitosis.h`](https://github.com/reversebias/mitosis/blob/f2bb956f8565762212d361a42f830390ef5c6845/mitosis-keyboard-basic/config/mitosis.h) 中定義），接收器藉此判斷收到的資料是來自左還是右鍵盤。

###  read_keys()

```c
// Return the key states, masked with valid key pins
static uint32_t read_keys(void)
{
    return ~NRF_GPIO->IN & INPUT_MASK;
}
```

此函數的功能也是很直觀，就是讀取並回傳所有的按鍵狀態。

從這裡也可以得知，Mitosis 是**不用矩陣掃描**（Matrix scan）的，畢竟它的按鍵數本來就比較少（左右各 23 鍵），又是分離式的鍵盤，一個 nRF51822 的 GPIO 足以分配到每個按鍵上，自然不用掃描，直接讀值就好。

## 接收器（nRF51822）

這部分的程式在：[reversebias/mitosis/mitosis-receiver-basic/](https://github.com/reversebias/mitosis/tree/master/mitosis-receiver-basic)。主要有：
- `main.c` 是主程式。

其中有幾個重要的函數（僅列出函數名稱）：
- `nrf_gzll_host_rx_data_ready()`
- `main()`

### nrf_gzll_host_rx_data_ready()

```c
// If a data packet was received, identify half, and throw flag
void nrf_gzll_host_rx_data_ready(uint32_t pipe, nrf_gzll_host_rx_info_t rx_info)
{   
    uint32_t data_payload_length = NRF_GZLL_CONST_MAX_PAYLOAD_LENGTH;
    
    if (pipe == 0)
    {
        packet_received_left = true;
        left_active = 0;
        // Pop packet and write first byte of the payload to the GPIO port.
        nrf_gzll_fetch_packet_from_rx_fifo(pipe, data_payload_left, &data_payload_length);
    }
    else if (pipe == 1)
    {
        packet_received_right = true;
        right_active = 0;
        // Pop packet and write first byte of the payload to the GPIO port.
        nrf_gzll_fetch_packet_from_rx_fifo(pipe, data_payload_right, &data_payload_length);
    }
    
    // not sure if required, I guess if enough packets are missed during blocking uart
    nrf_gzll_flush_rx_fifo(pipe);

    //load ACK payload into TX queue
    ack_payload[0] =  0x55;
    nrf_gzll_add_packet_to_tx_fifo(pipe, ack_payload, TX_PAYLOAD_LENGTH);
}
```

這是接收處理函數。當接收到資料時，以 `pipe` 判斷這是來自左還是右鍵盤，並設定好資料。

### main()

以下省略一些不重要的程式：
```c
int main(void)
{
    /* 省略部分程式 */
	
    // main loop
    while (true)
    {
        // detecting received packet from interupt, and unpacking
        if (packet_received_left)
        {
            packet_received_left = false;

            data_buffer[0] = ((data_payload_left[0] & 1<<3) ? 1:0) << 0 |
                             ((data_payload_left[0] & 1<<4) ? 1:0) << 1 |
                             ((data_payload_left[0] & 1<<5) ? 1:0) << 2 |
                             ((data_payload_left[0] & 1<<6) ? 1:0) << 3 |
                             ((data_payload_left[0] & 1<<7) ? 1:0) << 4;

            data_buffer[2] = ((data_payload_left[1] & 1<<6) ? 1:0) << 0 |
                             ((data_payload_left[1] & 1<<7) ? 1:0) << 1 |
                             ((data_payload_left[0] & 1<<0) ? 1:0) << 2 |
                             ((data_payload_left[0] & 1<<1) ? 1:0) << 3 |
                             ((data_payload_left[0] & 1<<2) ? 1:0) << 4;

            data_buffer[4] = ((data_payload_left[1] & 1<<1) ? 1:0) << 0 |
                             ((data_payload_left[1] & 1<<2) ? 1:0) << 1 |
                             ((data_payload_left[1] & 1<<3) ? 1:0) << 2 |
                             ((data_payload_left[1] & 1<<4) ? 1:0) << 3 |
                             ((data_payload_left[1] & 1<<5) ? 1:0) << 4;

            data_buffer[6] = ((data_payload_left[2] & 1<<5) ? 1:0) << 1 |
                             ((data_payload_left[2] & 1<<6) ? 1:0) << 2 |
                             ((data_payload_left[2] & 1<<7) ? 1:0) << 3 |
                             ((data_payload_left[1] & 1<<0) ? 1:0) << 4;

            data_buffer[8] = ((data_payload_left[2] & 1<<1) ? 1:0) << 1 |
                             ((data_payload_left[2] & 1<<2) ? 1:0) << 2 |
                             ((data_payload_left[2] & 1<<3) ? 1:0) << 3 |
                             ((data_payload_left[2] & 1<<4) ? 1:0) << 4;
        }

        if (packet_received_right)
        {
            packet_received_right = false;
            
            data_buffer[1] = ((data_payload_right[0] & 1<<7) ? 1:0) << 0 |
                             ((data_payload_right[0] & 1<<6) ? 1:0) << 1 |
                             ((data_payload_right[0] & 1<<5) ? 1:0) << 2 |
                             ((data_payload_right[0] & 1<<4) ? 1:0) << 3 |
                             ((data_payload_right[0] & 1<<3) ? 1:0) << 4;

            data_buffer[3] = ((data_payload_right[0] & 1<<2) ? 1:0) << 0 |
                             ((data_payload_right[0] & 1<<1) ? 1:0) << 1 |
                             ((data_payload_right[0] & 1<<0) ? 1:0) << 2 |
                             ((data_payload_right[1] & 1<<7) ? 1:0) << 3 |
                             ((data_payload_right[1] & 1<<6) ? 1:0) << 4;

            data_buffer[5] = ((data_payload_right[1] & 1<<5) ? 1:0) << 0 |
                             ((data_payload_right[1] & 1<<4) ? 1:0) << 1 |
                             ((data_payload_right[1] & 1<<3) ? 1:0) << 2 |
                             ((data_payload_right[1] & 1<<2) ? 1:0) << 3 |
                             ((data_payload_right[1] & 1<<1) ? 1:0) << 4;

            data_buffer[7] = ((data_payload_right[1] & 1<<0) ? 1:0) << 0 |
                             ((data_payload_right[2] & 1<<7) ? 1:0) << 1 |
                             ((data_payload_right[2] & 1<<6) ? 1:0) << 2 |
                             ((data_payload_right[2] & 1<<5) ? 1:0) << 3;

            data_buffer[9] = ((data_payload_right[2] & 1<<4) ? 1:0) << 0 |
                             ((data_payload_right[2] & 1<<3) ? 1:0) << 1 |
                             ((data_payload_right[2] & 1<<2) ? 1:0) << 2 |
                             ((data_payload_right[2] & 1<<1) ? 1:0) << 3;
        }

        // checking for a poll request from QMK
        if (app_uart_get(&c) == NRF_SUCCESS && c == 's')
        {
            // sending data to QMK, and an end byte
            nrf_drv_uart_tx(data_buffer,10);
            app_uart_put(0xE0);

            /* 省略部分程式 */
        }
        // allowing UART buffers to clear
        nrf_delay_us(10);
        
        /* 省略部分程式 */
    }
}
```

這裡就是來負責將 BLE 接收到的左右鍵盤按鍵狀態重新打包，只要確認了來自 QMK 的輪詢請求（`s`），就透過 UART 傳送出去。

傳給 QMK 的封包除了按鍵狀態外，還有一個 `0xE0` 作爲結束封包。

## QMK / 接收器（Pro Micro）

這部分的程式在：[qmk/qmk_firmware/keyboards/mitosis](https://github.com/qmk/qmk_firmware/tree/master/keyboards/mitosis)。主要有：
- `rules.mk` 
- `config.h` 
- `matrix.c`

### rules.mk

```mk
# MCU name
MCU = atmega32u4

# Bootloader selection
BOOTLOADER = caterina

# Build Options
#    change yes to no to disable
#
BOOTMAGIC_ENABLE = no  # Enable Bootmagic Lite
MOUSEKEY_ENABLE = yes  # Mouse keys
EXTRAKEY_ENABLE = yes  # Audio control and System control
CONSOLE_ENABLE = yes   # Console for debug
COMMAND_ENABLE = yes   # Commands for debug and configuration
CUSTOM_MATRIX = yes    # Remote matrix from the wireless bridge
NKRO_ENABLE = yes      # Enable N-Key Rollover
# BACKLIGHT_ENABLE = yes  # Enable keyboard backlight functionality
UNICODE_ENABLE = yes   # Unicode

# # project specific files
SRC += matrix.c serial_uart.c
```

這裡可以注意到作者使用了 QMK 的「[Custom Matrix](https://docs.qmk.fm/#/custom_matrix)」功能 （`CUSTOM_MATRIX = yes` 及 `SRC += matrix.c`），因爲 Mitosis 不像一般的鍵盤透過矩陣掃描得知按鍵狀態，而是讀取來自 nRF51822 透過 UART 傳送的封包。

### config.h

`config.h` 主要是設定 QMK 中的各種東西，稍微熟悉 QMK 的人都不陌生。這裡僅列出重要的地方，也就是 UART 的相關設定：

```c
//UART settings for communication with the RF microcontroller
#define SERIAL_UART_BAUD 1000000
#define SERIAL_UART_RXD_PRESENT (UCSR1A & _BV(RXC1))
#define SERIAL_UART_INIT_CUSTOM       \
    /* enable TX and RX */            \
    UCSR1B = _BV(TXEN1) | _BV(RXEN1); \
    /* 8-bit data */                  \
    UCSR1C = _BV(UCSZ11) | _BV(UCSZ10);
```

### matrix.c

`matrix.c` 是爲了使用 QMK 的「[Custom Matrix](https://docs.qmk.fm/#/custom_matrix)」功能所必要的檔案。

重點在 `matrix_scan()`：
```c
uint8_t matrix_scan(void)
{
    uint32_t timeout = 0;

    //the s character requests the RF slave to send the matrix
    SERIAL_UART_DATA = 's';

    //trust the external keystates entirely, erase the last data
    uint8_t uart_data[11] = {0};

    //there are 10 bytes corresponding to 10 columns, and an end byte
    for (uint8_t i = 0; i < 11; i++) {
        //wait for the serial data, timeout if it's been too long
        //this only happened in testing with a loose wire, but does no
        //harm to leave it in here
        while(!SERIAL_UART_RXD_PRESENT){
            timeout++;
            if (timeout > 10000){
                break;
            }
        }
        uart_data[i] = SERIAL_UART_DATA;
    }

    //check for the end packet, the key state bytes use the LSBs, so 0xE0
    //will only show up here if the correct bytes were recieved
    if (uart_data[10] == 0xE0)
    {
        //shifting and transferring the keystates to the QMK matrix variable
        for (uint8_t i = 0; i < MATRIX_ROWS; i++) {
            matrix[i] = (uint16_t) uart_data[i*2] | (uint16_t) uart_data[i*2+1] << 5;
        }
    }


    matrix_scan_quantum();
    return 1;
}
```

首先此函數會傳送一個 `s` 以請求 nRF51822 開始傳送按鍵狀態封包。

接著，一個 `for` 迴圈會處理來自 UART 的按鍵狀態封包。當接收完成後，判斷結束封包是否正確（爲 `0xE0`），如果沒問題的話就將按鍵狀態封包處理並賦值給 `matrix[]`，接下來就是讓 QMK 去處理了。

# 結語

本次簡單地介紹 Mitosis 鍵盤是如和達成無線的，但我其實沒用過 nRF51822，對 QMK 的瞭解也還很粗淺，很多細節沒辦法講解，而如果上述內容有任何錯誤也請指正。

撰寫本文時的 Mitosis 相關 repo 資訊：
- [reversebias/mitosis](https://github.com/reversebias/mitosis)
	- nRF51822 的程式
	- commit：[`f2bb956f8565762212d361a42f830390ef5c6845`](https://github.com/reversebias/mitosis/commit/f2bb956f8565762212d361a42f830390ef5c6845)
- [qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/tree/master/keyboards/mitosis)
	- QMK 程式
	- commit：[`f718a10889e6adf33f3fc2f41b61cad7fe9e0c2e`](https://github.com/qmk/qmk_firmware/commit/f718a10889e6adf33f3fc2f41b61cad7fe9e0c2e)

# 相關文章

- 本文的系列：[自製QMK鍵盤](https://ziteh.github.io/categories/%E8%87%AA%E8%A3%BDQMK%E9%8D%B5%E7%9B%A4/)
- [Mitosis 原作者的組裝記錄](https://imgur.com/a/mwTFj)
- [QMK 官方文件](https://docs.qmk.fm/#/)
