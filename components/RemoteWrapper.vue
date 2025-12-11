<template>
  <div class="remote-wrapper">
    <Suspense>
      <template #default>
        <RemoteComponent />
      </template>
      <template #fallback>
        <div class="loading">⏳ 載入遠端元件中...</div>
      </template>
    </Suspense>
    <div v-if="error" class="error">❌ 無法載入遠端元件: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onErrorCaptured } from "vue";

const error = ref<string | null>(null);

// 使用 remoteApp/Widget - 對應 Module Federation 配置
const RemoteComponent = defineAsyncComponent({
  loader: () => import("remoteApp/Widget"),
  loadingComponent: {
    template: '<div class="loading">⏳ 載入遠端元件中...</div>',
  },
  errorComponent: {
    template: '<div class="error">❌ 載入失敗</div>',
  },
  delay: 200,
  timeout: 10000,
  onError(err, retry, fail, attempts) {
    console.error("載入遠端元件失敗:", err);
    if (attempts <= 3) {
      retry();
    } else {
      fail();
    }
  },
});

onErrorCaptured((err) => {
  console.error("元件錯誤:", err);
  error.value = err.message || "未知錯誤";
  return false;
});
</script>

<style scoped>
.remote-wrapper {
  min-height: 100px;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
  background: #f9f9f9;
  border-radius: 8px;
}

.error {
  padding: 20px;
  background-color: #fff0f0;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  color: #c92a2a;
}
</style>
