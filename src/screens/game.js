import { GameVariables } from "../game-variables";
import { UI } from "../objects/ui";
const { Reaper } = require("../objects/reaper");
const { Soul } = require("../objects/soul");
const { Background } = require("../objects/background");

export class Game {
    constructor() {
        GameVariables.calculatePixelSize();
        let mainDiv = document.getElementById("main");

        this.gameDiv = document.createElement("div");
        this.gameDiv.id = "game";

        mainDiv.appendChild(this.gameDiv);

        this.background = new Background(this.gameDiv);

        this.generateSoulsContainers();
        GameVariables.souls[1][1] = new Soul(GameVariables.soulsContainers[1][1], 1, 1);
        GameVariables.souls[1][1].selectSoul();
        GameVariables.soulsInGame++;

        GameVariables.reaper = new Reaper(this.gameDiv);

        this.ui = new UI(this.gameDiv);
        this.ui.startPlayerTurn();

        window.requestAnimationFrame(() => this.gameLoop());
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

    gameLoop() {
        this.update();
        this.draw();
        window.requestAnimationFrame(() => this.gameLoop());
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
        // ir soul a soul e
        // fazer dispose
        // caso esteja selecionada
        // removela de soul in use
        // selecionar uma outra alma random como in use
        // meter a soul a null no souls array
        // diminuir numero de soul in game

        // se o numero de soul in game for igual a 0, GAME OVER
    }

    draw() {
        this.ui.draw();
        GameVariables.cards.forEach(card => card.draw());
    }

    dispose() {
        GameVariables.reaper.dispose();
        GameVariables.reaper = null;

        GameVariables.soul.dispose();
        GameVariables.soul = null;
    }
}