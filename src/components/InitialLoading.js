import React from 'react';
import { observer } from 'mobx-react-lite';
import mainStore from "@/store/MainStore";
import messLogStore from "@/store/MessLogStore";


const InitialLoading = observer(() => {
    //меняет viewport initial-scale в зависимомти от экрана
    // if(!messLogStore.firstLoad){
    //     if (window.screen.availWidth != document.body.clientWidth) {
    //         const scale = window.screen.width / 420;
    //         document.querySelector('meta[name="viewport"]').setAttribute('content', `width=420, initial-scale=${scale}`);
    //     }
    //     // console.log('window.screen.width ',window.screen.width);
    //     // console.log('window.innerWidth ',window.innerWidth);
    //     // console.log('window.screen.availWidth: ', window.screen.availWidth); //Доступная ширина экрана, за вычетом интерфейса браузера (например, панели задач).
    //     // console.log('document.documentElement.clientWidth: ', document.documentElement.clientWidth);
    //     // console.log('document.documentElement.offsetWidth: ', document.documentElement.offsetWidth);
    //     // console.log('document.documentElement.scrollWidth: ', document.documentElement.scrollWidth);
    // }

    return (
        <>
            <div className='LoadingNow LoadingMess' style={{ display: (messLogStore.firstLoad)? 'flex':'none' }}>{messLogStore.data[0].info}</div>
        </>
    );
});

export default InitialLoading;