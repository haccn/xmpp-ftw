import '@/assets/global.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { setIsLightTheme, getIsLightTheme } from '@/utils/theme'

setIsLightTheme(getIsLightTheme())

const app = createApp(App)

app.use(router)

app.mount('#app')
