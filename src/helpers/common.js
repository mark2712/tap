import React from 'react';


export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        // behavior: 'smooth' // Плавный скролл
    });
};


//получить текст из jsx (аналог elem.innerText)
export function extractTextFromJSX (jsxElement) {
    if (typeof jsxElement !== 'object') {
        return jsxElement;
    }

    const textNodes = React.Children.toArray(jsxElement.props.children)
        .filter((child) => typeof child === 'string')
        .join(' ');
    
    return textNodes;
};

export function invertColor(hex) {
    // Преобразуем шестнадцатеричную строку в компоненты RGB
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    // Инвертируем каждый компонент
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // Преобразуем обратно в шестнадцатеричную строку и добавляем ведущие нули, если нужно
    return (
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0')
    );
}