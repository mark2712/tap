import { makeAutoObservable, computed, IComputedValue, runInAction, autorun, reaction, toJS } from 'mobx';
import mainStore from "@/store/MainStore";
import coinsStore from "@/store/CoinsStore";

import {ICard, IUsersCards, IIsPossibleBuy} from "@/types/card";


class Card implements ICard {
    id = 0;
    title = '';
    comment = '';
    img = '';
    color = '';
    open_mining_per_second_users = 0n;
    mining_per_second = 0n;
    mining_per_tap = 0n;
    next_mining_per_tap = 0n;
    next_mining_per_second = 0n;
    price = 0n;
    next_price = 0n;
    time_mining = 0;
    open_lvl_users = 0;
    coin_multiplier = 0;
    energon = 0;
    max_lvl = 0;
    users_cards = null;

    open_card_id = null;
    open_card_title = null;
    cards__open_lvl_card = null;
    open_card__lvl = null;

    constructor(card: any) {
        makeAutoObservable(this);
        this.setCard(card);
    }
    

    get openMiningPerHourUsers(){
        return this.open_mining_per_second_users * 3600n / mainStore.majorСoefficient;
    }

    get miningPerHour(){
        return this.mining_per_second * 3600n / mainStore.majorСoefficient;
    }

    get nextMiningPerHour(){
        return this.next_mining_per_second * 3600n / mainStore.majorСoefficient;
    }

    get miningPerTap(){
        return this.mining_per_tap / mainStore.majorСoefficient;
    }

    get nextMiningPerTap(){
        return this.next_mining_per_tap / mainStore.majorСoefficient;
    }

    get cardPrice(){
        return this.price * 3600n / mainStore.majorСoefficient;
    }

    get nextCardPrice(){
        return this.next_price * 3600n / mainStore.majorСoefficient;
    }

    get timeMining(){
        return this.time_mining/3600;
    }

    private setCard(card: any): void {
        runInAction(() => {
            //не доверяем серверу и конвертируем все поля в нужные типы
            const formattedCard: ICard = this.formatCardFields(card);
            const formattedUsersCards: IUsersCards | null = this.formatUserCards(card.users_cards);

            const finalCard: ICard = {
                ...formattedCard,
                users_cards: formattedUsersCards,
                isPossibleBuy: this.isPossibleBuyComputed(formattedCard),
            };

            Object.assign(this, finalCard);
        });
    }

    private formatCardFields(card: any): ICard {
        const typeFormat = {
            id: Number,
            title: String,
            comment: String,
            img: String,
            color: String,
            open_mining_per_second_users: BigInt,
            mining_per_second: BigInt,
            mining_per_tap: BigInt,
            next_mining_per_tap: BigInt,
            next_mining_per_second: BigInt,
            price: BigInt,
            next_price: BigInt,
            time_mining: Number,
            open_lvl_users: Number,
            coin_multiplier: Number,
            energon: Number,
            max_lvl: Number,
            open_card_id: Number,
            open_card_title: String,
            cards__open_lvl_card: Number,
            open_card__lvl: Number,
        };

        return this.formatFields(card, typeFormat);
    }


    private formatUserCards(users_cards: any): IUsersCards | null {
        if (!users_cards) return null;

        const typeFormat = {
            id: Number,
            card_lvl: Number,
            energon: Number,
            mining_per_second: BigInt,
            mining_per_tap: BigInt,
            time_mining: Number,
            time_energon_reload: Number,
        };

        return this.formatFields(users_cards, typeFormat);
    }

    private formatFields(obj: any, typeFormat: any) {
        const formatted: any = {};

        for(let key in typeFormat){
            if (obj[key] !== undefined && obj[key] !== null) {
                formatted[key] = typeFormat[key](obj[key]);
            }
        }

        return formatted;
    }

    isPossibleBuyComputed(card: any): IComputedValue<IIsPossibleBuy> {
        let coins = toJS(coinsStore.coins);
        let isOpen_card_lvl = !card.open_card_id || card.open_card__lvl >= card.cards__open_lvl_card;
        return computed(() => {
            let card_max_lvl = !card.users_cards || (card.max_lvl > card.users_cards?.card_lvl);
            let user_lvl = mainStore.user.lvl >= card.open_lvl_users;
            let mining_per_second = coinsStore.mining_per_second >= card.open_mining_per_second_users;
            let price = coins >= card.next_price;
            // console.log(card.id, isOpen_card_lvl, card_max_lvl, user_lvl, mining_per_second, price);
            const res: IIsPossibleBuy= {
                buy:( isOpen_card_lvl && card_max_lvl && user_lvl && mining_per_second && price ),
                isOpen_card_lvl, card_max_lvl, user_lvl, mining_per_second, price, currentTime:coinsStore.currentTime
            }
            return res;
        });
    }
}


export default Card;