export interface IReferal {
    id: number;
    time_creation: string;
    time_creation_unix: number;
    username: string;
    lvl: number;
    amount_coins: bigint;
    mining_per_second: bigint;
    price_on_tap: bigint;
}