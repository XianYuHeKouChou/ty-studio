import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import request from '@/request/index.js'
import util_tools from '@/utils/common.js'
import util_modal from '@/utils/modal.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$req = request
app.config.globalProperties.$tools = util_tools
app.config.globalProperties.$modal = util_modal

app.mount('#app')
