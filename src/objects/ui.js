import { GameVariables } from "../game-variables";
import { SoundInstance } from "../utilities/sound";
const { Card } = require("../objects/card");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");
const { createElemOnElem } = require("../utilities/draw-utilities");

export class UI {
    constructor(gameDiv) {
        this.currentEnergy = 0;

        this.uiContainer = createElemOnElem(gameDiv, "div", "ui-container");

        this.turnCounterCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, 300, 100);
        this.turnCounterCanvas.style.transform = "translate(" + ((GameVariables.gameWidth / 2) - (this.turnCounterCanvas.width / 2)) + "px,0px)";
        this.turnCounterCtx = this.turnCounterCanvas.getContext("2d");

        this.energyCanvas = createElemOnElem(this.uiContainer, "canvas");
        this.energyCanvasCtx = this.energyCanvas.getContext("2d");
        this.populateEnergyCanvas();

        this.turnControllersCanvas = createElemOnElem(this.uiContainer, "canvas");
        this.turnControllersCtx = this.turnControllersCanvas.getContext("2d");

        this.nextSoulCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, null, null, null, (e) => this.selectNextSoul());
        this.nextSoulCtx = this.nextSoulCanvas.getContext("2d");

        this.previousSoulCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, null, null, null, (e) => this.selectPreviousSoul());
        this.previousSoulCtx = this.previousSoulCanvas.getContext("2d");

        this.endTurnCanvas = createElemOnElem(this.uiContainer, "canvas", null, null, null, null, null, (e) => this.endTurn());
        this.endTurnCtx = this.endTurnCanvas.getContext("2d");

        this.populateTurnControllersCanvas();

        this.cardContainer = createElemOnElem(gameDiv, "div", "card-container");
        GameVariables.cards = [];

        this.calculateCardsArea();
    }

    populateEnergyCanvas() {
        this.energyCanvas.width = 67 * GameVariables.pixelSize;
        this.energyCanvas.height = 99 * GameVariables.pixelSize;
        this.energyCanvas.style.transform = "translate(0px," + (GameVariables.gameHeight - this.energyCanvas.height) + "px)";
        generateLargeBox(this.energyCanvas, 0, 0, 67 - 1, 99 - 1, GameVariables.pixelSize, "black", "white");

        generateLargeBox(this.energyCanvas, 5, 5, 56, 53, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt("ENERGY"), this.energyCanvasCtx, GameVariables.pixelSize, 33, 12);

        this.currentEnergy = GameVariables.maxPlayCards - GameVariables.cardsPlayed;
        generateSmallBox(this.energyCanvas, 17, 17, 31, 30, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt(this.currentEnergy), this.energyCanvasCtx, GameVariables.pixelSize, 33, 32, "black", 3);

        generateSmallBox(this.energyCanvas, 5, 63, 56, 30, GameVariables.pixelSize, "black", "gray");
        drawPixelTextInCanvasContext(convertTextToPixelArt("ENABLE"), this.energyCanvasCtx, GameVariables.pixelSize, 34, 70);
        drawPixelTextInCanvasContext(convertTextToPixelArt("MONETIZATION"), this.energyCanvasCtx, GameVariables.pixelSize, 34, 78);
        drawPixelTextInCanvasContext(convertTextToPixelArt("GAIN +1 ENERGY"), this.energyCanvasCtx, GameVariables.pixelSize, 34, 86);
    }

    populateTurnControllersCanvas() {
        this.turnControllersCanvas.width = 67 * GameVariables.pixelSize;
        this.turnControllersCanvas.height = 99 * GameVariables.pixelSize;
        this.turnControllersCanvas.style.transform = "translate(" + (GameVariables.gameWidth - this.turnControllersCanvas.width) + "px," + (GameVariables.gameHeight - this.turnControllersCanvas.height) + "px)";
        generateLargeBox(this.turnControllersCanvas, 0, 0, 67 - 1, 99 - 1, GameVariables.pixelSize, "black", "white");
        generateSmallBox(this.turnControllersCanvas, 5, 23, 67 - 11, 31, GameVariables.pixelSize, "black", "gray");
        drawPixelTextInCanvasContext(convertTextToPixelArt("ENABLE"), this.turnControllersCtx, GameVariables.pixelSize, 34, 28);
        drawPixelTextInCanvasContext(convertTextToPixelArt("MONETIZATION"), this.turnControllersCtx, GameVariables.pixelSize, 34, 35);
        drawPixelTextInCanvasContext(convertTextToPixelArt("DRAW +1"), this.turnControllersCtx, GameVariables.pixelSize, 34, 42);
        drawPixelTextInCanvasContext(convertTextToPixelArt("EXTRA CARD"), this.turnControllersCtx, GameVariables.pixelSize, 34, 49);

        this.endTurnCanvas.width = 67 * GameVariables.pixelSize;
        this.endTurnCanvas.height = 24 * GameVariables.pixelSize;
        this.endTurnCanvas.style.transform = "translate(" +
            (GameVariables.gameWidth - this.endTurnCanvas.width) + "px," +
            (GameVariables.gameHeight - this.turnControllersCanvas.height) + "px)";

        this.previousSoulCanvas.width = 67 * GameVariables.pixelSize;
        this.previousSoulCanvas.height = 22 * GameVariables.pixelSize;
        this.previousSoulCanvas.style.transform = "translate(" +
            (GameVariables.gameWidth - this.previousSoulCanvas.width) + "px," +
            (GameVariables.gameHeight - this.previousSoulCanvas.height) + "px)";

        this.nextSoulCanvas.width = 67 * GameVariables.pixelSize;
        this.nextSoulCanvas.height = 22 * GameVariables.pixelSize;
        this.nextSoulCanvas.style.transform = "translate(" +
            (GameVariables.gameWidth - this.nextSoulCanvas.width) + "px," +
            (GameVariables.gameHeight - this.previousSoulCanvas.height - this.nextSoulCanvas.height) + "px)";
    }

    calculateCardsArea() {
        GameVariables.cardContainerW = Math.round((GameVariables.gameWidth / 2) / GameVariables.pixelSize);
        GameVariables.cardContainerX = ((GameVariables.gameWidth / 2) - ((GameVariables.cardContainerW / 2) * GameVariables.pixelSize));
        GameVariables.cardContainerY = (GameVariables.gameHeight - (GameVariables.cardContainerH * GameVariables.pixelSize));
    }

    selectNextSoul() {
        if (GameVariables.nextSoul) {
            SoundInstance.clickSound();
            GameVariables.nextSoul.selectSoul();
        }
    }

    selectPreviousSoul() {
        if (GameVariables.previousSoul) {
            SoundInstance.clickSound();
            GameVariables.previousSoul.selectSoul();
        }
    }

    endTurn() {
        if (!GameVariables.isEventRunning && !GameVariables.reaper.isReaperPlaying) {
            SoundInstance.clickSound();
            this.disposePlayerCards();
            GameVariables.isPlayerTurn = false;
        }
    }

    startPlayerTurn() {
        GameVariables.cardsPlayed = 0;
        GameVariables.isPlayerTurn = true;
        GameVariables.turnCounter++;
        this.populatePlayerCards();
    }

    populatePlayerCards() {
        const cardSpace = (GameVariables.cardContainerW * GameVariables.pixelSize) / GameVariables.drawCardNumber;
        const cardX = (cardSpace / 2) - ((GameVariables.cardWidth / 2) * GameVariables.pixelSize);
        const cardY = GameVariables.cardContainerY + (2 * GameVariables.pixelSize);
        for (let i = 0; i < GameVariables.drawCardNumber; i++) {
            GameVariables.cards.push(new Card(this.cardContainer, GameVariables.cardContainerX + (i * cardSpace + cardX), cardY));
        }
    }

    disposePlayerCards() {
        GameVariables.cards.forEach(card => card.dispose());
        GameVariables.cards = [];
    }

    draw() {
        if (this.currentEnergy != GameVariables.maxPlayCards - GameVariables.cardsPlayed) {
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
        generateLargeBox(this.endTurnCanvas, 5, 5, 56, 13, GameVariables.pixelSize, "black", GameVariables.reaper.isReaperPlaying ? "gray" : "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt("END TURN"), this.endTurnCtx, GameVariables.pixelSize, 34, 12);
    }

    drawPreviousBtn() {
        this.previousSoulCtx.clearRect(0, 0, this.previousSoulCanvas.width, this.previousSoulCanvas.height);
        generateLargeBox(this.previousSoulCanvas, 5, 3, 56, 13, GameVariables.pixelSize, "black", GameVariables.previousSoul ? "white" : "gray");
        drawPixelTextInCanvasContext(convertTextToPixelArt("PREVIOUS SOUL"), this.previousSoulCtx, GameVariables.pixelSize, 34, 10);
    }

    drawNexSoulBtn() {
        this.nextSoulCtx.clearRect(0, 0, this.nextSoulCanvas.width, this.nextSoulCanvas.height);
        generateLargeBox(this.nextSoulCanvas, 5, 5, 56, 13, GameVariables.pixelSize, "black", GameVariables.nextSoul ? "white" : "gray");
        drawPixelTextInCanvasContext(convertTextToPixelArt("NEXT SOUL"), this.nextSoulCtx, GameVariables.pixelSize, 34, 12);
    }

    drawTurnCounter() {
        this.turnCounterCtx.clearRect(0, 0, this.turnCounterCanvas.width, this.turnCounterCanvas.height);
        drawPixelTextInCanvasContext(convertTextToPixelArt("TURN: " + GameVariables.turnCounter), this.turnCounterCtx, GameVariables.pixelSize, 150 / GameVariables.pixelSize, 25, "black", 2);
    }
}