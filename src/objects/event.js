import { GameVars } from "../game-variables";
import { genLargeBox } from "../utilities/box-generator";
import { randomNumb } from "../utilities/general-utilities";
import { EventBtn } from "./event-btn";
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { createElem } = require("../utilities/draw-utilities");

export class Event {
    constructor(gameDiv) {
        this.eDiv = createElem(gameDiv, "div", null, ["hidden"]);
        this.eCanv = createElem(this.eDiv, "canvas", null, ["ontop"], GameVars.gameW, GameVars.gameH, "rgb(101,107,114,0.6)");
        this.selectDiv = createElem(this.eDiv, "div");

        this.eventBtns = [];

        genLargeBox(this.eCanv, -20, Math.round((GameVars.gameHgAsPixels / 14) - 25), GameVars.gameWdAsPixels + 40, 70, GameVars.pixelSize, "black", "rgba(255,255,255,0.8)");
        drawPixelTextInCanvas(convertTextToPixelArt("event"), this.eCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, Math.round(GameVars.gameHgAsPixels / 14), "black", 6);
        drawPixelTextInCanvas(convertTextToPixelArt("select a power up"), this.eCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, Math.round((GameVars.gameHgAsPixels / 14) + 30), "black", 2);
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