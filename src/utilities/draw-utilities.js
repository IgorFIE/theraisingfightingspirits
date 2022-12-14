export const drawSprite = (canvas, sprite, pixelSize, startX = 0, startY = 0, color = null) => {
    const ctx = canvas.getContext("2d");
    sprite.forEach((row, y) => row.forEach((val, x) => {
        if (val !== null) {
            ctx.fillStyle = color ? color : val;
            ctx.fillRect(
                (startX * pixelSize) + (x * pixelSize),
                (startY * pixelSize) + (y * pixelSize),
                pixelSize,
                pixelSize);
        }
    }));
};

export const createElem = (parentElem, elemType, id, classList, width, height, backgroundColor, clickFn) => {
    let elem = document.createElement(elemType);
    if (id) elem.id = id;
    if (classList) classList.forEach((e) => elem.classList.add(e));
    if (width) elem.width = width;
    if (height) elem.height = height;
    if (backgroundColor) elem.style.backgroundColor = backgroundColor;
    if (clickFn) elem.addEventListener('click', clickFn);
    parentElem.appendChild(elem);
    return elem;
}