<template>
    <header id="hero">
        <div class="hero-layout">
            <div class="hero-left">
                <div class="hero-badge">
                    <DecryptedText :key="messages.badge" :text="messages.badge" />
                </div>
                <h1 class="hero-title">
                    <span class="hero-title-word hero-title-primary">Super</span>
                    <span class="hero-title-word hero-title-accent">Resolution</span>
                </h1>
                <p class="hero-desc">{{ messages.desc }}</p>

                <div class="btn-group">
                    <a href="https://modrinth.com/mod/superresolution" target="_blank" class="btn btn-primary">
                        <span>{{ messages.modrinth }}</span>
                    </a>
                    <a href="https://www.curseforge.com/minecraft/mc-mods/super-resolution" target="_blank" class="btn btn-primary">
                        <span>{{ messages.curseforge }}</span>
                    </a>
                    <a href="https://github.com/187J3X1-114514/superresolution" target="_blank" class="btn btn-primary">
                        <span>{{ messages.github }}</span>
                    </a>
                </div>
            </div>

            <div class="hero-right">
                <div class="logo-viewport">
                    <div class="logo-wrapper">
                        <div class="logo-glow"></div>
                        <svg class="mod-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g class="logo-shapes">
                                <polygon class="p-1"
                                         points="30.37 19.27 25.88 40.41 59.32 40.41 60.79 33.46 34.79 33.46 36.35 26.13 62.36 26.13 63.82 19.27 30.37 19.27"/>
                                <polygon class="p-2" points="57.05 51.1 23.59 51.1 22.13 57.95 55.59 57.95 57.05 51.1"/>
                                <polygon class="p-3"
                                         points="71.58 80.73 65.23 66.72 72.03 66.72 77.87 42.33 51.54 42.33 50.08 49.18 68.92 49.18 66.65 59.87 47.81 59.87 46.35 66.72 56.8 66.72 63.43 80.73 71.58 80.73"/>
                                <polygon class="p-4"
                                         points="41.4 80.73 45.84 59.84 38.71 59.84 34.27 80.73 41.4 80.73"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { AppMessages } from '../i18n'
import DecryptedText from './DecryptedText.vue'

export default defineComponent({
    name: 'HeroSection',
    components: { DecryptedText },
    props: {
        messages: {
            type: Object as () => AppMessages['hero'],
            required: true,
        },
    },
})
</script>

<style scoped>
header {
    min-height: clamp(590px, 82svh, 760px);
    display: flex;
    align-items: center;
    padding: 68px 0 48px;
}

.hero-layout {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: clamp(28px, 5vw, 54px);
}

.hero-left {
    flex: 1.2;
}

.hero-right {
    flex: 0.8;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: translateX(50px) scale(0.8);
    animation: heroGraphicEnter 0.95s var(--ease-out) 0.28s forwards;
}

.hero-badge {
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
    opacity: 0;
    transform: translateY(-20px);
    animation: heroFadeDown 0.62s ease-out 0.12s forwards;
}

.hero-title {
    font-size: clamp(2.9rem, 6.4vw, 4.35rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.hero-title-word {
    display: block;
    opacity: 0;
    filter: blur(12px);
    transform: translateY(22px);
    animation: heroTitleBlurIn 0.72s var(--ease-out) forwards;
}

.hero-title-primary {
    color: var(--clr-text);
    animation-delay: 0.2s;
}

.hero-title-accent {
    color: var(--clr-primary);
    animation-delay: 0.32s;
}

.hero-desc {
    font-size: 1.15rem;
    color: var(--clr-text-muted);
    max-width: 58ch;
    margin-bottom: 32px;
    opacity: 0;
    transform: translateY(20px);
    animation: heroFadeUp 0.65s ease-out 0.52s forwards;
}

.logo-viewport {
    position: relative;
    width: min(340px, 31vw);
    aspect-ratio: 1;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.mod-logo-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 30px var(--clr-primary-glow));
    z-index: 2;
    position: relative;
}

.logo-shapes polygon {
    fill: white;
    transition: fill 0.5s ease;
}

.logo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, var(--clr-primary-glow) 0%, transparent 70%);
    opacity: 0.6;
    filter: blur(40px);
    z-index: 1;
    animation: pulse-glow 5s infinite alternate ease-in-out;
}

@keyframes pulse-glow {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.4;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.7;
    }
}

.btn-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.btn {
    position: relative;
    padding: 14px 32px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;

    background: transparent !important;
    overflow: visible;
    transition: color 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    opacity: 0;
    transform: translateY(18px);
    animation: heroFadeUp 0.48s ease-out forwards;
}

.btn-group .btn:first-child {
    animation-delay: 0.68s;
}

.btn-group .btn:nth-child(2) {
    animation-delay: 0.78s;
}

.btn-group .btn:nth-child(3) {
    animation-delay: 0.88s;
}

.btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--clr-primary);
    z-index: 2;
    pointer-events: none;
    transition: border-color 0.4s ease, background-color 0.4s ease;
}

.btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--clr-primary);
    transform: scaleX(0) translateZ(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.86, 0, 0.07, 1);
    z-index: -1;
    opacity: 1;
    will-change: transform;
}

.btn:hover::after {
    transform: scaleX(1) translateZ(0);
}

.btn:hover::before {
    border-color: var(--clr-primary);
}

.btn-primary::before {
    background: rgba(0, 255, 157, 0.05);
}

.btn {
    isolation: isolate;
}

.btn span {
    color: var(--clr-primary);
    z-index: 3;
    position: relative;
}

.btn:hover {
    color: inherit !important;
}

.btn span {
    transition: color 0.45s cubic-bezier(0.86, 0, 0.07, 1);
}

.btn:hover span,
.btn:focus-visible span {
    color: #041008;
}

@keyframes heroFadeDown {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes heroFadeUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes heroTitleBlurIn {
    to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
    }
}

@keyframes heroGraphicEnter {
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@media (min-width: 901px) and (max-width: 1100px) {
    .btn-group {
        gap: 12px;
    }

    .btn {
        padding-inline: 18px;
        font-size: 0.86rem;
    }
}

@media (max-width: 900px) {
    header {
        min-height: auto;
        padding: 70px 0 48px;
    }

    .hero-layout {
        flex-direction: column-reverse;
        text-align: center;
        gap: 14px;
    }

    .hero-left {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero-title {
        align-items: center;
    }

    .logo-viewport {
        width: min(205px, 52vw);
        margin-bottom: 0;
    }
}

@media (max-width: 520px) {
    header {
        padding: 62px 0 34px;
    }

    .hero-badge {
        max-width: 100%;
        padding: 6px 12px;
        font-size: 0.72rem;
        letter-spacing: 1px;
        margin-bottom: 14px;
    }

    .hero-title {
        font-size: clamp(2.35rem, 13vw, 3.15rem);
        letter-spacing: 0;
        margin-bottom: 16px;
    }

    .hero-desc {
        font-size: 1rem;
        margin-bottom: 24px;
        max-width: 36ch;
    }

    .btn-group {
        width: 100%;
        gap: 12px;
    }

    .btn {
        flex: 1 1 160px;
        padding: 12px 16px;
        font-size: 0.86rem;
        letter-spacing: 0.5px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero-badge,
    .hero-title-word,
    .hero-desc,
    .hero-right,
    .btn {
        opacity: 1;
        transform: none;
        filter: none;
        animation: none;
    }

    .logo-glow {
        animation: none;
    }
}

@media (max-width: 360px) {
    .btn {
        flex-basis: 145px;
        padding-inline: 8px;
        font-size: 0.78rem;
    }
}
</style>
