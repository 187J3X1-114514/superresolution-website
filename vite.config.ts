import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

function redirectIndexBases(): Plugin {
    const redirect = (url?: string) => {
        if (!url) {
            return null
        }

        for (const base of ['/docs', '/sponsor/afdian']) {
            if (url === base) {
                return `${base}/`
            }

            if (url.startsWith(`${base}?`)) {
                return `${base}/${url.slice(base.length)}`
            }
        }

        return null
    }

    const applyRedirect = (req: { url?: string }, res: { statusCode: number; setHeader: (name: string, value: string) => void; end: () => void }, next: () => void) => {
        const location = redirect(req.url)

        if (!location) {
            next()
            return
        }

        res.statusCode = 302
        res.setHeader('Location', location)
        res.end()
    }

    return {
        name: 'redirect-index-bases',
        configureServer(server) {
            server.middlewares.use((req, res, next) => applyRedirect(req, res, next))
        },
        configurePreviewServer(server) {
            server.middlewares.use((req, res, next) => applyRedirect(req, res, next))
        }
    }
}

export default defineConfig({
    plugins: [redirectIndexBases(), vue()],
    build: {
        rollupOptions: {
            input: {
                main: fileURLToPath(new URL('./index.html', import.meta.url)),
                sponsorAfdian: fileURLToPath(new URL('./sponsor/afdian/index.html', import.meta.url))
            }
        }
    },
    server: {
        proxy: {
            '^/docs(?:/|$)': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                ws: true
            }
        }
    }
})