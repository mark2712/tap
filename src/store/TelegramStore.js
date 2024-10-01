import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';
import commonData from '@/commonData/data';


class TelegramStore {
    isDev = (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id && typeof process !== 'undefined' && process?.env?.NODE_ENV == "development");
    mainStore = {};

    constructor() {
        makeAutoObservable(this,{
            mainStore:false
        });
    }

    async setTelegramData(mainStore) {
        this.mainStore = mainStore;
        
        if (this.isDev) {
            mainStore.authData = JSON.parse(commonData.telegramData); //для теста эмулируем загрузку данных о пользователе с телеграмм
            await mainStore.firstUserDataLoad();
            return;
        }

        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();

            mainStore.authData = window.Telegram.WebApp;
            await mainStore.firstUserDataLoad();
        }else{
            setTimeout(() => {
                this.setTelegramData(this.mainStore);
            }, 100);
        }
    }
}

const telegramStore = new TelegramStore();
export default telegramStore;