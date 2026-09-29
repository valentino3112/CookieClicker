import { createApp } from 'vue'
import App from './App.vue'
import { startProduction } from './store.js'

startProduction()
createApp(App).mount('#app')
