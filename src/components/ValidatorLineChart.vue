<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useValidatorsStore } from '@/stores/validators';
import { createChart } from 'lightweight-charts';
import { darken } from 'polished'
import { ref, onMounted, onUnmounted } from 'vue';
import Popper from "vue3-popper";
import { useGlobalStore } from '@/stores/global';
const { loading } = storeToRefs(useValidatorsStore())
const globalStore = useGlobalStore()
const validatorStore = useValidatorsStore()
const refChart = ref('refChart')
let chart: any = null
let lineSeries: any = null
let chartHovered = ref(false)
let aprHovered = ref('0')
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
        topColor: darken(0.12, '#109dbb'),
        bottomColor: darken(0.12, '#109dbb00'),
        lineColor: darken(0.12, '#109dbb'),
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
        topColor: darken(0.12, '#109dbb'),
        bottomColor: darken(0.12, '#109dbb00'),
        lineColor: darken(0.12, '#109dbb'),
        lineWidth: 3,
    },
};

const themesData: any = {
    Dark: darkTheme,
    Light: lightTheme,
};


globalStore.$subscribe((mutation, state) => {
    if (lineSeries && chart) {
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
    const chartData = state.returnHistory.map((elem) => {
        return { time: elem.epoch, value: parseFloat(elem.apr) * 100 }
    })
    lineSeries.setData(chartData);
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
    lineSeries = chart.addLineSeries({
        priceFormat: {
            type: 'custom',
            formatter: (value: any) => {
                return `${parseFloat(value).toFixed(2)}%`
            }
        },
        topColor: darken(0.12, '#109dbb'),
        bottomColor: darken(0.12, '#109dbb00'),
        lineColor: darken(0.12, '#109dbb'),
        lineWidth: 3,
    });
    light();
    chart.subscribeCrosshairMove(function (param: any) {
        if (!param.time) {
            chartHovered.value = false
        } else {
            param.seriesPrices.forEach((price: number) => {
                aprHovered.value = `${price.toFixed(2)}%`
                epochHovered.value = param.time
                chartHovered.value = true
            })
        }
    })
}
function light() {
    chart.applyOptions(themesData['Light'].chart);
    lineSeries.applyOptions(themesData['Light'].series);
}
function dark() {
    chart.applyOptions(themesData['Dark'].chart);
    lineSeries.applyOptions(themesData['Dark'].series);
}
</script>

<template>
    <div class="flex flex-1 flex-col justify-center">
        <div class="flex flex-none justify-center">
            <span class="text-oswapBlue-light text-lg">Expected return in the last 30 epochs</span>
        </div>
        <Popper arrow placement="bottom" :show="chartHovered">
            <div class="flex flex-1 w-full relative p-2" id="refChart" ref="refChart">
                <a href="https://www.tradingview.com/" target="_blank" class="absolute right-1 bottom-0 text-ns">Powered
                    by TradingView</a>
            </div>
            <template #content>
                <div>Epoch: {{ epochHovered }}</div>
                <div>APR: {{ aprHovered }}</div>
            </template>
        </Popper>


    </div>
</template>