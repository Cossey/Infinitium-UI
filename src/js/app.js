// Import Vue
import { createApp } from 'vue';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/framework7-bundle.css';

// Vue 3 Context Menu
//import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';

// Import App Component
import App from '../components/app.vue';
import { theme } from 'framework7-vue';
import { getDevice } from 'framework7';
import api from "./api";

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
const app = createApp(App);

app
    .use(ContextMenu)
    .use(theme)
    .use(api)
    .use(getDevice);

app.config.globalProperties.$theme = theme;
app.config.globalProperties.$api = api;
app.config.globalProperties.$device = getDevice();

// Register Framework7 Vue components
registerComponents(app);

// Mount the app
app.mount('#app');