import { defineStore } from 'pinia'
import numeral from 'numeral'
import Harmony from '@/utility/harmony'
import harmony from '@/utility/harmony';
import { Networks } from '@/utility/networks.interface';
import { ETH_PRICE } from '@/apollo/queries';
import { client } from '@/apollo/clients';
import { cachePolicy } from '@/constants';
import { useWalletStore } from './wallet';
import { getPrices } from '@/utility/coingecko';
import dayjs from 'dayjs'
interface prices {
    eur: number;
    sats: number;
    usd: number;
    btc: number;
}
interface globalStore {
    effects: boolean;
    theme: string;
    scroll: number;
    epoch: number;
    nextEpoch: number;
    totalStaked: string;
    supply: string;
    effectiveStake: string;
    slots: number;
    amountBlocks: number;
    networkId: number;
    currencyDisplay: 'usd' | 'eur' | 'sats' | 'btc';
    onePrice: prices;
    timeLastPrice: any;
    autoConnect: boolean;
    walletMode: 'metamask' | 'walletconnect';
    profileDetails: boolean;
    notes: boolean;
}

export const useGlobalStore = defineStore('global', {
    state: () => ({
        effects: true,
        theme: 'light',
        scroll: 0,
        epoch: 0,
        nextEpoch: 0,
        totalStaked: '0',
        supply: '0',
        effectiveStake: '0',
        slots: 0,
        amountBlocks: 0,
        networkId: 1666600000,
        currencyDisplay: 'usd',
        onePrice: {} as prices,
        timeLastPrice: dayjs(),
        autoConnect: false,
        walletMode: 'metamask',
        profileDetails: false,
        notes: true
    } as globalStore),
    persist: true,
    getters: {
        getDarkMode: (state): boolean => {
            if (state.theme == 'dark') {
                return true;
            } else {
                return false
            }
        },
        getScrollPosition(): boolean {
            return this.scroll > 10
        },
        getNextEpoch(): number {
            return Math.round(this.nextEpoch / 60)
        },
        getNetwork(): Networks | undefined {
            return harmony.getHarmonyNetwork(this.networkId)
        },
        getApiUrl(): string | undefined {
            return harmony.getHarmonyNetwork(this.networkId)?.apiURL
        },
        getWalletMode(): string {
            return this.walletMode
        }
    },
    actions: {
        setScroll(scrollPosition: number) {
            this.scroll = scrollPosition
        },
        changeEffects() {
            this.effects = !this.effects
        },
        scrollTop() {
            // This triggers a listener to this type of action
        },
        changeWalletMode() {
            if (this.walletMode == 'metamask') {
                this.walletMode = 'walletconnect'
            } else if (this.walletMode == 'walletconnect') {
                this.walletMode = 'metamask'
            };
            const walletStore = useWalletStore()
            walletStore.disconnect()
        },
        changeProfileDetails() {
            this.profileDetails = !this.profileDetails
        },
        changeNotes() {
            this.notes = !this.notes
        },
        changeTheme() {
            if (this.theme == 'dark') {
                this.theme = 'light'
            } else if (this.theme == 'light') {
                this.theme = 'dark'
            };
        },
        async setPrices() {
            if (dayjs(this.timeLastPrice).diff(dayjs(), 'minutes') > 5 || !this.onePrice.usd) {
                const price = await getPrices()
                if (price.status == 200) {
                    this.onePrice = price.data.harmony
                }
            }
            // this.onePrice = '0'
            // try {
            //     if (harmony.getHarmonyNetwork(this.networkId)?.hasPrice) {
            //         let result = await client.query({
            //             query: ETH_PRICE(null),
            //             fetchPolicy: cachePolicy,
            //         })
            //         const currentPrice = result?.data?.bundles[0]?.ethPrice
            //         this.onePrice = currentPrice
            //     }
            // } catch (e) {
            //     console.log(e)

            // }
            return true
        },
        changeChainId(newChainId: number) {
            this.networkId = newChainId
        },
        async loadNetworkInfo() {
            try {
                const networkInfo = await Harmony.getNetworkInfo(this.networkId)
                if (networkInfo.status === 200) {
                    const networkData = networkInfo.data
                    this.epoch = networkData.current_epoch
                    this.nextEpoch = networkData.time_next_epoch
                    this.totalStaked = numeral(parseInt((networkData.liveEpochTotalStake / (10 ** 18)).toString())).format('0,0,0')
                    this.supply = numeral(networkData['total-supply']).format('0,0,0')
                    this.effectiveStake = numeral(parseInt((networkData.lastEpochEffectiveStake / (10 ** 18)).toString())).format('0,0,0')
                    this.slots = networkData.total_seats
                    this.amountBlocks = networkData.current_block_number
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
})
