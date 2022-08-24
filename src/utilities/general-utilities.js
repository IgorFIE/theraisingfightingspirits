export const randomNumbOnRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomNumb = (max) => {
    return Math.floor(Math.random() * max);
}

export const retrieveSoulCoords = (souls, valFn) => {
    let y = randomNumb(souls.length);
    let x = randomNumb(souls[0].length);
    if (valFn(y, x)) {
        return retrieveSoulCoords(souls, valFn);
    }
    return { x: x, y: y };
}