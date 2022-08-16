export const drawSprite = (ctx, sprite, pixelSize, startX = 0, startY = 0) => {
    for (let y = 0; y < sprite.length; y++) {
        for (let x = 0; x < sprite[y].length; x++) {
            if (sprite[y][x] !== null) {
                ctx.fillStyle = sprite[y][x];
                ctx.fillRect(
                    (startX * pixelSize) + (x * pixelSize),
                    (startY * pixelSize) + (y * pixelSize),
                    pixelSize,
                    pixelSize);
            }
        }
    }
};