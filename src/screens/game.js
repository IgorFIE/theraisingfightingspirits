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

        this.generateSoulsContainers();
        GameVariables.souls[1][1] = new Soul(GameVariables.soulsContainers[1][1], 1, 1);
        GameVariables.soulsInUse = GameVariables.souls[1][1];

        this.ui = new UI(this.gameDiv);
        this.ui.startPlayerTurn();

        window.requestAnimationFrame(() => this.gameLoop());
    }

    generateSoulsContainers() {
        const containerW = (18 + 33) * GameVariables.pixelSize;
        const containerH = (GameVariables.statusBarHeight + 32) * GameVariables.pixelSize;
        const containerX = (GameVariables.gameWidth / 4) - ((containerW / 2) * 3);
        const containerY = (GameVariables.gameHeight / 2) - (containerH * 2);
        for (let y = 0; y < 3; y++) {
            let newSoulContainerArray = [];
            let newSoulArray = [];
            for (let x = 0; x < 3; x++) {
                let soulContainer = document.createElement("div");
                soulContainer.classList.add("soul-container");
                soulContainer.style.transform = "translate(" +
                    (containerX + (containerW * x)) + "px," +
                    (containerY + (containerH * y)) + "px)";
                this.gameDiv.appendChild(soulContainer);
                newSoulContainerArray.push(soulContainer);
                newSoulArray.push(null);
            }
            GameVariables.soulsContainers.push(newSoulContainerArray);
            GameVariables.souls.push(newSoulArray);
        }
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