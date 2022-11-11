import { createApp } from 'vue';
import { createI18n } from 'vue-i18n'
import FlagIcon from 'vue-flag-icon'

import App from './App.vue';
import store from './store/index.js';
import './assets/styles/index.css';
import nl from './locale/nl.json'
import en from './locale/en.json'
import de from './locale/de.json'

import BaseDialog from './components/BaseDialog.vue';
import BaseButton from './components/BaseButton.vue';
import BaseIcon from './components/BaseIcon.vue';

const i18n = createI18n( { 
    legacy: false,
    messages: {
        nl,
        en,
        de
    },
    locale: 'en',
    fallbackLocale: 'en'
});
const app = createApp(App);

app.use(i18n)
app.use(store);
app.use(FlagIcon);

app.component('base-dialog', BaseDialog);
app.component('base-button', BaseButton);
app.component('base-icon', BaseIcon);

app.mount('#app');