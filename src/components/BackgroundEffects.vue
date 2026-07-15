<template>
    <div class="background-effects">
        <div id="bg-container"></div>
        <ShaderBackdrop />
        <div id="bg-overlay"></div>
        <div id="geometry-wrapper">
            <div v-for="(shape, index) in shapes" :key="index" class="geometric-shape" :style="shape"></div>
        </div>

        <div ref="cursorGlow" class="cursor-glow"></div>
        <div ref="cursorDot" class="cursor-dot"></div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
import ShaderBackdrop from './ShaderBackdrop.vue'

type ShapeStyle = Record<string, string>;

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default defineComponent({
    name: 'BackgroundEffects',
    components: { ShaderBackdrop },
    setup() {
        const shapes = ref<ShapeStyle[]>([]);
        const cursorGlow = ref<HTMLElement | null>(null)
        const cursorDot = ref<HTMLElement | null>(null)
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

            let frame = 0
            let x = -100
            let y = -100

            const updateCursor = () => {
                frame = 0
                cursorDot.value?.style.setProperty('transform', `translate3d(${x - 3}px, ${y - 3}px, 0)`)
                cursorGlow.value?.style.setProperty('transform', `translate3d(${x - 160}px, ${y - 160}px, 0)`)
            }

            const onMouseMove = (event: MouseEvent) => {
                x = event.clientX
                y = event.clientY

                if (!frame) {
                    frame = requestAnimationFrame(updateCursor)
                }
            };

            window.addEventListener('mousemove', onMouseMove, { passive: true });
            removeMouseListener = () => {
                cancelAnimationFrame(frame)
                window.removeEventListener('mousemove', onMouseMove)
            };
        });

        onBeforeUnmount(() => {
            removeMouseListener();
        });

        return { shapes, cursorGlow, cursorDot };
    }
});
</script>

<style scoped>
.background-effects {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

#geometry-wrapper {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
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
    width: 320px;
    height: 320px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    background: radial-gradient(circle, rgba(0, 255, 157, 0.09) 0%, rgba(0, 255, 157, 0.025) 28%, transparent 68%);
    transform: translate3d(-400px, -400px, 0);
    will-change: transform;
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
    transform: translate3d(-20px, -20px, 0);
    will-change: transform;
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

@media (hover: none), (pointer: coarse) {
    .cursor-glow,
    .cursor-dot {
        display: none;
    }
}

@media (max-width: 640px) {
    .cursor-glow,
    .cursor-dot {
        display: none;
    }

    .geometric-shape {
        opacity: 0.18;
        animation-duration: calc(var(--shape-duration) * 1.4);
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
    .geometric-shape {
        animation: none;
    }

    .cursor-glow,
    .cursor-dot {
        display: none;
    }
}
</style>

