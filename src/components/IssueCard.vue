<template>
    <section class="glass-card issue-card section-animate">
        <h2 class="section-title" style="color: var(--clr-danger);">发现了问题？</h2>
        <p style="color: var(--clr-text-muted);">
            <b>游戏崩溃</b>：在 GitHub Issues 提交问题，附上崩溃报告（crash report）、硬件信息，以及崩溃时在做什么。<br>
            <b>渲染异常（拖影、花屏、鬼影等）</b>：附上截图、安装的模组列表，以及使用的光影名称与版本。<br><br>
            请不要在某些平台评论区报告 Bug——评论区里的问题无法有效追踪与跟进。
        </p>
    </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({name: 'IssueCard'});
</script>

<style scoped>
/* minimal, App.vue contains styles */
</style>

