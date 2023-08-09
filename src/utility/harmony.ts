import { BASE_URL } from '@/constants';
import axios from 'axios'
import { utils } from 'ethers';
import { Networks } from '@/utility/networks.interface';




export const availableNetworks: Networks[] = [
    {
        chainId: 1666600000,
        apiURL: BASE_URL + 'mainnet/',
        rpcURL: 'https://api.harmony.one',
        explorer: 'https://explorer.harmony.one/',
        name: 'Harmony Mainnet',
        hasPrice: true,
        delegatorAddress: '0x00000000000000000000000000000000000000fc',
        delegatorContract: '0xe6Dd98403eC2661A4BB1FB73b64e7Df9bd9B1045',
        settingsContract: '0x535E8e910F78BD12BD0140aBe740FD1b2069A90c'
    },
    {
        chainId: 1666700000,
        apiURL: BASE_URL + 'testnet/',
        rpcURL: 'https://api.s0.b.hmny.io',
        explorer: 'https://explorer.pops.one/',
        name: 'Harmony Testnet',
        hasPrice: true,
        delegatorAddress: '0x00000000000000000000000000000000000000fc',
        delegatorContract: '',
        settingsContract: ''
    }
]

export default {
    bodyParams(method: string, params: string[]) {
        return `{
        "jsonrpc": "2.0",
        "method": "${method}",
        "params": ${JSON.stringify(params)},
        "id": 1
      }`},
    getHarmonyNetwork(chainId: number) {
        return availableNetworks.find((network) => network.chainId === chainId)
    },
    getNetworkInfo(chainId: number) {
        const networkAPI = this.getHarmonyNetwork(chainId)?.apiURL
        return axios.get(networkAPI + 'network_info_lite/', {})
    },
    getValidators(chainId: number) {
        const networkAPI = this.getHarmonyNetwork(chainId)?.apiURL
        return axios.get(networkAPI + 'validators/', {})
    },
    getValidator(chainId: number, validator: string) {
        const networkAPI = this.getHarmonyNetwork(chainId)?.apiURL
        return axios.get(networkAPI + `validators/${validator}`, {})
    },
    getValidatorHistory(chainId: number, validator: string) {
        const networkAPI = this.getHarmonyNetwork(chainId)?.apiURL
        return axios.get(networkAPI + `validator_history/${validator}`, {})
    },
    async getDelegations(chainId: number, address: string) {
        const networkAPI = this.getHarmonyNetwork(chainId)?.apiURL
        return axios.get(networkAPI + `delegations/${address}`)
    },
    async getBalance(chainId: number, address: string) {
        const res = await axios({
            method: "post",
            url: this.getHarmonyNetwork(chainId)?.rpcURL,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            data: this.bodyParams("hmy_getBalance", [address, "latest"])
        })

        let coins = '0'

        try {
            coins = utils.formatUnits(res.data.result, 18)
        } catch (e) {
            console.error(e)
        }

        return coins
    }
}