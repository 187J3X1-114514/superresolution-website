<template>
    <header id="hero">
        <div class="hero-layout">
            <div class="hero-left">
                <div class="hero-badge">Minecraft Rendering Optimization Mod</div>
                <h1 class="hero-title">Super <br><span>Resolution</span></h1>
                <p class="hero-desc">在 Minecraft 中内置多种超分辨率算法，包括 FSR、DLSS、XeSS
                    等。通过降低实际渲染分辨率，再由算法将画面重建回原分辨率，以可接受的画质损失换取帧率提升；也可将超分比例设低于
                    1.0，相当于高质量抗锯齿，提升画面清晰度。</p>

                <div class="btn-group">
                    <!-- 改成这样：文字包在 <span> 里 -->
                    <a href="https://modrinth.com/mod/superresolution" target="_blank" class="btn btn-primary">
                        <span>Modrinth 主页</span>
                    </a>
                    <a href="https://github.com/187J3X1-114514/superresolution" target="_blank" class="btn btn-primary">
                        <span>GitHub 存储库</span>
                    </a>
                </div>
            </div>

            <div class="hero-right">
                <div class="logo-viewport">
                    <div class="logo-wrapper">
                        <div class="logo-glow"></div>
                        <svg class="mod-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g class="logo-shapes">
                                <polygon class="p-1"
                                         points="30.37 19.27 25.88 40.41 59.32 40.41 60.79 33.46 34.79 33.46 36.35 26.13 62.36 26.13 63.82 19.27 30.37 19.27"/>
                                <polygon class="p-2" points="57.05 51.1 23.59 51.1 22.13 57.95 55.59 57.95 57.05 51.1"/>
                                <polygon class="p-3"
                                         points="71.58 80.73 65.23 66.72 72.03 66.72 77.87 42.33 51.54 42.33 50.08 49.18 68.92 49.18 66.65 59.87 47.81 59.87 46.35 66.72 56.8 66.72 63.43 80.73 71.58 80.73"/>
                                <polygon class="p-4"
                                         points="41.4 80.73 45.84 59.84 38.71 59.84 34.27 80.73 41.4 80.73"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 60px;
}

.hero-layout {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
}

.hero-left {
    flex: 1.2;
}

.hero-right {
    flex: 0.8;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: translateX(50px) scale(0.8);
    animation: heroGraphicEnter 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
}

/* 文字样式保持一致但微调间距 */
.hero-badge {
    display: inline-block;
    padding: 6px 16px;
    border: 1px solid var(--clr-border);
    background: var(--clr-surface);
    color: var(--clr-primary);
    border-radius: 100px;
    font-size: 0.85rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(-20px);
    animation: heroFadeDown 0.8s ease-out 0.2s forwards;
}

.hero-title {
    font-size: clamp(3rem, 8vw, 4.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: -1px;
    opacity: 0;
    transform: translateY(50px);
    clip-path: inset(100% 0 0 0);
    animation: heroTitleReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
}

.hero-title span {
    color: var(--clr-primary);
}

.hero-desc {
    font-size: 1.15rem;
    color: var(--clr-text-muted);
    max-width: 550px;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(20px);
    animation: heroFadeUp 0.8s ease-out 0.8s forwards;
}

/* Logo 视觉区域 */
.logo-viewport {
    position: relative;
    width: 380px;
    height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.mod-logo-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 30px var(--clr-primary-glow));
    z-index: 2;
    position: relative;
}

.logo-shapes polygon {
    fill: white; /* 初始颜色 */
    transition: fill 0.5s ease;
}

/* 核心背景发光：让 Logo 像是在发光的核心 */
.logo-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    background: radial-gradient(circle, var(--clr-primary-glow) 0%, transparent 70%);
    opacity: 0.6;
    filter: blur(40px);
    z-index: 1;
    animation: pulse-glow 5s infinite alternate ease-in-out;
}

@keyframes pulse-glow {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.4;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.7;
    }
}

.btn-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

/* 1. 基础容器 */
.btn {
    position: relative;
    padding: 14px 32px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: transparent !important;
    overflow: visible;
    transition: color 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    opacity: 0;
    transform: translateY(18px);
    animation: heroFadeUp 0.55s ease-out forwards;
}

.btn-group .btn:first-child {
    animation-delay: 0.95s;
}

.btn-group .btn:last-child {
    animation-delay: 1.1s;
}

/* 2. 边框层 */
.btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--clr-primary);
    z-index: 2;
    pointer-events: none;
    transition: all 0.4s ease;
}

/* 3. 填充层（防 1px 抖动最终版） */
.btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--clr-primary);
    transform: scaleX(0) translateZ(0);
    transform-origin: left;
    transition: transform 0.45s cubic-bezier(0.86, 0, 0.07, 1);
    z-index: -1;
    opacity: 1;
    will-change: transform; /* 浏览器提前创建独立层 */
}

.btn:hover::after {
    transform: scaleX(1) translateZ(0);
}

.btn:hover::before {
    border-color: var(--clr-primary);
}

.btn-primary::before {
    background: rgba(0, 255, 157, 0.05);
}

/* ==================== 新增：动态文字对比（mix-blend-mode 自动适配） ==================== */
/* 放在 <style scoped> 最底部 */

.btn {
    isolation: isolate; /* 创建独立层叠上下文，保证 blend 只影响按钮内部 */
}

/* 把文字包裹进 <span>，让它成为独立混合层 */
.btn span {
    color: var(--clr-primary); /* ← 这就是关键“源颜色” */
    mix-blend-mode: difference; /* 自动根据背后背景计算颜色 */
    z-index: 3; /* 确保在 ::after 之上、::before 之下 */
    position: relative;
}

/* 移除所有手动颜色强制（不再需要） */
.btn:hover {
    color: inherit !important; /* 取消之前的 #ffffff */
}

/* 可选：如果你希望 hover 时文字也带一点过渡（更丝滑） */
.btn span {
    transition: filter 0.45s cubic-bezier(0.86, 0, 0.07, 1);
}

@keyframes heroFadeDown {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes heroFadeUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes heroTitleReveal {
    to {
        opacity: 1;
        transform: translateY(0);
        clip-path: inset(0 0 0 0);
    }
}

@keyframes heroGraphicEnter {
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

/* 响应式调整 */
@media (max-width: 900px) {
    .hero-layout {
        flex-direction: column-reverse;
        text-align: center;
        padding-top: 40px;
    }

    .hero-left {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .logo-viewport {
        width: 280px;
        height: 280px;
        margin-bottom: 20px;
    }
}
</style>