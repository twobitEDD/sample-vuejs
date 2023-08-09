<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { storeToRefs } from 'pinia';
const { currencyDisplay } = storeToRefs(useGlobalStore())

function changeDisplay(currency: 'usd' | 'eur' | 'sats' | 'btc') {
    const globalStore = useGlobalStore()
    globalStore.currencyDisplay = currency
}
</script>



<template>
    <div class="flex flex-col  items-end group">
        <button
            :class="currencyDisplay === 'usd' ? ' order-5' : 'hidden group-hover:block bg-opacity-30  order-2 hover:bg-opacity-70'"
            class="w-8 h-8 my-1  bg-oswapGreen-light rounded-full" @click="changeDisplay('usd')">
            <i class="las la-dollar-sign"></i>
        </button>
        <button
            :class="currencyDisplay === 'btc' ? 'order-5' : 'hidden group-hover:block bg-opacity-30  order-2 hover:bg-opacity-70'"
            class="w-8 h-8 my-1  bg-oswapGreen-light rounded-full" @click="changeDisplay('btc')">
            <i class="lab la-btc"></i>
        </button>
        <button
            :class="currencyDisplay === 'eur' ? 'order-5' : 'hidden group-hover:block bg-opacity-30  order-2 hover:bg-opacity-70'"
            class="w-8 h-8 my-1  bg-oswapGreen-light rounded-full" @click="changeDisplay('eur')">
            <i class="las la-euro-sign"></i>
        </button>
        <button
            :class="currencyDisplay === 'sats' ? ' order-5' : 'hidden group-hover:block bg-opacity-30 order-1 hover:bg-opacity-70'"
            class="w-8 h-8 my-1 bg-oswapGreen-light rounded-full" @click="changeDisplay('sats')">
            <i class="fak fa-satoshisymbol-solid "></i>
        </button>
    </div>
</template>

