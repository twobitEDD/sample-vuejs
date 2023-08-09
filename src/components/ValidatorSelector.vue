<script setup lang="ts">
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

const emit = defineEmits(['closeModal', 'newSelected'])
let { selected, disabled, options } = defineProps({
    selected: Object,
    disabled: Boolean,
    options: null
})
function newSelect(newAddress: string) {
    emit('newSelected', newAddress)
}
</script>

<template>
    <Listbox v-model="selected" :disabled="disabled">
        <div class="relative mt-1 text-gray-500">
            <ListboxButton v-slot="{ open }"
                class="flex flex-row items-center space-x-8 relative w-full py-3 px-4 justify-between bg-oswapGreen-light bg-opacity-10  rounded-lg  sm:text-sm">
                <div class="flex flex-col space-y-1 justify-start" v-if="selected?.address">
                    <span class="text-left truncate">{{ selected?.name }}</span>
                    <span class="text-left truncate text-xxs font-bold tracking-wider">( {{ selected?.address }}
                        )</span>
                </div>
                <span v-else>
                    Select a validator
                </span>
                <template v-if="options?.length > 0 && !disabled">
                    <i :class="[open ? 'las la-angle-up' : 'las la-angle-down', 'text-oswapBlue-light']"></i>
                </template>
            </ListboxButton>
            <transition v-if="options?.length > 0" leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions
                    class="absolute w-full py-3 px-4 my-1 text-base bg-oswapDark flex-col flex  max-h-60 sm:text-sm overflow-auto">
                    <ListboxOption @click="newSelect(validator.address)" class="py-3 px-4" v-for="validator in options"
                        :key="validator.address" :value="validator" as="template">
                        <div class=" cursor-pointer hover:text-oswapBlue-light ">
                            <div class="flex flex-col space-y-1 justify-start">
                                <span class="text-left truncate">{{ validator?.name }}</span>
                                <span class="text-left truncate text-xxs font-bold tracking-wider">
                                    ( {{
                                            validator?.address
                                    }} )
                                </span>
                            </div>
                        </div>
                    </ListboxOption>
                </ListboxOptions>
            </transition>
        </div>
    </Listbox>
</template>