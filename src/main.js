// main.js
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import pinia from './store/pinia';

const app = createApp(App);

app.use(pinia);

app.mount('#app');
