<script lang="ts">
export default {
    data() {
        return {
        };
    },
    methods: {
        getRandomColor() {
            function generateColor(color: string): string {
                return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                    && (color.length == 6) ? color : generateColor(color);
            }
            return '#' + generateColor('');
        }
    }
};
</script>

<template>
    <svg id="main" data-name="main" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100">
        <defs>
            <linearGradient id="渐变" data-name="渐变" x1="50" y1="11.12" x2="50" y2="88.88" gradientUnits="userSpaceOnUse">
                <stop offset="0" :stop-color="getRandomColor()" />
                <stop offset="1" :stop-color="getRandomColor()" />
                <stop offset="2" :stop-color="getRandomColor()" />
            </linearGradient>
        </defs>
        <g id="_x34_">
            <rect class="cls-2" x="11.12" y="11.12" width="77.76" height="77.76" rx="10.92" ry="10.92" />
            <g>
                <path class="cls-1"
                    d="M30.18,20.26l-3.96,18.64c-.16.78.43,1.51,1.22,1.51h30.9c.59,0,1.1-.41,1.22-.99l.94-4.45c.16-.78-.43-1.5-1.22-1.5h-22.92c-.79,0-1.38-.73-1.22-1.51l1.03-4.84c.12-.58.63-.99,1.22-.99h23.99c.59,0,1.1-.41,1.22-.99l.93-4.36c.16-.78-.43-1.51-1.22-1.51h-30.9c-.59,0-1.1.41-1.22.99Z" />
                <path class="cls-1"
                    d="M55.53,51.1h-30.92c-.59,0-1.1.41-1.22.99l-.92,4.36c-.16.78.43,1.51,1.22,1.51h30.91c.59,0,1.1-.41,1.22-.99l.93-4.36c.16-.78-.43-1.51-1.22-1.51Z" />
                <path class="cls-1"
                    d="M70.8,78.96l-4.75-10.48c-.37-.83.23-1.76,1.14-1.76h3.88c.58,0,1.08-.4,1.21-.96l5.24-21.9c.19-.78-.41-1.54-1.21-1.54h-23.74c-.59,0-1.1.41-1.22.99l-.93,4.36c-.16.78.43,1.51,1.22,1.51h15.76c.79,0,1.38.73,1.22,1.51l-1.74,8.2c-.12.58-.63.99-1.22.99h-16.82c-.59,0-1.1.41-1.22.99l-.93,4.36c-.17.78.43,1.51,1.22,1.51h8.12c.48,0,.92.28,1.13.71l5.96,12.58c.21.44.64.71,1.13.71h5.42c.91,0,1.51-.94,1.14-1.76Z" />
                <path class="cls-1"
                    d="M41.63,79.74l3.91-18.39c.16-.78-.43-1.51-1.22-1.51h-4.58c-.59,0-1.1.41-1.22.99l-3.92,18.39c-.17.78.43,1.51,1.22,1.51h4.59c.59,0,1.1-.41,1.22-.99Z" />
            </g>
        </g>
    </svg>
</template>

<style>
.cls-1 {
    fill: #fff;
}

.cls-2 {
    fill: url(#渐变);
}
</style>