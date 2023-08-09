<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Loader from '@/components/Loader.vue'
import Address from '@/components/Address.vue'
import ValidatorLogo from '@/components/ValidatorLogo.vue'
import { useValidatorsStore } from '@/stores/validators';
import { useGlobalStore } from '@/stores/global'

const { getValidatorPagination, validatorPageIndex, validator, getLoading, getAmountOfPagesValidator } = storeToRefs(useValidatorsStore())
const { getNetwork } = storeToRefs(useGlobalStore())
const validatorsStore = useValidatorsStore()
</script>

<template>
    <div class="flex flex-col flex-1 space-y-4">
        <div class="overflow-x-auto">
            <div class="inline-block min-w-full">
                <div class="overflow-hidden shadow-md border border-slightGray dark:border-slightDark rounded-lg">
                    <table class="min-w-full">
                        <thead class="from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r">
                            <tr
                                class="text-sm font-bold tracking-wider text-gray-800 uppercase dark:text-gray-300 text-center">
                                <th scope="col" class="py-3 px-6 table-cell">
                                    <div class="flex flex-none items-center select-none opacity-100 hover:opacity-80">
                                        Address
                                    </div>
                                </th>

                                <th scope="col" class="lg:py-4 lg:px-6 md:py-3 md:px-6 py-1.5 px-1">
                                    <div
                                        class="flex flex-none items-center  justify-center select-none opacity-100 hover:opacity-80">
                                        Amount

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
                                v-for="(delegator, index) in getValidatorPagination"
                                :key="delegator['delegator-address']">

                                <td
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-4 text-xs md:text-sm lg:text-sm text-gray-500 dark:text-gray-300">
                                    <div class="flex flex-none space-x-2 items-center justify-start">
                                        <div class="flex flex-none">
                                            <ValidatorLogo logoClass="rounded-full  w-4 h-4 " :pixeles="16"
                                                :address="delegator['delegator-address']" :has-logo="false" />
                                        </div>
                                        <a class="text-oswapBlue-light"
                                            :href="getNetwork?.explorer + `address/${delegator['delegator-address']}`"
                                            target="_blank">
                                            <Address :address="delegator['delegator-address']" class="lg:hidden flex" />
                                            <span class="hidden lg:flex">
                                                {{
                                                        delegator['delegator-address']
                                                }}
                                            </span>
                                        </a>
                                        <span class="text-oswapGreen-dark text-xs ml-2"
                                            v-if="delegator['delegator-address'] === validator.address">SELF</span>
                                    </div>
                                </td>
                                <td
                                    class="lg:py-4 lg:px-6 md:py-4 md:px-6 py-2 px-1 text-xs md:text-sm lg:text-sm whitespace-nowrap ">
                                    {{ delegator.amount }} <span class="text-xs">({{ delegator?.percentage }})</span>
                                </td>

                            </tr>
                            <tr
                                class="from-slightGray dark:from-oswapDark-gray dark:to-slightDark bg-gradient-to-r font-semibold text-center">
                                <td colspan="100%"
                                    class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div class="flex flex-1 justify-center items-center">
                                        <i @click="validatorsStore.prevValidatorPage()"
                                            :class="validatorPageIndex === 0 ? 'opacity-50 cursor-default' : ''"
                                            class="las la-arrow-left mr-2 text-xl text-oswapBlue dark:text-oswapBlue-light cursor-pointer"></i>
                                        Page {{ validatorPageIndex + 1 }} of {{ getAmountOfPagesValidator }}
                                        <i :class="validatorPageIndex + 1 === getAmountOfPagesValidator ? 'opacity-50 cursor-default' : ''"
                                            @click="validatorsStore.nextValidatorPage()"
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