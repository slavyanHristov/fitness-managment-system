import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.css";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.provide("apiUrlPath", `${import.meta.env.VITE_BACKEND_URL}/`);

app.mount("#app");
