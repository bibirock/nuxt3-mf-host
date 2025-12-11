# Dockerfile for Nuxt3 Module Federation Host App
FROM node:20-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴（使用 install 而非 ci，因為可能缺少某些依賴）
RUN npm install

# 複製所有源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產階段
FROM node:20-alpine

WORKDIR /app

# 複製 package.json
COPY package*.json ./

# 只安裝生產依賴
RUN npm install --omit=dev

# 從構建階段複製構建結果
COPY --from=builder /app/.output /app/.output

# 暴露端口
EXPOSE 3000

# 設置環境變量
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

# 啟動應用
CMD ["node", ".output/server/index.mjs"]
