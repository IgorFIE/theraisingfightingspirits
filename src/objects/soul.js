import { GameVars } from "../game-variables";
import { SoundInstance } from "../utilities/sound";
import { Status } from "./status";
const { drawSprite, createElemOnElem } = require("../utilities/draw-utilities");

export class Soul {
    constructor(soulContainer, arrayPosX, arrayPosY) {
        SoundInstance.spawnSound();
        this.arrayPosX = arrayPosX;
        this.arrayPosY = arrayPosY;
        this.isMale = Math.floor(Math.random() * 2) === 0;
        this.spriteInUse = (this.isMale ? maleSoul : femaleSoul);
        this.isDeadAndAnimationEnded = false;

        this.soulSelectedArrowCanvas = createElemOnElem(soulContainer, "canvas", null, ["soul-selection-arrow", "hidden"], selectedArrow[0].length * GameVars.pixelSize, selectedArrow.length * GameVars.pixelSize);
        drawSprite(this.soulSelectedArrowCanvas.getContext("2d"), selectedArrow, GameVars.pixelSize);

        this.soulCanvas = createElemOnElem(soulContainer, "canvas", null, ["soul"], this.spriteInUse[0].length * GameVars.pixelSize, this.spriteInUse.length * GameVars.pixelSize, null, (e) => {
            this.selectSoul()
            SoundInstance.clickSound();
        });
        this.soulCanvas.style.animation = "addsoul 500ms ease-in-out";
        this.soulCanvas.addEventListener("animationend", () => {
            this.soulCanvas.style.animation = "soulAnim 6s infinite ease-in-out";
            this.isDeadAndAnimationEnded = this.soulStatus.lifeValue <= 0;
            this.draw();
        });
        this.soulCtx = this.soulCanvas.getContext("2d");
        this.soulStatus = new Status(soulContainer, 33, GameVars.soulLife, 0);

        this.draw();
    }

    selectSoul() {
        if (GameVars.soulInUse) {
            GameVars.soulInUse.deselectSoul();
        }
        GameVars.soulInUse = GameVars.souls[this.arrayPosY][this.arrayPosX];
        this.soulSelectedArrowCanvas.classList.remove("hidden");
    }

    deselectSoul() {
        this.soulSelectedArrowCanvas.classList.add("hidden");
    }

    takeDamage(dmg) {
        this.soulStatus.takeDamage(dmg);
        this.draw("red");
        if (this.soulStatus.lifeValue > 0) {
            this.soulCanvas.style.animation = "takedmg 400ms ease-in-out";
        } else {
            this.soulCanvas.style.animation = "addsoul 500ms reverse ease-in-out";
            SoundInstance.deadSound();
        }
    }

    draw(color = null) {
        this.soulCtx.clearRect(0, 0, GameVars.soulW, GameVars.soulH);
        drawSprite(this.soulCtx, this.spriteInUse, GameVars.pixelSize, 0, 0, color);
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

