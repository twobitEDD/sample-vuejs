import axios from 'axios'
import { CG_URL } from '@/constants';

export function getPrices() {
    const currencies = ['eur', 'usd', 'btc', 'sats']
    return axios.get(CG_URL + 'simple/price', {
        params: {
            ids: 'harmony', vs_currencies: currencies.reduce((f, s) => `${f},${s}`)
        }
    })
}
