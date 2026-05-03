<script lang="ts">
import RGBLogo from './components/RGBLogo.vue'
import typingText from './components/typingText.vue'
import BackgroundEffects from './components/BackgroundEffects.vue'
import HeroSection from './components/HeroSection.vue'
import AlgorithmsGrid from './components/AlgorithmsGrid.vue'
import AlgorithmCard from './components/AlgorithmCard.vue'
import VersionGroups from './components/VersionGroups.vue'
import IssueCard from './components/IssueCard.vue'
import LinkCards from './components/LinkCards.vue'
import type { VersionInfo } from './components/VersionGroups.vue';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
    RGBLogo,
    typingText,
    BackgroundEffects,
    HeroSection,
    AlgorithmsGrid,
    AlgorithmCard,
    VersionGroups,
    IssueCard,
    LinkCards
  },
  data() {
    return {
      algoList: [
        {
          "title": "AMD FSR 1",
          "statusText": "NATIVE",
          "statusClass": "",
          "desc": "AMD 第一代空间域超分辨率算法。纯粹基于当前帧图像处理，不依赖历史帧或运动矢量，兼容性最强，无需光影适配即可正常工作。质量不如时域算法，但胜在简单可靠，适合不用光影或对兼容性要求较高的场景。"
        },
        {
          "title": "AMD FSR 2 (OpenGL)",
          "statusText": "NATIVE",
          "statusClass": "",
          "desc": "AMD 第二代时域超分辨率算法，基于 OpenGL 原生实现。利用深度、运动矢量和抖动偏移（Jitter）从历史帧中重建细节，画质显著优于 FSR1，但需要光影传递这些数据才能正常工作，否则会出现明显拖影。"
        },
        {
          "title": "AMD FSR（Vulkan）",
          "statusText": "INTEROP",
          "statusClass": "status-interop",
          "desc": "AMD FSR 系列的 Vulkan 原生版本，通过 Vulkan-OpenGL 互操作层接入。包含 FSR2、FSR3 等。相比 OpenGL 实现精度更高，但需要在设置中关闭「跳过初始化 Vulkan」并启用实验性功能。"
        },
        {
          "title": "Snapdragon SGSR V1",
          "statusText": "NATIVE",
          "statusClass": "",
          "desc": "高通 Snapdragon Game Super Resolution 第一代，空间域算法。极其轻量，GPU 开销极低，适合性能非常有限的硬件。算法品质与 FSR1 相近，无需运动矢量，兼容性好。"
        },
        {
          "title": "Snapdragon SGSR V2",
          "statusText": "NATIVE",
          "statusClass": "",
          "desc": "高通 Snapdragon Game Super Resolution 第二代，引入了时域重投影。相比 SGSR1 画面更稳定，细节更丰富，同样以轻量著称。需要光影传递运动矢量和深度数据。"
        },
        {
          "title": "NVIDIA DLSS",
          "statusText": "INTEROP",
          "statusClass": "status-interop",
          "desc": "NVIDIA 深度学习超采样，需要 RTX 系列显卡（Turing 及以后架构，即 RTX 20xx 及以上）。利用神经网络进行超分重建，画质通常是列表中最好的。通过 Vulkan 互操作层接入，有一定额外同步开销，需要启用实验性功能。"
        },
        {
          "title": "Intel XeSS",
          "statusText": "INTEROP",
          "statusClass": "status-interop",
          "desc": "Intel Xe 超级采样算法。在 Intel Arc 显卡上利用 XMX 专用加速单元提速，在其他显卡上回退到 DP4a 指令集通用路径（质量略低）。通过 Vulkan 互操作接入，需要启用实验性功能。"
        }
      ],
      // 游戏版本支持列表
      versionList: [
                {
          "version": "26.1 - 26.1.2",
          "loader": "fabric",
          "state": "wip",
          "latest_version": "-"
        },
        {
          "version": "26.1 - 26.1.2",
          "loader": "neoforge",
          "state": "wip",
          "latest_version": "-"
        },
        {
          "version": "1.21.11",
          "loader": "fabric",
          "state": "main",
          "latest_version": "0.8.3-alpha.2"
        },
        {
          "version": "1.21.11",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.2"
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
          "latest_version": "0.8.3-alpha.2"
        },
        {
          "version": "1.21 - 1.21.1",
          "loader": "neoforge",
          "state": "main",
          "latest_version": "0.8.3-alpha.2"
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
          "latest_version": "0.8.2-alpha.1"
        }
      ] as VersionInfo[]
    }
  }
})
</script>
<template>
  <div id="app">
    <BackgroundEffects />

    <div class="container">
      <HeroSection />

      <main>
        <section id="overview" class="glass-card section-animate">
          <h2 class="section-title">概述</h2>
          <p>本项目为 Minecraft 内置了多种超分辨率算法：AMD FSR 1/2/3、Intel XeSS、NVIDIA DLSS、高通 SGSR 1/2。原理是降低游戏实际渲染分辨率（例如将 1920×1080 降至 1129×635 渲染，精度 58%），再用超分算法重建画面——GPU 渲染的像素少了，帧率自然更高。超分比例大于 1.0 时损失一定画质；设为 1.0 以下时相当于高质量抗锯齿，可以提升画质。</p>
          <p>使用 DLSS、FSR3 与 XeSS 需要在高级设置里关闭「跳过初始化 Vulkan」，并在实验性功能中启用「启用实验性功能」。时域算法（FSR2/3、DLSS、XeSS 等）只有在光影包针对本模组做了专门适配的情况下，才能发挥最佳效果；否则画面可能出现拖影、鬼影、锯齿状边缘等问题。</p>
        </section>

        <AlgorithmsGrid>
          <AlgorithmCard
              v-for="(algo, index) in algoList"
              :key="'grid-' + index"
              :title="algo.title"
          >
            {{ algo.desc }}
          </AlgorithmCard>
        </AlgorithmsGrid>

        <VersionGroups :versions="versionList" />

        <IssueCard />
        
        <LinkCards />
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

body {
  background-color: var(--clr-bg);
  color: var(--clr-text);
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;

}

h1, h2, h3, .tech-font { font-family: 'Space Grotesk', sans-serif; }

/* Background & cursor styles moved to BackgroundEffects.vue */

.container {
  max-width: 65%;
  margin: 0 auto;
  padding: 0 24px;
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
  font-size: 2rem;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 16px;
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
  padding: 32px;
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
</style>