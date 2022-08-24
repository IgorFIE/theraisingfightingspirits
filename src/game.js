import { GameVars } from "./game-variables";
import { CardEvent } from "./objects/cardEvent";
import { UI } from "./objects/ui";
import { randomNumb, retrieveSoulCoords } from "./utilities/general-utilities";
const { Reaper } = require("./objects/reaper");
const { Soul } = require("./objects/soul");
const { Background } = require("./objects/background");
const { createElem } = require("./utilities/draw-utilities");

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;

        this.background = new Background(gameDiv);

        this.generateSoulsContainers();
        GameVars.souls[1][1] = new Soul(GameVars.soulsConts[1][1], 1, 1);
        GameVars.souls[1][1].select();
        GameVars.soulsInGame++;

        GameVars.reaper = new Reaper(gameDiv);
        this.background.generate(GameVars.reaper);

        this.ui = new UI(gameDiv);
        this.ui.startPlayerTurn();

        this.cardEvent = new CardEvent(gameDiv);

        GameVars.isGameOver = false;
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
            if (!GameVars.isEventRunning) {
                GameVars.reaper.reaperTurn();
                if (GameVars.soulNextEventTurn === GameVars.turnCount) {
                    GameVars.soulNextEventTurn = GameVars.soulNextEventTurn * 2;
                    GameVars.isEventRunning = true;
                    setTimeout(() => this.cardEvent.startEvent(), 1500);
                } else {
                    GameVars.isPlayerTurn = true;
                    setTimeout(() => this.ui.startPlayerTurn(), 750);
                }
            }

            if (GameVars.isEventRunning && GameVars.isEventFinished) {
                GameVars.isEventRunning = false;
                GameVars.isEventFinished = false;
                this.ui.startPlayerTurn();
            }
        }
        this.retrieveNextPrevSoul();
    }

    retrieveNextPrevSoul() {
        if (GameVars.soulsInGame > 1) {
            const soulInUse = GameVars.soulInUse;
            GameVars.prevSoul = null;
            GameVars.nextSoul = null;
            GameVars.souls.forEach(row => row.forEach(soul => {
                if (soul && soul !== soulInUse) {
                    if (soul.y < soulInUse.y || (soul.y === soulInUse.y && soul.x < soulInUse.x)) {
                        GameVars.prevSoul = soul;
                    }
                    if (GameVars.nextSoul === null && (soul.y > soulInUse.y || (soul.y === soulInUse.y && soul.x > soulInUse.x))) {
                        GameVars.nextSoul = soul;
                    }
                }
            }));
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

        if (GameVars.soulsInGame <= 0) {
            GameVars.isGameOver = true;
        }
    }

    draw() {
        this.ui.draw();
        GameVars.cards.forEach(card => card.draw());
    }
}