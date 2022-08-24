import { GameVars } from "../game-variables";
import { randomNumb } from "../utilities/general-utilities";
import { EventBtn, UpStatsType } from "./EventBtn";
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { createElem } = require("../utilities/draw-utilities");

export class CardEvent {
    constructor(gameDiv) {
        this.cardEventDiv = createElem(gameDiv, "div", null, ["hidden"]);
        this.cardEventCanvas = createElem(this.cardEventDiv, "canvas", null, ["on-top"], GameVars.gameW, GameVars.gameH, "rgba(150,150,150,0.8)");
        this.selectionContainerDiv = createElem(this.cardEventDiv, "div");

        drawPixelTextInCanvas(convertTextToPixelArt("event"), this.cardEventCanvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 14, "black", 6);
        drawPixelTextInCanvas(convertTextToPixelArt("select a power up"), this.cardEventCanvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 4, "black", 2);
    }

    startEvent() {
        this.cardEventDiv.classList.remove("hidden");
        let upsStatusUsed = {};
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                let randomUpStatusType = randomNumb(Object.keys(UpStatsType).length);
                while (upsStatusUsed[randomUpStatusType + ""]) {
                    randomUpStatusType = randomNumb(Object.keys(UpStatsType).length);
                }
                upsStatusUsed[randomUpStatusType + ""] = 1;
                new EventBtn(this.selectionContainerDiv, x, y, randomUpStatusType);
            }
        }
    }
}