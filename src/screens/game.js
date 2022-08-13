const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Background } = require("../objects/background");

export class Game {
    constructor(){
        let gameMainDiv = document.getElementById("main");

        this.gameDiv = document.createElement("div");
        this.gameDiv.id = "game";

        gameMainDiv.appendChild(this.gameDiv);

        this.background = new Background(this.gameDiv);
        this.reaper = new Reaper(this.gameDiv);
        this.soul = new Soul(this.gameDiv);
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
    }
}