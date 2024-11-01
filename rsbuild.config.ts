import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// @ts-ignore
const APP_VERSION = '' + require('./package.json').version
// @ts-ignore
const now = new Date()
const year = now.getFullYear().toString().slice(-2) // 取最后两位年份
const month = (now.getMonth() + 1).toString().padStart(2, '0') // 月份是从0开始的，所以加1，并补零
const day = now.getDate().toString().padStart(2, '0') // 补零
let BUILD_ENV = 'production'
if (process.env.BUILD_ENV == 'stg') {
  BUILD_ENV = 'stg'
}
let BUILD_DATE = `${year}${month}${day}`
console.log(BUILD_ENV)
console.log(APP_VERSION)
console.log(BUILD_DATE)
export default defineConfig({
  html: {
    title: '数据标注系统',
  },
  dev: {
    // assetPrefix: true,
  },
  source: {
    alias: {
      '@': './src',
    },
    define: {
      APP_VERSION: JSON.stringify(`${APP_VERSION}`),
      BUILD_DATE: JSON.stringify(BUILD_DATE),
      BUILD_ENV: JSON.stringify(`${BUILD_ENV}`),
    },
  },
  server: {
    proxy: {
      '/napi-prod/llm': {
        target: 'http://10.151.3.26:8991',
        pathRewrite: {
          '^/napi-prod/llm': ''
        }
      },
    },
  },
  // output: {
  //   distPath: {
  //     root: 'tagging',
  //   },
  //   assetPrefix: '/tagging',
  // },
  plugins: [pluginReact()],
});
