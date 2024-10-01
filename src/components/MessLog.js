import React from 'react';
import { observer } from 'mobx-react-lite';
import messLogStore from "@/store/MessLogStore";


const MessLog = observer(() => {
    const MessLogRef = React.useRef(null);
    let lastMess = messLogStore.data[messLogStore.data.length-1];
    let display = lastMess.display ? 'flex':'none';

    return (
        <>
            <div ref={MessLogRef} className='LoadingMess' style={{display}} onClick={()=>{lastMess.logClose(lastMess)}}>{lastMess.info}</div>
        </>
    );
});

export default MessLog;