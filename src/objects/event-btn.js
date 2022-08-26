import { GameVars } from "../game-variables";
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { generateLargeBox } = require("../utilities/box-generator");
const { createElem } = require("../utilities/draw-utilities");

export class EventBtn {
    constructor(btnContainer, x, y, upstatusType, isMonet) {
        this.x = x;
        this.y = y;
        this.eType = upstatusType;
        this.isMonet = isMonet;

        this.canv = createElem(btnContainer, "canvas", null, ["on-top"], 140 * GameVars.pixelSize, 40 * GameVars.pixelSize, null, () => {
            if (!this.isMonet || this.isMonet && GameVars.isMonetActive) {
                GameVars.sound.buffSound();
                switch (this.eType) {
                    case 0:
                        GameVars.cardDmg += GameVars.cardDmgBuff;
                        GameVars.cardDmgBuff++;
                        break;
                    case 1:
                        GameVars.maxPlayCards++;
                        break;
                    case 2:
                        GameVars.souls.forEach((row) => row.forEach((soul) => {
                            if (soul) {
                                soul.soulStats.maxLife += GameVars.soulLifeBuff;
                                soul.soulStats.draw();
                            }
                        }));
                        GameVars.soulLife += GameVars.soulLifeBuff;
                        GameVars.soulLifeBuff++;
                        break;
                    case 3:
                        GameVars.drawCardNumb++;
                        break;
                    default:
                        GameVars.cardShield += GameVars.cardShieldBuff;
                        GameVars.cardShieldBuff++;
                        break;
                }
                btnContainer.parentElement.classList.add("hidden");
                btnContainer.innerHTML = "";
                GameVars.isEventRunning = false;
            }
        });
        this.ctx = this.canv.getContext("2d");
        this.drawBtn();
    }

    genBtnText() {
        switch (this.eType) {
            case 0:
                return convertTextToPixelArt("cards damage +" + GameVars.cardDmgBuff);
            case 1:
                return convertTextToPixelArt("energy +1");
            case 2:
                return convertTextToPixelArt("souls life +" + GameVars.soulLifeBuff);
            case 3:
                return convertTextToPixelArt("cards draw +1");
            default:
                return convertTextToPixelArt("cards shield +" + GameVars.cardShieldBuff);
        }
    }

    drawBtn() {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        this.canv.style.translate = ((GameVars.gameW / 2) - (this.canv.width + (3 * GameVars.pixelSize)) + (this.x * (this.canv.width + (6 * GameVars.pixelSize)))) + "px " +
            ((GameVars.gameH / 2) - (this.canv.height + (3 * GameVars.pixelSize)) + (this.y * (this.canv.height + (6 * GameVars.pixelSize)))) + "px";
        let monetizationColor = GameVars.isMonetActive ? "rgba(200,200,150,0.8)" : "rgba(75,75,75,0.8)";
        generateLargeBox(this.canv, 0, 0, 139, 39, GameVars.pixelSize, "black", this.isMonet ? monetizationColor : "rgba(150,150,150,0.8)");
        if (this.isMonet) {
            drawPixelTextInCanvas(convertTextToPixelArt("enable monetization"), this.canv, GameVars.pixelSize, 70, 15, "black", 1);
            drawPixelTextInCanvas(this.genBtnText(), this.canv, GameVars.pixelSize, 70, 25, "black", 1);
        } else {
            drawPixelTextInCanvas(this.genBtnText(), this.canv, GameVars.pixelSize, 70, 20, "black", 1);
        }
    }
}