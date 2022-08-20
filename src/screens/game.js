import { GameVariables } from "../game-variables";
import { UI } from "../objects/ui";
const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Background } = require("../objects/background");

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;

        this.background = new Background(gameDiv);
        GameVariables.resetGameVariables();
        GameVariables.calculatePixelSize();

        this.generateSoulsContainers();
        GameVariables.souls[1][1] = new Soul(GameVariables.soulsContainers[1][1], 1, 1);
        GameVariables.souls[1][1].selectSoul();
        GameVariables.soulsInGame++;

        GameVariables.reaper = new Reaper(gameDiv);
        this.background.generate(GameVariables.reaper);

        this.ui = new UI(gameDiv);
        this.ui.startPlayerTurn();

        GameVariables.isGameOver = false;
    }

    generateSoulsContainers() {
        let fakeSoulContainer = document.createElement("div");
        fakeSoulContainer.classList.add("soul-container");
        let fakeSoul = new Soul(fakeSoulContainer, 0, 0);
        this.gameDiv.appendChild(fakeSoulContainer);

        const containerW = fakeSoulContainer.clientWidth;
        const containerH = fakeSoulContainer.clientHeight;
        const containerX = (GameVariables.gameWidth / 4) - ((containerW / 2) * 3);
        const containerY = (GameVariables.gameHeight / 2) - (containerH * 2);

        fakeSoul.dispose();
        fakeSoulContainer.parentElement.removeChild(fakeSoulContainer);

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

    update() {
        this.cleanDeadSouls();
        if (!GameVariables.isPlayerTurn) {
            GameVariables.reaper.reaperTurn();
            this.ui.startPlayerTurn();
        }
        this.retrievePreviousSoul();
        this.retrieveNextSoul();
    }

    retrieveNextSoul() {
        if (GameVariables.soulsInGame > 1) {
            let soul = GameVariables.soulInUse;
            let soulExists = false;
            for (let y = soul.arrayPosY; y < GameVariables.souls.length; y++) {
                for (let x = (y == soul.arrayPosY ? soul.arrayPosX : 0); x < GameVariables.souls[0].length; x++) {
                    if (y === soul.arrayPosY && x === soul.arrayPosX) {
                        continue;
                    }
                    if (GameVariables.souls[y][x] !== null) {
                        GameVariables.nextSoul = GameVariables.souls[y][x];
                        soulExists = true;
                        break;
                    }
                }
                if (soulExists) break;
            }
            if (!soulExists) {
                GameVariables.nextSoul = null;
            }
        }
    }

    retrievePreviousSoul() {
        if (GameVariables.soulsInGame > 1) {
            let soul = GameVariables.soulInUse;
            let soulExists = false;
            for (let y = soul.arrayPosY; y >= 0; y--) {
                for (let x = (y == soul.arrayPosY ? soul.arrayPosX : GameVariables.souls[0].length - 1); x >= 0; x--) {
                    if (y === soul.arrayPosY && x === soul.arrayPosX) {
                        continue;
                    }
                    if (GameVariables.souls[y][x] !== null) {
                        GameVariables.previousSoul = GameVariables.souls[y][x];
                        soulExists = true;
                        break;
                    }
                }
                if (soulExists) break;
            }
            if (!soulExists) {
                GameVariables.previousSoul = null;
            }
        }
    }

    cleanDeadSouls() {
        let currentSoul = null;
        for (let y = 0; y < GameVariables.souls.length; y++) {
            for (let x = 0; x < GameVariables.souls[0].length; x++) {
                currentSoul = GameVariables.souls[y][x];
                if (currentSoul && currentSoul.soulStatus.lifeValue <= 0) {
                    if (currentSoul === GameVariables.soulInUse) {
                        GameVariables.soulInUse = null;
                    }
                    currentSoul.dispose();
                    GameVariables.souls[y][x] = null;
                    GameVariables.soulsInGame--;
                }
            }
        }

        if (GameVariables.soulInUse === null && GameVariables.soulsInGame > 0) {
            let y = Math.floor(Math.random() * GameVariables.souls.length);
            let x = Math.floor(Math.random() * GameVariables.souls[0].length);
            while (GameVariables.souls[y][x] === null) {
                y = Math.floor(Math.random() * GameVariables.souls.length);
                x = Math.floor(Math.random() * GameVariables.souls[0].length);
            }
            GameVariables.soulInUse = GameVariables.souls[y][x];
            GameVariables.soulInUse.selectSoul();
        }

        if (GameVariables.soulsInGame <= 0) {
            GameVariables.isGameOver = true;
        }
    }

    draw() {
        this.ui.draw();
        GameVariables.cards.forEach(card => card.draw());
    }

    dispose() {
        if (this.gameDiv.parentNode !== null) {
            this.gameDiv.innerHTML = "";
        }
    }
}