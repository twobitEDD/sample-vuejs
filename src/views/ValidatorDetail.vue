<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useValidatorsStore } from '@/stores/validators';
import ValidatorProfile from '@/components/ValidatorProfile.vue';
import DelegatorsTable from '@/components/DelegatorsTable.vue';
import ValidatorLineChart from '@/components/ValidatorLineChart.vue'
import ValidatorBarChart from '@/components/ValidatorBarChart.vue'
import { ref, watch } from 'vue';
const validatorStore = useValidatorsStore()
const route = useRoute()
let validatorAddress = ref(route.params.address.toString())
validatorStore.loadValidator(validatorAddress.value)
validatorStore.loadValidatorHistory(validatorAddress.value)
watch(() => route.params, () => {
    validatorAddress.value = route.params.address?.toString()
    validatorStore.loadValidator(validatorAddress.value)
    validatorStore.loadValidatorHistory(validatorAddress.value)
});
</script>



<template>
    <div class="max-w-screen-xl mx-auto items-center flex flex-1 justify-center xl:px-0 px-3">
        <div class="flex flex-col flex-1 space-y-4 mt-4">
            <div class="flex flex-1 ">
                <ValidatorProfile />
            </div>
            <div class="flex flex-1 lg:space-x-2 lg:flex-row flex-col">
                <div class="flex flex-1">
                    <ValidatorBarChart />
                </div>
                <div class="flex flex-1">
                    <ValidatorLineChart />
                </div>
            </div>
            <div class="flex flex-none">
                <DelegatorsTable />
            </div>

        </div>
    </div>
</template>


