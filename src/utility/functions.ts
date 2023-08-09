import { toasterOptions } from "@/constants";
import Toaster from '@/components/Toaster.vue'
import numeral from "numeral";
import { ToasterOptions } from "./toaster.interface";
import { useToast } from "vue-toastification";
import { bech32 } from 'bech32'
import { availableNetworks } from "@/utility/harmony";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Buffer } from "buffer/index";
export function returnPercentage(value: any) {
    return numeral(value).format('0.00%')
}
export function returnAmounts(value: any) {
    return numeral(value).format('0,0,0')
}
export function sortByParams(
    array: any[],
    sortProperty: string,
    sortOrder: 'desc' | 'asc'
) {
    return array.sort((aV, bV) => {
        const a = aV[sortProperty]
        const b = bV[sortProperty]

        const sortFactor = sortOrder === "desc" ? 1 : -1

        if (!isNaN(a) && !isNaN(b)) {
            return Number(a) > Number(b) ? -sortFactor : sortFactor
        }
        return a > b ? -sortFactor : sortFactor
    })
}
export async function returnProvider(walletMode: string) {
    let sourceProvider: any;
    switch (walletMode) {
        case 'walletconnect':
            const networks = availableNetworks
            const sources: any = {}
            networks.forEach((network) => { sources[network.chainId] = network.rpcURL })
            sourceProvider = new WalletConnectProvider({
                rpc: sources
            })
            await sourceProvider.enable();
            break;

        default:
            sourceProvider = window.ethereum
            break;
    }
    return sourceProvider
}
export function shuffle(array: any[]) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

export function optToast(value: keyof ToasterOptions) {
    return toasterOptions[value]
}

export function toastMe(type: keyof ToasterOptions, props: any) {

    let content = {
        component: Toaster,
        props: { ...props }
    }

    switch (type) {
        case 'success':
            useToast().success(content, optToast(type))
            break
        case 'info':
            useToast().info(content, optToast(type))
            break
        case 'warning':
            useToast().warning(content, optToast(type))
            break
        case 'error':
            useToast().error(content, optToast(type))
            break
        default:
            useToast()(content, optToast(type))
    }
}

export function fromBech32(address: string) {
    const decoded = bech32.decode(address)
    return `0x${Buffer.from(bech32.fromWords(decoded.words)).toString('hex')}`
}

export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}