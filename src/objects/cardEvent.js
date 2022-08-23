import { GameVariables } from "../game-variables";
import { EventBtn, UpStatsType } from "./EventBtn";
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");
const { createElemOnElem } = require("../utilities/draw-utilities");

export class CardEvent {
    constructor(gameDiv) {
        this.cardEventDiv = createElemOnElem(gameDiv, "div", null, ["hidden"]);
        this.cardEventCanvas = createElemOnElem(this.cardEventDiv, "canvas", null, ["on-top"], GameVariables.gameWidth, GameVariables.gameHeight, "rgba(150,150,150,0.8)");
        this.selectionContainerDiv = createElemOnElem(this.cardEventDiv, "div");

        drawPixelTextInCanvasContext(convertTextToPixelArt("event"), this.cardEventCanvas.getContext("2d"), GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels / 14, "black", 6);
        drawPixelTextInCanvasContext(convertTextToPixelArt("select a power up"), this.cardEventCanvas.getContext("2d"), GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels / 4, "black", 2);
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