<template>
    <div class="algo-card">
        <div class="algo-card-header">
            <div>
                <h3 class="algo-card-title tech-font">{{ title }}</h3>
                <div v-if="subtitle" class="algo-subtitle">{{ subtitle }}</div>
            </div>
        </div>
        <p class="algo-desc">
            <slot/>
        </p>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'AlgorithmCard',
    props: {
        title: {type: String, required: true},
        subtitle: {type: String, required: false}
    }
});
</script>

<style scoped>
.algo-card {
    background: linear-gradient(135deg, rgba(16, 32, 22, 0.7) 0%, rgba(5, 12, 8, 0.9) 100%);
    border: 1px solid var(--clr-border);
    border-top: 2px solid rgba(0, 255, 157, 0.3); /* 初始淡入边框 */
    padding: 40px 32px; /* 增加内边距 */
    position: relative;
    transition: all 0.5s ease-in; /* 使用带有轻微回弹的 Ease */
    backdrop-filter: blur(10px);
}

.algo-card:hover {
    border-top: 2px solid var(--clr-primary);
    /* 这里的 transform 会被 PinnedAlgorithms 里的 hover 样式覆盖或叠加 */
}

/* 装饰性元素：增加一个角落的小光标 */
.algo-card::after {
    content: '';
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 10px;
    height: 10px;
    border-right: 2px solid var(--clr-primary);
    border-bottom: 2px solid var(--clr-primary);
    opacity: 0.3;
}

.algo-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.algo-card-title {
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
}

.algo-subtitle {
    color: var(--clr-text-muted);
    font-size: 0.9rem;
}

.algo-desc {
    color: var(--clr-text-muted);
    font-size: 0.95rem;
    line-height: 1.7;
}
</style>

