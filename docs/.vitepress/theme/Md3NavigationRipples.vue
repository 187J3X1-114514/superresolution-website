<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const rippleTargets = [
  '.VPNavBarMenuLink',
  '.VPNavBarMenuGroup .button',
  '.VPSidebar .VPSidebarItem.is-link > .item > .link',
  '.VPSidebar .VPSidebarItem.collapsible > .item',
  '.VPMenuLink > .link',
  '.VPDocFooter .pager-link',
]

let observer: MutationObserver | undefined
let animationFrame = 0

function hasRipple(element: Element) {
  return !!element.querySelector(':scope > md-ripple.sr-md-nav-ripple')
}

function addRipple(element: HTMLElement) {
  element.classList.add('sr-md-ripple-host')

  if (hasRipple(element)) return

  const ripple = document.createElement('md-ripple')
  ripple.classList.add('sr-md-nav-ripple')
  element.prepend(ripple)
}

function decorateRipples() {
  animationFrame = 0

  for (const selector of rippleTargets) {
    document
      .querySelectorAll<HTMLElement>(selector)
      .forEach((element) => addRipple(element))
  }
}

function scheduleDecorateRipples() {
  if (animationFrame) return
  animationFrame = window.requestAnimationFrame(decorateRipples)
}

onMounted(() => {
  scheduleDecorateRipples()

  observer = new MutationObserver(scheduleDecorateRipples)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

onBeforeUnmount(() => {
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
  observer?.disconnect()
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    scheduleDecorateRipples()
  },
  { flush: 'post' }
)
</script>

<template>
  <span class="sr-md-navigation-ripples" aria-hidden="true" />
</template>
