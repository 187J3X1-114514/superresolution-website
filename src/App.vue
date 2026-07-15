<script lang="ts">
import BackgroundEffects from './components/BackgroundEffects.vue'
import HeroSection from './components/HeroSection.vue'
import AlgorithmsGrid from './components/AlgorithmsGrid.vue'
import AlgorithmCard from './components/AlgorithmCard.vue'
import VersionGroups from './components/VersionGroups.vue'
import IssueCard from './components/IssueCard.vue'
import LinkCards from './components/LinkCards.vue'
import DownloadCard from './components/DownloadCard.vue'
import NightlyModal from './components/NightlyModal.vue'
import LanguageToggle from './components/LanguageToggle.vue'
import type { VersionInfo } from './components/VersionGroups.vue'
import { defineComponent, nextTick } from 'vue'
import { initScrollReveal } from './utils/reveal'
import {
  applyLocale,
  getInitialLocale,
  getNextLocale,
  persistLocale,
  translations,
  type AppMessages,
  type Locale
} from './i18n'

export default defineComponent({
  name: 'App',
  components: {
    BackgroundEffects,
    HeroSection,
    AlgorithmsGrid,
    AlgorithmCard,
    VersionGroups,
    IssueCard,
    LinkCards,
    DownloadCard,
    NightlyModal,
    LanguageToggle
  },
  data() {
    return {
      locale: getInitialLocale() as Locale,
      showNightly: false,
      revealCleanup: null as null | (() => void),
      // 游戏版本支持列表
      versionList: [
        {
          "version": "26.2",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "26.2",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "26.1 - 26.1.2",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "26.1 - 26.1.2",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "1.21.11",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "1.21.11",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "1.21.4 - 1.21.8",
          "loader": "fabric",
          "state": "deprecated",
          "latest_version": "0.8.2-alpha.1"
        },
        {
          "version": "1.21.4 - 1.21.8",
          "loader": "neoforge",
          "state": "deprecated",
          "latest_version": "0.8.2-alpha.1"
        },
        {
          "version": "1.21 - 1.21.1",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "1.21 - 1.21.1",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        },
        {
          "version": "1.20.6",
          "loader": "fabric",
          "state": "deprecated",
          "latest_version": "0.8.2-alpha.1"
        },
        {
          "version": "1.20.4",
          "loader": "fabric",
          "state": "deprecated",
          "latest_version": "0.8.2-alpha.1"
        },
        {
          "version": "1.20.1",
          "loader": "fabric",
          "state": "deprecated",
          "latest_version": "0.8.2-alpha.1"
        },
        {
          "version": "1.20.1",
          "loader": "forge",
          "state": "main",
          "latest_version": "0.8.3-alpha.5"
        }
      ] as VersionInfo[]
    }
  },
  computed: {
    messages(): AppMessages {
      return translations[this.locale]
    }
  },
  watch: {
    locale: {
      immediate: true,
      handler(locale: Locale) {
        applyLocale(locale)
      }
    }
  },
  mounted() {
    nextTick(() => {
      this.revealCleanup = initScrollReveal()
    })
  },
  beforeUnmount() {
    this.revealCleanup?.()
  },
  methods: {
    toggleLocale() {
      this.locale = getNextLocale(this.locale)
      persistLocale(this.locale)
    }
  }
})
</script>
<template>
  <div id="app">
    <BackgroundEffects />
    <LanguageToggle
        :label="messages.languageToggle.label"
        :title="messages.languageToggle.title"
        @toggle="toggleLocale"
    />

    <div class="container">
      <HeroSection :messages="messages.hero" />

      <main>
        <section id="overview" class="glass-card section-animate">
          <h2 class="section-title">{{ messages.overview.title }}</h2>
          <div class="overview-copy">
            <p v-for="paragraph in messages.overview.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
        </section>

        <AlgorithmsGrid :title="messages.algorithms.title">
          <AlgorithmCard
              v-for="(algo, index) in messages.algorithms.items"
              :key="'grid-' + index"
              :title="algo.title"
          >
            {{ algo.desc }}
          </AlgorithmCard>
        </AlgorithmsGrid>

        <VersionGroups :versions="versionList" :messages="messages.versions" />

        <DownloadCard :messages="messages.download" @open-nightly="showNightly = true" />

        <NightlyModal :visible="showNightly" :messages="messages.nightly" @close="showNightly = false" />

        <LinkCards :messages="messages.links" />

        <IssueCard :messages="messages.issue" />
      </main>

      <footer>
        <p class="tech-font">Hosted on <a href="https://www.cloudflare.com" target="_blank">Cloudflare</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<style>
:root {
  --clr-bg: #050a07;
  --clr-primary: #00ff9d;
  --clr-primary-glow: #00ff9d40;
  --clr-surface: rgba(10, 25, 15, 0.45);
  --clr-surface-hover: rgba(15, 35, 23, 0.6);
  --clr-text: #e2f1e8;
  --clr-text-muted: #8ab49c;
  --clr-border: rgba(0, 255, 157, 0.15);
  --clr-danger: #ff4a4a;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html {
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

body {
  background-color: var(--clr-bg);
  color: var(--clr-text);
  line-height: 1.6;
  overflow-x: hidden;
  overflow-y: visible;
}

h1, h2, h3, .tech-font { font-family: 'Space Grotesk', sans-serif; }

.container {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 40px);
  position: relative;
}

.hero-title span { color: var(--clr-primary); }

section {
  margin-bottom: clamp(68px, 8vw, 92px);
  position: relative;
}

.section-title {
  font-size: clamp(1.45rem, 4vw, 2rem);
  margin-bottom: clamp(24px, 4vw, 34px);
  display: flex;
  align-items: center;
  gap: 16px;
  line-height: 1.2;
}
.section-title::before {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  background: var(--clr-primary);
}

.glass-card {
  background-color: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-left: 3px solid var(--clr-primary);
  backdrop-filter: blur(16px);
  padding: clamp(22px, 5vw, 32px);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.overview-copy {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  color: var(--clr-text-muted);
}

.overview-copy p {
  line-height: 1.78;
  max-width: 58ch;
}

.overview-copy p + p {
  border-left: 1px solid rgba(0, 255, 157, 0.16);
  margin-left: clamp(20px, 3vw, 36px);
  padding-left: clamp(20px, 3vw, 36px);
}

.issue-card .section-title::before { background: var(--clr-danger); }

footer { padding: 60px 0; text-align: center; color: var(--clr-text-muted); font-size: 0.9rem; border-top: 1px solid var(--clr-border); margin-top: 60px; }

button,
a,
select {
  -webkit-tap-highlight-color: transparent;
}

:where(button, a, select):focus-visible {
  outline: 2px solid var(--clr-primary);
  outline-offset: 3px;
}

.tilt-card {
  --tilt-x: 0deg;
  --tilt-y: 0deg;
  --tilt-lift: 0px;
  --tilt-glow-x: 50%;
  --tilt-glow-y: 50%;
  --reveal-offset: 0px;
  transform:
    perspective(900px)
    translate3d(0, calc(var(--reveal-offset) + var(--tilt-lift)), 0)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y));
  transform-style: preserve-3d;
  will-change: auto;
  transition:
    transform 0.55s var(--ease-out),
    border-color 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.55s ease;
}

.tilt-card.is-tilting {
  --tilt-lift: -4px;
  will-change: transform;
  transition:
    transform 0.065s linear,
    border-color 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.55s ease;
}

.tilt-card.is-pressed {
  --tilt-lift: -1px;
}

.tilt-card > :not(.tilt-highlight) {
  position: relative;
  z-index: 1;
}

.tilt-highlight {
  position: absolute;
  inset: -1px;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    circle at var(--tilt-glow-x) var(--tilt-glow-y),
    rgba(154, 255, 215, 0.13) 0%,
    rgba(0, 255, 157, 0.04) 26%,
    transparent 58%
  );
  transition: opacity 0.35s ease;
}

.tilt-card.is-tilting .tilt-highlight {
  opacity: 1;
  transition-duration: 0.1s;
}

.motion-ready .reveal-item {
  --reveal-offset: 18px;
  opacity: 0;
  filter: blur(6px);
}

.motion-ready .reveal-item.is-visible {
  --reveal-offset: 0px;
  opacity: 1;
  filter: blur(0);
  transition-delay: var(--reveal-delay, 0ms);
}

.motion-ready .tilt-card.is-tilting {
  transition-delay: 0ms;
}

.motion-ready .reveal-item:not(.tilt-card) {
  transform: translate3d(0, var(--reveal-offset), 0);
  transition:
    transform 0.65s var(--ease-out) var(--reveal-delay, 0ms),
    opacity 0.55s ease var(--reveal-delay, 0ms),
    filter 0.55s ease var(--reveal-delay, 0ms);
}

@media (max-width: 768px) {
  .container {
    padding: 0 18px;
  }

  header {
    min-height: auto;
  }

  .section-title {
    gap: 12px;
    margin-bottom: 24px;
  }

  .section-title::before {
    width: 28px;
  }

  .glass-card {
    border-left-width: 2px;
  }

  .overview-copy {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .overview-copy p + p {
    border-left: 0;
    border-top: 1px solid rgba(0, 255, 157, 0.14);
    margin-left: 0;
    padding-left: 0;
    padding-top: 18px;
  }

  footer {
    padding: 36px 0;
    margin-top: 36px;
  }
}

@media (hover: none), (pointer: coarse) {
  .tilt-card {
    will-change: auto;
  }

  .tilt-highlight {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .tilt-card {
    --tilt-x: 0deg !important;
    --tilt-y: 0deg !important;
    --tilt-lift: 0px !important;
    --reveal-offset: 0px !important;
    transform: none;
    opacity: 1;
    will-change: auto;
  }

  .motion-ready .reveal-item {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

@media (max-width: 420px) {
  .container {
    padding: 0 14px;
  }

  .section-title {
    align-items: flex-start;
  }

  .section-title::before {
    margin-top: 0.7em;
    width: 22px;
    flex-shrink: 0;
  }
}
</style>
