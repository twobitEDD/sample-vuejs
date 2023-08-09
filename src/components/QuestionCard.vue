
<script setup lang="ts">
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/vue'
interface Question {
    question: string;
    answer: string;
}
let { question, answer } = withDefaults(defineProps<Question>(), {
    question: '',
    answer: '',
})

</script>

<template>
    <div class="flex flex-1 w-full px-4">
        <div class="flex flex-col flex-1 w-full p-2 mx-auto rounded-2xl">
            <Disclosure v-slot="{ open }">
                <DisclosureButton
                    class="flex justify-between w-full px-4 py-2 font-medium text-left text-oswapGreen-dark bg-oswapGreen-dark bg-opacity-10 rounded-lg hover:bg-opacity-20 focus:outline-none focus-visible:ring focus-visible:ring-oswapGreen-dark focus-visible:ring-opacity-75">
                    <span>{{ question }}</span>
                    <i :class="open ? ' transform rotate-180' : ''" class="las la-angle-down text-oswapBlue"></i>
                </DisclosureButton>
                <DisclosurePanel class="px-4 pt-4 pb-2 text-sm shadow-md rounded-b-xl">
                    {{ answer }}
                </DisclosurePanel>
            </Disclosure>
        </div>
    </div>
</template>