import type { Directive } from 'vue'

type TiltElement = HTMLElement & {
    __tiltCleanup?: () => void
    __tiltReset?: () => void
}

const MAX_TILT = 1.75
let activeTiltElement: TiltElement | null = null

const tilt: Directive<TiltElement> = {
    mounted(el) {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

        el.classList.add('tilt-card')

        const highlight = document.createElement('span')
        highlight.className = 'tilt-highlight'
        highlight.setAttribute('aria-hidden', 'true')
        el.prepend(highlight)

        if (!finePointer.matches || reducedMotion.matches) {
            return
        }

        let frame = 0
        let pointerX = 0
        let pointerY = 0
        let rect: DOMRect | null = null

        const update = () => {
            frame = 0
            const bounds = rect ?? el.getBoundingClientRect()
            const x = Math.min(Math.max((pointerX - bounds.left) / bounds.width, 0), 1)
            const y = Math.min(Math.max((pointerY - bounds.top) / bounds.height, 0), 1)

            el.style.setProperty('--tilt-x', `${(0.5 - y) * MAX_TILT * 2}deg`)
            el.style.setProperty('--tilt-y', `${(x - 0.5) * MAX_TILT * 2}deg`)
            el.style.setProperty('--tilt-glow-x', `${x * 100}%`)
            el.style.setProperty('--tilt-glow-y', `${y * 100}%`)
        }

        const onPointerMove = (event: PointerEvent) => {
            if (activeTiltElement && activeTiltElement !== el) {
                activeTiltElement.__tiltReset?.()
            }

            activeTiltElement = el
            pointerX = event.clientX
            pointerY = event.clientY
            el.classList.add('is-tilting')

            if (!frame) {
                frame = requestAnimationFrame(update)
            }
        }

        const onPointerEnter = () => {
            if (activeTiltElement && activeTiltElement !== el) {
                activeTiltElement.__tiltReset?.()
            }

            activeTiltElement = el
            rect = el.getBoundingClientRect()
            el.classList.add('is-tilting')
        }

        const reset = () => {
            if (frame) {
                cancelAnimationFrame(frame)
                frame = 0
            }

            el.classList.remove('is-tilting', 'is-pressed')
            if (activeTiltElement === el) {
                activeTiltElement = null
            }
            rect = null
            el.style.setProperty('--tilt-x', '0deg')
            el.style.setProperty('--tilt-y', '0deg')
            el.style.setProperty('--tilt-glow-x', '50%')
            el.style.setProperty('--tilt-glow-y', '50%')
        }

        const onPointerDown = () => el.classList.add('is-pressed')
        const onPointerUp = () => el.classList.remove('is-pressed')

        el.addEventListener('pointermove', onPointerMove)
        el.addEventListener('pointerenter', onPointerEnter)
        el.addEventListener('pointerleave', reset)
        el.addEventListener('pointerdown', onPointerDown)
        el.addEventListener('pointerup', onPointerUp)
        el.addEventListener('pointercancel', reset)
        el.__tiltReset = reset

        el.__tiltCleanup = () => {
            reset()
            el.removeEventListener('pointermove', onPointerMove)
            el.removeEventListener('pointerenter', onPointerEnter)
            el.removeEventListener('pointerleave', reset)
            el.removeEventListener('pointerdown', onPointerDown)
            el.removeEventListener('pointerup', onPointerUp)
            el.removeEventListener('pointercancel', reset)
            delete el.__tiltReset
            highlight.remove()
        }
    },
    unmounted(el) {
        el.__tiltCleanup?.()
    },
}

export default tilt
