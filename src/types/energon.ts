import { IComputedValue } from "mobx";

export interface IBattery {
    users_cards__id: number;
    cards__id: number;
    energon: number;
    time_energon_reload: number;
    last_energon_reload: number;
    title: string;
    img: string;
    color: string;
    card_max_energon: number;
    multiplier: number;
    period_reload: number;
    remainingLock: boolean;
    timeRemaining:IComputedValue<number>;
}

export type IBatteries = IBattery[];