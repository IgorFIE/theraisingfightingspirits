import { GameVars } from "../game-variables";
const { Card } = require("../objects/card");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { createElem } = require("../utilities/draw-utilities");

export class UI {
    constructor(gameDiv) {
        this.energy = 0;

        this.uiCont = createElem(gameDiv, "div", "ui-container");

        this.turnCountCanv = createElem(this.uiCont, "canvas", null, null, 300, 100);
        this.turnCountCanv.style.transform = "translate(" + ((GameVars.gameW / 2) - (this.turnCountCanv.width / 2)) + "px,0px)";
        this.turnCountCtx = this.turnCountCanv.getContext("2d");

        this.energyCanv = createElem(this.uiCont, "canvas");
        this.energyCtx = this.energyCanv.getContext("2d");
        this.populateEnergyCanv();

        this.turnControlCanv = createElem(this.uiCont, "canvas");

        this.nextSoulCanv = createElem(this.uiCont, "canvas", null, null, null, null, null, (e) => this.selectNextSoul());
        this.nextSoulCtx = this.nextSoulCanv.getContext("2d");

        this.prevSoulCanv = createElem(this.uiCont, "canvas", null, null, null, null, null, (e) => this.selectPrevSoul());
        this.prevSoulCtx = this.prevSoulCanv.getContext("2d");

        this.endTurnCanv = createElem(this.uiCont, "canvas", null, null, null, null, null, (e) => this.endTurn());
        this.endTurnCtx = this.endTurnCanv.getContext("2d");

        this.populateTurnControlCanv();

        this.cardCont = createElem(gameDiv, "div", "card-container");
        GameVars.cards = [];

        this.calcCardsArea();
    }

    populateEnergyCanv() {
        this.energyCanv.width = 67 * GameVars.pixelSize;
        this.energyCanv.height = 99 * GameVars.pixelSize;
        this.energyCanv.style.transform = "translate(0px," + (GameVars.gameH - this.energyCanv.height) + "px)";
        generateLargeBox(this.energyCanv, 0, 0, 67 - 1, 99 - 1, GameVars.pixelSize, "black", "white");

        generateLargeBox(this.energyCanv, 5, 5, 56, 53, GameVars.pixelSize, "black", "white");
        drawPixelTextInCanvas(convertTextToPixelArt("energy"), this.energyCanv, GameVars.pixelSize, 33, 12);

        this.energy = GameVars.maxPlayCards - GameVars.cardsPlayed;
        generateSmallBox(this.energyCanv, 17, 17, 31, 30, GameVars.pixelSize, "black", "white");
        drawPixelTextInCanvas(convertTextToPixelArt(this.energy), this.energyCanv, GameVars.pixelSize, 33, 32, "black", 3);

        generateSmallBox(this.energyCanv, 5, 63, 56, 30, GameVars.pixelSize, "black", "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("enable"), this.energyCanv, GameVars.pixelSize, 34, 70);
        drawPixelTextInCanvas(convertTextToPixelArt("monetization"), this.energyCanv, GameVars.pixelSize, 34, 78);
        drawPixelTextInCanvas(convertTextToPixelArt("gain +1 energy"), this.energyCanv, GameVars.pixelSize, 34, 86);
    }

    populateTurnControlCanv() {
        this.turnControlCanv.width = 67 * GameVars.pixelSize;
        this.turnControlCanv.height = 99 * GameVars.pixelSize;
        this.turnControlCanv.style.transform = "translate(" + (GameVars.gameW - this.turnControlCanv.width) + "px," + (GameVars.gameH - this.turnControlCanv.height) + "px)";
        generateLargeBox(this.turnControlCanv, 0, 0, 67 - 1, 99 - 1, GameVars.pixelSize, "black", "white");
        generateSmallBox(this.turnControlCanv, 5, 23, 67 - 11, 31, GameVars.pixelSize, "black", "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("enable"), this.turnControlCanv, GameVars.pixelSize, 34, 28);
        drawPixelTextInCanvas(convertTextToPixelArt("monetization"), this.turnControlCanv, GameVars.pixelSize, 34, 35);
        drawPixelTextInCanvas(convertTextToPixelArt("draw +1"), this.turnControlCanv, GameVars.pixelSize, 34, 42);
        drawPixelTextInCanvas(convertTextToPixelArt("extra card"), this.turnControlCanv, GameVars.pixelSize, 34, 49);

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
    }

    calcCardsArea() {
        GameVars.cardContW = Math.round((GameVars.gameW / 2) / GameVars.pixelSize);
        GameVars.cardContX = ((GameVars.gameW / 2) - ((GameVars.cardContW / 2) * GameVars.pixelSize));
        GameVars.cardContY = (GameVars.gameH - (GameVars.cardContH * GameVars.pixelSize));
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
        if (!GameVars.isEventRunning && !GameVars.reaper.isReaperPlaying) {
            GameVars.sound.clickSound();
            this.disposePlayerCards();
            GameVars.isPlayerTurn = false;
        }
    }

    startPlayerTurn() {
        GameVars.cardsPlayed = 0;
        GameVars.isPlayerTurn = true;
        GameVars.turnCount++;
        this.populatePlayerCards();
    }

    populatePlayerCards() {
        const cardSpace = (GameVars.cardContW * GameVars.pixelSize) / GameVars.drawCardNumb;
        const cardX = (cardSpace / 2) - ((GameVars.cardW / 2) * GameVars.pixelSize);
        const cardY = GameVars.cardContY + (2 * GameVars.pixelSize);
        for (let i = 0; i < GameVars.drawCardNumb; i++) {
            GameVars.cards.push(new Card(this.cardCont, GameVars.cardContX + (i * cardSpace + cardX), cardY));
        }
    }

    disposePlayerCards() {
        GameVars.cards.forEach(card => card.dispose());
        GameVars.cards = [];
    }

    draw() {
        if (this.energy != GameVars.maxPlayCards - GameVars.cardsPlayed) {
            this.energyCtx.clearRect(0, 0, this.energyCanv.width, this.energyCanv.height);
            this.populateEnergyCanv();
        }
        this.drawEndTurnBtn();
        this.drawNexSoulBtn();
        this.drawPrevBtn();
        this.drawTurnCount();
    }

    drawEndTurnBtn() {
        this.endTurnCtx.clearRect(0, 0, this.prevSoulCanv.width, this.prevSoulCanv.height);
        generateLargeBox(this.endTurnCanv, 5, 5, 56, 13, GameVars.pixelSize, "black", GameVars.reaper.isReaperPlaying ? "gray" : "white");
        drawPixelTextInCanvas(convertTextToPixelArt("end turn"), this.endTurnCanv, GameVars.pixelSize, 34, 12);
    }

    drawPrevBtn() {
        this.prevSoulCtx.clearRect(0, 0, this.prevSoulCanv.width, this.prevSoulCanv.height);
        generateLargeBox(this.prevSoulCanv, 5, 3, 56, 13, GameVars.pixelSize, "black", GameVars.prevSoul ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("previous soul"), this.prevSoulCanv, GameVars.pixelSize, 34, 10);
    }

    drawNexSoulBtn() {
        this.nextSoulCtx.clearRect(0, 0, this.nextSoulCanv.width, this.nextSoulCanv.height);
        generateLargeBox(this.nextSoulCanv, 5, 5, 56, 13, GameVars.pixelSize, "black", GameVars.nextSoul ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("next soul"), this.nextSoulCanv, GameVars.pixelSize, 34, 12);
    }

    drawTurnCount() {
        this.turnCountCtx.clearRect(0, 0, this.turnCountCanv.width, this.turnCountCanv.height);
        drawPixelTextInCanvas(convertTextToPixelArt("turn: " + GameVars.turnCount), this.turnCountCanv, GameVars.pixelSize, 150 / GameVars.pixelSize, 25, "black", 2);
    }
}