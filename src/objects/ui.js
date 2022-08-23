import { GameVars } from "../game-variables";
import { SoundInstance } from "../utilities/sound";
const { Card } = require("../objects/card");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");
const { createElemOnElem } = require("../utilities/draw-utilities");

export class UI {
    constructor(gameDiv) {
        this.currentEnergy = 0;

        this.uiContainer = createElemOnElem(gameDiv, "div", "ui-container");

        this.turnCounterCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, 300, 100);
        this.turnCounterCanvas.style.transform = "translate(" + ((GameVars.gameW / 2) - (this.turnCounterCanvas.width / 2)) + "px,0px)";
        this.turnCounterCtx = this.turnCounterCanvas.getContext("2d");

        this.energyCanvas = createElemOnElem(this.uiContainer, "canvas");
        this.energyCanvasCtx = this.energyCanvas.getContext("2d");
        this.populateEnergyCanvas();

        this.turnControllersCanvas = createElemOnElem(this.uiContainer, "canvas");

        this.nextSoulCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, null, null, null, (e) => this.selectNextSoul());
        this.nextSoulCtx = this.nextSoulCanvas.getContext("2d");

        this.previousSoulCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, null, null, null, (e) => this.selectPreviousSoul());
        this.previousSoulCtx = this.previousSoulCanvas.getContext("2d");

        this.endTurnCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, null, null, null, (e) => this.endTurn());
        this.endTurnCtx = this.endTurnCanvas.getContext("2d");

        this.populateTurnControllersCanvas();

        this.cardContainer = createElemOnElem(gameDiv, "div", "card-container");
        GameVars.cards = [];

        this.calculateCardsArea();
    }

    populateEnergyCanvas() {
        this.energyCanvas.width = 67 * GameVars.pixelSize;
        this.energyCanvas.height = 99 * GameVars.pixelSize;
        this.energyCanvas.style.transform = "translate(0px," + (GameVars.gameH - this.energyCanvas.height) + "px)";
        generateLargeBox(this.energyCanvas, 0, 0, 67 - 1, 99 - 1, GameVars.pixelSize, "black", "white");

        generateLargeBox(this.energyCanvas, 5, 5, 56, 53, GameVars.pixelSize, "black", "white");
        drawPixelTextInCanvas(convertTextToPixelArt("ENERGY"), this.energyCanvas, GameVars.pixelSize, 33, 12);

        this.currentEnergy = GameVars.maxPlayCards - GameVars.cardsPlayed;
        generateSmallBox(this.energyCanvas, 17, 17, 31, 30, GameVars.pixelSize, "black", "white");
        drawPixelTextInCanvas(convertTextToPixelArt(this.currentEnergy), this.energyCanvas, GameVars.pixelSize, 33, 32, "black", 3);

        generateSmallBox(this.energyCanvas, 5, 63, 56, 30, GameVars.pixelSize, "black", "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("ENABLE"), this.energyCanvas, GameVars.pixelSize, 34, 70);
        drawPixelTextInCanvas(convertTextToPixelArt("MONETIZATION"), this.energyCanvas, GameVars.pixelSize, 34, 78);
        drawPixelTextInCanvas(convertTextToPixelArt("GAIN +1 ENERGY"), this.energyCanvas, GameVars.pixelSize, 34, 86);
    }

    populateTurnControllersCanvas() {
        this.turnControllersCanvas.width = 67 * GameVars.pixelSize;
        this.turnControllersCanvas.height = 99 * GameVars.pixelSize;
        this.turnControllersCanvas.style.transform = "translate(" + (GameVars.gameW - this.turnControllersCanvas.width) + "px," + (GameVars.gameH - this.turnControllersCanvas.height) + "px)";
        generateLargeBox(this.turnControllersCanvas, 0, 0, 67 - 1, 99 - 1, GameVars.pixelSize, "black", "white");
        generateSmallBox(this.turnControllersCanvas, 5, 23, 67 - 11, 31, GameVars.pixelSize, "black", "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("ENABLE"), this.turnControllersCanvas, GameVars.pixelSize, 34, 28);
        drawPixelTextInCanvas(convertTextToPixelArt("MONETIZATION"), this.turnControllersCanvas, GameVars.pixelSize, 34, 35);
        drawPixelTextInCanvas(convertTextToPixelArt("DRAW +1"), this.turnControllersCanvas, GameVars.pixelSize, 34, 42);
        drawPixelTextInCanvas(convertTextToPixelArt("EXTRA CARD"), this.turnControllersCanvas, GameVars.pixelSize, 34, 49);

        this.endTurnCanvas.width = 67 * GameVars.pixelSize;
        this.endTurnCanvas.height = 24 * GameVars.pixelSize;
        this.endTurnCanvas.style.transform = "translate(" +
            (GameVars.gameW - this.endTurnCanvas.width) + "px," +
            (GameVars.gameH - this.turnControllersCanvas.height) + "px)";

        this.previousSoulCanvas.width = 67 * GameVars.pixelSize;
        this.previousSoulCanvas.height = 22 * GameVars.pixelSize;
        this.previousSoulCanvas.style.transform = "translate(" +
            (GameVars.gameW - this.previousSoulCanvas.width) + "px," +
            (GameVars.gameH - this.previousSoulCanvas.height) + "px)";

        this.nextSoulCanvas.width = 67 * GameVars.pixelSize;
        this.nextSoulCanvas.height = 22 * GameVars.pixelSize;
        this.nextSoulCanvas.style.transform = "translate(" +
            (GameVars.gameW - this.nextSoulCanvas.width) + "px," +
            (GameVars.gameH - this.previousSoulCanvas.height - this.nextSoulCanvas.height) + "px)";
    }

    calculateCardsArea() {
        GameVars.cardContW = Math.round((GameVars.gameW / 2) / GameVars.pixelSize);
        GameVars.cardContX = ((GameVars.gameW / 2) - ((GameVars.cardContW / 2) * GameVars.pixelSize));
        GameVars.cardContY = (GameVars.gameH - (GameVars.cardContH * GameVars.pixelSize));
    }

    selectNextSoul() {
        if (GameVars.nextSoul) {
            SoundInstance.clickSound();
            GameVars.nextSoul.selectSoul();
        }
    }

    selectPreviousSoul() {
        if (GameVars.prevSoul) {
            SoundInstance.clickSound();
            GameVars.previousSoul.selectSoul();
        }
    }

    endTurn() {
        if (!GameVars.isEventRunning && !GameVars.reaper.isReaperPlaying) {
            SoundInstance.clickSound();
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
            GameVars.cards.push(new Card(this.cardContainer, GameVars.cardContX + (i * cardSpace + cardX), cardY));
        }
    }

    disposePlayerCards() {
        GameVars.cards.forEach(card => card.dispose());
        GameVars.cards = [];
    }

    draw() {
        if (this.currentEnergy != GameVars.maxPlayCards - GameVars.cardsPlayed) {
            this.energyCanvasCtx.clearRect(0, 0, this.energyCanvas.width, this.energyCanvas.height);
            this.populateEnergyCanvas();
        }
        this.drawEndTurnBtn();
        this.drawNexSoulBtn();
        this.drawPreviousBtn();
        this.drawTurnCounter();
    }

    drawEndTurnBtn() {
        this.endTurnCtx.clearRect(0, 0, this.previousSoulCanvas.width, this.previousSoulCanvas.height);
        generateLargeBox(this.endTurnCanvas, 5, 5, 56, 13, GameVars.pixelSize, "black", GameVars.reaper.isReaperPlaying ? "gray" : "white");
        drawPixelTextInCanvas(convertTextToPixelArt("END TURN"), this.endTurnCanvas, GameVars.pixelSize, 34, 12);
    }

    drawPreviousBtn() {
        this.previousSoulCtx.clearRect(0, 0, this.previousSoulCanvas.width, this.previousSoulCanvas.height);
        generateLargeBox(this.previousSoulCanvas, 5, 3, 56, 13, GameVars.pixelSize, "black", GameVars.prevSoul ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("PREVIOUS SOUL"), this.previousSoulCanvas, GameVars.pixelSize, 34, 10);
    }

    drawNexSoulBtn() {
        this.nextSoulCtx.clearRect(0, 0, this.nextSoulCanvas.width, this.nextSoulCanvas.height);
        generateLargeBox(this.nextSoulCanvas, 5, 5, 56, 13, GameVars.pixelSize, "black", GameVars.nextSoul ? "white" : "gray");
        drawPixelTextInCanvas(convertTextToPixelArt("NEXT SOUL"), this.nextSoulCanvas, GameVars.pixelSize, 34, 12);
    }

    drawTurnCounter() {
        this.turnCounterCtx.clearRect(0, 0, this.turnCounterCanvas.width, this.turnCounterCanvas.height);
        drawPixelTextInCanvas(convertTextToPixelArt("TURN: " + GameVars.turnCount), this.turnCounterCanvas, GameVars.pixelSize, 150 / GameVars.pixelSize, 25, "black", 2);
    }
}