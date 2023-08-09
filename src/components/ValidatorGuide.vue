<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
const { notes } = storeToRefs(useGlobalStore())
const globalStore = useGlobalStore()
</script>

<template>
    <div class="flex flex-1 flex-col space-y-2">
        <div class="flex flex-none space-x-2 items-center">
            <span class="font-bold">Notes</span>
            <button @click="globalStore.changeNotes()" class=" px-1 py-0.5 rounded-full text-oswapGreen-light">
                <i :class="notes ? 'las la-minus' : 'las la-plus'"></i>
            </button>
        </div>
        <transition enter-active-class='animate__animated animate__fadeIn'>
            <div v-if="notes"
                class="flex flex-none flex-col text-oswapBlue dark:text-oswapGreen-dark font-semibold text-sm space-y-1">
                <div class="flex flex-none">
                    Status: If the validator has the status of not elected you
                    wont receive rewards
                </div>
                <div class="flex flex-none">
                    Commission: Is the percentage
                    of the amount of rewards taken by the validator as a fee (only affects the rewards).
                </div>
                <div class="flex flex-none">
                    Expected Return: If the percentage is higher than ~13% look closely if its elected and what are the
                    chances it keeps being elected over time,
                    usually not elected validators get a huge boost in apr when they get elected for the first time.
                </div>
                <div class="flex flex-none">Stake: It usually takes around ~5m ONEs to be elected consistently.</div>
            </div>
        </transition>
    </div>
</template>