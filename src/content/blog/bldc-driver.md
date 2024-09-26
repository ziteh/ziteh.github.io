---
title: "BLDC無刷直流馬達控制/驅動器研究"
# subtitle: ""
# description: ""
tags:
  - 電子電路
  - 馬達
  - 嵌入式


date: 2023-08-02T11:59:00+08:00
# header_img: ""
comments: true
toc: true
draft: false
---

最近在研究 BLDC 驅動電路，稍微整理一下可以參考的各種零件或成品。

<!--more-->

# 完整電路板

這些是我找到的馬達驅動電路，有一半是在 GitHub 上找到的。

| 名稱                                                 | 尺寸 (mm)          | 電壓               | 連續電流     | 峰值電流  | MCU                | Gate Driver | FETs                   | 開源                                           | 備註                   |
| ---------------------------------------------------- | ------------------ | ------------------ | ------------ | --------- | ------------------ | ----------- | ---------------------- | ---------------------------------------------- | ---------------------- |
| [ODrive Pro][odrive-pro]                             | 51 x 64            | 12\~58V            | 20A          | 120A (3s) | STM32H7A3RGT6      | DRV8353S    | ?（並聯）              | [韌體][odrive-fw]                              | IO 隔離                |
| [ODrive S1][odrive-s1]                               | 66 x 50            | 12\~48V            | 20A          | 80A (3s)  | STM32H725RGV6      | DRV8353RS   | TPH1R306PL             | [韌體][odrive-fw]                              | IO 隔離                |
| [ODrive v3.6][odrive-v36]                            | 140 x 50           | 12\~24V or 12\~56V | 40A (散熱片) | 120A      | STM32F405RGT6      | DRV8301     | NTMFS4935NT1G（並聯）  | [韌體][odrive-fw]                              | 雙馬達                 |
| [ODrive v3.5][odrive-v35]                            | 140 x 50           | 12\~24V or 12\~56V | 40A (散熱片) | 120A      | STM32F405RGT6      | DRV8301     | NTMFS4935NT1G（並聯）  | [韌體][odrive-fw],[硬體開始閉源][odrive-close] | 雙馬達                 |
| [Tinymovr R5.2][tinymovr-r52]                        | 40 x 36            | 12\~38V            | 40A (散熱)   | ?         | PAC5527            | 見 MCU      | SIR626ADP              | [韌體][tinymovr-fw]                            |                        |
| [Tinymovr M5.1][tinymovr-m51]                        | 29.5 x 29.5        | 12\~38V            | 5A（散熱）   | ?         | PAC5527            | 見 MCU      | ?                      | [韌體][tinymovr-fw]                            |                        |
| [moteus r4.11][moteus-r411]                          | 46 x 53            | 12\~44V            | 11A          | ?         | STM32G474CEU6      | DRV8353FS   | TPH2R506PL             | [韌體][moteus-fw]                              |                        |
| [moteus n1][moteus-n1]                               | 46 x 46            | 10\~54V            | 8A           | ?         | STM32G474CEU6      | DRV8353FS   | TPH2R408QM             | [韌體][moteus-fw]                              |                        |
| [rp2040 motor controller][rp2040-mc]                 |                    |                    |              |           | RP2040             | EG2131      | BSC016N06NS            | 硬/韌體                                        |                        |
| [O32controller][o32]                                 | 27 x 27            | 15V                | 50A (散熱)   | 100A      | STSPIN32F0A        | 見 MCU      | CSD88584Q5DC（雙通道） | 硬/韌體                                        |                        |
| [µMotor][mu-motor]                                   | 35 x 20            | 24V                |              | 10A       | STM32G474CET6      | DRV8320S    | FDMD82xx（雙通道）     | 硬/韌體                                        |                        |
| [SimpleFOCShield][sfoc-shield]                       | Arduino Uno shield | 12\~24V            | 2A           | 5A        | 無                 | L6234       | 見 Gate Driver         | 硬/韌體                                        |                        |
| [VESC][vesc]                                         |                    | 60V Max            | ?            | ?         | STM32F40x (LQFP64) | DRV8302     | IRFS7530               | 硬/韌體                                        |                        |
| [miniFOC][minifoc]                                   |                    | 5\~18V             | 5A (?)       |           | GD32F130G6U6       | EG2133      | AP2300                 | 硬/韌體                                        |                        |
| [osannolik/MotCtrl][motctrl]                         | 45 x 77            |                    |              |           | STM32F446          | LM5101A     | FDBL0110N60            | 硬/韌體                                        |                        |
| [Dagor][dagor]                                       | 44 x 44            | 5\~24V             | ?            | 40A       | ESP32-WROM-32U     | DRV8305     | ?                      | 韌體                                           |                        |
| [Janus][janus]                                       | 51 x 51            | 5\~12V             | ?            | 23A       | 無/ESP32-Dev-Kit1  | DRV8305     | NVTFS5C453NLWFTAG      | 韌體                                           |                        |
| [AdinAck/Motor-Controller][adinack]                  |                    | 5\~40V             | 3A           | 8A        | SAMD21             | DRV8316     | 見 Gate Driver         | 硬/韌體                                        |                        |
| [sabanekko3/PCBM_drive-board][saganekko3]            |                    |                    |              |           | STM32F303K8Tx      | MIC4604YM   | BSC028N06LS3           | 硬/韌體                                        |                        |
| [FunQi-Stack][funqi]                                 |                    |                    |              |           | STSPIN32G4         | 見 MCU      | 無                     | 韌體 (SimpleFOC)                               |                        |
| [azmat-bilal/bldc_motor_controller_pcb][azmat-bilal] |                    |                    |              |           | STM32F405RGTx      | DRV8301     | CSD18540Q5B            | 硬體                                           | 電路參考 ODrive v3.5/6 |

[odrive-pro]: https://odriverobotics.com/shop/odrive-pro
[odrive-s1]: https://odriverobotics.com/shop/odrive-s1
[odrive-v36]: https://odriverobotics.com/shop/odrive-v36
[odrive-v35]: https://github.com/odriverobotics/ODriveHardware/tree/master/v3/v3.5docs
[odrive-close]: https://discourse.odriverobotics.com/t/3-5-odrive-schematic-release/1246
[odrive-fw]: https://github.com/odriverobotics/ODrive

[tinymovr-r52]: https://tinymovr.com/products/tinymovr-r5
[tinymovr-m51]: https://tinymovr.com/products/tinymovr-m5
[tinymovr-fw]: https://github.com/tinymovr/Tinymovr/tree/master

[moteus-r411]: https://mjbots.com/products/moteus-r4-11
[moteus-n1]: https://mjbots.com/products/moteus-n1
[moteus-fw]: https://github.com/mjbots/moteus

[vesc]: https://github.com/vedderb/bldc-hardware
[sfoc-shield]: https://github.com/simplefoc/Arduino-SimpleFOCShield
[dagor]: https://github.com/byDagor/Dagor-Brushless-Controller
[janus]: https://github.com/byDagor/Janus-Controller
[adinack]: https://github.com/AdinAck/Motor-Controller
[saganekko3]: https://github.com/sabanekko3/PCBM_drive-board
[mu-motor]: https://github.com/roboterclubaachen/micro-motor
[o32]: https://github.com/qwertpas/O32controller
[funqi]: https://github.com/Juanduino/STSPIN32G4-FunQi-Stack
[minifoc]: https://github.com/ZhuYanzhen1/miniFOC
[motctrl]: https://github.com/osannolik/MotCtrl
[rp2040-mc]: https://github.com/Twisted-Fields/rp2040-motor-controller
[azmat-bilal]: https://github.com/azmat-bilal/bldc_motor_controller_pcb

此外，還有一些評估/開發/參考工具：
- [TIDA-00774][ti-tida-00774]: 18V/1kW, 160A Peak, >98% Efficient, High Power Density Brushless Motor Drive Reference Design
- [TIDA-01516][ti-tida-01516]: Single Microcontroller 18-V/600-W BLDC Motor Control Reference Design With Bluetooth® Low Energy 5.0
- [B-G431B-ESC1][st-b-g431b-esc1]: Discovery kit with STM32G431CB MCU
- [STEVAL-ESC002V1][st-steval-esc002v1]: Electronic Speed Controller reference design based on STSPIN32F0A
- [STEVAL-SPIN3202][st-steval-spin3202]: STSPIN32F0A advanced 3-phase BLDC driver with embedded STM32 MCU single shunt evaluation board
- [EVALKIT-ROBOT-1][st-evalkit-robot-1]: Compact reference design kit for robotics and automation based on STSPIN32F0A
- [EVSPIN32G4][st-evspin32g4]: STSPIN32G4 demonstration board for three-phase brushless motors

[ti-tida-00774]: https://www.ti.com/tool/TIDA-00774
[ti-tida-01516]: https://www.ti.com/tool/TIDA-01516
[st-b-g431b-esc1]: https://www.st.com/en/evaluation-tools/b-g431b-esc1.html
[st-evspin32g4]: https://www.st.com/en/evaluation-tools/evspin32g4.html
[st-steval-esc002v1]: https://www.st.com/en/evaluation-tools/steval-esc002v1.html
[st-evalkit-robot-1]: https://www.st.com/en/evaluation-tools/evalkit-robot-1.html
[st-steval-spin3202]: https://www.st.com/en/evaluation-tools/steval-spin3202.html

# IC

這裡整理了一些我覺得有趣的 IC。

|           型號           | 功能                                                 | 封裝                |
| :----------------------: | ---------------------------------------------------- | ------------------- |
|  [STSPIN32G4][spin32g4]  | MCU + Gate Driver + Op-amp                           | QFN-64 9x9mm        |
|  [STSPIN32F0][spin32f0]  | MCU + Gate Driver + Op-amp                           | QFN-48 7x7mm        |
| [STSPIN32F0A][spin32f0A] | MCU + Gate Driver + Op-amp                           | QFN-48 7x7mm        |
| [STSPIN32F0B][spin32f0B] | MCU + Gate Driver + Op-amp                           | QFN-48 7x7mm        |
|      [L6234][l6234]      | Gate Driver + FETs                                   | PowerSO20 16x14.5mm |
|   [DRV8316C][drv8316c]   | Gate Driver + FETs + 電流感測放大器                   | VQFN-40 7x5mm       |
|   [MCF8316A][mcf8316a]   | 硬體 FOC controller + Gate Driver + FETs + 電流感測放大器 | VQFN-40 7x5m       |
|   [TMC4671][tmc4671]     | 硬體 FOC controller                                  | QFN-76 10.5x6.5mm   |

STSPIN32 SiP
| STSPIN32          | F0               | F0A              | F0B              | G4               |
| ----------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| MCU               | STM32F031C6      | STM32F031C6      | STM32F031C6      | STM32G431VB      |
| Clock             | 48 MHz           | 48 MHz           | 48 MHz           | 170 MHz          |
| SRAM              | 4 KB             | 4 KB             | 4 KB             | 32 KB            |
| Flash             | 32 KB            | 32 KB            | 32 KB            | 128 KB           |
| Operating voltage | 8~45V            | 6.7~45V          | 6.7~45V          | 5.5~75V          |
| OP-Amps           | 4                | 3                | 1                | 3                |
| GPIOs             | 15               | 16               | 20               | 40               |
| CAN Bus           | 0                | 0                | 0                | 1 (CAN-FD)       |
| USB               | 0                | 0                | 0                | 1 (USB 2.0 FS)   |
| BOOT0 pin         | No               | Yes              | Yes              | Yes              |
| 3FG Hall decoding | Yes              | No               | No               | No               |
| Package           | QFN-48 7x7mm 1EP | QFN-48 7x7mm 1EP | QFN-48 7x7mm 1EP | QFN-64 9x9mm 1EP |

> [Solved: STSPIN32F0 vs STSPIN32F0A vs STSPIN32F0B](https://community.st.com/t5/power-management/stspin32f0-vs-stspin32f0a-vs-stspin32f0b/td-p/273388)

[spin32g4]: https://www.st.com/en/motor-drivers/stspin32g4.html
[spin32f0]: https://www.st.com/en/motor-drivers/stspin32f0.html
[spin32f0a]: https://www.st.com/en/motor-drivers/stspin32f0a.html
[spin32f0b]: https://www.st.com/en/motor-drivers/stspin32f0b.html
[l6234]: https://www.st.com/en/motor-drivers/l6234.html
[drv8316c]: https://www.ti.com/product/DRV8316C
[mcf8316a]: https://www.ti.com/product/MCF8316A
[tmc4671]: https://www.analog.com/en/products/tmc4671.html

# 功率 MOSFET

都是 N 通道。

| 型號          | 通道數   | Vds (V) | Vgs (V) | Id (A)       | Rds_on (mΩ)   |  尺寸 (mm)  |
| :------------ | :------- | :-----: | :-----: | :----------- | :------------ | :---------: |
| CSD88584Q5DC  | 2 (半橋) |   40    |   20    | 50 (Ta=25°C) | 0.68 (Vgs=10) |    6 x 5    |
| CSD88599Q5DC  | 2 (半橋) |   60    |   20    | 40 (Ta=25°C) | 1.7 (Vgs=10)  |    6 x 5    |
| CSD87334Q3D   | 2 (半橋) |   30    |   10    | 20 (Ta=25°C) | 4.9 (Vgs=8)   |  3.3 x 3.3  |
| FDMD8240L     | 2 (半橋) |   40    |   20    | 23 (Ta=25°C) | 2.6 (Vgs=10)  |   3.3 x 5   |
| FDMD8240LET40 | 2 (半橋) |   40    |   20    | 24 (Ta=25°C) | 2.6 (Vgs=10)  |   3.3 x 5   |
| DMT47M2LDVQ   | 2 (獨立) |         |         |              |               |  3.3 x 3.3  |
| DMTH6010LPD   | 2 (獨立) |         |         |              |               | 5.15 x 6.15 |
| DMTH10H010SPS | 1        |         |         |              |               | 5.15 x 6.15 |
| DMTH4007SPS   | 1        |         |         |              |               | 5.15 x 6.15 |
| SiZF5302DT    | 2 (半橋) |         |         |              |               |  3.3 x 3.3  |
| SiZ342ADT     | 2 (半橋) |         |         |              |               |  3.3 x 3.3  |
| SiZF360DT     | 2 (半橋) |         |         |              |               |  3.3 x 3.3  |
| SiR150DP      | 1        |         |         |              |               | 5.15 x 6.15 |
| SiS178LDN     | 1        |         |         |              |               |  3.3 x 3.3  |
| SiR626ADP     | 1        |         |         |              |               | 5.15 x 6.15 |
| TPH1R306PL    | 1        |         |         |              |               | 5.15 x 6.15 |

# 文件

- ST AN5397 "Current Sensing in motion control applications"
- TI SLUA887 "Bootstrap Circuitry Selection for Half-Bridge Configurations"
- Diodes DN1156 "Gate Drivers in BLDC Motors"

# 編碼器

[常見磁性旋轉位置感測器/旋轉編碼器比較](/posts/magnetic-rotaty-position-sensor/)

---

> 請注意，本文僅供參考，內容或資訊不一定完全正確和完整，有些資料也會隨著時間變化，請以實際情況為準。
