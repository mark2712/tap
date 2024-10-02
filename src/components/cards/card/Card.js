import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import tabsCardsStore from "@/store/cards/TabsCardsStore";
import { toJS } from 'mobx'
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import css from './card.module.scss';


const CardSmall = observer(({tabId, cardData}) => {
    const sendCard = tabsCardsStore.sendCards['id'+cardData.id];
    const isPossibleBuy = cardData.isPossibleBuy.get();;
    const isMaxLvl = cardData.users_cards && (cardData.max_lvl <= cardData.users_cards.card_lvl);

    const buyCardHandler = () => {
        if(!sendCard){
            tabsCardsStore.buyCard(tabId, cardData.id);
        }
    };


    return (
        <div className={css.Card}>
            <div className={css.img}></div>
            <div className={css.name}>
                <div className={css.title}>
                    {cardData.title}
                </div>
                <div className={css.bonus}>
                    <span>
                        <>{cardData.next_mining_per_second ? <span>Доход +{cardData.nextMiningPerHour.toString()}{" "}</span> : ''}</>
                        <>{cardData.next_mining_per_tap ? <span>Тап +{cardData.nextMiningPerTap.toString()}{" "}</span> : ''}</>
                        <>{cardData.time_mining ? <span>Время пассивного дохода +{cardData.timeMining}{" "}</span> : ''}</>
                        <>{cardData.energon ? <span>energon {cardData.energon}{" "}</span> : ''}</>
                    </span>
                </div>
                <div className={css.bonus}>
                    <span>
                        <>{cardData.open_lvl_users > 1 && !isPossibleBuy.user_lvl ? <div>open_lvl_users {cardData.open_lvl_users}{" "}</div> : ''}</>
                        <>{cardData.open_mining_per_second_users && !isPossibleBuy.mining_per_second ?
                            <div>Доход в час не ниже {cardData.openMiningPerHourUsers.toString()}{" "}</div> 
                        : ''}</>
                        <>{cardData.open_card_title && cardData.open_card__lvl < cardData.cards__open_lvl_card ? 
                            <div><b>{cardData.open_card_title}</b> {
                                cardData.cards__open_lvl_card > 1 ? 
                                <>lvl {cardData.cards__open_lvl_card}</>
                                : ''
                            }</div> : ''}
                        </>
                    </span>
                </div>
            </div>
            <div className={css.buy} onClick={buyCardHandler}>
                <div className={css.buyLvl}>
                    {cardData.users_cards ? (
                        isMaxLvl ? 'max' : cardData.users_cards.card_lvl
                    )
                    :
                    '0'}
                </div>
                {
                    isMaxLvl ? 
                    ''
                    :
                    <>
                        <div className={css.buySep}></div>
                        <div className={`${css.buyPrice} ${isPossibleBuy.buy ? `` : css.buyPriceNo}`}>
                            {sendCard ? '•••' : formatNumberWithSuffix(cardData.next_price / mainStore.majorСoefficient)}
                        </div>
                    </>
                }
            </div>
            <div className={css.bottomShadow}></div>
        </div>
    );
});

export default CardSmall;