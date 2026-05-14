# 建構技術使用

- Vite / TypeScript / React
- shadcn-ui / Tailwind CSS

# 開發流程

1. 参考使用者需求，調整 src/index.css 與 tailwind.config.ts 的主題風格
2. 根據使用者需求，劃分出所需要開發的頁面
3. 整理好每個頁面的功能，在 pages 下建立對應的資料夾及首頁 Index.tsx
4. 在 App.tsx 中設定路由，引入剛才的各個 Index.tsx
5. 根據整理的使用者需求，如果需求單純，可以直接在 Index.tsx 中完成該頁面的開發
6. 如果需求複雜，可以將 page 拆分成多個组件實作，目錄結構如下：
    - Index.tsx 頁面入口
    - /components/ 组件
    - /hooks/ Hooks
    - /stores/ 如果有複雜的組件間互動或資料傳遞時，可以使用 zustand 處理
7. 在開發完成後，需要進行 pnpm i 安裝依賴項，並使用 npm run lint & npx tsc --noEmit -p tsconfig.app.json --strict 等指令進行檢查，並修正問題

# 串接後端API

- 當需要新增介面或者操作 supabase 時，需要先在 src/api 新增對應檔案，並定義資料型類別，可参考 src/demo.ts 文件
- 前端與 supabase 連接時，需要完全按照數據類型實作，盡可能避免修改定好的數據類型，若需修改，需要檢查所有引用該檔案的地方
