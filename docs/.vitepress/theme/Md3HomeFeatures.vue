<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

type HomeAction = {
  theme?: 'brand' | 'alt'
  text: string
  link: string
  target?: string
  rel?: string
}

type HomeFeature = {
  title: string
  details?: string | string[]
  link?: string
  linkText?: string
}

const { frontmatter } = useData()
defineProps<{
  mode: 'actions' | 'features'
}>()

const actions = computed<HomeAction[]>(() => frontmatter.value.hero?.actions ?? [])
const features = computed<HomeFeature[]>(() => frontmatter.value.features ?? [])

function resolveLink(link?: string) {
  if (!link) return undefined
  if (/^(?:https?:|mailto:|tel:)/.test(link)) return link
  return withBase(link)
}

function actionRel(action: HomeAction) {
  if (action.rel) return action.rel
  return action.target === '_blank' ? 'noreferrer' : undefined
}
</script>

<template>
  <div v-if="mode === 'actions' && actions.length" class="sr-md-hero-actions">
    <template v-for="action in actions" :key="action.link">
      <md-filled-button
        v-if="action.theme === 'brand'"
        class="sr-md-hero-button"
        :href="resolveLink(action.link)"
        :target="action.target"
        :rel="actionRel(action)"
      >
        {{ action.text }}
      </md-filled-button>
      <md-filled-tonal-button
        v-else
        class="sr-md-hero-button"
        :href="resolveLink(action.link)"
        :target="action.target"
        :rel="actionRel(action)"
      >
        {{ action.text }}
      </md-filled-tonal-button>
    </template>
  </div>

  <section v-if="mode === 'features' && features.length" class="sr-md-home-features">
    <div class="sr-md-home-features-grid">
      <a
        v-for="feature in features"
        :key="feature.title"
        class="sr-md-feature-card"
        :href="resolveLink(feature.link)"
        :aria-label="feature.title"
      >
        <md-elevation />
        <md-ripple />
        <article class="sr-md-feature-card-content">
          <h2 v-html="feature.title" />
          <ul v-if="Array.isArray(feature.details)">
            <li v-for="detail in feature.details" :key="detail" v-html="detail" />
          </ul>
          <p v-else-if="feature.details" v-html="feature.details" />
          <span class="sr-md-feature-card-link">
            {{ feature.linkText || 'Open' }}
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M12 4 10.6 5.4 16.2 11H4v2h12.2l-5.6 5.6L12 20l8-8-8-8Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </article>
      </a>
    </div>
  </section>
</template>
