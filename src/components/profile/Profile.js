import React from 'react';
import { observer } from 'mobx-react-lite';
import TAP from '@/TAPconfig';
import mainStore from "@/store/MainStore";
import navigationStore from "@/store/Navigation";
import css from './profile.module.scss';


const Profile = observer(() => {
    const userId = mainStore.user?.id || '';
    const userPassword = mainStore.user?.password || '';
    const authLink = `${TAP.appUrl}php/?data=${
        JSON.stringify({
            authType: 'site',
            authData: {
                login: `user${userId}`,
                password: userPassword,
            }
        })
    }`;

    return (
        <div className={css.Profile} style={{ display: (navigationStore.getNav('Profile'))? 'flex':'none' }}>
            {userId && userPassword ? <>
                <br/>
                <form>
                    <div>Данные для входа через браузер</div>
                    <br/>
                    <input type='text' value={`user${userId}`} readOnly />
                    <br/>
                    <input type='text' value={userPassword} readOnly />
                    {/* <button>Войти</button> */}
                </form>
                <br/>
                <a href={authLink} target='_blank'>Войти по ссылке</a>  
            </>
            :
            <div>Отсутствуют данные для входа</div>}
        </div>
    );
});

export default Profile;