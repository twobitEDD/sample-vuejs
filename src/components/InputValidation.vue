<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits(['catchInput'])
const { modelValue, inputErrors, label } = defineProps({
    modelValue: String,
    inputErrors: Object,
    label: String
})

const hasError = computed(() => {
    return inputErrors?.length > 0
})
function changeInput(newVal: any) {
    emit('catchInput', newVal.value)
}

</script>

<template>
    <div>
        <label for="input-error" :class="hasError ? 'text-red-700 dark:text-red-500' : ''"
            class="block mb-2 text-sm font-medium ">
            {{ label }}
        </label>
        <input @input="changeInput($event.target)" :value="modelValue" type="number" id="input-error"
            :class="hasError ? 'border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500  dark:border-red-400' : 'outline-oswapGreen-dark dark:outline-oswapBlue-dark'"
            class=" text-sm rounded-lg mb-2 block w-full p-2.5 bg-gray-200 dark:bg-oswapDark-gray dark:placeholder-gray-500 placeholder-gray-400 outline-none "
            placeholder="Amount">
        <p v-for="(error, index) in inputErrors" :key="index" class="text-xs my-1 text-red-600 dark:text-red-500">
            * {{ error }}
        </p>
    </div>
</template>