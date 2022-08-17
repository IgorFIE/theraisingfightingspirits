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

    update() {

    }

    draw() {
        this.reaperCtx.clearRect(0, 0, GameVariables.reaperWidth, GameVariables.reaperHeight);
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