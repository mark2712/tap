import {IBattery} from '@/types/energon';

export interface IUserData {
    id: number;
    lvl: number;
    amount_coins: bigint;
    mining_per_second: bigint;
    price_on_tap: bigint;
    time_mining: number;
    time_last_mining: number;
    batteries: IBattery[];
}

export interface IAuthData {
    [key: string]: any;
}