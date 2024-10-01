import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import { toJS } from 'mobx'
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import css from './tapalka.module.scss';


const Params = observer(() => {
    let tapPrice = toJS(mainStore.tapPrice);
    let tapPriceFinally = toJS(mainStore.tapPriceFinally);
    let time_mining = toJS(mainStore.user?.time_mining) || 0;

    return (
        <div className={css.Tapalka_price_on_tap}>
            Базовый доход за тап: <b style={{ fontSize: calculateFontSize(tapPrice, 100) }}>{formatNumber(tapPrice)}</b>
            <br/><br/>
            Доход за тап с энергией: <b style={{ fontSize: calculateFontSize(tapPriceFinally, 100) }}>{formatNumber(tapPriceFinally)}</b>
            <br/><br/>
            Время пассивного дохода: <b style={{ fontSize: calculateFontSize(time_mining, 100) }}>{parseInt(time_mining/3600)} ч.</b> <br/> <small>(когда вы не в игре вам будет начисляться доход в течении этого времени)</small>
            <br/><br/>
        </div>
    );
});

export default Params;