import { GameVariables } from "../game-variables";
const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Card } = require("../objects/card");
const { Background } = require("../objects/background");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");

export class Game {
    constructor() {
        let gameMainDiv = document.getElementById("main");

        this.gameDiv = document.createElement("div");
        this.gameDiv.id = "game";

        gameMainDiv.appendChild(this.gameDiv);

        this.background = new Background(this.gameDiv);
        GameVariables.reaper = new Reaper(this.gameDiv);
        GameVariables.soul = new Soul(this.gameDiv);

        this.cardContainer = document.createElement("div");
        this.cardContainer.id = "card-container";
        this.gameDiv.appendChild(this.cardContainer);

        GameVariables.cards = [];

        this.endTurnBtn = document.createElement("button");
        this.endTurnBtn.textContent = "End Turn";
        this.endTurnBtn.addEventListener('click', (e) => this.endTurn());
        this.gameDiv.appendChild(this.endTurnBtn);

        // this.testSubject = document.createElement("canvas");
        // this.testSubject.width = 200;
        // this.testSubject.height = 200;
        // this.testSubject.style.backgroundColor = "white";
        // this.gameDiv.appendChild(this.testSubject);

        // generateLargeBox(this.testSubject,0,0,200,200,GameVariables.pixelSize,"black");
        // generateSmallBox(this.testSubject,40,40,160,160,GameVariables.pixelSize,"black");

        this.startPlayerTurn();
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
        GameVariables.cards.push(new Card(this.cardContainer));
        GameVariables.cards.push(new Card(this.cardContainer));
    }

    disposePlayerCards() {
        GameVariables.cards.forEach(card => card.dispose());
        GameVariables.cards = [];
    }

    dispose() {
        GameVariables.reaper.dispose();
        GameVariables.reaper = null;

        GameVariables.soul.dispose();
        GameVariables.soul = null;
    }
}