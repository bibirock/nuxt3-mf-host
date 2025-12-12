<script setup lang="ts">
import { ref } from "vue";

const hostCount = ref(0);
const remoteCount = ref(0);

const increment = () => {
  hostCount.value++;
};

const handleRemoteUpdate = (count: number) => {
  console.log("收到遠端元件 Count:", count);
  remoteCount.value = count;
};
</script>

<template>
  <div class="container">
    <h1>🏠 Host App (Port 3000)</h1>
    <p>這是 Module Federation 的 Host 應用</p>

    <section class="section">
      <h2>📦 本地元件</h2>
      <div class="local-box">
        <p>這是 Host 應用中的本地元件 ！</p>
        <p>Host Count: {{ hostCount }}</p>
        <p>Remote Count (來自遠端): {{ remoteCount }}</p>
        <button @click="increment">增加 Host Count</button>
      </div>
    </section>

    <section class="section">
      <h2>🌐 遠端元件 (來自 Remote 應用)</h2>
      <!-- 
        傳遞 props: :count="hostCount"
        監聽事件: @update-count="handleRemoteUpdate" 
        (遠端元件需要 emit 'update-count' 並帶上數值)
      -->
      <RemoteWrapper :count="hostCount" @update-count="handleRemoteUpdate" />
    </section>
  </div>
</template>

<style>
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
}

.section {
  margin: 30px 0;
}

.section h2 {
  color: #555;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.local-box {
  padding: 20px;
  background: #e3f2fd;
  border-radius: 8px;
}

.message {
  margin-top: 10px;
  padding: 10px;
  background: #fff3e0;
  border-radius: 4px;
  color: #e65100;
}
</style>
