import '@/assets/global.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setIsDarkTheme, getIsDarkTheme } from '@/utils/theme'

setIsDarkTheme(getIsDarkTheme())

const app = createApp(App)

app.use(router)

app.mount('#app')
