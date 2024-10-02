import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';
import mainStore from "@/store/MainStore";
import energonStore from "@/store/EnergonStore";


class CoinsStore {
    taps = 0;
    tapPrice = 0n;
    tapsPacket = {}; // Объект для хранения тапов
    coins = 0n;
    mining_per_second = 0n;
    time_mining = 0;
    miningEndTime = null; // Время, когда заканчивается добыча (time_mining)
    miningTimer;
    lastUpdateTime = performance.now();
    fractionalPart;
    currentTime = Math.floor(Date.now() / 1000); //костыль-оптимизация - позволяет вместо coins (могут обновляться очень быстро) использовать currentTime чтобы снизить количество обновлений

    constructor() {
        makeAutoObservable(this);
        this.timerCurrentTime();
    }

    get tapPriceFinally() {
        let activeBattery = energonStore.activeBattery;
        let multiplier = activeBattery?.multiplier || 1;
        if(multiplier){
            return this.tapPrice * BigInt(multiplier);
        }else{
            return this.tapPrice;
        }
    }

    //используется в компоненте как событие тапа
    async incTapsClient(tapCount) {
        if (!mainStore.user) {
            return console.log('Данные не загружены');
        }

        this.addTap(tapCount);

        runInAction(() => {
            this.coins += BigInt(energonStore.reduce(tapCount)) * BigInt(mainStore.user.price_on_tap);
        });
    }

    //получить данные с сервера и вычислить текущее число монет как монеты с сервера + монеты в неотправленных тапах
    clacNowCoins(userData){
        if (!userData.data) {
            return console.log('Данные не загружены');
        }
        runInAction(() => {
            this.tapPrice = BigInt(userData.data.price_on_tap);
            this.coins = BigInt(userData.data.amount_coins) + this.tapPriceFinally * BigInt(Object.values(this.tapsPacket).reduce((sum, tapData) => sum + tapData.taps, 0));
            this.mining_per_second = BigInt(userData.data.mining_per_second);
            this.time_mining = userData.data.time_mining;
            this.miningEndTime = Date.now() + Number(this.time_mining) * 1000; // Время окончания добычи
        });
    }

    addTap(count) {
        const timestamp = Date.now(); // Получаем текущее время в миллисекундах
        runInAction(() => {
            this.taps += count; // Увеличиваем количество тапов на клиенте
            this.tapsPacket[timestamp] = {
                get: false,
                taps: count,
            };
        });
    }

    //Формируем пакет с тапами
    formPacket() {
        const packet = {};

        runInAction(() => {
            for (const [timestamp, tapData] of Object.entries(this.tapsPacket)) {
                if (!tapData.get) {
                    packet[timestamp] = { ...tapData };
                    this.tapsPacket[timestamp].get = true; //ставим метку что тапы отправляются
                }
            }
        });

        return packet;
    }

    //удаляем успешно отправленные тапы
    confirmPacket(packet) {
        runInAction(() => {
            for (const timestamp of Object.keys(packet)) {
                delete this.tapsPacket[timestamp];
            }
        });
    }

    //Отменить отпраку тапов (на тех пакетах которые помечены как отправляющиеся снова ставим метку неотправленных)
    revertPacket(packet) {
        runInAction(() => {
            for (const timestamp of Object.keys(packet)) {
                if (this.tapsPacket[timestamp]) {
                    this.tapsPacket[timestamp].get = false;
                }
            }
        });
    }


    // Устанавливаем новый таймер
    setMiningTimer(time = 110) {
        const updateCoins = () => {
            const now = performance.now();
            const elapsedTime = (now - this.lastUpdateTime) / 1000;
            this.lastUpdateTime = now;

            // Проверка, истекло ли время добычи
            if (this.miningEndTime && Date.now() >= this.miningEndTime) {
                return;
            }

            runInAction(() => {
                // Вычисляем добавляемую часть монет за прошедшее время
                let fractionalPart = this.fractionalPart || 0;
                fractionalPart += Number(this.mining_per_second) * elapsedTime;

                const wholePart = Math.floor(fractionalPart);
                fractionalPart -= wholePart;

                this.fractionalPart = fractionalPart;
                this.coins += BigInt(wholePart);
            });
        };

        this.lastUpdateTime = performance.now();
        this.miningTimer = setInterval(updateCoins, time);
    }

    clearMiningTimer() {
        if (this.miningTimer) {
            clearInterval(this.miningTimer);
            this.miningTimer = null;
        }
    }

    timerCurrentTime(time = 1000) {
        this.timer = setInterval(() => {
            runInAction(() => {
                this.currentTime = Math.floor(Date.now() / 1000);
            });
        }, time);
    }
}


const coinsStore = new CoinsStore();
coinsStore.setMiningTimer();

export default coinsStore;
