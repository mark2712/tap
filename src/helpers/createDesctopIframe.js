/*
ВНИМАНИЕ! Эта функция грубо удаляет компоненты и ставит iframe на полной версии.
Это временное решение пока не создана нормальная полная версия
*/
export let isDesctop = false;

if (typeof window !== 'undefined' && window.innerWidth >= 999) {
    isDesctop = true;
}


export function createDesctopIframe() {
    // Удаляем все компоненты с тела документа
    document.body.innerHTML = '';

    // Создаем iframe
    const iframe = document.createElement('iframe');
    iframe.src = window.location.href;
    iframe.style.position = 'fixed';
    iframe.style.top = '50%';
    iframe.style.left = '50%';
    iframe.style.transform = 'translate(-50%, -50%)';
    iframe.style.width = '400px';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    
    // Вставляем iframe в тело документа
    document.body.appendChild(iframe);

    // Отключаем скролл на странице
    document.body.style.overflow = 'hidden';

    return null; // Компонент ничего не рендерит
}