
<script setup lang="ts">
import { useValidatorsStore } from '@/stores/validators';
import { storeToRefs } from 'pinia';
import { returnPercentage } from '@/utility/functions'

const { getValidatorsMediumApr } = storeToRefs(useValidatorsStore())
</script>

<template>
    <div
        class="flex flex-none flex-col space-y-4 text-center py-8 px-12 shadow-md   from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r rounded-lg">
        <span class="text-base font-semibold">Medium <span class="text-oswapBlue font-bold">APR</span> across elected
            validators</span>
        <span class="text-2xl font-bold text-oswapBlue">{{ returnPercentage(getValidatorsMediumApr) }}</span>
    </div>
</template>