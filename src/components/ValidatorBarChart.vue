<script setup lang="ts">
import { useValidatorsStore } from '@/stores/validators';
import { createChart } from 'lightweight-charts';
import { darken, lighten } from 'polished'
import { ref, onMounted, onUnmounted } from 'vue';
import Popper from "vue3-popper";
import { useGlobalStore } from '@/stores/global';
import numeral from 'numeral';
import { returnAmounts } from '@/utility/functions'
const globalStore = useGlobalStore()
const validatorStore = useValidatorsStore()
const refChart = ref('refChart')
let chart: any = null
let delegatedSeries: any = null
let selfStakedSeries: any = null
let chartHovered = ref(false)
let selfStakeHovered = ref('0')
let delegatedStakeHovered = ref('0')
let epochHovered = ref(0)
const darkTheme = {
    chart: {
        layout: {
            backgroundColor: 'transparent',
            lineColor: '#2B2B43',
            textColor: '#d1d5db',
        },
        watermark: {
            visible: true,
            fontSize: 32,
            horzAlign: 'center',
            vertAlign: 'center',
            color: 'rgba(33, 150, 243, 0.56)',
            text: 'OpenSwap',
        },
        crosshair: {
            horzLine: {
                visible: false,
                labelVisible: false,
            },
            vertLine: {
                visible: true,
                style: 0,
                width: 2,
                color: 'rgba(32, 38, 46, 0.3)',
                labelVisible: false,
            },
        },
        grid: {
            vertLines: {
                color: '#2B2B43',
            },
            horzLines: {
                color: '#363C4E',
            },
        },
    },
    series: {
        topColor: lighten(0.12, '#109dbb'),
        bottomColor: lighten(0.12, '#109dbb00'),
        lineColor: lighten(0.12, '#109dbb'),
        lineWidth: 3,
    },
};

const lightTheme = {
    chart: {
        layout: {
            backgroundColor: 'transparent',
            lineColor: '#2B2B43',
            textColor: '#313547',
        },
        watermark: {
            visible: true,
            fontSize: 32,
            horzAlign: 'center',
            vertAlign: 'center',
            color: 'rgba(33, 150, 243, 0.56)',
            text: 'OpenSwap',
        },
        crosshair: {
            horzLine: {
                visible: false,
                labelVisible: false,
            },
            vertLine: {
                visible: true,
                style: 0,
                width: 2,
                color: 'rgba(32, 38, 46, 0.3)',
                labelVisible: false,
            },
        },
        grid: {
            horzLines: {
                color: 'rgba(197, 203, 206, 0.5)',
                visible: false,
            },
            vertLines: {
                color: 'rgba(197, 203, 206, 0.5)',
                visible: false,
            },
        },
    },
    series: {
        topColor: lighten(0.12, '#109dbb'),
        bottomColor: lighten(0.12, '#109dbb00'),
        lineColor: lighten(0.12, '#109dbb'),
        lineWidth: 3,
    },
};

const themesData: any = {
    Dark: darkTheme,
    Light: lightTheme,
};


globalStore.$subscribe((mutation, state) => {
    if (delegatedSeries && chart) {
        setTheme(state.theme)
    }

})
function setTheme(theme: string) {
    if (theme === 'light') {
        light();
    } else {
        dark();
    }
}

validatorStore.$subscribe((mutation, state) => {
    const delegated = state.stakeHistory.map((elem) => {
        return { time: elem.epoch, value: elem.delegatedStake }
    })
    const self = state.stakeHistory.map((elem) => {
        return { time: elem.epoch, value: elem.selfStake }
    })
    delegatedSeries.setData(delegated);
    selfStakedSeries.setData(self);
    setTheme(globalStore.theme)
})

onMounted(createCh)
onUnmounted(close)

function close() {
    chart.unsubscribeCrosshairMove();
}
function createCh() {
    chart = createChart(refChart.value, {
        width: 0,
        height: 350,
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            barSpacing: 20,
            borderVisible: false,
            tickMarkFormatter: (value: any) => {
                return value
            },
        },
    });
    delegatedSeries = chart.addHistogramSeries({
        priceFormat: {
            type: 'custom',
            formatter: (value: any) => {
                return numeral(value).format('0.0a')
            }
        },
        color: darken(0.12, '#109dbb'),
        border: 'transparent'
    });
    selfStakedSeries = chart.addHistogramSeries({
        priceFormat: {
            type: 'custom',
            formatter: (value: any) => {
                return value
            }
        },
        color: lighten(0.20, '#109dbb'),
        border: 'transparent'
    });
    light();
    chart.subscribeCrosshairMove(function (param: any) {
        if (!param.time) {
            chartHovered.value = false
        } else {
            const prices: any = []
            param.seriesPrices.forEach((price: any) => {
                prices.push(price)
            })
            console.log(prices)
            delegatedStakeHovered.value = prices[0]
            selfStakeHovered.value = prices[1]
            epochHovered.value = param.time
            chartHovered.value = true
        }
    })
}
function light() {
    chart.applyOptions(themesData['Light'].chart);
    delegatedSeries.applyOptions(themesData['Light'].series);
}
function dark() {
    chart.applyOptions(themesData['Dark'].chart);
    delegatedSeries.applyOptions(themesData['Dark'].series);
}
</script>

<template>
    <div class="flex flex-1 flex-col justify-center">
        <div class="flex flex-none justify-center">
            <span class="text-oswapBlue-light text-lg">Stake in the last 30 epochs</span>
        </div>
        <Popper arrow placement="bottom" :show="chartHovered">
            <div class="flex flex-1 w-full relative p-2" id="refChart" ref="refChart">
                <a href="https://www.tradingview.com/" target="_blank" class="absolute right-1 bottom-0 text-ns">Powered
                    by TradingView</a>
            </div>
            <template #content>
                <div>Epoch: {{ epochHovered }}</div>
                <div>Self: {{ returnAmounts(selfStakeHovered) }}</div>
                <div>Delegated: {{ returnAmounts(delegatedStakeHovered) }}</div>
            </template>
        </Popper>
    </div>
</template>