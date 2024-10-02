import React from 'react';
import { observer } from 'mobx-react-lite';
import css from './cards.module.scss';
import tabsCardsStore from "@/store/cards/TabsCardsStore";
import Card from './card/Card';
import { toJS } from 'mobx'


const Tab = observer(({tabId}) => {
    const tab = tabsCardsStore.tabs[tabId];
    const cards = tab?.cards;

    return (
        <div className={css.Tab}>
            {
                tab ? 
                <>
                    {/* <div>{tab.title}</div> */}
                    <>
                        {
                            cards ? (
                                Object.keys(cards).length > 0 ? 
                                    <>
                                        {
                                            Object.keys(cards).map((key) =>(
                                                <Card key={cards[key].id} tabId={tabId} cardData={cards[key]} />
                                            ))
                                        }
                                        <div className={css.emptyCard}></div>
                                    </>
                                : <div className={css.loading}>Нет доступных для покупки карточек</div>
                            ) : <div className={css.loading}>Загрузка...</div>
                        }
                    </>
                </>
                : <div className={css.loading}>Загрузка...</div>
            }
        </div>
    );
});

export default Tab;