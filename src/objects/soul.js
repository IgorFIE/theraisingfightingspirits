import { GameVars } from "../game-variables";
import { Status } from "./status";
const { drawSprite, createElem } = require("../utilities/draw-utilities");

export class Soul {
    constructor(soulContainer, containerPosX, containerPosY) {
        GameVars.sound.spawnSound();
        this.x = containerPosX;
        this.y = containerPosY;
        this.isDead = false;

        this.arrowCanv = createElem(soulContainer, "canvas", null, ["arrow", "hidden"], arrow[0].length * GameVars.pixelSize, arrow.length * GameVars.pixelSize);
        drawSprite(this.arrowCanv, arrow, GameVars.pixelSize);

        this.soulCanv = createElem(soulContainer, "canvas", null, ["soul"], soul[0].length * GameVars.pixelSize, soul.length * GameVars.pixelSize, null, (e) => {
            this.select()
            GameVars.sound.clickSound();
        });
        this.soulCanv.style.animation = "addsoul 500ms ease-in-out";
        this.soulCanv.addEventListener("animationend", () => {
            this.soulCanv.style.animation = "soulAnim 6s infinite ease-in-out";
            this.isDead = this.soulStats.lifeValue <= 0;
            this.draw();
        });
        this.soulCtx = this.soulCanv.getContext("2d");
        this.soulStats = new Status(soulContainer, 33, GameVars.soulLife, 0);

        this.draw();
    }

    select() {
        if (GameVars.soulInUse) {
            GameVars.soulInUse.deselect();
        }
        GameVars.soulInUse = GameVars.souls[this.y][this.x];
        this.arrowCanv.classList.remove("hidden");
    }

    deselect() {
        this.arrowCanv.classList.add("hidden");
    }

    takeDmg(dmg) {
        this.soulStats.takeDmg(dmg);
        this.draw("red");
        if (this.soulStats.lifeValue > 0) {
            this.soulCanv.style.animation = "takedmg 400ms ease-in-out";
        } else {
            this.soulCanv.style.animation = "addsoul 500ms reverse ease-in-out";
            GameVars.sound.deadSound();
        }
    }

    draw(color = null) {
        this.soulCtx.clearRect(0, 0, this.soulCanv.width, this.soulCanv.height);
        drawSprite(this.soulCanv, soul, GameVars.pixelSize, 0, 0, color);
    }
}

const nu = null;
const db = "#10495e";
const lb = "#9bf2fa";
const wb = "#edeef7";

export const soul = [
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

const yl = "#ffff57";
const bl = "#000000"

const arrow = [
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

