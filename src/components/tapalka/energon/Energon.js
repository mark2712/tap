import React from 'react';
import { observer } from 'mobx-react-lite';
import coinsStore from "@/store/CoinsStore";
import energonStore from "@/store/EnergonStore";
import { toJS } from 'mobx'
import css from './energon.module.scss';
import Battery from './Battery';


const Energon = observer(() => {
    const batteries = energonStore.batteries;
    const [isInfoVisible, setInfoVisible] = React.useState(false);

    const toggleInfo = () => {
        setInfoVisible(prevState => !prevState);
    };

    return (
        <>
            <div className={css.Energon} style={{ display: (1)? 'flex':'none' }} onClick={toggleInfo}>
                {batteries.map(battery => (<Battery key={battery.users_cards__id} battery={battery} />))}
            </div>
            {isInfoVisible && (<div className={css.info}>Стоимость за один тап умножается с количеством батареек. Если есть одна батарейка, цена умножается на 10. Если две, то меньшая увеличивает цену на 10, а большая на 100. Если три, всё то же самое, а самая большая увеличивает цену на 1000, и так далее. В первую очеред расходуется первая доступная большая батарейка. Так же чем больше батареек, тем меньше презарядка для батареек с меньшей максимальной емкостью.</div>)}
        </>
    );
});

export default Energon;