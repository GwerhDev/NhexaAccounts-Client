import './styles/style.css';
import './styles/root.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './app/routes';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';  
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons'; 

library.add(fas, far, fab);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(createPinia())
  .use(router)
  .mount('#app');
