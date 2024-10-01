import React from 'react';
import { observer } from 'mobx-react-lite';
import referalStore from '@/store/ReferalStore';
import css from './referal.module.scss';


const ReferalsList = observer(() => {
    const referals = referalStore.referals;

    return (
        <div className={css.ReferalsList}>
            <div className={css.text}>Ваши рефералы:</div>
            {referals.length > 0 ? (
                <ol>
                    {referals.map((referal, index) => (
                        // <li key={index}><pre className='pre'>{JSON.stringify(referal)}</pre></li>
                        <li key={index}>
                            <span>id:{referal.id}</span> / <span>{referal.username ? referal.username : 'Аноним'}</span><br/><span>Доход: {referal.mining_per_second}</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <div>У вас пока нет рефералов.</div>
            )}
        </div>
    );
});

export default ReferalsList;