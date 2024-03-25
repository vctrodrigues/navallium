import "vuetify/styles";
import "./assets/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { ws } from "./service/ws";

import vuetify from "./plugins/vuetify";
import persistance from "pinia-plugin-persistedstate";

const app = createApp(App);

ws.connect();

const pinia = createPinia();
pinia.use(persistance);

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount("#app");
