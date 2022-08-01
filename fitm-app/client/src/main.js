import {
    createApp
} from 'vue'
import {
    createPinia
} from 'pinia'

import App from './App.vue'
import router from './router'
import './index.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.provide("apiUrlPath", "http://localhost:5000/")

app.mount('#app')