import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx'
import mainStore from "@/store/MainStore";
import tabsCardsStore from "@/store/cards/TabsCardsStore";
import coinsStore from "@/store/CoinsStore";
import referalStore from '@/store/ReferalStore';
import navigationStore from '@/store/Navigation';
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import {scrollToTop} from "@/helpers/common";
import css from './menu.module.scss';
import LiItem from './LiItem';



const MenuBottom = observer(() => {
    let coins = toJS(coinsStore.coins);
    let mining_per_second = toJS(coinsStore.mining_per_second);
    let price_on_tap = toJS(mainStore.user?.price_on_tap) || 0;

    return (
        <>
            <ul className={`${css.MenuBottom} ${css.MenuTopBottom}`} onClick={scrollToTop}>
                <LiItem navigationName='TapalkaMain' onClickHandler={
                    (navigationName) => {
                        navigationStore.setActiveSection(navigationName);
                    }
                } text={'Майнинг'} />
                <LiItem navigationName='CardsMain' onClickHandler={
                    (navigationName) => {
                        navigationStore.setActiveSection(navigationName);
                        // tabsCardsStore.getTab(1);
                    }
                } text={'Доход'} />
                {/* <LiItem inDev={true} text={'Мини игры'} /> */}
                {/* <LiItem inDev={true} text={'Задания'}/> */}
                <LiItem navigationName='Referal' onClickHandler={
                    (navigationName) => {
                        navigationStore.setActiveSection(navigationName);
                        referalStore.getReferals();
                    }
                } text={'Рефералы'} />
                <LiItem inDev={true} text={'Настройки'}/>
            </ul>
            <div className={css.BottomLine}>{formatNumberWithSuffix(coins)} — {formatNumberWithSuffix(mining_per_second)} — {formatNumberWithSuffix(price_on_tap)}</div>
            <div className={css.BottomPadding}></div>
        </>
    );
});

export default MenuBottom;