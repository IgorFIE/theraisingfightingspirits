import { GameVars } from "../game-variables";
import { SoundInstance } from "../utilities/sound";
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { generateLargeBox } = require("../utilities/box-generator");
const { createElemOnElem } = require("../utilities/draw-utilities");

export class EventBtn {
    constructor(btnContainer, x, y, upstatusType) {
        this.upStatusType = upstatusType;

        let eventBtnCanvas = createElemOnElem(btnContainer, "canvas", null, ["on-top"], 140 * GameVars.pixelSize, 40 * GameVars.pixelSize, null, () => {
            SoundInstance.buffSound();
            this.useBtn();
            btnContainer.parentElement.classList.add("hidden");
            btnContainer.innerHTML = "";
            GameVars.isEventFinished = true;
        });
        eventBtnCanvas.style.translate = ((GameVars.gameW / 2) - (x * (eventBtnCanvas.width + (10 * GameVars.pixelSize)))) + "px " +
            ((GameVars.gameH / 2) - (y * (eventBtnCanvas.height + (10 * GameVars.pixelSize)))) + "px";
        generateLargeBox(eventBtnCanvas, 0, 0, 139, 39, GameVars.pixelSize, "black", "rgba(150,150,150,0.8)");
        drawPixelTextInCanvas(this.retrieveBtnText(), eventBtnCanvas, GameVars.pixelSize, 70, 20, "black", 1);
    }

    retrieveBtnText() {
        switch (this.upStatusType) {
            case UpStatsType.CARD_DMG:
                return convertTextToPixelArt("cards damage +" + GameVars.cardDmgBuff);
            case UpStatsType.ENERGY:
                return convertTextToPixelArt("energy +1");
            case UpStatsType.MINIONS_LIFE:
                return convertTextToPixelArt("souls life +" + GameVars.soulLifeBuff);
            case UpStatsType.DRAW_CARD:
                return convertTextToPixelArt("cards draw +1");
            default:
                return convertTextToPixelArt("cards shield +" + GameVars.cardShieldBuff);
        }
    }

    useBtn() {
        switch (this.upStatusType) {
            case UpStatsType.CARD_DMG:
                GameVars.cardDmg += GameVars.cardDmgBuff;
                GameVars.cardDmgBuff++;
                break;
            case UpStatsType.ENERGY:
                GameVars.maxPlayCards++;
                break;
            case UpStatsType.MINIONS_LIFE:
                GameVars.souls.forEach((row) => row.forEach((soul) => {
                    if (soul) {
                        soul.soulStatus.maxLifeValue += GameVars.soulLifeBuff;
                        soul.soulStatus.draw();
                    }
                }));
                GameVars.soulLife += GameVars.soulLifeBuff;
                GameVars.soulLifeBuff++;
                break;
            case UpStatsType.DRAW_CARD:
                GameVars.drawCardNumb++;
                break;
            default:
                GameVars.cardShield += GameVars.cardShieldBuff;
                GameVars.cardShieldBuff++;
                break;

        }
    }
}

export const UpStatsType = {
    CARD_DMG: 0,
    CARD_SHIELD: 1,
    ENERGY: 2,
    MINIONS_LIFE: 3,
    DRAW_CARD: 4
};