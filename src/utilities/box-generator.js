export const generateSmallBox = (canvas, startX, startY, endX, endY, pixelSize, color, bgColor) => {
    const conditionFn = (x, y, endX, endY) => {
        return (y === 0 && (x > 0 && x < endX)) ||
            (y === endY && (x > 0 && x < endX)) ||
            (x === 0 && (y > 0 && y < endY)) ||
            (x === endX && (y > 0 && y < endY));
    }
    genetateInsideBoxColor(canvas, startX, startY, endX, endY, pixelSize, bgColor);
    generateBox(canvas, startX, startY, endX, endY, pixelSize, color, conditionFn);
};

export const generateLargeBox = (canvas, startX, startY, endX, endY, pixelSize, color, bgColor) => {
    const conditionFn = (x, y, endX, endY) => {
        return (y < 3 && (x > 0 && x < endX)) ||
            (y > endY - 3 && (x > 0 && x < endX)) ||
            (x < 3 > 0 && (y > 0 && y < endY)) ||
            (x > endX - 3 && (y > 0 && y < endY)) ||
            (y === 3 && x === 3) ||
            (y === 3 && x === endX - 3) ||
            (y === endY - 3 && x === 3) ||
            (x === endX - 3 && y === endY - 3);
    }
    genetateInsideBoxColor(canvas, startX, startY, endX, endY, pixelSize, bgColor);
    generateBox(canvas, startX, startY, endX, endY, pixelSize, color, conditionFn);
};

const generateBox = (canvas, startX, startY, endX, endY, pixelSize, color, conditionFn) => {
    const ctx = canvas.getContext("2d");
    for (let y = 0; y <= endY; y++) {
        for (let x = 0; x <= endX; x++) {
            if (conditionFn(x, y, endX, endY)) {
                ctx.fillStyle = color;
                ctx.fillRect(
                    (startX * pixelSize) + (x * pixelSize),
                    (startY * pixelSize) + (y * pixelSize),
                    pixelSize, pixelSize);
            }
        }
    }
};

const genetateInsideBoxColor = (canvas, startX, startY, endX, endY, pixelSize, bgColor) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(
        (startX * pixelSize) + pixelSize,
        (startY * pixelSize) + pixelSize,
        (endX * pixelSize) - pixelSize,
        (endY * pixelSize) - pixelSize
    );
};