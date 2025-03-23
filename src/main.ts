import { createApp } from 'vue'
import './style.css'
import "mdui/mdui.css"
import App from './App.vue'
import { setColorScheme, setTheme } from 'mdui'

setTheme('dark')
setColorScheme((() => {
    function generateColor(color: string): string {
        return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
            && (color.length == 6) ? color : generateColor(color);
    }
    return '#' + generateColor('');
})())
createApp(App).mount('#app')
import { loadBackground } from './background'
await loadBackground()
const fontA = new FontFace("HarmonyOS", "url(/HarmonyOS_Sans_SC_Medium.woff2)");
const fontB = new FontFace("JetBrainsMono", "url(/JetBrainsMono-Medium.ttf)");

document.fonts.add(fontA);
document.fonts.add(fontB);
await fontA.load()
await fontB.load()
document.fonts.ready.then(() => {
    document.getElementById("app")!.style.display = "block"
    document.getElementById("loading")!.classList.add("loadingdone")
    document.getElementById("app")!.classList.add("done")
});




