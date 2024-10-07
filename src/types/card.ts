import { IComputedValue } from "mobx";

export interface IUsersCards {
    id: number;
    card_lvl: number;
    energon: number;
    mining_per_second: bigint;
    mining_per_tap: bigint;
    time_energon_reload: number;
    time_mining: number;
}

export interface IIsPossibleBuy {
    buy: boolean;
    isOpen_card_lvl: boolean;
    card_max_lvl: boolean;
    user_lvl: boolean;
    mining_per_second: boolean;
    price: boolean;
    currentTime: number
}

export interface ICard {
    id: number;
    title: string;
    comment: string;
    img: string;
    color: string;
    open_lvl_users: number;
    open_mining_per_second_users: bigint;
    mining_per_second: bigint;
    mining_per_tap: bigint;
    next_mining_per_second: bigint;
    next_mining_per_tap: bigint;
    price: bigint;
    next_price: bigint;
    time_mining: number;
    coin_multiplier: number;
    energon: number;
    max_lvl: number;

    open_card_id: number | null;
    open_card_title: string | null;
    cards__open_lvl_card: number | null;
    open_card__lvl: number | null;

    users_cards: IUsersCards | null;

    isPossibleBuy?: IComputedValue<IIsPossibleBuy>;

    openMiningPerHourUsers: bigint;
    miningPerHour: bigint;
    nextMiningPerHour: bigint;
    miningPerTap: bigint;
    nextMiningPerTap: bigint;
    cardPrice: bigint;
    nextCardPrice: bigint;
    timeMining: number;
}