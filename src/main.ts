import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
const fontA = new FontFace('HarmonyOS', 'url(/HarmonyOS_Sans_SC_Medium.woff2)')
const fontB = new FontFace('JetBrainsMono', 'url(/JetBrainsMono-Medium.ttf)')

document.fonts.add(fontA)
document.fonts.add(fontB)

await fontA.load()
await fontB.load()

document.fonts.ready.then(() => {
    document.getElementById('app')!.style.display = 'block'
    document.getElementById('loading')!.classList.add('loadingdone')
    document.getElementById('app')!.classList.add('done')
})






