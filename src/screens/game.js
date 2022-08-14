import { GameVariables } from "../game-variables";
const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Card } = require("../objects/card");
const { Background } = require("../objects/background");

export class Game {
    constructor(){
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
        this.card = new Card(this.cardContainer);
        this.card2 = new Card(this.cardContainer);
    }

    update(){
        console.log("Game Update...");
    }

    draw(){
        console.log("Game Draw...");
    }

    dispose(){
        console.log("Game Dispose...");
        // remove game div by calling #game
        GameVariables.reaper.dispose();
        GameVariables.reaper = null;

        GameVariables.soul.dispose();
        GameVariables.soul = null;
    }
}