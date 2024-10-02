---
title: '[STM32學習記錄-7] AS5047P 旋轉位置感測器/磁性編碼器使用教學'
author: ZiTe
tags:
  - 電子電路
  - 教學
  - STM32
  - C/C++
  - 程式
  - 嵌入式
categories: ["STM32學習記錄"]
date: 2022-04-16 00:09:00
comments: true
toc: true
draft: false
aliases: ["/2022/04/learningstm32-as5047p/"]
---

# 前言

[AMS AS5047P](https://ams.com/en/as5047p) 是一款旋轉位置感測器/磁性編碼器。

它擁有包含 SPI、ABI、UVW 及 PWM 的多種使用模式，及 14 位元的高解析度，和 28krpm 的高反應速度，還擁有動態角度誤差補償（Dynamic angle error compensation，DAEC），非常適合搭配馬達進行控制。

本文將以 NUCLEO-F446RE（STM32F446RE）與 STM32 HAL 作為示範，簡單介紹 AS5047P 的用法。本篇的範例程式有放在 [GitHub](https://github.com/ziteh/as5047p_driver)。

<!-- more -->

# SPI

AS5047P 透過 SPI 進行通訊。其對 SPI 的要求為：
- Mode = 1（CPOL = 0，CPHA = 1）
	- 空閒時，SCK 時鐘訊號為低電平（0）。
	- 資料在第二個邊緣取樣（即負緣）。
- CSn （Chip select）為低電平有效。
- 資料長度為 16 個位元。其中 MSB 為偶同位（Even parity）位元。
- 位元順序為 MSB 在前（MSB first）。
- SCK 最大速度為 10 MHz。
- 只支援從機模式（Slave operation mode）。

設定範例：
```c
static void SPI_Init(void)
{
  SPI_HandleTypeDef hspi1;

  hspi1.Instance = SPI1;
  hspi1.Init.Mode = SPI_MODE_MASTER;
  hspi1.Init.Direction = SPI_DIRECTION_2LINES;
  hspi1.Init.DataSize = SPI_DATASIZE_16BIT;
  hspi1.Init.CLKPolarity = SPI_POLARITY_LOW;
  hspi1.Init.CLKPhase = SPI_PHASE_2EDGE;
  hspi1.Init.NSS = SPI_NSS_SOFT;
  hspi1.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_16;
  hspi1.Init.FirstBit = SPI_FIRSTBIT_MSB;
  hspi1.Init.TIMode = SPI_TIMODE_DISABLE;
  hspi1.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
  hspi1.Init.CRCPolynomial = 10;

  if (HAL_SPI_Init(&hspi1) != HAL_OK)
  {
    Error_Handler();
  }
}
```

# 通訊格式

AS5047P 有 3 種 SPI 訊框格式。

## Command Frame

Bit | Name | 描述
-|-|-
15|PARC|偶同位（Even parity），使整個訊框的 `1` 為偶數個。
14|R/W|`0` 代表要寫入。`1` 代表要讀取。
13:0|ADDR| 要讀寫的暫存器位置。

> 讀取「NOP (`0x0000`)」暫存器等同一個 `nop`（no operation，無操作）指令。

## Read Data Frame

Bit | Name | 描述
-|-|-
15|PARC|偶同位（Even parity），使整個訊框的 `1` 為偶數個。
14|EF|`0` 代表沒有錯誤發生。`1` 代表有錯誤發生。
13:0|DATA| 資料。

要讀取資料時，先使用「Command Frame」傳輸要讀取的位置，AS5047P 會在 CS 上拉並重新下拉後的下一個讀取指令時，在 MISO 上傳輸「Read Data Frame」。

## Write Data Frame

Bit | Name | 描述
-|-|-
15|PARC|偶同位（Even parity），使整個訊框的 `1` 為偶數個。
14|0|永遠為 `0`。
13:0|DATA| 資料。

要寫入資料時，先使用「Command Frame」傳輸要寫入的位置，再使用「Write Data Frame」傳輸要寫入的資料。

當「Write Data Frame」在 MOSI 上傳輸時，AS5047P 會在 MISO 上傳輸該暫存器目前的值（舊的值），並在下一次的「Command Frame」在 MOSI 上傳輸時，AS5047P 會在 MISO 上傳輸該暫存器實際的值。

# 程式

完整的程式可以到 [GitHub:  ziteh/as5047p_driver](https://github.com/ziteh/as5047p_driver/tree/main/lib/AS5047P) 查看。

#### 位元操作
```c
#define BIT_MODITY(src, n, val) ((src) ^= (-(val) ^ (src)) & (1UL << (n)))
#define BIT_READ(src, n) (((src) >> (n)&1U))
#define BIT_TOGGLE(src, n) ((src) ^= 1UL << (n))
```

#### 傳輸「Command Frame」
```c
void as5047p_send_command(bool is_read_cmd, uint16_t address)
{
  uint16_t frame = address & 0x3FFF;

  /* R/W: 0 for write, 1 for read. */
  BIT_MODITY(frame, 14, is_read_cmd ? 1 : 0);

  /* Parity bit(even) calculated on the lower 15 bits. */
  if (!is_even_parity(frame))
  {
    BIT_TOGGLE(frame, 15);
  }

  as5047p_spi_transmit(frame);
}
```

#### 寫入資料到指定的暫存器
```c
void as5047p_send_data(uint16_t address, uint16_t data)
{
  uint16_t frame = data & 0x3FFF;

  /* Data frame bit 14 always low(0). */
  BIT_MODITY(frame, 14, 0);

  /* Parity bit(even) calculated on the lower 15 bits. */
  if (!is_even_parity(frame))
  {
    BIT_TOGGLE(frame, 15);
  }

  as5047p_send_command(false, address);
  as5047p_spi_transmit(frame);
}
```

#### 讀取資料自指定的暫存器
```c
uint16_t as5047p_read_data(uint16_t address)
{
  as5047p_send_command(true, address);
  uint16_t received_data = as5047p_spi_receive();
  return received_data;
}
```

#### 讀取角度資訊，可選擇是否啟用動態角度誤差補償（DAEC）

讀取「ANGLECOM (`0x3FFF`)」可取得有 DAEC 的角度數值，讀取「ANGLEUNC (`0x3FFE`)」可取得無 DAEC 的角度資訊。
```c
int as5047p_get_angle(bool with_daec, float *angle_degree)
{
  uint16_t address;
  if (with_daec)
  {
    /* Measured angle WITH dynamic angle error compensation(DAEC). */
    address = AS5047P_ANGLECOM;
  }
  else
  {
    /* Measured angle WITHOUT dynamic angle error compensation(DAEC). */
    address = AS5047P_ANGLEUNC;
  }

  uint16_t data = as5047p_read_data(address);
  if (BIT_READ(data, 14) == 0)
  {
    *angle_degree = (data & 0x3FFF) * (360.0 / 0x4000);
    return 0; /* No error occurred. */
  }
  return -1; /* Error occurred. */
}
```

#### 偶同位計算
```c
bool is_even_parity(uint16_t data)
{
  uint8_t shift = 1;
  while (shift < (sizeof(data) * 8))
  {
    data ^= (data >> shift);
    shift <<= 1;
  }
  return !(data & 0x1);
}
```

#### SPI 通訊
```c
void as5047p_spi_transmit(uint16_t data)
{
  delay(T_CSN_DELAY);
  as5047p_spi_select();
  as5047p_spi_send(data);
  as5047p_spi_deselect();
}

uint16_t as5047p_spi_receive(void)
{
  delay(T_CSN_DELAY);
  as5047p_spi_select();
  uint16_t data = as5047p_spi_read();
  as5047p_spi_deselect();
  return data;
}

void delay(volatile uint16_t t)
{
  while (t--)
  {
    __asm__("nop"); /* Do nothing. */
  }
}

void as5047p_spi_send(uint16_t data)
{
  HAL_SPI_Transmit(&hspi1, (uint8_t *)&data, 1, HAL_MAX_DELAY);
}

uint16_t as5047p_spi_read(void)
{
  uint16_t data = 0;
  HAL_SPI_Receive(&hspi1, (uint8_t *)&data, 1, HAL_MAX_DELAY);
  return data;
}

void as5047p_spi_select(void)
{
  HAL_GPIO_WritePin(AS5047P_SS_GPIO_Port, AS5047P_SS_Pin, GPIO_PIN_RESET);
}

void as5047p_spi_deselect(void)
{
  HAL_GPIO_WritePin(AS5047P_SS_GPIO_Port, AS5047P_SS_Pin, GPIO_PIN_SET);
}
```

> 若要在 STM32 HAL 以外的平臺使用的話，只需要修改 `as5047p_spi_send()`、`as5047p_spi_read()`、`void as5047p_spi_select()`、`as5047p_spi_deselect()` 這 4 個函式的實作就好了。

# 後記

最近在做馬達的閉迴路位置控制，因此買了這個 AS5047P 來用，就順便寫了本篇文章做記錄。而此程式我也有放在 GitHub 上：[ziteh/as5047p_driver](https://github.com/ziteh/as5047p_driver)

若有問題或內容有誤還請告知，謝謝！

# 相關連結

- LibOpenCM3 STM32 SPI 教學：[STM32 LibOpenCM3：SPI (Master mode) ](/posts/posts/libopencm3-stm32-24/)
- [AS5047P Datasheet](https://ams.com/documents/20143/36005/AS5047P_DS000324_3-00.pdf)
