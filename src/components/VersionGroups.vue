<template>
    <section class="version-section section-animate">
        <h2 class="section-title">{{ messages.title }}</h2>

        <div class="version-grid">
            <article
                v-for="group in groupedVersions"
                :key="group.version"
                v-tilt
                class="version-card"
            >
                <header class="version-header">
                    <span class="version-number tech-font">{{ group.version }}</span>
                </header>

                <div class="loader-list">
                    <div
                        v-for="entry in group.entries"
                        :key="`${entry.version}-${entry.loader}`"
                        class="loader-row"
                    >
                        <div class="loader-meta">
                            <span class="loader-name tech-font">{{ entry.loader.toUpperCase() }}</span>
                            <span :class="['version-state', `state-${entry.state}`]">
                                {{ getStateText(entry.state) }}
                            </span>
                        </div>
                        <span class="latest-version tech-font">
                            {{ messages.latestLabel }}: {{ entry.latest_version }}
                        </span>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AppMessages } from '../i18n'

export interface VersionInfo {
    version: string
    loader: string
    state: 'lts' | 'main' | 'wip' | 'deprecated'
    latest_version: string
}

interface VersionGroup {
    version: string
    entries: VersionInfo[]
}

export default defineComponent({
    name: 'VersionGroups',
    props: {
        versions: {
            type: Array as PropType<VersionInfo[]>,
            required: true,
        },
        messages: {
            type: Object as PropType<AppMessages['versions']>,
            required: true,
        },
    },
    computed: {
        groupedVersions(): VersionGroup[] {
            const groups = new Map<string, VersionGroup>()

            this.versions.forEach((entry) => {
                const group = groups.get(entry.version)
                if (group) {
                    group.entries.push(entry)
                    return
                }

                groups.set(entry.version, {
                    version: entry.version,
                    entries: [entry],
                })
            })

            return Array.from(groups.values())
        },
    },
    methods: {
        getStateText(state: VersionInfo['state']) {
            return this.messages.states[state] || state.toUpperCase()
        },
    },
})
</script>

<style scoped>
.version-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.version-card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    background: rgba(10, 25, 15, 0.58);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 3px solid var(--clr-primary);
    backdrop-filter: blur(10px);
}

.version-card:hover {
    background: rgba(14, 32, 21, 0.78);
    border-color: rgba(0, 255, 157, 0.38);
    box-shadow: 0 18px 42px rgba(0, 255, 157, 0.08);
}

.version-header {
    display: flex;
    align-items: center;
    padding: 16px 18px 13px;
    border-bottom: 1px solid rgba(0, 255, 157, 0.12);
}

.version-number {
    color: var(--clr-text);
    font-size: clamp(1.3rem, 3vw, 1.7rem);
    font-weight: 800;
    line-height: 1.2;
}

.loader-list {
    display: flex;
    flex-direction: column;
}

.loader-row {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    gap: 6px;
    padding: 11px 18px 12px;
}

.loader-row + .loader-row {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.loader-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex-wrap: wrap;
}

.loader-name {
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
}

.version-state {
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1.35;
    white-space: nowrap;
}

.state-lts {
    color: #4da6ff;
    background: rgba(0, 150, 255, 0.15);
    border: 1px solid rgba(77, 166, 255, 0.3);
}

.state-main {
    color: var(--clr-primary);
    background: rgba(0, 255, 157, 0.15);
    border: 1px solid rgba(0, 255, 157, 0.3);
}

.state-wip {
    color: #ffbc40;
    background: rgba(255, 170, 0, 0.15);
    border: 1px solid rgba(255, 188, 64, 0.3);
}

.state-deprecated {
    color: #ff6464;
    background: rgba(255, 64, 64, 0.15);
    border: 1px solid rgba(255, 77, 77, 0.3);
}

.latest-version {
    color: var(--clr-text-muted);
    font-size: 0.75rem;
    overflow-wrap: anywhere;
    text-align: left;
}

@media (max-width: 1080px) {
    .version-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 680px) {
    .version-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}

@media (max-width: 440px) {
    .version-header {
        padding: 18px 16px 14px;
    }

    .version-state {
        white-space: normal;
        text-align: left;
    }
}
</style>
