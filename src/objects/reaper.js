import { GameVariables } from "../game-variables";
import { Status } from "./status";
const { drawSprite } = require("../utilities/draw-utilities");
const { atkIcon, defIcon, scytheIcon, buffIcon } = require("../objects/icons");
const { generateSmallBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class Reaper {
    constructor(gameDiv) {
        this.reaperAtk = 4;
        this.reaperAoeAtk = 3;
        this.reaperDef = 2;
        this.reaperBuffPower = 1;
        this.reaperAction = ReaperActions.DEF;
        this.reaperLockOnSoul = null;
        this.isDeadAndAnimationEnded = false;

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
        this.reaperCtx = this.reaperCanvas.getContext("2d");
        this.reaperCanvas.width = grimReaper[0].length * GameVariables.pixelSize;
        this.reaperCanvas.height = grimReaper.length * GameVariables.pixelSize;
        this.reaperCanvas.id = "reaper";

        this.reaperContainer.appendChild(this.reaperCanvas);

        this.reaperCanvas.style.animation = "addsoul 500ms ease-in-out";
        this.reaperCanvas.addEventListener("animationend", () => {
            this.isDeadAndAnimationEnded = this.reaperStatus.lifeValue <= 0;
            if (!this.isDeadAndAnimationEnded) {
                this.reaperCanvas.style.animation = "reaperAnim 6s infinite ease-in-out";
                this.draw();
            } else {
                this.dispose();
            }
        });

        this.reaperStatus = new Status(this.reaperContainer, 36, 999, 0);

        this.translateReaper();
        this.draw();
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
        if (GameVariables.turnCounter === GameVariables.nextEventTurn) {
            GameVariables.nextEventTurn = GameVariables.nextEventTurn * 2;
            this.reaperAction = ReaperActions.BUFF;
        } else {
            let visibleSouls = [];
            let normalAtkKillsSouls = [];
            let aoeAtkKills = 0;
            GameVariables.souls.forEach((row) => row.forEach((soul) => {
                if (soul && soul.soulStatus.lifeValue > 0) {
                    visibleSouls.push(soul);
                    let soulTotalLife = soul.soulStatus.lifeValue + soul.soulStatus.shieldValue;
                    if (soulTotalLife - this.reaperAtk <= 0) {
                        normalAtkKillsSouls.push(soul);
                    }
                    if (soulTotalLife - this.reaperAoeAtk <= 0) aoeAtkKills++;
                }
            }));
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
            case ReaperActions.BUFF:
                this.drawAction(buffIcon, this.reaperBuffPower);
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
        if (this.reaperAction === ReaperActions.ATK || this.reaperAction === ReaperActions.AOE_ATK) {
            this.reaperCanvas.style.animation = "reaperatk 1s ease-in-out";
        }
        switch (this.reaperAction) {
            case ReaperActions.ATK:
                setTimeout(() => {
                    if (this.reaperLockOnSoul.soulStatus.lifeValue > 0) {
                        this.reaperLockOnSoul.takeDamage(this.reaperAtk);
                    } else {
                        let soulsAlive = [];
                        GameVariables.souls.forEach((row) => row.forEach((soul) => { if (soul && soul.soulStatus.lifeValue > 0) soulsAlive.push(soul); }));
                        console.log(soulsAlive);
                        soulsAlive[Math.floor(Math.random() * soulsAlive.length)].takeDamage(this.reaperAtk);
                    }
                }, 250);
                break;
            case ReaperActions.AOE_ATK:
                setTimeout(() => {
                    GameVariables.souls.forEach((row) => row.forEach((soul) => {
                        if (soul) {
                            soul.takeDamage(this.reaperAoeAtk);
                        }
                    }));
                }, 250);
                break;
            case ReaperActions.BUFF:
                this.reaperCanvas.style.animation = "addshield 500ms ease-in-out";
                this.reaperAtk += this.reaperBuffPower;
                this.reaperAoeAtk += this.reaperBuffPower;
                this.reaperDef += this.reaperBuffPower;
                this.reaperBuffPower++;
                break;
            default:
                this.reaperStatus.addShield(this.reaperDef);
                break;
        }
    }

    takeDamage(dmg) {
        this.reaperStatus.takeDamage(dmg);
        this.draw("red");
        if (this.reaperStatus.lifeValue > 0) {
            this.reaperCanvas.style.animation = "takedmg 400ms ease-in-out";
        } else {
            this.reaperCanvas.style.animation = "addsoul 500ms reverse ease-in-out";
        }
    }

    draw(color = null) {
        this.reaperCtx.clearRect(0, 0, GameVariables.reaperWidth, GameVariables.reaperHeight);
        drawSprite(this.reaperCanvas.getContext("2d"), grimReaper, GameVariables.pixelSize, 0, 0, color);
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
    DEF: 2,
    BUFF: 3,
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