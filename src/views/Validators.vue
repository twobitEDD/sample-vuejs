<script setup lang="ts">
import { useValidatorsStore } from '@/stores/validators';
import ValidatorsTable from '@/components/ValidatorsTable.vue'
import Profile from '@/components/Profile.vue'
import MediumAPR from '@/components/MediumAPR.vue'
import { useGlobalStore } from '@/stores/global';

const validatorsStore = useValidatorsStore()
const globalStore = useGlobalStore();
validatorsStore.loadValidators()
globalStore.$onAction(
    ({
        name, // name of the action
        store, // store instance, same as `someStore`
        args, // array of parameters passed to the action
        after, // hook after the action returns or resolves
    }) => {
        after(() => {
            if (name === 'changeChainId') {
                validatorsStore.loadValidators()
            }
        })
    }
)
</script>



<template>
    <div class="max-w-screen-xl mx-auto items-center flex flex-1 justify-center xl:px-0 px-3">
        <div class="flex flex-col flex-1 space-y-4 mt-4">
            <div class="flex flex-1">
                <Profile :showDetailButton="true" />
            </div>
            <div class="flex flex-1 justify-center">
                <MediumAPR />
            </div>
            <div class="flex flex-none">
                <ValidatorsTable />
            </div>
        </div>
    </div>
</template>


