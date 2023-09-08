import { createApp } from 'vue'
import App from './App.vue'
import vueCookie from 'vue-cookies'

import router from './router'

import './assets/base.css'

// import bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// import fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faList, faRightFromBracket, faUser, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faHouse, faList, faUser, faRightFromBracket)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(vueCookie)
    .mount('body')
