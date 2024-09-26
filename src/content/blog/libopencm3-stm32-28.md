---
title: 'STM32 LibOpenCM3 尋找與移植函式庫'
author: ZiTe
tags:
  - STM32
  - LibOpenCM3
  - 教學
categories: ["簡單入門 LibOpenCM3 STM32 嵌入式系統開發"]
date: 2022-10-11 09:46:00
comments: true
toc: true
draft: false
aliases: ["/2022/10/libopencm3-stm32-28/"]
---

# 前言
在使用 STM32 的過程中，一定會搭配許多不同的模組使用，像是各種感測器或額外的通訊模組等，但是實際搜尋 GitHub 就會發現很難找到基於 LibOpenCM3 寫的 Library。若是很簡單的模組大不了可以看一下 Datasheet 就自己寫函式庫算了，但只要稍微複雜一點的模組，自己重寫一個 Library 的效率實在是太低了。

在 GitHub 搜尋「XXX模組 library」或「XXX模組 driver」就會發現找到最多的通常是專門寫給 Arduino 的，再來可能會有一些是 STM32 HAL 的。很明顯這些 Library 都沒辦法直接搭配 LibOpenCM3 使用。但是我們可以透過修改這些現成的 Library，將它們移植到 LibOpenCM3 上，甚至將其改成平臺無關（Platform Independent）的通用 Library。

若原始 Library 寫得好的話，只要簡單修改幾行就可以讓它可以用 LibOpenCM3 了，絕對比自己看 Datasheet 重寫一個 Library 還快。

而這篇文章將會示範我如何將一個 [MCP2515](https://www.microchip.com/en-us/product/MCP2515) Arduino Library 修改成 Platform Independent 的 Library，讓它可以搭配 LibOpenCM3 甚至任何平臺或框架使用。

<!--more-->

# 挑選 Library
首先要選擇要以哪個 Library 會基礎進行修改。

如前言所述，GitHub 上最多的搜尋結果通常是 Arduino 的。Arduino 的 Library 基本上就是用 C++ 寫的，而且總會有幾個 repo 星星很多，代表這個 Library 可能很多人在用，所以它的 API 或功能應該比較完整，Bug 也比較少。這種就很適合拿來修改。

再來還有一個很重要的是要確認該 Library 的授權許可（License），Open-Source License 有很多種，每一種的限制都不同，這部分一定要看清楚該 License 對於修改或再發佈等行為的限制和要求是什麼。

在這部分，選擇以 [MIT License](https://opensource.org/licenses/MIT) 發佈的 Library 基本上是最方便的。MIT License 是一個非常寬鬆的 License，基本上只有要求要明確註明著作權（Copyright）和 MIT License 就可以了。

MIT License 大概長這樣：
```
MIT License

Copyright (c) <YEAR> <FULLNAME>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

而在這裡，我選擇 [autowp/arduino-mcp2515](https://github.com/autowp/arduino-mcp2515) 作為我要修改的 Library。它是以 MIT License 授權並發佈的 Arduino Library，目前有 447 顆星，算是滿熱門的 repo。

這個 Library 主要有 3 個程式檔案：
- `mcp2515.cpp`
- `mcp2515.h`
- `can.h`

# 修改 Library
有了基底 Library 就可以開始修改了。

首先是 `#include` 的部分。`mcp2515.cpp` 中有引入 `Arduino.h`，而 `mcp2515.h` 中有引入 `SPI.h`，先把這些刪除。

MCP2515 是一個以 SPI 通訊介面操作的 IC，因此我們要把原本的 Arduino SPI 操作改掉。

仔細觀察就會發現，實際要替換或修改的函式只有 4 個：
- `startSPI()`：初始化 SPI 配置並下拉 CS Pin 以選擇 MCP2515。
- `endSPI()`：拉高 CS Pin 以取消選擇 MCP2515 並結束 SPI 通訊。
- `SPI.transfer()`：進行 SPI 的雙向資料傳輸。
- `delay()`

> `memset()` 與 `memcpy()` 應該也會提示找不到，這部分只要引入 [`<cstring>`](https://cplusplus.com/reference/cstring/) 就可以了。

在實際修改前，我們先到 `.h` 檔，並在 Class `MCP2515` 中增加一些 member：
```cpp
class MCP2515
{
  public:
    typedef void (*spiSelect_t)(void);
    typedef void (*spiDeselect_t)(void);
    typedef uint8_t (*spiTransfer_t)(uint8_t data);
    typedef void (*delay_t)(uint32_t ms);

/* 省略部分程式 */

  private:
    spiSelect_t spiSelect;
    spiDeselect_t spiDeselect;
    spiTransfer_t spiTransfer;
    delay_t delay;

/* 省略部分程式 */
```

這幾個就是上面我們要替換或修改的函式，我用 `typedef` 定義好它們，方便後續傳入。

再來，要修改建構子，讓我們可以把函式傳進來：
```cpp
// mcp2515.h
MCP2515(spiSelect_t spiSelectFun,
        spiDeselect_t spiDeselectFun,
        spiTransfer_t spiTransferFun,
        delay_t delayFun);
```
```cpp
// mcp2515.cpp
MCP2515::MCP2515(spiSelect_t spiSelectFun,
                 spiDeselect_t spiDeselectFun,
                 spiTransfer_t spiTransferFun,
                 delay_t delayFun)
{
  this->spiSelect = spiSelectFun;
  this->spiDeselect = spiDeselectFun;
  this->spiTransfer = spiTransferFun;
  this->delay = delayFun;

  spiDeselect();
}
```

接下來就可以把原本的那 4 個要替換或修改的 Arduino 程式改成我們自己新增的函式了。例如：
```cpp
MCP2515::ERROR MCP2515::reset(void)
{
  spiSelect();
  spiTransfer(INSTRUCTION_RESET);
  spiDeselect();

  delay(10);

/* 省略部分程式 */
```
```cpp
uint8_t MCP2515::readRegister(const REGISTER reg)
{
  spiSelect();
  spiTransfer(INSTRUCTION_READ);
  spiTransfer(reg);
  uint8_t ret = spiTransfer(0x00);
  spiDeselect();

  return ret;
}
```
```cpp
void MCP2515::setRegister(const REGISTER reg, const uint8_t value)
{
  spiSelect();
  spiTransfer(INSTRUCTION_WRITE);
  spiTransfer(reg);
  spiTransfer(value);
  spiDeselect();
}
```

將那些函式修改完後，Library 的移植其實就已經完成了。

# 使用新 Library
經過上面這樣的改造，我將 SPI 的操作及 delay 等函式的實作（Implementation）都移出 Library 了，即 Library 不依賴 SPI 和 delay 函式，Library 中僅留有這些函式的「長相」（`typedef`）。

既然實作不在 Library 內，那我們現在不管用什麼平臺或框架都 ok，只要使用時再透過建構子將實作函式注入即可，這也就達成了 Platform Independent 的目的。

具體的使用方式以 LibOpenCM3 為例：
```cpp
void spiSelect(void)
{
  gpio_clear(GPIO_CS_PORT, GPIO_CS_PIN); /* Set CS pin to low. */
}

void spiDeselect(void)
{
  /* Wait for SPI transmit complete. */
  while (!(SPI_SR(SPI1) & SPI_SR_TXE));
  while ((SPI_SR(SPI1) & SPI_SR_BSY));

  gpio_set(GPIO_CS_PORT, GPIO_CS_PIN); /* Set CS pin to high. */
}

uint8_t spiTransfer(uint8_t data)
{
  uint16_t rec = spi_xfer(SPI1, data); /* SPI data write and read. */
  return rec & 0xFF;
}

void mcp2515Init(void)
{
  MCP2515 mcp2515(&spiSelect, &spiDeselect, &spiTransfer, &delay);

  mcp2515.reset();
  mcp2515.setBitrate(CAN_125KBPS);
  mcp2515.setNormalMode();
}
```
實際修改完的 Library 為 [ziteh/mcp2515-driver](https://github.com/ziteh/mcp2515-driver)。
完整的範例程式可以看[這裡](https://github.com/ziteh/mcp2515-driver/blob/main/examples/stm32_main.cpp)。

# 依賴反轉 DIP
我這次修改的主要是將 SPI 及 delay 的操作函式移出 Library，這是一種「依賴反轉」的概念。

依賴反轉原則（Dependency Inversion Principle，DIP）是 SOLID 原則中的其中一個，其概念是：
> 高層模組不應該依賴於低層模組，兩者都該依賴抽象。
> 抽象不應該依賴於具體實作，具體實作則應該依賴抽象。

對於不熟悉 OOP  的人，這兩句話應該很難理解。

在這裡，「高層模組」是「MCP2515 Library」，而「低層模組」是「SPI 及 delay 操作函式」。若高層模組直接依賴於低層模組的話，一旦底層模組改變（例如換平臺、框架、API），那高層模組也必須要改變。

就像我們這次的修改一樣，原本的 Library 是不符合 DIP 的，所以當我們要將其從 Arduino 變成 LibOpenCM3 時（低層模組），Library 本身（高層模組）也要修改。

但我修改後，新增了 4 個 `typedef`
```cpp
typedef void (*spiSelect_t)(void);
typedef void (*spiDeselect_t)(void);
typedef uint8_t (*spiTransfer_t)(uint8_t data);
typedef void (*delay_t)(uint32_t ms);
```

這些就是在定義一個抽象的介面。它只定義這些函式的「長相」（參數及回傳值），並沒有定義實際的實作（Implementation）。而現在高/低模組都依賴於它們。

現在，無論低層模組長怎麼樣，我都可以在此 Library 以外處理，然後再透過建構子傳入就好。

若對於 DIP 或 SOLID 還是不太瞭解的話，可以看這 2 篇文章：
- [SOLID 依賴反轉原則 Dependency Inversion Principle (DIP) - Finn - Medium](https://medium.com/@f40507777/%E4%BE%9D%E8%B3%B4%E5%8F%8D%E8%BD%89%E5%8E%9F%E5%89%87-dependency-inversion-principle-dip-bc0ba2e3a388)
- [10. 從被動變主動—依賴反轉 - iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10191603)

# 小結
這次介紹了要如何將 Arduino 的 Library 修改成 Platform Independent 的架構，並讓 LibOpenCM3 可以使用。

這不是 STM32 或 LibOpenCM3 本身的介紹，但我覺得這是實際在寫程式會遇到的一個問題，也相當重要，因此寫了這篇文章，簡單分享了我會如何修改。

# 參考資料
- [autowp/arduino-mcp2515: Arduino MCP2515 CAN interface library](https://github.com/autowp/arduino-mcp2515)

> 本文的程式也有放在 [GitHub](https://github.com/ziteh/mcp2515-driver) 上。
> 本文同步發表於[ iT 邦幫忙-2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/articles/10306596)。
