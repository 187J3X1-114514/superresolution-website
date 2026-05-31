import { inBrowser, type Theme } from 'vitepress'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ContentHoverRail from './ContentHoverRail.vue'
import './styles.css'

let pageSwitchTimer: ReturnType<typeof setTimeout> | undefined

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(ContentHoverRail),
    }),
  enhanceApp(context) {
    DefaultTheme.enhanceApp?.(context)

    if (!inBrowser) return

    const { router } = context
    const onBeforePageLoad = router.onBeforePageLoad
    const onAfterRouteChange = router.onAfterRouteChange
    const root = document.documentElement

    router.onBeforePageLoad = async (to) => {
      const result = await onBeforePageLoad?.(to)
      if (result === false) return false

      if (pageSwitchTimer) clearTimeout(pageSwitchTimer)
      root.classList.remove('sr-page-enter')
      root.classList.add('sr-page-leave')

      return result
    }

    router.onAfterRouteChange = async (to) => {
      await onAfterRouteChange?.(to)

      root.classList.remove('sr-page-leave')
      root.classList.add('sr-page-enter')

      pageSwitchTimer = setTimeout(() => {
        root.classList.remove('sr-page-enter')
      }, 420)
    }
  },
} satisfies Theme
