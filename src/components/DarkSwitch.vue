<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global';
const globalStore = useGlobalStore()
const { getDarkMode } = storeToRefs(useGlobalStore())

interface DarkSwitch {
    onlyIconMode?: boolean;
}
const { onlyIconMode } = withDefaults(defineProps<DarkSwitch>(), {
    onlyIconMode: false
})
</script>

<template>
    <div
        class="relative h-8 flex items-center rounded-full p-1 duration-300 cursor-pointer"
        :class="{ '': !getDarkMode, 'w-20 from-slightGray dark:from-slightDark to-transparent bg-gradient-to-l ': !onlyIconMode }"
        :aria-checked="!getDarkMode.toString()"
        @click="globalStore.changeTheme()"
    >
        <template v-if="!onlyIconMode">
            <transition name="fade-in" appear>
                <p
                    v-if="getDarkMode"
                    class="absolute center-y-component left-3 dark:text-gray-200 font-extralight text-sm"
                >Dark</p>
            </transition>
            <transition name="fade-in" appear>
                <p
                    v-if="!getDarkMode"
                    class="absolute center-y-component right-3 dark:text-gray-200 font-extralight text-sm"
                >Light</p>
            </transition>
        </template>
        <div
            class="flex bg-gray-50 dark:bg-oswapGreen w-6 h-6 items-center justify-center rounded-full shadow-md transform duration-300"
            :class="{ 'translate-x-12': getDarkMode && !onlyIconMode }"
        >
            <transition name="fade-in-and-rotate" appear>
                <i
                    :class="!getDarkMode ? 'la-sun' : 'la-moon'"
                    class="las text-lg text-gray-300 dark:text-gray-700"
                ></i>
            </transition>
        </div>
    </div>
</template>