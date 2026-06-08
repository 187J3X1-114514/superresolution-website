<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const showScrollTop = ref(false)

let ticking = false

function updateScrollState() {
  ticking = false
  showScrollTop.value = window.scrollY > 420
}

function requestScrollState() {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(updateScrollState)
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', requestScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestScrollState)
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    updateScrollState()
  },
  { flush: 'post' }
)
</script>

<template>
  <Teleport to="body">
    <md-linear-progress
      class="sr-md-route-progress"
      indeterminate
      aria-label="Page loading"
    />
    <md-fab
      class="sr-md-scroll-fab"
      :class="{ 'is-visible': showScrollTop }"
      size="small"
      lowered
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <svg
        slot="icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <path
          d="M4.7 14.7 12 7.4l7.3 7.3-1.4 1.4L12 10.25l-5.9 5.85-1.4-1.4Z"
          fill="currentColor"
        />
      </svg>
    </md-fab>
  </Teleport>
</template>
