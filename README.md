# 亞馬遜國家山岳協會｜進階探勘教育系統（Chapter 22）

本專案為亞馬遜國家山岳協會教材網站第 22 章「進階探勘教育系統」之現代化多頁式靜態網站，部署於 `https://amazon-hike.com/chapter22/`（位於 `/intro` 階層之下）。

## 技術棧 (Tech Stack)
- **SSG 框架**：Astro 5.x（純靜態輸出 `output: 'static'`，無 adapter，支援 Content Collections Content Layer）
- **部署環境**：Cloudflare Workers（Static Assets） / Cloudflare Pages，輸出目錄為 `dist/chapter22/` 與 `dist/_headers`
- **語言與類型**：TypeScript
- **樣式系統**：Tailwind CSS v4（OKLCH 地形色盤、WCAG AA 高對比深淺色支援、響應式無版面位移）
- **資料與內容分離**：Astro Content Collections（章節 Markdown、案例庫、練習、能力診斷、方法論、知識補充 JSON）
- **互動機制**：原生 TypeScript 腳本與 `localStorage` 漸進增強（無 JavaScript 時教材全文 100% 完整可讀）
- **無外部依賴**：完全移除第三方平台痕跡（無 Lovable 相關 meta、badge 或外部字型載入）

---

## 本地開發與建置 (Local Development & Build)

### 系統需求
- **Node.js**：`>= 20 < 25`（參考 `.nvmrc` 為 `22`）
- **npm**：`>= 10.0.0`

### 1. 安裝依賴
```bash
npm ci
```

### 2. 本地開發伺服器
```bash
npm run dev
```
啟動後於瀏覽器訪問 `http://localhost:3000/chapter22/`。

### 3. 生產環境靜態建置
```bash
npm run build
```
建置輸出將產生於 `dist/chapter22/` 目錄與 `dist/_headers`，所有內部網址皆自動套用 `/chapter22/` 前綴與結尾斜線（trailingSlash: 'always'）。並會在建置完成時自動生成 `dist/chapter22/chapter22-sitemap-entries.xml`。

### 4. 本地預覽生產輸出
```bash
npm run preview
```
使用 Wrangler 本地伺服器預覽 `dist/` 靜態資源。

### 5. 部署到 Cloudflare Workers
```bash
npm run deploy
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

## Cloudflare Workers / Pages 部署說明 (Deployment)

本專案配置 `wrangler.jsonc` 靜態資源部署：

```jsonc
{
  "name": "amazon-explore",
  "compatibility_date": "2026-09-26",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

### 快取與安全性標頭 (`dist/_headers`)
建置腳本 `scripts/post-build.mjs` 會自動將規則複製至 `dist/_headers`：
- HTML 文件：`Cache-Control: public, max-age=0, must-revalidate`。
- 靜態帶雜湊資源 (`/chapter22/_astro/*`, `/chapter22/assets/*`)：`Cache-Control: public, max-age=31536000, immutable`（1 年快取）。
- 安全標頭：`X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin`、`X-Frame-Options: SAMEORIGIN`。

---

## 技術 SEO 與 Sitemap 合併說明

1. **結構化資料 (Schema.org JSON-LD)**：
   - 全站宣告 `Organization`（亞馬遜國家山岳協會）與 `WebSite`。
   - 每頁包含完整 `BreadcrumbList`：首頁 → intro → 進階探勘教育系統 → 課程 → 各章。
   - 首頁與課程頁宣告 `Course`（含 12 章 `hasPart` 列表）。
   - 各章頁宣告 `Article` + `LearningResource`。
2. **搜尋引擎索引控制**：
   - 一般教材頁面：`robots: index,follow,max-image-preview:large`。
   - 404 頁與個人進度頁 (`/chapter22/progress/`)：`robots: noindex,follow`（不納入搜尋索引）。
3. **Sitemap 片段**：
   - 建置時自動產出 `dist/chapter22/chapter22-sitemap-entries.xml`。請將該檔案內的 `<url>` 片段複製並合併進母站的 `https://amazon-hike.com/sitemap.xml` 中（可參考 `docs/robots-snippet.txt`）。
