import { GameVariables } from "../game-variables";
import { UI } from "../objects/ui";
const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Background } = require("../objects/background");

export class Game {
    constructor() {
        let mainDiv = document.getElementById("main");

        this.gameDiv = document.createElement("div");
        this.gameDiv.id = "game";

        mainDiv.appendChild(this.gameDiv);

        this.background = new Background(this.gameDiv);
        GameVariables.reaper = new Reaper(this.gameDiv);
        GameVariables.soul = new Soul(this.gameDiv);

        this.ui = new UI(this.gameDiv);

        this.ui.startPlayerTurn();

        window.requestAnimationFrame(() => this.gameLoop());
    }

    gameLoop() {
        if (this.ui.currentEnergy != GameVariables.maxPlayCards - GameVariables.cardsPlayed) {
            this.ui.draw();
        }
        window.requestAnimationFrame(() => this.gameLoop());
    }

    dispose() {
        GameVariables.reaper.dispose();
        GameVariables.reaper = null;

        GameVariables.soul.dispose();
        GameVariables.soul = null;
    }
}