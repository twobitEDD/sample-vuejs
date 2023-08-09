<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { onClickOutside } from '@vueuse/core'
import { useValidatorsStore } from '@/stores/validators';
import ValidatorLogo from '@/components/ValidatorLogo.vue'
import { escapeRegExp } from '@/utility/functions';
const { getFiltered } = storeToRefs(useValidatorsStore())
let filter = ref('');
let isDropdownOpen = ref(false);
let { placeholder } = withDefaults(defineProps<{ placeholder: string }>(), {
    placeholder: 'Search Validators...',
})
const validatorStore = useValidatorsStore()
const validatorsFiltered = computed(() => {
    return getFiltered.value.filter((element) =>
        element.address.match(new RegExp(escapeRegExp(filter.value), 'i')) ||
        element.name.match(new RegExp(escapeRegExp(filter.value), 'i')) ||
        !filter.value
    )
})
watch(() => filter.value, () => {
    validatorStore.setfilterValidators(filter.value)
});

const target = ref(null)
onClickOutside(target, (event) => {
    if (isDropdownOpen.value) {
        isDropdownOpen.value = false
    }
})
</script>

<template>
    <div class="flex flex-none flex-col" ref="target">
        <div class="flex flex-col relative lg:text-xl p-4 text-sm rounded-full bg-white dark:bg-slightDark shadow-md justify-center"
            :class="isDropdownOpen ? 'rounded-b-none rounded-t-3xl shadow-transparent' : ''">
            <input
                class="outline-none border-none ring-transparent bg-transparent placeholder:text-base placeholder:opacity-70 dark:text-oswapGreen-light"
                :placeholder="placeholder" type="text" v-model="filter" @click="isDropdownOpen = true" />
            <div class="absolute right-5 items-center justify-center">
                <i class="text-oswapGreen-light cursor-pointer"
                    :class="isDropdownOpen || filter ? 'las la-times' : 'las la-search'"
                    @click="isDropdownOpen || filter ? (isDropdownOpen = false, filter = '') : isDropdownOpen = true"></i>
            </div>
        </div>
        <div class="relative bg-transparent" v-if="isDropdownOpen">
            <div
                class="absolute z-150 w-full flex-col flex rounded-b-3xl  shadow-md bg-white dark:bg-slightDark py-2 px-4 max-h-540 scrollbar-thin scrollbar-thumb-oswapGreen-light scrollbar-track-gray-300">

                <div class="flex flex-col space-y-2 my-4">
                    <router-link v-for="validator in validatorsFiltered" :key="validator.address"
                        :to="'/validators/' + validator.address"
                        class="flex flex-1 items-center space-x-3 hover:bg-gray-200 dark:hover:bg-oswapDark-gray px-3 py-1 rounded-lg"
                        @click="isDropdownOpen = false">
                        <ValidatorLogo logoClass="rounded-full  w-7 h-7 " :pixeles="32" :address="validator.address"
                            :has-logo="validator.hasLogo" />
                        <span class="text-sm font-medium">{{ validator.name }}</span>
                    </router-link>
                </div>
                <span class="text-sm font-medium text-oswapBlue-dark dark:text-oswapGreen"
                    v-if="validatorsFiltered.length === 0">No results</span>
            </div>
        </div>
    </div>
</template>
