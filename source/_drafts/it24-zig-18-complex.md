---
title: "Zig：進階型別"
# subtitle: ""
# description: ""
tags: ["教學","程式","Zig"]
categories: ["Zig 入門指南（鐵人 24）"]
date: 2024-MM-DDTHH:MM:00
# updated: 2024-MM-DDTHH:MM:00
comments: true
toc: true
# RESERVE
---

到目前爲止已經把基本的型別都介紹完了，這篇來介紹一下進階的型別用法。

<!-- more -->

# packed

`packed` 在 C 中不是標準的關鍵字，但是大多數的編譯器都有支援相關的擴充語法。在 Zig 中你可以直接使用 `packed` 來達成，改變型別的對齊行爲。

## union

```zig
const print = @import("std").debug.print;

const Packed = packed union { a: u32, b: f32, c: bool };
const Unpacked = union { a: u32, b: f32, c: bool };

pub fn main() void {
    print("Packed size: {} byte\n", .{@sizeOf(Packed)});
    print("Unpacked size: {} byte", .{@sizeOf(Unpacked)});
}
```

```bash
Packed size: 4 byte
Unpacked size: 8 byte
```

## struct

```zig
const print = @import("std").debug.print;

const Packed = packed struct {
    bit0: u1,
    bit1: u1,
    bit2: u1,
    bit3: u1,
    bit4: u1,
    bit5: u1,
    bit6: u1,
    bit7: u1,
};

const Unpacked = struct {
    bit0: u1,
    bit1: u1,
    bit2: u1,
    bit3: u1,
    bit4: u1,
    bit5: u1,
    bit6: u1,
    bit7: u1,
};

pub fn main() void {
    print("Packed size: {} byte\n", .{@sizeOf(Packed)});
    print("Unpacked size: {} byte", .{@sizeOf(Unpacked)});
}
```

```bash
Packed size: 1 byte
Unpacked size: 8 byte
```

# bit-field

Zig 的 `struct` 並不直接支援像 C 那樣的 bit field 語法，但是你可以透過它的自訂長度整數和 `packed` 來完成。

轉型時可以利用 `@bitCast()`。

```zig
const print = @import("std").debug.print;

const BitField = packed struct {
    bit0: u1,
    bit1: u1,
    bit2: u1,
    bit3: u1,
    bit4: u1,
    bit5: u1,
    bit6: u1,
    bit7: u1,
};

const Register = union {
    bits: BitField,
    byte: u8,
};

pub fn main() void {
    const reg = Register{ .byte = 0xA4 };
    const bits: BitField = @bitCast(reg.byte);

    print("0x{x} = {}{}{}{} {}{}{}{}", .{
        reg.byte,
        bits.bit7,
        bits.bit6,
        bits.bit5,
        bits.bit4,
        bits.bit3,
        bits.bit2,
        bits.bit1,
        bits.bit0,
    });
}
```

```bash
0xa4 = 1010 0100
```

另一種：

```zig
const print = @import("std").debug.print;

const BitField = packed struct {
    bit0: u1,
    bit1: u1,
    bit2: u1,
    bit3: u1,
    bit4: u1,
    bit5: u1,
    bit6: u1,
    bit7: u1,
};

const Register = union {
    bits: BitField,
    byte: u8,
};

pub fn main() void {
    const bits = BitField{
        .bit0 = 0,
        .bit1 = 0,
        .bit2 = 1,
        .bit3 = 0,
        .bit4 = 0,
        .bit5 = 1,
        .bit6 = 0,
        .bit7 = 1,
    };

    const reg = Register{ .bits = bits };
    const byte_value: u8 = @bitCast(reg.bits);

    print("0x{x}", .{byte_value});
}
```

```bash
0xa4
```

# 匿名 struct

如果你需要一個臨時的 `struct`，則可以使用匿名 `struct`，例如想要一個多回傳值的函式。

```zig
const print = @import("std").debug.print;

pub fn main() void {
    const point = struct { x: i16, y: i16 }{ .x = 100, .y = -10 };
    print("X: {}, Y: {}", .{ point.x, point.y });
}
```

```bash
X: 100, Y: -10
```

# 參考

- [packed union: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#packed-union)
- [packed struct: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#packed-struct)
- [Anonymous Struct: Documentation - The Zig Programming Language](https://ziglang.org/documentation/0.13.0/#Anonymous-Struct-Literals)
- [Anonymous Structs | zig.guide](https://zig.guide/language-basics/anonymous-structs/)
