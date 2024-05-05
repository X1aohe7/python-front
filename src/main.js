import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import './style.css'
import App from './App.vue'
import router  from "./router/index.js";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000';

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')