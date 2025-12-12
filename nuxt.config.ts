/*
 * @Author: JoeChen
 * @Date: 2025-12-11 21:08:58
 * @LastEditors: JoeChen bibirock0104@gmail.com
 * @LastEditTime: 2025-12-12 09:36:48
 * @Description:
 */

// https://nuxt.com/docs/api/configuration/nuxt-config
import { container } from "webpack";
const { ModuleFederationPlugin } = container;

export default defineNuxtConfig({
  compatibilityDate: "2025-12-12",
  devtools: { enabled: true },
  ssr: false,

  // 使用 Webpack 而非 Vite
  builder: "webpack",

  hooks: {
    "webpack:config"(configs: any[]) {
      configs.forEach((config) => {
        // 設置 publicPath 為 auto，讓 Webpack 自動處理
        config.output = config.output || {};
        config.output.publicPath = "auto";
        config.output.uniqueName = "hostApp";

        // 禁用 runtimeChunk 以避免與 Module Federation 衝突，但保留 splitChunks 以優化檔案大小
        config.optimization = config.optimization || {};
        config.optimization.runtimeChunk = false;

        config.plugins = config.plugins || [];
        config.plugins.push(
          new ModuleFederationPlugin({
            name: "hostApp",
            remotes: {
              remoteApp: "remoteApp@http://localhost:3001/_nuxt/remoteEntry.js",
            },
            shared: {
              vue: {
                singleton: true,
                eager: true,
                requiredVersion: false,
              },
              "vue-router": {
                singleton: true,
                eager: true,
                requiredVersion: false,
              },
            },
          })
        );
      });
    },
  },

  runtimeConfig: {
    public: {
      remoteUrl: "http://localhost:3001",
    },
  },
});
