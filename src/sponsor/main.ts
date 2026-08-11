import { createApp } from 'vue'
import '../style.css'
import SponsorApp from './SponsorApp.vue'

createApp(SponsorApp).mount('#app')

requestAnimationFrame(() => {
    document.getElementById('loading')?.classList.add('loadingdone')
    document.getElementById('app')?.classList.add('done')
})
