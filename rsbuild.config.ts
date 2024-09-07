import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
// @ts-ignore
const APP_VERSION = '♥' + require('./package.json').version
console.log(APP_VERSION)
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
    title: 'Nahida System',
  },
  dev: {
    assetPrefix: true,
  },
  source: {
    alias: {
      '@': './src',
    },
    define: {
      APP_VERSION: `${APP_VERSION}`,
      BUILD_DATE: BUILD_DATE,
      BUILD_ENV: `${BUILD_ENV}`,
    },
  },
  plugins: [pluginReact()],
});
