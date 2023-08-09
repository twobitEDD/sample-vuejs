<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
const { epoch, getNextEpoch, getNetwork } = storeToRefs(useGlobalStore())
</script>



<template>
    <div class="flex flex-none flex-col space-y-1" style="font-size: 10px;">
        <div class="text-oswapGreen-dark flex flex-none space-x-1 justify-center items-center">
            <span>Current Epoch</span>
            <span class="font-extrabold">{{ epoch }}</span>
        </div>
        <div class="text-oswapGreen-dark flex flex-none space-x-1 justify-center items-center">
            <span>Next Epoch</span>
            <span class="font-extrabold">{{ getNextEpoch }} Min</span>
        </div>
        <div class="text-oswapGreen-dark flex flex-none space-x-1 justify-center items-center">
            <span class="capitalize font-extrabold">{{ getNetwork?.name }}</span>
        </div>
    </div>
</template>


