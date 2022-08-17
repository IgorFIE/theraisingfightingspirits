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

        this.energyCanvas = document.createElement("canvas");
        this.energyCanvasCtx = this.energyCanvas.getContext("2d");
        this.uiContainer.appendChild(this.energyCanvas);
        this.populateEnergyCanvas();

        this.turnControllersCanvas = document.createElement("canvas");
        this.uiContainer.appendChild(this.turnControllersCanvas);

        this.endTurnCanvas = document.createElement("canvas");
        this.endTurnCanvas.addEventListener('click', (e) => this.endTurn());
        this.endTurnCtx = this.endTurnCanvas.getContext("2d");
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
        this.energyCanvas.height = 93 * GameVariables.pixelSize;
        this.energyCanvas.style.transform = "translate(0px," + (GameVariables.gameHeight - this.energyCanvas.height) + "px)";
        generateLargeBox(this.energyCanvas, 0, 0, 67 - 1, 93 - 1, GameVariables.pixelSize, "black", "white");

        generateLargeBox(this.energyCanvas, 5, 5, 56, 53, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt("ENERGY"), this.energyCanvasCtx, GameVariables.pixelSize, 33, 12);

        this.currentEnergy = GameVariables.maxPlayCards - GameVariables.cardsPlayed;
        generateSmallBox(this.energyCanvas, 17, 17, 31, 30, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt(this.currentEnergy), this.energyCanvasCtx, GameVariables.pixelSize, 33, 32, "black", 3);
    }

    populateTurnControllersCanvas() {
        this.turnControllersCanvas.width = 67 * GameVariables.pixelSize;
        this.turnControllersCanvas.height = 93 * GameVariables.pixelSize;
        this.turnControllersCanvas.style.transform = "translate(" + (GameVariables.gameWidth - this.turnControllersCanvas.width) + "px," + (GameVariables.gameHeight - this.turnControllersCanvas.height) + "px)";
        generateLargeBox(this.turnControllersCanvas, 0, 0, 67 - 1, 93 - 1, GameVariables.pixelSize, "black", "white");

        this.endTurnCanvas.width = 57 * GameVariables.pixelSize;
        this.endTurnCanvas.height = 14 * GameVariables.pixelSize;
        this.endTurnCanvas.style.transform = "translate(" +
            (GameVariables.gameWidth - this.endTurnCanvas.width - (5 * GameVariables.pixelSize)) + "px," +
            (GameVariables.gameHeight - this.endTurnCanvas.height - (5 * GameVariables.pixelSize)) + "px)";
        generateLargeBox(this.endTurnCanvas, 0, 0, 56, 13, GameVariables.pixelSize, "black", "white");
        drawPixelTextInCanvasContext(convertTextToPixelArt("END TURN"), this.endTurnCtx, GameVariables.pixelSize, 28, 7);
    }

    calculateCardsArea() {
        GameVariables.cardContainerW = Math.round((GameVariables.gameWidth / 2) / GameVariables.pixelSize);
        // this.test.width = GameVariables.cardContainerW * GameVariables.pixelSize;
        // this.test.height = GameVariables.cardContainerH * GameVariables.pixelSize;

        GameVariables.cardContainerX = ((GameVariables.gameWidth / 2) - ((GameVariables.cardContainerW / 2) * GameVariables.pixelSize));
        GameVariables.cardContainerY = (GameVariables.gameHeight - (GameVariables.cardContainerH * GameVariables.pixelSize));

        // this.test.style.transform = "translate(" + GameVariables.cardContainerX + "px, " + GameVariables.cardContainerY + "px)";
    }

    endTurn() {
        this.finishPlayerTurn();
        this.startEnemyTurn();
        this.finishEnemyTurn();
        this.startPlayerTurn();
    }

    startPlayerTurn() {
        GameVariables.maxPlayCards = GameVariables.defaultMaxPlayCards;
        GameVariables.cardsPlayed = 0;
        GameVariables.isPlayerTurn = true;
        this.populatePlayerCards();
    }

    finishPlayerTurn() {
        this.disposePlayerCards();
    }

    startEnemyTurn() {
        GameVariables.maxPlayCards = GameVariables.defaultMaxPlayCards;
        GameVariables.cardsPlayed = 0;
        GameVariables.isPlayerTurn = false;
        this.populatePlayerCards();
        let randomNumber = Math.floor(Math.random() * GameVariables.cards.length);
        GameVariables.cards[randomNumber].useCard();
    }

    finishEnemyTurn() {
        this.disposePlayerCards();
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
        this.energyCanvasCtx.clearRect(0, 0, this.energyCanvas.width, this.energyCanvas.height);
        this.populateEnergyCanvas();
    }
}