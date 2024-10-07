import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';
import energonStore from "@/store/EnergonStore";
import {Timer} from '@/types/timer';
import {IUserData} from '@/types/user';


export interface TapsPacket {
    get: boolean;
    taps: number;
}

export interface TapsPackets {
    [key: number]: TapsPacket;
}


class CoinsStore {
    public tapPrice: bigint = 0n;
    public TapsPackets: TapsPackets = {}; // Объект для хранения тапов
    public coins: bigint = 0n;
    public mining_per_second: bigint = 0n;
    public time_mining: number = 0;
    public currentTime: number = Math.floor(Date.now() / 1000); //костыль-оптимизация - позволяет вместо coins (могут обновляться очень быстро) использовать currentTime чтобы снизить количество обновлений

    private taps: number = 0;
    private miningEndTime: number | null = null; // Время, когда заканчивается добыча (time_mining)
    private miningTimer?: Timer;
    private timer?: Timer;
    private lastUpdateTime: number = performance.now();
    private fractionalPart:number = 0;

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
    async incTapsClient(tapCount: number) {
        this.addTap(tapCount);

        runInAction(() => {
            this.coins += BigInt(energonStore.reduce(tapCount)) * BigInt(this.tapPrice);
        });
    }

    //получить данные с сервера и вычислить текущее число монет как монеты с сервера + монеты в неотправленных тапах
    clacNowCoins(userData: IUserData){
        if (!userData) {
            return console.log('Данные не загружены');
        }
        runInAction(() => {
            this.tapPrice = BigInt(userData.price_on_tap);
            this.coins = BigInt(userData.amount_coins) + this.tapPriceFinally * BigInt(Object.values(this.TapsPackets).reduce((sum, tapData) => sum + tapData.taps, 0));
            this.mining_per_second = BigInt(userData.mining_per_second);
            this.time_mining = userData.time_mining;
            this.miningEndTime = Date.now() + Number(this.time_mining) * 1000; // Время окончания добычи
        });
    }

    addTap(count: number) {
        const timestamp = Date.now(); // Получаем текущее время в миллисекундах
        runInAction(() => {
            this.taps += count; // Увеличиваем количество тапов на клиенте
            this.TapsPackets[timestamp] = {
                get: false,
                taps: count,
            };
        });
    }

    //Формируем пакет с тапами
    formPacket() {
        const packet:TapsPackets = {};

        runInAction(() => {
            for (const [key, tapData] of Object.entries(this.TapsPackets)) {
                if (!tapData.get) {
                    const timestamp = Number(key);
                    packet[timestamp] = { ...tapData };
                    this.TapsPackets[timestamp].get = true; //ставим метку что тапы отправляются
                }
            }
        });

        return packet;
    }

    //удаляем успешно отправленные тапы
    confirmPacket(packet: TapsPackets) {
        runInAction(() => {
            for (const key of Object.keys(packet)) {
                const timestamp = Number(key);
                delete this.TapsPackets[timestamp];
            }
        });
    }

    //Отменить отпраку тапов (на тех пакетах которые помечены как отправляющиеся снова ставим метку неотправленных)
    revertPacket(packet: TapsPackets) {
        runInAction(() => {
            for (const key of Object.keys(packet)) {
                const timestamp = Number(key);
                if (this.TapsPackets[timestamp]) {
                    this.TapsPackets[timestamp].get = false;
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

    timerCurrentTime(time = 1000) {
        this.timer = setInterval(() => {
            runInAction(() => {
                this.currentTime = Math.floor(Date.now() / 1000);
            });
        }, time);
    }

    clearMiningTimer() {
        if (this.miningTimer) {
            clearInterval(this.miningTimer);
            this.miningTimer = null;
        }
    }
    
    clearCurrentTime() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}


const coinsStore = new CoinsStore();
coinsStore.setMiningTimer();

export default coinsStore;
