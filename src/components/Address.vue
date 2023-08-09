
<script setup lang="ts">
import { toastMe } from '@/utility/functions';
import useClipboard from 'vue-clipboard3'
interface Address {
    address: string;
}
let { address } = withDefaults(defineProps<Address>(), {
    address: '',
})
async function copyToken1() {
    const { toClipboard } = useClipboard()
    try {
        await toClipboard(address)
        toastMe('success', {
            title: 'Sucessfully Copied',
            link: false,
            href: '',
        })
    } catch (e) {
        console.error(e)
    }
}
</script>

<template>
    <span
        @click="copyToken1()"
        class="cursor-pointer"
    >{{ address && address.slice(0, 6) + '...' + address.slice(38, 42) }}</span>
</template>