import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';
import TAP from '@/TAPconfig';
import mainStore from "@/store/MainStore";
import coinsStore from "@/store/CoinsStore";


class CardsStore {
    tabs = {};
    packetBuyCards = {};  // Пакет с карточками, которые нужно купить
    sendCards = {}; //эти карточки в процессе отправки (нужно исключительно чтобы заблокировать возможность покупки пока идёт отправка)
    buyCardsIsFetch = false;

    constructor() {
        makeAutoObservable(this);
    }


    async getCards(tab_id) {
        const data = {data:mainStore.authData, tab_id};
        let tab = await mainStore.fetchData(data, TAP.apiUrl + 'get_cards/');
        this.setTab(tab);
    }

    async getTab(tab_id) {
        if(!this.tabs[tab_id] || this.tabs[tab_id]?.update){
            this.getCards(tab_id);
        }
    }


    async buyCard(tabId, cardId) {
        runInAction(() => {
            // Добавляем карточку в пакет, разделённый по вкладкам
            if (!this.packetBuyCards[tabId]) {
                this.packetBuyCards[tabId] = {};
            }
            this.packetBuyCards[tabId]['id' + cardId] = cardId; //'id' нужно чтобы сохранить порядок

            // Блокируем кнопку покупки для этой карты
            this.sendCards['id' + cardId] = true;

            // Если уже идет покупка, просто возвращаемся
            if (this.buyCardsIsFetch) {
                return;
            }

            this.processBuyCards(tabId); // Запуск процесса покупки
        });
    }

    async processBuyCards(tabId) {
        // Проверяем, если уже идет покупка
        if (this.buyCardsIsFetch) {
            return;
        }

        this.buyCardsIsFetch = true; // Помечаем, что запрос на сервер отправляется

        // Копируем пакет покупок для текущей вкладки и очищаем его
        const packetToSend = { ...this.packetBuyCards[tabId] };
        this.packetBuyCards[tabId] = {};

        const data = {
            data: mainStore.authData,
            cards_ids: Object.values(packetToSend),
            tab_id: tabId,
        };

        let res = await mainStore.fetchData(data, TAP.apiUrl + 'buy_cards/');
        if(res){
            this.buyCardResult(res.cards);
            mainStore.user = res;
        }

        // Эти карточки снова можно купить через интерфейс (кнопка покупки снова активна)
        for (let key in packetToSend) {
            delete this.sendCards[key];
        }

        this.buyCardsIsFetch = false; // Помечаем, что запрос завершён

        // Если остались карточки для покупки в этой вкладке, запускаем процесс снова
        if (Object.keys(this.packetBuyCards[tabId]).length > 0) {
            this.processBuyCards(tabId);
        }
    }

    buyCardResult(tab) {
        let tabs = this.tabs;
        runInAction(() => {
            for(let key in tabs){
                tabs[key].update = true;
            }
        });
        this.setTab(tab);
    }

    setTab(tab) {
        runInAction(() => {
            if (typeof tab === "object") {
                this.tabs[tab.id] = tab;
                for (let cardId in this.tabs[tab.id].cards) {
                    let card = this.tabs[tab.id].cards[cardId];
                    let users_cards = card.users_cards;

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

                    card.isPossibleBuy = this.isPossibleBuy(card);
                }
            }
        });
    }

    isPossibleBuy(card) {
        let isOpen_card_lvl = !card.open_card_id || card.open_card__lvl >= card.cards__open_lvl_card;
        return computed(() => {
            let card_max_lvl = !card.users_cards || (card.max_lvl > card.users_cards?.card_lvl);
            let user_lvl = mainStore.user.lvl >= card.open_lvl_users;
            let mining_per_second = coinsStore.mining_per_second >= card.open_mining_per_second_users;
            let price = coinsStore.coins >= card.next_price;
            // console.log(card.id, isOpen_card_lvl, card_max_lvl, user_lvl, mining_per_second, price);
            return {
                buy:( isOpen_card_lvl && card_max_lvl && user_lvl && mining_per_second && price ),
                isOpen_card_lvl, card_max_lvl, user_lvl, mining_per_second, price
            }
        });
    }

    format_card_fields(obj, fields){
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
}


class TabsNavigation {
    nowTabId = 1;
    tabsData = [
        {
            id:1,
            name:'Стартап',
        },
        {
            id:2,
            name:'Бизнес',
        },
        {
            id:3,
            name:'Корпорация',
        },
        {
            id:4,
            name:'Технологии',
        },
        {
            id:5,
            name:'IT',
        },
        {
            id:6,
            name:'Империя',
        },
        {
            id:7,
            name:'Кибер',
        },
        {
            id:8,
            name:'Мета',
        },
    ]

    constructor() {
        makeAutoObservable(this);
    }

    set tabs(tabsData) {
        this.tabsData = tabsData || [];
    }

    get tabs() {
        if(coinsStore.mining_per_second < 100000000n){
            return [this.tabsData[0], this.tabsData[1], this.tabsData[2], this.tabsData[3]];
        }
        return this.tabsData;
    }

    set nowTab(tabId) {
        this.nowTabId = tabId;
        cardsStore?.getTab(tabId);
    }

    get nowTab() {
        let update = cardsStore?.tabs[this.nowTabId]?.update;
        if(update){
            cardsStore.getTab(this.nowTabId);
        }
        let nowTab = this.tabsData.find(tab => tab.id === this.nowTabId);
        return nowTab;
    }
}


const cardsStore = new CardsStore();
export const tabsNavigation = new TabsNavigation();
export default cardsStore;