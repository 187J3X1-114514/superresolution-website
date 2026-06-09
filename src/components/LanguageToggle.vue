<template>
    <button
        class="language-toggle tech-font"
        type="button"
        :title="title"
        :aria-label="title"
        @click="$emit('toggle')"
    >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-hidden="true">
            <path d="M325-111.5q-73-31.5-127.5-86t-86-127.5Q80-398 80-480.5t31.5-155q31.5-72.5 86-127t127.5-86Q398-880 480.5-880t155 31.5q72.5 31.5 127 86t86 127Q880-563 880-480.5T848.5-325q-31.5 73-86 127.5t-127 86Q563-80 480.5-80T325-111.5ZM480-162q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/>
        </svg>
        <span>{{ label }}</span>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LanguageToggle',
    props: {
        label: { type: String, required: true },
        title: { type: String, required: true },
    },
    emits: ['toggle'],
})
</script>

<style scoped>
.language-toggle {
    position: fixed;
    top: 22px;
    right: 24px;
    z-index: 900;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 88px;
    height: 42px;
    padding: 0 14px;
    color: var(--clr-text);
    background: rgba(10, 25, 15, 0.72);
    border: 1px solid var(--clr-border);
    backdrop-filter: blur(14px);
    cursor: pointer;
    transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.language-toggle svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
    flex-shrink: 0;
}

.language-toggle span {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0;
    white-space: nowrap;
}

.language-toggle:hover {
    color: var(--clr-primary);
    border-color: var(--clr-primary);
    background: rgba(16, 32, 22, 0.9);
    transform: translateY(-1px);
}

@media (max-width: 640px) {
    .language-toggle {
        top: 14px;
        right: 14px;
        min-width: 76px;
        height: 38px;
        padding: 0 10px;
    }

    .language-toggle svg {
        width: 20px;
        height: 20px;
    }

    .language-toggle span {
        font-size: 0.76rem;
    }
}
</style>
