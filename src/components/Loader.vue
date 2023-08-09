<script setup lang="ts">
import LoaderFull from '@/assets/loader.json'
</script>

<template>
    <lottie-player
        :src="LoaderFull"
        background="transparent"
        speed="1"
        style="width: 150px; height: 150px;"
        loop
        autoplay
    ></lottie-player>
</template>