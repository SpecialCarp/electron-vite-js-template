// main.js
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import pinia from './store/pinia';
import router from './router';

const app = createApp(App);

app.config.globalProperties.$electronAPI = window.electronAPI;

app.use(pinia).use(router);

app.mount('#app');
