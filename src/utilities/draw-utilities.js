export const drawSprite = (canvas, sprite, pixelSize, startX = 0, startY = 0, color = null) => {
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < sprite.length; y++) {
        for (let x = 0; x < sprite[y].length; x++) {
            if (sprite[y][x] !== null) {
                ctx.fillStyle = color ? color : sprite[y][x];
                ctx.fillRect(
                    (startX * pixelSize) + (x * pixelSize),
                    (startY * pixelSize) + (y * pixelSize),
                    pixelSize,
                    pixelSize);
            }
        }
    }
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