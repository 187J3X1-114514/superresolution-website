<template>
    <section class="download-section section-animate">
        <h2 class="section-title">下载</h2>
        <div class="download-panels">
            <a href="https://modrinth.com/mod/superresolution" target="_blank" class="download-panel">
                <div class="panel-icon modrinth-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="514" viewBox="0 0 512 514" class="modrinth-svg">
                        <path fill="currentColor" fill-rule="evenodd"
                              d="M503.16 323.56c11.39-42.09 12.16-87.65.04-132.8C466.57 54.23 326.04-26.8 189.33 9.78 83.81 38.02 11.39 128.07.69 230.47h43.3c10.3-83.14 69.75-155.74 155.76-178.76 106.3-28.45 215.38 28.96 253.42 129.67l-42.14 11.27c-19.39-46.85-58.46-81.2-104.73-95.83l-7.74 43.84c36.53 13.47 66.16 43.84 77 84.25 15.8 58.89-13.62 119.23-67 144.26l11.53 42.99c70.16-28.95 112.31-101.86 102.34-177.02l41.98-11.23a210.2 210.2 0 0 1-3.86 84.16z"
                              clip-rule="evenodd"></path>
                        <path fill="currentColor"
                              d="M321.99 504.22C185.27 540.8 44.75 459.77 8.11 323.24A257.6 257.6 0 0 1 0 275.46h43.27c1.09 11.91 3.2 23.89 6.41 35.83 3.36 12.51 7.77 24.46 13.11 35.78l38.59-23.15c-3.25-7.5-5.99-15.32-8.17-23.45-24.04-89.6 29.2-181.7 118.92-205.71 17-4.55 34.1-6.32 50.8-5.61L255.19 133c-10.46.05-21.08 1.42-31.66 4.25-66.22 17.73-105.52 85.7-87.78 151.84 1.1 4.07 2.38 8.04 3.84 11.9l49.35-29.61-14.87-39.43 46.6-47.87 58.9-12.69 17.05 20.99-27.15 27.5-23.68 7.45-16.92 17.39 8.29 23.07s16.79 17.84 16.82 17.85l23.72-6.31 16.88-18.54 36.86-11.67 10.98 24.7-38.03 46.63-63.73 20.18-28.58-31.82-49.82 29.89c25.54 29.08 63.94 45.23 103.75 41.86l11.53 42.99c-59.41 7.86-117.44-16.73-153.49-61.91l-38.41 23.04c50.61 66.49 138.2 99.43 223.97 76.48 61.74-16.52 109.79-58.6 135.81-111.78l42.64 15.5c-30.89 66.28-89.84 118.94-166.07 139.34">
                        </path>
                    </svg>
                </div>
                <div class="panel-content">
                    <h3 class="panel-title tech-font">MODRINTH</h3>
                    <p class="panel-desc">下载最新版本模组</p>
                </div>
                <div class="panel-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </a>

            <div class="download-panel nightly-panel" @click="$emit('open-nightly')">
                <div class="panel-icon nightly-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="panel-content">
                    <h3 class="panel-title tech-font">NIGHTLY</h3>
                    <p class="panel-desc">浏览历史构建版本</p>
                </div>
                <div class="panel-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DownloadCard',
    emits: ['open-nightly'],
})
</script>

<style scoped>
.download-section {
    margin-bottom: 48px;
}

.download-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 8px;
}

.download-panel {
    display: flex;
    align-items: center;
    background: rgba(16, 32, 22, 0.4);
    border: 1px solid rgba(0, 255, 157, 0.2);
    padding: 24px;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    backdrop-filter: blur(8px);
    cursor: default;
}

a.download-panel {
    cursor: pointer;
}

.download-panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--clr-primary);
    opacity: 0.5;
    transition: all 0.4s ease;
}

.download-panel:hover {
    background: rgba(16, 32, 22, 0.8);
    border-color: var(--clr-primary);
    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.1);
}

.download-panel:hover::before {
    width: 100%;
    opacity: 0.05;
}

.nightly-panel {
    cursor: pointer;
}

.panel-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-right: 20px;
    flex-shrink: 0;
    transition: all 0.4s ease;
}

.panel-icon svg {
    width: 28px;
    height: 28px;
}

.modrinth-icon {
    color: #1BD96A;
}

.nightly-icon {
    color: var(--clr-primary);
}

.panel-content {
    flex-grow: 1;
}

.panel-title {
    color: #fff;
    font-size: 1.1rem;
    margin-bottom: 6px;
    letter-spacing: 1px;
}

.panel-desc {
    color: var(--clr-text-muted);
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
}

.panel-arrow {
    color: var(--clr-primary);
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.4s ease;
    width: 24px;
    height: 24px;
}

.download-panel:hover .panel-arrow {
    opacity: 1;
    transform: translateX(0);
}

@media (max-width: 640px) {
    .download-panels {
        grid-template-columns: 1fr;
    }
}
</style>
