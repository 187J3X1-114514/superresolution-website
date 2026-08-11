<template>
    <div class="gradient-field">
        <label class="gradient-toggle">
            <input
                type="checkbox"
                :checked="gradient"
                @change="$emit('update:gradient', ($event.target as HTMLInputElement).checked)"
            >
            <span class="switch" aria-hidden="true"></span>
            <span class="gradient-toggle-text">{{ labels.gradient }}</span>
        </label>

        <div class="color-rows">
            <div class="color-row">
                <span class="color-row-label">{{ labels.start }}</span>
                <label class="color-swatch" :style="{ backgroundColor: startColor }" :title="startColor">
                    <input
                        type="color"
                        :value="startColor"
                        @input="onPicker('start', $event)"
                    >
                </label>
                <input
                    class="color-hex"
                    :class="{ invalid: startInvalid }"
                    type="text"
                    :value="startText"
                    maxlength="7"
                    spellcheck="false"
                    autocomplete="off"
                    @input="onHexInput('start', $event)"
                    @blur="onHexBlur('start')"
                >
            </div>

            <div v-if="gradient" class="color-row">
                <span class="color-row-label">{{ labels.end }}</span>
                <label class="color-swatch" :style="{ backgroundColor: endColor }" :title="endColor">
                    <input
                        type="color"
                        :value="endColor"
                        @input="onPicker('end', $event)"
                    >
                </label>
                <input
                    class="color-hex"
                    :class="{ invalid: endInvalid }"
                    type="text"
                    :value="endText"
                    maxlength="7"
                    spellcheck="false"
                    autocomplete="off"
                    @input="onHexInput('end', $event)"
                    @blur="onHexBlur('end')"
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

type Slot = 'start' | 'end'

export default defineComponent({
    name: 'GradientColorField',
    props: {
        startColor: { type: String, required: true },
        endColor: { type: String, required: true },
        gradient: { type: Boolean, required: true },
        labels: {
            type: Object as () => { gradient: string; start: string; end: string },
            required: true,
        },
    },
    emits: ['update:startColor', 'update:endColor', 'update:gradient'],
    data() {
        return {
            startText: this.startColor,
            endText: this.endColor,
            startInvalid: false,
            endInvalid: false,
        }
    },
    watch: {
        startColor(value: string) {
            this.startText = value
            this.startInvalid = false
        },
        endColor(value: string) {
            this.endText = value
            this.endInvalid = false
        },
    },
    methods: {
        onPicker(slot: Slot, event: Event) {
            const value = (event.target as HTMLInputElement).value
            this.emitColor(slot, value)
        },
        onHexInput(slot: Slot, event: Event) {
            const input = event.target as HTMLInputElement
            let value = input.value.trim()
            if (value && !value.startsWith('#')) {
                value = `#${value}`
            }
            if (slot === 'start') {
                this.startText = input.value
                this.startInvalid = !HEX_PATTERN.test(value)
            } else {
                this.endText = input.value
                this.endInvalid = !HEX_PATTERN.test(value)
            }
            if (HEX_PATTERN.test(value)) {
                this.emitColor(slot, value.toLowerCase())
            }
        },
        onHexBlur(slot: Slot) {
            if (slot === 'start' && this.startInvalid) {
                this.startText = this.startColor
                this.startInvalid = false
            }
            if (slot === 'end' && this.endInvalid) {
                this.endText = this.endColor
                this.endInvalid = false
            }
        },
        emitColor(slot: Slot, value: string) {
            if (slot === 'start') {
                this.$emit('update:startColor', value)
            } else {
                this.$emit('update:endColor', value)
            }
        },
    },
})
</script>

<style scoped>
.gradient-field {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px 20px;
}

.gradient-toggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
}

.gradient-toggle input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.switch {
    position: relative;
    width: 38px;
    height: 22px;
    flex-shrink: 0;
    border-radius: 11px;
    background: rgba(16, 32, 22, 0.8);
    border: 1px solid var(--clr-border);
    transition: background 0.25s ease, border-color 0.25s ease;
}

.switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--clr-text-muted);
    transition: transform 0.25s var(--ease-out), background 0.25s ease;
}

.gradient-toggle input:checked + .switch {
    background: rgba(0, 255, 157, 0.14);
    border-color: var(--clr-primary);
}

.gradient-toggle input:checked + .switch::after {
    transform: translateX(16px);
    background: var(--clr-primary);
}

.gradient-toggle input:focus-visible + .switch {
    outline: 2px solid var(--clr-primary);
    outline-offset: 3px;
}

.gradient-toggle-text {
    font-size: 0.85rem;
    color: var(--clr-text-muted);
}

.color-rows {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
}

.color-row {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.color-row-label {
    font-size: 0.8rem;
    color: var(--clr-text-muted);
    min-width: 2.5em;
}

.color-swatch {
    position: relative;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid var(--clr-border);
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.25s ease, transform 0.25s ease;
}

.color-swatch:hover {
    border-color: var(--clr-primary);
    transform: translateY(-1px);
}

.color-swatch input[type='color'] {
    position: absolute;
    inset: -6px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    padding: 0;
    border: none;
    opacity: 0;
    cursor: pointer;
}

.color-hex {
    width: 96px;
    padding: 10px 12px;
    background: rgba(16, 32, 22, 0.8);
    border: 1px solid var(--clr-border);
    border-radius: 8px;
    color: var(--clr-text);
    font-family: inherit;
    font-size: 0.9rem;
    transition: border-color 0.25s ease;
}

.color-hex:focus {
    outline: none;
    border-color: var(--clr-primary);
}

.color-hex.invalid {
    border-color: var(--clr-danger);
}

@media (max-width: 520px) {
    .color-hex {
        flex: 1;
        min-width: 0;
    }

    .color-row {
        flex: 1 1 100%;
    }
}
</style>
