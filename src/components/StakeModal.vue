<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { utils } from 'ethers'
import numeral from 'numeral'
import MiniLoader from '@/components/MiniLoader.vue'
import ValidatorSelector from '@/components/ValidatorSelector.vue'
import InputValidation from '@/components/InputValidation.vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from '@headlessui/vue'
import { computed, Ref, ref } from 'vue';
import { useWalletStore } from '@/stores/wallet';
const { theme } = storeToRefs(useGlobalStore())
const { getReDelegated, availableBalance } = storeToRefs(useWalletStore())
const emit = defineEmits(['closeModal', 'SuccessStake'])
const { modalOpen, validator } = defineProps({
    modalOpen: Boolean,
    validator: null,
})
let error: Ref<any> = ref([])
let input = ref('')
let staking = ref(false)
const amountAvailable = computed(() => {
    return (parseFloat(availableBalance.value) + parseFloat(getReDelegated.value)).toString()
})
function close() {
    emit('closeModal')
}
function setMax() {
    const totalAmount = parseFloat(amountAvailable.value)
    if (totalAmount > 0.5) {
        input.value = (totalAmount - 0.5).toString()
    } else {
        input.value = (totalAmount).toString()
    }
}
async function stake() {
    if (validator) {
        const floatValue = parseFloat(input.value)
        if (floatValue < 100) {
            error.value = [`Amount must be more than 100`]
        } else {
            if (floatValue > parseFloat(amountAvailable.value)) {
                error.value = [`Amount must be less than ${amountAvailable.value}`]
            } else {
                error.value = []
                staking.value = true
                const walletStore = useWalletStore()
                await walletStore.delegate(validator.address, input.value)
                staking.value = false
                emit('SuccessStake')
                input.value = ''
            }
        }
    }

}
</script>

<template>
    <TransitionRoot appear :show="modalOpen" as="template" :class="theme">
        <Dialog as="div" @close="close()">
            <div class="fixed inset-0 z-10 overflow-y-auto text-gray-700 dark:text-white">
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                        enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100"
                        leave-to="opacity-0">
                        <DialogOverlay class="fixed inset-0" />
                    </TransitionChild>

                    <span class="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <div
                            class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-r from-gray-300 to-slightGray dark:from-oswapDark-gray dark:to-slightDark shadow-xl rounded-2xl">
                            <button @click="close()" class="absolute right-3 top-3 outline-none">
                                <i class="las la-times "></i>
                            </button>
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 ">
                                Stake
                            </DialogTitle>
                            <div class="mt-2">
                                <p class="text-xs ">
                                    It will take until the end of current epoch to unlock your tokens after staking them
                                    and the tokens are still slashable if the validator behaves maliciously.
                                </p>
                            </div>

                            <div class="mt-4 flex flex-col space-y-2">
                                <span>
                                    Currently available to stake : {{
                                            numeral(amountAvailable).format('0[.]00')
                                    }} ONEs
                                </span>
                                <ValidatorSelector :disabled="true" :selected="validator" />
                                <div class="flex flex-row">
                                    <div class="flex flex-1">
                                        <InputValidation class="w-full" @catch-input="input = $event"
                                            :modelValue="input" label="Amount of One" :inputErrors="error" />
                                    </div>
                                    <div class="flex flex-none ml-4">
                                        <button class="flex flex-none justify-center items-center" @click="setMax()">Set
                                            Max</button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-1 justify-center mt-4">
                                <button @click="!staking ? stake() : ''"
                                    :class="staking ? 'cursor-not-allowed select-none' : ''"
                                    class="px-4 py-2 rounded-lg bg-oswapBlue-light outline-none">
                                    <span v-if="!staking">Stake</span>
                                    <MiniLoader v-else>
                                    </MiniLoader>
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>