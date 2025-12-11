# Docker 部署指南

本文件說明如何使用 Docker 和 Docker Compose 來構建和運行 Module Federation 應用。

## 前置需求

- Docker Desktop 或 Docker Engine (20.10+)
- Docker Compose (v2.0+)

## 快速開始

### 使用 Docker Compose（推薦）

```bash
# 構建並啟動所有服務
docker-compose up --build

# 或在背景運行
docker-compose up -d --build

# 查看日誌
docker-compose logs -f

# 停止所有服務
docker-compose down

# 停止並刪除 volumes
docker-compose down -v
```

啟動後訪問：
- Host 應用: http://localhost:3000
- Remote 應用: http://localhost:3001

### 分別構建（進階用法）

如果需要分別構建和運行容器：

```bash
# 1. 構建 Remote 應用
cd ../nuxt3-mf-remote
docker build -t nuxt3-mf-remote .

# 2. 運行 Remote 應用
docker run -d \
  --name nuxt3-mf-remote \
  -p 3001:3001 \
  nuxt3-mf-remote

# 3. 等待 Remote 應用啟動（約 10-15 秒）
sleep 15

# 4. 構建 Host 應用
cd ../nuxt3-mf-host
docker build -t nuxt3-mf-host .

# 5. 運行 Host 應用
docker run -d \
  --name nuxt3-mf-host \
  -p 3000:3000 \
  --link nuxt3-mf-remote \
  nuxt3-mf-host
```

## 架構說明

### 容器網絡

Docker Compose 會創建一個名為 `mf-network` 的橋接網絡，讓兩個容器可以互相通信。

### 健康檢查

Remote 容器配置了健康檢查，確保 `remoteEntry.js` 可訪問後才會啟動 Host 容器：

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/_nuxt/remoteEntry.js"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 30s
```

### 環境變量

兩個應用都使用以下環境變量：

**Remote App:**
- `NUXT_HOST=0.0.0.0` - 監聽所有網絡接口
- `NUXT_PORT=3001` - 端口號
- `NODE_ENV=production` - 生產模式

**Host App:**
- `NUXT_HOST=0.0.0.0`
- `NUXT_PORT=3000`
- `NODE_ENV=production`
- `NUXT_PUBLIC_REMOTE_URL=http://remote:3001` - Remote 應用的內部 URL

## 故障排除

### 1. Remote 應用無法訪問

```bash
# 檢查 Remote 容器狀態
docker-compose ps

# 查看 Remote 日誌
docker-compose logs remote

# 測試 remoteEntry.js
curl http://localhost:3001/_nuxt/remoteEntry.js
```

### 2. Host 應用無法加載 Remote 組件

確認：
1. Remote 容器健康檢查通過
2. 瀏覽器可以訪問 http://localhost:3001/_nuxt/remoteEntry.js
3. 檢查瀏覽器控制台的 CORS 錯誤

```bash
# 重新構建和啟動
docker-compose down
docker-compose up --build
```

### 3. 端口已被佔用

```bash
# 找出並停止佔用端口的進程
lsof -ti :3000 :3001 | xargs kill -9

# 或使用不同端口
# 編輯 docker-compose.yml 中的端口映射
```

### 4. 構建失敗

```bash
# 清理 Docker 緩存
docker system prune -a

# 重新構建
docker-compose build --no-cache
```

### 5. 查看詳細日誌

```bash
# 實時查看所有服務日誌
docker-compose logs -f

# 只查看特定服務
docker-compose logs -f host
docker-compose logs -f remote
```

## 生產部署注意事項

1. **環境變量配置**:
   - 在生產環境中，需要將 `publicPath` 改為實際的域名
   - 編輯 `nuxt3-mf-remote/nuxt.config.ts` 中的 `publicPath` 變量

2. **HTTPS 支持**:
   - 生產環境建議使用 HTTPS
   - 需要配置反向代理（如 Nginx）並更新 Module Federation URL

3. **資源優化**:
   - 已啟用多階段構建減小鏡像大小
   - 生產階段只包含必要的依賴

4. **健康檢查**:
   - Remote 應用配置了健康檢查
   - 可根據需要調整檢查間隔和重試次數

## 清理

```bash
# 停止並刪除所有容器
docker-compose down

# 刪除構建的鏡像
docker rmi nuxt3-mf-host nuxt3-mf-remote

# 清理未使用的 Docker 資源
docker system prune -a
```

## 開發模式 vs Docker

- **開發模式**: 使用 `npm run dev` 獲得 HMR 和快速重載
- **Docker**: 測試生產構建和部署配置

建議在開發時使用本地開發服務器，在測試生產配置時使用 Docker。
