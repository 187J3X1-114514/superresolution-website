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
document.getElementById("app")!.classList.add("done")


