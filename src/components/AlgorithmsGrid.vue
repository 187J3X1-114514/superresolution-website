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
/* grid layout for algorithm cards moved here from App.vue */
.algo-grid-extended {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
}
</style>

