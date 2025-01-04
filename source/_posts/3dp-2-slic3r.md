---
title: '[教學:3D列印-2] Slic3r 切片軟體教學'
author: ZiTe
tags:
  - 3D列印
  - 教學
categories: []
date: 2017-05-22 12:48:00
comments: true
toc: true
draft: false
# aliases : ["/2017/05/3dp-2-slic3r/"]
---
要把東西印得又好又快，除了一台設計良好的3D列印機外，調整恰當的切片參數也是非常重要的，只要慢慢的嘗試，就可以找出最適合的列印參數。

[Slic3r](http://slic3r.org/)是我第一個使用的切片軟體，所以也是我研究最深入也最熟悉的軟體，基本上使用容易，要進行更細緻的調整也可以。

<!--more-->

首先要更改模式為Expert 將\[Mode\]中的\[Simple\]改為\[Expert\]。打開設定選單，點選左上角的\[File\] > \[Preferences\]

![](https://2.bp.blogspot.com/-GTTo62P_3n4/Xqz-jre9fjI/AAAAAAAACKY/vgm5JioIARQb2eXSzUhyvbvcTv5JUtPKwCPcBGAsYHg/s1600/Expert%2B%25E6%25A8%25A1%25E5%25BC%258F-2.png)

# 列印機設定：點選\[Printer Settings\]標簽

## 1.General

* Size and coordinates
    * Bed shape : 設定3D列印機的可列印範圍與原點
    * Z offset : Z軸高度調整。通常設定為0，Z軸高度會直接用3D列印機上的限位開關來調整
* Capabilities
    * Extruders : 設定3D有幾個擠出機組
* OctoPrint upload
    * Host or IP :
    * API Key :
* Firmware
    * G-code flavor : 選擇3D列印機的靭體類型。基本上使用Arduino和ATMega 2560的3D列印機都是選RepRap
* Advanced
    * Use relative E distances :
    * Use firmware retraction :
    * Use volumetric E :
    * Pressure advance :
    * Vibration limit (deprecated) :

![](https://1.bp.blogspot.com/-Sw3WqrCe29U/Xqz-jlMemLI/AAAAAAAACKY/ozkM-4898H0f6mGp6w06nenvLC6N015_wCPcBGAsYHg/s1600/1-1.png)


## 2.Custom G-code

* Start G-code : 開始列印時要執行的G-code指令
* End G-code : 結束列印時要執行的G-code指令
* Before layer change G-code : 換層前時要執行的G-code指令
* After layer change G-code : 換層後時要執行的G-code指令
* Tool change G-code :

![](https://1.bp.blogspot.com/-4LSrZ_ohJoQ/Xqz-jvtCJKI/AAAAAAAACKY/sYxDDZk6kvwzJOIcfudv8c3G6_md_yMPwCPcBGAsYHg/s1600/1-2.png)


## 3.Extruder 1

* Size
    * Nozzle diameter : 設定3D列印機的擠出頭孔徑(直徑)。當層高(Layer height)大於擠出頭孔徑(Nozzle diameter)時會造成切片錯誤。
* Position (for multi-extruder printers)
    * Extruder offset :
* Retraction
    * Length : 回抽材料的長度。調整此數值可改善牽絲的問題，但不能太大也不能太小，需要自己不斷測試來找出最適合的數值
    * Lift Z : 回抽時抬高Z軸的高度。此數值通常不會設定太大，甚至設定為0也可以
    * Speed : 回抽材料的速度
    * Extra length on restart : 回抽後重新進料時多擠的材料長度。通常此數值設定為0就好，但如果遇到回抽後重新擠料時來不及出料的狀況，就要增加此數值
    * Minimum travel after retraction : 但此次列印結束的位置與下個列印開始的位置相距不到這個距離時，不要進行回抽
    * Retract on layer change : 換層時是否要回抽。通常會開啟
    * Wipe while retracting :
* Retraction when toll is disabled (advanced settings for multi-extruder setups)
    * Length :
    * Extra length on restart :

![](https://2.bp.blogspot.com/-vH_5IvnHihs/Xqz-jmDUZ-I/AAAAAAAACKY/pWty8J2u0ywiYiRqDuzbp1umuiVEJrL2QCPcBGAsYHg/s1600/1-3.png)

# 材料設定: 點選\[Filament Settings\]標簽

## 1.Filament

* Filament
    * Color : 列印材料的顔色
    * Diameter : 列印材料的直徑
    * Extrusion multiplier : 列印材料的尺寸差補償。廠商標示的材料尺寸可能會和實際尺寸有些誤差，可以透過此數值進行補償。計算方式為標示尺寸(Diameter)除以實際尺寸，例如標示3mm的材料，實際測量為2.95mm，那此數值為3÷2.95≒1.017
* Temperature (°C)
    *  Extruder :
    * First layer : 列印第一層時的擠出頭溫度。由於第一層需要與列印平面有較好的接觸，所以第一層的溫度可以高一點
    * Other layers : 列印其他層時的擠出頭溫度
*  Bed ：
    *  First layer : 列印第一層時的熱床溫度。由於第一層需要與列印平面有較好的接觸，所以第一層的溫度可以高一點
    * Other layers : 列印其他層時的熱床溫度

![](https://3.bp.blogspot.com/-HSC7etsWyzQ/Xqz-jtL2gOI/AAAAAAAACKY/o4YGvVuUaA0PSDkBfKNkCrgbFcnpKknHACPcBGAsYHg/s1600/2-1.png)


## 2.Cooling

*  Enable
    * Keep fan always on : 風扇永遠開啓
    * Enable auto cooling : 自動風扇控制。通常使用此設定
* Fan settings
    * Fan speed :
        * Min : 最小風扇風量
        * Max : 最大風扇風量
    * Bridges fan speed : 搭橋時的風扇風量。由於搭橋時需要快速讓材料冷卻，所以可以加強風量
    * Disable fan for the first : 在列印前幾層時不要開啓風扇。由於第一層需要與列印平面有較好的接觸，所以可以設定列印前幾層時不要開啟風扇，以避免材料因為冷卻而收縮，造成列印件發生翹曲的狀況
* Cooling thresholds
    * Enable fan if layer print time is below :
    * Slow down if layer print time is below :
    * Min Print speed :

![](https://1.bp.blogspot.com/-v_MjifqO6lA/Xqz-jgblLbI/AAAAAAAACKY/jhfNny8-C4M50jwz9PxmymWiZoFuSQKiQCPcBGAsYHg/s1600/2-2.png)

# 列印參數設定: 點選\[Print Settings\]標簽

## 1.Layers and perimeters

* Layer height
    * Layer height : 層高，每一層列印出的材料高度，通常3D列印機的解析度就是指這個數值。當層高(Layer height)大於擠出頭孔徑(Nozzle diameter)時會造成切片錯誤。
    * First layer height : 第一層的層高。第一層的層高設定高一點可以補償列印平面表面的不平整
* Vertical shells
    * Perimeters : 外殼厚為多少圈。通常設定2~4圈就好，設定太多圈會嚴重加長列印時間，因為每一層都要印外殼
    * Spiral vase : 螺旋花瓶
*  Horizontal shells
    * Solid layers :
        * Top : 頂部的實體層為多少層。通常設定為2~4層
        * Bottom : 底部的實體層為多少層。通常設定為2~4層
*  Quality (slower slicing)
    * Extra perimeters if needed : 如果需要，增加外殼厚度
    * Avoid crossing perimeters :
    * Detect thin walls :
    * Detect bridging perimeters :
* Advanced
    * Seam position : 接縫位置。選擇列印兩不相鄰列印件時，每次開始列印不同列印件的位置。通常設定為Aligned來增加列印件美觀或Nearent來減少列印時間
    * External perimeters firs : 印外殼時，先印最外圈。通常不會使用

![](https://4.bp.blogspot.com/-MF8VogEfByQ/Xqz-jomDxfI/AAAAAAAACKY/SlWlJSNn1V8ou4k29AfmkNwybvi39zWeQCPcBGAsYHg/s1600/3-1.png)


## 2.Infill

* Infill
    * Fill density : 一般填充的百分比。通常設定15%~65%就好
    * Fill pattern : 一般填充的樣式。建議使用Honeycomb
    * Top/bottom fill pattern : 頂/底層一般填充的樣式。建議使用Rectilinear
* Reducing printing time
    * Combine infill every :
    * Only infill where needed : 只填充有需要的地方
* Advanced
    * Solid infill every : 每多少層進行一次實體填充。可以增加列印件強度，但通常不用
    * Fill angle : 每層填充轉的角度
    * Solid infill threshold area : 如果部分面積小於這個值時，此部分使用實體填充，而不是一般填充，可以增加強度
    * Only retract when crossing perimeters :
    * Infill before perimeters : 每一層先印填充，再印外殼，通常不用

![](https://1.bp.blogspot.com/-MZ1A5s4jTkk/Xqz-jgH_HyI/AAAAAAAACKY/QBNMKYxyVcUCRHEOZDrTBWodigpNg7ZfQCPcBGAsYHg/s1600/3-2.png)


## 3.Skirt and brim

* Skirt
    * Loops (minimum) : 預擠外框的最小圈數。為了確保列印時出料正常，會先在列印件外圍進行預擠，可以藉由觀察預擠外框來判斷出料的正確
    * Distance from object : 預擠外框與列印件的距離
    * Skirt height : 預擠外框的高度。通常設定為1層
    * Minimum extrusion length : 最小長度
* Brim
    * Brim width : 裙邊的寬度。增加裙邊可以讓列印件不容易發生翹曲的狀況，也可以當地基

![](https://2.bp.blogspot.com/-OwLfPZeCbUY/Xqz-jjqChRI/AAAAAAAACKY/cW8oI6DqLVwdVJ0KuhVTh9X3Hxz6oD0OwCPcBGAsYHg/s1600/3-3.png)

## 4.Support material

* Support material
    * Generate support material : 開啓支撐架
    * Overhang threshold :
    * Enforce support for the first :
* Raft
    * Raft layers : 棧板層高
* Options for support material and raft
    * Contact Z distance : 支撐架與列印件上下距離要多遠
    * Pattern :
    * Pattern spacing :
    * Pattern angle :
    * Interface layers :
    * Interface pattern spacing :
    * Don't support bridges : 搭橋的部分不要進行支撐

![](https://1.bp.blogspot.com/-S2lq4oWWU4g/Xqz-jm5QJ1I/AAAAAAAACKY/8A8y2Fukzy8QSHTqlMh8hD4dvZVXwpybACPcBGAsYHg/s1600/3-4.png)


## 5.Speed

* Speed for print moves
    * Perimeters : 外殼的列印速度。此速度可以快一些，能大量減少列印時間，因為每一層都要印外殼
    * Small perimeters :
    * External perimeters : 外殼最外圈的列印速度。此速度可以稍慢於外殼列印速度(Perimeters)，讓成品更美觀
    * Infill : 一般填充的列印速度
    * Solid infill : 實體填充的列印速度
    * Top solid infill : 頂層實體填充的列印速度。此速度設慢一些可以增加成品美觀
    * Support material : 支撐架的列印速度
    * Support material interface :
    * Bridges : 搭橋的列印速度
    * Gap fill : 薄牆的列印速度
* Speed for non-print moves
    * Travel : 非列印時的移動速度
* Modifiers
    * First layer speed : 第一層的列印速度。由於第一層需要與列印平面有較好的接觸，所以會慢慢印
* Acceleration control (advanced)
    * Perimeters :
    * Infill :
    * Bridge :
    * First layer :
    * Default :
* Autospeed (advanced)
    * Max print speed :
    * Max volumetric speed :

![](https://3.bp.blogspot.com/-ydZ2-vd-Nnw/Xqz-jnvvJzI/AAAAAAAACKY/5P-qETglka4mWHrhOvqoiszqHIkM97YPwCPcBGAsYHg/s1600/3-5.png)


## 6.Multiple Extruders

* Extruders
    * Perimeter extruder :
    * Infill extruder :
    * Solid infill extruder :
    * Support material/raft/skirt extruder :
    * Support material/raft interface extruder :
* Ooze prevention
    * Enable :
    * Temperature variation :
* Advanced
    * Interface shells :

![](https://2.bp.blogspot.com/-sF8KyRKZ8Jw/Xqz-jh_IBJI/AAAAAAAACKY/TwEOVcNjdU4V2h_CR5LKuJ1Smt1cBrFCgCPcBGAsYHg/s1600/3-6.png)


## 7.Advanced

* Extrusion width
    * Default extrusion width : 默認的擠出線寬。通常設定為擠出頭孔徑(Nozzle diameter)
    * First layer : 第一層的擠出線寬。由於第一層需要與列印平面有較好的接觸，所以會設定的寬一些
    * Perimeters : 外殼的擠出線寬
    * External perimeters : 外殼最外圈的擠出線寬
    * Infill : 一般填充的擠出線寬
    * Solid infill : 實體填充的擠出線寬
    * Top solid infill : 頂層實體填充的擠出線寬
    * Support material : 支撐架的擠出線寬
* Overlap
    * Infill/perimeters overlap : 填充與外殼重疊的長度。可以增加成品強度，但不可以設定太大
* Flow
    * Bridge flow ratio : 搭橋時的擠出量。搭橋時可以些微降低擠出量來避免材料下垂的現象
* Other
    * XY Size Compensation :
    * Threads : 切片時要使用多少個電腦的執行緒進行運算
    * Resolution : 切片前先降低模型的解析度。0為不降低解析度

![](https://1.bp.blogspot.com/-rpCch09vuS8/Xqz-jhQodyI/AAAAAAAACKY/ipaxIQxrcmUn36PTT0nwroK1_G96ZXbBACPcBGAsYHg/s1600/3-7.png)


## 8.Output options

* Sequential printing
    * Complete individual objects :
    * Extruder clearance (mm) :
        * Radius :
        * Height :
* Output fill
    * Verbose G-code :
    * Output filename format : 輸出檔案的檔名
* Post-processing scripts : 後處理腳本

![](https://1.bp.blogspot.com/-CpBgcnZ0ws4/Xqz-jg82wyI/AAAAAAAACKY/30dqcypJGF8fcBkkTmg0g5SyJIru0wkjQCPcBGAsYHg/s1600/3-8.png)

## 9.Notes 筆記

* Notes：可以在此做些筆記提醒自己。

![本文使用的Slic3r版本](https://1.bp.blogspot.com/-CpBgcnZ0ws4/Xqz-jg82wyI/AAAAAAAACKY/30dqcypJGF8fcBkkTmg0g5SyJIru0wkjQCPcBGAsYHg/s1600/3-8.png)

此文章還有些地方沒有完成，未來有空再更新。

# 相關文章

* [\[教學:3D列印-1\] 使用3D列印機的步驟](/posts/3dp-1-step/)
* [\[教學:3D列印-2\] Slic3r 切片軟體教學](/posts/3dp-2-slic3r/)(本篇)
* [\[教學:3D列印-3\] 常用G-code指令解讀](/posts/3dp-3-gcode/)
