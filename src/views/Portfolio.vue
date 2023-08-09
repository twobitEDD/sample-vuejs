<script setup lang="ts">
import Profile from '@/components/Profile.vue'
import ValidatorsCards from '@/components/ValidatorsCards.vue'

</script>



<template>
    <div class="max-w-screen-xl mx-auto flex flex-1 justify-center xl:px-0 px-3">
        <div class="flex flex-col flex-1 space-y-4 mt-4">
            <div class="flex flex-none">
                <Profile />
            </div>
            <div class="flex flex-none">
                <ValidatorsCards />
            </div>
        </div>
    </div>
</template>


