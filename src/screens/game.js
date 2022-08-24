import { GameVars } from "../game-variables";
import { CardEvent } from "../objects/cardEvent";
import { UI } from "../objects/ui";
import { randomNumb } from "../utilities/general-utilities";
const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Background } = require("../objects/background");
const { createElem } = require("../utilities/draw-utilities");

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
        let fakeSoul = new Soul(fakeSoulContainer, 0, 0);

        const containerW = fakeSoulContainer.clientWidth;
        const containerH = fakeSoulContainer.clientHeight;
        const containerX = (GameVars.gameW / 4) - ((containerW / 2) * 3);
        const containerY = (GameVars.gameH / 2) - (containerH * 2);

        fakeSoul.dispose();
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
            let soul = GameVars.soulInUse;
            let prevSoul = null;
            let nextSoul = null;
            for (let y = 0; y < GameVars.souls.length; y++) {
                for (let x = 0; x < GameVars.souls[0].length; x++) {
                    if (y === soul.y && x === soul.x) {
                        continue;
                    }
                    if (GameVars.souls[y][x] !== null) {
                        if (y < soul.y || (y === soul.y && x < soul.x)) {
                            prevSoul = GameVars.souls[y][x];
                        }

                        if (nextSoul === null && (y > soul.y || (y === soul.y && x > soul.x))) {
                            nextSoul = GameVars.souls[y][x];
                        }
                    }
                }
            }
            GameVars.prevSoul = prevSoul;
            GameVars.nextSoul = nextSoul;
        }
    }

    cleanDeadSouls() {
        for (let y = 0; y < GameVars.souls.length; y++) {
            for (let x = 0; x < GameVars.souls[0].length; x++) {
                let currentSoul = GameVars.souls[y][x];
                if (currentSoul && currentSoul.isDead) {
                    if (currentSoul === GameVars.soulInUse) {
                        GameVars.soulInUse = null;
                    }
                    currentSoul.dispose();
                    GameVars.souls[y][x] = null;
                    GameVars.soulsInGame--;
                }
            }
        }

        if (GameVars.soulInUse === null && GameVars.soulsInGame > 0) {
            let y = randomNumb(GameVars.souls.length);
            let x = randomNumb(GameVars.souls[0].length);
            while (GameVars.souls[y][x] === null) {
                y = randomNumb(GameVars.souls.length);
                x = randomNumb(GameVars.souls[0].length);
            }
            GameVars.soulInUse = GameVars.souls[y][x];
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

    dispose() {
        if (this.gameDiv.parentNode !== null) {
            this.gameDiv.innerHTML = "";
        }
    }
}