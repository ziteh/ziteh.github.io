title: DaVinci Resolve 15 小功能介紹
author: ZiTe
tags:
  - 教學
  
  - ''
categories: []
date: 2018-08-20 10:38:00
---
以往我都是使用Adobe的Premiere Pro和After Effects來剪輯影片與製作特效，而最近剛好認識到Blackmagic Design公司的[DaVinci Resolve 15](https://www.blackmagicdesign.com/products/davinciresolve/)這套軟體，不但有免費版本，而且三大作業系統都有（之前在用Linux時才覺得軟體支援真的很重要，一直試Wine也不一定成功）。

總之，DaVinci Resolve 15是一套强大的調光調色+剪輯+特效+聲音處理軟體，網路上已經有不少文章與影片的介紹與教學，此篇文章就不多加贅述，此文章將會介紹一些我使用DaVinci Resolve 15兩週以來發現的重要小功能。如果未來還有發現的會也會繼續更新。  

<!--more-->  

以下Premiere Pro簡稱為Pr；After Effects簡稱為Ae；DaVinci Resolve 15簡稱為DaVinci Resolve。


# 1.避免連續的圖片被讀成影片

  
我發現加入媒體庫時，如果是檔名連續的圖片會被當成影片檔，如果要把這些圖片檔分開來加入媒體庫的話，只要在【Media Storage】右上角的3個點處將【Show Individual Frames】打勾，它就會獨立顯示每一張圖片，而不是將它們當成一個影片。  
  

![▲ 獨立顯示每一幀](https://1.bp.blogspot.com/-o-T15m6Yt_w/XppoxWgQ8VI/AAAAAAAACHQ/LQlyrym0GG4wY3eWGWq-XSWJsdqf72IOQCPcBGAsYHg/s1600/%25E7%258D%25A8%25E7%25AB%258B%25E9%25A1%25AF%25E7%25A4%25BA-01.png)

![▲ 獨立顯示每一幀](https://1.bp.blogspot.com/-a81NLcrif-M/Xppoxe33qVI/AAAAAAAACHQ/6l8ZzCHLK44CXh2TWFDPGIxbuk7LTFC9ACPcBGAsYHg/s1600/%25E6%25AF%258F%25E5%25B9%2580%25E7%258D%25A8%25E7%25AB%258B-out01.gif)

# 2.直接輸入時間來移動播放頭
  
在Pr和Ae都可以點選時間軸左上方的時鐘來輸入時間移動播放頭，DaVinci Resolve也可以，只是DaVinci Resolve不用點選時鐘，而是直接按數字鍵（上方與右方獨立數字鍵盤都可以）就可以達成。  
  
和Pr與Ae相同，如果要到達1分25秒00影格的話就是輸入“12500”；如果要到1秒59  
影格的話就是輸入“159”。  

![▲ 直接輸入時間來移動播放頭](https://1.bp.blogspot.com/-U0BXLzYCgck/Xppoxb3owlI/AAAAAAAACHQ/9rebiUzDVSASN1ZyhdyGCZospqRMy_9NwCPcBGAsYHg/s1600/%25E7%259B%25B4%25E6%258E%25A5%25E8%25BC%25B8%25E5%2585%25A5%25E6%2599%2582%25E9%2596%2593out01.gif)

# 3.開啓關鍵影格時間軸
在Pr中關鍵影格的時間軸在Effect Controls中，而DaVinci Resolve是直接顯示在主要時間軸中。只要按下有加入關鍵影格的素材右下方的按鈕就可以開啓關鍵影格時間軸。  

![▲ 開啓關鍵影格時間軸](https://1.bp.blogspot.com/-UPQIS5kD8wo/Xppoxck6TmI/AAAAAAAACHQ/sorOjVRyeXorI14TO3AJBUbZeKQxAGIQACPcBGAsYHg/s1600/%25E9%2597%259C%25E9%258D%25B5%25E5%25BD%25B1%25E6%25A0%25BCout01.gif)

  
而按鈕有2種，左邊波形樣式的按鈕會以波形的方式顯示；而右邊菱形樣式的按鈕只會顯示關鍵影格的位置。 
![▲ 波形樣式按鈕](https://1.bp.blogspot.com/-GVk-Z2ouLG4/XppoxajikLI/AAAAAAAACHQ/nrbOGS1WYMM6peqPjNsu7Qk6QQvQ1kHFwCPcBGAsYHg/s1600/%25E9%2597%259C%25E9%258D%25B5%25E5%25BD%25B1%25E6%25A0%25BC%25E6%2599%2582%25E9%2596%2593%25E8%25BB%25B8-%25E6%25B3%25A2%25E5%25BD%25A2%25E6%258C%2589%25E9%2588%2595.png)

![▲ 菱形樣式按鈕](https://1.bp.blogspot.com/-Op9cX8xVz2c/Xppoxf2ZLZI/AAAAAAAACHQ/gosStTomgw4NGsmH5-Nzq4nMQ1_J-6jxwCPcBGAsYHg/s1600/%25E9%2597%259C%25E9%258D%25B5%25E5%25BD%25B1%25E6%25A0%25BC%25E6%2599%2582%25E9%2596%2593%25E8%25BB%25B8-%25E8%258F%25B1%25E5%25BD%25A2%25E6%258C%2589%25E9%2588%2595.png)
  
而且我們也可以直接在關鍵影格時間軸上編輯關鍵影格，還可以加入不同的轉變方式。  
  

![▲ 在關鍵影格時間軸上編輯關鍵影格](https://1.bp.blogspot.com/-c-giBMESfRQ/XppoxTCu5aI/AAAAAAAACHQ/4O1v5ro6MUgMRwQces7t6Kdpzh-jl-2IACPcBGAsYHg/s1600/%25E9%2597%259C%25E9%258D%25B5%25E5%25BD%25B1%25E6%25A0%25BC-%25E8%25AE%258A%25E5%258C%2596out02.gif)

而波形樣式關鍵影格時間軸最左邊的按鈕可以選擇要顯示的不同特效的關鍵影格波形。  
  

![▲ 顯示選單按鈕](https://1.bp.blogspot.com/-cVKzQ7-3_yA/XppoxSAiNqI/AAAAAAAACHQ/CjWtYLYo7BQlU9p2I7f3JDRLHsnhk-QBQCPcBGAsYHg/s1600/%25E9%2597%259C%25E9%258D%25B5%25E5%25BD%25B1%25E6%25A0%25BC%25E6%2599%2582%25E9%2596%2593%25E8%25BB%25B8-%25E9%2581%25B8%25E5%2596%25AE%25E6%258C%2589%25E9%2588%2595.png)

# 版本資訊 

![▲ Public Beta Version 15.0.0B.073](https://1.bp.blogspot.com/-pEpoLeRn-P4/XppoxYqloXI/AAAAAAAACHQ/OnA6t9WzoFMgbIORkFR7lzRSPatmA-0LwCPcBGAsYHg/s640/%25E7%2589%2588%25E6%259C%25AC%25E8%25B3%2587%25E8%25A8%258A.png)