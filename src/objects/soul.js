import { GameVariables } from "../game-variables";
import { Status } from "./status";
const { drawSprite } = require("../utilities/draw-utilities");

export class Soul {
    constructor(soulContainer, arrayPosX, arrayPosY) {
        this.arrayPosX = arrayPosX;
        this.arrayPosY = arrayPosY;
        this.isMale = Math.floor(Math.random() * 2) === 0;
        this.spriteInUse = (this.isMale ? maleSoul : femaleSoul);

        this.soulSelectedArrowCanvas = document.createElement("canvas");
        this.soulSelectedArrowCanvas.width = selectedArrow[0].length * GameVariables.pixelSize;
        this.soulSelectedArrowCanvas.height = selectedArrow.length * GameVariables.pixelSize;
        this.soulSelectedArrowCanvas.classList.add("soul-selection-arrow", "hidden");
        drawSprite(this.soulSelectedArrowCanvas.getContext("2d"), selectedArrow, GameVariables.pixelSize);
        soulContainer.appendChild(this.soulSelectedArrowCanvas);

        this.soulCanvas = document.createElement("canvas");
        this.soulCanvas.width = this.spriteInUse[0].length * GameVariables.pixelSize;
        this.soulCanvas.height = this.spriteInUse.length * GameVariables.pixelSize;
        this.soulCanvas.classList.add("soul");
        soulContainer.appendChild(this.soulCanvas);

        this.soulCtx = this.soulCanvas.getContext("2d");

        this.soulStatus = new Status(soulContainer, 33, 10, 0);

        soulContainer.addEventListener('click', (e) => this.selectSoul());

        this.draw();
    }

    selectSoul() {
        if (GameVariables.soulInUse) {
            GameVariables.soulInUse.deselectSoul();
        }
        GameVariables.soulInUse = GameVariables.souls[this.arrayPosY][this.arrayPosX];
        this.soulSelectedArrowCanvas.classList.remove("hidden");
    }

    deselectSoul() {
        this.soulSelectedArrowCanvas.classList.add("hidden");
    }

    draw() {
        this.soulCtx.clearRect(0, 0, GameVariables.soulWidth, GameVariables.soulHeight);
        drawSprite(this.soulCtx, this.spriteInUse, GameVariables.pixelSize);
    }

    dispose() {
        if (this.soulCanvas.parentNode !== null) {
            this.soulStatus.dispose();
            this.soulSelectedArrowCanvas.parentElement.removeChild(this.soulSelectedArrowCanvas);
            this.soulCanvas.parentElement.removeChild(this.soulCanvas);
        }
    }
}

const nu = null;
const db = "#10495E";
const lb = "#9BF2FA";
const wb = "#EDEEF7";

export const maleSoul = [
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, db, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, db, db, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, db, db, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, db, db, db, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, db, db, db, db, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, wb, wb, db, lb, db, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, db, db, lb, lb, db, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, wb, db, lb, lb, lb, db, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, db, lb, lb, lb, db, wb, nu, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, db, lb, lb, lb, db, wb, wb, db, wb, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, db, lb, lb, lb, lb, db, db, db, wb, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, wb, db, lb, lb, lb, lb, lb, db, wb, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, db, lb, lb, lb, db, wb, wb, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, wb, db, lb, lb, lb, lb, lb, db, db, wb, wb, nu, nu, nu, nu],
    [nu, nu, nu, wb, db, db, lb, lb, lb, lb, lb, lb, lb, lb, db, db, wb, nu, nu, nu],
    [nu, nu, wb, db, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, db, wb, nu, nu],
    [nu, wb, db, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, db, wb, nu],
    [nu, wb, db, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, lb, db, wb, nu],
    [wb, db, lb, lb, lb, lb, lb, wb, wb, wb, wb, wb, wb, lb, lb, lb, lb, lb, db, wb],
    [wb, db, lb, lb, db, lb, wb, wb, wb, wb, wb, wb, wb, wb, lb, db, lb, lb, db, wb],
    [wb, db, lb, db, lb, db, db, db, wb, wb, wb, wb, db, db, db, lb, db, lb, db, wb],
    [wb, db, lb, db, lb, wb, wb, wb, db, wb, wb, db, wb, wb, wb, lb, db, lb, db, wb],
    [wb, db, lb, db, lb, wb, wb, wb, db, wb, wb, db, wb, wb, wb, lb, db, lb, db, wb],
    [wb, db, lb, lb, db, wb, wb, db, wb, wb, wb, wb, db, wb, wb, db, lb, lb, db, wb],
    [nu, wb, db, lb, lb, db, db, wb, wb, wb, wb, wb, wb, db, db, lb, lb, db, wb, nu],
    [nu, wb, db, lb, lb, lb, wb, wb, wb, wb, wb, wb, wb, wb, lb, lb, lb, db, wb, nu],
    [nu, nu, wb, db, lb, lb, lb, wb, wb, wb, wb, wb, wb, lb, lb, lb, db, wb, nu, nu],
    [nu, nu, nu, wb, db, db, lb, lb, lb, lb, lb, lb, lb, lb, db, db, wb, nu, nu, nu],
    [nu, nu, nu, nu, wb, wb, db, db, lb, lb, lb, lb, db, db, wb, wb, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, wb, db, db, db, db, wb, wb, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu]
];

const lp = "#FFBFFF";
const dp = "#C776CA";
const dl = "#9F3FA3";

export const femaleSoul = [
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, dp, wb, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, dp, dp, wb, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, dp, dp, wb, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, dp, dp, dp, wb, wb, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, dp, dp, dp, dp, wb],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, dp, lp, dp, wb],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, dp, dp, lp, lp, dp, wb],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, dp, lp, lp, lp, dp, wb, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, nu, nu, wb, dl, dl, lp, lp, lp, dp, wb, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, wb, dp, dp, dp, dp, wb, wb, dl, lp, lp, dl, lp, lp, lp, dp, wb, nu],
    [nu, nu, nu, nu, wb, wb, dp, dp, lp, lp, lp, lp, dp, dl, lp, lp, lp, dl, lp, lp, lp, dp, wb, nu],
    [nu, nu, nu, wb, dp, dp, lp, lp, lp, lp, lp, lp, lp, dl, lp, lp, lp, dl, dl, lp, lp, dp, wb, nu],
    [nu, nu, wb, dp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, dl, dl, dl, lp, dl, dl, dl, dp, wb, nu],
    [nu, wb, dp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, dl, dl, lp, lp, lp, dl, wb, nu],
    [nu, wb, dp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, dl, lp, lp, lp, dl, wb, nu],
    [wb, dp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, lp, dl, lp, lp, dl, wb, nu, nu],
    [wb, dp, lp, lp, lp, lp, lp, wb, wb, wb, wb, wb, wb, lp, lp, lp, lp, lp, dl, dl, wb, nu, nu, nu],
    [wb, dp, lp, lp, lp, lp, wb, wb, wb, wb, wb, wb, wb, wb, lp, lp, lp, lp, dp, wb, nu, nu, nu, nu],
    [wb, dp, lp, lp, lp, dp, wb, wb, wb, wb, wb, wb, wb, wb, dp, lp, lp, lp, dp, wb, nu, nu, nu, nu],
    [wb, dp, lp, lp, lp, wb, dp, dp, wb, wb, wb, wb, dp, dp, wb, lp, lp, lp, dp, wb, nu, nu, nu, nu],
    [wb, dp, lp, lp, lp, wb, dp, dp, wb, wb, wb, wb, dp, dp, wb, lp, lp, lp, dp, wb, nu, nu, nu, nu],
    [nu, wb, dp, lp, lp, wb, wb, wb, wb, wb, wb, wb, wb, wb, wb, lp, lp, dp, wb, nu, nu, nu, nu, nu],
    [nu, wb, dp, lp, lp, lp, wb, wb, wb, dp, dp, wb, wb, wb, lp, lp, lp, dp, wb, nu, nu, nu, nu, nu],
    [nu, nu, wb, dp, lp, lp, lp, wb, dp, dp, dp, dp, wb, lp, lp, lp, dp, wb, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, wb, dp, dp, lp, lp, lp, dp, dp, lp, lp, lp, dp, dp, wb, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, wb, wb, dp, dp, lp, lp, lp, lp, dp, dp, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, wb, wb, dp, dp, dp, dp, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, wb, wb, wb, wb, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu]
];

const yl = "#FFFF57";
const bl = "#000000"

const selectedArrow = [
    [nu, nu, nu, nu, wb, wb, wb, nu, nu, nu, nu],
    [nu, nu, nu, wb, bl, bl, bl, wb, nu, nu, nu],
    [nu, nu, wb, bl, yl, yl, yl, bl, wb, nu, nu],
    [nu, nu, wb, bl, yl, yl, yl, bl, wb, nu, nu],
    [nu, nu, wb, bl, yl, yl, yl, bl, wb, nu, nu],
    [nu, nu, wb, bl, yl, yl, yl, bl, wb, nu, nu],
    [nu, wb, bl, bl, yl, yl, yl, bl, bl, wb, nu],
    [wb, bl, yl, yl, yl, yl, yl, yl, yl, bl, wb],
    [wb, bl, yl, yl, yl, yl, yl, yl, yl, bl, wb],
    [nu, wb, bl, yl, yl, yl, yl, yl, bl, wb, nu],
    [nu, nu, wb, bl, yl, yl, yl, bl, wb, nu, nu],
    [nu, nu, nu, wb, bl, yl, bl, wb, nu, nu, nu],
    [nu, nu, nu, nu, wb, bl, wb, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, wb, nu, nu, nu, nu, nu]
];

