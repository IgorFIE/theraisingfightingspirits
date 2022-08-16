import { GameVariables } from "../game-variables";
import { Status } from "./status";
const { drawSprite } = require("../utilities/draw-utilities");

export class Reaper {
    constructor(gameDiv) {

        this.reaperLife = 100;
        this.reaperDef = 0;

        this.reaperContainer = document.createElement("div");
        this.reaperContainer.classList.add("reaper-container");
        gameDiv.appendChild(this.reaperContainer);

        this.reaperCanvas = document.createElement("canvas");
        this.reaperCanvas.width = grimReaper[0].length * GameVariables.pixelSize;
        this.reaperCanvas.height = grimReaper.length * GameVariables.pixelSize;
        this.reaperCanvas.id = "reaper";
        this.reaperContainer.appendChild(this.reaperCanvas);

        this.reaperCtx = this.reaperCanvas.getContext("2d");

        this.reaperStatus = new Status(this.reaperContainer, 36, 999, 0);

        this.draw();
    }

    takeDamage(dmg) {
        // refactor
        if (this.reaperDef > 0) {
            this.reaperDef -= dmg;
            if (this.reaperDef < 0) {
                dmg = Math.abs(this.reaperDef);
                this.reaperDef = 0;
            }
        }
        if (this.reaperDef == 0) {
            this.reaperLife -= dmg;
            if (this.reaperLife < 0) {
                this.reaperLife = 0;
            }
        }
        this.draw();
    }

    addShield(amount) {
        this.reaperDef += amount;
        this.draw();
    }

    update() {

    }

    draw() {
        this.reaperCtx.clearRect(0, 0, GameVariables.reaperWidth, GameVariables.reaperHeight);
        // this.drawLifeBar();
        // this.drawShield();
        this.drawReaper();
    }

    drawLifeBar() {
        this.reaperCtx.fillStyle = this.reaperDef > 0 ? "lightblue" : "#FF0000";
        this.reaperCtx.fillRect(
            5,
            GameVariables.reaperHeight - 15,
            (this.reaperLife * (GameVariables.reaperWidth - 10)) / 100,
            10);
    }

    drawShield() {
        if (this.reaperDef > 0) {
            this.reaperCtx.beginPath();
            this.reaperCtx.arc(40, 150, 30, 0, 2 * Math.PI, false);
            this.reaperCtx.fillStyle = 'lightblue';
            this.reaperCtx.fill();
            this.reaperCtx.lineWidth = 5;
            this.reaperCtx.strokeStyle = '#003300';
            this.reaperCtx.stroke();

            this.reaperCtx.font = "30px monospace";
            this.reaperCtx.fillStyle = "black";
            this.reaperCtx.textAlign = "center";
            this.reaperCtx.fillText(this.reaperDef, 40, 160);
        }
    }

    drawReaper() {
        drawSprite(this.reaperCtx, grimReaper, GameVariables.pixelSize);
    }
}

const nu = null;
const bl = "#000000"
const wb = "#EDEEF7"

const grimReaper = [
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, nu, nu, nu, nu, nu, nu, wb, bl, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, wb, wb, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, wb, wb, wb, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, wb, wb, wb, wb, wb, wb, wb, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, wb, wb, wb, wb, wb, wb, wb, wb, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, wb, wb, wb, wb, wb, bl, bl, wb, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, bl, wb, bl, bl, bl, bl, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, bl, wb, bl, bl, bl, bl, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, wb, bl, wb, bl, bl, bl, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, wb, wb, wb, wb, wb, wb, wb, wb, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, wb, bl, wb, bl, wb, bl, wb, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, bl, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, wb, wb, wb, wb, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, wb, wb, wb, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [wb, bl, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, bl, bl, bl, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, wb, bl, wb, bl, wb, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, wb, bl, wb, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, wb, bl, wb, bl, wb, bl, bl, bl, wb, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, wb, bl, bl, bl, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, wb, bl, bl, wb, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, bl, wb, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, wb, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, nu, wb, wb, wb, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, wb, wb, wb, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, nu, nu, wb, bl, bl, bl, wb, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, wb, bl, bl, bl, wb, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, nu, wb, wb, bl, bl, bl, wb, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu, wb, bl, bl, bl, wb, wb, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, wb, bl, wb, bl, bl, bl, bl, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, bl, bl, bl, bl, wb, bl, wb, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, bl, bl, wb],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb],
    [nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, wb, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, wb, wb, wb, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, wb, wb, wb, wb, wb, nu, nu, nu, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu]
];