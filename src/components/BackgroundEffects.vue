<template>
    <div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;width: 100%;height: 100%">
        <div id="bg-container" style="position: fixed;width: 100%;height: 100%"></div>
        <div id="bg-overlay" style="position: fixed;width: 100%;height: 100%"></div>
        <div id="geometry-wrapper" style="position: fixed;width: 100%;height: 100%">
            <div v-for="(shape, index) in shapes" :key="index" class="geometric-shape" :style="shape"></div>
        </div>

        <div id="cursor-glow" class="cursor-glow"></div>
        <div id="cursor-dot" class="cursor-dot"></div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';

type ShapeStyle = Record<string, string>;

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default defineComponent({
    name: 'BackgroundEffects',
    setup() {
        const shapes = ref<ShapeStyle[]>([]);
        let removeMouseListener = () => {};

        onMounted(() => {
            const bgContainer = document.getElementById('bg-container');
            if (bgContainer) {
                bgContainer.style.backgroundImage = `url('/background/1.png')`;
            }

            shapes.value = Array.from({length: 4}, () => {
                const size = Math.floor(randomBetween(100, 500));

                return {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}vw`,
                    top: `${Math.random() * 100}vh`,
                    '--shape-rotation': `${randomBetween(0, 45)}deg`,
                    '--shape-rotation-drift': `${randomBetween(-90, 90)}deg`,
                    '--shape-drift-x': `${randomBetween(-150, 150)}px`,
                    '--shape-drift-y': `${randomBetween(-150, 150)}px`,
                    '--shape-duration': `${randomBetween(15, 25)}s`,
                    '--shape-delay': `-${randomBetween(0, 25)}s`
                };
            });

            const cursorGlow = document.getElementById('cursor-glow');
            const cursorDot = document.getElementById('cursor-dot');
            const onMouseMove = (event: MouseEvent) => {
                cursorDot?.style.setProperty('transform', `translate(${event.clientX}px, ${event.clientY}px)`);
                cursorGlow?.style.setProperty(
                    'transform',
                    `translate(${event.clientX - 200}px, ${event.clientY - 200}px) scale(4)`
                );
            };

            window.addEventListener('mousemove', onMouseMove);
            removeMouseListener = () => window.removeEventListener('mousemove', onMouseMove);
        });

        onBeforeUnmount(() => {
            removeMouseListener();
        });

        return {shapes};
    }
});
</script>

<style scoped>
.scanline {
    width: 100%;
    height: 100px;
    z-index: 999;
    position: fixed;
    pointer-events: none;
    background: linear-gradient(0deg, rgba(0, 255, 157, 0) 0%, rgba(0, 255, 157, 0.1) 50%, rgba(0, 255, 157, 0) 100%);
    opacity: 0.1;
    top: 0;
}

.geometric-shape {
    position: absolute;
    border: 1px solid rgba(0, 255, 157, 0.25);
    z-index: 0;
    opacity: 0.3;
    pointer-events: none;
    transform: rotate(var(--shape-rotation));
    animation: floatShape var(--shape-duration) ease-in-out infinite alternate;
    animation-delay: var(--shape-delay);
}

@keyframes floatShape {
    from {
        transform: translate3d(0, 0, 0) rotate(var(--shape-rotation));
    }

    to {
        transform: translate3d(var(--shape-drift-x), var(--shape-drift-y), 0)
            rotate(calc(var(--shape-rotation) + var(--shape-rotation-drift)));
    }
}

.cursor-glow {
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    background: radial-gradient(circle, rgba(0, 255, 157, 0.15) 0%, transparent 10%);
    transform-origin: 50% 50%;
    transform: scale(4);
    transition: transform 0.45s ease-out;
}

.cursor-dot {
    position: fixed;
    width: 6px;
    height: 6px;
    background-color: #00ff9d;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    box-shadow: 0 0 10px #00ff9d;
    transition: transform 0.1s linear;
}

#bg-container {
    position: fixed;
    inset: 0;
    z-index: -1;
    background-size: cover;
    background-position: center;
    filter: grayscale(50%) contrast(100%);
}

#bg-overlay {
    position: fixed;
    inset: 0;
    z-index: -1;
    background: radial-gradient(
        circle at 50% 0%,
        rgba(0, 255, 157, 0.05) 0%, #050a07 70%),
    linear-gradient(
        180deg,
        rgba(5, 10, 7, 0.45) 0%,
        rgba(5, 10, 7, 0.38) 100%
    );
}
</style>

