import React from 'react';
import { observer } from 'mobx-react-lite';
import css from './menu.module.scss';
import navigationStore from '@/store/Navigation';


const LiItem = observer(({navigationName, onClickHandler, inDev, img, text}) => {
    return (
        <li 
            className={inDev ? css.inDev : (navigationStore.nav[navigationName]?.active ? css.activeLi : '')} 
            onClick={inDev ? () => alert('В разработке') : ()=>{onClickHandler(navigationName)}} 
        >
            <div className={css.imgIcon}></div>
            <div>{text}</div>
        </li>
    );
});

export default LiItem;