<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { toSvg } from "jdenticon";
const { getApiUrl } = storeToRefs(useGlobalStore())
const loadedWithError = ref(false)


interface Logo {
    address: string,
    logoClass: string,
    hasLogo: boolean,
    pixeles: number
}
const { address, hasLogo, logoClass, pixeles } = withDefaults(defineProps<Logo>(), {
    address: '',
    logoClass: '',
    hasLogo: true,
    pixeles: 50
})
const getAvatar = computed(() => {
    const svgString = toSvg(address, pixeles);
    return svgString
})
</script>

<template>
    <div :class="logoClass" v-if="!hasLogo || loadedWithError" v-html="getAvatar" />
    <img v-else class="w-12 h-12 rounded-full" :class="logoClass" :src="getApiUrl + 'validators/' + address + '/avatar'"
        @error="loadedWithError = true" />
</template>