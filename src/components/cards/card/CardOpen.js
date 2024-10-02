import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import tabsCardsStore from "@/store/cards/TabsCardsStore";
import { toJS } from 'mobx'
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import css from './cards.module.scss';


const Card = observer(({tabId, cardData}) => {
    const sendCard = tabsCardsStore.sendCards['id'+cardData.id];
    const isPossibleBuy = cardData.isPossibleBuy.get();
    const isMaxLvl = cardData.users_cards && (cardData.max_lvl <= cardData.users_cards.card_lvl);

    const buyCardHandler = () => {
        if(!sendCard){
            tabsCardsStore.buyCard(tabId, cardData.id);
        }
    };


    return (
        <div className={css.Card}>
            <div className={css.name}>
                <div className={css.title}>
                    {cardData.title}
                    <div className={css.card_lvl}>{
                        cardData.users_cards ?
                        <>
                            <span className={css.card_lvl_small}>lvl</span> {cardData.users_cards.card_lvl} {isMaxLvl ? ' max' : ''}
                        </>
                        :
                        <div className={css.card_lvl_small}>Не куплено</div>
                    }</div>
                </div>
                <div className={css.buy} onClick={buyCardHandler}>{formatNumberWithSuffix(cardData.next_price)}</div>
            </div>
            <div className={css.bonus}>
                <div className={css.title}>Бонсуы:</div>
                <ul>
                    <>{cardData.next_mining_per_second ? <li>Доход в секунду +{cardData.next_mining_per_second.toString()}</li> : ''}</>
                    <>{cardData.next_mining_per_tap ? <li>Доход за тап +{cardData.next_mining_per_tap.toString()}</li> : ''}</>
                    <>{cardData.time_mining ? <li>Время получения пассивного дохода +{cardData.time_mining}</li> : ''}</>
                    <>{cardData.energon ? <li>energon {cardData.energon}</li> : ''}</>
                </ul>
            </div>
            <div className={css.bonus}>
                <div className={css.title}>Условия покупки:</div>
                <ul>
                    <>{cardData.open_lvl_users > 1 ? <li>open_lvl_users {cardData.open_lvl_users}</li> : ''}</>
                    <>{cardData.open_mining_per_second_users ? <li>Доход в секунду не ниже {cardData.open_mining_per_second_users.toString()}</li> : ''}</>
                    <>{cardData.open_card_title ? 
                        <li>Необходимо иметь <b>{cardData.open_card_title}</b> {
                            cardData.cards__open_lvl_card > 1 ? 
                            <>lvl {cardData.cards__open_lvl_card}</>
                            : ''
                        }</li> : ''}
                    </>
                </ul>
            </div>
            <div className={css.info}>
                <div className={css.comment}>{cardData.comment}</div>
                <div className={css.price} onClick={buyCardHandler}>
                    {
                        sendCard && isPossibleBuy.buy ?
                        'Отправляется'
                        :
                        <>
                            {
                                isPossibleBuy.buy ?
                                <>Купить за {cardData.next_price.toString()}</>
                                :
                                (isMaxLvl ? 'Полностью прокачено' : 'Нельзя купить')
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    );
});

export default Card;