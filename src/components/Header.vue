<script setup lang="ts">
import OpenSwapLogo from '@/assets/logo.png'
import OpenSwapIcon from '@/assets/oswap_asset.png'
import HarmonyLogo from '@/assets/one_logo.png'
import numeral from 'numeral'
import Popper from "vue3-popper";
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/stores/wallet';
const { effectiveStake, supply, totalStaked, slots, amountBlocks, onePrice, currencyDisplay } = storeToRefs(useGlobalStore())
const { isSigned } = storeToRefs(useWalletStore())
const routes = [
    {
        icon: 'las la-user',
        name: 'Portfolio',
        url: '/portfolio'
    },
    {
        icon: 'las la-users-cog',
        name: 'Validators',
        url: '/validators'
    },
    {
        icon: 'las la-question',
        name: 'How does it work?',
        url: '/how-it-works'
    }
]
const walletStore = useWalletStore()
const globalStore = useGlobalStore()
if (globalStore.autoConnect) {
    walletStore.connect()
}
</script>

<template>
    <header class="max-w-screen-xl mx-auto w-full flex justify-between h-14 py-9 xl:px-0 px-3 items-center">
        <router-link to="/">
            <div class="ss:hidden xs:flex flex-none">
                <img alt="OpenSwap" :src="OpenSwapLogo" class="ss:h-6 xs:h-10" />
            </div>
            <div class="ss:flex xs:hidden flex-none">
                <img alt="OpenSwap" :src="OpenSwapIcon" class="ss:h-6" />
            </div>
        </router-link>
        <div class="flex items-center lg:space-x-0 space-x-1 text-gray-500 dark:text-oswapGreen st5">
            <router-link v-for="route in routes" :to="route.url"
                class="flex items-center space-x-2 p-2 px-1 md:px-3 rounded-lg group focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20">
                <i :class="route.icon" class="text-xl group-hover:text-oswapGreen"></i>
                <p class="text-sm hidden md:block group-hover:text-oswapBlue-light">{{ route.name }}</p>
            </router-link>
            <div class="flex flex-none">
                <Popper hover>
                    <div class="flex flex-none p-1 shadow-light-level dark:shadow-dark-level rounded-full">
                        <img class="w-6 h-6" :src="HarmonyLogo" />
                    </div>
                    <template #content>
                        <div class="flex flex-none flex-col px-2 text-sm space-y-1">
                            <div class="flex flex-none space-x-1" v-if="onePrice[currencyDisplay] !== 0">
                                <span>Token Price:</span>
                                <span>{{ numeral(onePrice[currencyDisplay]).format('0[.]00') }}</span>
                            </div>
                            <div class="flex flex-none space-x-1">
                                <span>Total Supply:</span>
                                <span>{{ supply }}</span>
                            </div>
                            <div class="flex flex-none space-x-1">
                                <span>Median Stake:</span>
                                <span>{{ effectiveStake }}</span>
                            </div>
                            <div class="flex flex-none space-x-1">
                                <span>Current Block Height:</span>
                                <span>{{ amountBlocks }}</span>
                            </div>
                            <div class="flex flex-none space-x-1">
                                <span>Number of Slots:</span>
                                <span>{{ slots }}</span>
                            </div>
                            <div class="flex flex-none space-x-1">
                                <span>Total Staked:</span>
                                <span>{{ totalStaked }}</span>
                            </div>
                        </div>
                    </template>
                </Popper>
            </div>
            <div class="flex flex-none pl-4 pt-1">
                <!-- Wallet disconnected state styling -->
                <div v-if="!isSigned" @click="walletStore.connect()"
                    class="flex st5 lg:w-44 items-center text-gray-500 space-x-1 lg:pr-2 p-1 rounded-full dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-200 hover:bg-gray-100 cursor-pointer ring-1 ring-black ring-opacity-5">
                    <div
                        class="flex flex-none relative h-8 w-8 items-center justify-center st5 bg-gray-200 dark:bg-oswapDark-gray rounded-full">
                        <i class="absolute las la-wallet text-xl st5"></i>
                    </div>
                    <div class="flex st5 w-full items-center p-1 text-sm justify-center">
                        <p class="mdd:flex hidden">Connect Wallet</p>
                        <i class="las la-unlink text-xl flex lg:hidden pr-1"></i>
                    </div>
                </div>

                <!-- Wallet connected state styling -->
                <div v-if="isSigned"
                    class="flex st5 lg:w-44 items-center space-x-1 lg:pr-2 p-1 rounded-full bg-opacity-20 hover:bg-opacity-50 cursor-pointer border-oswapGreen-dark border glow-oswapGreen-light-md hover:bg-white dark:hover:bg-gray-700">
                    <div
                        class="flex flex-none relative h-8 w-8 items-center justify-center st5 bg-gray-200 dark:bg-oswapDark-gray rounded-full">
                        <i class="absolute las la-wallet text-xl st5"></i>
                    </div>
                    <div @click="walletStore.disconnect()"
                        class="flex w-full items-center p-1 text-sm justify-center dark:text-oswapGreen">
                        <p class="lg:flex hidden">Wallet Connected</p>
                        <i class="las la-link text-xl flex lg:hidden pr-1"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>