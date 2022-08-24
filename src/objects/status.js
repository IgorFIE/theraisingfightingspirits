import { GameVars } from "../game-variables";
const { defIcon } = require("../objects/icons");
const { drawSprite, createElemOnElem } = require("../utilities/draw-utilities");
const { generateSmallBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");

export class Status {
    constructor(parentdiv, w, lifeValue, shieldValue) {
        this.maxLifeValue = lifeValue;
        this.lifeValue = lifeValue;
        this.shieldValue = shieldValue;
        this.originalWidth = w;

        this.statusCanvas = createElemOnElem(parentdiv, "canvas", null, ["status"], (18 + w) * GameVars.pixelSize, GameVars.statsBarH * GameVars.pixelSize);
        this.statusCanvas.addEventListener("animationend", () => this.statusCanvas.style.animation = "");
        this.statusCtx = this.statusCanvas.getContext("2d");
        this.draw();
    }

    takeDamage(dmg) {
        GameVars.sound.takeDamageSound();
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
        GameVars.sound.gainShield();
        this.statusCanvas.style.animation = "";
        requestAnimationFrame(() => setTimeout(() => this.statusCanvas.style.animation = "addshield 500ms ease-in-out", 0));
        this.shieldValue += shieldAmount;
        this.draw();
    }

    draw() {
        this.statusCtx.clearRect(0, 0, this.statusCanvas.width, this.statusCanvas.height);
        generateSmallBox(this.statusCanvas, 16, 3, this.originalWidth + 1, 11, GameVars.pixelSize, "white", "white");
        this.drawShield();
        generateSmallBox(this.statusCanvas, 17, 4, this.originalWidth - 1, 9, GameVars.pixelSize, "black", "white");
        this.drawLifeBar();
        const lifeText = convertTextToPixelArt(this.lifeValue + "/" + this.maxLifeValue);
        drawPixelTextInCanvas(lifeText, this.statusCanvas, GameVars.pixelSize, 17 + (this.originalWidth / 2), 9);
    }

    drawShield() {
        if (this.shieldValue > 0) {
            drawSprite(this.statusCanvas, defIcon, GameVars.pixelSize);
            drawPixelTextInCanvas(convertTextToPixelArt(this.shieldValue), this.statusCanvas, GameVars.pixelSize, 9, 9, "white");
        }
    }

    drawLifeBar() {
        this.statusCtx.fillStyle = this.shieldValue > 0 ? "lightblue" : "red";
        this.statusCtx.fillRect(
            18 * GameVars.pixelSize,
            5 * GameVars.pixelSize,
            (this.lifeValue * ((this.originalWidth - 2) * GameVars.pixelSize)) / this.maxLifeValue,
            8 * GameVars.pixelSize);
    }

    dispose() {
        if (this.statusCanvas.parentNode !== null) {
            this.statusCanvas.parentElement.removeChild(this.statusCanvas);
        }
    }
}