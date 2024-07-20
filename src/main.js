import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 引入页面权限文件
// import "./permission";
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(ElementPlus);
app.mount("#app");
