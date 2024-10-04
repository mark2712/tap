import { makeAutoObservable, computed, IComputedValue, runInAction, autorun, reaction, toJS } from 'mobx';
import mainStore from "@/store/MainStore";
import coinsStore from "@/store/CoinsStore";

import {ICard, IIsPossibleBuy} from "@/types/card";


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

    setCard(card: any) {
        runInAction(() => {
            //не доверяем серверу и конвертируем все поля в нужные типы
            card = this.format_card_fields(card, [
                ['coin_multiplier', Number],
                ['energon', Number],
                ['max_lvl', Number],
                ['open_card__lvl', Number],
                ['cards__open_lvl_card', Number],
                ['open_lvl_users', Number],
                ['time_mining', Number],
                ['open_mining_per_second_users', BigInt],
                ['mining_per_second', BigInt],
                ['mining_per_tap', BigInt],
                ['price', BigInt],
                ['next_price', BigInt],
                ['next_mining_per_second', BigInt],
                ['next_mining_per_tap', BigInt],
            ]);

            let users_cards = card.users_cards;
            if(users_cards){
                card.users_cards = this.format_card_fields(users_cards, [
                    ['card_lvl', Number],
                    ['energon', Number],
                    ['mining_per_second', BigInt],
                    ['mining_per_tap', BigInt],
                    ['time_mining', Number],
                    ['time_energon_reload', Number],
                ]);
            }
            card.isPossibleBuy = this.isPossibleBuyComputed(card);

            Object.assign(this, card);
        });
    }

    format_card_fields(obj: any, fields: [string, Function][]){
        if(obj){
            for (let i = 0; i < fields.length; i++) {
                const field_neme = fields[i][0];
                const func = fields[i][1];
                if(obj[field_neme] && func){
                    obj[field_neme] = func(obj[field_neme]);
                }
                
            }
        }
        return obj; 
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