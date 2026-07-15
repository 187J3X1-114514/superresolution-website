const REVEAL_SELECTOR = [
    '.section-animate',
    '.algo-card',
    '.version-card',
    '.download-panel',
    '.link-card',
].join(',')

export function initScrollReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        return () => {}
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    const root = document.documentElement
    const cleanupTimers: number[] = []

    targets.forEach((target) => {
        target.classList.add('reveal-item')
        const siblings = target.parentElement
            ? Array.from(target.parentElement.children).filter((child) => child.matches(REVEAL_SELECTOR))
            : []
        const index = Math.max(siblings.indexOf(target), 0)
        target.style.setProperty('--reveal-delay', `${Math.min(index * 55, 220)}ms`)
    })

    root.classList.add('motion-ready')

    const revealTarget = (target: HTMLElement) => {
        target.classList.add('is-visible')
        observer.unobserve(target)

        const delay = Number.parseInt(target.style.getPropertyValue('--reveal-delay'), 10) || 0
        cleanupTimers.push(window.setTimeout(() => {
            target.classList.remove('reveal-item', 'is-visible')
            target.style.removeProperty('--reveal-delay')
        }, 760 + delay))
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                revealTarget(entry.target as HTMLElement)
            }
        })
    }, {
        rootMargin: '0px 0px -2% 0px',
        threshold: 0.04,
    })

    requestAnimationFrame(() => {
        targets.forEach((target) => {
            const bounds = target.getBoundingClientRect()
            if (bounds.top < window.innerHeight * 0.98 && bounds.bottom > 0) {
                revealTarget(target)
                return
            }

            observer.observe(target)
        })
    })

    return () => {
        observer.disconnect()
        cleanupTimers.forEach((timer) => window.clearTimeout(timer))
        root.classList.remove('motion-ready')
        targets.forEach((target) => {
            target.classList.remove('reveal-item', 'is-visible')
            target.style.removeProperty('--reveal-delay')
        })
    }
}
