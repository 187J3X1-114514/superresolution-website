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
import {defineComponent, onMounted, ref, nextTick} from 'vue';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default defineComponent({
  name: 'BackgroundEffects',
  setup() {
    const shapes = ref<any[]>([]);

    onMounted(() => {
      // background image selection
      const bgContainer = document.getElementById('bg-container');
      if (bgContainer) {
        bgContainer.style.backgroundImage = `url('background/1.png')`;
      }

      // geometric shapes
      const newShapes = [];
      for (let i = 0; i < 4; i++) {
        const w = Math.floor(Math.random() * 400) + 100;
        newShapes.push({
          width: `${w}px`,
          height: `${w}px`,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          transform: `rotate(${Math.random() * 45}deg)`
        });
      }
      shapes.value = newShapes;

      // mouse follower
      const cursorGlow = document.getElementById('cursor-glow');
      const cursorDot = document.getElementById('cursor-dot');
      window.addEventListener('mousemove', (e) => {
        if (cursorDot) gsap.to(cursorDot, {x: e.clientX, y: e.clientY, duration: 0.1});
        if (cursorGlow) gsap.to(cursorGlow, {
          x: e.clientX - 200,
          y: e.clientY - 200,
          duration: 0.5,
          ease: 'power2.out'
        });
      });

      // scanline animation
      //gsap.to('.scanline', {
      //  y: window.innerHeight,
      //  duration: 3.5,
      //  repeat: -1,
      //  ease: 'none',
      //  modifiers: {y: gsap.utils.unitize((y: any) => parseFloat(y) % window.innerHeight)}
      //});

      // float shapes
      nextTick(() => {
        gsap.utils.toArray('.geometric-shape').forEach((shape) => {
          gsap.to(shape as Element, {
            x: 'random(-150, 150)',
            y: 'random(-150, 150)',
            rotation: 'random(-90, 90)',
            duration: 'random(15, 25)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        });
      });
    });

    return { shapes };
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

