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
import type { VersionInfo } from './components/VersionGroups.vue';
import { defineComponent } from 'vue'
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
      // 游戏版本支持列表
      versionList: [
                {
          "version": "26.1 - 26.1.2",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.4"
        },
        {
          "version": "26.1 - 26.1.2",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.4"
        },
        {
          "version": "1.21.11",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.4"
        },
        {
          "version": "1.21.11",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.4"
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
          "latest_version": "0.8.3-alpha.4"
        },
        {
          "version": "1.21 - 1.21.1",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.4"
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
          "latest_version": "0.8.3-alpha.4"
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
          <p v-for="paragraph in messages.overview.paragraphs" :key="paragraph">{{ paragraph }}</p>
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

        <IssueCard :messages="messages.issue" />

        <DownloadCard :messages="messages.download" @open-nightly="showNightly = true" />

        <NightlyModal :visible="showNightly" :messages="messages.nightly" @close="showNightly = false" />

        <LinkCards :messages="messages.links" />
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
  /* 浅绿色科技主题色板 */
  --clr-bg: #050a07;
  --clr-primary: #00ff9d;
  --clr-primary-glow: #00ff9d40;
  --clr-surface: rgba(10, 25, 15, 0.45);
  --clr-surface-hover: rgba(15, 35, 23, 0.6);
  --clr-text: #e2f1e8;
  --clr-text-muted: #8ab49c;
  --clr-border: rgba(0, 255, 157, 0.15);
  --clr-danger: #ff4a4a;
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
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
  overflow-y: visible;
}

h1, h2, h3, .tech-font { font-family: 'Space Grotesk', sans-serif; }

/* Background & cursor styles moved to BackgroundEffects.vue */

.container {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 40px);
  position: relative;
}

/* Hero Section */
header {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 100px;
}


.hero-title span { color: var(--clr-primary); }

section {
  margin-bottom: 100px;
  position: relative;
}

.section-title {
  font-size: clamp(1.45rem, 4vw, 2rem);
  margin-bottom: 40px;
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
  transition: transform 0.3s ease, background 0.3s ease;
}

/* Algorithm card styles moved to AlgorithmCard.vue */

/* 版本展示标签 */
.version-group { margin-bottom: 32px; }
.version-group h3 { font-size: 1.1rem; margin-bottom: 16px; color: #fff; }
.version-tag {
  display: inline-block;
  padding: 8px 20px;
  margin: 0 12px 12px 0;
  background: transparent;
  border: 1px solid var(--clr-border);
  color: var(--clr-text-muted);
  font-family: 'Space Grotesk', sans-serif;
  transition: all 0.3s;
}
.version-tag:hover {
  border-color: var(--clr-primary);
  color: var(--clr-primary);
  background: var(--clr-primary-glow);
}

/* 问题反馈区域 */
.issue-card .section-title::before { background: var(--clr-danger); }

footer { padding: 60px 0; text-align: center; color: var(--clr-text-muted); font-size: 0.9rem; border-top: 1px solid var(--clr-border); margin-top: 60px; }

@media (max-width: 768px) {
  .container {
    padding: 0 18px;
  }

  header {
    min-height: auto;
  }

  section {
    margin-bottom: 64px;
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

  footer {
    padding: 36px 0;
    margin-top: 36px;
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
