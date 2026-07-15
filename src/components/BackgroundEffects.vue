<template>
    <div class="background-effects">
        <div id="bg-container"></div>
        <div id="bg-overlay"></div>
        <Dither
            class="dither-layer"
            :wave-color="[0.5, 0.5, 0.5]"
            :wave-speed="0.04"
            :wave-frequency="2.9"
            :wave-amplitude="0.3"
            :color-num="5"
            :pixel-size="1.7"
            :disable-animation="reducedMotion"
            :enable-mouse-interaction="false"
            :mouse-radius="0.85"
        />
    </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import Dither from './dither/Dither.vue'

const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
</script>

<style scoped>
.background-effects {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.dither-layer {
    position: fixed;
    inset: 0;
    z-index: -1;
    opacity: 0.25;
    mix-blend-mode: screen;
    filter: blur(0.4px);
    transform: scale(1.002);
}

#bg-container {
    position: fixed;
    inset: 0;
    z-index: -3;
    background-size: cover;
    background-position: center;
    filter: grayscale(50%) contrast(100%);
}

#bg-overlay {
    position: fixed;
    inset: 0;
    z-index: -2;
    background: radial-gradient(
        circle at 50% 0%,
        rgba(0, 255, 157, 0.05) 0%, #050a07 70%),
    linear-gradient(
        180deg,
        rgba(5, 10, 7, 0.45) 0%,
        rgba(5, 10, 7, 0.38) 100%
    );
}

@media (max-width: 640px) {
    .dither-layer {
        opacity: 0.21;
    }

    #bg-container {
        background-position: center top;
    }

    #bg-overlay {
        background: radial-gradient(
            circle at 50% 0%,
            rgba(0, 255, 157, 0.08) 0%,
            rgba(5, 10, 7, 0.96) 62%
        ),
        linear-gradient(
            180deg,
            rgba(5, 10, 7, 0.32) 0%,
            rgba(5, 10, 7, 0.62) 100%
        );
    }
}

@media (prefers-reduced-motion: reduce) {
    .dither-layer {
        opacity: 0.18;
    }
}
</style>
