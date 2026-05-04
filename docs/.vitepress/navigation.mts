import type { DefaultTheme } from 'vitepress'

export const enSidebar: DefaultTheme.SidebarMulti = {
  '/': [
    {
      text: 'Overview',
      items: [{ text: 'Home', link: '/' }],
    },
    {
      text: 'Debugging',
      items: [{ text: 'Debugging Guide', link: '/Debugging-instructions/' }],
    },
    {
      text: 'Mod Developers',
      items: [{ text: 'Mod API Documentation', link: '/Mod-API-Documentation/' }],
    },
    {
      text: 'Shaderpack Developers',
      items: [
        { text: 'About the Interface', link: '/Shaderpack-Interface-documentation/' },
        { text: 'Schema Version 1', link: '/Shaderpack-Interface-documentation/Version-1/' },
      ],
    },
  ],
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function longestCommonPrefix(values: string[]) {
  if (values.length === 0) return ''

  return values.reduce((prefix, value) => {
    let index = 0

    while (index < prefix.length && prefix[index] === value[index]) {
      index += 1
    }

    return prefix.slice(0, index)
  })
}

function makeActiveMatch(links: string[]) {
  const prefix = longestCommonPrefix(links)
    .replace(/[^/]*$/, '')
    .replace(/\/$/, '/')

  return prefix ? `^${escapeRegExp(prefix)}` : undefined
}

function flattenSidebarLinks(items: DefaultTheme.SidebarItem[] = []): DefaultTheme.NavItemWithLink[] {
  return items.flatMap((item) => {
    const links = flattenSidebarLinks(item.items)

    if (!item.link) return links

    return [
      {
        text: item.text ?? item.link,
        link: item.link,
      },
      ...links,
    ]
  })
}

function sidebarToNav(sidebar: DefaultTheme.SidebarMulti, base: string): DefaultTheme.NavItem[] {
  const sidebarConfig = sidebar[base]
  if (!sidebarConfig) return []

  const groups = Array.isArray(sidebarConfig) ? sidebarConfig : sidebarConfig.items
  const [overview, ...sections] = groups
  const overviewLink = flattenSidebarLinks(overview?.items)[0]

  return [
    overviewLink,
    ...sections.map((section) => {
      const links = flattenSidebarLinks(section.items)

      if (links.length === 1) {
        return {
          text: section.text ?? links[0].text,
          link: links[0].link,
        }
      }

      return {
        text: section.text,
        items: links,
        activeMatch: makeActiveMatch(links.map((item) => item.link)),
      }
    }),
  ].filter(Boolean)
}

export const zhSidebar: DefaultTheme.SidebarMulti = {
  '/zh/': [
    {
      text: '概览',
      items: [{ text: '首页', link: '/zh/' }],
    },
    {
      text: '调试',
      items: [{ text: '调试指南', link: '/zh/Debugging-instructions/' }],
    },
    {
      text: 'Mod 开发者',
      items: [{ text: 'Mod API 文档', link: '/zh/Mod-API-Documentation/' }],
    },
    {
      text: '光影包开发者',
      items: [
        { text: '接口概览', link: '/zh/Shaderpack-Interface-documentation/' },
        { text: 'Schema Version 1', link: '/zh/Shaderpack-Interface-documentation/Version-1/' },
      ],
    },
  ],
}

export const enNav: DefaultTheme.NavItem[] = sidebarToNav(enSidebar, '/')
export const zhNav: DefaultTheme.NavItem[] = sidebarToNav(zhSidebar, '/zh/')
