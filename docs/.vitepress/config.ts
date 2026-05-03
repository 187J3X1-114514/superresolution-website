import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    srcDir: "markdowns",

    // Point publicDir to docs/public/ (relative to vite root which is markdowns/)
    vite: {
        publicDir: '../public',
    },

    // i18n configuration
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            link: '/',
        },
        zh: {
            label: '简体中文',
            lang: 'zh-CN',
            link: '/zh/',
            themeConfig: {
                nav: [
                    { text: '首页', link: '/zh/' },
                    { text: '文档', link: '/zh/Debugging-instructions' },
                ],
                sidebar: [
                    {
                        text: '快速入门',
                        items: [
                            { text: '首页', link: '/zh/' },
                        ],
                    },
                    {
                        text: '调试',
                        items: [
                            { text: '调试指南', link: '/zh/Debugging-instructions' },
                        ],
                    },
                    {
                        text: 'Mod 开发者',
                        items: [
                            { text: 'Mod API 文档', link: '/zh/Mod-API-Documentation' },
                        ],
                    },
                    {
                        text: '光影包开发者',
                        items: [
                            {
                                text: '接口文档',
                                link: '/zh/Shaderpack-Interface-documentation',
                                items: [
                                    { text: '接口规范 v1', link: '/zh/Shaderpack-Interface-documentation-(Version-1)' }
                                ]
                            },
                        ],
                    },
                ],
            },
        },
    },

    title: "Super Resolution Mod Wiki",
    description: "Super Resolution Mod Wiki",
    themeConfig: {
        // Default (English / root locale)
        nav: [
            { text: 'Home', link: '/' },
        ],

        sidebar: [
            {
                text: 'Getting Started',
                items: [
                    { text: 'Home', link: '/' },
                ],
            },
            {
                text: 'Debugging',
                items: [
                    { text: 'Debugging Instructions', link: '/Debugging-instructions' },
                ],
            },
            {
                text: 'For Mod Developers',
                items: [
                    { text: 'Mod API Documentation', link: '/Mod-API-Documentation' },
                ],
            },
            {
                text: 'For Shaderpack Developers',
                items: [

                    { text: 'Interface Documentation', link: '/Shaderpack-Interface-documentation', items: [{ text: 'Interface v1', link: '/Shaderpack-Interface-documentation-(Version-1)' }] },
                ],
            },
        ],

        logo: '/super_resolution_logo.svg',

        socialLinks: [
            { icon: 'github', link: 'https://github.com/187J3X1-114514/superresolution' },
            { icon: 'discord', link: 'https://discord.com/invite/jZ9Vhs855E' },
        ],
    },
})
