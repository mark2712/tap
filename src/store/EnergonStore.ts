import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';
import {IBattery, IBatteries} from '@/types/energon';
import {Timer} from '@/types/timer';


class EnergonStore {
    private batteriesData: IBatteries = [];
    public currentTime: number = Math.floor(Date.now() / 1000);
    private timer: Timer;

    constructor() {
        makeAutoObservable(this);
    }

    get batteries(){
        return this.batteriesData || [];
    }

    set batteries(batteries){
        if(typeof batteries === "object"){
            runInAction(() => {
                this.batteriesData = batteries;
                this.batteriesTimeRemaining();
                this.stopTimer();
                this.startTimer();
            });
        }
    }

    get activeBattery() {
        const availableBattery = this.batteries.find(
            (battery: IBattery) => (battery.time_energon_reload <= this.currentTime)
        );
        return availableBattery || null;
    }

    // Вычисляем время оставшееся для перезарядки для каждой батареи
    private batteriesTimeRemaining() {
        for(let key in this.batteriesData){
            let battery: IBattery = this.batteriesData[key];
            battery.timeRemaining = this.calcTimeRemaining(battery);
        }
    }

    private calcTimeRemaining(battery: IBattery) {
        return computed(() => {
            let timeReload: number = battery.time_energon_reload - this.currentTime;
            return timeReload;
        });
    }

    //восстановление непотраченой батарейки
    private calcActiveRemaining(battery: IBattery) {
        if(battery.remainingLock){
            return battery.energon; //пока клиент-сервер не синхронизированы восстановление невозможно (так как на сервере ещё ничего не потрачено и не чего восстанавливать)
        }
        let rechargeSpeed = Number(battery.card_max_energon) / (Number(battery.period_reload) * 3);
        let newEnergon = rechargeSpeed + Number(battery.energon);
        if(newEnergon > battery.card_max_energon){
            return battery.card_max_energon;
        }
        return newEnergon;
    }

    private startTimer() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                runInAction(() => {
                    this.currentTime = Math.floor(Date.now() / 1000);
                    for(let key in this.batteriesData){
                        let battery = this.batteriesData[key];
                        battery.energon = this.calcActiveRemaining(battery)
                    }
                });
            }, 1000);
        }
    }

    private stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    public reduce(taps: number): number {
        let currentTime: number = Math.floor(Date.now() / 1000); // Текущее время в секундах
        let totalTaps: number = 0;
        let batteries = this.batteries; // Получаем батарейки из хранилища

        runInAction(() => {
            batteries.forEach((battery: IBattery, index) => {
                if (battery.time_energon_reload > currentTime) {
                    return; // Пропускаем батарейки, которые на перезарядке
                }

                //если батарейка полная то она не заряжается пока её заряд полный на сервере
                if(battery.energon == battery.card_max_energon){
                    battery.remainingLock = true;
                }

                // Если энергии достаточно для покрытия всех тапов
                if (battery.energon >= taps) {
                    totalTaps += taps * battery.multiplier;
                    battery.energon -= taps;
                    taps = 0;

                    // Если энергия батареи закончилась
                    if (battery.energon === 0) {
                        battery.energon = battery.card_max_energon;
                        battery.time_energon_reload = currentTime + battery.period_reload;
                    }
                } else {
                    // Если тапов больше, чем энергии в батарее
                    totalTaps += battery.energon * battery.multiplier;
                    taps -= battery.energon;
                    battery.energon = battery.card_max_energon;
                    battery.time_energon_reload = currentTime + battery.period_reload;
                }

                // Обновляем батарейку в хранилище
                this.batteries[index] = battery;
            });

            // Оставшиеся тапы без множителя
            if (taps > 0) {
                totalTaps += taps;
            }
        });

        return parseInt(String(totalTaps));
    }
}

const energonStore = new EnergonStore();
export default energonStore;