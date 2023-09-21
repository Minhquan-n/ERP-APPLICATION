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
import { faHouse, faList, faRightFromBracket, faUser, faXmark, faBars, faAnglesRight, faAnglesLeft, faPlus, faRotate, faPen } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add( faHouse, faList, faUser, faRightFromBracket, faXmark, faBars, faAnglesRight, faAnglesLeft, faPlus, faRotate, faPen )

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(vueCookie)
    .mount('body')
