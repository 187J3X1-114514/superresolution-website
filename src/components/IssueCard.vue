<template>
    <section class="glass-card issue-card section-animate">
        <h2 class="section-title" style="color: var(--clr-danger);">{{ messages.title }}</h2>
        <p style="color: var(--clr-text-muted);">
            <b>{{ messages.crashTitle }}</b>: {{ messages.crashText }}<br>
            <b>{{ messages.renderingTitle }}</b>: {{ messages.renderingText }}<br><br>
            {{ messages.note }}
        </p>
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
/* minimal, App.vue contains styles */
</style>

