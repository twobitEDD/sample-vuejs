<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { computed } from '@vue/reactivity';
import { storeToRefs } from 'pinia';
const { currencyDisplay } = storeToRefs(useGlobalStore())

const symbol = computed(() => {
    switch (currencyDisplay.value) {
        case 'eur':
            return '€'
        case 'usd':
            return '$'
        case 'btc':
            return '₿ '
        case 'sats':
            return '~sats '
    }
})
</script>



<template>
    {{ symbol }}
</template>

