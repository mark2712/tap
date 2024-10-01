import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import navigationStore from "@/store/Navigation";
import { toJS } from 'mobx'
import ReferalsList from "@/components/referal/ReferalsList";
import css from './referal.module.scss';
import TAP from '@/TAPconfig';


const Referal = observer(() => {
    let userId = mainStore.user?.id;

    // Состояние для управления видимостью сообщения
    const [copySuccess, setCopySuccess] = React.useState(false);

    const handleCopy = () => {
        const inputField = document.getElementById('referralLinkInput');
        inputField.select();
        document.execCommand('copy');

        // Показать сообщение и скрыть его через 3 секунды
        setCopySuccess(true);
        setTimeout(() => {
            setCopySuccess(false);
        }, 3000);
    };


    return (
        <div className={css.Referal} style={{ display: (navigationStore.getNav('Referal'))? 'flex':'none' }}>
            <label>
                <div className={css.text}>Ваша реферальная ссылка: </div>
                <input
                    type='text'
                    id='referralLinkInput'
                    value={TAP.botUrl + '?start=' + userId}
                    readOnly
                />
                <button onClick={handleCopy}>Скопировать</button>
                {/* Сообщение о копировании, появляется, если copySuccess равно true */}
                {copySuccess && (
                    <div className="copy-success-message" style={{ color: 'green', marginTop: '10px' }}>
                        Реферальная ссылка скопирована в буфер обмена!
                    </div>
                )}
            </label>
            <ReferalsList></ReferalsList>
        </div>
    );
});

export default Referal;