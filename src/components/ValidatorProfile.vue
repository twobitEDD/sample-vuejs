<script setup lang="ts">
import ValidatorLogo from '@/components/ValidatorLogo.vue'
import UnstakeModal from '@/components/UnstakeModal.vue'
import StakeModal from '@/components/StakeModal.vue';
import Popper from "vue3-popper";
import { utils } from 'ethers'
import { returnPercentage, returnAmounts } from '@/utility/functions'
import { storeToRefs } from 'pinia';
import Address from '@/components/Address.vue'
import { useValidatorsStore } from '@/stores/validators';
import Loader from '@/components/Loader.vue';
import { computed, ref } from '@vue/reactivity';
import { useWalletStore } from '@/stores/wallet';
const validatorStore = useValidatorsStore()
const { validator, loading } = storeToRefs(useValidatorsStore())
const { delegations } = storeToRefs(useWalletStore())
const isDelegating = computed(() => {
    return delegations.value.find((element) => element.validator_address === validator.value.address)
})
const isOpenUnstake = ref(false)
const isOpenStake = ref(false)
const keys = computed(() => {
    const shards: any = {}
    validator.value["bls-public-keys"]
        .map(e =>
            e[e.length - 1] >= "a"
                ? (e.charCodeAt(e.length - 1) - 87) % 4
                : parseInt(e[e.length - 1]) % 4
        ).forEach(
            shard => (shards[shard] = shards[shard] ? shards[shard] + 1 : 1)
        )
    return Object.keys(shards).map(key => ({
        shard: key,
        count: shards[key]
    }))
})

function unstakedSuccess() {
    const walletStore = useWalletStore()
    walletStore.loadDelegations()
    isOpenUnstake.value = false
}
function stakedSuccess() {
    const walletStore = useWalletStore()
    walletStore.loadDelegations()
    walletStore.loadOneBalance()
    isOpenStake.value = false
}
</script>

<template>
    <div
        class="flex flex-1 p-2 justify-center items-center flex-col space-y-1 rounded-lg bg-gradient-to-r from-gray-300 to-slightGray dark:from-oswapDark-gray dark:to-slightDark shadow-lg relative">
        <template v-if="!loading">
            <UnstakeModal @success-unstake="unstakedSuccess()" :modalOpen="isOpenUnstake" :disabled="true"
                @close-modal="isOpenUnstake = false" :validator-address="validator.address" />
            <StakeModal @success-stake="stakedSuccess()" :validator="validator" :modalOpen="isOpenStake"
                @close-modal="isOpenStake = false" />
            <div class="absolute top-4 right-4">
                <button @click="validatorStore.loadValidator(validator.address)">
                    <i class="las la-sync text-oswapGreen-light text-lg"></i>
                </button>
            </div>
            <div :class="validator.active ? ' text-oswapGreen-dark' : 'text-red-600'"
                class="flex flex-none flex-col space-y-2">
                <span class="uppercase text-sm">{{ validator.active ? 'Elected' : 'Not Elected' }}</span>
            </div>
            <div
                class="flex flex-none p-3 rounded-full justify-center items-center shadow-light-level dark:shadow-dark-level">
                <ValidatorLogo :pixeles="28" :address="validator.address" :has-logo="validator.hasLogo" />
            </div>
            <div class="flex flex-none">
                <Address :address="validator.address" />
            </div>
            <div class="flex flex-none space-x-1 items-center justify-center">
                <span class="capitalize text-2xl text-center">{{ validator.name }}</span>
                <Popper hover class="lg:flex hidden">
                    <i class="las la-info-circle text-oswapGreen-dark text-2xl"></i>
                    <template #content>
                        <div class="flex flex-1 justify-start space-x-2">
                            <div class="flex flex-1 justify-start flex-col space-y-2">
                                <span>Slots: {{ validator.active_nodes }}</span>
                                <span>Elected Nodes: {{ validator.elected_nodes }}</span>
                                <span v-for="key in keys">Shard {{ key.shard }}: {{ key.count }} slot<span
                                        v-if="key.count > 1">s</span></span>
                            </div>
                            <div class="flex flex-1 justify-start flex-col space-y-2">
                                <span>Lifetime Rewards: {{ validator.lifetime_reward_accumulated }}</span>
                                <span>Max Delegation: {{ validator['max-total-delegation'] }}</span>
                                <span>Min Self Delegation: {{ validator['min-self-delegation'] }}</span>
                            </div>
                        </div>
                    </template>
                </Popper>
            </div>
            <div class="flex flex-none max-w-screen-xl py-2 px-16">
                <span class="capitalize text-sm text-center">{{ validator.details }}</span>
            </div>
            <div class="flex flex-1 w-full lg:flex-row flex-col space-y-2 lg:space-y-0">
                <div class="flex flex-1 flex-col  items-center justify-center">
                    <div class="flex flex-none" v-if="validator.total_stake">
                        <span>Total Staked: {{
                                returnAmounts(utils.formatUnits(validator.total_stake, 18))
                        }}</span>
                    </div>
                    <div class="flex flex-none" v-if="validator.self_stake">
                        <span>Self Stake: {{ validator.self_stake }}</span>
                    </div>
                    <div class="flex flex-none">
                        <span>Uptime (AVG): {{ returnPercentage(validator.uptime_percentage) }}</span>
                    </div>
                    <div class="flex flex-none" v-if="validator.epoch_apr">
                        <span>Latest expected return: {{
                                returnPercentage(validator.last_apr)
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-1 flex-col items-center justify-center">
                    <div class="flex flex-none items-center space-x-2">
                        <span>
                            Website:
                        </span>
                        <a class="text-oswapGreen-dark opacity-75 hover:opacity-100"
                            :href="`https://${validator.website}`" v-if="validator.website"> {{
                                    validator.website
                            }}</a>
                    </div>
                    <div class="flex flex-none">
                        <span>Validator Since: Block #{{ validator['creation-height'] }}</span>
                    </div>
                    <div class="flex flex-none">
                        <span>Commission: {{ returnPercentage(validator.rate) }}</span>
                    </div>
                    <div class="flex flex-none">
                        <span>Max Commission Change: {{ returnPercentage(validator['max-change-rate']) }}</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-none flex-wrap justify-center text-slightGray pt-2">
                <div @click="isOpenStake = true" class="flex flex-none p-2">
                    <button class="rounded-md bg-oswapGreen-dark px-4 py-2">Stake</button>
                </div>
                <div @click="isOpenUnstake = true" class="flex flex-none p-2" v-if="isDelegating">
                    <button class="rounded-md bg-oswapBlue-light px-4 py-2">Unstake</button>
                </div>
            </div>
        </template>
        <template v-else>
            <Loader />
        </template>
    </div>
</template>