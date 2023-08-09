export interface Undelegation {
    Amount: number;
    Epoch: number;
}

export interface ValidatorInfo {
    "bls-public-keys": any[];
    "last-epoch-in-committee": number;
    "min-self-delegation": number;
    "max-total-delegation": number;
    rate: string;
    "max-rate": string;
    "max-change-rate": string;
    "update-height": number;
    name: string;
    identity: string;
    website: string;
    "security-contact": string;
    details: string;
    "creation-height": number;
    address: string;
    delegations: any[];
    hasLogo: boolean;
    self_stake: number;
    total_stake: string;
    average_stake: string;
    average_stake_by_bls: number;
    remainder: string;
    voting_power?: any;
    signed_blocks: number;
    blocks_should_sign: number;
    uctDate: Date;
    index: number;
    active_nodes: number;
    elected_nodes: number;
    active: boolean;
    last_apr: string;
    epoch_apr: any[];
    lifetime_reward_accumulated: number;
    uptime_percentage: number;
    apr: number;
}

export interface Delegation {
    Undelegations: Undelegation[];
    amount: number;
    delegator_address: string;
    reward: number;
    percentage?: string;
    validator_address: string;
    validator_info: ValidatorInfo;
}