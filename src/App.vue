<script lang="ts">
import { nextImage } from './background';
import RGBLogo from './components/RGBLogo.vue'
import typingText from './components/typingText.vue'
import { info } from "./info";
import { Tabs } from "mdui"
import { ref } from "vue"
const tabs = ref<Tabs>();
export default {
    name: 'App',
    components: {
        RGBLogo,
        typingText
    },
    setup() {
        return {
            tabs
        }
    },
    data() {
        return {
            info: info,
            currentScreen: 0,
            screens: [
                {
                    id: "main-screen",
                    name: "主页"
                },
                {
                    id: "description-screen",
                    name: "概述"
                },
                {
                    id: "compatibility-screen",
                    name: "兼容性"
                },
                {
                    id: "websites-screen",
                    name: "相关网站"
                }
            ],
            scrollDirection: '',
            lastScrollTime: 0,
            scrollThrottle: 600,
            touchStartY: 0
        }
    },
    methods: {
        handleScroll(event: WheelEvent) {
            const now = Date.now();
            if (now - this.lastScrollTime < this.scrollThrottle) return;
            this.lastScrollTime = now;
            if (event.deltaY > 0) {
                this.scrollDirection = 'down';
                this.nextScreen();
                this.updateTabs()
            } else if (event.deltaY < 0) {
                this.scrollDirection = 'up';
                this.previousScreen();
                this.updateTabs()

            }

        },
        updateTabs() {
            if (tabs.value) tabs.value.value = this.screens[this.currentScreen].id
        },
        nextScreen() {
            if (this.currentScreen < this.screens.length - 1) {
                this.currentScreen++;
                nextImage()
            }
        },
        previousScreen() {
            if (this.currentScreen > 0) {
                this.currentScreen--;
                nextImage()
            }
        },
        setScreen(index: number) {
            this.scrollDirection = index > this.currentScreen ? 'down' : 'up';
            if (this.currentScreen != index) nextImage()
            this.currentScreen = index;

        },
        handleTouchStart(e: TouchEvent) {
            this.touchStartY = e.touches[0].clientY;
        },
        handleTouchMove(e: TouchEvent) {
            const deltaY = this.touchStartY - e.touches[0].clientY;
            if (Math.abs(deltaY) > 30) {
                this.scrollDirection = deltaY > 0 ? 'down' : 'up';
                deltaY > 0 ? this.nextScreen() : this.previousScreen();
            }
        },
        clearScrollDirection() {
            this.scrollDirection = '';
        }
    },
    mounted() {
        window.addEventListener('wheel', this.handleScroll);
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchmove', this.handleTouchMove);
        this.updateTabs()
    },
    beforeDestroy() {
        window.removeEventListener('wheel', this.handleScroll);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchmove', this.handleTouchMove);
    }
}
</script>

<template>
    <div id="app">
        <TransitionGroup :name="scrollDirection === 'down' ? 'scroll-down' : 'scroll-up'"
            @after-enter="clearScrollDirection" :css="true">
            <div :key="currentScreen" :id="screens[currentScreen].id" class="screen">
                <div v-if="currentScreen === 0" style="width: 100%;">
                    <typingText v-bind:texts='["Super Resolution"]' style="font-size: 2em; height: 2em;" :finalIndex="0"
                        :startDelay="100" />
                    <RGBLogo class="main-logo" />
                    <div class="description-container">
                        <div class="description-line">
                            <p class="inline-segment">在Minecraft中添加了</p>
                            <typingText class="inline-segment" :texts='info.algorithms.map((algo) => algo.full_name_en)'
                                :addInterval="40" :deleteInterval="30" :startDelay="500" :switchDelay="5000" />
                            <p class="inline-segment">超分辨率算法</p>
                        </div>
                        <div class="description-line">
                            <p class="inline-segment">支持Minecraft</p>
                            <typingText class="inline-segment" :texts='info.minecraft_versions.support' :addInterval="100"
                                :deleteInterval="60" :startDelay="400" :switchDelay="2000" />
                        </div>
                        <div class="description-line">
                            <p class="inline-segment">支持加载器</p>
                            <typingText class="inline-segment" :texts='["Fabric", "Forge", "NeoForge"]' :addInterval="100"
                                :deleteInterval="60" :startDelay="400" :switchDelay="2000" />
                        </div>
                    </div>
                </div>
                <div v-else-if="currentScreen === 1" style="width: 60%;height: 70%;">
                    <mdui-card variant="filled" class="description-card">
                        <div class="description-part">
                            <h2>概述</h2>
                            <span>本模组Minecraft中内置了几个超分辨率算法，以在不损失太多画质的情况下提升帧率或者损失一些性能提升画质，同时也兼容大多数显卡。</span>
                        </div>
                        <div class="description-part">
                            <h2>工作原理</h2>
                            <span>本模组通过修改Minecraft帧缓冲区大小来控制渲染世界的分辨率，在获取到世界画面后，本模组会把低分辨率画面交给超分辨率算法提高分辨率，最后拿到高分辨率画面后本模组会把画面填充到屏幕上</span>
                        </div>
                        <div class="description-part center">
                            <h2>内置的算法</h2>
                            <ul>
                                <li v-for="algorithm in info.algorithms" :key="algorithm.simple_name">
                                    <h3 class="inline-segment">{{ algorithm.full_name_zh }} ({{ algorithm.full_name_en }})
                                    </h3>
                                    <span class="inline-segment"
                                        style="padding-left: 20px;color: rgba(100, 100, 100, 0.9);">{{ algorithm.available ?
                                            "" : "暂不可用" }}</span>
                                </li>
                            </ul>
                        </div>
                    </mdui-card>
                </div>

                <div v-else-if="currentScreen === 2" style="width: 60%;height: 70%;">
                    <mdui-card variant="filled" class="description-card">
                        <div class="description-part">
                            <h2>游戏兼容性</h2>
                            <ul>
                                <li v-for="loader in Object.keys(info.minecraft_versions).filter((v) => { return v != 'support' })"
                                    :key="loader">
                                    <span class="inline-segment">{{ (info.minecraft_versions as any)[loader].name }}: {{
                                        ((info.minecraft_versions as any)[loader].versions as string[]).join(", ") }}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="description-part">
                            <h2>硬件兼容性</h2>
                            <ul>
                                <li><span>OpenGL 版本必须大于等于 4.3</span></li>
                                <li><span>Vulkan 版本大于等于1.2 (非必须)</span></li>
                            </ul>
                        </div>
                        <div class="description-part">
                            <h2>系统兼容性</h2>
                            <ul>
                                <li><span>Windows</span></li>
                                <li><span>Linux (未测试，之后可能会会去除兼容)</span></li>
                                <li><span>MacOS (不兼容)</span></li>
                                <li><span>Android (不兼容，也不计划兼容)</span></li>
                                <li><span>iOS (不兼容，也不计划兼容)</span></li>
                            </ul>
                        </div>
                        <div class="description-part center">
                            <h2>模组兼容性</h2>
                            <ul>
                                <li><span>兼容：Sodium，Iris，DistantHorizons，Embeddium</span></li>
                                <li><span>不兼容：OptiFine，Canvas，VulkanMod，Resolution Control</span></li>
                            </ul>
                        </div>
                    </mdui-card>
                </div>

                <div v-else-if="currentScreen === 3" style="width: 100%;">
                    <div>
                        <mdui-card href="https://www.mcmod.cn/class/17888.html" target="_blank" variant="filled"
                            class="website-card">
                            <img class="img-mcmod" src="/mcmod.png">
                            <span class="span-mcmod">MC百科主页</span>
                        </mdui-card>
                        <mdui-card href="https://www.mcmod.cn/download/17888.html" target="_blank" variant="filled"
                            class="website-card">
                            <img class="img-mcmod" src="/mcmod.png">
                            <span class="span-mcmod">MC百科下载页</span>
                        </mdui-card>
                        <mdui-card href="https://github.com/187J3X1-114514/superresolution" target="_blank" variant="filled"
                            class="website-card">
                            <svg class="img-github" height="16" aria-hidden="true" viewBox="0 0 24 24" version="1.1"
                                width="16" data-view-component="true">
                                <path style="fill: white;"
                                    d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z">
                                </path>
                            </svg>
                            <span class="span-github">Github开源地址</span>
                        </mdui-card>
                    </div>
                </div>
            </div>
        </TransitionGroup>
        <mdui-tabs ref="tabs" class="tabs" placement="right">
            <mdui-tab v-for="(screen, index) in screens" :value="screen.id" :title="screen.name"
                :class="{ active: currentScreen === index }" @click="setScreen(index)">
                {{ screen.name }}
            </mdui-tab>
        </mdui-tabs>
    </div>
</template>

<style>
.scroll-down-leave-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: absolute;
    width: 100%;
    height: 100%;
}

.scroll-down-enter-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: translateY(100%);
}

.scroll-down-enter {
    opacity: 0;
    transform: translateY(100%);
    z-index: 2;
}

.scroll-down-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.scroll-down-leave-active {
    z-index: 1;
}

.scroll-down-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

.scroll-up-leave-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: absolute;
    width: 100%;
    height: 100%;
}

.scroll-up-enter-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: translateY(-100%);
}

.scroll-up-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.scroll-up-leave-active {
    z-index: 1;
}

.scroll-up-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
</style>