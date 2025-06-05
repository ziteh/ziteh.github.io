---
title: "ffmpeg 圖片/影片轉檔"
date: 2025-06-05T09:30:00+08:00
draft: false
---

## 圖片

將指定圖片以品質 90 轉成 WebP

```bash
ffmpeg -i INPUT.jpg -c:v libwebp -q:v 90 OUTPUT.webp
```

無損壓縮成 WebP，來源格式需支援無損

```bash
ffmpeg -i INPUT.png -c:v libwebp -lossless 1 OUTPUT.webp
```

## 影片

輸出 mp4 H.264 + AAC。`-crf` 控制輸出畫質（0-51，數字越低品質越高）

```bash
ffmpeg -i INPUT.mov -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k OUTPUT.mp4
```

## 動圖

WebP 動圖

```bash
ffmpeg -i INPUT.mp4 -vf "fps=15,scale=512:-1:flags=lanczos" -c:v libwebp -loop 0 -q:v 80 OUTPUT.webp
```

GIF 動圖

```bash
# 第 1 步：產生調色盤
ffmpeg -y -i INPUT.mp4 -vf "fps=15,scale=512:-1:flags=lanczos,palettegen" palette.png

# 第 2 步：使用調色盤轉成 gif
ffmpeg -i INPUT.mp4 -i palette.png -filter_complex "fps=15,scale=512:-1:flags=lanczos[x];[x][1:v]paletteuse" OUTPUT.gif
```
