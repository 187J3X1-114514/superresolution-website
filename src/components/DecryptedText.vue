<template>
    <span class="decrypted-text" :aria-label="text">
        <span aria-hidden="true">{{ displayText }}</span>
    </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
    text: string
    interval?: number
}>(), {
    interval: 34,
})

const displayText = ref(props.text)
const characters = '01<>/_#'
let timer = 0

function randomCharacter() {
    return characters[Math.floor(Math.random() * characters.length)]
}

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
    }

    let revealed = 0
    displayText.value = props.text
        .split('')
        .map((character) => character === ' ' ? ' ' : randomCharacter())
        .join('')

    timer = window.setInterval(() => {
        revealed += 1
        displayText.value = props.text
            .split('')
            .map((character, index) => {
                if (character === ' ' || index < revealed) {
                    return character
                }

                return randomCharacter()
            })
            .join('')

        if (revealed >= props.text.length) {
            window.clearInterval(timer)
            timer = 0
            displayText.value = props.text
        }
    }, props.interval)
})

onBeforeUnmount(() => {
    window.clearInterval(timer)
})
</script>

<style scoped>
.decrypted-text {
    display: inline-block;
    min-width: 1ch;
}
</style>
