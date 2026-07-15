<template>
    <section id="algorithms">
        <h2 class="section-title section-animate">{{ title }}</h2>
        <div class="algo-grid-extended">
            <slot/>
        </div>
    </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'AlgorithmsGrid',
    props: {
        title: {type: String, required: true}
    },
    setup() {
        return {};
    }
});
</script>

<style scoped>
.algo-grid-extended {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
}

.algo-grid-extended :deep(.algo-card:last-child:nth-child(odd)) {
    width: calc(50% - 12px);
    grid-column: 1 / -1;
    justify-self: center;
}

@media (max-width: 640px) {
    .algo-grid-extended {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .algo-grid-extended :deep(.algo-card:last-child:nth-child(odd)) {
        width: 100%;
        grid-column: auto;
    }
}
</style>

