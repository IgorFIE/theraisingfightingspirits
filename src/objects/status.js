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
        this.statsCanv = createElem(parentdiv, "canvas", null, ["status"], (18 + w) * GameVars.pixelSize, (18 + 4) * GameVars.pixelSize);
        this.statsCanv.addEventListener("animationend", () => this.statsCanv.style.animation = "");
        this.statsCtx = this.statsCanv.getContext("2d");
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
        this.statsCanv.style.animation = "";
        requestAnimationFrame(() => setTimeout(() => this.statsCanv.style.animation = "addshield 500ms ease-in-out", 0));
        this.shield += shieldAmount;
        this.draw();
    }

    draw() {
        this.statsCtx.clearRect(0, 0, this.statsCanv.width, this.statsCanv.height);
        generateSmallBox(this.statsCanv, 16, 3, this.w + 1, 11, GameVars.pixelSize, "white", "white");
        if (this.shield > 0) {
            drawSprite(this.statsCanv, defIcon, GameVars.pixelSize);
            generateSmallBox(this.statsCanv, 2, defIcon.length - 4, 13, 7, GameVars.pixelSize, "black", "white");
            drawPixelTextInCanvas(convertTextToPixelArt(this.shield), this.statsCanv, GameVars.pixelSize, 9, defIcon.length, "black");
        }

        generateSmallBox(this.statsCanv, 17, 4, this.w - 1, 9, GameVars.pixelSize, "black", "white");
        this.statsCtx.fillStyle = this.shield > 0 ? "lightblue" : "red";
        this.statsCtx.fillRect(
            18 * GameVars.pixelSize,
            5 * GameVars.pixelSize,
            (this.life * ((this.w - 2) * GameVars.pixelSize)) / this.maxLife,
            8 * GameVars.pixelSize);

        const lifeText = convertTextToPixelArt(this.life + "/" + this.maxLife);
        drawPixelTextInCanvas(lifeText, this.statsCanv, GameVars.pixelSize, 17 + (this.w / 2), 9);
    }
}