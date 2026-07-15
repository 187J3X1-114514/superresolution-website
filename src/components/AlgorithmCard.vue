<template>
    <article v-tilt class="algo-card">
        <div class="algo-card-header">
            <div>
                <h3 class="algo-card-title tech-font">{{ title }}</h3>
                <div v-if="subtitle" class="algo-subtitle">{{ subtitle }}</div>
            </div>
        </div>
        <p class="algo-desc">
            <slot/>
        </p>
    </article>
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
    border-top: 2px solid rgba(0, 255, 157, 0.3);
    padding: clamp(24px, 4vw, 34px) clamp(20px, 4vw, 30px);
    position: relative;
    min-height: 100%;
    backdrop-filter: blur(10px);
    overflow: hidden;
}

.algo-card:hover {
    border-top-color: var(--clr-primary);
    border-color: rgba(0, 255, 157, 0.38);
    box-shadow: 0 18px 42px rgba(0, 255, 157, 0.09);
}

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
    font-size: clamp(1.15rem, 4vw, 1.4rem);
    font-weight: 700;
    line-height: 1.25;
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

@media (max-width: 420px) {
    .algo-card {
        padding: 22px 18px;
    }
}
</style>

