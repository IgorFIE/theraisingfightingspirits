import { GameVariables } from "../game-variables";
const { defIcon } = require("../objects/icons");
const { drawSprite } = require("../utilities/draw-utilities");
const { generateSmallBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class Status {
    constructor(parentdiv, w, lifeValue, defValue) {
        this.maxLifeValue = lifeValue;
        this.lifeValue = lifeValue;
        this.defValue = defValue;

        this.originalWidth = w;

        this.statusCanvas = document.createElement("canvas");
        this.statusCanvas.width = (18 + w) * GameVariables.pixelSize;
        this.statusCanvas.height = GameVariables.statusBarHeight * GameVariables.pixelSize;
        this.statusCanvas.classList.add("status");
        parentdiv.appendChild(this.statusCanvas);

        this.statusCtx = this.statusCanvas.getContext("2d");

        this.draw();
    }

    draw() {
        generateSmallBox(this.statusCanvas, 16, 3, this.originalWidth + 1, 11, GameVariables.pixelSize, "white", "white");
        this.drawShield();
        generateSmallBox(this.statusCanvas, 17, 4, this.originalWidth - 1, 9, GameVariables.pixelSize, "black", "white");
        this.drawLifeBar();
        const lifeText = convertTextToPixelArt(this.lifeValue + "/" + this.maxLifeValue);
        drawPixelTextInCanvasContext(lifeText, this.statusCtx, GameVariables.pixelSize, 17 + (this.originalWidth / 2), 9);
    }

    drawShield() {
        if (this.defValue > 0) {
            drawSprite(this.statusCtx, defIcon, GameVariables.pixelSize);
            const defText = convertTextToPixelArt(this.defValue);
            drawPixelTextInCanvasContext(defText, this.statusCtx, GameVariables.pixelSize, 9, 9, "white");
        }
    }

    drawLifeBar() {
        this.statusCtx.fillStyle = this.defValue > 0 ? "lightblue" : "#FF0000";
        this.statusCtx.fillRect(
            18 * GameVariables.pixelSize,
            5 * GameVariables.pixelSize,
            (this.lifeValue * ((this.originalWidth - 2) * GameVariables.pixelSize)) / this.maxLifeValue,
            8 * GameVariables.pixelSize);
    }
}