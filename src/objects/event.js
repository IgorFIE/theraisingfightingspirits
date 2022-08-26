import { GameVars } from "../game-variables";
import { randomNumb } from "../utilities/general-utilities";
import { EventBtn } from "./event-btn";
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { createElem } = require("../utilities/draw-utilities");

export class Event {
    constructor(gameDiv) {
        this.eDiv = createElem(gameDiv, "div", null, ["hidden"]);
        this.eCanv = createElem(this.eDiv, "canvas", null, ["on-top"], GameVars.gameW, GameVars.gameH, "rgba(150,150,150,0.8)");
        this.selectDiv = createElem(this.eDiv, "div");

        this.eventBtns = [];

        drawPixelTextInCanvas(convertTextToPixelArt("event"), this.eCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 14, "black", 6);
        drawPixelTextInCanvas(convertTextToPixelArt("select a power up"), this.eCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 4, "black", 2);
    }

    startEvent() {
        this.eDiv.classList.remove("hidden");
        let upsStatusUsed = {};
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                let randomUpStatusType = randomNumb(5);
                while (upsStatusUsed[randomUpStatusType + ""]) {
                    randomUpStatusType = randomNumb(5);
                }
                upsStatusUsed[randomUpStatusType + ""] = 1;
                this.eventBtns.push(new EventBtn(this.selectDiv, x, y, randomUpStatusType, y === 1 && x === 1));
            }
        }
    }
}