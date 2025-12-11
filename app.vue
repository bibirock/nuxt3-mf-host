<template>
  <div class="container">
    <h1>🏠 Host App (Port 3000)</h1>
    <p>這是 Module Federation 的 Host 應用</p>

    <section class="section">
      <h2>📦 本地元件</h2>
      <div class="local-box">
        <p>這是 Host 應用中的本地元件</p>
      </div>
    </section>

    <section class="section">
      <h2>🌐 遠端元件 (來自 Remote 應用)</h2>
      <RemoteWrapper />
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
  border: 2px solid #2196f3;
}
</style>
