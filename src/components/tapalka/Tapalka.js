import React from 'react';
import { observer } from 'mobx-react-lite';
import coinsStore from "@/store/CoinsStore";
import mainStore from "@/store/MainStore";
import { toJS } from 'mobx'
import { formatNumber, calculateFontSize, formatNumberExponent, formatNumberWithSuffix } from "@/helpers/formatNumber";
import css from './tapalka.module.scss';


const TapEffect = ({ x, y, onAnimationEnd, tapId }) => {
    let tapPrice = toJS(mainStore.tapPriceFinally);

    function deleteComponent(){
        setTimeout(() => {onAnimationEnd(tapId)}, 1000);
    }
    
    return (
        <div className={css.tapEffect} style={{ top: y, left: x }} onAnimationStart={deleteComponent} onAnimationEnd={onAnimationEnd}>
            +{formatNumberWithSuffix(tapPrice)}
        </div>
    );
};


const Tapalka = observer(() => {
    let coins = toJS(mainStore.coins);
    let miningPerHour = toJS(mainStore.miningPerHour);
    const [taps, setTaps] = React.useState([]);

    const handlePointerDown = (event) => {
        const x = event.clientX;
        const y = event.clientY;
        const tapId = Date.now();

        setTaps([...taps, { id: tapId, x, y }]);

        if (event.pointerType === 'touch') {
            // Обработка касаний
            const tapCount = event.touches?.length || 1; // Если это касание, определяем количество касаний
            coinsStore.incTapsClient(tapCount);
        } else if (event.pointerType === 'mouse') {
            // Обработка кликов мышью
            coinsStore.incTapsClient(1);
        }
    };

    const handleAnimationEnd = (id) => {
        setTaps((prevTaps) => prevTaps.filter((tap) => tap.id !== id));
    };

    return (
        <div className={css.Tapalka}>
            <div className={css.TapalkaMainCoinContainer}>
                <h1 className={css.mining_per_second_text}>Гугл коины</h1>
                <div className={css.Tapalka_amount_coins} style={{ fontSize: calculateFontSize(coins, 50) }}>{formatNumber(coins)}</div>
            </div>
            <div className={css.TapalkaMainCoin} onPointerDown={handlePointerDown} style={{ backgroundImage: "url(img/coin2.png)" }}></div>
            <div className={`${css.TapalkaMainCoinContainer} ${css.TapalkaMainCoinContainerBottom}`}>
                <div style={{ fontSize: calculateFontSize(miningPerHour, 50) }}>{formatNumber(miningPerHour)}</div> {/* *BigInt(60) */}
                <div className={css.mining_per_second_text}>доход в час</div>
            </div>
            {taps.map((tap) => (
                <TapEffect key={tap.id} x={tap.x} y={tap.y} tapId={tap.id} onAnimationEnd={() => handleAnimationEnd(tap.id)} />
            ))}
        </div>
    );
});

export default Tapalka;