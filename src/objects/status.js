import { GameVariables } from "../game-variables";
const { defIcon } = require("../objects/icons");
const { drawSprite } = require("../utilities/draw-utilities");
const { generateSmallBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class Status {
    constructor(parentdiv, w, lifeValue, shieldValue) {
        this.maxLifeValue = lifeValue;
        this.lifeValue = lifeValue;
        this.shieldValue = shieldValue;

        this.originalWidth = w;

        this.statusCanvas = document.createElement("canvas");
        this.statusCanvas.width = (18 + w) * GameVariables.pixelSize;
        this.statusCanvas.height = GameVariables.statusBarHeight * GameVariables.pixelSize;
        this.statusCanvas.classList.add("status");
        this.statusCanvas.addEventListener("animationend", () => this.statusCanvas.style.animation = "");
        parentdiv.appendChild(this.statusCanvas);

        this.statusCtx = this.statusCanvas.getContext("2d");

        this.draw();
    }

    takeDamage(dmg) {
        if (this.shieldValue > 0) {
            this.shieldValue -= dmg;
            if (this.shieldValue <= 0) {
                dmg = Math.abs(this.shieldValue);
                this.shieldValue = 0;
            }
        }
        if (this.shieldValue == 0) {
            this.lifeValue -= dmg;
            if (this.lifeValue < 0) {
                this.lifeValue = 0;
            }
        }
        this.draw();
    }

    addShield(shieldAmount) {
        this.statusCanvas.style.animation = "";
        requestAnimationFrame(() => setTimeout(() => this.statusCanvas.style.animation = "addshield 500ms ease-in-out", 0));
        this.shieldValue += shieldAmount;
        this.draw();
    }

    draw() {
        this.statusCtx.clearRect(0, 0, this.statusCanvas.width, this.statusCanvas.height);
        generateSmallBox(this.statusCanvas, 16, 3, this.originalWidth + 1, 11, GameVariables.pixelSize, "white", "white");
        this.drawShield();
        generateSmallBox(this.statusCanvas, 17, 4, this.originalWidth - 1, 9, GameVariables.pixelSize, "black", "white");
        this.drawLifeBar();
        const lifeText = convertTextToPixelArt(this.lifeValue + "/" + this.maxLifeValue);
        drawPixelTextInCanvasContext(lifeText, this.statusCtx, GameVariables.pixelSize, 17 + (this.originalWidth / 2), 9);
    }

    drawShield() {
        if (this.shieldValue > 0) {
            drawSprite(this.statusCtx, defIcon, GameVariables.pixelSize);
            drawPixelTextInCanvasContext(convertTextToPixelArt(this.shieldValue), this.statusCtx, GameVariables.pixelSize, 9, 9, "white");
        }
    }

    drawLifeBar() {
        this.statusCtx.fillStyle = this.shieldValue > 0 ? "lightblue" : "red";
        this.statusCtx.fillRect(
            18 * GameVariables.pixelSize,
            5 * GameVariables.pixelSize,
            (this.lifeValue * ((this.originalWidth - 2) * GameVariables.pixelSize)) / this.maxLifeValue,
            8 * GameVariables.pixelSize);
    }

    dispose() {
        if (this.statusCanvas.parentNode !== null) {
            this.statusCanvas.parentElement.removeChild(this.statusCanvas);
        }
    }
}