import {ICard} from '@/types/card';

export interface ITab {
    id: number;
    title: string;
    update?: boolean;
    cards: {
        [key: string]: ICard
    };
}

export interface ITabs {
    [key: string]: ITab
}