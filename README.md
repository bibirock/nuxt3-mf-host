# Nuxt 3 Module Federation Host

這是一個 Nuxt 3 Module Federation 的 Host 應用程式範例。

## 專案設定

確保你已經安裝了 Node.js。

安裝相依套件：

```bash
npm install
```

## 啟動開發伺服器

### 單獨啟動 Host

如果你只想啟動 Host 應用程式：

```bash
npm run dev
```

應用程式將在 <http://localhost:3000> 運行。

### 啟動完整環境 (Host + Remote)

本專案包含一個 `start-all.sh` 腳本，用於同時啟動 Host 和 Remote 應用程式（假設 Remote 應用程式位於 `../nuxt3-mf-remote`）。

```bash
chmod +x start-all.sh
./start-all.sh
```

這將會：

1. 清理端口 3000 和 3001
2. 啟動 Remote App (Port 3001)
3. 啟動 Host App (Port 3000)

## 建置生產版本

建置應用程式：

```bash
npm run build
```

預覽生產版本：

```bash
npm run preview
```
