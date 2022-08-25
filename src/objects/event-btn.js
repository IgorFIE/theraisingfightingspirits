import { GameVars } from "../game-variables";
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { generateLargeBox } = require("../utilities/box-generator");
const { createElem } = require("../utilities/draw-utilities");

export class EventBtn {
    constructor(btnContainer, x, y, upstatusType) {
        this.eType = upstatusType;

        let eventBtnCanvas = createElem(btnContainer, "canvas", null, ["on-top"], 140 * GameVars.pixelSize, 40 * GameVars.pixelSize, null, () => {
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
        });
        eventBtnCanvas.style.translate = ((GameVars.gameW / 2) - (x * (eventBtnCanvas.width + (10 * GameVars.pixelSize)))) + "px " +
            ((GameVars.gameH / 2) - (y * (eventBtnCanvas.height + (10 * GameVars.pixelSize)))) + "px";
        generateLargeBox(eventBtnCanvas, 0, 0, 139, 39, GameVars.pixelSize, "black", "rgba(150,150,150,0.8)");
        drawPixelTextInCanvas(this.genBtnText(), eventBtnCanvas, GameVars.pixelSize, 70, 20, "black", 1);
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
}