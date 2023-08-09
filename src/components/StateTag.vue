<script setup lang="ts">

const { state } = defineProps({
    state: Boolean,
})
</script>

<template>
    <div :class="state ? ' text-oswapGreen-dark' : 'text-red-600'" class="flex flex-none flex-col space-y-2">
        <div class="flex flex-none justify-center">
            <i :class="state ? ' la-check ' : 'la-times '"
                class="las text-xl rounded-full shadow-light-level dark:shadow-dark-level px-2 py-1"></i>
        </div>
        <div class="flex flex-none justify-center">
            <span class="uppercase text-ns">{{ state ? 'Elected' : 'Not Elected' }}</span>
        </div>
    </div>
</template>