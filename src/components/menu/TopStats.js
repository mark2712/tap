import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx'
import mainStore from "@/store/MainStore";
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import css from './menu.module.scss';


const MenuBottom = observer(() => {
    return (
        <>
            <div className={css.MenuTopMarging}></div>
            <div className={`${css.MenuTop} ${css.MenuTopBottom} ${css.TopStats}`}>
                <div className={css.item}><b>{formatNumberWithSuffix(toJS(mainStore.coins))}<br/></b>монет</div>
                <div className={css.item} style={{textAlign:'center'}}><b>{formatNumberWithSuffix(toJS(mainStore.miningPerHour))}</b>доход</div>
                <div className={css.item} style={{textAlign:'right'}}><b>{formatNumberWithSuffix(toJS(mainStore.tapPrice))}</b>тап</div>
            </div>
        </>
    );
});

export default MenuBottom;