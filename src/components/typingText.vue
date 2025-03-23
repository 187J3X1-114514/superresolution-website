<script lang="ts">
export default {
    props: {
        showCaret: {
            type: Boolean,
            default: true
        },
        texts: {
            type: Array as () => string[],
            required: true
        },
        finalIndex: {
            type: Number,
            default: -1
        },
        addInterval: {
            type: Number,
            default: 60
        },
        deleteInterval: {
            type: Number,
            default: 40
        },
        switchDelay: {
            type: Number,
            default: 2000
        },
        startDelay: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            toggle: 0,
            currentTextValue: "",
            status: "adding" as "adding" | "waiting" | "deleting",
            lastStepTime: 0,
            isFinalReached: false
        };
    },
    computed: {
        shouldShowCaret(): boolean {
            return this.showCaret &&
                (this.status === 'adding' || this.status === 'deleting') &&
                !this.isFinalReached
        },
        isFinalText(): boolean {
            return this.finalIndex >= 0 &&
                this.toggle === this.finalIndex
        }
    },
    watch: {
        toggle(newVal) {
            if (this.isFinalText && newVal === this.finalIndex) {
                this.isFinalReached = false;
            }
        }
    },
    mounted() {
        // 封装动画循环逻辑
        const startAnimation = () => {
            const animationStep = () => {
                if (this.isFinalReached) return;

                const now = Date.now();
                const isFinal = this.isFinalText;

                if (this.status === "adding") {
                    if (now - this.lastStepTime >= this.addInterval) {
                        this.lastStepTime = now;

                        if (this.currentTextValue.length < this.texts[this.toggle].length) {
                            this.currentTextValue = this.texts[this.toggle].slice(
                                0,
                                this.currentTextValue.length + 1
                            );
                        } else {
                            if (isFinal) {
                                this.isFinalReached = true;
                                return;
                            }
                            this.status = "waiting";
                            this.lastStepTime = now;
                        }
                    }
                }
                else if (this.status === "waiting") {
                    if (!isFinal && now - this.lastStepTime >= this.switchDelay) {
                        this.status = "deleting";
                        this.lastStepTime = now;
                    }
                }
                else if (this.status === "deleting") {
                    if (now - this.lastStepTime >= this.deleteInterval) {
                        this.lastStepTime = now;

                        if (this.currentTextValue.length > 0) {
                            this.currentTextValue = this.currentTextValue.slice(0, -1);
                        } else {
                            this.toggle = (this.toggle + 1) % this.texts.length;
                            this.status = "adding";
                        }
                    }
                }

                requestAnimationFrame(animationStep);
            };

            animationStep();
        };

        // 根据启动延迟执行
        if (this.startDelay > 0) {
            setTimeout(startAnimation, this.startDelay);
        } else {
            startAnimation();
        }
    }
};
</script>

<template>
    <span class="typing-container">
        {{ currentTextValue }}<span v-if="shouldShowCaret" class="caret">_</span>
    </span>
</template>

<style>
.typing-container {
    display: inline-block;
    position: relative;
    min-width: 1px;
    vertical-align: top;
}

.caret {
    display: inline-block;
    margin-left: 2px;
    opacity: 1 !important;
    animation: none !important;
}
</style>