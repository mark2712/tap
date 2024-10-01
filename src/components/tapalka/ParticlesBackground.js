import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
//import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const ParticlesBackground = ({ miningPerSecond = 1 }) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setInit(false); // Сбросим состояние, чтобы компонент перерисовался
            setTimeout(() => setInit(true), 100); // Немного подождем и установим состояние обратно
        };
    
        window.addEventListener('resize', handleResize);
    
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const particlesLoaded = (container) => {
        // console.log(container);
    };

    const options = useMemo(() => {
        let cof5000 = 5000;
        const particlesRate = opt3.emitters[0].rate;
        const particlesNumber = opt3.particles.number;
        // if(miningPerSecond < cof5000){
        //     cof5000 = 10;
        //     opt3.particles.links = {};
        // }
        if(miningPerSecond < cof5000){
            opt3.interactivity ={
                // events: {
                //     onClick: { enable: true, mode: "push" },
                // },
                modes: {
                    push: { quantity: 1 },
                    repulse: { distance: 100, duration: 0.4 },
                }
            }
        }
        if(miningPerSecond < cof5000*10){
            particlesRate.delay = cof5000/miningPerSecond;
            particlesNumber.value = miningPerSecond*10/cof5000;
        }else{
            particlesRate.delay = 0.1;
            particlesNumber.value = 50;
        }
        return opt3;
    }, [miningPerSecond]);

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                style={{
                    // position: 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1, // Важно: Поместить фон за другими элементами
                }}
            />
        );
    }

    return <></>;
};

export default ParticlesBackground;



var opt3 = {
    background: {
        color: { value: "" }, // Устанавливаем цвет фона на черный
    },
    fpsLimit: 60,
    interactivity: {
        // events: {
        //     // Включаем интерактивность при клике и наведении, если нужно
        //     onClick: { enable: true, mode: "push" },
        //     onHover: { enable: true, mode: "repulse" },
        // },
        // modes: {
        //     push: { quantity: 7 },
        //     repulse: { distance: 100, duration: 0.4 },
        // },
    },
    fullScreen: { enable: false, zIndex: 0 },
    particles: {
        color: { value: ["#2065C2", "#2D85DE"] },
        //color: { value: ["#2065C2", "#46c71b", "#c71b1b", "#0000ff"] },
        move: {
            direction: "outside",
            enable: true,
            speed: 4, // Скорость движения частиц
            random: false, // Отключаем случайное направление
            straight: false,
            outModes: { default: "destroy" }, // Уничтожаем частицы, когда они выходят за границы
        },
        links: {
            color: "#ffd700",
            distance: 150,
            enable: true,
            opacity: 0.8,
            width: 1,
            warp: true,
        },
        number: {
            value: 0, // Общее количество частиц
        },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 2, max: 7 } },
        zIndex: {
            value: 0,
            opacityRate: 0.5,
        },
    },
    emitters: [
        {
            // direction: "outside",
            direction: "none", // Без фиксированного направления
            rate: {
                delay: 0.1, // Задержка между появлениями частиц
                quantity: 2, // Количество частиц, создаваемых за раз
            },
            position: {
                x: 50,
                y: 50, // Положение эмиттера в центре
            },
            size: {
                width: 10,
                height: 20, // Размер эмиттера (радиус появления частиц)
            },
            particles: {
                move: {
                    angle: {
                        offset: 0,
                        value: { min: 0, max: 360 }, // Случайный угол движения
                    },
                },
            },
        },
    ],
    detectRetina: true,
};



// var opt2 = {
//     background: {
//         color: { value: "" },
//     },
//     fpsLimit: 60,
//     interactivity: {
//         events: {
//             // onClick: { enable: true, mode: "push" },
//             // onHover: { enable: true, mode: "repulse" },
//         },
//         modes: {
//             // push: { quantity: 7 },
//             // repulse: { distance: 100, duration: 0.4 },
//         },
//     },
//     fullScreen: { enable: false, zIndex: 0 },
//     particle:{
//         randomIndexData:true,
//     },
//     particles: {
//         color: { value: "#2065C2" },
//         move: {
//             direction: "outside",
//             enable: true,
//             outModes: { default: "out", },
//             // outModes: { default: "destroy", },
//             speed: 4,
//             straight: false,
//             random: true,
//         },
//         links: {
//             color: "#ffd700",
//             distance: 150,
//             enable: true,
//             opacity: 0.8,
//             width: 1,
//             // Добавляем связь с центральной точкой
//             warp: true,  // Включаем опцию warp, чтобы линии шли через центр
//             limitConnections: true,
//             maxConnections: 3, // Максимум 3 связи для каждой частицы
//         },
//         number: {
//             //density: { enable: true, area: 800 }, // уменьшаем плотность частиц
//             value: 100, // уменьшаем общее количество частиц
//         },
//         opacity: { value: 0.5 },
//         shape: { type: "circle" },
//         size: { value: { min: 2, max: 7 } },
//         position: {
//             x: 50,
//             y: 50,
//             // radius: 150,
//         },
//         zIndex: {
//             value: 0,
//             opacityRate: 0.5,
//         },
//     },
//     detectRetina: true,
// };



// var opt2 = {
//     background: {
//         color: { value: "#0d47a1" },
//     },
//     fpsLimit: 60,
//     interactivity: {
//         events: {
//             // onClick: { enable: true, mode: "push" },
//             onHover: { enable: true, mode: "repulse" },
//         },
//         modes: {
//             push: { quantity: 4 },
//             repulse: { distance: 200, duration: 0.4 },
//         },
//     },
//     fullScreen: { enable: false, zIndex: 0 },
//     background:{"color": "#160141"},
//     particles: {
//         color: { value: "#2065C2" },
//         links: {
//             color: "#ffd700",
//             distance: 150,
//             enable: true,
//             opacity: 0.8,
//             width: 1,
//         },
//         move: {
//             direction: "outside",  // Направление движения от центра наружу
//             enable: true,
//             outModes: { default: "out" },  // Частицы исчезают за пределами элемента
//             random: false,
//             speed: 4,
//             straight: false,
//         },
//         number: { density: { enable: true }, value: 400 },
//         opacity: { value: 0.5 },
//         shape: { type: "circle" },
//         size: { value: { min: 1, max: 7 } },
//         position: {
//             x: 50, // Начальная позиция по X в процентах (50% от ширины элемента)
//             y: 50, // Начальная позиция по Y в процентах (50% от высоты элемента)
//         },
//     },
//     detectRetina: true,
// };


// var opt1 = {
//     background: {
//         color: { value: "#0d47a1" },
//     },
//     fpsLimit: 60,
//     interactivity: {
//         events: {
//             // onClick: { enable: true, mode: "push" },
//             onHover: { enable: true, mode: "repulse" },
//         },
//         modes: {
//             push: { quantity: 4 },
//             repulse: { distance: 200, duration: 0.4 },
//         },
//     },
//     fullScreen: { enable: false, zIndex: 0 },
//     background:{"color": "#160141"},
//     particles: {
//         color: { value: "#2065C2" },
//         links: {
//             color: "#ffd700",
//             distance: 150,
//             enable: true,
//             opacity: 0.8,
//             width: 1,
//         },
//         move: {
//             direction: "none",
//             enable: true,
//             outModes: { default: "bounce" },
//             random: false,
//             speed: 4,
//             straight: false,
//         },
//         number: { density: { enable: true }, value: 400 },
//         opacity: { value: 0.5 },
//         shape: { type: "circle" },
//         size: { value: { min: 1, max: 7 } },
//     },
//     detectRetina: true,
// };