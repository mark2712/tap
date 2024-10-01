import React from 'react';
import { observer } from 'mobx-react-lite';
import css from './energon.module.scss';
import { toJS } from 'mobx';


const Battery = observer(({ battery }) => {
    let timeRemaining = battery.timeRemaining.get();
    let energonPercentage = (battery.energon / battery.card_max_energon) * 100; // Процент заполненности энергии

    return (
        <div className={css.battery} style={{backgroundColor: '#'+battery.color, outline: '0.4vw solid #'+battery.color, border: '0.4vw solid #000'}}>
            <div className={css.overlay}></div>
            <div 
                className={css.energonBar} 
                style={{ width: `${energonPercentage}%`, transition: 'width 0.5s ease-in-out', backgroundColor: timeRemaining <= 0 ? '#'+battery.color : '#00000000' }}
            ></div>
            <div className={css.energonText}>{
                timeRemaining > 0 ? (
                        // `${parseInt(timeRemaining / 60 / 60)}:${String(parseInt((timeRemaining / 60) % 60)).padStart(2, '0')}:${String(timeRemaining % 60).padStart(2, '0')}`
                        `${parseInt(timeRemaining / 60 / 60)}:${(parseInt((timeRemaining / 60) % 60) < 10 ? '0' : '') + parseInt((timeRemaining / 60) % 60)}:${(timeRemaining % 60 < 10 ? '0' : '') + parseInt(timeRemaining % 60)}`
                    ) : (
                        // `${Math.floor(battery.energon)} / ${battery.card_max_energon}`
                        // <>{`🗲${Math.floor(battery.energon)}`}</>
                        <><img src='icons/lightning.svg' className={css.lightning} />{`${Math.floor(battery.energon)}`}</>
                    )
            }</div>
        </div>
    );
});

export default Battery;
