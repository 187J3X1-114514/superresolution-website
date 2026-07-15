<template>
    <section class="glass-card issue-card section-animate">
        <h2 class="section-title">{{ messages.title }}</h2>
        <div class="issue-grid">
            <article class="issue-type">
                <h3>{{ messages.crashTitle }}</h3>
                <p>{{ messages.crashText }}</p>
            </article>
            <article class="issue-type">
                <h3>{{ messages.renderingTitle }}</h3>
                <p>{{ messages.renderingText }}</p>
            </article>
        </div>
        <p class="issue-note">{{ messages.note }}</p>
    </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type { AppMessages } from '../i18n'

export default defineComponent({
    name: 'IssueCard',
    props: {
        messages: {
            type: Object as () => AppMessages['issue'],
            required: true,
        },
    },
});
</script>

<style scoped>
.issue-card {
    border-left-color: var(--clr-danger);
}

.section-title {
    color: var(--clr-danger);
}

.issue-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.issue-type {
    padding: 18px 20px;
    background: rgba(255, 74, 74, 0.035);
    border: 1px solid rgba(255, 74, 74, 0.14);
}

.issue-type h3 {
    margin-bottom: 8px;
    color: #fff;
    font-size: 1rem;
}

.issue-type p,
.issue-note {
    color: var(--clr-text-muted);
    font-size: 0.9rem;
    line-height: 1.7;
}

.issue-note {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 74, 74, 0.14);
}

@media (max-width: 640px) {
    .issue-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .issue-type {
        padding: 16px;
    }
}
</style>

