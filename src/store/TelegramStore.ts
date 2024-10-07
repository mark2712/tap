import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';
import commonData from '@/commonData/data';

import {IAuthData} from '@/types/user';

declare global {
    interface Window {
        Telegram: any;
    }
}

class TelegramStore {
    isDev = (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id && typeof process !== 'undefined' && process?.env?.NODE_ENV == "development");

    constructor() {
        makeAutoObservable(this);
    }

    async setTelegramData(): Promise<IAuthData> {
        if (this.isDev) {
            return JSON.parse(commonData.telegramData); //для теста эмулируем загрузку данных о пользователе с телеграмм
        }

        // Возвращаем Promise, который будет разрешён, когда Telegram.WebApp будет доступен
        return new Promise((resolve, reject) => {
            const checkTelegramWebApp = () => {
                if (window.Telegram?.WebApp) {
                    // Если WebApp доступен, делаем его готовым и расширяем
                    window.Telegram.WebApp.ready();
                    window.Telegram.WebApp.expand();
                    resolve(window.Telegram.WebApp); // Разрешаем Promise с результатом
                } else {
                    setTimeout(checkTelegramWebApp, 100); // Если WebApp ещё не загружен, проверяем снова через 100 мс
                }
            };

            checkTelegramWebApp(); // Запуск проверки
        });
    }
}

const telegramStore = new TelegramStore();
export default telegramStore;