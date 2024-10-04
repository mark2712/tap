import { makeAutoObservable, runInAction, autorun, reaction, toJS } from 'mobx';
import TAP from '@/TAPconfig';
import mainStore from "@/store/MainStore";

import {IReferal} from '@/types/referal';


class ReferalStore {
    referals: IReferal[] = [];
    
    constructor() {
        makeAutoObservable(this);
    }

    async getReferals() {
        const data = {data: mainStore.authData};
        let referals: any = await mainStore.fetchData(data, TAP.apiUrl + 'referal/get_referals/');
        runInAction(() => {
            if (Array.isArray(referals)) {
                this.referals = referals.map((referal: any) => ({
                    id: Number(referal.id),
                    time_creation: referal.time_creation,
                    time_creation_unix: Number(referal.time_creation_unix),
                    username: referal.username,
                    lvl: Number(referal.lvl),
                    amount_coins: BigInt(referal.amount_coins),
                    mining_per_second: BigInt(referal.mining_per_second),
                    price_on_tap: BigInt(referal.price_on_tap),
                }));
            }
        });
    }
}



const referalStore = new ReferalStore();
export default referalStore;