<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import ValidatorLogo from '@/components/ValidatorLogo.vue';
import UnstakeModal from '@/components/UnstakeModal.vue';
import StakeModal from '@/components/StakeModal.vue';
import { Delegation } from '@/utility/delegations.interface';
import CurrencySymbol from '@/components/CurrencySymbol.vue';
import Popper from "vue3-popper";
import numeral from 'numeral';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useWalletStore } from '@/stores/wallet';
interface Props {
    Args: { delegated: Delegation };
}
const showProjected = ref(false)
const isOpenUnstake = ref(false)
const isOpenStake = ref(false)
const { epoch, onePrice, currencyDisplay } = storeToRefs(useGlobalStore())
const props = withDefaults(defineProps<Props>(), {});

function getUndelegationEpoch(undelEpoch: number) {
    return undelEpoch - epoch.value + 7
}
const delegatedAmount = computed(() => {
    return props.Args.delegated.amount / (10 ** 18)
})
const rewardsAmount = computed(() => {
    return props.Args.delegated.reward / (10 ** 18)
})
const getAmountsUndelegated = computed(() => {
    const amount = props.Args.delegated.Undelegations.reduce((previousValue, current) => current.Amount + previousValue, 0)
    return numeral((amount / (10 ** 18)).toString()).format('0[.]0000')
})
const projected = computed(() => {
    return props.Args.delegated.validator_info.apr * 100 * delegatedAmount.value / 365
})
function unstakedSuccess() {
    const walletStore = useWalletStore()
    walletStore.loadDelegations()
}
function stakedSuccess() {
    const walletStore = useWalletStore()
    walletStore.loadDelegations()
    walletStore.loadOneBalance()
}
</script>

<template>
    <div
        class="flex flex-none p-4 shadow-xl rounded-md bg-gray-300 dark:bg-oswapDark-dark flex-col space-y-2 w-96 m-2 font-medium">
        <UnstakeModal @success-unstake="unstakedSuccess()"
            :validator-address="props.Args.delegated.validator_info.address" :disabled="true" :modalOpen="isOpenUnstake"
            @close-modal="isOpenUnstake = false" />
        <StakeModal @success-stake="stakedSuccess()" :validator="props.Args.delegated.validator_info"
            :modalOpen="isOpenStake" @close-modal="isOpenStake = false" />

        <div class="flex flex-1 justify-between items-center">
            <div
                class="flex flex-none p-3 rounded-full justify-center items-center shadow-light-level dark:shadow-dark-level">
                <ValidatorLogo :pixeles="28" :address="props.Args.delegated.validator_info.address"
                    :has-logo="props.Args.delegated.validator_info.hasLogo" />
            </div>
            <span class="text-oswapGreen-dark">
                {{
                        numeral(props.Args.delegated.validator_info.apr).format('%0[.]00')
                }}
            </span>
        </div>
        <div class="flex flex-1 flex-col">
            <router-link :to="`/validators/${props.Args.delegated.validator_info.address}`">{{
                    props.Args.delegated.validator_info.name
            }}</router-link>
            <span class="text-xs"
                :class="props.Args.delegated.validator_info.active ? ' text-oswapGreen-dark' : 'text-red-600'">
                {{
                        props.Args.delegated.validator_info.active ? 'Elected' : 'Not Elected'
                }}
            </span>
        </div>
        <transition name="fade" mode="out-in">
            <div v-if="!showProjected">
                <div class="flex flex-none flex-col">
                    <span class="text-oswapBlue-dark">
                        Staked: {{
                                numeral(delegatedAmount).format('0[.]0000')
                        }}
                        <span v-if="onePrice[currencyDisplay] !== 0">
                            /
                            <CurrencySymbol />{{
                                    numeral((delegatedAmount) *
                                        onePrice[currencyDisplay]).format('0[.]0000')
                            }}
                        </span>
                    </span>
                    <div class="flex flex-none space-x-2 items-center">
                        <span class="text-oswapBlue-dark">
                            Undelegated: {{
                                    getAmountsUndelegated
                            }}
                            <span v-if="onePrice[currencyDisplay] !== 0">
                                /
                                <CurrencySymbol />{{
                                        numeral(parseFloat(getAmountsUndelegated) *
                                            onePrice[currencyDisplay]).format('0[.]0000')
                                }}
                            </span>
                        </span>
                        <Popper hover>
                            <div class="flex flex-none relative h-6 items-center"
                                v-if="props.Args.delegated.Undelegations.length > 0">
                                <i class="las la-info-circle text-oswapBlue-dark absolute text-2xl"></i>
                            </div>

                            <template #content>
                                <div class="flex flex-none flex-col px-2 text-sm space-y-1">
                                    <span class="font-medium">Undelegations:</span>
                                    <div class="flex flex-none space-x-2"
                                        v-for="undel of props.Args.delegated.Undelegations">
                                        <span>
                                            - {{ numeral(undel.Amount / (10 ** 18)).format('0[.]0000')
                                            }}
                                            ONEs
                                        </span>
                                        <span>
                                            by epoch {{ epoch + getUndelegationEpoch(undel.Epoch) }} ({{
                                                    getUndelegationEpoch(undel.Epoch)
                                            }} left)
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </Popper>
                    </div>
                    <span class="text-oswapGreen-dark">
                        Rewards: {{
                                numeral(rewardsAmount).format('0[.]0000')
                        }}
                        <span v-if="onePrice[currencyDisplay] !== 0">
                            /
                            <CurrencySymbol />{{
                                    numeral((rewardsAmount) *
                                        onePrice[currencyDisplay]).format('0[.]0000')
                            }}
                        </span>
                    </span>
                </div>
                <div class="flex flex-1 justify-end space-x-2 text-white mt-2">
                    <button @click="showProjected = true"
                        class="rounded-md bg-slightGray text-slightDark dark:text-white dark:bg-slightDark px-2 py-1">Projected</button>
                    <button v-if="props.Args.delegated.amount > 0" @click="isOpenUnstake = true"
                        class="rounded-md bg-oswapBlue-light px-2 py-1">Unstake</button>
                    <button class="rounded-md bg-oswapGreen-dark px-2 py-1" @click="isOpenStake = true">Stake</button>
                </div>
            </div>
            <div class="flex flex-none relative" v-else>
                <div class="flex flex-col space-y-2">
                    <span>
                        Daily: {{ numeral(projected).format('0[.]00') }}
                        <span v-if="onePrice[currencyDisplay] !== 0">
                            /
                            <CurrencySymbol />{{
                                    numeral(projected * onePrice[currencyDisplay]).format('0[.]0000')
                            }}
                        </span>
                    </span>
                    <span>
                        Weekly: {{ numeral(projected * 7).format('0[.]00') }}
                        <span v-if="onePrice[currencyDisplay] !== 0">
                            /
                            <CurrencySymbol />{{
                                    numeral(projected * 7 * onePrice[currencyDisplay]).format('0[.]0000')
                            }}
                        </span>
                    </span>
                    <span>
                        Monthly: {{ numeral(projected * 7 * 4).format('0[.]00') }}
                        <span v-if="onePrice[currencyDisplay] !== 0">
                            /
                            <CurrencySymbol />{{
                                    numeral(projected * 7 * 4 * onePrice[currencyDisplay]).format('0[.]0000')
                            }}
                        </span>
                    </span>
                    <span>
                        Yearly: {{ numeral(projected * 7 * 4 * 12).format('0[.]00') }}
                        <span v-if="onePrice[currencyDisplay] !== 0">
                            /
                            <CurrencySymbol />{{
                                    numeral(projected * 7 * 4 * 12 * onePrice[currencyDisplay]).format('0[.]0000')
                            }}
                        </span>
                    </span>
                </div>
                <button class="absolute bottom-0 right-0" @click="showProjected = false">
                    <i class="las la-arrow-left text-2xl text-oswapBlue-dark"></i>
                </button>
            </div>
        </transition>
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>