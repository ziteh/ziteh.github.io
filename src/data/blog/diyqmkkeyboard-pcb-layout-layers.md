---
title: '[自製QMK鍵盤-6] KiCAD鍵盤PCB繪製教學 (下)'
subtitle: 'KiCAD PCB 電路板 Layout 基礎教學'
author: ZiTe
tags:
  - 教學
  - DIY
  - 3C
  - QMK
categories: ["自製QMK鍵盤"]

date: 2023-05-07T19:35:00+08:00
header_img: ""
comments: true
toc: true
draft: false
---

![](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/0df02e9b.webp)

在[上一篇](/posts/diyqmkkeyboard-pcb-layout-sch)中已經介紹了 PCB 的設計步驟及 [KiCad](https://www.kicad.org/) Schematic 的基本用法，接下來要以 KiCad 7 作為示範，繼續介紹[製作步驟](/posts/diyqmkkeyboard-0/#製作步驟)的第 5 步的 PCB Layout 的部分。

<!--more-->

<iframe width="560" height="315" src="https://www.youtube.com/embed/zhCffPA7798?si=CJOahXMvx64g7Qb0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

> 以下內容以 KiCad `v7.0.2` 作為示範。

## PCB 基礎介紹

在正式繪製 PCB 電路板之前，先來簡單介紹 PCB 本身。

### 分層

首先是銅箔層數。PCB 依照其銅箔層的數量可以分為單層、雙層或 4、6、8 甚至到 64 層板，通常從 4 層板開始就會稱為多層板了。銅箔層數越多走線的靈活度也越高，但價格當然也會提升。除非是高密度產品，一般來說雙層板就已經足夠，對鍵盤來說也是，所以以下內容皆以雙層板為主。

對於一個雙層 PCB，它通常會有這樣的疊層：

| 層         | KiCad 中的名稱 |
| :--------- | :------------- |
| 頂層絲印   | F.Silkscreen   |
| 頂層錫膏   | F.Paste        |
| 頂層阻焊層 | F.Mask         |
| 頂層銅箔   | F.Cu           |
| 基板       | Dielectric     |
| 底層銅箔   | B.Cu           |
| 底層阻焊層 | B.Mask         |
| 底層錫膏   | B.Paste        |
| 底層絲印   | B.Silkscreen   |

### 組成

PCB 上大概會有幾種東西：

- 走線（Track）：用來連接各個零件的導線。
- 焊盤（Pad）：阻焊層沒有覆蓋、讓零件可以焊接到板子上的地方。
- [孔（Hole）](https://www.researchmfg.com/2015/06/pth-npth-via/)
  - 電鍍通孔（PTH，Plating through hole）：通常用於焊接 DIP 插板零件。因為孔壁有電鍍，可以導電，所以同時會連接上下兩層銅箔層。
  - 非電鍍通孔（NPTH，Non plating through hole）：不能導電的鑽孔，通常用來鎖螺絲或插入零件的固定插銷等。
  - Via：也算一種 PTH，只是通常會很小，不能插入零件接腳，只用來導通各個銅層。
- 鋪銅區（Filled zone）：大面積的銅箔區域，可以當作超粗的走線，也可以藉由其大表面積來幫助散熱，在一些情況下也有訊號屏蔽等功能。視情況而定，通常會連接 GND 走線網路。
- 絲印（Silkscreen）：供焊接人員或使用者辨識的標識性圖樣或文字，通常用來指示各零件的擺位及其代號。例如綠色 PCB 上通常用白色的絲印。
- [阻焊層（Solder mask）](https://www.researchmfg.com/2017/07/soldermask/)：俗稱「綠漆」，是一種絕緣塗料。PCB 上除了要焊接零件的焊盤與 PTH、要散熱的地方及要敷錫的地方外，都會覆蓋阻焊層，以避免短路，也更方便焊接。現在的阻焊層有各種顏色可以選，甚至有所謂的「透明阻焊層+黑色 FR4 基板」的設計，顏色基本上和性能無關。

> 對於進階的多層板還會有所謂的埋孔（Buried via）和盲孔（Blind via），這裡就不多做介紹了。

![PCB 的組成](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/4462e61d.webp)

### 表面處理

最後是表面處理。如果銅箔沒有做表面處理的話，那很容易就氧化掉了，會難以焊接。表面處理有很多種，但最常見的是 HASL（Hot air solder leveling，也就是常說的「噴錫」） 和 [ENIG](https://www.researchmfg.com/2016/02/enig-pros-cons/)（Electroless nickel immersion gold，也就是常說的「沉金」或「化金」）。

HASL 比較便宜，但是其平整度較差，且放太久後會不易吃錫焊接，一般還會再細分成有鉛和環保無鉛製程；ENIG 因為有金的關係，所以不易氧化，可以長時間儲存，而且表面非常平整，適合小型 SMD 元件，但是會貴上不少。

至少對於鍵盤 PCB 來說，不選擇 ENIG 的理由基本上只有成本考量。

> - 一般看到的「有黃金」的 PCB 板通常是 ENIG 製程的，而不是用電鍍的方式。電鍍鎳金是另一種表面處理。
> - 「無鉛（Lead free）」是一種環保工藝，但是會些微增加焊接難度，如果你的焊接技術沒有很好，或是沒有一把好的恆溫電烙鐵的話，不建議使用無鉛 HASL 和無鉛焊錫。

## PCB Laout

進行 PCB Layout 時，我通常會遵循以下的步驟：

1. 設定 PCB 設計參數。
1. 從 Schematic 更新 PCB。
1. 調整零件 Footprint 的位置。
1. 進行佈線。
1. 畫外框邊緣。
1. 編輯鋪銅區域。
1. 編輯絲印。
1. 進行 DRC（Design Rule Checking）。
1. 查看 3D 視圖。
1. 輸出生產檔案（Gerber 檔）。

其中第 3、4 步會花不少時間，尤其經驗不夠的話會要花很多時間調整，如果這部分有問題的話，可以多參考看看別人的 PCB 是怎麼畫得。

> 如果你需要上網查一些資料的話，有些人會將 KiCad 的 PCB 編輯器稱為「pcbnew」。

### PCB 設計參數

PCB 設計參數是用來規範設計的。每一家 PCB 工廠的製作能力都不同，容許的生產規格也不同，甚至不同種類的 PCB 允許的規格也不同。為了避免畫出工廠做不出來的 PCB，所以要設定一些參數限制。這些參數也會作為 DRC（Design rule check） 的檢查依據。

在 KiCad 的專案頁面雙擊 `<Project_Name.kicad_pcb>` 以開啓 PCB 編輯器。點擊上方工具列「File > Board Setup > Design Rules > Constraints」，這裡可以調整基本的設計約束。就像上面說的一樣，每個工廠的製造能力都不同，所以請參考你預計使用的生產商所提供的資訊調整這裡的數值（[JLCPCB 製作能力](https://jlcpcb.com/capabilities/pcb-capabilities)、[PCBWay 製造能力](https://www.pcbway.com/capabilities.html)）。通常最重要的有：

- Copper
  - Minimum clearance: 最小間距
  - Minimum track width: 最小線寬
  - Minimum annular width: 最小焊盤環型寬度
  - Minimum via diameter: 最小的 via 直徑（不是鑽孔）
  - Copper to hole clearance: 銅箔到孔的間距
  - Copper to edge clearance: 銅箔到邊緣的間距
- Holes
  - Minimum through hole: 最小鑽孔直徑
  - Hole to hole clearance: 孔到孔距離

如果非必要，或你對 PCB 製作不是很熟悉的話，不太建議將這些數值設定與工廠提供的極限一樣，而是稍微寬容一點，畢竟生產還是有可能出現做壞的。如果你不是很確定要怎麼設定這些值的話，可以參考下圖，這是我用 JLCPCB 時的設定，這邊的參數比較保守、沒有設到極限。

![PCB 設計參數參考](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/7e2230b6.webp)

另外，你可能會想為特定的走線設定特殊的規格，這時可以到「File > Board Setup > Design Rules > Net Classes」中設定。最常見的是把電源單獨設定得走線粗一點、Via 大一點；或設定 USB D+/- 差分訊號走線以符合阻抗匹配。

我通常使用的設定為：

- 一般：走線 0.2mm 寬/間距；Via Size 0.8mm，Via Hole 0.4mm。
- 電源：走線 0.35mm 寬/間距；Via Size 0.8mm，Via Hole 0.4mm。
- 細線：走線 0.15mm 寬/間距；Via Size 0.56mm，Via Hole 0.3mm。
- USB 訊號差動對（1.6mm 厚 PCB）：DP Width 0.6mm；DP Gap 0.13mm。

![為不同走線網路單獨設定樣式](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/95f1f607.webp)

如果你想要更詳細地設定 DRC 的話，可以到「File > Board Setup > Design Rules > Custom Rules」中設定。這裡是比較進階的用法，我自己也不是完全熟悉這邊的設定，但是可以大概參考一下我之前使用的設定：[KiCad custom rules for JLCPCB](https://gist.github.com/ziteh/0d88f3ad4d2d7f4b38755af364208a6e)

### 更新 PCB

只要 Schematic 完成了，就可以讓 KiCad 根據其內容自動更新 PCB。打開 Schematic，點擊上方工具列「Tools > Update PCB from Schematic」（或快捷鍵 `F8`）即可。KiCad 會自動打開 PCB 編輯器並將各個零件的 Footprint 擺上。

![更新 PCB](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/4b58922e.webp)

![更新 PCB](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/fade9a11.webp)

這時候各個零件的 Footprit 是零散擺放的，接下來就要我們把它們排到適合的位置。

![更新完的 PCB](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/1660ced8.webp)

### 零件擺放

首先要將各個零件 Footprint 擺放到適合的位置，這一步驟相當吃經驗，可能也需要一些電路知識。Footprint 擺放得好的話，之後走線會很順暢，也會影響電路性能。這部分我暫時想不到有什麼訣竅，最好的方式就是多參考別人的 PCB。

在擺放 Footprint 時為了避免自己動到絲印或其它東西，以及保持畫面乾淨，我通常會在右側把「F/B. Silkscreen」和「F/B.Fab」層的顯示關閉，然後右下的「Selection Filter」也會取消「Text」的勾選。

![關閉特定的層與可選性，以保持畫面感覺和避免誤觸](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/8865e741.webp)

點選零件 Footprint 並按 `R` 可以旋轉，按 `F` 可以將它換到另一面，雙擊可以編輯詳細的屬性。你可能會需要隨時調整網格來協助擺放與對齊，可以在上方工具列調整。

![變更網格](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/6cd20259.webp)

> PCB 通常會分別使用公制單位毫米 mm 與英制單位密耳 mil。1mil 為千分之一英寸，也就是約 0.0254mm。

***請注意***，PCB 分為上下兩面：Front/Top Side 和 Back/Bottom Side，在擺放所有零件的時候都要注意這個 Footprint 應該在 Front 還是 Back？以鍵盤為例，一般來說鍵軸本體會在 Front Side 上，但是它的 Pin 腳或穿過焊盤孔（PTH），所以其焊點其實是在 Back Side。而如果你要用鍵軸熱插拔座的話，它也是焊在 Back Side。所以在使用鍵軸的 Footprint 時一定要確認清楚它要擺在那一面？這個 Footprint 是否已經預先翻面了？如果你還不是很熟悉的話，最好找個照片或拿出實際的鍵軸多檢查幾遍。

![注意 Footprint 所在的面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/fb95384b.webp)

![你能分辨 A 和 B 哪一個的 Footprint 放錯面了嗎？答案在文末](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/5e7ec4e6.webp)

在擺放零件時要注意各個零件的「Courtyard」不要重疊了。這個代表零件的實體大小，雖然它通常會畫得比真實的零件還大上一圈，但是擺得太近也不方便焊接。

![各零件的 Courtyard 不要重疊](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/ed407041.webp)

值得注意的是，IC 的各個電源腳（如 VCC、VDD、AVDD）等通常都會有去藕電容（Decoupling capacitor），還有 LDO 穩壓器通常也會有輸出/入電容，有些腳位可能會有上/下拉電阻（Pull up/down resistor）。這些電容和電阻都要儘可能地靠近它所屬的元件腳位，走線越短越好。

![去藕電容要儘量靠近 IC](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/4819ea48.webp)

![電容要儘量靠近 IC](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/d402a9a1.webp)

如果你對這部分毫無頭緒的話，可以看看我畫的 PCB，雖然我也不是專門學 PCB Layout 的，但是這些 PCB 都是實際生產並可以工作的。

- [ergo-snm-keyboard](https://github.com/ziteh/ergo-snm-keyboard)
- [calcite](https://github.com/ziteh/calcite)
- [rp-micro](https://github.com/ziteh/rp-micro)

> 你或許可以用 [KiCanvas](https://kicanvas.org/) 來線上查看 KiCad 的 PCB 檔案，例如[這樣](https://kicanvas.org/?github=https%3A%2F%2Fgithub.com%2Fziteh%2Fcalcite%2Ftree%2Fmain%2FCalcite52)。我的另一篇文章有介紹：[KiCanvas——線上預覽KiCAD電路圖](/posts/kicanvas-intro/)

#### 自動擺放

鍵盤 PCB 中擺放上比較*麻煩*的是鍵軸與衛星軸，因為它們的位置不能亂排，必須要照著你設計的鍵盤  Layout 才行，但是一把鍵盤幾十甚至上百個按鍵，每個按鍵都手動擺位置既沒效率也容易出錯，更別說擺完鍵軸後還有同等數量的鍵矩陣掃描二極體，所以這時我們要善用自動化工具。

我使用的是 [KiCAD KLE Placer](https://github.com/zykrah/kicad-kle-placer) 這個插件，它可以根據 Keyboard Layout Editor（KLE）下載的 JSON 檔幫你自動把鍵軸、衛星軸和二極體都自動擺放到位。

安裝方式是使用 KiCad 的 Plugin and Content Manager（PCM），在其頁面的「Mange」中加入其作者提供的網址 `https://raw.githubusercontent.com/zykrah/zykrah-kicad-repository/main/repository.json`，並選擇「Zykran's KiCad repository」就可以在「Plugins」中看到「KiCAD KLE Placer」了，點擊「Install」後再按「Apply Pending Changes」即可進行安裝。

首先到 KLE 上，載入你的鍵盤 Layout，然後將所有的按鍵標記文字（Legends）移除（可以在 KLE 下方的「Tools」標籤頁選擇「Remove Legends > All」），然後在每個鍵最中間的標記文件打上編號，由 `1` 開始，從左至右、上到下遞增。完成後再下載 JSON。

> 我有試過不修改按鍵文字一樣可以，但作者的說明中表示要做這一步，所以不嫌麻煩的話還是做一下。

![在 KLE 上幫各個按鍵加上順序編號](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/96d80e7f.webp)

要使 KiCAD KLE Placer 可以工作的話，Schematic 有一些需要注意的地方。

1. 鍵軸的代號（Annotate, Reference, Designator）需要以「Sort symbols by Y position」的順序進行排列。其實就是照著上面說到 KLE 的順序排。
2. 有衛星軸的話，衛星軸的代號要和該鍵軸的代號一樣。例如 `KEY16` 有衛星軸，那它的衛星軸代號要是 `S16`。

> 對於多重佈局（Multilayout）等進階的用法這裡就不多做介紹了，請參考原 repo 的說明。

記得也要把衛星軸的 Footprint 改成正確的長度（例如 2U、2.75U 或 6.25U 等）。另外如個你要畫的鍵盤有數字鍵區的話，請特別注意下圖中 `KEY8` 與 `KEY15` 這兩個垂直 2U 鍵的擺放位置及代號。

> 在上一篇中我沒有加入衛星軸，現在加上了。我這裡使用的是 [marbastlib](https://github.com/ebastler/marbastlib) 的 Symbol 及鍵軸 Footprint。

![零件代號的順序設定](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/a7c145dc.webp)

![編輯完成的鍵矩陣 Schematic](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/f07eed31.webp)

Schematic 有更新的話記得要再「Update PCB from Schematic」一次。打開 PCB 編輯器，這時請找到你的第一個鍵軸和二極體（`KEY1` 與 `D1`）的 Footprint，把 `KEY1` 拉到編輯器上附加較空曠的地方，然後把 `D1` 也拉到它附近，這時你要思考一下鍵軸和二極體之間要如何擺放才適合，之後所有按鍵的位置都會參考它們的擺放關係。

![先擺好 KEY1 與 D1 的位置](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/432afadb.webp)

在上方工具列「Tools > External Plugins > KLE Placer」打開其頁面。

![開啓 KLE Placer](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/0b422fe0.webp)

在「Select KLE json file」中選擇你在 KLE 上編輯並下載的 JSON 檔，「Key/Stabillizer/Diode Annotation format string」中分別輸入你使用的鍵軸、衛星軸及二極體的代號格式，預設是 `SW{}`、`S{}`、`D{}`，但是我為了把機械鍵軸與一般的按鈕分開，所以鍵軸的代號改成 `KEY{}`。設定好後就按「OK」即可。

![KLE Placer 頁面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/bf2f54a5.webp)

如果衛星軸的角度不對的話，可以按 `R` 旋轉。如果你的鍵軸都已經確定擺放到位的話，為了避免後續又不小心動到，你可以將它們鎖定（選取後快捷鍵 `L`）。

![完成自動擺放](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/67862bbd.webp)

![鎖定](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/c856c152.webp)

> 若你不想用 KiCAD KLE Placer，也可以試試[上一篇](/posts/diyqmkkeyboard-pcb-layout-sch/#自動生成鍵盤-pcb)介紹過的 [Keyboard PCB Builder](https://kb.xyz.is/)。

### 佈線

由於現在各個 Footprint 之間的走線還沒完成，所以會顯示預拉線（Ratsnest），它根據 Schematic 的接線連接各個 Footprint 的腳位，讓你可以參考哪些零件的哪個腳會接在一起。擺放 Footprint 時可以參考預拉線，而之後正式佈線時只有把所有的預拉線用正在的走線連接在一起就可以了。這一步通常也需要一些經驗才有辦法走得好，如果發現有幾條線怎麼都走不好的話，可以重新調整一下 Footprint 的擺放。

![各接腳會有預拉線連接](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/df90a55a.webp)

要進行走線的話，可以按 `X` 來開始進行走線。我通常會先將遊標移到焊盤上，再按 `X` 開始走線。為了避免尖端輻射與避免銅箔脫離等問題，PCB 的走線轉角通常為 135°，而不是 90°。如果要刪除一條走線的話，可以在選取後右鍵按「Unround Selected」。電源的走線可以設定得粗一點。也可以善用在點選一個走線後按 `U` 來選擇。

> 如果你想要走線有圓弧的轉角的話，可以選擇兩條線後按右鍵「Fillet Teacks」並輸入半徑。

在佈線的過程中可能會需要「換面」，這時可以按 `V`，它會換層並自動幫你加一個 Via，並保持走線模式。如果你要單獨增加 Via 的話，可以按右邊工具列的「Add free-standing vias」或快捷鍵 `Ctrl`+`Shift`+`V`。在擺放 Via 時，除非有必要（或是使用[塞孔](https://www.researchmfg.com/2023/05/pcb-vias-plugging/)製程），不然應該避免直接將 Via 放在焊盤上，對於這點請參考 [Via-in-pad](https://www.researchmfg.com/2010/11/vias-in-pad/)。

![使用按鍵 X 和 V 靈活地佈線](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/ada8660b.webp)

如果你想仔細地查看其中一條接線網路的話，可以選擇該網路的焊盤或走線後，按右鍵「Net Inspection Tools > Highlight Net」（或選取後按快捷鍵「`」）。要解除的話就按「ESC」即可。

![Highlight 特定走線網路](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/9587864b.webp)

佈線的過程倒是沒什麼特別的，基本上就是照著預拉線做連連看、把各個零件的接腳連接起來而已。左下角的「Unrouted」會顯示目前還有幾條線沒連接。

![擺放零件並完成佈線（以 Calcite52 為例）](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/649d4b88.webp)

#### 自動佈線

佈線通常是最無聊的一步，好險現在有自動佈線工具可以用。雖然自動佈線可能沒辦法走得很好看，但它可以為我們提供一些參考，當然如果你不是很在乎美觀的話，也可以直接用它完成的佈線。

我使用的工具是 [Freerouting](https://github.com/freerouting/freerouting)。在 KiCad 的 PCM 中就可以直接安裝了。使用上其實沒什麼特別的，詳細的用法就請參考[官方說明](https://github.com/freerouting/freerouting#additional-steps-for-users-of-kicad)。你可以先把一些比較重要的走線動手完成，之後在使用自動佈線工具完成剩餘的走線。

### 邊緣與鋪銅

等走線都完成後就可以畫 PCB 的外框邊緣。在右側的層列表中切換到「Edge.Cuts」層，然後使用右側工具列的「Draw a line」或「Draw a Rectangle」來繪製外框。請注意畫完的外框一定要是封閉的才行。

![畫外框](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/ff2648de.webp)

PCB 通常會進行鋪銅將 Footprint 與走線外的空白處保留銅箔，通常敷銅也會連接 GND。切換到「F.Cu」或「B.Cu」層，點選右側工具列的「Add a filled zone」，把「F.Cu」與「B.Cu」層都勾選，「Net」選擇「GND」，OK 後就可以框出要鋪銅的區域，雙擊以結束。放好鋪銅區後按 `B` 就會自動根據設定完成鋪銅。

![鋪銅區域設定](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/b9a82047.webp)

![完成外框與鋪銅的 PCB（以 Calcite52 為例）](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/b56e8ae1.webp)

### 編輯絲印

絲印基本上與 PCB 的運作沒有關係，它只是用來標識各種資訊方便焊接人員進行焊接或美觀用途等，所以我習慣比較後面再編輯。

把在右側層列表中把「F/B.Silkscreen」的顯示打開並選取，然後記得把右下的「Selection Filter」的「Text」勾選，這樣就可以擺放各個零件的代號（Designator）了。把這些代號排在該零件的附近，如果文字太大擺不下的話可以稍微縮小一點，

一般來說我會使用「1mm 長寬，0.15mm 線寬」的文字，要小一點的話會用「0.8mm 長寬，0.15mm 線寬」，極限的話會用「0.6mm 長寬，0.125mm 線寬」。每一家 PCB 工廠可以印的文字大小都不同，請參考他們的製作能力。

> 底層的 B.Silkscreen 文字記得要「鏡像」，一般來說 KiCad 會自動設定。

對於一些零件，你可能會想額外標記第一腳（Pin 1）以方便確認 IC 的擺放方向，可以使用右側工具列的「Draw a Circle」繪製圓形，雙擊畫好的圓形可以調整實心填充。

KiCad 的文字支援變數如 `${TITLE}`、`${REVISION}`，或樣式標記例如 `_{下標}`、`^{上標}`、`~{Bar}`。

> KiCad 7 才開始支援變更文字字形。

### DRC 檢測

到這一步，PCB Layout 已經快要完成了，但是為了確保我們的 PCB 符合工廠的製作能力與設計規則，我們要進行 DRC。

在上方工具列按「Show the design rules checker window」以顯示 DRC 視窗，並點擊「Run DRC」，KiCad 就會自動根據你[設定的規則](/posts/diyqmkkeyboard-pcb-layout-layers/#pcb-設計參數)進行檢測，並且列出所有的 Error 與 Warning。Error 是一定要處理的問題，Warning 如果比較懶的話基本可以就放著不管。

![顯示 DRC 頁面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/55f6d817.webp)

![DRC 頁面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/2e6c7f20.webp)

### 3D 檢視器

當你的 PCB 都畫完後，可能會想看看它實際上長什麼樣，這時可以使用 3D 檢視器。在上放工具列「View > 3D Viewer」即可打開。

![3D 檢視器（以 Calcite52 為例）](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/6843db55.webp)

### 輸出 Gerber 檔

PCB 全部完成後就可以輸出工廠生產用的 Gerber 檔了。

每一家工廠所需要的 Gerber 設定可能都不同，詳細請參考他們的說明（[JLCPCB](https://jlcpcb.com/help/article/16-How-to-generate-Gerber-and-Drill-files-in-KiCad-6)，[PCBWay](https://www.pcbway.com/blog/help_center/Generate_Gerber_file_from_Kicad_5_1_6.html)）。另外，也可以用插件來更方便地輸出 Gerber 檔，JLCPCB 的話可以用 [KiCAD JLCPCB tools](https://github.com/Bouni/kicad-jlcpcb-tools)，PCBWay 的話可以用：[PCBWay Plug-In for KiCad](https://www.pcbway.com/blog/News/PCBWay_Plug_In_for_KiCad_3ea6219c.html)。

> 正式輸出 Gerber 前建議再跑一次 DRC。

#### 手動輸出

以下以 JLCPCB 的規範為例，示範一下手動輸出 Gerber 的方式。

在上方工具列「File > Fabrication Outputs > Gerbers (.gbr)」

![開啓 Gerber 輸出頁面](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/fa9a6f16.webp)

在跳出的「Plot」頁面依照下圖進行設定。「Output directory」是檔案輸出的路徑，我習慣打上「gerber」，這樣 KiCad 就會自動在專案內新增一個 `gerber` 資料夾，並將檔案都放在裡面。設定好後就按下「Plot」，如果有詢問是否要 Refill，選擇執行 Refill。

![Gerber 檔輸出設定（JLCPCB）](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/df2188b5.webp)

然後還有輸出鑽孔檔。按「Plot」頁面右下的「Gererate Drill Files」，在新跳出的「Generate Drill Files」頁面依照下圖進行設定。完成後按下「Generate Drill File」與「Generate Map File」這兩個按鈕。

![鑽孔資料輸出設定（JLCPCB）](https://bucket.ziteh.dev/blog/diyqmkkeyboard-pcb-layout-layers/46b00732.webp)

這樣就完成 Gerber 檔的輸出，可以在 `gerber` 資料夾中看到輸出的檔案。建議使用 Gerber 檢視軟體再次查看生成的 Gerber 檔是否正確。將整個 `gerber` 資料夾壓縮成 `.zip` 壓縮檔。

常見的 Gerber 檢視器有：

- [gerbv](http://gerbv.geda-project.org/)
- [tracespace view](https://tracespace.io/view/)（線上）
- [Reference Gerber Viewer](https://gerber.ucamco.com/)（線上）

> 有時候這些 Gerber 檔檢視器也會顯示錯誤，可以多用幾個不同的檢視器確認。如果你無法確定你的 Gerber 是否正確，或許可以聯絡 PCB 工廠尋求協助。

## 快捷鍵參考

一些基本的快捷鍵

|     按鍵     | 功能                                    |
| :----------: | :-------------------------------------- |
|      R       | 旋轉所選的項目                          |
|      F       | 將所選的項目換面                        |
|      E       | 編輯所選的項目                          |
|      X       | 開始繪製走線                            |
|      V       | 在繪製走線狀態下新增一個 Via 並自動換面 |
|      U       | 點選一條走線後，分段選取                |
| ` (ESC 下方) | 高亮顯示同一條走線網路                  |

## 相關網頁

- [本 QMK 教學系列文列表](/posts/diyqmkkeyboard-0/#教學文列表)
- [Keyboard PCB Builder](https://kb.xyz.is/)
- [KiCAD JLCPCB tools](https://github.com/Bouni/kicad-jlcpcb-tools)
- [PCBWay Plug-In for KiCad](https://www.pcbway.com/blog/News/PCBWay_Plug_In_for_KiCad_3ea6219c.html)
- [KiCad 官方文件](https://docs.kicad.org/7.0/zh/getting_started_in_kicad/getting_started_in_kicad.html)
- QMK相關
  - [QMK 官方網站](https://qmk.fm/)
  - [QMK 官方文件](https://docs.qmk.fm/#/)
  - [QMK 的 GitHub](https://github.com/qmk/qmk_firmware)

參考資料：

- [電子製造，工作狂人(ResearchMFG)](https://www.researchmfg.com/)
- JLCPCB
  - [PCB Manufacturing & Assembly Capabilities - JLCPCB](https://jlcpcb.com/capabilities/pcb-capabilities)
  - [How to generate Gerber and Drill files in KiCad 6 - JLCPCB Help Center](https://jlcpcb.com/help/article/16-How-to-generate-Gerber-and-Drill-files-in-KiCad-6)
- PCBWay
  - [PCB Capabilities - Custom PCB Prototype the Easy Way - PCBWay](https://www.pcbway.com/capabilities.html)
  - [Generate Gerber file from Kicad 5.1.6 - Help Center - PCBway](https://www.pcbway.com/blog/help_center/Generate_Gerber_file_from_Kicad_5_1_6.html)

---

Footprint 問題：A 的 Footprint 是正確的；B是錯的。
