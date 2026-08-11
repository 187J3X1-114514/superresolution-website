<template>
    <div id="app">
        <BackgroundEffects />
        <LanguageToggle
            :label="messages.languageToggle.label"
            :title="messages.languageToggle.title"
            @toggle="toggleLocale"
        />

        <div class="container">
            <header class="page-header">
                <div class="page-badge">{{ messages.badge }}</div>
                <h1 class="page-title">
                    <span class="page-title-primary">{{ messages.heading }}</span>
                    <span class="page-title-accent">{{ messages.headingAccent }}</span>
                </h1>
                <p class="page-desc">{{ messages.desc }}</p>
            </header>

            <main>
                <section class="glass-card">
                    <h2 class="section-title">{{ messages.preview.title }}</h2>
                    <div class="preview-stage">
                        <div class="preview-pill">{{ messages.preview.sectionPill }}</div>
                        <div class="preview-chip-row">
                            <div class="sponsor-chip" :style="chipStyle">
                                <span class="sponsor-chip-name" :style="chipNameStyle">{{ previewName }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="glass-card">
                    <h2 class="section-title">{{ messages.form.title }}</h2>

                    <div class="field">
                        <label class="field-label" for="sponsor-token">{{ messages.form.tokenLabel }}</label>
                        <input
                            id="sponsor-token"
                            v-model.trim="token"
                            class="text-input"
                            type="password"
                            :placeholder="messages.form.tokenPlaceholder"
                            autocomplete="off"
                            spellcheck="false"
                        >
                        <p class="field-hint">{{ messages.form.tokenHint }}</p>
                        <p v-if="!token" class="field-warning">{{ messages.form.tokenMissing }}</p>
                    </div>

                    <div class="field">
                        <label class="field-label" for="sponsor-name">{{ messages.form.nameLabel }}</label>
                        <input
                            id="sponsor-name"
                            v-model="name"
                            class="text-input"
                            type="text"
                            maxlength="32"
                            :placeholder="messages.form.namePlaceholder"
                            autocomplete="off"
                        >
                    </div>

                    <div class="field">
                        <span class="field-label">{{ messages.form.nameColorLabel }}</span>
                        <GradientColorField
                            v-model:start-color="nameStart"
                            v-model:end-color="nameEnd"
                            v-model:gradient="nameGradient"
                            :labels="gradientLabels"
                        />
                    </div>

                    <div class="field">
                        <span class="field-label">{{ messages.form.backgroundColorLabel }}</span>
                        <GradientColorField
                            v-model:start-color="bgStart"
                            v-model:end-color="bgEnd"
                            v-model:gradient="bgGradient"
                            :labels="gradientLabels"
                        />
                    </div>

                    <div class="save-row">
                        <button
                            class="save-btn"
                            type="button"
                            :disabled="!canSave || saving"
                            @click="save"
                        >
                            <span v-if="saving" class="btn-spinner" aria-hidden="true"></span>
                            <span>{{ saving ? messages.form.saving : messages.form.save }}</span>
                        </button>
                        <p
                            v-if="statusMessage"
                            class="save-status"
                            :class="statusError ? 'is-error' : 'is-ok'"
                            role="status"
                        >
                            {{ statusMessage }}
                        </p>
                    </div>
                </section>
            </main>

            <footer>
                <p class="tech-font">
                    {{ messages.footer }} <a href="https://www.cloudflare.com" target="_blank">Cloudflare</a>
                </p>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BackgroundEffects from '../components/BackgroundEffects.vue'
import LanguageToggle from '../components/LanguageToggle.vue'
import GradientColorField from './GradientColorField.vue'
import { SponsorApiError, updateSponsorSelf } from './api'
import {
    applyLocale,
    getInitialLocale,
    getNextLocale,
    persistLocale,
    sponsorTranslations,
    type Locale,
    type SponsorMessages,
} from './i18n'

function decodeBase64Url(value: string): string | null {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    try {
        const decoded = atob(padded)
        return /^[\x20-\x7e]+$/.test(decoded) ? decoded : null
    } catch {
        return null
    }
}

function tokenFromUrl(): string {
    const raw = new URLSearchParams(window.location.search).get('accessToken')?.trim() ?? ''
    if (!raw) {
        return ''
    }
    return decodeBase64Url(raw) ?? raw
}

export default defineComponent({
    name: 'SponsorApp',
    components: { BackgroundEffects, LanguageToggle, GradientColorField },
    data() {
        return {
            locale: getInitialLocale() as Locale,
            token: tokenFromUrl(),
            name: '',
            nameStart: '#ffffff',
            nameEnd: '#cccccc',
            nameGradient: true,
            bgStart: '#111111',
            bgEnd: '#222222',
            bgGradient: true,
            saving: false,
            statusMessage: '',
            statusError: false,
        }
    },
    computed: {
        messages(): SponsorMessages {
            return sponsorTranslations[this.locale]
        },
        gradientLabels(): { gradient: string; start: string; end: string } {
            return {
                gradient: this.messages.form.gradientLabel,
                start: this.messages.form.startLabel,
                end: this.messages.form.endLabel,
            }
        },
        previewName(): string {
            return this.name.trim() || this.messages.preview.namePlaceholder
        },
        effectiveNameEnd(): string {
            return this.nameGradient ? this.nameEnd : this.nameStart
        },
        effectiveBgEnd(): string {
            return this.bgGradient ? this.bgEnd : this.bgStart
        },
        chipStyle(): Record<string, string> {
            return { background: `linear-gradient(90deg, ${this.bgStart}, ${this.effectiveBgEnd})` }
        },
        chipNameStyle(): Record<string, string> {
            if (this.nameStart === this.effectiveNameEnd) {
                return { color: this.nameStart }
            }
            return { backgroundImage: `linear-gradient(90deg, ${this.nameStart}, ${this.effectiveNameEnd})` }
        },
        canSave(): boolean {
            return this.token.length > 0 && this.name.trim().length > 0
        },
    },
    watch: {
        locale: {
            immediate: true,
            handler(locale: Locale) {
                applyLocale(locale)
            },
        },
        messages: {
            immediate: true,
            handler(messages: SponsorMessages) {
                document.title = messages.title
            },
        },
    },
    methods: {
        toggleLocale() {
            this.locale = getNextLocale(this.locale)
            persistLocale(this.locale)
        },
        async save() {
            if (!this.canSave || this.saving) {
                return
            }
            this.saving = true
            this.statusMessage = ''
            this.statusError = false
            try {
                const sponsor = await updateSponsorSelf(this.token, {
                    name: this.name.trim(),
                    nameColor: { startColor: this.nameStart, endColor: this.effectiveNameEnd },
                    backgroundColor: { startColor: this.bgStart, endColor: this.effectiveBgEnd },
                })
                this.name = sponsor.name
                this.nameStart = sponsor.nameColor.startColor
                this.nameEnd = sponsor.nameColor.endColor
                this.nameGradient = sponsor.nameColor.startColor !== sponsor.nameColor.endColor
                this.bgStart = sponsor.backgroundColor.startColor
                this.bgEnd = sponsor.backgroundColor.endColor
                this.bgGradient = sponsor.backgroundColor.startColor !== sponsor.backgroundColor.endColor
                this.statusMessage = this.messages.form.saveSuccess
            } catch (error) {
                this.statusError = true
                if (error instanceof SponsorApiError && (error.status === 401 || error.status === 403)) {
                    this.statusMessage = this.messages.form.tokenInvalid
                } else if (error instanceof SponsorApiError && error.status === 0) {
                    this.statusMessage = this.messages.form.networkError
                } else if (error instanceof Error) {
                    this.statusMessage = `${this.messages.form.saveFailed}: ${error.message}`
                } else {
                    this.statusMessage = this.messages.form.saveFailed
                }
            } finally {
                this.saving = false
            }
        },
    },
})
</script>

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
    width: min(880px, 100%);
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 40px);
    position: relative;
}

section {
    margin-bottom: clamp(40px, 6vw, 56px);
    position: relative;
}

.section-title {
    font-size: clamp(1.25rem, 3.5vw, 1.6rem);
    margin-bottom: clamp(20px, 3vw, 28px);
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

footer {
    padding: 48px 0;
    text-align: center;
    color: var(--clr-text-muted);
    font-size: 0.9rem;
    border-top: 1px solid var(--clr-border);
    margin-top: 40px;
}

footer a { color: var(--clr-primary); }

button, a, select, input { -webkit-tap-highlight-color: transparent; }

:where(button, a, select, input):focus-visible {
    outline: 2px solid var(--clr-primary);
    outline-offset: 3px;
}

@media (max-width: 768px) {
    .container { padding: 0 18px; }

    .section-title { gap: 12px; margin-bottom: 24px; }
    .section-title::before { width: 28px; }

    .glass-card { border-left-width: 2px; }

    footer { padding: 36px 0; margin-top: 36px; }
}
</style>

<style scoped>
.page-header {
    padding: clamp(72px, 12vh, 120px) 0 clamp(36px, 6vw, 56px);
}

.page-badge {
    display: inline-block;
    padding: 6px 16px;
    border: 1px solid var(--clr-border);
    background: var(--clr-surface);
    color: var(--clr-primary);
    border-radius: 100px;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
}

.page-title {
    font-size: clamp(2.3rem, 6vw, 3.4rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 18px;
    text-transform: uppercase;
    display: flex;
    flex-wrap: wrap;
    gap: 0 0.35em;
}

.page-title-primary { color: var(--clr-text); }
.page-title-accent { color: var(--clr-primary); }

.page-desc {
    font-size: 1.05rem;
    color: var(--clr-text-muted);
    max-width: 62ch;
}

.preview-stage {
    --chip-scale: 1.5;
    background: #1b1920;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: clamp(22px, 4vw, 30px);
}

.preview-pill {
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 3px 12px;
    margin-bottom: 14px;
    border-radius: 100px;
    background: #26232c;
    color: #e6e0e9;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.4;
}

.preview-chip-row {
    display: flex;
    align-items: center;
    min-height: calc(32px * var(--chip-scale));
}

.sponsor-chip {
    display: inline-flex;
    align-items: center;
    height: calc(32px * var(--chip-scale));
    padding: 0 calc(16px * var(--chip-scale));
    border: 1px solid rgba(147, 143, 153, 0.9);
    border-radius: calc(8px * var(--chip-scale));
    font-size: calc(14px * var(--chip-scale));
    font-weight: 500;
    line-height: 1;
    max-width: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

.sponsor-chip-name {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.field {
    margin-bottom: clamp(20px, 3vw, 26px);
}

.field-label {
    display: block;
    font-size: 0.75rem;
    color: var(--clr-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
}

.text-input {
    width: 100%;
    padding: 12px 14px;
    background: rgba(16, 32, 22, 0.8);
    border: 1px solid var(--clr-border);
    border-radius: 8px;
    color: var(--clr-text);
    font-family: inherit;
    font-size: 0.95rem;
    transition: border-color 0.25s ease;
}

.text-input::placeholder {
    color: rgba(138, 180, 156, 0.45);
}

.text-input:focus {
    outline: none;
    border-color: var(--clr-primary);
}

.field-hint {
    margin-top: 8px;
    font-size: 0.82rem;
    color: var(--clr-text-muted);
    opacity: 0.85;
}

.field-warning {
    margin-top: 8px;
    font-size: 0.82rem;
    color: var(--clr-danger);
}

.save-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px 18px;
    margin-top: clamp(24px, 4vw, 32px);
}

.save-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 48px;
    padding: 12px 32px;
    background: rgba(0, 255, 157, 0.05);
    border: 1px solid var(--clr-primary);
    color: var(--clr-primary);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    isolation: isolate;
    transition: color 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease;
}

.save-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--clr-primary);
    transform: scaleX(0) translateZ(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.86, 0, 0.07, 1);
    z-index: -1;
}

.save-btn:hover:not(:disabled)::after,
.save-btn:focus-visible:not(:disabled)::after {
    transform: scaleX(1) translateZ(0);
}

.save-btn:hover:not(:disabled),
.save-btn:focus-visible:not(:disabled) {
    color: #041008;
}

.save-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 255, 157, 0.25);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.save-status {
    font-size: 0.88rem;
    line-height: 1.5;
}

.save-status.is-ok { color: var(--clr-primary); }
.save-status.is-error { color: var(--clr-danger); }

@media (max-width: 640px) {
    .preview-stage { --chip-scale: 1.25; }
}

@media (prefers-reduced-motion: reduce) {
    .save-btn,
    .save-btn::after {
        transition: none;
    }
}
</style>
