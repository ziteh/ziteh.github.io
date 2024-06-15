---
title: "馬達調變技術：SPWM 與 SVPWM"
subtitle: ""
# description: ""
tags: [""]
series: []
# categories: []
date: 2024-06-10T18:00:00+08:00
header_img: ""
comment: true
toc: true
math: true
draft: true # false
---

# SPWM

SPWM是藉由Park逆變換將$d$-$q$座標系根據目前馬達角度轉換到$\alpha$-$\beta$座標系，並以Clarke逆變換再次轉換到直流無刷馬達的三相$A$-$B$-$C$座標系。\cite{Meghana2017}

$d$軸與$\alpha$軸對齊的Park逆變換可以寫為：

$$
\begin{align}
\begin{bmatrix}
  U_\alpha \newline\newline
  U_\beta
\end{bmatrix} =
\begin{bmatrix}
  \cos{\theta} & -\sin{\theta} \newline
  \sin{\theta} &  \cos{\theta}
\end{bmatrix}
\begin{bmatrix}
  U_d \newline
  U_q
\end{bmatrix}
\end{align}
$$

Clark逆變換為：

$$
\begin{align}
\begin{bmatrix}
  U_A \newline
  U_B \newline
  U_C
\end{bmatrix} =
\begin{bmatrix}
    1            & 0 \newline
    -\frac{1}{2} & \frac{\sqrt{3}}{2} \newline
    -\frac{1}{2} & -\frac{\sqrt{3}}{2}
\end{bmatrix}
\begin{bmatrix}
  U_\alpha \newline
  U_\beta
\end{bmatrix}
\end{align}
$$

$$
\begin{align}
\begin{dcases}
\begin{array}{ll}
  U_{AG} = \frac{1}{2}U_{DC} + \frac{1}{2}U_{DC} \sin\theta \newline\newline
  U_{BG} = \frac{1}{2}U_{DC} + \frac{1}{2}U_{DC} \sin\left( \theta - 120^\circ \right) \newline\newline
  U_{CG} = \frac{1}{2}U_{DC} + \frac{1}{2}U_{DC} \sin\left( \theta + 120^\circ \right)
\end{array}
\end{dcases}
\end{align}
$$

$$
\begin{align}
\begin{dcases}
  U_{AN} = U_{AG} - U_{NG} \newline
  U_{BN} = U_{BG} - U_{NG} \newline
  U_{CN} = U_{CG} - U_{NG}
\end{dcases}
\end{align}
$$

對於任意時刻，馬達各相電壓加總為$0$，因此：

$$
\begin{align}
  0 &= U_{AN} + U_{BN} + U_{CN} \newline
    &= U_{AG} + U_{BG} + U_{CG} - 3U_{NG} \newline
    &\to U_{NG} = \frac{1}{2}U_{DC}
\end{align}
$$

將上式代回式\eqref{spwm_phase_vol}可得：
$$
\begin{align}
\begin{dcases}
\begin{array}{ll}
  U_{AN} = \frac{1}{2}U_{DC} \sin\theta \newline\newline
  U_{BN} = \frac{1}{2}U_{DC} \sin\left( \theta - 120^\circ \right) \newline\newline
  U_{CN} = \frac{1}{2}U_{DC} \sin\left( \theta + 120^\circ \right)
\end{array}
\end{dcases}
\end{align}
$$

由上式可知SPWM之相電壓峰值為$\frac{1}{2}U_{DC}$。以A、B相為例，求三相系統線電壓與相電壓的關係：

$$
\begin{align}
\begin{dcases}
    \begin{array}{ll}
    U_{AN} = P \sin\theta \newline
    U_{BN} = P \sin\left( \theta - 120^\circ \right)
    \end{array}
\end{dcases}
\end{align}
$$

可得各相電壓的關係為：

$$
\begin{align}
    U_{AB} &= U_{AN} - U_{BN} \newline
           &= P \left[ \sin\theta - \sin\left( \theta - 120^\circ \right) \right] \newline
           &= P \left[ 2\cos\left( \frac{2\theta-120^\circ}{2} \right) \sin\left( \frac{\theta-\theta+120^\circ}{2} \right)  \right] \newline
           &= \sqrt{3}P \cos\left( \theta - 60^\circ \right) \newline
           &= \sqrt{3}P \sin\left( \theta + 30^\circ \right)
\end{align}
$$

其中$P$代表振幅。由此可知三相系統中的線電壓為相電壓之$\sqrt{3}$倍。

計算SPWM的電壓利用律——線電壓峰值與直流電源電壓之比值約為$86.6\%$。

$$
\begin{align}
    \xi_\text{SPWM} &= \frac{\sqrt{3} \cdot \frac{1}{2}U_{DC}}{U_{DC}} = \frac{\sqrt{3}}{2} \newline
    &\approx 0.866
\end{align}
$$

# SVPWM

SVPWM一樣會先使用Park逆變換到$\alpha$-$\beta$座標系，但改用空間向量調變（Space vector modulation, SVM）轉換到馬達三相座標系。對於三相系統，在空間向量平面上有八個基本向量$\mathbf{V}_0$到$\mathbf{V}_7$，其中$\mathbf{V}_1$到$\mathbf{V}_6$是非零向量，$\mathbf{V_0}$與$\mathbf{V_7}$是零向量。 \cite{Majeed2020, Meghana2017}

各基本向量的二進制代號即代表所對應馬達驅動電路各相的半橋電晶體組開關狀態。如$\mathbf{V}_1$為001，則B與C相接至電源負，A相接至電源正，故B與C相上橋臂電晶體關閉（OFF）下橋臂電晶體開啟（ON），A相上橋臂開啟而下橋臂關閉。如圖\ref{i:SVPWM_driver_2}所示。
\clearpage


以$\mathbf{V}_1 (001)$為例，$U_{DC}$為直流供應電源，此時馬達A端接電源正、B與C端接電源負，可得馬達線電壓為：

$$
\begin{align}
\begin{dcases}
    \begin{array}{ll}
    U_{AB} &= U_{DC} \newline
    U_{BC} &= 0 \newline
    U_{CA} &= -U_{DC}
    \end{array}
\end{dcases}
\end{align}
$$

$N$為馬達中性點，其相電壓關係為：
$$
\begin{align}
\begin{dcases}
    \begin{array}{ll}
    U_{AN} - U_{BN} = U_{DC} \newline
    U_{AN} - U_{CN} = U_{DC} \newline
    U_{AN} + U_{BN} + U_{CN} = 0
    \end{array}
\end{dcases}
\end{align}
$$

$$
\begin{align}
    U_{AN} &= U_{DC} + U_{BN} = U_{DC} + U_{CN}
\end{align}
$$

令$U_{BN}=U_{CN}=U_x$：

$$
\begin{align}
    U_{AN} + U_{BN} + U_{CN} &= 0 \newline
    \to U_{AN} &= -2U_x \newline
    &= U_{DC} + U_x \newline
    \to U_{DC} &= -3U_x \newline
    \to U_x &= -\frac{U_{DC}}{3}
\end{align}
$$

馬達相電壓為：

$$
\begin{align}
    U_{AN} &= \frac{2}{3} U_{DC} \newline
    U_{BN} = U_{CN} &= -\frac{U_{DC}}{3}
\end{align}
$$

由此可知，對於特定方向SVPWM最大可能的相電壓為$\frac{2}{3}U_{DC}$，此時馬達中性點$N$對地電壓為$\frac{U_{DC}}{3}$。

對於SVPWM的基本向量，六個非零向量彼此間隔$60^\circ$，兩個零向量與原點重疊，這些向量可以組成一個正六角形。由式\eqref{svm_max_v_phase}可以得知，各非零向量$\mathbf{V}_1 \sim \mathbf{V}_6$的模長為$\frac{2}{3}U_{DC}$，即六角形的外接圓半徑為$\frac{2}{3}U_{DC}$。六角形的內接圓半徑為$\frac{\sqrt{3}}{3}U_{DC}$。內接圓被各個非零向量分隔成六個扇形，這六個扇形分別稱為I \textasciitilde VI扇區（Sector）。

與$\alpha$-$\beta$座標系重合的整個SVPWM向量平面如圖\ref{i:SVPWM_vector_representation}所示。其中，$\mathbf{V}_{ref}$為參考電壓向量，為形成各個扇區內的兩個基本非零向量及兩個零向量之組合，其模長最大為$\frac{\sqrt{3}}{3}U_{DC}$，超過此數值的情況將發生過調變（Over-modulation），即$\mathbf{V}_{ref}$的操作範圍不得超過六角形之內接圓。

以I扇區為例，須計算包含在此扇區內各個向量（$\mathbf{V}_1$、$\mathbf{V}_3$、$\mathbf{V}_0$及$\mathbf{V}_7$）所需的佔用時間：

$$
A_r = B_r
$$

$$
\left| \mathbf{A}_{r} \right| = \left| \mathbf{B} \right|
$$

$$
\begin{align}
\left| \mathbf{A}_{r} \right| = \left| \mathbf{B}_{r} \right|
\end{align}
$$

$$
\left\vert \mathbf{U}_{ref} \right\vert = \left\vert \mathbf{U}_{ref} \right\vert
$$

$$
\begin{align}
\left| \mathbf{U}_\alpha \right| &= \left| \mathbf{V}_{ref} \right| \cos{\theta} \newline
                                 &= \frac{T_1}{T_s}\left| \mathbf{V}_1 \right| +
                                    \frac{T_3}{T_s}\left| \mathbf{V}_3 \right| \cos{\left(\frac{\pi}{3}\right)} \newline
\left| \mathbf{U}_\beta  \right| &= \left| \mathbf{V}_{ref} \right| \sin{\theta} \newline
                                 &= \frac{T_3}{T_s}\left| \mathbf{V}_3 \right| \cos{\left(\frac{\pi}{6}\right)}
\end{align}
$$

$$
\begin{align}
    \left| \mathbf{V}_{ref} \right| \sin{\theta} &= \frac{T_3}{T_s}\left| \mathbf{V}_3 \right| \cos{\left(\frac{\pi}{6}\right)} \newline
    \to T_3 &= T_s \frac{2}{\sqrt{3}} \frac{\left| \mathbf{V}_{ref} \right|}{\left| \mathbf{V}_3 \right|} \sin{\theta}
\end{align}
$$

$$
\begin{align}
    \left| \mathbf{V}_{ref} \right| \cos{\theta} &= \frac{T_1}{T_s}\left| \mathbf{V}_1 \right| +
        \frac{T_3}{T_s}\left| \mathbf{V}_3 \right| \cos{\left(\frac{\pi}{3}\right)} \newline
                                                 &= \frac{T_1}{T_s}\left| \mathbf{V}_1 \right| +
        \frac{1}{\sqrt{3}} \left| \mathbf{V}_{ref} \right| \sin{\theta} \newline
    \to T_1 &= T_s \frac{\left| \mathbf{V}_{ref} \right|}{\left| \mathbf{V}_1 \right|} \left( \cos{\theta}-\frac{1}{\sqrt{3}} \sin{\theta} \right)
\end{align}
$$

因式\eqref{svm_max_v_phase}，以$\left| \mathbf{V}_1 \right|=\left| \mathbf{V}_3 \right|=\frac{2}{3}U_{DC}$代入：

$$
\begin{align}
    T_1 &= T_s \frac{3}{2} \frac{\left| \mathbf{V}_{ref} \right|}{U_{DC}} \left( \cos{\theta}-\frac{1}{\sqrt{3}} \sin{\theta} \right) \newline
        &= T_s \sqrt{3} \frac{\sqrt{3}}{2} \frac{\left| \mathbf{V}_{ref} \right|}{U_{DC}} \left( \cos{\theta}-\frac{1}{\sqrt{3}} \sin{\theta} \right) \newline
        &= T_s \sqrt{3} \frac{\left| \mathbf{V}_{ref} \right|}{U_{DC}} \left( \frac{\sqrt{3}}{2}\cos{\theta}-\frac{1}{\sqrt{2}} \sin{\theta} \right) \newline
        &= T_s \sqrt{3} \frac{\left| \mathbf{V}_{ref} \right|}{U_{DC}} \left[ \sin{\left( \frac{\pi}{3} \right)}\cos{\theta} - \cos{\left( \frac{\pi}{3} \right)}\sin{\theta} \right] \newline
        &= T_s \sqrt{3} \frac{\left| \mathbf{V}_{ref} \right|}{U_{DC}} \sin{\left( \frac{\pi}{3} - \theta \right)} \label{svpwm_i_sector_t1} \newline
    T_3 &= T_s \sqrt{3} \frac{\left| \mathbf{V}_{ref} \right|}{U_{DC}} \sin{\theta} \newline
    T_0 &= T_7 = (T_s - T_1 - T_3)/2
\end{align}
$$

透過式\eqref{svpwm_i_sector_t1}\eqref{svpwm_i_sector_t2}及\eqref{svpwm_i_sector_t0}即可算出各向量的時間佔比，再依此以PWM訊號控制各個電晶體半橋，以完成調變。其中$T_s$為總採樣時間，即PWM訊號週期。$T_1$、$T_3$、$T_0$及$T_7$分別為$\mathbf{V}_1$、$\mathbf{V}_3$、$\mathbf{V}_0$及$\mathbf{V}_7$所需的佔用時間。

試求SVPWM之電壓利用律。對於任意方向，SVPWM的相電壓最大值為$\frac{\sqrt{3}}{3}U_{DC}$，即圖\ref{i:SVPWM_vector_representation}中的內接圓半徑。由式\eqref{line_phase_vol}可知線電壓為相電壓的$\sqrt{3}$倍。可得電壓利用律（線電壓峰值與直流電源電壓之比值）為$100\%$。

$$
\begin{align}
    \xi_\text{SVPWM} = \frac{\sqrt{3} \cdot \frac{\sqrt{3}}{3}U_{DC}}{U_{DC}} = 1
\end{align}
$$
