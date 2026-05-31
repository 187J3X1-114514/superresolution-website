import { defineConfig } from 'vitepress'
import { enNav, enSidebar, zhNav, zhSidebar } from './navigation.mts'

export default defineConfig({
  base: '/docs/',
  outDir: '../dist/docs',
  lang: 'en-US',
  title: 'Super Resolution Mod Wiki',
  description: 'Documentation for Super Resolution Mod developers and shaderpack authors.',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/super_resolution_logo.svg' }]],
  rewrites: {
    'en/:path*': ':path*',
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
      },
    },
  },
  themeConfig: {
    logo: '/super_resolution_logo.svg',
    nav: enNav,
    sidebar: enSidebar,
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/187J3X1-114514/superresolution' },
      { icon: 'discord', link: 'https://discord.com/invite/jZ9Vhs855E' },
    ],
  },
})
