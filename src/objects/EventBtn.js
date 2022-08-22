import { GameVariables } from "../game-variables";
import { SoundInstance } from "../utilities/sound";
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");
const { generateLargeBox } = require("../utilities/box-generator");

export class EventBtn {
    constructor(btnContainer, x, y, upstatusType) {
        this.upStatusType = upstatusType;

        let eventBtnCanvas = document.createElement("canvas");
        let eventBtnCtx = eventBtnCanvas.getContext("2d");
        eventBtnCanvas.width = 140 * GameVariables.pixelSize;
        eventBtnCanvas.height = 40 * GameVariables.pixelSize;
        eventBtnCanvas.style.zIndex = 999;
        eventBtnCanvas.style.translate = ((GameVariables.gameWidth / 2) - (x * (eventBtnCanvas.width + (10 * GameVariables.pixelSize)))) + "px " +
            ((GameVariables.gameHeight / 2) - (y * (eventBtnCanvas.height + (10 * GameVariables.pixelSize)))) + "px";
        generateLargeBox(eventBtnCanvas, 0, 0, 139, 39, GameVariables.pixelSize, "black", "rgba(150,150,150,0.8)");
        drawPixelTextInCanvasContext(this.retrieveBtnText(), eventBtnCtx, GameVariables.pixelSize, 70, 20, "black", 1);

        eventBtnCanvas.addEventListener('click', () => {
            SoundInstance.buffSound();
            this.useBtn();
            btnContainer.parentElement.classList.add("hidden");
            btnContainer.innerHTML = "";
            GameVariables.isEventFinished = true;
        });
        btnContainer.appendChild(eventBtnCanvas);
    }

    retrieveBtnText() {
        switch (this.upStatusType) {
            case UpStatsType.CARD_DMG:
                return convertTextToPixelArt("up cards damage by " + GameVariables.cardDmgBuff);
            case UpStatsType.ENERGY:
                return convertTextToPixelArt("up energy by 1");
            case UpStatsType.MINIONS_LIFE:
                return convertTextToPixelArt("up minion life by " + GameVariables.soulLifeBuff);
            case UpStatsType.DRAW_CARD:
                return convertTextToPixelArt("up draw cards by 1");
            default:
                return convertTextToPixelArt("up cards shield by " + GameVariables.cardShieldBuff);
        }
    }

    useBtn() {
        switch (this.upStatusType) {
            case UpStatsType.CARD_DMG:
                GameVariables.cardDmg += GameVariables.cardDmgBuff;
                GameVariables.cardDmgBuff++;
                break;
            case UpStatsType.ENERGY:
                GameVariables.maxPlayCards++;
                break;
            case UpStatsType.MINIONS_LIFE:
                GameVariables.souls.forEach((row) => row.forEach((soul) => {
                    if (soul) {
                        soul.soulStatus.maxLifeValue += GameVariables.soulLifeBuff;
                        soul.soulStatus.draw();
                    }
                }));
                GameVariables.soulLife += GameVariables.soulLifeBuff;
                GameVariables.soulLifeBuff++;
                break;
            case UpStatsType.DRAW_CARD:
                GameVariables.drawCardNumber++;
                break;
            default:
                GameVariables.cardShield += GameVariables.cardShieldBuff;
                GameVariables.cardShieldBuff++;
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