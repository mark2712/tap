import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';
import coinsStore from "@/store/CoinsStore";
import tabsCardsStore from "@/store/cards/TabsCardsStore";

interface ITabData {
    id: number,
    name: string
}

type TabsData = ITabData[];


class TabsNavigation {
    nowTabId: number = 1;
    tabsData: TabsData = [
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

    set tabs(tabsData: TabsData) {
        this.tabsData = tabsData || [];
    }

    get tabs(): TabsData {
        if(coinsStore.mining_per_second < 100000000n){
            return [this.tabsData[0], this.tabsData[1], this.tabsData[2], this.tabsData[3]];
        }
        return this.tabsData;
    }

    set nowTab(tabId: number) {
        this.nowTabId = tabId;
        tabsCardsStore?.getTab(tabId);
    }

    get nowTab():ITabData {
        tabsCardsStore.getTab(this.nowTabId);
        let nowTab: ITabData = this.tabsData.find(tab => tab.id === this.nowTabId) || this.tabsData[0];
        return nowTab;
    }
}


const tabsNavigation = new TabsNavigation();
export default tabsNavigation;