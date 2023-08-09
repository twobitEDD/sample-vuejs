import { defineStore } from 'pinia'
import Harmony from '@/utility/harmony'
import { useGlobalStore } from './global';
import { utils } from 'ethers'
import { escapeRegExp, shuffle, sortByParams } from '@/utility/functions';
import { validatorsWhitelist } from '@/constants';
import { Delegation, ValidatorFull } from '@/utility/validator.interface';
import numeral from 'numeral';
import { ReturnHistory, StakeHistory } from '@/utility/history.interface';
export interface Validators {
    active: boolean;
    apr: number;
    address: string;
    name: string;
    rate: string;
    total_stake: string | number;
    uptime_percentage?: any;
    identity: string;
    hasLogo: boolean;
}
interface validatorsStore {
    validators: Validators[];
    validator: ValidatorFull;
    order: string
    direction: boolean;
    pageIndex: number;
    limit: number;
    loading: boolean;
    showElected: boolean;
    showNonElected: boolean;
    filterValidators: string;
    validatorPageIndex: number;
    stakeHistory: StakeHistory[];
    returnHistory: ReturnHistory[];
}

export const useValidatorsStore = defineStore('validators', {
    state: () => ({
        validators: [],
        validator: {} as ValidatorFull,
        order: '',
        direction: false,
        pageIndex: 0,
        validatorPageIndex: 0,
        limit: 20,
        loading: true,
        showElected: true,
        showNonElected: false,
        filterValidators: '',
        stakeHistory: [],
        returnHistory: [],
    } as validatorsStore),
    getters: {
        getPagination(): Validators[] {
            return this.getFiltered.slice(this.pageIndex * this.limit, (this.pageIndex + 1) * this.limit)
        },
        getValidatorPagination(): Delegation[] {
            return this.validator.delegations.slice(this.validatorPageIndex * this.limit, (this.validatorPageIndex + 1) * this.limit)
        },
        getValidatorsMediumApr(): number {
            const totalApr = this.validators.reduce((previousValue, currentValue) => {
                if (currentValue.active) {
                    return currentValue.apr + previousValue
                }
                return previousValue
            }, 0)
            const mediumApr = totalApr / this.validators.filter((validator) => validator.active).length
            return mediumApr
        },
        getFiltered(): Validators[] {
            return this.validators.filter((validator) => {
                const filterByString = (validator.address.match(new RegExp(escapeRegExp(this.filterValidators), 'i')) ||
                    validator.name.match(new RegExp(escapeRegExp(this.filterValidators), 'i')) ||
                    !this.filterValidators)
                if (this.showElected && this.showNonElected) {
                    return validator && filterByString
                } else {
                    if (this.showElected || this.showNonElected) {
                        if (!this.showElected) {
                            return validator.active === false && filterByString
                        }
                        if (!this.showNonElected) {
                            return validator.active === true && filterByString
                        }
                    }

                }
                return validator && filterByString
            })
        },
        getAmount(): number {
            return this.getFiltered.length
        },
        getAmountOfPages(): number {
            return Math.ceil(this.getFiltered.length / this.limit) || 1
        },
        getAmountValidator(): number {
            return this.validator.delegations?.length
        },
        getAmountOfPagesValidator(): number {
            return Math.ceil(this.validator.delegations?.length / this.limit) || 1
        },
        getLoading(): boolean {
            return this.loading
        },
    },
    actions: {
        setShowElected(value: boolean) {
            this.showElected = value
        },
        setShowNonElected(value: boolean) {
            this.showNonElected = value
        },
        setfilterValidators(value: string) {
            this.filterValidators = value
        },
        setLimit(limit: number) {
            this.limit = limit
        },
        nextValidatorPage() {
            if (this.getAmountOfPagesValidator > this.validatorPageIndex + 1) {
                this.validatorPageIndex++
            }
        },
        prevValidatorPage() {
            if (this.validatorPageIndex > 0) {
                this.validatorPageIndex--
            }
        },
        nextPage() {
            if (this.getAmountOfPages > this.pageIndex + 1) {
                this.pageIndex++
            }
        },
        prevPage() {
            if (this.pageIndex > 0) {
                this.pageIndex--
            }
        },
        setOrder(key: string, sortDirection: boolean) {
            this.validators = sortByParams(this.validators, key, sortDirection ? 'desc' : 'asc')
            this.order = key
            this.direction = sortDirection
        },
        async loadValidators() {
            const globalStore = useGlobalStore()
            try {
                this.loading = true
                const validatorsInfo = await Harmony.getValidators(globalStore.networkId)
                if (validatorsInfo.status === 200) {
                    const validatorsData: Validators[] = validatorsInfo.data.validators
                    this.validators = shuffle(validatorsData.filter((element) => {
                        return parseFloat(utils.formatUnits(element.total_stake, 18)) > 10000
                    }).map((validator) => {
                        return {
                            ...validator,
                            apr: validator.apr || 0,
                            rate: validator.rate,
                            uptime_percentage: validator.uptime_percentage,
                            total_stake: utils.formatUnits(validator.total_stake, 18)
                        }
                    })).sort((aV, bV) => {
                        const exist = validatorsWhitelist.find((element) => element === aV.address)
                        if (exist) {
                            return -1
                        } else {
                            return 1
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
            this.loading = false
        },
        async loadValidator(address: string) {
            this.validator = {} as ValidatorFull
            const globalStore = useGlobalStore()
            try {
                this.loading = true
                const validatorsInfo = await Harmony.getValidator(globalStore.networkId, address)
                if (validatorsInfo.status === 200) {
                    const validatorsData: ValidatorFull = validatorsInfo.data
                    const totalStake = parseFloat(validatorsData.total_stake) / (10 ** 18)
                    const customDelegations = validatorsData.delegations
                        .sort((av, bV) => {
                            if (av.amount > bV.amount) {
                                return -1
                            } else {
                                return 1
                            }
                        })
                        .map((element) => {
                            const amount = (parseFloat(element.amount) / (10 ** 18))
                            return {
                                ...element,
                                percentage: numeral(totalStake && amount > 1 ? ((100 * (parseFloat(element.amount) / (10 ** 18))) / totalStake) / 100 : '0').format('0.00%'),
                                amount: numeral(parseInt(amount.toString())).format('0,0,0')
                            }
                        })
                    this.validator = {
                        ...validatorsData,
                        lifetime_reward_accumulated: numeral(parseInt((parseFloat(validatorsData.lifetime_reward_accumulated) / (10 ** 18)).toString())).format('0,0,0'),
                        'min-self-delegation': numeral(parseInt((parseFloat(validatorsData['min-self-delegation']) / (10 ** 18)).toString())).format('0,0,0'),
                        'max-total-delegation': numeral(parseInt((parseFloat(validatorsData['max-total-delegation']) / (10 ** 18)).toString())).format('0,0,0'),
                        self_stake: numeral(parseInt((parseFloat(validatorsData.self_stake) / (10 ** 18)).toString())).format('0,0,0'),
                        average_stake_by_bls: numeral(parseInt((parseFloat(validatorsData.average_stake_by_bls) / (10 ** 18)).toString())).format('0,0,0'),
                        delegations: customDelegations
                    }
                }
            } catch (error) {
                console.log(error)
            }
            this.loading = false
        },
        async loadValidatorHistory(address: string) {
            this.returnHistory = []
            this.stakeHistory = []
            const globalStore = useGlobalStore()
            try {
                this.loading = true
                const validatorsInfo = await Harmony.getValidatorHistory(globalStore.networkId, address)
                if (validatorsInfo.status === 200) {
                    const history: ValidatorFull[] = validatorsInfo.data
                    this.returnHistory = history.map((element) => ({ epoch: element.index, apr: element.last_apr }))
                    this.stakeHistory = history.map((element) => ({
                        epoch: element.index,
                        delegatedStake: (parseFloat(element.total_stake) / (10 ** 18)).toString(),
                        selfStake: (parseFloat(element.self_stake) / (10 ** 18)).toString()
                    }))
                }
            } catch (error) {
                console.log(error)
            }
            this.loading = false
        },

    }
})
