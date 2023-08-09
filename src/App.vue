<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global';
import { onUnmounted } from 'vue';
import EpochGuide from '@/components/EpochGuide.vue'
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import { useWalletStore } from './stores/wallet';
import CurrencySelector from './components/CurrencySelector.vue';
const { theme, effects } = storeToRefs(useGlobalStore())
const globalStore = useGlobalStore();

globalStore.loadNetworkInfo()
globalStore.setPrices()
setInterval(() => {
  globalStore.loadNetworkInfo()
}, 15000);
globalStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
  }) => {
    after(() => {
      if (name === 'scrollTop') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    })
  }
)
window.addEventListener('scroll', handleScroll);
globalStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
  }) => {
    after(() => {
      if (name === 'changeChainId') {
        globalStore.setPrices()
      }
    })
  }
)
if (window.ethereum) {
  window.ethereum.on('chainChanged', async () => {
    const walletStore = useWalletStore()
    if (globalStore.autoConnect) {
      walletStore.setupWallet()
    }
    globalStore.setPrices()
  })
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });
}

function handleScroll() {
  globalStore.setScroll(window.scrollY)
}
onUnmounted(endListener)
function endListener() {
  window.removeEventListener('scroll', handleScroll);
}
</script>

<template>
  <div :class="theme">
    <div id="root"
      class="antialiased bg-gradient-to-r from-gray-300 to-slightGray dark:from-oswapDark-gray dark:to-slightDark">
      <div
        class="flex flex-col flex-1 min-h-screen mx-auto justify-center text-gray-700 dark:text-white overflow-hidden">
        <div
          class="fixed top-0 right-0 left-0 bg-gradient-to-r from-gray-300 to-slightGray dark:from-oswapDark-gray dark:to-slightDark shadow-lg z-90">
          <div class="max-w-screen-xl mx-auto">
            <Header />
          </div>
        </div>
        <div class="flex flex-1 lg:py-20 mx-3 lg:mx-0 mt-14 lg:mt-0 min-h-full">
          <router-view v-slot="{ Component }">
            <transition :enter-active-class="effects ? 'animate__animated animate__fadeIn' : ''"
              :leave-active-class="effects ? 'animate__animated animate__fadeOut' : ''" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <div class="flex flex-none w-full max-w-screen-xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>

    <div class="fixed flex flex-col justify-end space-y-2 bottom-5 right-1">
      <CurrencySelector />
      <EpochGuide />
    </div>
  </div>
</template>
