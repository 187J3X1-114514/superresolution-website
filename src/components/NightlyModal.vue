<template>
    <Teleport to="body">
        <Transition name="modal" @after-leave="onAfterLeave">
            <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
                <div
                    class="modal-content glass-card"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="nightly-modal-title"
                >
                    <div class="modal-header">
                        <h2 id="nightly-modal-title" class="modal-title tech-font">{{ messages.title }}</h2>
                        <button
                            ref="closeButton"
                            class="modal-close"
                            :aria-label="messages.closeLabel"
                            :title="messages.closeLabel"
                            @click="$emit('close')"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-filters">
                        <div class="filter-group">
                            <label class="filter-label" for="nightly-mc-version">{{ messages.mcVersionLabel }}</label>
                            <select id="nightly-mc-version" v-model="selectedMcVersion" class="filter-select" @change="onFilterChange">
                                <option value="">{{ messages.allOption }}</option>
                                <option v-for="v in dropdownMcVersions" :key="v" :value="v">{{ v }}</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label" for="nightly-loader">{{ messages.loaderLabel }}</label>
                            <select id="nightly-loader" v-model="selectedLoader" class="filter-select" @change="onFilterChange">
                                <option value="">{{ messages.allOption }}</option>
                                <option v-for="l in dropdownLoaders" :key="l" :value="l">{{ l }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-body">
                        <Transition name="content" mode="out-in">
                            <div v-if="loading" key="loading" class="modal-status">
                                <span class="status-indicator" aria-hidden="true">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                                <span>{{ messages.loading }}</span>
                            </div>
                            <div v-else-if="error" key="error" class="modal-status modal-error">{{ error }}</div>
                            <div v-else-if="filteredVersions.length === 0" key="empty" class="modal-status">{{ messages.empty }}</div>
                            <div v-else key="results" class="modal-results">
                                <div class="version-list">
                                    <div
                                        v-for="(item, index) in filteredVersions"
                                        :key="item.id"
                                        class="version-row"
                                        :style="{ '--row-index': Math.min(index, 12) }"
                                    >
                                    <div class="version-info">
                                        <span class="version-tag tech-font">{{ item.version }}</span>
                                        <span class="badge badge-loader">{{ item.loader }}</span>
                                        <span v-for="lbl in item.label" :key="lbl" class="badge badge-label">{{ lbl }}</span>
                                        <span v-if="item.is_dev" class="badge badge-dev">dev</span>
                                        <span class="version-mc">{{ formatMcVersionsDisplay(item.mc_versions) }}</span>
                                    </div>
                                    <div class="version-right">
                                        <span class="version-date">{{ formatDate(item.created_at) }}</span>
                                        <button
                                            class="download-btn"
                                            :disabled="downloadingId === item.id"
                                            :aria-label="messages.downloadLabel"
                                            :title="messages.downloadLabel"
                                            @click="onDownload(item)"
                                        >
                                            <template v-if="downloadingId === item.id">
                                                <span class="btn-spinner"></span>
                                            </template>
                                            <template v-else>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                            </template>
                                        </button>
                                    </div>
                                    </div>
                                </div>

                                <div class="modal-pagination">
                                    <button class="page-btn" :disabled="page <= 1" @click="goPage(page - 1)">{{ messages.previous }}</button>
                                    <span class="page-info">{{ messages.pageInfo(page) }}</span>
                                    <button class="page-btn" :disabled="filteredVersions.length < pageSize" @click="goPage(page + 1)">{{ messages.next }}</button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { fetchVersions, getDownloadUrl } from '../utils/api'
import { buildFilename } from '../utils/filename'
import type { VersionEntry } from '../utils/api'
import type { NightlyMessages } from '../i18n'

const PAGE_SIZE = 50

export default defineComponent({
    name: 'NightlyModal',
    props: {
        visible: { type: Boolean, default: false },
        messages: {
            type: Object as PropType<NightlyMessages>,
            required: true,
        },
    },
    emits: ['close'],
    data() {
        return {
            versions: [] as VersionEntry[],
            page: 1,
            selectedMcVersion: '',
            selectedLoader: '',
            loading: false,
            error: '',
            dropdownMcVersions: [] as string[],
            dropdownLoaders: [] as string[],
            downloadingId: null as number | null,
            previousBodyOverflow: '',
            previousBodyPaddingRight: '',
            triggerElement: null as HTMLElement | null,
        }
    },
    computed: {
        pageSize() { return PAGE_SIZE },
        filteredVersions(): VersionEntry[] {
            let list = [...this.versions]
            if (this.selectedMcVersion) {
                list = list.filter(v => v.mc_versions.includes(this.selectedMcVersion))
            }
            if (this.selectedLoader) {
                list = list.filter(v => v.loader === this.selectedLoader)
            }
            list.sort((a, b) => b.created_at - a.created_at)
            return list
        },
    },
    watch: {
        visible(val: boolean) {
            if (val) {
                this.lockBodyScroll()
                this.page = 1
                this.selectedMcVersion = ''
                this.selectedLoader = ''
                this.dropdownMcVersions = []
                this.dropdownLoaders = []
                this.versions = []
                this.error = ''
                this.fetchPage(1)
                this.$nextTick(() => {
                    (this.$refs.closeButton as HTMLButtonElement | undefined)?.focus()
                })
            }
        },
    },
    mounted() {
        if (this.visible) {
            this.lockBodyScroll()
            this.fetchPage(1)
        }
        document.addEventListener('keydown', this.onKeydown)
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.onKeydown)
        this.unlockBodyScroll()
    },
    methods: {
        lockBodyScroll() {
            if (document.body.style.overflow === 'hidden') return

            this.triggerElement = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null
            this.previousBodyOverflow = document.body.style.overflow
            this.previousBodyPaddingRight = document.body.style.paddingRight

            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`
            }
        },
        unlockBodyScroll() {
            if (document.body.style.overflow !== 'hidden') return

            document.body.style.overflow = this.previousBodyOverflow
            document.body.style.paddingRight = this.previousBodyPaddingRight

            const trigger = this.triggerElement
            this.triggerElement = null
            this.$nextTick(() => {
                if (trigger?.isConnected) trigger.focus()
            })
        },
        onAfterLeave() {
            this.unlockBodyScroll()
        },
        async fetchPage(p: number) {
            this.loading = true
            this.error = ''
            try {
                const data = await fetchVersions({ limit: PAGE_SIZE, offset: (p - 1) * PAGE_SIZE })
                this.versions = data
                this.page = p
                this.collectDropdownOptions(data)
            } catch (e: any) {
                this.error = e.message || this.messages.loadFailed
            } finally {
                this.loading = false
            }
        },
        collectDropdownOptions(_list: VersionEntry[]) {
          this.dropdownMcVersions = []
          this.dropdownLoaders = []
          this.dropdownMcVersions.push(
              "1.20.1",
              "1.21",
              "1.21.1",
              "1.21.11",
              "26.1",
              "26.2"
          )
          this.dropdownLoaders.push(
              "fabric",
              "forge",
              "neoforge",
          )
        },
        onFilterChange() {
            this.fetchPage(1)
        },
        goPage(p: number) {
            this.fetchPage(p)
        },
        async onDownload(item: VersionEntry) {
            if (this.downloadingId !== null) return
            this.downloadingId = item.id
            try {
                const url = await getDownloadUrl(item.r2_object_name, 600)
                const blob = await fetch(url).then(r => r.blob())
                const blobUrl = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = blobUrl
                a.download = buildFilename(item)
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(blobUrl)
            } catch (e: any) {
                alert(e.message || this.messages.downloadFailed)
            } finally {
                this.downloadingId = null
            }
        },
        formatMcVersionsDisplay(mcVersions: string[]): string {
            if (mcVersions.length === 0) return ''
            if (mcVersions.length === 1) return mcVersions[0]
            const newest = mcVersions[0]
            const oldest = mcVersions[mcVersions.length - 1]
            return `${oldest}..${newest}`
        },
        formatDate(ts: number): string {
            const d = new Date(ts)
            const pad = (n: number) => String(n).padStart(2, '0')
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
        },
        onKeydown(e: KeyboardEvent) {
            if (e.key === 'Escape' && this.visible) {
                this.$emit('close')
            }
        },
    },
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    padding: 18px;
    overscroll-behavior: contain;
}

.modal-content {
    position: relative;
    width: min(1120px, 100%);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: 50% 42%;
    will-change: transform, opacity, clip-path;
}

.modal-content::after {
    content: '';
    position: absolute;
    z-index: 4;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    pointer-events: none;
    opacity: 0;
    background: linear-gradient(90deg, transparent, var(--clr-primary), transparent);
    box-shadow: 0 0 18px rgba(0, 255, 157, 0.55);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.modal-title {
    font-size: clamp(1.12rem, 5vw, 1.5rem);
    color: var(--clr-primary);
    letter-spacing: 1px;
    line-height: 1.25;
}

.modal-close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--clr-border);
    color: var(--clr-text-muted);
    cursor: pointer;
    transition: border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease;
}

.modal-close svg {
    width: 18px;
    height: 18px;
    transition: transform 0.35s var(--ease-out);
}

.modal-close:hover {
    border-color: var(--clr-danger);
    color: var(--clr-danger);
}

.modal-close:hover svg {
    transform: rotate(90deg);
}

.modal-filters {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.filter-label {
    font-size: 0.75rem;
    color: var(--clr-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.filter-select {
    padding: 8px 32px 8px 12px;
    background: rgba(16, 32, 22, 0.8);
    border: 1px solid var(--clr-border);
    color: var(--clr-text);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300ff9d' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    transition: border-color 0.3s ease;
    min-width: 140px;
}

.filter-select:focus {
    outline: none;
    border-color: var(--clr-primary);
}

.filter-select option {
    background: #0a1a0f;
    color: var(--clr-text);
}

.modal-body {
    flex: 1;
    overflow-y: auto;
    min-height: 200px;
    overscroll-behavior: contain;
}

.modal-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    text-align: center;
    padding: 48px 0;
    color: var(--clr-text-muted);
}

.status-indicator {
    display: flex;
    align-items: end;
    gap: 4px;
    height: 20px;
}

.status-indicator span {
    width: 3px;
    height: 8px;
    background: var(--clr-primary);
    box-shadow: 0 0 8px rgba(0, 255, 157, 0.45);
    animation: statusPulse 0.75s ease-in-out infinite alternate;
}

.status-indicator span:nth-child(2) {
    animation-delay: 0.12s;
}

.status-indicator span:nth-child(3) {
    animation-delay: 0.24s;
}

.modal-error {
    color: var(--clr-danger);
}

.modal-results {
    min-height: 100%;
}

.version-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.version-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(16, 32, 22, 0.3);
    border: 1px solid transparent;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    animation: versionRowEnter 0.42s var(--ease-out) both;
    animation-delay: calc(var(--row-index, 0) * 24ms);
}

.version-row:hover {
    background: rgba(16, 32, 22, 0.6);
    border-color: rgba(0, 255, 157, 0.15);
}

.version-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    min-width: 0;
    flex: 1;
}

.version-tag {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
}

.version-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
}

.badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge-loader {
    background: rgba(0, 255, 157, 0.12);
    color: var(--clr-primary);
    border: 1px solid rgba(0, 255, 157, 0.25);
}

.badge-label {
    background: rgba(140, 180, 255, 0.12);
    color: #8cb4ff;
    border: 1px solid rgba(140, 180, 255, 0.25);
}

.badge-dev {
    background: rgba(255, 170, 0, 0.12);
    color: #ffbc40;
    border: 1px solid rgba(255, 188, 64, 0.25);
}

.version-mc {
    font-size: 0.8rem;
    color: var(--clr-text-muted);
    white-space: nowrap;
}

.version-date {
    font-size: 0.75rem;
    color: var(--clr-text-muted);
    white-space: nowrap;
}

.download-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--clr-border);
    color: var(--clr-primary);
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    flex-shrink: 0;
}

.download-btn svg {
    width: 18px;
    height: 18px;
}

.download-btn:hover:not(:disabled) {
    background: var(--clr-primary-glow);
    border-color: var(--clr-primary);
}

.download-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--clr-border);
    border-top-color: var(--clr-primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes statusPulse {
    from {
        height: 6px;
        opacity: 0.35;
    }
    to {
        height: 20px;
        opacity: 1;
    }
}

@keyframes versionRowEnter {
    from {
        opacity: 0;
        transform: translateY(10px);
        border-color: rgba(0, 255, 157, 0);
    }
    to {
        opacity: 1;
        transform: translateY(0);
        border-color: rgba(0, 255, 157, 0.04);
    }
}

.modal-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 20px 0 4px;
}

.page-btn {
    padding: 8px 20px;
    background: transparent;
    border: 1px solid var(--clr-border);
    color: var(--clr-text-muted);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, opacity 0.3s ease;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--clr-primary);
    color: var(--clr-primary);
    background: var(--clr-primary-glow);
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.85rem;
    color: var(--clr-text-muted);
    font-family: 'Space Grotesk', sans-serif;
}

.modal-enter-active,
.modal-leave-active {
    transition:
        opacity 0.28s ease,
        background-color 0.32s ease,
        backdrop-filter 0.38s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition:
        transform 0.48s var(--ease-out),
        opacity 0.28s ease,
        clip-path 0.48s var(--ease-out);
}

.modal-leave-active .modal-content {
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0);
}

.modal-enter-from .modal-content {
    opacity: 0;
    transform: translateY(24px) scale(0.94);
    clip-path: inset(48% 0 48% 0);
}

.modal-leave-to .modal-content {
    opacity: 0;
    transform: translateY(14px) scale(0.97);
    clip-path: inset(14% 0 14% 0);
}

.modal-enter-active .modal-content::after {
    animation: modalScan 0.55s ease-out 0.08s both;
}

.modal-enter-active .modal-header {
    animation: modalChildEnter 0.45s var(--ease-out) 0.12s both;
}

.modal-enter-active .modal-filters {
    animation: modalChildEnter 0.45s var(--ease-out) 0.18s both;
}

.modal-enter-active .modal-body {
    animation: modalChildEnter 0.45s var(--ease-out) 0.24s both;
}

.content-enter-active,
.content-leave-active {
    transition: opacity 0.2s ease, transform 0.28s var(--ease-out);
}

.content-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.992);
}

.content-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

@keyframes modalScan {
    from {
        top: 0;
        opacity: 0;
    }
    18% {
        opacity: 0.9;
    }
    to {
        top: 100%;
        opacity: 0;
    }
}

@keyframes modalChildEnter {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    .modal-overlay {
        align-items: stretch;
        padding: 12px;
    }

    .modal-content {
        max-height: calc(100dvh - 24px);
        width: 100%;
        transform-origin: 50% 10%;
    }

    .modal-header {
        gap: 12px;
        margin-bottom: 18px;
    }

    .modal-close {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }

    .modal-filters {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 16px;
    }

    .filter-select {
        width: 100%;
        min-width: 0;
        height: 42px;
    }

    .version-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 12px;
    }
    .version-info {
        gap: 6px;
        width: 100%;
    }
    .version-right {
        width: 100%;
        justify-content: space-between;
        gap: 10px;
    }

    .version-tag {
        white-space: normal;
        overflow-wrap: anywhere;
    }

    .version-mc {
        white-space: normal;
        overflow-wrap: anywhere;
    }

    .modal-pagination {
        gap: 10px;
        justify-content: space-between;
    }

    .page-btn {
        min-height: 40px;
        padding: 8px 14px;
    }

    .modal-enter-from .modal-content {
        transform: translateY(28px) scale(0.975);
        clip-path: inset(0 0 100% 0);
    }
}

@media (max-width: 360px) {
    .modal-overlay {
        padding: 8px;
    }

    .modal-content {
        max-height: calc(100dvh - 16px);
    }

    .modal-pagination {
        flex-wrap: wrap;
    }

    .page-info {
        order: -1;
        width: 100%;
        text-align: center;
    }
}

@media (prefers-reduced-motion: reduce) {
    .modal-enter-active,
    .modal-leave-active,
    .modal-enter-active .modal-content,
    .modal-leave-active .modal-content,
    .content-enter-active,
    .content-leave-active {
        transition: none;
    }

    .modal-enter-active .modal-content::after,
    .modal-enter-active .modal-header,
    .modal-enter-active .modal-filters,
    .modal-enter-active .modal-body,
    .version-row,
    .status-indicator span {
        animation: none;
    }
}
</style>
