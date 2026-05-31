import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

function redirectDocsBase(): Plugin {
    const redirect = (url?: string) => {
        if (!url || url === '/docs') {
            return '/docs/'
        }

        if (url.startsWith('/docs?')) {
            return `/docs/${url.slice('/docs'.length)}`
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
        name: 'redirect-docs-base',
        configureServer(server) {
            server.middlewares.use((req, res, next) => applyRedirect(req, res, next))
        },
        configurePreviewServer(server) {
            server.middlewares.use((req, res, next) => applyRedirect(req, res, next))
        }
    }
}

export default defineConfig({
    plugins: [redirectDocsBase(), vue()],
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