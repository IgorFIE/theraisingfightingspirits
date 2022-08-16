import { GameVariables } from "../game-variables";
const { drawSprite } = require("../utilities/draw-utilities");
const { atkIcon, defIcon, minionIcon } = require("../objects/icons");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class Card {
    constructor(gameDiv) {

        this.cardCanvas = document.createElement("canvas");
        this.cardCanvas.width = GameVariables.cardWidth * GameVariables.pixelSize;
        this.cardCanvas.height = GameVariables.cardHeight * GameVariables.pixelSize;
        this.cardCanvas.classList.add("card");
        gameDiv.appendChild(this.cardCanvas);

        this.cardCtx = this.cardCanvas.getContext("2d");

        // this.cardUseButton = document.createElement("button");
        // this.cardUseButton.classList.add("card-use-button");
        // this.cardUseButton.addEventListener('click', (e) => this.useCard(), false);
        // this.cardUseButton.textContent = "USE CARD"
        // this.cardElem.appendChild(this.cardUseButton);

        this.cardType = Math.floor(Math.random() * Object.keys(CardTypes).length);
        this.generateCard();
    }

    generateCard() {
        generateLargeBox(this.cardCanvas, 2, 2, GameVariables.cardWidth - 3, GameVariables.cardHeight - 3, GameVariables.pixelSize, "black", "white");
        generateSmallBox(this.cardCanvas, 7, 14, 40, 31, GameVariables.pixelSize, "black", "white");
        generateSmallBox(this.cardCanvas, 7, 48, 40, 31, GameVariables.pixelSize, "black", "white");
        generateSmallBox(this.cardCanvas, 13, 42, 28, 9, GameVariables.pixelSize, "black", "white");

        switch (this.cardType) {
            case CardTypes.Atk:
                drawSprite(this.cardCtx, atkIcon, GameVariables.pixelSize);
                drawSprite(this.cardCtx, shockAtkIcon, GameVariables.pixelSize, 10, 19);
                this.generateCardText("SHOCK", "ATK", "2 DAMAGE");
                break;

            case CardTypes.Minion:
                drawSprite(this.cardCtx, minionIcon, GameVariables.pixelSize);
                // drawSprite(this.cardCtx, minionIcon, GameVariables.pixelSize, 10, 19);
                this.generateCardText("BOB", "MINION", "+1 SOUL");
                break;

            default:
                drawSprite(this.cardCtx, defIcon, GameVariables.pixelSize);
                drawSprite(this.cardCtx, hardenDefIcon, GameVariables.pixelSize, 20, 20);
                this.generateCardText("HARDEN", "DEF", "2 SHIELD");
                break;
        }
    }

    generateCardText(cardName, cardType, cardDescription) {
        const cardNameText = convertTextToPixelArt(cardName);
        drawPixelTextInCanvasContext(cardNameText, this.cardCtx, GameVariables.pixelSize, 32, 9);

        const cardTypeText = convertTextToPixelArt(cardType);
        drawPixelTextInCanvasContext(cardTypeText, this.cardCtx, GameVariables.pixelSize, 27, 47);

        const cardDescriptionText = convertTextToPixelArt(cardDescription);
        drawPixelTextInCanvasContext(cardDescriptionText, this.cardCtx, GameVariables.pixelSize, 27, 64);
    }

    useCard() {
        if (GameVariables.cardsPlayed < GameVariables.maxPlayCards) {
            GameVariables.cardsPlayed++;
            switch (this.cardType) {
                case CardTypes.Atk:
                    if (GameVariables.isPlayerTurn) {
                        GameVariables.reaper.takeDamage(2);
                    } else {
                        GameVariables.soul.takeDamage(2);
                    }
                    break;
                default:
                    if (GameVariables.isPlayerTurn) {
                        GameVariables.soul.addShield(2);
                    } else {
                        GameVariables.reaper.addShield(2);
                    }
                    break;
            }
            this.dispose();
        }
    }

    dispose() {
        if (this.cardElem.parentNode !== null) {
            this.cardElem.parentElement.removeChild(this.cardElem);
        }
    }
}

const CardTypes = {
    Atk: 0,
    Def: 1,
    Minion: 2,
    Trick: 3
}

const nu = null;
const bl = "#000000"
const wb = "#EDEEF7"

const shockAtkIcon = [
    [nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, bl, nu, bl, bl, bl, bl, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, bl, bl, nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, bl, nu, nu, bl, bl, bl, nu, nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, bl, nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, bl, bl, bl, nu, nu, bl, nu, bl, nu, nu, bl, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu],
    [nu, bl, nu, nu, bl, nu, nu, bl, bl, bl, bl, bl, nu, bl, bl, bl, bl, bl, nu, bl, nu, bl, bl, bl, bl, nu, nu, nu, bl, nu, nu, nu, nu, nu],
    [bl, bl, nu, bl, nu, nu, bl, bl, bl, bl, wb, bl, nu, nu, bl, bl, bl, bl, nu, bl, nu, bl, bl, bl, bl, nu, nu, nu, bl, nu, nu, nu, nu, nu],
    [nu, bl, nu, bl, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, bl, bl, bl, nu, nu, bl, nu, bl, nu, bl, bl, nu, nu, bl, bl, bl, nu, nu, nu, nu],
    [nu, bl, bl, nu, nu, nu, bl, bl, wb, bl, bl, nu, nu, nu, bl, bl, bl, nu, nu, bl, bl, bl, nu, bl, bl, nu, nu, bl, bl, bl, nu, nu, nu, nu],
    [nu, bl, bl, nu, nu, nu, nu, bl, bl, bl, bl, nu, nu, nu, bl, bl, nu, nu, nu, bl, bl, bl, nu, bl, bl, nu, nu, bl, nu, bl, bl, nu, bl, nu],
    [nu, nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, bl, bl, nu, nu, bl, bl, nu, bl, bl, nu, nu, bl, nu, bl, nu],
    [nu, nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, nu, bl, bl, nu, nu, nu, bl, nu, bl, nu, nu, nu, bl, bl, bl, bl],
    [nu, bl, bl, nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, bl, bl, bl, nu, nu, nu, nu, bl, nu, nu],
    [nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, bl, bl, nu, nu, nu, nu, nu, bl, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, bl, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu]
];

const hardenDefIcon = [
    [nu, nu, nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu, bl, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl, nu],
    [nu, bl, bl, bl, nu, nu, nu, nu, bl, bl, bl, bl, nu, nu, nu, bl],
    [bl, bl, bl, nu, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, wb, wb, bl, bl, wb, wb, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, bl, wb, bl, bl, wb, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl, nu],
    [nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, nu],
    [nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, nu, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu]
];