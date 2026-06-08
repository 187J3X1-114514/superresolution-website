import { inBrowser, type Theme } from 'vitepress'
import { Fragment, h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ContentHoverRail from './ContentHoverRail.vue'
import HomeShaderBackground from './HomeShaderBackground.vue'
import Md3DocControls from './Md3DocControls.vue'
import Md3HomeFeatures from './Md3HomeFeatures.vue'
import Md3NavigationRipples from './Md3NavigationRipples.vue'
import './styles.css'

let pageSwitchTimer: ReturnType<typeof setTimeout> | undefined
let materialWebInstall: Promise<void> | undefined

async function installMaterialWeb() {
  if (materialWebInstall) return materialWebInstall

  materialWebInstall = Promise.all([
    import('@material/web/button/filled-button.js'),
    import('@material/web/button/filled-tonal-button.js'),
    import('@material/web/elevation/elevation.js'),
    import('@material/web/fab/fab.js'),
    import('@material/web/progress/linear-progress.js'),
    import('@material/web/ripple/ripple.js'),
    import('@material/web/typography/md-typescale-styles.js'),
  ]).then(([, , , , , , typography]) => {
    const styleSheet = typography.styles.styleSheet

    if (!styleSheet || !('adoptedStyleSheets' in document)) return
    if (document.adoptedStyleSheets.includes(styleSheet)) return

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]
  })

  return materialWebInstall
}

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-actions-before-actions': () =>
        h(Md3HomeFeatures, { mode: 'actions' }),
      'home-features-after': () => h(Md3HomeFeatures, { mode: 'features' }),
      'layout-bottom': () =>
        h(Fragment, [
          h(HomeShaderBackground),
          h(ContentHoverRail),
          h(Md3DocControls),
          h(Md3NavigationRipples),
        ]),
    }),
  enhanceApp(context) {
    DefaultTheme.enhanceApp?.(context)

    if (!inBrowser) return

    void installMaterialWeb()

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
