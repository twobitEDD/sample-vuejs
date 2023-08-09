<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
const { getWalletMode } = storeToRefs(useGlobalStore())
const globalStore = useGlobalStore()
</script>



<template>
    <div class="flex h-9 items-center bg-gradient-to-l from-slightGray dark:from-slightDark to-transparent rounded-full p-1 duration-300 cursor-pointer"
        :class="{ '': getWalletMode != 'metamask' }" @click="globalStore.changeWalletMode()">
        <div class="flex space-x-2 items-center justify-center ">
            <div class="flex flex-none p-2 rounded-full"
                :class="getWalletMode === 'walletconnect' ? 'dark:shadow-dark-depth shadow-light-depth' : ''">
                <img src="@/assets/walletConnect.jpeg" alt="" class="h-5">
            </div>
            <i class="text-oswapBlue-light dark:text-oswapGreen-light las la-exchange-alt"></i>
            <div class="flex flex-none p-2 rounded-full"
                :class="getWalletMode === 'metamask' ? 'dark:shadow-dark-depth shadow-light-depth' : ''">
                <img src="@/assets/Metamask.png" alt="" class="h-5">
            </div>
        </div>
    </div>
</template>


