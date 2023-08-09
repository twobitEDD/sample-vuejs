import { Delegation } from '@/utility/delegations.interface';
import { fromBech32, returnProvider, toastMe } from '@/utility/functions';
import harmony from '@/utility/harmony';
import StakingPrecompiles from '@/assets/StakingPrecompiles.json'
import { ethers } from 'ethers';
import { defineStore } from 'pinia'
import { useGlobalStore } from './global';
interface walletStore {
    isSigned: boolean;
    provider: any;
    userAddress: string
    availableBalance: string;
    delegations: Delegation[]
}

export const useWalletStore = defineStore('wallet', {
    state: () => ({
        isSigned: false,
        provider: null,
        userAddress: '',
        availableBalance: '0',
        delegations: [] as Array<Delegation>
    } as walletStore),
    getters: {
        getTotalStaked(): string {
            return (this.delegations.reduce((previousValue, currentValue) => { return currentValue.amount + previousValue }, 0) / (10 ** 18)).toString()
        },
        getTotalRewards(): string {
            return (this.delegations.reduce((previousValue, currentValue) => { return currentValue.reward + previousValue }, 0) / (10 ** 18)).toString()
        },
        getPendingUndelegated(): string {
            return (this.delegations.reduce((previousValue, currentValue) => {
                const amount = currentValue.Undelegations.reduce((prev, curr) => prev + curr.Amount, 0)
                return amount + previousValue
            }, 0) / (10 ** 18)).toString()
        },
        getReDelegated(): string {
            const globalStore = useGlobalStore()
            return (this.delegations.reduce((previousValue, currentValue) => {
                const amount = currentValue.Undelegations.reduce((prev, curr) => {
                    if ((7 - (globalStore.epoch - curr.Epoch)) < 7) {
                        return prev + curr.Amount
                    }
                    return prev
                }, 0)
                return amount + previousValue
            }, 0) / (10 ** 18)).toString()
        },
        getUsedDelegations(): Delegation[] {
            return this.delegations.filter((delegation: Delegation) => delegation.amount > 0 || delegation.Undelegations.length > 0 || delegation.reward > 0).sort((aV, bV) => {
                if (aV.amount > bV.amount) {
                    return -1
                } else {
                    return 1
                }
            })
        },
        getValidatorFromStaking: (state) => {
            return (validatorAddress: string) => state.delegations.find((delegation) => delegation.validator_address === validatorAddress)
        },
        getValidatorsFromStaking(): any[] {
            return this.delegations.filter((delegation) => delegation.amount > 0).map((element) => element.validator_info)
        },
    },
    actions: {
        async loadDelegations() {
            if (!this.isSigned) {
                return false
            }
            try {
                this.delegations = []
                const globalStore = useGlobalStore()
                const delegations = await harmony.getDelegations(globalStore.networkId, this.userAddress)
                if (delegations.status !== 200) {
                    throw 'Response failed'
                }
                this.delegations = delegations.data
            } catch (error) {
                toastMe('error', {
                    title: 'Delegations:',
                    msg: `Error loading delegations.${error}`,
                    link: false,
                })
            }
        },
        async loadOneBalance() {
            if (!this.isSigned) {
                return false
            }
            try {
                this.availableBalance = '0'
                const globalStore = useGlobalStore()
                const availableOnes = await harmony.getBalance(globalStore.networkId, this.userAddress)
                this.availableBalance = availableOnes
            } catch (error) {
                toastMe('error', {
                    title: 'Balance:',
                    msg: `Error loading balance.${error}`,
                    link: false,
                })
            }
        },
        async setupWallet() {
            const globalStore = useGlobalStore()
            const network = harmony.getHarmonyNetwork(globalStore.networkId)
            if (!network) {
                return false
            }
            const sourceProvider = await returnProvider(globalStore.walletMode);
            const provider = new ethers.providers.Web3Provider(sourceProvider);
            switch (globalStore.walletMode) {
                case 'metamask':
                    await provider.send("eth_requestAccounts", []);
                    break;
            }
            const signer = await provider.getSigner();
            const { chainId } = await provider.getNetwork()
            const chainAccepted = harmony.getHarmonyNetwork(chainId)
            if (!chainAccepted) {
                toastMe('error', {
                    title: 'Wallet:',
                    msg: "We don't support the network you are connected to.",
                    link: false,
                })
                this.disconnect()
                return false
            } else {
                const accounts = await signer.getAddress();
                globalStore.autoConnect = true;
                if (accounts !== this.userAddress || globalStore.networkId !== chainAccepted.chainId) {
                    toastMe('success', {
                        title: 'Wallet :',
                        msg: `Succesfully connected to : ` + accounts,
                        link: false,
                    })
                    if (globalStore.networkId !== chainAccepted.chainId) {
                        globalStore.changeChainId(chainAccepted.chainId)
                    }
                    this.provider = provider
                    this.userAddress = accounts
                    this.isSigned = true;
                    this.loadOneBalance()
                    this.loadDelegations()
                }
                return true
            }
        },
        disconnect() {
            const globalStore = useGlobalStore()
            globalStore.changeChainId(1666600000)
            globalStore.autoConnect = false;
            this.provider = null
            this.userAddress = ''
            this.isSigned = false;
            this.availableBalance = '0'
            this.delegations = []
            return false
        },
        async connect() {
            const globalStore = useGlobalStore()
            if (globalStore.walletMode === 'metamask') {
                if (window.ethereum !== undefined) {
                    return await this.setupWallet()
                }
                else if (window.ethereum == undefined) {
                    toastMe('warning', {
                        title: 'Wallet :',
                        msg: "It seems you don't have Metamask installed! try switching Wallet Mode",
                        link: false,
                    })
                    return false
                }
            }
            return await this.setupWallet()
        },

        async delegate(validatorAddress: string, amount: string) {
            if (!this.isSigned) {
                return false
            }
            const abi = StakingPrecompiles.abi;
            const user = this.userAddress
            const globalStore = useGlobalStore()
            const sourceProvider = await returnProvider(globalStore.walletMode);
            const provider = new ethers.providers.Web3Provider(sourceProvider);
            const signer = provider.getSigner();
            const network = harmony.getHarmonyNetwork(globalStore.networkId)
            if (!network) {
                return false
            }
            const contract = new ethers.Contract(network.delegatorAddress, abi, signer);
            const tx = await contract.Delegate(user, fromBech32(validatorAddress), ethers.utils.parseUnits(String(amount), 18)).catch((err: any) => {
                let message;
                if (!err.data?.message) {
                    message = err.message
                } else {
                    message = err.data.message
                }
                toastMe('error', {
                    title: 'Error :',
                    msg: message,
                    link: false
                })
                return
            })
            if (tx !== undefined) {
                let explorer = 'https://explorer.harmony.one/#/tx/'
                let transaction = tx.hash

                toastMe('info', {
                    title: 'Transaction Sent',
                    msg: "Delegation request sent to network. Waiting for confirmation",
                    link: false,
                    href: `${explorer}${transaction}`
                })
                await tx.wait(1)
                toastMe('success', {
                    title: 'Tx Successful',
                    msg: "Explore : " + transaction,
                    link: true,
                    href: `${explorer}${transaction}`
                })
                return true
            }
            return false
        },
        async undelegate(validatorAddress: string, amount: string) {
            if (!this.isSigned) {
                return false
            }
            const abi = StakingPrecompiles.abi;
            const user = this.userAddress
            const globalStore = useGlobalStore()
            const sourceProvider = await returnProvider(globalStore.walletMode);
            const provider = new ethers.providers.Web3Provider(sourceProvider);
            const signer = provider.getSigner();
            const network = harmony.getHarmonyNetwork(globalStore.networkId)
            if (!network) {
                return false
            }
            const contract = new ethers.Contract(network.delegatorAddress, abi, signer);
            const tx = await contract.Undelegate(user, fromBech32(validatorAddress), ethers.utils.parseUnits(String(amount), 18)).catch((err: any) => {
                let message;
                if (!err.data?.message) {
                    message = err.message
                } else {
                    message = err.data.message
                }
                toastMe('error', {
                    title: 'Error :',
                    msg: message,
                    link: false
                })
                return
            })
            if (tx !== undefined) {
                let explorer = 'https://explorer.harmony.one/#/tx/'
                let transaction = tx.hash

                toastMe('info', {
                    title: 'Transaction Sent',
                    msg: "Undelegation request sent to network. Waiting for confirmation",
                    link: false,
                    href: `${explorer}${transaction}`
                })
                await tx.wait(1)
                toastMe('success', {
                    title: 'Tx Successful',
                    msg: "Explore : " + transaction,
                    link: true,
                    href: `${explorer}${transaction}`
                })
                return true
            }
            return false
        },
        async claimRewards() {
            if (!this.isSigned) {
                return false
            }
            const abi = StakingPrecompiles.abi;
            const user = this.userAddress
            const globalStore = useGlobalStore()
            const sourceProvider = await returnProvider(globalStore.walletMode);
            const provider = new ethers.providers.Web3Provider(sourceProvider);
            const signer = provider.getSigner();
            const network = harmony.getHarmonyNetwork(globalStore.networkId)
            if (!network) {
                return false
            }
            const contract = new ethers.Contract(network.delegatorAddress, abi, signer);
            const tx = await contract.CollectRewards(user).catch((err: any) => {
                let message;
                if (!err.data?.message) {
                    message = err.message
                } else {
                    message = err.data.message
                }
                toastMe('error', {
                    title: 'Error :',
                    msg: message,
                    link: false
                })
                return
            })
            if (tx !== undefined) {
                let explorer = 'https://explorer.harmony.one/#/tx/'
                let transaction = tx.hash

                toastMe('info', {
                    title: 'Transaction Sent',
                    msg: "Claim request sent to network. Waiting for confirmation",
                    link: false,
                    href: `${explorer}${transaction}`
                })
                await tx.wait(1)
                toastMe('success', {
                    title: 'Tx Successful',
                    msg: "Explore : " + transaction,
                    link: true,
                    href: `${explorer}${transaction}`
                })
                return true
            }
            return false
        },
    }
})
