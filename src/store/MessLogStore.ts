import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';

export type statusTypes = 'load' | 'err' | 'ok';

export interface ILogMessage {
    status: statusTypes;
    res: any;
    info: string;
    url: string;
    display: boolean;
}

class MessLogStore {
    firstLoad: boolean = true;
    data: ILogMessage[] = [{
        status: 'load',
        res: 'Загрузка...',
        info: 'Загрузка...',
        url: '',
        display: true,
    }];

    constructor() {
        makeAutoObservable(this);
    }

    setFirstLoad() {
        runInAction(() => {
            this.firstLoad = false;
        });
    }

    setStatus(status: statusTypes, res: any, info: string, url: string) {
        runInAction(() => {
            const newMess: ILogMessage = {
                status,
                res,
                info,
                url,
                display: status !== 'ok', // Установка display в зависимости от статуса
            };

            if (status === 'err') {
                console.error(info, res); // Используйте console.error для ошибок
            }

            this.data.push(newMess);
            if (this.data.length > 100) {
                this.data.splice(0, 1); // Удаляем самый старый лог, если их больше 100
            }
        });
    }

    logClose(lastMess: ILogMessage) {
        runInAction(() => {
            lastMess.display = false;
        });
    }
}

const messLogStore = new MessLogStore();
export default messLogStore;