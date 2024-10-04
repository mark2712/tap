import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
//import { toJS } from 'mobx'


const SysInfo = observer(() => {
    const authData = mainStore.authData;
    const userData = mainStore.user;

    return (
        <>
            <div>
                <hr/>
                <pre className='pre'>{JSON.stringify(userData)}</pre>
                <hr/>
                <pre className='pre'>{JSON.stringify(authData)}</pre>
                <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        </>
    );
});

export default SysInfo;