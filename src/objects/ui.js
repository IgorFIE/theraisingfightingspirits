import { GameVariables } from "../game-variables";
const { Card } = require("../objects/card");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class UI {
    constructor(gameDiv) {
        this.currentEnergy = 0;
        this.uiContainer = document.createElement("div");
        this.uiContainer.id = "ui-container";
        gameDiv.appendChild(this.uiContainer);

        this.turnCounterCanvas = document.createElement("canvas");
        this.turnCounterCanvas.width = 300;
        this.turnCounterCanvas.height = 100;
        this.turnCounterCanvas.style.transform = "translate(" + ((GameVariables.gameWidth / 2) - (this.turnCounterCanvas.width / 2)) + "px,0px)";
        this.turnCounterCtx = this.turnCounterCanvas.getContext("2d");
        this.uiContainer.appendChild(this.turnCounterCanvas);

        this.energyCanvas = document.createElement("canvas");
        this.energyCanvasCtx = this.energyCanvas.getContext("2d");
        this.uiContainer.appendChild(this.energyCanvas);
        this.populateEnergyCanvas();

        this.turnControllersCanvas = document.createElement("canvas");
        this.turnControllersCtx = this.turnControllersCanvas.getContext("2d");
        this.uiContainer.appendChild(this.turnControllersCanvas);

        this.nextSoulCanvas = document.createElement("canvas");
        this.nextSoulCtx = this.nextSoulCanvas.getContext("2d");
        this.nextSoulCanvas.addEventListener('click', (e) => this.selectNextSoul());
        this.uiContainer.appendChild(this.nextSoulCanvas);

        this.previousSoulCanvas = document.createElement("canvas");
        this.previousSoulCtx = this.previousSoulCanvas.getContext("2d");
        this.previousSoulCanvas.addEventListener('click', (e) => this.selectPreviousSoul());
        this.uiContainer.appendChild(this.previousSoulCanvas);

        this.endTurnCanvas = document.createElement("canvas");
        this.endTurnCanvas.addEventListener('click', (e) => this.endTurn());
        this.uiContainer.appendChild(this.endTurnCanvas);

        this.populateTurnControllersCanvas();

        this.cardContainer = document.createElement("div");
        this.cardContainer.id = "card-container";
        gameDiv.appendChild(this.cardContainer);
        GameVariables.cards = [];

        // this.test = document.createElement("canvas");
        // this.test.id = "test";
        // this.gameDiv.appendChild(this.test);
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
        generateLargeBox(this.endTurnCanvas, 5, 5, 56, 13, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt("END TURN"), this.endTurnCanvas.getContext("2d"), GameVariables.pixelSize, 34, 12);

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
        // this.test.width = GameVariables.cardContainerW * GameVariables.pixelSize;
        // this.test.height = GameVariables.cardContainerH * GameVariables.pixelSize;

        GameVariables.cardContainerX = ((GameVariables.gameWidth / 2) - ((GameVariables.cardContainerW / 2) * GameVariables.pixelSize));
        GameVariables.cardContainerY = (GameVariables.gameHeight - (GameVariables.cardContainerH * GameVariables.pixelSize));

        // this.test.style.transform = "translate(" + GameVariables.cardContainerX + "px, " + GameVariables.cardContainerY + "px)";
    }

    selectNextSoul() {
        if (GameVariables.nextSoul) {
            GameVariables.nextSoul.selectSoul();
        }
    }

    selectPreviousSoul() {
        if (GameVariables.previousSoul) {
            GameVariables.previousSoul.selectSoul();
        }
    }

    endTurn() {
        if (!GameVariables.isEventRunning) {
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
        this.drawNexSoulBtn();
        this.drawPreviousBtn();
        this.drawTurnCounter();
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