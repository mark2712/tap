import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';


class MessLogStore {
    firstLoad = true;

    data = [{
        status:'load', //load err ok
        res:'Загрузка...',
        info:'Загрузка...',
        url:'',
        display:true,
    }];

    constructor() {
        makeAutoObservable(this);
    }

    setFirstLoad(){
        runInAction(() => {
            this.firstLoad = false;
        });
    }

    setStatus(status, res, info, url){
        runInAction(() => {
            let newMess = {};
            newMess.status = status;
            newMess.res = res;
            newMess.info = info;
            newMess.url = url;
            newMess.display = newMess.status !== 'ok';
            newMess.logClose = this.logClose;
            if(status === 'err'){
                console.log(info, res.message);
            }
            this.data.push(newMess);
            if(this.data.length > 100){
                this.data.splice(0, 1);
            }
        });
    }

    logClose(lastMess){
        runInAction(() => {
            lastMess.display = false;
        });
    }
}


const messLogStore = new MessLogStore();
export default messLogStore;