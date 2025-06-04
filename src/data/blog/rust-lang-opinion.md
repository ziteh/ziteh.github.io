---
title: "Rust 之我見"
subtitle: "Rust Programming Language"
# description: ""
tags: ["心得","程式","Rust"]
categories: []

date: 2024-05-03T21:10:00+08:00
header_img: ""
comments: true
toc: true
draft: false
---

[Rust](https://www.rust-lang.org/) 在這幾年相當熱門，常常可以看到各大公司宣佈他們在嘗試使用 Rust 重寫某某程式，開源界也有許多新使用 Rust 編寫的工具（例如我喜歡的 Python linter：[Ruff](https://docs.astral.sh/ruff/)）。我也在好奇心下來嘗試學習這門語言，在簡單學習並寫了一個簡單的程式後，我想來分享一下我寫 Rust 的感想。

<!--more-->

由於我目前對 Rust 還不是非常熟悉，而且其實高階語言現在也不常寫了，如果有誤還請指正。

另外，我較熟悉的語言為：C/C++、C#、Python，比較通常是和它們比。然後我是比較單純的以「寫程式」的角度分享，我相信每各程式語言的設計背後都有充足且嚴謹的理由。

# 變數預設不可變

這個標題看起來可能有點奇怪，不可變的變數還能叫變數嗎？

據說有研究指出一支程式的變數有八成實際上都不會重新賦值，也就是不會變。而如果知道某個變數不會變的話，寫起來比較安全（不必擔心數值被意外賦值），編譯器也比較容易嘗試進行一些最佳化。

所以為了鼓勵人們使用不可變變數（Immutable），Rust 讓可變變數（Mutable）的「代價」比不可變的高，這樣人們就會自然而然地優先選擇使用不可變變數。而這裡的代價就是要打的字數。

來比較幾種語言：

```rust
// Rust
let a = 1;           // 不可變
let mul b = 2;       // 可變

// Kotlin
val a = 1            // 不可變
var b = 2            // 可變

// C#
readonly int a = 1;  // 不可變
int b = 2;           // 可變

// C++
const int a = 1;     // 不可變
int b = 2;           // 可變
```

可以發現，Rust 可變變數的代價較高（要多打3個字），Kotlin 兩者代價相同，C# 和 C/C++ 都是不可變變數的代價較高。雖然可能有人覺得現代 IDE 都有自動補全，差不了多少，但人類是很懶惰的，優秀的工程師更是如此（程式員三美德——懶惰、急躁、傲慢《Programming Perl》Larry Wall [Laziness Impatience Hubris](http://wiki.c2.com/?LazinessImpatienceHubris)）。

值得注意的是，Rust 還有常數 `const`，它和不可變變數的主要差異在編譯期（compile-time）或執行期（run-time）。`let` 是執行期常數，而 `const` 是編譯期常數（在編譯時確定）。

> 雖然我不寫 Kotlin，但我不喜歡它使用 `val` 和 `var`，它們只差在最後的 `l` 和 `r`，差異不夠明顯無法一眼看出。除非依賴 IDE 額外輔助顯示。

# 型別後置 & 推導

型別聲明後置與型別推導是大多數現代語言都有的特性，其好處就不用特別說了。

```rust
let id: u16 = 10;
let mut speed: f32 = 103.43;

let x = get_value();
```

# 明確大小的數值型別

身為一個韌體工程師，我在寫 C 的時候總是使用明確大小的數值型別，那幾 byte 的空間對我們很重要。能用 `uint8_t` 裝的絕不用 `uint16_t`；不會有負值的絕不用有號數。

但是 C 的原始型別名稱看不出它到底佔多少 byte（實際上也因平臺而異），也不知道實際的上下限範圍，所以就需要引入 `stdint` 或使用 `typedef` 來聲明型別別名。

而 Rust 本身的原始數值名稱就直接寫清楚它是幾位元、有無號，一目瞭然、不必猜測。

```rust
let a: u8 = 100;     // 1 byte, unsigned, 0~255
let b: u32 = 40000;  // 4 byte, unsigned, 0~4,294,967,295

let c: i8 = -23;     // 1 byte, signed, -128~127
let d: i16 = -1000;  // 2 byte, signed, -32,768~32767

let e: f32 = 3.1415; // 4 byte, floating-point IEEE 754-2008
let f: usize = 64;   // 取決於平臺的位數
```

# 尾隨逗號

Rust 的尾隨逗號（Trailing comma）是合法的，容許尾隨逗號可以讓人更方便地加入或刪除成員，不用特地編輯最後的逗號。現代語言基本上都有此特性。

```rust
// Rust
enum MyEnum {
    Value1,
    Value2,  // Ok
};
```

# 帶參數的 Enum

Rust 的 Enum（列舉）可以帶參數，但我第一次知道時覺得很詭異，因為我 C/C++ 的 Enum 沒有參數還不是用的好好的，為什麼你 Rust 就要帶參數？

但結果證明，我覺得這是一個好設計。

在 Rust 中應該會滿常用到 [`Option<T>`](https://doc.rust-lang.org/std/option/enum.Option.html) 和 [`Result<T, E>`](https://doc.rust-lang.org/std/result/) 這兩種型別，前者可以用來表示某個值是可選的（`Some(T)` 或 `None`），後者常用來當函式的結果是正確還是錯誤（`OK(T)` 或 `Err(E)`）。而這兩種型別都是透過 Enum 實現的。

```rust
// https://doc.rust-lang.org/std/option/enum.Option.html
pub enum Option<T> {
    None,
    Some(T),
}

// https://doc.rust-lang.org/std/result/
enum Result<T, E> {
   Ok(T),
   Err(E),
}
```

帶有參數的 Enum 無疑比 C/C++ 的傳統 Enum 更加靈活，可以做到更多操作，再搭配 Rust 的 `match` 模式配對，寫起來是滿舒服的。

# match 模式配對

Rust 沒有傳統的 `switch-case` 語法，取而代之的是 `match`。來比較一下：

```rust
// Rust: 6行，1層縮排
match status {
    400 => println!("Bad request"),
    404 => println!("Not found"),
    418 => println!("I'm a teapot"),
    _ => println!("Other"),
}
```

```c
// C： 13行，2層縮排
switch(status) {
    case 0:
        printf("Bad request");
        break;
    case 1:
        printf("Not found");
        break;
    case 6:
        printf("I'm a teapot");
        break;
    default:
        printf("Other");
}
```

```python
# Python： 9行，2層縮排
match status:
    case 400:
        print("Bad request")
    case 404:
        print("Not found")
    case 418:
        print("I'm a teapot")
    case _:
        print("Other")
```

可以發現 Rust 的 `match` 語法比較短。當然，程式碼當然不是越短就代表越好、易讀，但我覺得 Rust 的 `match` 也確實更加清晰直白。而且還有一個很重要的一點是，它只需要一層縮排。

而且 Rust 的 `match` 可以直接為變數賦值：

```rust
let result = match number {
    0 => "Zero",
    1 => "One",
    _ => "Other",
};
```

更進一步，使用複雜的比對：

```rust
match number {
    0 => println!("零"),
    1..=9 => println!("個位數"),
    n if n % 2 == 0 => println!("偶數"),
    _ => println!("Other"),
}
```

另外 Rust 的 `match` 可以巢狀嵌套：

```rust
let res: Result<Option<i32>, &str> = Ok(Some(42));

match res {
    Ok(data) => match data {
        Some(value) => println!("Got a value: {}", value),
        None => println!("Got None"),
    },
    Err(err_msg) => println!("{}", err_msg),
}
```

當然，像這樣子嵌套 `match` 無疑會大幅降低可讀性，要謹慎使用。

另外 Rust 還有所謂的 `if let` 語法可以簡化程式：[透過 if let 簡化控制流](https://rust-lang.tw/book-tw/ch06-03-if-let.html)。

> 不過老實說我不是很喜歡打 `=>`，如果可以只用一個符號的話打起來更舒服，但可能有特別的考量。

# 沒有例外處理 Exception

Rust 沒有常見的例外處理，也就是沒有 `try-catch`、`exception` 這些。通常透過回傳 `Rusult<T, E>` 和 `Option<T>`，並使用 `if-else` 或 `match` 來處理 Error 或 None。

因為 Rust 的理念是不曖昧、顯示處理、明確。它們認為這種方式可以鼓勵人們更好的主動處理錯誤。

```rust
let data = match get_data() {
    Ok(value) => value,
    Err(err) => {
        eprintln!("Error: {}", err);
        return Err(err);
    },
};
```

# 預設私有

封裝（Encapsulation）是 OOP 的一大特性，透過限制物件、函式等的存取來提高程式碼的安全性（不被任意修改或調用）與易用性（不用看到一堆用不到的東西）。

我自己覺得封裝是很重要的（也因此我不是很喜歡 Python，它沒有真正意義上的嚴格封裝）。就像前面提過的變數預設不可變一樣，雖然可變變數在寫程式時可能會比較方便，但不可變變數還是比較安全。公開（Public）方法雖然方便（不用怕找不到），但私有（Private）方法比較安全，也不會讓程式碼自動補全時跳出一堆無關的提示造成干擾，因此 Rust 鼓勵人們優先使用私有方法（及物件等）。

鼓勵的方法也和不可變變數一樣，讓 Public 的代價比 Private 高就可以了。代價一樣是要打的字數。Rust 預設的封裝都是 Private 的，如果要讓其變成 Public 的話，要多打 `pub`。

```rust
pub struct Person {
    pub name: String, // Public
    age: u32,         // Private
}

impl Person {
    // Public constructor
    pub fn new(name: String, age: u32) -> Self {
        Self { name, age }
    }

    // Public
    pub fn hi(&self) {
        println!("{}", self.get_info());
    }

    // Private
    fn get_info(&self) -> String {
        return format!("Name: {}, Age: {}", self.name, self.age);
    }
}
```

# 特徵 trait

Rust 不像 C# 或 Java 有真正的 [Interface](https://docs.oracle.com/javase/tutorial/java/concepts/interface.html)，取而代之的是特徵 [`trait`](https://doc.rust-lang.org/rust-by-example/trait.html)。用起來其實基本上一樣，另外 `trait` 內就不用另外聲明 `pub` 了。

```rust
trait Item {
    fn get_id(&self) -> i16;
}

struct Component {
    id: i16,
}

impl Item for Component {
    fn get_id(&self) -> i16 {
        self.id
    }
}

struct Category {
    id: i8,
    offset: i8,
}

impl Item for Category {
    fn get_id(&self) -> i16 {
        (self.id as i16) + ((self.offset as i16) << 8)
    }
}

fn main() {
    let cat = Category { id: 1, offset: 2 };
    let id = cat.get_id();
    println!("{}", id); // Print: 513
}
```

# 型別別名

就像 C 可以用 `typedef` 自訂型別，Rust 也可以使用 `type` 來定義型別別名（type alias）。

```rust
type Id = u8;
type ComplexType = (i16, String, Option<u8>);

fn main() {
    let my_id: Id = 255;
    let data: ComplexType = (82, String::from("hello"), None);
}
```

但是我必須要說，我不喜歡 Rust 選擇「type」這個字，因為我的程式裡確實有些地方會想用 type 當作屬性或成員，但 Rust 把它當作定義型別的關鍵字（keyword）了，所以就沒辦法用。我個人更偏好 C 的 `typedef` 這樣不易衝突的字。（雖然 Rust 有所謂的 Raw identifiers 可以突破此限制）

# 總結

以上就是我在簡單使用 Rust 一段時間後的感想，整體來說，我滿喜歡 Rust 的設計的，寫起來的感覺也很不錯（雖然我現在還不是完全理解 [Ownership 和 Lifetime](https://doc.rust-lang.org/nomicon/ownership.html)）。未來我會繼續學習 Rust ，讓它變成主力語言（無論是嵌入式還是桌面程式開發）。

當然，以上所述只是我個人的看法。如果有誤也歡迎提出。
