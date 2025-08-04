---
title: 在 C 中以 union 取多個資料結構的最大大小
tags: ["C/C++", "程式"]
categories: ["快速分享"]
date: 2025-08-05T018:30:00+08:00
comments: true
toc: false
draft: false
---

今天在看 Nordic nRF52 的範例程式時看到這個用 `union` 來達成取資料結構最大值的做法，覺得滿有趣的，就記錄一下。

<!--more-->

```c
union data_size {
    uint8_t _data_a[32]; 
    uint16_t _data_b[4]; 
    struct data_c _data_c;
}; 

#define DATA_SIZE_MAX sizeof(union data_size)
```

這是利用 `union` 的成員會共享同一個記憶體空間，而實際大小會是成員裡最大的那個，因此可以用它來取多個不同資料結構的最大值，藉此來宣告一個共同 buffer。當然實際使用根據編譯器和平臺的不同可能要考慮對齊。

## 參考

- [Nordic sdk-nrf: nRF Desktop](https://github.com/nrfconnect/sdk-nrf/blob/89ba1294ac9b624e28271a5c71e99193ed4d92a4/applications/nrf_desktop/configuration/common/hid_report_desc.h#L87-L106)
