import { GameVariables } from "../game-variables";
import { Status } from "./status";
const { drawSprite } = require("../utilities/draw-utilities");
const { atkIcon, defIcon, scytheIcon } = require("../objects/icons");
const { generateSmallBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class Reaper {
    constructor(gameDiv) {
        this.reaperAtk = 4;
        this.reaperAoeAtk = 3;
        this.reaperDef = 2;
        this.reaperAction = ReaperActions.DEF;
        this.reaperLockOnSoul = null;

        this.reaperContainer = document.createElement("div");
        this.reaperContainer.classList.add("reaper-container");
        gameDiv.appendChild(this.reaperContainer);

        this.reaperActionCanvas = document.createElement("canvas");
        this.reaperActionCtx = this.reaperActionCanvas.getContext("2d");
        this.reaperActionCanvas.width = (scytheIcon[0].length + 4) * GameVariables.pixelSize;
        this.reaperActionCanvas.height = (scytheIcon.length + 4) * GameVariables.pixelSize;
        this.reaperActionCanvas.id = "reaper-action";
        this.reaperContainer.appendChild(this.reaperActionCanvas);

        this.reaperCanvas = document.createElement("canvas");
        this.reaperCanvas.width = grimReaper[0].length * GameVariables.pixelSize;
        this.reaperCanvas.height = grimReaper.length * GameVariables.pixelSize;
        this.reaperCanvas.id = "reaper";
        this.reaperContainer.appendChild(this.reaperCanvas);

        this.reaperStatus = new Status(this.reaperContainer, 36, 999, 0);

        this.translateReaper();
        drawSprite(this.reaperCanvas.getContext("2d"), grimReaper, GameVariables.pixelSize);
        this.calculateReaperNextAction();
    }

    translateReaper() {
        let reaperX = ((GameVariables.gameWidth / 4) * 3) - (this.reaperContainer.clientWidth / 2);
        let reaperY = (GameVariables.gameHeight / 2) - ((this.reaperContainer.clientHeight / 4) * 3);
        this.reaperContainer.style.transform = "translate(" + reaperX + "px," + reaperY + "px)";
    }

    reaperTurn() {
        this.processReaperAction();
        this.calculateReaperNextAction();
    }

    calculateReaperNextAction() {
        let visibleSouls = [];
        let normalAtkKillsSouls = [];
        let aoeAtkKills = 0;
        GameVariables.souls.forEach((row) => row.forEach((soul) => {
            if (soul) {
                visibleSouls.push(soul);
                let soulTotalLife = soul.soulStatus.lifeValue + soul.soulStatus.shieldValue;
                if (soulTotalLife - this.reaperAtk <= 0) {
                    normalAtkKillsSouls.push(soul);
                }
                if (soulTotalLife - this.reaperAoeAtk <= 0) aoeAtkKills++;
            }
        }));

        // there is a chance of the normal atk to kill 3 souls and the aoe atk to kill 2, 
        // if this is the case the reaper will choose the normal atk
        if (aoeAtkKills > normalAtkKillsSouls.length) {
            this.reaperAction = ReaperActions.AOE_ATK;
        } else if (normalAtkKillsSouls.length > aoeAtkKills) {
            this.reaperAction = ReaperActions.ATK;
            this.reaperLockOnSoul = normalAtkKillsSouls[Math.floor(Math.random() * normalAtkKillsSouls.length)];
        } else {
            let randomValue = Math.floor(Math.random() * 100);
            if (randomValue < 40) {
                this.reaperAction = ReaperActions.AOE_ATK;
            } else if (randomValue < 80) {
                this.reaperAction = ReaperActions.ATK;
                if (normalAtkKillsSouls.length > 0) {
                    this.reaperLockOnSoul = normalAtkKillsSouls[Math.floor(Math.random() * normalAtkKillsSouls.length)];
                } else {
                    this.reaperLockOnSoul = visibleSouls[Math.floor(Math.random() * visibleSouls.length)];
                }
            } else {
                this.reaperAction = ReaperActions.DEF;
            }
        }
        this.drawReaperAction();
    }

    drawReaperAction() {
        this.reaperActionCtx.clearRect(0, 0, this.reaperActionCanvas.width, this.reaperActionCanvas.height);
        switch (this.reaperAction) {
            case ReaperActions.ATK:
                this.drawAction(atkIcon, this.reaperAtk);
                break;
            case ReaperActions.AOE_ATK:
                this.drawAction(scytheIcon, this.reaperAoeAtk);
                break;
            default:
                this.drawAction(defIcon, this.reaperDef);
                break;
        }
    }

    drawAction(actionIcon, actionValue) {
        drawSprite(this.reaperActionCtx, actionIcon, GameVariables.pixelSize, 4);
        generateSmallBox(this.reaperActionCanvas, 0, actionIcon.length - 6, 9, 9, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt(actionValue), this.reaperActionCtx, GameVariables.pixelSize, 5, actionIcon.length - 1, "black");
    }

    processReaperAction() {
        switch (this.reaperAction) {
            case ReaperActions.ATK:
                this.reaperLockOnSoul.soulStatus.takeDamage(this.reaperAtk);
                break;
            case ReaperActions.AOE_ATK:
                GameVariables.souls.forEach((row) => row.forEach((soul) => {
                    if (soul) {
                        soul.soulStatus.takeDamage(this.reaperAoeAtk);
                    }
                }));
                break;
            default:
                this.reaperStatus.addShield(this.reaperDef);
                break;
        }
    }

    dispose() {
        if (this.reaperContainer.parentNode !== null) {
            this.reaperStatus.dispose();
            this.reaperContainer.parentElement.removeChild(this.reaperContainer);
        }
    }
}

const ReaperActions = {
    ATK: 0,
    AOE_ATK: 1,
    DEF: 2
}

const nu = null;
const bl = "#000000"
const wb = "#EDEEF7"

export const grimReaper = [
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