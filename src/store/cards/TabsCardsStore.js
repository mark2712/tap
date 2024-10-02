import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';
import TAP from '@/TAPconfig';
import mainStore from "@/store/MainStore";
import Card from "@/store/cards/Card";


class TabsCardsStore {
    tabs = {}; //вкладки с карточками

    packetBuyCards = {};  // Пакет с карточками, которые нужно купить
    sendCards = {}; //эти карточки в процессе отправки (нужно исключительно чтобы заблокировать возможность покупки пока идёт отправка)
    buyCardsIsFetch = false; //нужно для блокировки кнопок

    constructor() {
        makeAutoObservable(this);
    }

    async getTab(tab_id) {
        if(!this.tabs[tab_id] || this.tabs[tab_id]?.update){
            this.getTabFetch(tab_id);
        }
    }

    async getTabFetch(tab_id) {
        const data = {data:mainStore.authData, tab_id};
        let tab = await mainStore.fetchData(data, TAP.apiUrl + 'get_cards/');
        this.setTab(tab);
    }

    setTab(tab) {
        runInAction(() => {
            if (typeof tab === "object") {
                this.tabs[tab.id] = tab;
                for (let cardId in this.tabs[tab.id].cards) {
                    let card = this.tabs[tab.id].cards[cardId];
                    this.tabs[tab.id].cards[cardId] = new Card(card);
                }
            }
        });
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
}



const tabsCardsStore = new TabsCardsStore();
export default tabsCardsStore;