import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import cardsStore from "@/store/CardsStore";
import { toJS } from 'mobx'
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import css from './cardsSmall.module.scss';


const CardSmall = observer(({tabId, cardData}) => {
    const sendCard = cardsStore.sendCards['id'+cardData.id];
    const isPossibleBuy = cardData.isPossibleBuy.get();;
    const isMaxLvl = cardData.users_cards && (cardData.max_lvl <= cardData.users_cards.card_lvl);

    const next_mining_per_second = (cardData.next_mining_per_second * 3600n / mainStore.majorСoefficient).toString();
    const next_mining_per_tap = (cardData.next_mining_per_tap / mainStore.majorСoefficient).toString();
    const open_mining_per_second_users = (cardData.open_mining_per_second_users * 3600n / mainStore.majorСoefficient).toString();

    const buyCardHandler = () => {
        if(!sendCard){
            cardsStore.buyCard(tabId, cardData.id);
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
                        <>{cardData.next_mining_per_second ? <span>Доход +{next_mining_per_second}{" "}</span> : ''}</>
                        <>{cardData.next_mining_per_tap ? <span>Тап +{next_mining_per_tap}{" "}</span> : ''}</>
                        <>{cardData.time_mining ? <span>Время пассивного дохода +{cardData.time_mining/3600}{" "}</span> : ''}</>
                        <>{cardData.energon ? <span>energon {cardData.energon}{" "}</span> : ''}</>
                    </span>
                </div>
                <div className={css.bonus}>
                    <span>
                        <>{cardData.open_lvl_users > 1 && !isPossibleBuy.user_lvl ? <div>open_lvl_users {cardData.open_lvl_users}{" "}</div> : ''}</>
                        <>{cardData.open_mining_per_second_users && !isPossibleBuy.mining_per_second ? <div>Доход в час не ниже {open_mining_per_second_users}{" "}</div> : ''}</>
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