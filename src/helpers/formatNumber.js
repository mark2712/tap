//1 000 000 000 000 000

// Форматирование числа с разделением на разряды
export const formatNumber = (number, maxNumber = 1000000000000000n) => {
    // Если это BigInt, преобразуем в строку
    const numStr = number.toString();

    // Проверка на большое число
    if (number > maxNumber) {
        return formatNumberExponent(number);
    }

    // Разделение числа на разряды через пробел
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const calculateFontSize = (number, baseFontSize, maxNumber = 1000000000000000n) => {
    if(number > maxNumber){
        return `${baseFontSize}%`;
    }
    const length = number.toString().length;
    return `${baseFontSize - length*length/10}%`;
};


export const formatNumberExponent = (number) => {
    const numStr = number.toString();
    const exponent = numStr.length - 1;
    const mantissa = numStr[0] + '.' + numStr.slice(1, 3);
    return `${mantissa}e${exponent}`;
};


// Форматирование числа с суффиксами (K, M, B и т.д.)
export const formatNumberWithSuffix = (inputNumber) => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y', 'O']; // Суффиксы для тысяч, миллионов и т.д.
    
    // Преобразуем число в BigInt, если оно еще не BigInt
    let number = typeof inputNumber === 'bigint' ? inputNumber : BigInt(inputNumber);

    // Если число меньше тысячи, возвращаем его как есть
    if (number < 1000n) return number.toString();

    // Определяем количество цифр в числе через длину строки (логарифм не применим для BigInt)
    let exponent = number.toString().length - 1;
    let suffixIndex = Math.floor(exponent / 3); // Определяем индекс суффикса

    // Рассчитываем мантиссу, разделив на соответствующую степень 1000
    let divisor = BigInt(Math.pow(10, suffixIndex * 3));
    let mantissa = number / divisor;
    let remainder = number % divisor;

    // Проверяем, есть ли дробная часть
    let mantissaStr = mantissa.toString();
    if (remainder > 0n) {
        let decimalPart = ((remainder * 100n) / divisor).toString().padStart(2, '0');
        // Убираем лишние нули в конце, если есть
        decimalPart = decimalPart.replace(/0+$/, '');
        if (decimalPart) {
            mantissaStr += `.${decimalPart}`;
        }
    }else if (mantissaStr.length > 4) {
        mantissaStr = mantissaStr.slice(0, 4); // Обрезаем строку до 4 символов
        // Убираем точку, если она на 4-й позиции
        if (mantissaStr[3] === '.') {
            mantissaStr = mantissaStr.slice(0, 3);
        }
    }

    return `${mantissaStr}${suffixes[suffixIndex]}`;
};


// // Форматирование числа с суффиксами (K, M, B и т.д.)
// export const formatNumberWithSuffix = (number) => {
//     const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y', 'O']; // Суффиксы для тысяч, миллионов и т.д.
//     let numStr = number.toString();
//     let exponent = numStr.length - 1;
//     let suffixIndex = Math.floor(exponent / 3); // Определяем индекс суффикса

//     // Если число меньше тысячи, возвращаем его как есть
//     if (suffixIndex === 0) return numStr;

//     // Округляем число до первых трех цифр и добавляем суффикс
//     let mantissa = (BigInt(numStr) / BigInt(Math.pow(10, suffixIndex * 3))).toString();
    
//     // Добавляем одну цифру после запятой, если число дробное
//     if (mantissa.length > 3) {
//         mantissa = mantissa[0] + '.' + mantissa.slice(1, 3);
//     }

//     return `${mantissa}${suffixes[suffixIndex]}`;
// };