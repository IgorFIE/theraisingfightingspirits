import { GameVariables } from "../game-variables";
const { drawSprite } = require("../utilities/draw-utilities");
const { atkIcon, defIcon, minionIcon } = require("../objects/icons");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("../utilities/text");

export class Card {
    constructor(gameDiv, cardX, cardY) {
        this.isUsed = false;
        this.cardCanvas = document.createElement("canvas");
        this.cardCanvas.width = GameVariables.cardWidth * GameVariables.pixelSize;
        this.cardCanvas.height = GameVariables.cardHeight * GameVariables.pixelSize;
        this.cardCanvas.classList.add("card");
        this.updateCardPosition(cardX, cardY);
        this.dragElement(this);
        gameDiv.appendChild(this.cardCanvas);

        this.cardCtx = this.cardCanvas.getContext("2d");

        // this.cardType = Math.floor(Math.random() * Object.keys(CardTypes).length);
        this.cardType = Math.floor(Math.random() * 3);
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
        this.isUsed = true;
        GameVariables.cardsPlayed++;
        switch (this.cardType) {
            case CardTypes.Atk:
                if (GameVariables.isPlayerTurn) {
                    GameVariables.reaper.reaperStatus.takeDamage(2);
                } else {
                    GameVariables.soulsInUse.soulStatus.takeDamage(2);
                }
                break;
            default:
                if (GameVariables.isPlayerTurn) {
                    GameVariables.soulsInUse.soulStatus.addShield(2);
                } else {
                    GameVariables.reaper.reaperStatus.addShield(2);
                }
                break;
        }
        this.dispose();
        this.refreshPlayerCards();
    }

    refreshPlayerCards() {
        const cardSpace = (GameVariables.cardContainerW * GameVariables.pixelSize) / (GameVariables.drawCardNumber - GameVariables.cardsPlayed);
        const cardX = (cardSpace / 2) - (this.cardCanvas.width / 2);
        const cardY = GameVariables.cardContainerY + (2 * GameVariables.pixelSize);
        let placementCounter = 0;
        for (let i = 0; i < GameVariables.cards.length; i++) {
            if (!GameVariables.cards[i].isUsed) {
                GameVariables.cards[i].updateCardPosition(GameVariables.cardContainerX + (placementCounter * cardSpace + cardX), cardY);
                placementCounter++;
            }
        }
    }

    updateCardPosition(cardX, cardY) {
        this.cardX = cardX;
        this.cardY = cardY;
        this.cardCanvas.style.transform = "translate(" + cardX + "px," + cardY + "px)";
    }

    dragElement(card) {
        let clientX = 0, clientY = 0;
        let newX = 0, newY = 0, startX = 0, startY = 0;
        let lastTopValue = 0;
        card.cardCanvas.onmousedown = dragMouseDown;
        card.cardCanvas.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }
            card.cardCanvas.classList.add("on-drag");

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            newX = startX - clientX;
            newY = startY - clientY;
            startX = clientX;
            startY = clientY;
            lastTopValue = (card.cardCanvas.offsetTop - newY);
            card.cardCanvas.style.top = lastTopValue + "px";
            card.cardCanvas.style.left = (card.cardCanvas.offsetLeft - newX) + "px";
        }

        function closeDragElement(e) {
            document.onmouseup = null;
            document.onmousemove = null;

            document.ontouchend = null;
            document.ontouchmove = null;

            if (GameVariables.cardsPlayed < GameVariables.maxPlayCards &&
                card.cardY - Math.abs(lastTopValue) < card.cardY - card.cardCanvas.height) {
                card.useCard();
            } else {
                card.cardCanvas.style.top = null;
                card.cardCanvas.style.left = null;
            }
            card.cardCanvas.classList.remove("on-drag");
        }
    }

    dispose() {
        if (this.cardCanvas.parentNode !== null) {
            this.cardCanvas.parentElement.removeChild(this.cardCanvas);
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