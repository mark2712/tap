import { makeAutoObservable, computed, runInAction, autorun, reaction, toJS } from 'mobx';


class EnergonStore {
    batteriesData = [];
    currentTime = Math.floor(Date.now() / 1000);

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
            (battery) => (battery.time_energon_reload <= this.currentTime)
        );
        return availableBattery || null;
    }

    // Вычисляем время оставшееся для перезарядки для каждой батареи
    batteriesTimeRemaining() {
        for(let key in this.batteriesData){
            let battery = this.batteriesData[key];
            battery.timeRemaining = this.calcTimeRemaining(battery);
        }
    }

    calcTimeRemaining(battery) {
        return computed(() => {
            let timeReload = battery.time_energon_reload - this.currentTime;
            return timeReload;
        });
    }

    //восстановление непотраченой батарейки
    calcActiveRemaining(battery) {
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

    startTimer() {
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

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    reduce(taps) {
        let currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
        let totalTaps = 0;
        let batteries = this.batteries; // Получаем батарейки из хранилища

        runInAction(() => {
            batteries.forEach((battery, index) => {
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

        return parseInt(totalTaps);
    }
}

const energonStore = new EnergonStore();
export default energonStore;