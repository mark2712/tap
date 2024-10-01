import React from 'react';
import { observer } from 'mobx-react-lite';
import navigationStore from "@/store/Navigation";
import coinsStore from "@/store/CoinsStore";
import css from './tapalka.module.scss';

import ParticlesBackground from '@/components/tapalka/ParticlesBackground';
import Tapalka from '@/components/tapalka/Tapalka';
import Energon from '@/components/tapalka/energon/Energon';
import Params from '@/components/tapalka/Params';


const TapalkaMain = observer(() => {
    return (
        <div className={css.TapalkaMain} style={{ maxWidth: '500px', overflow: 'hidden', position: 'relative', display: (navigationStore.getNav('TapalkaMain'))? 'block':'none' }}>
            <div className={css.TapalkaMainContainer}>
                <ParticlesBackground miningPerSecond={Number(coinsStore.mining_per_second)} />
                <Tapalka></Tapalka>
            </div>
            <div className={css.TapalkaContent}>
                <Energon></Energon>
                <Params></Params>
            </div>
        </div>
    );
});

export default TapalkaMain;