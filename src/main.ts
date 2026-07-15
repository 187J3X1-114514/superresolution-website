import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import tilt from './directives/tilt'

const app = createApp(App)
    .directive('tilt', tilt)

app.mount('#app')

requestAnimationFrame(() => {
    document.getElementById('loading')?.classList.add('loadingdone')
    document.getElementById('app')?.classList.add('done')
})






