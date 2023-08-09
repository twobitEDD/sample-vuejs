<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
import ValidatorStats from '@/components/ValidatorStats.vue';
const { getUsedDelegations } = storeToRefs(useWalletStore())

</script>

<template>
    <div class="flex flex-wrap flex-1 justify-center items-center">
        <div v-for="delegated of getUsedDelegations">
            <ValidatorStats :Args="{ delegated }" />
        </div>
    </div>
</template>

