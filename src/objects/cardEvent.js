import { GameVariables } from "../game-variables";
import { EventBtn, UpStatsType } from "./EventBtn";
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class CardEvent {
    constructor(gameDiv) {
        this.cardEventDiv = document.createElement("div");
        this.cardEventDiv.classList.add("hidden");
        gameDiv.appendChild(this.cardEventDiv);

        this.cardEventCanvas = document.createElement("canvas");
        this.cardEventCanvas.width = GameVariables.gameWidth;
        this.cardEventCanvas.height = GameVariables.gameHeight;
        this.cardEventCanvas.style.backgroundColor = "rgba(150,150,150,0.8)";
        this.cardEventCanvas.style.zIndex = 999;
        this.cardEventDiv.appendChild(this.cardEventCanvas);

        drawPixelTextInCanvasContext(convertTextToPixelArt("event"), this.cardEventCanvas.getContext("2d"), GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels / 14, "black", 6);

        drawPixelTextInCanvasContext(convertTextToPixelArt("select a stat power up"), this.cardEventCanvas.getContext("2d"), GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels / 4, "black", 2);

        this.selectionContainerDiv = document.createElement("div");
        this.cardEventDiv.appendChild(this.selectionContainerDiv);
    }

    startEvent() {
        this.cardEventDiv.classList.remove("hidden");
        let upsStatusUsed = {};
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                let randomUpStatusType = Math.floor(Math.random() * Object.keys(UpStatsType).length);
                while (upsStatusUsed[randomUpStatusType + ""]) {
                    randomUpStatusType = Math.floor(Math.random() * Object.keys(UpStatsType).length);
                }
                upsStatusUsed[randomUpStatusType + ""] = 1;
                new EventBtn(this.selectionContainerDiv, x, y, randomUpStatusType);
            }
        }
    }
}

const EventType = {
    UP_STATS: 0,
    // NEW_CARD: 1
};