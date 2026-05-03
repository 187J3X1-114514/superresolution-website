<template>
    <section ref="pinSection" class="pin-section">
        <div class="pin-content">
            <div class="pin-left">
                <h2 class="section-title">算法演进</h2>
                <p style="color: var(--clr-text-muted);">持续滑动以探索集成的各项渲染与帧生成技术。</p>
            </div>
            <div class="pin-right" ref="rightContainer">
                <div ref="scrollWrapper" class="scroll-wrapper">
                    <slot/>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="ts">
import {defineComponent, onMounted, ref, onBeforeUnmount} from 'vue';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default defineComponent({
    name: 'PinnedAlgorithms',
    setup() {
        const pinSection = ref<HTMLElement | null>(null);
        const scrollWrapper = ref<HTMLElement | null>(null);
        const rightContainer = ref<HTMLElement | null>(null);
        let stInstance: ScrollTrigger | null = null;
        let resizeObserver: ResizeObserver | null = null;

        onMounted(() => {
            // 使用 setTimeout 给浏览器一点时间完成插槽内容的完整布局与渲染
            setTimeout(() => {
                const section = pinSection.value;
                const wrapper = scrollWrapper.value;
                const container = rightContainer.value;

                if (section && wrapper && container) {
                    // 核心修复：将写死的计算改为动态返回的函数
                    const getScrollAmount = () => {
                        const amount = wrapper.scrollWidth - container.offsetWidth;
                        // 确保不会返回负数，加上 80px 作为右侧缓冲留白
                        return amount > 0 ? amount + 80 : 1000; // 如果计算失败给个默认保底值
                    };

                    const tween = gsap.to(wrapper, {
                        x: () => -getScrollAmount(), // 变成函数，在 refresh 时会重新执行
                        ease: 'none'
                    });

                    stInstance = ScrollTrigger.create({
                        trigger: section,
                        animation: tween,
                        pin: true,
                        scrub: 1,
                        start: 'center center',
                        // end 值也变成函数，保证滚动距离与内容真实长度严格 1:1
                        end: () => `+=${getScrollAmount()}`,
                        invalidateOnRefresh: true, // 允许窗口 resize 时重新计算
                    });

                    // 强制 ScrollTrigger 重新计算页面上所有元素的高度和触发点
                    ScrollTrigger.refresh();

                    // 监听大小变化（比如图片加载完成），自动重新计算
                    resizeObserver = new ResizeObserver(() => {
                        ScrollTrigger.refresh();
                    });
                    resizeObserver.observe(wrapper);
                    resizeObserver.observe(container);

                    // 兜底刷新
                    setTimeout(() => ScrollTrigger.refresh(), 500);
                    setTimeout(() => ScrollTrigger.refresh(), 1500);
                }
            }, 150); // 150ms 延迟足以避开 Vue 首次渲染的计算盲区
        });

        onBeforeUnmount(() => {
            // 离开页面或销毁组件时清理内存
            if (stInstance) {
                stInstance.kill();
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        });

        return {pinSection, scrollWrapper, rightContainer};
    }
});
</script>

<style scoped>
.pin-section {
    height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-bottom: 50px;
}

.pin-content {
    display: flex;
    align-items: center;
    width: 100%;
}

.pin-left {
    flex: 0 0 260px;
    padding-right: 32px;
    z-index: 10;
}

.pin-right {
    flex: 1;
    overflow: hidden;
    /* 使用遮罩让左右边缘有平滑的渐隐效果 */
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
}

.scroll-wrapper {
    display: flex;
    gap: 24px;
    width: max-content;
    padding: 40px 30px; /* 留出阴影所需的空间 */
}

/* 覆盖卡片的默认初始状态，防止在横向滚动时卡片不可见 */
.scroll-wrapper :deep(.algo-card) {
    width: 340px;
    flex-shrink: 0;
    opacity: 1 !important;
}

.scroll-wrapper :deep(.algo-card:not(:hover)) {
    transform: translateY(0) !important;
}
</style>