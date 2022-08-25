import { GameVars } from "./game-variables";
import { UI } from "./objects/ui";
import { randomNumb, retrieveSoulCoords } from "./utilities/general-utilities";
const { Reaper } = require("./objects/reaper");
const { Soul } = require("./objects/soul");
const { Background } = require("./objects/background");
const { createElem } = require("./utilities/draw-utilities");

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;

        GameVars.resetGameVars();

        this.background = new Background(gameDiv);

        this.generateSoulsContainers();
        GameVars.souls[1][1] = new Soul(GameVars.soulsConts[1][1], 1, 1);
        GameVars.souls[1][1].select();
        GameVars.soulsInGame++;

        GameVars.reaper = new Reaper(gameDiv);
        this.background.generate(GameVars.reaper);

        this.ui = new UI(gameDiv);
    }

    generateSoulsContainers() {
        let fakeSoulContainer = createElem(this.gameDiv, "div", null, ["soul-container"]);
        new Soul(fakeSoulContainer, 0, 0);

        const containerW = fakeSoulContainer.clientWidth;
        const containerH = fakeSoulContainer.clientHeight;
        const containerX = (GameVars.gameW / 4) - ((containerW / 2) * 3);
        const containerY = (GameVars.gameH / 2) - (containerH * 2);

        fakeSoulContainer.parentElement.removeChild(fakeSoulContainer);

        for (let y = 0; y < 3; y++) {
            let newSoulContainerArray = [];
            let newSoulArray = [];
            for (let x = 0; x < 3; x++) {
                let soulContainer = createElem(this.gameDiv, "div", null, ["soul-container"]);
                soulContainer.style.transform = "translate(" +
                    (containerX + (containerW * x)) + "px," +
                    (containerY + (containerH * y)) + "px)";
                newSoulContainerArray.push(soulContainer);
                newSoulArray.push(null);
            }
            GameVars.soulsConts.push(newSoulContainerArray);
            GameVars.souls.push(newSoulArray);
        }
    }

    update() {
        this.cleanDeadSouls();
        if (!GameVars.isPlayerTurn) {
            GameVars.reaper.reaperTurn();
        } else {
            this.ui.playerTurn();
        }
    }

    cleanDeadSouls() {
        GameVars.souls.forEach((row, y) => row.forEach((soul, x) => {
            if (soul && soul.isDead) {
                if (soul === GameVars.soulInUse) {
                    GameVars.soulInUse = null;
                }
                soul.soulCanv.parentElement.innerHTML = "";
                GameVars.souls[y][x] = null;
                GameVars.soulsInGame--;
            }
        }));

        if (GameVars.soulInUse === null && GameVars.soulsInGame > 0) {
            let soulCoords = retrieveSoulCoords(GameVars.souls, (y, x) => GameVars.souls[y][x] === null);
            GameVars.soulInUse = GameVars.souls[soulCoords.y][soulCoords.x];
            GameVars.soulInUse.select();
        }
    }

    draw() {
        this.ui.draw();
        GameVars.cards.forEach(card => card.draw());
    }
}