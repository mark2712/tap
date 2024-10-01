import dynamic from 'next/dynamic';
import Head from 'next/head'
import Script from "next/script";

const InitialLoading = dynamic(() => import('@/components/InitialLoading/'), { ssr: false });
const MessLog = dynamic(() => import('@/components/MessLog/'), { ssr: false });
const TapalkaMain = dynamic(() => import('@/components/tapalka/TapalkaMain'), { ssr: false });
const CardsMain = dynamic(() => import('@/components/cards/CardsMain'), { ssr: false });
const Referal = dynamic(() => import('@/components/referal/Referal'), { ssr: false });
const MenuTop = dynamic(() => import('@/components/menu/MenuTop'), { ssr: false });
const TopStats = dynamic(() => import('@/components/menu/TopStats'), { ssr: false });
const MenuBottom = dynamic(() => import('@/components/menu/MenuBottom'), { ssr: false });
const SysInfo = dynamic(() => import('@/components/SysInfo'), { ssr: false });
import {createDesctopIframe, isDesctop} from "@/helpers/createDesctopIframe";


export default function IndexPage() {
    return (
        isDesctop ? <>{createDesctopIframe()}</> : //временный костыль чтобы хоть что то увидеть на desctop версии
        <>
            <Head>
                <title>Googol Coin</title>
                <link rel="shortcut icon" href="/img/coin2.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Script src="//telegram.org/js/telegram-web-app.js" />
            
            <InitialLoading></InitialLoading>

            {/* <MenuTop></MenuTop> */}
            <TopStats></TopStats>
            <MessLog></MessLog>
            <TapalkaMain></TapalkaMain>
            <CardsMain></CardsMain>
            <Referal></Referal>
            <MenuBottom></MenuBottom>
            {/* <SysInfo></SysInfo> */}
        </>
    );
};