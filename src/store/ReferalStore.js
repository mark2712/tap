import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';
import TAP from '@/TAPconfig';
import mainStore from "@/store/MainStore";


class ReferalStore {
    referals=[];

    constructor() {
        makeAutoObservable(this);
    }

    async getReferals() {
        const data = {data: mainStore.authData};
        let referals = await mainStore.fetchData(data, TAP.apiUrl + 'referal/get_referals/');
        runInAction(() => {
            if(typeof referals === "object"){
                this.referals = referals;
            }
        });
    }
}



const referalStore = new ReferalStore();
export default referalStore;