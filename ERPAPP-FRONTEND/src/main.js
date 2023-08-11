import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// import fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faTwitter)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
