import './assets/main.css'
import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import request from '@/request/index.js'
import utilTools from '@/utils/common.js'
import utilModal from '@/utils/modal.js'

function installCore(app) {
  app.provide('request', request)
  app.provide('tools', utilTools)
  app.provide('modal', utilModal)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
installCore(app)

app.mount('#app')
