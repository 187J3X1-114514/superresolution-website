<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
                <div class="modal-content glass-card">
                    <div class="modal-header">
                        <h2 class="modal-title tech-font">{{ messages.title }}</h2>
                        <button class="modal-close" :aria-label="messages.closeLabel" :title="messages.closeLabel" @click="$emit('close')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="modal-filters">
                        <div class="filter-group">
                            <label class="filter-label">{{ messages.mcVersionLabel }}</label>
                            <select v-model="selectedMcVersion" class="filter-select" @change="onFilterChange">
                                <option value="">{{ messages.allOption }}</option>
                                <option v-for="v in dropdownMcVersions" :key="v" :value="v">{{ v }}</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">{{ messages.loaderLabel }}</label>
                            <select v-model="selectedLoader" class="filter-select" @change="onFilterChange">
                                <option value="">{{ messages.allOption }}</option>
                                <option v-for="l in dropdownLoaders" :key="l" :value="l">{{ l }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-body">
                        <div v-if="loading" class="modal-status">{{ messages.loading }}</div>
                        <div v-else-if="error" class="modal-status modal-error">{{ error }}</div>
                        <div v-else-if="filteredVersions.length === 0" class="modal-status">{{ messages.empty }}</div>
                        <template v-else>
                            <div class="version-list">
                                <div v-for="item in filteredVersions" :key="item.id" class="version-row">
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
                        </template>
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
                this.page = 1
                this.selectedMcVersion = ''
                this.selectedLoader = ''
                this.dropdownMcVersions = []
                this.dropdownLoaders = []
                this.versions = []
                this.error = ''
                this.fetchPage(1)
            }
        },
    },
    mounted() {
        if (this.visible) {
            this.fetchPage(1)
        }
        document.addEventListener('keydown', this.onKeydown)
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.onKeydown)
    },
    methods: {
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
        collectDropdownOptions(list: VersionEntry[]) {
            for (const v of list) {
                for (const mc of v.mc_versions) {
                    if (!this.dropdownMcVersions.includes(mc)) {
                        this.dropdownMcVersions.push(mc)
                    }
                }
                if (!this.dropdownLoaders.includes(v.loader)) {
                    this.dropdownLoaders.push(v.loader)
                }
            }
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
}

.modal-content {
    width: min(82%, 92vw);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    margin: 0 24px;
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.modal-title {
    font-size: 1.5rem;
    color: var(--clr-primary);
    letter-spacing: 1px;
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
    transition: all 0.3s ease;
}

.modal-close svg {
    width: 18px;
    height: 18px;
}

.modal-close:hover {
    border-color: var(--clr-danger);
    color: var(--clr-danger);
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
}

.modal-status {
    text-align: center;
    padding: 48px 0;
    color: var(--clr-text-muted);
}

.modal-error {
    color: var(--clr-danger);
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
    transition: all 0.3s ease;
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
    transition: all 0.3s ease;
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
    transition: all 0.3s ease;
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

/* Transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
.modal-enter-from .modal-content {
    transform: translateY(20px) scale(0.97);
}
.modal-leave-to .modal-content {
    transform: translateY(10px) scale(0.98);
}

@media (max-width: 640px) {
    .version-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    .version-info {
        gap: 6px;
    }
    .version-right {
        width: 100%;
        justify-content: space-between;
    }
}
</style>
