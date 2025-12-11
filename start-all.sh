#!/bin/bash

echo "🚀 Starting Module Federation Apps..."

# 清理端口
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :3000 | xargs kill -9 2>/dev/null

echo "✨ Starting Remote App (Port 3001)..."
cd ../nuxt3-mf-remote && npm run dev &
REMOTE_PID=$!

echo "⏳ Waiting for remote app to start..."
sleep 5

echo "✨ Starting Host App (Port 3000)..."
cd ../nuxt3-mf-host && npm run dev &
HOST_PID=$!

echo ""
echo "✅ Both apps are starting!"
echo "📦 Remote App PID: $REMOTE_PID (http://localhost:3001)"
echo "🏠 Host App PID: $HOST_PID (http://localhost:3000)"
echo ""
echo "Press Ctrl+C to stop both apps"

# 等待任一進程結束
wait
