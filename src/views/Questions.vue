<script setup lang="ts">
import Questions from '@/assets/questions.json'
import QuestionCard from '@/components/QuestionCard.vue'
</script>

<template>
    <div class="flex flex-1 flex-col space-y-2 max-w-screen-xl mx-auto">
        <div class="flex flex-none my-8">
            <span class="text-lg lg:text-4xl">Staking (FAQ)</span>
        </div>
        <div class="flex flex-none" v-for="question in Questions">
            <QuestionCard :question="question.question" :answer="question.answer" />
        </div>
    </div>
</template>