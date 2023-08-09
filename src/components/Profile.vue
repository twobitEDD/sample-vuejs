<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/vue'
import ValidatorLogo from '@/components/ValidatorLogo.vue'
import MiniLoader from '@/components/MiniLoader.vue'
import UnstakeModal from '@/components/UnstakeModal.vue'
import CurrencySymbol from '@/components/CurrencySymbol.vue';
import { storeToRefs } from 'pinia';
import numeral from 'numeral'
import Address from '@/components/Address.vue'
import Allocation from '@/components/Allocation.vue';
import { useGlobalStore } from '@/stores/global';
import { ref } from 'vue';
const walletStore = useWalletStore()
const globalStore = useGlobalStore()
const { availableBalance, userAddress, getTotalStaked, getTotalRewards, getPendingUndelegated } = storeToRefs(useWalletStore())
const { onePrice, profileDetails, currencyDisplay } = storeToRefs(useGlobalStore())
let isOpen = ref(false)
let isClaiming = ref(false)
interface Profile {
    showDetailButton?: boolean;
}
const { showDetailButton } = withDefaults(defineProps<Profile>(), {
    showDetailButton: false
})
function unstakedSuccess() {
    walletStore.loadDelegations()
    isOpen.value = false
}
async function claim() {
    isClaiming.value = true
    try {
        await walletStore.claimRewards()
        walletStore.loadOneBalance()
        walletStore.loadDelegations()
    } catch (error) {
    }
    isClaiming.value = false
}
</script>

<template>
    <div
        class="flex flex-1 p-4 justify-center items-center flex-col space-y-1 rounded-lg bg-gradient-to-r from-gray-300 to-slightGray dark:from-oswapDark-gray dark:to-slightDark shadow-lg relative">

        <Disclosure :defaultOpen="profileDetails" v-slot="{ open }">
            <DisclosureButton class="w-full" v-if="!open" @click="globalStore.changeProfileDetails()">
                <div class="flex flex-1 justify-between items-center">
                    <div class="flex flex-1 font-medium text-lg justify-center ">
                        <p class="text-oswapBlue mx-2">{{ numeral(getTotalStaked).format('0[.]00')
                        }}
                            <template v-if="onePrice[currencyDisplay] !== 0">
                                (
                                <CurrencySymbol />{{
                                        numeral(parseFloat(getTotalStaked) *
                                            onePrice[currencyDisplay]).format('0[.]0000')
                                }})
                            </template>
                        </p>
                    </div>
                    <div class="flex flex-none absolute right-4">
                        <span class="text-sm text-oswapGreen-light">See More</span>
                    </div>
                </div>
            </DisclosureButton>

            <!-- Use the built-in <transition> component to add transitions. -->
            <transition enter-active-class='animate__animated animate__fadeIn'>
                <DisclosurePanel class="w-full" v-slot="{ close }">
                    <div class="flex flex-1 justify-center items-center flex-col space-y-1  relative">
                        <UnstakeModal @success-unstake="unstakedSuccess()" :disabled="false" :modalOpen="isOpen"
                            @close-modal="isOpen = false" />
                        <div class="absolute top-4 right-4 flex space-x-2">
                            <button @click="walletStore.loadDelegations(); walletStore.loadOneBalance()">
                                <i class="las la-sync text-oswapGreen-light text-lg"></i>
                            </button>
                            <button @click="globalStore.changeProfileDetails(); close()">
                                <i class="las la-times text-gray-600 dark:text-gray-400 text-lg"></i>
                            </button>
                        </div>
                        <div v-if="userAddress"
                            class="flex flex-none p-3 rounded-full justify-center items-center shadow-light-level dark:shadow-dark-level">
                            <ValidatorLogo :pixeles="28" :address="userAddress" :has-logo="false" />
                        </div>
                        <div v-if="userAddress" class="flex flex-none">
                            <Address :address="userAddress" />
                        </div>
                        <div class="flex flex-1 flex-wrap justify-center items-center">
                            <div class="flex flex-none rounded-full p-1 shadow-light-depth dark:shadow-dark-depth m-1">
                                <div
                                    class="flex flex-col space-y-2 flex-none rounded-full shadow-light-level dark:shadow-dark-level p-3">
                                    <div
                                        class="flex flex-col space-y-2 rounded-full shadow-light-depth dark:shadow-dark-depth h-32 w-32 justify-center items-center">
                                        <div
                                            class="flex flex-none flex-col items-center justify-center text-oswapBlue-dark font-medium">
                                            <span class="text-xs dark:text-white text-black">Staked</span>
                                            <span class="pt-1">{{ numeral(getTotalStaked).format('0[.]00') }}</span>
                                            <span v-if="onePrice[currencyDisplay] !== 0">
                                                <CurrencySymbol />{{
                                                        numeral(parseFloat(getTotalStaked) *
                                                            onePrice[currencyDisplay]).format('0[.]0000')
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="getPendingUndelegated !== '0.0'"
                                class="flex flex-none rounded-full p-1 shadow-light-depth dark:shadow-dark-depth m-1">
                                <div
                                    class="flex flex-col space-y-2 flex-none rounded-full shadow-light-level dark:shadow-dark-level p-3">
                                    <div
                                        class="flex flex-col space-y-2 rounded-full shadow-light-depth dark:shadow-dark-depth h-32 w-32 justify-center items-center">
                                        <div
                                            class="flex flex-none flex-col items-center justify-center text-oswapBlue-dark font-medium">
                                            <span class="text-xs dark:text-white text-black">Undelegated</span>
                                            <span class="pt-1">{{ numeral(getPendingUndelegated).format('0[.]00')
                                            }}</span>
                                            <span v-if="onePrice[currencyDisplay] !== 0">
                                                <CurrencySymbol />{{
                                                        numeral(parseFloat(getPendingUndelegated) *
                                                            onePrice[currencyDisplay]).format('0[.]0000')
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-none rounded-full p-1 shadow-light-depth dark:shadow-dark-depth m-1">
                                <div
                                    class="flex flex-col space-y-2 flex-none rounded-full shadow-light-level dark:shadow-dark-level p-3">
                                    <div
                                        class="flex flex-col space-y-2 rounded-full shadow-light-depth dark:shadow-dark-depth h-32 w-32 justify-center items-center">
                                        <div
                                            class="flex flex-none flex-col items-center justify-center text-oswapGreen-dark font-medium">
                                            <span class="text-xs dark:text-white text-black">Rewards</span>
                                            <span class="pt-1">{{ numeral(getTotalRewards).format('0[.]00') }}</span>
                                            <span v-if="onePrice[currencyDisplay] !== 0">
                                                <CurrencySymbol />{{
                                                        numeral(parseFloat(getTotalRewards) *
                                                            onePrice[currencyDisplay]).format('0[.]0000')
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-none rounded-full p-1 shadow-light-depth dark:shadow-dark-depth m-1">
                                <div
                                    class="flex flex-col space-y-2 flex-none rounded-full shadow-light-level dark:shadow-dark-level p-3">
                                    <div
                                        class="flex flex-col space-y-2 rounded-full shadow-light-depth dark:shadow-dark-depth h-32 w-32 justify-center items-center">
                                        <div
                                            class="flex flex-none flex-col items-center justify-center text-oswapGreen-light font-medium">
                                            <span class="text-xs dark:text-white text-black">Available</span>
                                            <span class="pt-1">{{ numeral(availableBalance).format('0[.]00') }}</span>
                                            <span v-if="onePrice[currencyDisplay] !== 0">
                                                <CurrencySymbol />{{
                                                        numeral(parseFloat(availableBalance) *
                                                            onePrice[currencyDisplay]).format('0[.]0000')
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-none">
                            <Allocation />
                        </div>
                        <div class="flex flex-none flex-wrap justify-center text-slightGray pt-2">
                            <div v-if="showDetailButton" class="flex flex-none p-2">
                                <router-link :to="'/portfolio/'">
                                    <button
                                        class="rounded-md bg-slightGray text-slightDark dark:text-white dark:bg-slightDark px-4 py-2">Delegations</button>
                                </router-link>
                            </div>
                            <div class="flex flex-none p-2">
                                <button @click="isOpen = true"
                                    class="rounded-md bg-oswapBlue-light px-4 py-2">Unstake</button>
                            </div>
                            <div class="flex flex-none p-2">
                                <button @click="isClaiming ? '' : claim()"
                                    :class="isClaiming ? 'select-none cursor-not-allowed' : ''"
                                    class="rounded-md bg-oswapGreen-dark px-4 py-2">
                                    <span v-if="!isClaiming">Claim Rewards</span>
                                    <MiniLoader v-else />
                                </button>
                            </div>
                        </div>
                    </div>
                </DisclosurePanel>
            </transition>
        </Disclosure>
    </div>


</template>