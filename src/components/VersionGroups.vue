<template>
  <section class="version-section">
    <div class="section-animate">
      <h2 class="section-title">支持的游戏版本与加载器</h2>
      
      <div class="version-grid">
        <div v-for="(v, index) in versions" :key="index" class="version-card">
          <div class="v-card-header">
            <span class="v-loader tech-font">{{ v.loader.toUpperCase() }}</span>
            <span :class="['v-state', 'state-' + v.state]">{{ getStateText(v.state) }}</span>
          </div>
          <div class="v-card-body">
            <div class="v-version">{{ v.version }}</div>
            <div class="v-latest tech-font">Latest: {{ v.latest_version }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface VersionInfo {
  version: string;
  loader: string;
  state: 'lts' | 'main' | 'wip' | 'deprecated';
  latest_version: string;
}

export default defineComponent({
  name: 'VersionGroups',
  props: {
    versions: {
      type: Array as PropType<VersionInfo[]>,
      required: true
    }
  },
  setup() {
    const getStateText = (state: string) => {
      const map: Record<string, string> = {
        'lts': 'LTS (长期支持)',
        'main': 'MAIN (主要维护)',
        'wip': 'WIP (开发中)',
        'deprecated': 'DEPRECATED (已弃用)'
      };
      return map[state] || state.toUpperCase();
    };

    return { getStateText };
  }
});
</script>

<style scoped>
.version-section { margin-bottom: 32px; }
.version-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.version-card {
  background: rgba(16, 32, 22, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 3px solid var(--clr-primary);
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(8px);
}

.version-card:hover {
  background: rgba(16, 32, 22, 0.7);
  border-color: rgba(0, 255, 157, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 255, 157, 0.05);
}

.v-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-loader {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
}

.v-state {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.state-lts { background: rgba(0, 150, 255, 0.15); color: #4da6ff; border: 1px solid rgba(77, 166, 255, 0.3); }
.state-main { background: rgba(0, 255, 157, 0.15); color: var(--clr-primary); border: 1px solid rgba(0, 255, 157, 0.3); }
.state-wip { background: rgba(255, 170, 0, 0.15); color: #ffbc40; border: 1px solid rgba(255, 188, 64, 0.3); }
.state-deprecated { background: rgba(255, 64, 64, 0.15); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3); }

.v-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.v-version {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--clr-text);
}

.v-latest {
  font-size: 0.85rem;
  color: var(--clr-text-muted);
}
</style>

