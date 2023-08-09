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
import { useWalletStore } from '@/stores/wallet';
import { computed, Ref, ref } from 'vue';
const { theme } = storeToRefs(useGlobalStore())
const { getValidatorsFromStaking } = storeToRefs(useWalletStore())

const emit = defineEmits(['closeModal', 'SuccessUnstake'])
const { modalOpen, validatorAddress, disabled } = defineProps({
    modalOpen: Boolean,
    validatorAddress: String,
    disabled: Boolean
})
let refValidatorAddress = ref(validatorAddress)
let error: Ref<any> = ref([])
let input = ref('')
let unstaking = ref(false)
const walletStore = useWalletStore()
const validatorSelected = computed(() => {
    if (!refValidatorAddress.value) {
        return null
    }
    return walletStore.getValidatorFromStaking(refValidatorAddress.value)
})
function close() {
    emit('closeModal')
}
function setMax(max: string) {
    input.value = max
}
async function unstake() {
    if (validatorSelected.value) {
        const floatValue = parseFloat(input.value)
        if (floatValue > (validatorSelected.value.amount / (10 ** 18)) || floatValue < 0.000001) {
            error.value = [`Amount must be between 0.000001 and ${(validatorSelected.value.amount / (10 ** 18))}`]
        } else {
            error.value = []
            unstaking.value = true
            await walletStore.undelegate(validatorSelected.value.validator_address, input.value)
            unstaking.value = false
            emit('SuccessUnstake')
            input.value = ''
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
                                Unstake
                            </DialogTitle>
                            <div class="mt-2">
                                <p class="text-xs ">
                                    Unstaking takes effect at the end of this epoch and cannot be undone. Please make
                                    sure you understand the rules of staking
                                </p>
                            </div>

                            <div class="mt-4 flex flex-col space-y-2">
                                <span v-if="validatorSelected">
                                    Currently Staked: {{
                                            numeral((validatorSelected.amount / (10 ** 18))).format('0[.]00')
                                    }} ONEs
                                </span>
                                <ValidatorSelector @newSelected="refValidatorAddress = $event"
                                    :options="getValidatorsFromStaking" :disabled="disabled"
                                    :selected="validatorSelected?.validator_info" />
                                <div class="flex flex-row">
                                    <div class="flex flex-1">
                                        <InputValidation class="w-full" @catch-input="input = $event"
                                            :modelValue="input" label="Amount of One" :inputErrors="error" />
                                    </div>
                                    <div class="flex flex-none ml-4">
                                        <button class="flex flex-none justify-center items-center"
                                            @click="setMax(((validatorSelected?.amount || 0) / (10 ** 18)).toString())">Set
                                            Max</button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-1 justify-center mt-4">
                                <button @click="!unstaking ? unstake() : ''"
                                    :class="unstaking ? 'cursor-not-allowed select-none' : ''"
                                    class="px-4 py-2 rounded-lg bg-oswapBlue-light outline-none">
                                    <span v-if="!unstaking">Unstake</span>
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