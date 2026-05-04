<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

type RailStyle = {
  height: string
  left: string
  top: string
}

const route = useRoute()
const isVisible = ref(false)
const railStyle = ref<RailStyle>({
  height: '0px',
  left: '0px',
  top: '0px',
})

let contentRoot: HTMLElement | null = null
let activeBlock: HTMLElement | null = null
let animationFrame = 0
let pointerX = 0
let pointerY = 0

function getContentRoot() {
  const vpDoc = document.querySelector<HTMLElement>('.VPDoc main .vp-doc')

  if (!vpDoc) return null

  const children = Array.from(vpDoc.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  )
  const onlyChild = children[0]

  if (
    children.length === 1 &&
    onlyChild.tagName === 'DIV' &&
    onlyChild.children.length > 1 &&
    !Array.from(onlyChild.classList).some((className) =>
      className.startsWith('language-')
    )
  ) {
    return onlyChild
  }

  return vpDoc
}

function isInsideContentRoot() {
  if (!contentRoot) return false

  const rect = contentRoot.getBoundingClientRect()

  return (
    pointerX >= rect.left &&
    pointerX <= rect.right &&
    pointerY >= rect.top &&
    pointerY <= rect.bottom
  )
}

function isHighlightableBlock(element: HTMLElement) {
  if (element.matches('script, style, br')) return false
  if (element.classList.contains('visually-hidden')) return false

  const rect = element.getBoundingClientRect()

  return rect.width >= 24 && rect.height >= 8
}

function findBlockFromPoint() {
  if (!contentRoot) return null

  let element = document.elementFromPoint(pointerX, pointerY)

  if (!(element instanceof HTMLElement) || !contentRoot.contains(element)) {
    return null
  }

  while (element.parentElement && element.parentElement !== contentRoot) {
    element = element.parentElement
  }

  if (element.parentElement !== contentRoot) return null

  return isHighlightableBlock(element) ? element : null
}

function moveRailTo(element: HTMLElement) {
  const rect = element.getBoundingClientRect()

  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    isVisible.value = false
    return
  }

  railStyle.value = {
    height: `${Math.max(18, rect.height)}px`,
    left: `${Math.max(8, rect.left - 32)}px`,
    top: `${rect.top}px`,
  }

  isVisible.value = true
}

function updateRail() {
  animationFrame = 0

  if (!contentRoot || !document.body.contains(contentRoot)) {
    contentRoot = getContentRoot()
  }

  if (!contentRoot || !isInsideContentRoot()) {
    isVisible.value = false
    return
  }

  const block = findBlockFromPoint()

  if (block) activeBlock = block
  if (activeBlock) moveRailTo(activeBlock)
}

function scheduleUpdate() {
  if (animationFrame) return
  animationFrame = window.requestAnimationFrame(updateRail)
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch') return

  pointerX = event.clientX
  pointerY = event.clientY
  scheduleUpdate()
}

function hideRail() {
  activeBlock = null
  isVisible.value = false
}

function onScrollOrResize() {
  scheduleUpdate()
}

function refreshContentRoot() {
  contentRoot = getContentRoot()
  hideRail()
}

onMounted(() => {
  refreshContentRoot()

  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('mouseleave', hideRail)
  window.addEventListener('blur', hideRail)
  window.addEventListener('resize', onScrollOrResize, { passive: true })
  window.addEventListener('scroll', onScrollOrResize, {
    capture: true,
    passive: true,
  })
})

onBeforeUnmount(() => {
  if (animationFrame) window.cancelAnimationFrame(animationFrame)

  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('mouseleave', hideRail)
  window.removeEventListener('blur', hideRail)
  window.removeEventListener('resize', onScrollOrResize)
  window.removeEventListener('scroll', onScrollOrResize, true)
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    refreshContentRoot()
  },
  { flush: 'post' }
)
</script>

<template>
  <Teleport to="body">
    <div
      class="vp-content-hover-rail"
      :class="{ 'is-visible': isVisible }"
      :style="railStyle"
      aria-hidden="true"
    />
  </Teleport>
</template>
