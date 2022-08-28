import { GameVars } from "../game-variables";
import { Event } from "../objects/event";
const { Card } = require("../objects/card");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { createElem } = require("../utilities/draw-utilities");

export class UI {
    constructor(gameDiv) {
        this.energy = GameVars.maxPlayCards - GameVars.cardsPlayed;
        this.isNewTurn = true;
        this.wasMonetDeal = false;

        let uiCont = createElem(gameDiv, "div", "ui-container");

        this.turnCountCanv = createElem(uiCont, "canvas", null, null, GameVars.gameW, 50 * GameVars.pixelSize);
        this.turnCountCanv.style.translate = ((GameVars.gameW / 2) - (this.turnCountCanv.width / 2)) + "px " + (Math.round(((GameVars.gameHgAsPixels / 14) - 25) * GameVars.pixelSize)) + "px";
        this.turnCountCtx = this.turnCountCanv.getContext("2d");

        this.energyCanv = createElem(uiCont, "canvas");
        this.energyCtx = this.energyCanv.getContext("2d");
        this.energyCanv.width = 67 * GameVars.pixelSize;
        this.energyCanv.height = 99 * GameVars.pixelSize;
        this.energyCanv.style.transform = "translate(0px," + (GameVars.gameH - this.energyCanv.height) + "px)";

        this.turnControlCanv = createElem(uiCont, "canvas");
        this.turnControlCtx = this.turnControlCanv.getContext("2d");

        this.nextSoulCanv = createElem(uiCont, "canvas", null, null, null, null, null, (e) => this.selectNextSoul());
        this.nextSoulCtx = this.nextSoulCanv.getContext("2d");

        this.prevSoulCanv = createElem(uiCont, "canvas", null, null, null, null, null, (e) => this.selectPrevSoul());
        this.prevSoulCtx = this.prevSoulCanv.getContext("2d");

        this.endTurnCanv = createElem(uiCont, "canvas", null, null, null, null, null, (e) => this.endTurn());
        this.endTurnCtx = this.endTurnCanv.getContext("2d");

        this.turnControlCanv.width = 67 * GameVars.pixelSize;
        this.turnControlCanv.height = 99 * GameVars.pixelSize;
        this.turnControlCanv.style.transform = "translate(" +
            (GameVars.gameW - this.turnControlCanv.width) + "px," +
            (GameVars.gameH - this.turnControlCanv.height) + "px)";

        this.endTurnCanv.width = 67 * GameVars.pixelSize;
        this.endTurnCanv.height = 24 * GameVars.pixelSize;
        this.endTurnCanv.style.transform = "translate(" +
            (GameVars.gameW - this.endTurnCanv.width) + "px," +
            (GameVars.gameH - this.turnControlCanv.height) + "px)";

        this.prevSoulCanv.width = 67 * GameVars.pixelSize;
        this.prevSoulCanv.height = 22 * GameVars.pixelSize;
        this.prevSoulCanv.style.transform = "translate(" +
            (GameVars.gameW - this.prevSoulCanv.width) + "px," +
            (GameVars.gameH - this.prevSoulCanv.height) + "px)";

        this.nextSoulCanv.width = 67 * GameVars.pixelSize;
        this.nextSoulCanv.height = 22 * GameVars.pixelSize;
        this.nextSoulCanv.style.transform = "translate(" +
            (GameVars.gameW - this.nextSoulCanv.width) + "px," +
            (GameVars.gameH - this.prevSoulCanv.height - this.nextSoulCanv.height) + "px)";

        this.cardCont = createElem(gameDiv, "div", "card-container");
        this.cardEvent = new Event(gameDiv);
    }

    selectNextSoul() {
        if (GameVars.nextSoul) {
            GameVars.sound.clickSound();
            GameVars.nextSoul.select();
        }
    }

    selectPrevSoul() {
        if (GameVars.prevSoul) {
            GameVars.sound.clickSound();
            GameVars.prevSoul.select();
        }
    }

    endTurn() {
        if (!GameVars.isEventRunning && GameVars.isPlayerTurn) {
            GameVars.sound.clickSound();
            GameVars.cards.forEach(card => card.dispose());
            GameVars.cards = [];
            GameVars.isPlayerTurn = false;
            this.isNewTurn = true;
        }
    }

    playerTurn() {
        if (GameVars.soulNextEventTurn === GameVars.turnCount && this.isNewTurn) {
            GameVars.soulNextEventTurn = GameVars.soulNextEventTurn * 2;
            GameVars.isEventRunning = true;
            this.cardEvent.startEvent();
        } else if (!GameVars.isEventRunning && this.isNewTurn) {
            this.isNewTurn = false;
            this.wasMonetDeal = false;
            GameVars.cardsPlayed = 0;
            GameVars.turnCount++;
            for (let i = 0; i < GameVars.drawCardNumb; i++) {
                GameVars.cards.push(new Card(this.cardCont, GameVars.cardContX, GameVars.cardContY));
            }
            GameVars.cards[0].updateCards();
        } else if (!GameVars.isEventRunning && GameVars.isMonetActive && !this.wasMonetDeal) {
            this.wasMonetDeal = true;
            GameVars.cardsPlayed--;
            let newCard = new Card(this.cardCont, GameVars.cardContX, GameVars.cardContY);
            GameVars.cards.push(newCard);
            newCard.updateCards();
        } else if (GameVars.isEventRunning) {
            this.cardEvent.eventBtns.forEach((btn) => btn.drawBtn());
        }
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

    draw() {
        this.energyCtx.clearRect(0, 0, this.energyCanv.width, this.energyCanv.height);
        this.energyCanv.width = 67 * GameVars.pixelSize;
        this.energyCanv.height = 99 * GameVars.pixelSize;
        this.energyCanv.style.transform = "translate(0px," + (GameVars.gameH - this.energyCanv.height) + "px)";
        generateLargeBox(this.energyCanv, 0, 0, 67 - 1, 99 - 1, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");

        generateLargeBox(this.energyCanv, 5, 5, 56, 53, GameVars.pixelSize, "black", "white");
        drawPixelTextInCanvas(convertTextToPixelArt("energy"), this.energyCanv, GameVars.pixelSize, 33, 12);

        this.energy = GameVars.maxPlayCards - GameVars.cardsPlayed;
        generateSmallBox(this.energyCanv, 17, 17, 31, 30, GameVars.pixelSize, "black", "white");
        drawPixelTextInCanvas(convertTextToPixelArt(this.energy), this.energyCanv, GameVars.pixelSize, 33, 32, "black", 3);

        generateSmallBox(this.energyCanv, 5, 63, 56, 30, GameVars.pixelSize, "black", GameVars.isMonetActive ? "gold" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("enable"), this.energyCanv, GameVars.pixelSize, 34, 70);
        drawPixelTextInCanvas(convertTextToPixelArt("monetization"), this.energyCanv, GameVars.pixelSize, 34, 78);
        drawPixelTextInCanvas(convertTextToPixelArt("gain +1 energy"), this.energyCanv, GameVars.pixelSize, 34, 86);

        this.turnControlCtx.clearRect(0, 0, this.turnControlCanv.width, this.turnControlCanv.height);
        generateLargeBox(this.turnControlCanv, 0, 0, 67 - 1, 99 - 1, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
        generateSmallBox(this.turnControlCanv, 5, 23, 67 - 11, 31, GameVars.pixelSize, "black", GameVars.isMonetActive ? "gold" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("enable"), this.turnControlCanv, GameVars.pixelSize, 34, 28);
        drawPixelTextInCanvas(convertTextToPixelArt("monetization"), this.turnControlCanv, GameVars.pixelSize, 34, 35);
        drawPixelTextInCanvas(convertTextToPixelArt("draw +1"), this.turnControlCanv, GameVars.pixelSize, 34, 42);
        drawPixelTextInCanvas(convertTextToPixelArt("extra card"), this.turnControlCanv, GameVars.pixelSize, 34, 49);

        this.endTurnCtx.clearRect(0, 0, this.prevSoulCanv.width, this.prevSoulCanv.height);
        generateLargeBox(this.endTurnCanv, 5, 5, 56, 13, GameVars.pixelSize, "black", GameVars.isPlayerTurn ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("end turn"), this.endTurnCanv, GameVars.pixelSize, 34, 12);

        this.prevSoulCtx.clearRect(0, 0, this.prevSoulCanv.width, this.prevSoulCanv.height);
        generateLargeBox(this.prevSoulCanv, 5, 3, 56, 13, GameVars.pixelSize, "black", GameVars.prevSoul ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("previous soul"), this.prevSoulCanv, GameVars.pixelSize, 34, 10);

        this.nextSoulCtx.clearRect(0, 0, this.nextSoulCanv.width, this.nextSoulCanv.height);
        generateLargeBox(this.nextSoulCanv, 5, 5, 56, 13, GameVars.pixelSize, "black", GameVars.nextSoul ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("next soul"), this.nextSoulCanv, GameVars.pixelSize, 34, 12);

        this.turnCountCtx.clearRect(0, 0, this.turnCountCanv.width, this.turnCountCanv.height);
        generateLargeBox(this.turnCountCanv, -20, 0, GameVars.gameWdAsPixels + 40, 49, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
        drawPixelTextInCanvas(convertTextToPixelArt("turn " + GameVars.turnCount), this.turnCountCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, 18, "black", 2);
        drawPixelTextInCanvas(convertTextToPixelArt("score " + GameVars.score), this.turnCountCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, 32, "black", 2);
    }
}