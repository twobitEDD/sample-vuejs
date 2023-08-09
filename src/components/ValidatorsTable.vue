<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Loader from '@/components/Loader.vue'
import StateTag from '@/components/StateTag.vue'
import ValidatorLogo from '@/components/ValidatorLogo.vue'
import ValidatorGuide from '@/components/ValidatorGuide.vue'
import ValidatorsSearch from '@/components/ValidatorsSearch.vue'
import StakeModal from '@/components/StakeModal.vue';
import { returnPercentage, returnAmounts } from '@/utility/functions'
import { useValidatorsStore, Validators } from '@/stores/validators';
import { BigNumber } from 'ethers'
import { useWalletStore } from '@/stores/wallet'
import { ref } from 'vue'

const { direction, order, getPagination, pageIndex, getAmountOfPages, getLoading, showElected, showNonElected, validators } = storeToRefs(useValidatorsStore())
const SORT_FIELD = {
    STATUS: 'active',
    NAME: 'name',
    APR: 'apr',
    STAKE: 'total_stake',
    RATE: 'rate',
    UPTIME: 'uptime_percentage'
}
const isOpenStake = ref(false)
const stakeValidator = ref(null)
const validatorsStore = useValidatorsStore()
function amountOfElected(validators: Validators[]) {
    return validators.filter((validator) => validator.active === true).length
}
function amountOfNonElected(validators: Validators[]) {
    return validators.filter((validator) => validator.active === false).length
}
function activateStake(validator: any) {
    stakeValidator.value = validator
    isOpenStake.value = true
}
function stakedSuccess() {
    const walletStore = useWalletStore()
    walletStore.loadDelegations()
    walletStore.loadOneBalance()
    isOpenStake.value = false
}
</script>

<template>
    <div class="flex flex-col flex-1 space-y-4">
        <StakeModal v-if="stakeValidator" @success-stake="stakedSuccess()" :validator="stakeValidator"
            :modalOpen="isOpenStake" @close-modal="isOpenStake = false; stakeValidator = null" />
        <div class="flex flex-none">
            <ValidatorGuide />
        </div>
        <div class="flex flex-1 justify-between lg:flex-row flex-col space-y-4 lg:space-y-0">
            <div class="flex flex-none lg:flex-row flex-col space-y-4 lg:space-y-0 lg:space-x-4">
                <button
                    :class="showElected ? 'shadow-light-depth dark:shadow-dark-depth dark:text-oswapBlue-light' : 'shadow-light-level dark:shadow-dark-level dark:text-gray-400'"
                    class="px-3 py-2 rounded-lg text-sm" @click="validatorsStore.setShowElected(!showElected)">Show
                    elected
                    validators ({{ amountOfElected(validators) }})</button>
                <button
                    :class="showNonElected ? 'shadow-light-depth dark:shadow-dark-depth dark:text-oswapBlue-light' : 'shadow-light-level dark:shadow-dark-level dark:text-gray-400'"
                    class="px-3 py-2 rounded-lg text-sm"
                    @click="validatorsStore.setShowNonElected(!showNonElected)">Show
                    not elected validators ({{ amountOfNonElected(validators) }})</button>
            </div>
            <ValidatorsSearch />
        </div>
        <div class="overflow-x-auto">
            <div class="inline-block min-w-full">
                <div class="overflow-hidden shadow-md border border-slightGray dark:border-slightDark rounded-lg">
                    <table class="min-w-full">
                        <thead class="from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r">
                            <tr
                                class="text-sm font-bold tracking-wider text-gray-800 uppercase dark:text-gray-300 text-center">
                                <th scope="col" class="py-3 px-6 table-cell">
                                    <div class="flex flex-none items-center cursor-pointer select-none opacity-100 hover:opacity-80"
                                        @click="validatorsStore.setOrder(SORT_FIELD.STATUS, order !== SORT_FIELD.STATUS ? true : !direction)">
                                        Status
                                        <template v-if="order === SORT_FIELD.STATUS">
                                            <i class="las la-arrow-down text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="!direction"></i>
                                            <i class="las la-arrow-up text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="direction"></i>
                                        </template>
                                    </div>
                                </th>

                                <th scope="col" class="lg:py-4 lg:px-6 md:py-3 md:px-6 py-1.5 px-1">
                                    <div class="flex flex-none items-center cursor-pointer justify-center select-none opacity-100 hover:opacity-80"
                                        @click="validatorsStore.setOrder(SORT_FIELD.NAME, order !== SORT_FIELD.NAME ? true : !direction)">
                                        Name
                                        <template v-if="order === SORT_FIELD.NAME">
                                            <i class="las la-arrow-down text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="!direction"></i>
                                            <i class="las la-arrow-up text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="direction"></i>
                                        </template>
                                    </div>
                                </th>

                                <th scope="col"
                                    class="lg:py-4 lg:px-6 md:py-3 md:px-6 py-1.5 px-1 hidden md:table-cell">
                                    <div class="flex flex-none items-center cursor-pointer justify-center select-none opacity-100 hover:opacity-80"
                                        @click="validatorsStore.setOrder(SORT_FIELD.APR, order !== SORT_FIELD.APR ? true : !direction)">
                                        Expected Return
                                        <template v-if="order === SORT_FIELD.APR">
                                            <i class="las la-arrow-down text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="!direction"></i>
                                            <i class="las la-arrow-up text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="direction"></i>
                                        </template>
                                    </div>
                                </th>
                                <th scope="col"
                                    class="lg:py-4 lg:px-6 md:py-3 md:px-6 py-1.5 px-1 hidden md:table-cell">
                                    <div class="flex flex-none items-center cursor-pointer justify-center select-none opacity-100 hover:opacity-80"
                                        @click="validatorsStore.setOrder(SORT_FIELD.STAKE, order !== SORT_FIELD.STAKE ? true : !direction)">
                                        Stake
                                        <template v-if="order === SORT_FIELD.STAKE">
                                            <i class="las la-arrow-down text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="!direction"></i>
                                            <i class="las la-arrow-up text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="direction"></i>
                                        </template>
                                    </div>
                                </th>
                                <th scope="col"
                                    class="lg:py-4 lg:px-6 md:py-3 md:px-6 py-1.5 px-1 hidden md:table-cell">
                                    <div class="flex flex-none items-center cursor-pointer justify-center select-none opacity-100 hover:opacity-80"
                                        @click="validatorsStore.setOrder(SORT_FIELD.RATE, order !== SORT_FIELD.RATE ? true : !direction)">
                                        Commission
                                        <template v-if="order === SORT_FIELD.RATE">
                                            <i class="las la-arrow-down text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="!direction"></i>
                                            <i class="las la-arrow-up text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="direction"></i>
                                        </template>
                                    </div>
                                </th>
                                <th scope="col" class="lg:py-4 lg:px-6 md:py-3 md:px-6 py-1.5 px-1">
                                    <div class="flex flex-none items-center cursor-pointer justify-center select-none opacity-100 hover:opacity-80"
                                        @click="validatorsStore.setOrder(SORT_FIELD.UPTIME, order !== SORT_FIELD.UPTIME ? true : !direction)">
                                        Uptime
                                        <template v-if="order === SORT_FIELD.UPTIME">
                                            <i class="las la-arrow-down text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="!direction"></i>
                                            <i class="las la-arrow-up text-oswapGreen-light pl-1 dark:text-oswapGreen"
                                                v-if="direction"></i>
                                        </template>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="getLoading"
                                class="border-b from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r dark:border-gray-700 font-semibold text-center">
                                <td colspan="100%">
                                    <div class="flex flex-1 justify-center py-4">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>

                            <tr v-else
                                class="border-b from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r dark:border-gray-700 font-semibold text-center"
                                v-for="(validator, index) in getPagination" :key="validator.address">
                                <td class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-2 text-xs md:text-sm lg:text-sm">
                                    <div class="flex flex-none items-center justify-center md:justify-center space-x-0">
                                        <StateTag :state="validator.active" />
                                    </div>
                                </td>
                                <td
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-1 text-xs md:text-sm lg:text-sm text-gray-500 dark:text-gray-300">
                                    <div class="flex flex-none space-x-2 items-center justify-center md:justify-start">
                                        <div class="hidden md:flex flex-none">
                                            <ValidatorLogo logoClass="rounded-full p-1 w-12 h-12 " :pixeles="48"
                                                :address="validator.address" :has-logo="validator.hasLogo" />
                                        </div>
                                        <router-link :to="`/validators/${validator.address}`"
                                            class="validatorName text-left">{{
                                                    validator.name
                                            }}</router-link>
                                        <i @click="activateStake(validator)"
                                            class="las la-coins cursor-pointer text-2xl"></i>
                                    </div>
                                </td>
                                <td :class="validator.apr > 0.14 ? 'text-red-400 ' : ' text-gray-500 dark:text-gray-300'"
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-1 text-xs md:text-sm lg:text-sm whitespace-nowrap hidden md:table-cell">
                                    {{ returnPercentage(validator.apr) }}</td>
                                <td :class="BigNumber.from(validator.total_stake.toString().split('.')[0]).gt(BigNumber.from(5000000)) ? ' text-gray-500 dark:text-gray-300' : ' text-red-400'"
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-1 text-xs md:text-sm lg:text-sm whitespace-nowrap hidden md:table-cell">
                                    {{ returnAmounts(validator.total_stake) }}</td>
                                <td :class="parseFloat(validator.rate) > 0.15 ? 'text-red-400 ' : 'text-gray-500 dark:text-gray-300 '"
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-1 text-xs md:text-sm lg:text-sm whitespace-nowrap hidden md:table-cell">
                                    {{ returnPercentage(validator.rate) }}</td>
                                <td :class="parseFloat(validator.uptime_percentage) < 0.90 ? 'text-red-400 ' : 'text-gray-500 dark:text-gray-300 '"
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-1 text-xs md:text-sm lg:text-sm whitespace-nowrap">
                                    {{ returnPercentage(validator.uptime_percentage) }}</td>
                            </tr>
                            <tr
                                class="from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r font-semibold text-center">
                                <td colspan="100%"
                                    class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div class="flex flex-1 justify-center items-center">
                                        <i @click="validatorsStore.prevPage()"
                                            :class="pageIndex === 0 ? 'opacity-50 cursor-default' : ''"
                                            class="las la-arrow-left mr-2 text-xl text-oswapBlue dark:text-oswapBlue-light cursor-pointer"></i>
                                        Page {{ pageIndex + 1 }} of {{ getAmountOfPages }}
                                        <i :class="pageIndex + 1 === getAmountOfPages ? 'opacity-50 cursor-default' : ''"
                                            @click="validatorsStore.nextPage()"
                                            class="las la-arrow-right ml-2 text-xl text-oswapBlue dark:text-oswapBlue-light cursor-pointer"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.validatorName {
    word-break: break-all;
}
</style>