# 亞馬遜國家山岳協會｜進階探勘教育系統（Chapter 21）

本專案為亞馬遜國家山岳協會教材網站第 21 章「進階探勘教育系統」之現代化多頁式靜態網站，部署於 `https://amazon-hike.com/chapter21/`（位於 `/intro` 階層之下）。

## 技術棧 (Tech Stack)
- **SSG 框架**：Astro 5.x（靜態輸出 `output: 'static'`，支援 Content Collections Content Layer）
- **語言與類型**：TypeScript
- **樣式系統**：Tailwind CSS v4（OKLCH 地形色盤、WCAG AA 高對比深淺色支援、響應式無版面位移）
- **資料與內容分離**：Astro Content Collections（章節 Markdown、案例庫、練習、能力診斷、方法論、知識補充 JSON）
- **互動機制**：原生 TypeScript 腳本與 `localStorage` 漸進增強（無 JavaScript 時教材全文 100% 完整可讀）
- **無外部依賴**：完全移除第三方平台痕跡（無 Lovable 相關 meta、badge 或外部字型載入）

---

## 本地開發與建置 (Local Development & Build)

### 系統需求
- **Node.js**：`>= 20.0.0`
- **npm**：`>= 10.0.0`

### 1. 安裝依賴
```bash
npm install
```

### 2. 本地開發伺服器
```bash
npm run dev
```
啟動後於瀏覽器訪問 `http://localhost:3000/chapter21/`。

### 3. 生產環境靜態建置
```bash
npm run build
```
建置輸出將產生於 `dist/` 目錄，所有內部網址皆自動套用 `/chapter21/` 前綴與結尾斜線（trailingSlash: 'always'）。並會在建置完成時自動生成 `dist/chapter21-sitemap-entries.xml`。

### 4. 本地預覽生產輸出
```bash
npm run preview
```

---

## 內容匯入格式說明 (Content Import Guide)

各章教材位於 `src/content/chapters/` 目錄下，檔案命名為 `ch01.md` 至 `ch12.md`。

- **第 1 章 (`ch01.md`)**：已包含完整全文，可作為標準參照樣板。
- **第 2 至 12 章 (`ch02.md` ~ `ch12.md`)**：Frontmatter 已預先建立完備，正文標記為 `<!-- TODO: 待匯入全文 -->`。

### Frontmatter 欄位規範
```yaml
---
chapter: 2
title: "地圖不是山"
subtitle: "DEM、等高線、圖資差異與解析度限制"
tags: ["DEM", "等高線", "圖資誤差", "光達", "解析度"]
sources: ["方法論", "經驗法則", "科學知識", "風險提醒"]
summary:
  - "重點摘要第一點"
  - "重點摘要第二點"
coreQuestion: "核心問題陳述..."
prev:
  id: "ch01"
  no: 1
  title: "第1章 從登山者到探勘者"
next:
  id: "ch03"
  no: 3
  title: "第3章 紙本地圖定位的當代意義"
---
```

### 正文 Markdown 編寫標準
- 使用 `## 01 核心觀念`、`## 02 傳統觀念` ... 等 `h2` 階層標記小節，系統將自動解析為錨點導覽與結構化章節目錄。
- 來源標籤請使用 `【經驗法則】`、`【方法論】`、`【科學知識】`、`【待驗證假設】`、`【風險提醒】`、`【延伸知識】` 文字標示。
- 表格需包含明確標題行，手機端自動支援 `overflow-x: auto` 橫向滑動。

---

## Cloudflare Pages 部署步驟 (Deployment)

本專案已完全相容 Cloudflare Pages 靜態託管環境，並隨附 `public/_headers` 檔案：

1. **登入 Cloudflare Dashboard**：進入 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**。
2. **選取本專案 Repository**。
3. **建置設定 (Build Settings)**：
   - **Framework preset**：`Astro`
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
   - **Node.js Version**：設定環境變數 `NODE_VERSION` 為 `20` 或以上（例如 `22`）。
4. **點擊 Save and Deploy** 即可完成自動化建置。

### 快取與安全性標頭 (`public/_headers`)
建置後 Cloudflare Pages 會自動讀取 `dist/_headers`：
- HTML 文件：`Cache-Control: public, max-age=0, must-revalidate`（避免使用者讀取舊版內容）。
- 靜態帶雜湊資源 (`/_astro/*`, `/assets/*`)：`Cache-Control: public, max-age=31536000, immutable`（1 年快取）。
- 安全標頭：`X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin`。

---

## 技術 SEO 與 Sitemap 合併說明

1. **結構化資料 (Schema.org JSON-LD)**：
   - 全站宣告 `Organization`（亞馬遜國家山岳協會）與 `WebSite`。
   - 每頁包含完整 `BreadcrumbList`：首頁 → intro → 進階探勘教育系統 → 課程 → 各章。
   - 首頁與課程頁宣告 `Course`（含 12 章 `hasPart` 列表）。
   - 各章頁宣告 `Article` + `LearningResource`。
2. **搜尋引擎索引控制**：
   - 一般教材頁面：`robots: index,follow,max-image-preview:large`。
   - 個人進度頁 (`/chapter21/progress/`)：`robots: noindex,follow`（不納入搜尋索引）。
3. **Sitemap 片段**：
   - 建置時自動產出 `dist/chapter21-sitemap-entries.xml`。請將該檔案內的 `<url>` 片段複製並合併進母站的 `https://amazon-hike.com/sitemap.xml` 中。
