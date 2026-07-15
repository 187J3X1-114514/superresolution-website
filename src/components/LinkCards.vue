<template>
    <section class="link-cards-section section-animate">
        <h2 class="section-title">{{ messages.title }}</h2>
        <div class="link-cards-grid">
            <a v-tilt href="https://github.com/187J3X1-114514/superresolution" target="_blank" rel="noopener noreferrer" class="link-card">
                <div class="card-icon github-icon">
                    <!-- GitHub Icon SVG -->
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                </div>
                <div class="card-content">
                    <h3 class="card-title tech-font">GITHUB</h3>
                    <p class="card-desc">{{ messages.githubDesc }}</p>
                </div>
                <div class="card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </a>

            <a v-tilt href="https://www.mcmod.cn/class/17888.html" target="_blank" rel="noopener noreferrer" class="link-card">
                <div class="card-icon mcmod-icon">
                    <span>MC</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title tech-font">MCMOD</h3>
                    <p class="card-desc">{{ messages.mcmodDesc }}</p>
                </div>
                <div class="card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </a>

            <a v-tilt href="https://discord.com/invite/jZ9Vhs855E" target="_blank" rel="noopener noreferrer" class="link-card">
                <div class="card-icon discord-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126.644 96">
                        <path fill="currentColor"
                              d="M81.15,0c-1.2376,2.1973-2.3489,4.4704-3.3591,6.794-9.5975-1.4396-19.3718-1.4396-28.9945,0-.985-2.3236-2.1216-4.5967-3.3591-6.794-9.0166,1.5407-17.8059,4.2431-26.1405,8.0568C2.779,32.5304-1.6914,56.3725.5312,79.8863c9.6732,7.1476,20.5083,12.603,32.0505,16.0884,2.6014-3.4854,4.8998-7.1981,6.8698-11.0623-3.738-1.3891-7.3497-3.1318-10.8098-5.1523.9092-.6567,1.7932-1.3386,2.6519-1.9953,20.281,9.547,43.7696,9.547,64.0758,0,.8587.7072,1.7427,1.3891,2.6519,1.9953-3.4601,2.0457-7.0718,3.7632-10.835,5.1776,1.97,3.8642,4.2683,7.5769,6.8698,11.0623,11.5419-3.4854,22.3769-8.9156,32.0509-16.0631,2.626-27.2771-4.496-50.9172-18.817-71.8548C98.9811,4.2684,90.1918,1.5659,81.1752.0505l-.0252-.0505ZM42.2802,65.4144c-6.2383,0-11.4159-5.6575-11.4159-12.6535s4.9755-12.6788,11.3907-12.6788,11.5169,5.708,11.4159,12.6788c-.101,6.9708-5.026,12.6535-11.3907,12.6535ZM84.3576,65.4144c-6.2637,0-11.3907-5.6575-11.3907-12.6535s4.9755-12.6788,11.3907-12.6788,11.4917,5.708,11.3906,12.6788c-.101,6.9708-5.026,12.6535-11.3906,12.6535Z"/>
                    </svg>
                </div>
                <div class="card-content">
                    <h3 class="card-title tech-font">DISCORD</h3>
                    <p class="card-desc">{{ messages.discordDesc }}</p>
                </div>
                <div class="card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </a>

            <a v-tilt href="/docs/" class="link-card">
                <div class="card-icon docs-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" focusable="false"
                         viewBox="0 0 12 12">
                        <path fill="none" stroke="currentColor" stroke-linecap="round"
                              d="M3.5 5.5h5m-5 2h5m-5 2h5m2-6.29V11c0 .28-.22.5-.5.5H2c-.28 0-.5-.22-.5-.5V1c0-.28.22-.5.5-.5h5.79c.13 0 .26.05.35.15l2.21 2.21c.1.09.15.21.15.35zM7.5.5V3c0 .28.22.5.5.5h2.5"/>
                    </svg>
                </div>
                <div class="card-content">
                    <h3 class="card-title tech-font">WIKI</h3>
                    <p class="card-desc">{{ messages.wikiDesc }}</p>
                </div>
                <div class="card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </a>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {PropType} from 'vue';
import type { LinkCardMessage } from '../i18n'

export default defineComponent({
    name: 'LinkCards',
    props: {
        messages: {
            type: Object as PropType<LinkCardMessage>,
            required: true
        }
    }
});
</script>

<style scoped>
.link-cards-section {
    margin-top: 34px;
    margin-bottom: 52px;
}

.link-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}

.link-card {
    display: flex;
    align-items: center;
    background: rgba(16, 32, 22, 0.4);
    border: 1px solid rgba(0, 255, 157, 0.2);
    min-height: 104px;
    padding: 18px;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(8px);
}

.link-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--clr-primary);
    opacity: 0.5;
    transition: width 0.4s ease, opacity 0.4s ease;
}

.link-card:hover,
.link-card:focus-visible {
    background: rgba(16, 32, 22, 0.8);
    border-color: var(--clr-primary);
    box-shadow: 0 10px 30px rgba(0, 255, 157, 0.1);
}

.link-card:hover::before,
.link-card:focus-visible::before {
    width: 100%;
    opacity: 0.05;
}

.card-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    margin-right: 14px;
    flex-shrink: 0;
    font-weight: 800;
    font-size: 1.2rem;
    transition: transform 0.4s var(--ease-out), color 0.4s ease;
    overflow: hidden;
}

.card-icon svg {
    width: 24px;
    height: 24px;
    color: currentColor;
}

.card-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.github-icon {
    background: transparent;
    color: #ffffff;
}

.mcmod-icon {
    background: linear-gradient(135deg, #8cc55e 50%, #4cb4e2 50%);
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.4rem;
    letter-spacing: 0;
    transform: scale(0.75);
    transform-origin: center;
}

.discord-icon {
    background: transparent;
    color: #5865F2;
}

.docs-icon {
    background: transparent;
    color: #ffffff;
}

.card-content {
    flex-grow: 1;
    min-width: 0;
}

.card-title {
    color: #fff;
    font-size: 1.1rem;
    margin-bottom: 6px;
    letter-spacing: 1px;
    line-height: 1.2;
}

.card-desc {
    color: var(--clr-text-muted);
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
}

.card-arrow {
    color: var(--clr-primary);
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 0.4s ease, transform 0.4s var(--ease-out);
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.link-card:hover .card-arrow,
.link-card:focus-visible .card-arrow {
    opacity: 1;
    transform: translateX(0);
}

.link-card:hover .card-icon,
.link-card:focus-visible .card-icon {
    transform: translateZ(14px) scale(1.04);
}

.link-card:hover .mcmod-icon,
.link-card:focus-visible .mcmod-icon {
    transform: translateZ(14px) scale(0.79);
}

@media (max-width: 640px) {
    .link-cards-section {
        margin-top: 36px;
        margin-bottom: 48px;
    }

    .link-cards-grid {
        grid-template-columns: 1fr;
        gap: 14px;
    }

    .link-card {
        align-items: flex-start;
    }

    .card-icon {
        width: 42px;
        height: 42px;
        margin-right: 14px;
    }

    .card-icon svg {
        width: 24px;
        height: 24px;
    }

    .card-arrow {
        opacity: 1;
        transform: none;
    }
}

@media (max-width: 360px) {
    .link-card {
        padding: 16px;
    }

    .card-icon {
        margin-right: 10px;
    }
}
</style>
