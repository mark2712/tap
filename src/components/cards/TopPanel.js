import React from 'react';
import { observer } from 'mobx-react-lite';
import cardsStore, {tabsNavigation} from "@/store/CardsStore";
import css from './cards.module.scss';
import {scrollToTop} from "@/helpers/common";



const TopPanel = observer(({panelRef, isSticky}) => {
    const activeTab  = tabsNavigation.nowTab;

    return (
        <div ref={panelRef} className={`${css.topPanel} ${isSticky ? css.sticky : ''}`} onClick={scrollToTop} >
            <div className={css.Tabs}>
                {tabsNavigation.tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={activeTab?.id === tab.id ? css.activeTab : ''}
                        onClick={() => tabsNavigation.nowTab = tab.id}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default TopPanel