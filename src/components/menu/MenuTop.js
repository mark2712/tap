import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import css from './menu.module.scss';
import LiItem from './LiItem';


const MenuBottom = observer(() => {
    return (
        <>
            <div className={css.MenuTopMarging}></div>
            <ul className={`${css.MenuTop} ${css.MenuTopBottom}`}>
                {/* <li onClick={() => alert('В разработке')}>Прокачка</li> */}
                <LiItem inDev={true} text={'Достижения'} />
                <LiItem inDev={true} text={'Магазин'} />
                <LiItem inDev={true} text={'Инвестиции'} />
                <LiItem inDev={true} text={'Настройки'} />
            </ul>
        </>
    );
});

export default MenuBottom;