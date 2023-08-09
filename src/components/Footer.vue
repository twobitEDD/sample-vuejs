<script setup lang="ts">
import { useRoute } from 'vue-router';
import DarkSwitch from '@/components/DarkSwitch.vue';
import AnimationsSwitch from '@/components/AnimationsSwitch.vue';
import WalletMode from '@/components/WalletMode.vue';
const route = useRoute()
</script>



<template>
    <div class="flex h-24 p-3 py-8 xl:px-0 px-3 flex-1 relative w-full">
        <div class="flex flex-1 w-full justify-start z-10 space-x-2">
            <DarkSwitch />
            <div class=" flex-none lg:flex hidden">
                <AnimationsSwitch />
            </div>
            <WalletMode />
        </div>
        <div class=" p-1 left-0 right-0 text-center select-none lg:absolute hidden">
            <h1 class="font-medium dark:text-oswapGreen">{{ route.name }}</h1>
        </div>
    </div>
</template>


