import React from 'react';
import { observer } from 'mobx-react-lite';
import navigationStore from "@/store/Navigation";
import cardsStore, {tabsNavigation} from "@/store/CardsStore";
import { toJS } from 'mobx'
import css from './cards.module.scss';
import Tab from './Tab';
import TopPanel from './TopPanel';


const CardsMain = observer(() => {
    const activeTab  = tabsNavigation.nowTab;

    const [isSticky, setSticky] = React.useState(false);
    const panelRef = React.useRef(null);

    // const handleScroll = () => {
    //     if (panelRef.current) {
    //         setTimeout(() => {
    //             const offsetBottom = panelRef.current.getBoundingClientRect().bottom || 1000;
    //             setSticky(offsetBottom <= 0);
    //         }, 0);
    //     }
    // };

    // React.useEffect(() => {
    //     const resizeObserver = new ResizeObserver(() => handleScroll());
        
    //     if (panelRef.current) {
    //         resizeObserver.observe(panelRef.current);
    //     }
    
    //     window.addEventListener('scroll', handleScroll);
    
    //     // Вызов при монтировании
    //     handleScroll();
    
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //         resizeObserver.disconnect(); // Отключаем observer при размонтировании
    //     };
    // }, []);

    return (
        <div className={css.CardsMain} style={{ display: (navigationStore.getNav('CardsMain'))? 'block':'none' }}>
            <TopPanel panelRef={panelRef} isSticky={false} />
            {/* {isSticky && <TopPanel isSticky={true} />} */}
            {activeTab?.id ? <Tab tabId={activeTab.id} /> : 'Нет активной вкладки'}
        </div>
    );
});

export default CardsMain;