import "@/assets/global.css"
import { createApp } from "vue"
import App from "@/App.vue"
import router from "@/router"
import { createPinia } from "pinia"
import { setIsLightTheme, getIsLightTheme } from "@/utils/theme";

setIsLightTheme(getIsLightTheme());

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app")
