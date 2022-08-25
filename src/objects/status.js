import { GameVars } from "../game-variables";
const { defIcon } = require("../objects/icons");
const { drawSprite, createElem } = require("../utilities/draw-utilities");
const { generateSmallBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");

export class Status {
    constructor(parentdiv, w, lifeValue, shieldValue) {
        this.maxLife = lifeValue;
        this.life = lifeValue;
        this.shield = shieldValue;
        this.w = w;

        this.statusCanvas = createElem(parentdiv, "canvas", null, ["status"], (18 + w) * GameVars.pixelSize, 18 * GameVars.pixelSize);
        this.statusCanvas.addEventListener("animationend", () => this.statusCanvas.style.animation = "");
        this.statusCtx = this.statusCanvas.getContext("2d");
        this.draw();
    }

    takeDmg(dmg) {
        GameVars.sound.takeDmgSound();
        if (this.shield > 0) {
            this.shield -= dmg;
            if (this.shield <= 0) {
                dmg = Math.abs(this.shield);
                this.shield = 0;
            }
        }
        if (this.shield == 0) {
            this.life -= dmg;
            if (this.life < 0) {
                this.life = 0;
            }
        }
        this.draw();
    }

    addShield(shieldAmount) {
        GameVars.sound.gainShield();
        this.statusCanvas.style.animation = "";
        requestAnimationFrame(() => setTimeout(() => this.statusCanvas.style.animation = "addshield 500ms ease-in-out", 0));
        this.shield += shieldAmount;
        this.draw();
    }

    draw() {
        this.statusCtx.clearRect(0, 0, this.statusCanvas.width, this.statusCanvas.height);
        generateSmallBox(this.statusCanvas, 16, 3, this.w + 1, 11, GameVars.pixelSize, "white", "white");
        this.drawShield();
        generateSmallBox(this.statusCanvas, 17, 4, this.w - 1, 9, GameVars.pixelSize, "black", "white");
        this.drawLifeBar();
        const lifeText = convertTextToPixelArt(this.life + "/" + this.maxLife);
        drawPixelTextInCanvas(lifeText, this.statusCanvas, GameVars.pixelSize, 17 + (this.w / 2), 9);
    }

    drawShield() {
        if (this.shield > 0) {
            drawSprite(this.statusCanvas, defIcon, GameVars.pixelSize);
            drawPixelTextInCanvas(convertTextToPixelArt(this.shield), this.statusCanvas, GameVars.pixelSize, 9, 9, "white");
        }
    }

    drawLifeBar() {
        this.statusCtx.fillStyle = this.shield > 0 ? "lightblue" : "red";
        this.statusCtx.fillRect(
            18 * GameVars.pixelSize,
            5 * GameVars.pixelSize,
            (this.life * ((this.w - 2) * GameVars.pixelSize)) / this.maxLife,
            8 * GameVars.pixelSize);
    }
}