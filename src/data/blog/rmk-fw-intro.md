---
title: "RMK：Rust 機械鍵盤韌體教學"
tags: ["DIY", "教學", "Rust"]
date: 2025-03-22 22:40:00+08:00
comments: true
toc: true
---

在這個 Rust 滿天飛的現在，不管是網頁前後端、桌面軟體、嵌入式系統還是開發基礎建設都可以看到 Rust，鍵盤韌體怎能讓它缺席呢？[RMK](https://haobogu.github.io/rmk/) 是一個以 Rust 寫成的機械鍵盤韌體，架構在 [Embassy](https://github.com/embassy-rs/embassy) 框架上。

<!-- more -->

對我來說，RMK 相較於 QMK 和 ZMK 它有許多優點：

- 對比 QMK：
  - 原生支援藍牙 BLE 和 nRF 系列 MCU，包含無線分離式鍵盤
  - License 是寬鬆的 Apache 2.0 和 MIT，而非具感染性的 GPL
  - ~~Rust 比較酷！~~
- 對比 ZMK：
  - 支援 [Vial](https://get.vial.today/) 即時 Keymap 修改
  - Rust 的本地開發環境比 Zephyr 更容易建立（至少對於不熟悉 Zephyr 的我來說）
  - Kconfig + Devicetree 有一定的複雜度
  - ~~Rust 比較酷！！~~

Rust 的特色網路上已經有很多文章在討論了，這裡就不在贅述，但 Embassy 又是什麼？Embassy 是一個嵌入式應用框架，它主要負責提供非同步程式功能 `async/await` 和硬體抽象層（HAL），*有點類似*傳統韌體開發的 RTOS（Real-time operating system）。

在我測試後覺得 RMK 的開發體驗相當好，我甚至都有點不太想用 QMK 和 ZMK 了。因此這篇文章來簡單的介紹一下如何用 RMK 從頭到尾建立一個鍵盤韌體。

> 本文是以發文當下最新的 RMK 版本 `v0.5.2` 撰寫。
>
> 本文會以 Windows 為主。

## 建立開發環境

RMK 有兩種開發方式：Cloud compilation 和 Local compilation。前者是類似 ZMK 那樣使用 GitHub Action 進行建構，後者則是在電腦本地端開發和建構。本文將以 Local compilation 為主進行示範教學。官方文件請參考：[Local compilation - RMK Documentation](https://haobogu.github.io/rmk/user_guide/2-2_local_compilation.html)

### 安裝 Rust

首先當然是要建立 Rust 開發環境。這部分就和一般開發 Rust 時要做的事情一樣

對於 Windows 使用者來說就是下載並使用 `rustup` 這個工具安裝，此外還要下載 Visual Studio 並安裝「Desktop Development with C++」工作負載。詳細的教學可以查看[安裝教學 - Rust 程式設計語言](https://rust-lang.tw/book-tw/ch01-01-installation.html)、[rustup.rs](https://rustup.rs/) 或 [新手入門 - Rust 程式設計語言](https://www.rust-lang.org/zh-TW/learn/get-started)。

![Windows 記得還要使用 Visual Studio 安裝 Desktop Development with C++](https://bucket.ziteh.dev/blog/rmk-fw-intro/install-rust-vscpp.webp)

安裝完成後可以開啓 PowerShell（由於後續的部分命令會用到 PowerShell 的指令，因此本文的終端機皆以 PowerShell 為主），並輸入以下指令：

```bash
cargo --version
```

它應該會回應類似 `cargo 1.84.1 (66221abde 2024-11-19)`，表示 Rust 已經安裝成功。

### 添加編譯器目標

因為開發韌體算是交叉編譯，因此要為 Rust 添加目標平臺的編譯功能。這部分的命令會因你所使用的不同開發板和 MCU 而有所不同。

例如你的鍵盤要使用的 MCU 是 RP2040 這種 Cortex-M0+ 系列的話，要在終端機執行：

```bash
rustup target add thumbv6m-none-eabi
```

如果你要使用 nRF52840（Cortex-M4 with FPU）的話則是：

```bash
rustup target add thumbv7em-none-eabihf
```

這裡簡單整理了一下 ARM 系列的表格供參考：

| MCU              | 目標                        | 說明   |
| :--------------- | :-------------------------- | :----- |
| Cortex-M0 / M0+  | `thumbv6m-none-eabi`        |        |
| Cortex-M3        | `thumbv7m-none-eabi`        |        |
| Cortex-M4 / M7   | `thumbv7em-none-eabi`       | 無 FPU |
| Cortex-M4F / M7F | `thumbv7em-none-eabihf`     | 有 FPU |
| Cortex-M23       | `thumbv8m.base-none-eabi`   |        |
| Cortex-M33       | `thumbv8m.main-none-eabi`   | 無 FPU |
| Cortex-M33F      | `thumbv8m.main-none-eabihf` | 有 FPU |

### 安裝其它工具

再來還有一些其它工具要安裝：

- [rmkit](https://github.com/HaoboGu/rmkit)：RMK 專案建立工具
- [flip-link](https://github.com/knurling-rs/flip-link)：Stack overflow 保護。用過 Rust 開發韌體的人應該都知道它
- [cargo-make](https://github.com/sagiegurari/cargo-make)：建立 `.uf2` 檔案
- [probe-rs](https://probe.rs/)（可選）：用於燒錄和 Debug，如果你喜歡其它燒錄工具的話可以不用裝它

上面這些工具可以用以下指令安裝：

```ps
## 安裝 rmkit、flip-link、cargo-make
cargo install rmkit flip-link cargo-make

## 安裝 probe-rs（Winsows）。需使用 PowerShell
irm https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.ps1 | iex
```

如果你打算使用 `probe-rs` 的話，安裝完之後還要根據你使用的燒錄器進行設定，請參考官方文件 [Probe Setup](https://probe.rs/docs/getting-started/probe-setup/)。

如果你在 Windows 上安裝 `rmkit` 遇到問題的話，嘗試改用以下 PowerShell 腳本指令：

```ps
powershell -ExecutionPolicy ByPass -c "irm https://github.com/haobogu/rmkit/releases/download/v0.0.9/rmkit-installer.ps1 | iex"
```

### 安裝文字編輯器

最後你還需要一個文字編輯器，一般來說會推薦使用 [VS Code](https://code.visualstudio.com/)，安裝的部分沒什麼特別的就不贅述了。

安裝好 VS Code 後你還可以安裝一些插件，讓我們的開發過程更方便。VS Code 安裝插件的方式是在左側點選「Extensions」圖標，然後在側邊欄上方搜尋欄輸入插件名稱，並點選「Install」即可。

- [Even Better TOML](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Chinese (Traditional) Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hant)：VS Code 繁體中文套件，如果你不習慣 VS code 的英文介面的話可以裝。

## 建立韌體

### 建立專案

建立一個資料夾用來存放你的 RMK 專案，例如 D 槽下的 `rmk` 資料夾：`D:\rmk\`，然後變更終端機的工作路徑：

```ps
cd "D:\rmk"
```

使用 `rmkit` 工具來建立 RMK 韌體專案：

```ps
rmkit init
```

它會開啓互動式精靈，你只要依序回答專案名稱、鍵盤類型和目標 MCU 即可，例如：

```ps
PS D:\rmk> rmkit init
> Project Name: my-rmk-kb
> Choose your keyboard type? normal
> Choose your microcontroller nrf52840
⇣ Download project template for nrf52840...
✅ Project created, path: my-rmk-kb
```

完成後你會看到 RMK 專案已經出現在 `D:\rmk\my-rmk-kb\` 下。

> 如果你打算用 Git 管理此專案，`rmkit` 會幫你建立 `.gitignore`，只需要再執行 `git init` 即可。

### 編輯 `keyboard.toml`

接下來使用 VS Code 開啓你的鍵盤資料夾，VS Code 上方選單列 > File > Open Folder...。

開啓到專案資料夾後你應該會在 Explorer 側邊欄看到各種檔案，其中最主要的是 `keyboard.toml` 檔案，點擊並打開它，你應該會看到類似這樣的內容（省略部分註解）：

```toml
[keyboard]
name = "my-rmk-kb"
product_name = "my-rmk-kb"
vendor_id = 0x4c4b
product_id = 0x4643
manufacturer = "rmk"
chip = "nrf52840"

[matrix]
input_pins = ["P1_00", "P1_01", "P1_02", "P1_07"]
output_pins = ["P1_05", "P1_06", "P1_03"]

[layout]
rows = 4
cols = 3
layers = 2
keymap = [
    [
        ["A", "B", "C"],
        ["Kc1", "Kc2", "Kc3"],
        ["LCtrl", "MO(1)", "LShift"],
        ["OSL(1)", "LT(2, Kc9)", "LM(1, LShift | LGui)"]
    ],
    [
        ["TO(1)", "TT(1)", "TG(2)"],
        ["DF(1)", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"]
    ],
]

[light]
capslock.pin = "P0_30"
capslock.low_active = false

[storage]
## Storage feature is enabled by default
## enabled = false

[ble]
enabled = true
battery_adc_pin = "vddh"
charge_state.pin = "P0_25"
charge_state.low_active = false
charge_led.pin = "P0_29"
charge_led.low_active = false
```

接下來將分成各個部分說明 `keyboard.toml`，詳細設定請參考 [Keyboard Configuration - RMK Documentation](https://haobogu.github.io/rmk/keyboard_configuration.html)。

#### [keyboard]

`[keyboard]` 部分是鍵盤的基本訊息。

```toml
[keyboard]
name = "my-rmk-kb"   # 鍵盤名稱
product_name = "My RMK Keyboard" # 顯示名稱
vendor_id = 0x4c4b   # 十六進制格式 USB Vendor ID
product_id = 0x4643  # 十六進制格式 USB Product ID
manufacturer = "rmk" # 製造商名稱
chip = "nrf52840" # 使用的 MCU
usb_enable = true # 如果你用的 MCU 沒有 USB外設（如 nRF52832），需將 `usb_enable` 設為 false。預設為 true
```

如果你是使用現成的開發板例如 Nice!Nano 的話，可以將 `chip` 改成 `board`，記得 `chip` 和 `board` 是二選一。例如：

```toml
[keyboard]
name = "my-rmk-kb"   # 鍵盤名稱
product_name = "My RMK Keyboard" # 顯示名稱
vendor_id = 0x4c4b   # 十六進制格式 USB Vendor ID
product_id = 0x4643  # 十六進制格式 USB Product ID
manufacturer = "rmk" # 製造商名稱
board = "nice!nano_v2" # 使用的開發板
usb_enable = true # 如果你用的 MCU 沒有 USB外設（如 nRF52832），需將 `usb_enable` 設為 false。預設為 true
```

目前支援的 `chip` 有：

- rp2040
- nrf52840
- nrf52833
- nrf52832
- nrf52811
- nrf52810
- esp32c3
- esp32c6
- esp32s3
- 所有在 [embassy-stm32](https://github.com/embassy-rs/embassy/blob/main/embassy-stm32/Cargo.toml) 中有 USB 的 STM32

目前支援的 `board` 有：

- nice!nano
- nice!nano_v2
- XIAO BLE

> USB Vendor ID 和 Product ID （VID & PID）理論上是要和 USB 協會申請並註冊的唯一 ID，但我們自己開發使用的話通常就隨意設定即可。

#### [matrix]

`[matrix]` 用來定義鍵盤矩陣掃描的 IO 腳位。如果你不知道什麼是矩陣掃描（Matrix scanning）的話建議上網搜尋一些文章，這是當今絕大多數鍵盤的運作基礎（或者是我未來另外寫一篇說明好了）。

要注意的是這裡使用的腳位名稱是 Embassy 裡的 Peripherals 名稱，例如 nRF52840 的話要看 [Peripherals in embassy_nrf](https://docs.embassy.dev/embassy-nrf/git/nrf52840/struct.Peripherals.html)，也就是 `P0_00`、`P1_05` 這種。而如果是 [RP2040](https://docs.embassy.dev/embassy-rp/git/rp2040/struct.Peripherals.html) 的話要使用 `PIN_0` 這種。

```toml
[matrix]
input_pins = ["P1_00", "P1_01", "P1_02", "P1_07"]
output_pins = ["P1_05", "P1_06", "P1_03"]
## row2col = true # RMK 的二極體方向預設為 column to row，且目前在此處設定方向沒有實際功能
```

如果你不使用矩陣掃描，而是將按鍵直接接入的話，可以另外設定 `matrix_type = "direct_pin"`，詳細內容請參考[官方文件](https://haobogu.github.io/rmk/keyboard_configuration.html#matrix)，文本就不多做介紹。

#### [layout]

`[layout]` 用來定義 Keymap 鍵位佈局。其中 `rows` 和 `cols` 的數量要和 `matrix` 的 IO 腳部分配合，`layers` 用來定義分層數量，`keymap` 就是設定按鍵佈局，根據你的 `layers` 可以設定不同層的佈局。

這部分最重要的當然是 `keymap` 的部分，它裡面的按鍵可以用的值請參考 [KeyCode](https://docs.rs/rmk/latest/rmk/keycode/enum.KeyCode.html)，如果你需要左 Shift 鍵的話就是 `LShift`，無按鍵的話可以使用底線如 `_`。

另外還有一些特殊的組合/修飾鍵，如 `MO(1)` 代表暫時切換到 `layer 1`。這些修飾鍵和 QMK 的定義是相同的，可以參考 [QMK 的說明](https://docs.qmk.fm/feature_layers)。

```toml
[layout]
rows = 4
cols = 3
layers = 2
keymap = [
    [
        # Layer 0 (預設)
        ["A",      "B",          "C"],
        ["Kc1",    "Kc2",        "Kc3"],
        ["LCtrl",  "MO(1)",      "LShift"],
        ["OSL(1)", "LT(2, Kc9)", "LM(1, LShift | LGui)"]
    ],
    [
        # Layer 1
        ["TO(1)", "TT(1)", "TG(2)"],
        ["DF(1)", "_",     "_"],
        ["_",     "_",     "_"],
        ["_",     "_",     "_"],
    ],
]
```

#### [behavior]

`[behavior]` 定義一些不同的鍵盤行為。例如 One Shot 功能的超時時間、Combo 鍵等等。這部分屬於比較進階的功能，本文就先跳過。

```toml
[behavior.combo]
timeout = "150ms"
combos = [
  # 同時按下 J 和 K 時會變成 ESC 鍵
  { actions = ["J", "K"], output = "Escape" }
]
```

#### [light]

`[light]` 是定義指示燈的部分，包含 `capslock`、`numslock`、`scrolllock`。此處的 IO 腳位名稱和 `[matrix]` 部分一樣，要使用 Embassy 的名稱。

```toml
[light]
capslock = { pin = "P0_02", low_active = true }
numslock= { pin = "P0_04", low_active = true }
scrolllock = { pin = "P1_10", low_active = true }
```

#### [storage]

`[storage]` 定義儲存設定，RMK 會將 Keymap 資料和 BLE 連線資訊儲存在 Flash 中的特定位置。預設情況下它是啓用的，並且會使用 MCU 的最後 2 個 sector 儲存資料。

一般來說不需要修改這裡的設定，但是有些 Bootloader（例如 [Adafruit nRF52 Bootloader](https://github.com/adafruit/Adafruit_nRF52_Bootloader)）會和此預設位置衝突，這時就需要修改這邊的 `start_addr` 設定了，例如將其設為 `start_addr = 0x000A0000`。

```toml
[storage]
enabled = true # 預設即啓用 storage 功能
start_addr = 0x00000000 # 起始位置，如果設為 0 則使用預設位置，即倒數 n 個 sector
num_sectors = 2 # 使用多少 Flash 的 sector，預設是 2
clear_storage = false # 設為 true 的話每次鍵盤開機都會清空，通常用於開發測試
```

#### [ble]

`[ble]` 設定無線藍牙的相關功能。部分功能如 `battery_adc_pin` 和充電狀態目前僅 nRF52840 支援。

```toml
[ble]
enabled = true # 設定啓用藍牙
battery_adc_pin = "vddh" # 使用 nRF52840 的 SAADC 腳讀取電池容量

## 充電狀態指示燈
charge_state.pin = "P0_25"
charge_state.low_active = false
charge_led.pin = "P0_29"
charge_led.low_active = false
```

### 編輯 `memory.x`

`memory.x` 用來定義 MCU 的 RAM 和 Flash 佈局。如果你是使用 STM32 的話可以略過此部分。

如果你是使用 nRF52840 的話，因為會牽扯到你使用的 SoftDevice 所以設定上會有所不同。通常只需要修改 `FLASH` 起始位置即可，如果你使用 SoftDevice S140 `v6.1.1` 的話可以使用 `0x00026000`，如果是 `7.3.0` 的話可以用 `0x0027000`。

> 關於 SoftDevice 的[額外說明](#nrf-額外說明)。

例如 S140 `v6.1.1`

```x
MEMORY
{
  /* NOTE 1 K = 1 KiB = 1024 bytes */
  /* nRF52840 with SoftDevice S140 6.1.1 */
  FLASH : ORIGIN = 0x00026000, LENGTH = 824K
  RAM : ORIGIN = 0x20020000, LENGTH = 128K
}
```

或 S140 `v7.3.0`

```x
MEMORY
{
  /* NOTE 1 K = 1 KiB = 1024 bytes */
  /* nRF52840 with SoftDevice S140 7.3.0 */
  FLASH : ORIGIN = 0x00027000, LENGTH = 820K
  RAM : ORIGIN = 0x20020000, LENGTH = 128K
}
```

如果你是使用其它 Cortex-M 系列的話，只需要根據使用的 MCU 設定 `RAM` 和 `FLASH` 的 `LENGTH` 即可。你可以參考該 MCU 的 Datasheet 或其它 Rust 專案的設定。

> 注意這裡的 `1K` 是 `1KiB` 也就是 1024 bytes。

### 編輯 `vial.json`

`vial.json` 是 Vial 要使用的檔案，你需要根據 `keyboard.toml` 中的 `[keymap]` 定義建立一個 `vial.json`。詳細的說明請參考 [QMK啓用Vial教學](/posts/diyqmkkeyboard-vial#%E5%BB%BA%E7%AB%8B-vialjson)或官方說明 [Create JSON - Vial](https://get.vial.today/docs/porting-to-via.html)。

### 編輯編譯設定

Rust 編譯設定在 `.carbo/config.toml`，要注意的是 `target` 是不是正確的，其內容請參考[添加編譯器目標](#添加編譯器目標)。

```toml
[target.'cfg(all(target_arch = "arm", target_os = "none"))']
runner = "probe-rs run --chip nRF52840_xxAA"
linker = "flip-link"

[build]
## 請根據你的 MCU 選擇一個目標
## target = "thumbv6m-none-eabi"        # Cortex-M0 and Cortex-M0+
## target = "thumbv7m-none-eabi"        # Cortex-M3
## target = "thumbv7em-none-eabi"       # Cortex-M4 and Cortex-M7 (no FPU)
target = "thumbv7em-none-eabihf"     # Cortex-M4F and Cortex-M7F (with FPU)
## target = "thumbv8m.base-none-eabi"   # Cortex-M23
## target = "thumbv8m.main-none-eabi"   # Cortex-M33 (no FPU)
## target = "thumbv8m.main-none-eabihf" # Cortex-M33 (with FPU)

[env]
DEFMT_LOG = "info"
```

## 編譯韌體

修改完設定後就可以進行編譯了，你可以直接使用 VS Code 下面的終端機執行指令（開啓方式為 VS Code 上方選單列 > Terminal > New Terminal）。

```ps
cargo build --release
```

如果一切正確，那編譯完成的韌體會在 `target/<TARGET>/release/<FW>`，其中 `<TARGET>` 會是你的編譯目標例如 `thumbv7em-none-eabihf`，而韌體檔名 `<FW>` 會是 `Cargo.toml` 中 `[[bin]]` 的 `name`，例如我的是 `my-rmk-kb`。編譯完成的韌體沒有副檔名，但它其實是 ELF 檔案。

如果你需要 `.uf2`（和 `.hex`）格式的檔案的話，可以使用 `cargo-make` 建立：

```ps
cargo make uf2 --release
```

成功的話會在專案目錄下產生 `<FW>.uf2` 檔案，例如 `D:\rmk\my-rmk-kb\my-rmk-kb.uf2`。

> 建立 `.uf2` 時可能要注意 `Makefile.toml` 中的設定，尤其是 `--family` 的 MCU 系列，請參考[這裡](https://github.com/fhanrath/hex-to-uf2/blob/main/hex_to_uf2/src/families.rs#L7)。
>
> 使用 UF2 指令 `cargo make uf2 --release` 如果有編譯錯誤的話不會直接提示具體問題，可以先執行 `cargo build --release` 確認問題並修正後再次嘗試。

## 燒錄韌體

這裡有兩種不同的燒錄方式。

### UF2

使用 UF2 的好處是你只需要一條 USB 線，無需購買專門的燒錄器，但是你的 MCU 必須已經擁有 UF2 Bootloader 才可以使用此方式。如果你的 MCU 沒有 UF2 Bootloader 的話，你可以使用燒錄器先為其燒入一種 UF2 Bootloader 後就可以使用 UF2 更新韌體了。

UF2 的燒入方式就是將你的 MCU/ 開發板使用 USB 接上電腦，然後讓 MCU 進入 Bootloader 模式（或稱 DFU 模式，不同的 Bootloader 或 MCU 進入的方式不同，但通常是快速按 RESET 按鈕兩次），成功進入 Bootloader 模式的 MCU 會在電腦上變成一個隨身碟，然後你只要把編譯完成的 `.uf2` 檔案複製並貼上到該隨身碟內即可。

> RP2040 內建 UF2 Bootloader 可以直接使用，進入 Bootloader 模式的方式為：
>
> 1. 使用 USB 線連接電腦
> 2. 壓著 BOOT 按鈕
> 3. 按一下 RESET 按鈕後放開
> 4. 放開 BOOT 按鈕

### 燒錄器

如果你有專門的燒錄器如 J-Link、DAP Link 可以使用此方法。只要將你的燒錄器接上電腦，再使用燒錄器連接 MCU 的燒錄座，然後使用 `probe-rs` 或其它燒錄工具即可。

如果使用 `probe-rs` 的話可以使用指令：

```ps
cargo run --release
```

> 記得燒錄器可能會需要安裝其各自的驅動程式。`probe-rs` 安裝完後還要進行[設定](https://probe.rs/docs/getting-started/probe-setup/)。

## nRF 額外說明

### SoftDevice

nRF MCU 要使用藍牙功能的話會需要 [SoftDevice](https://docs.nordicsemi.com/bundle/ug_gsg_ses/page/UG/gsg/softdevices.html)，這是一個 Nordic 官方預先編譯好的無線通訊協定棧。不同的 nRF MCU 型號要使用不同的 SoftDevice，且還有再細分成不同的功能，以 nRF52840 來說的話要使用藍牙 BLE 通常是選擇 S140（Bluetooth Low Energy - Central and Peripheral），然後 RMK 目前支援 `v6.x.x` 和 `v7.x.x`。

如果你的 nRF52840 已經有燒錄好 UF2 Bootloader 的話，要查看其使用的 SoftDevice 版本。方法為連接電腦並進入 Bootloader 後，在其中開啓 `INFO_UF2.TXT` 檔案，內部會標註版本如 `SoftDevice: S140 version 6.1.1`。

如果你的 nRF52840 是完全空的，那除了燒錄 RMK 鍵盤韌體外，你還要先為其燒錄 SoftDevice。要先到 Nordic 官網下載對應的 SoftDevice（如 [S140](https://www.nordicsemi.com/Products/Development-software/S140/Download)），然後用燒錄器將 SoftDevice 的 `.hex` 檔案（如 `s140_nrf52_7.3.0_softdevice.hex`）燒進 MCU 內。

### 燒錄

如果你偏好圖形化工具的話，nRF MCU 可以使用 Nordic 官方的燒錄工具 [nRF Connect for Desktop](https://www.nordicsemi.com/Products/Development-tools/nRF-Connect-for-Desktop)，下載安裝後安裝「Programmer」。

在 Programmer 的左上角可以選擇你的燒錄器（或開發板），使用「Add file」選擇你要燒錄的 SoftDevice 和 RMK 韌體，確認「File memory layout」內各區域沒有重疊衝突，按下「Erase & write」進行燒錄即可。燒錄完成後記得再點一下左上方的三角形「Disconnect device」按鈕退出。

![nRF Programmer 燒錄示意圖](https://bucket.ziteh.dev/blog/rmk-fw-intro/nrf-programmer.webp)

以上圖為例，我用「Add file」加入了兩個檔案，分別是 SoftDevice `s140_nrf52_7.3.0_softdevice.hex` 和 RMK 韌體 `my-rmk-kb.hex`。其中綠色的部分是我們的 RMK 韌體，可以確認其起始位置是 `0x00027000`，沒有和 SoftDevice 重疊。而藍色的區域就是 SoftDevice，我燒錄的是 S140 `v7.3.0`。最下面的橘色是 MBR 開機資訊區域。

> RMK 的 `.hex` 檔案要使用 UF2 的指令產生。

## 參考

我有建立一個 RMK 範例專案在 GitHub，Release 頁面也有提供編譯好的燒錄檔，可以參考看看：[siderakb/rmk-example](https://github.com/siderakb/rmk-example)

- [RMK 官方文件](https://haobogu.github.io/rmk/index.html)
  - [常見問題 FAQs](https://haobogu.github.io/rmk/faq.html)
- [Embassy](https://embassy.dev/)
- [Rust 程式設計語言](https://www.rust-lang.org/zh-TW/)
- [Vial 即時 Keymap 編輯器](https://get.vial.today/)
- Nordic nRF
  - [SoftDevices](https://docs.nordicsemi.com/bundle/ug_gsg_ses/page/UG/gsg/softdevices.html)
  - [nRF Connect for Desktop](https://www.nordicsemi.com/Products/Development-tools/nRF-Connect-for-Desktop)
- [rust-embedded/cortex-m-quickstart: Template to develop bare metal applications for Cortex-M microcontrollers](https://github.com/rust-embedded/cortex-m-quickstart)
- [Adafruit_nRF52_Bootloader](https://github.com/adafruit/Adafruit_nRF52_Bootloader)
