import { GameVariables } from "../game-variables";
const { Soul } = require("../objects/soul");
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
        this.cardCanvas.style.animation = "cardturn 500ms linear";
        this.updateCardPosition(cardX, cardY);
        this.dragElement(this);
        gameDiv.appendChild(this.cardCanvas);

        this.cardCtx = this.cardCanvas.getContext("2d");

        this.cardType = Math.floor(Math.random() * Object.keys(CardTypes).length);
        this.drawCard();
    }

    drawCard(bckColor = "White") {
        generateLargeBox(this.cardCanvas, 2, 2, GameVariables.cardWidth - 3, GameVariables.cardHeight - 3, GameVariables.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanvas, 7, 14, 40, 31, GameVariables.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanvas, 7, 48, 40, 31, GameVariables.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanvas, 13, 42, 28, 9, GameVariables.pixelSize, "black", bckColor);

        switch (this.cardType) {
            case CardTypes.ATK:
                drawSprite(this.cardCtx, atkIcon, GameVariables.pixelSize);
                drawSprite(this.cardCtx, shockAtkIcon, GameVariables.pixelSize, 10, 19);
                this.generateCardText("SHOCK", "ATK", "2 DAMAGE");
                break;

            case CardTypes.MINION:
                drawSprite(this.cardCtx, minionIcon, GameVariables.pixelSize);
                drawSprite(this.cardCtx, spiritMinionIcon, GameVariables.pixelSize, 21, 16);
                this.generateCardText("SPIRIT", "MINION", "+1 SOUL");
                break;

            default:
                drawSprite(this.cardCtx, defIcon, GameVariables.pixelSize);
                drawSprite(this.cardCtx, hardenDefIcon, GameVariables.pixelSize, 20, 20);
                this.generateCardText("HARDEN", "DEF", "2 SHIELD");
                break;
        }
    }

    generateCardText(cardName, cardType, cardDescription) {
        drawPixelTextInCanvasContext(convertTextToPixelArt(cardName), this.cardCtx, GameVariables.pixelSize, 32, 9);
        drawPixelTextInCanvasContext(convertTextToPixelArt(cardType), this.cardCtx, GameVariables.pixelSize, 27, 47);
        drawPixelTextInCanvasContext(convertTextToPixelArt(cardDescription), this.cardCtx, GameVariables.pixelSize, 28, 64);
    }

    useCard() {
        switch (this.cardType) {
            case CardTypes.ATK:
                GameVariables.soulInUse.soulCanvas.style.animation = "soulatk 900ms ease-in-out";
                setTimeout(() => GameVariables.reaper.takeDamage(2), 250)
                this.afterUseCardsSettings();
                break;
            case CardTypes.MINION:
                this.generateNewMinion();
                break;
            default:
                GameVariables.soulInUse.soulStatus.addShield(2);
                this.afterUseCardsSettings();
                break;
        }
    }

    afterUseCardsSettings() {
        this.isUsed = true;
        GameVariables.cardsPlayed++;
        this.dispose();
        this.refreshPlayerCards();
    }

    generateNewMinion() {
        if (GameVariables.soulsInGame != GameVariables.souls.length * GameVariables.souls[0].length) {
            let y = Math.floor(Math.random() * GameVariables.souls.length);
            let x = Math.floor(Math.random() * GameVariables.souls[0].length);
            while (GameVariables.souls[y][x] !== null) {
                y = Math.floor(Math.random() * GameVariables.souls.length);
                x = Math.floor(Math.random() * GameVariables.souls[0].length);
            }
            GameVariables.souls[y][x] = new Soul(GameVariables.soulsContainers[y][x], x, y);
            GameVariables.soulsInGame++;
            this.afterUseCardsSettings();
        } else {
            this.cardCanvas.style.top = null;
            this.cardCanvas.style.left = null;
        }
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
        this.cardCanvas.style.translate = + cardX + "px " + cardY + "px " + this.cardCanvas.width + "px";
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

    draw() {
        if (this.cardType === CardTypes.MINION) {
            if (GameVariables.soulsInGame === GameVariables.souls.length * GameVariables.souls[0].length) {
                this.drawCard("Gray");
            } else {
                this.drawCard();
            }
        }
        if (GameVariables.maxPlayCards - GameVariables.cardsPlayed <= 0) {
            this.drawCard("Gray");
        }
    }

    dispose() {
        if (this.cardCanvas.parentNode !== null) {
            this.cardCanvas.parentElement.removeChild(this.cardCanvas);
        }
    }
}

const CardTypes = {
    ATK: 0,
    DEF: 1,
    MINION: 2
}

const nu = null;
const bl = "#000000";

const shockAtkIcon = [
    [nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, bl, nu, bl, bl, bl, bl, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, bl, bl, nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, bl, nu, nu, bl, bl, bl, nu, nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, bl, nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, bl, bl, bl, nu, nu, bl, nu, bl, nu, nu, bl, bl, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu],
    [nu, bl, nu, nu, bl, nu, nu, bl, bl, bl, bl, bl, nu, bl, bl, bl, bl, bl, nu, bl, nu, bl, bl, bl, bl, nu, nu, nu, bl, nu, nu, nu, nu, nu],
    [bl, bl, nu, bl, nu, nu, bl, bl, bl, bl, nu, bl, nu, nu, bl, bl, bl, bl, nu, bl, nu, bl, bl, bl, bl, nu, nu, nu, bl, nu, nu, nu, nu, nu],
    [nu, bl, nu, bl, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, bl, bl, bl, nu, nu, bl, nu, bl, nu, bl, bl, nu, nu, bl, bl, bl, nu, nu, nu, nu],
    [nu, bl, bl, nu, nu, nu, bl, bl, nu, bl, bl, nu, nu, nu, bl, bl, bl, nu, nu, bl, bl, bl, nu, bl, bl, nu, nu, bl, bl, bl, nu, nu, nu, nu],
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
    [bl, bl, nu, nu, bl, nu, nu, bl, bl, nu, nu, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, bl, nu, bl, bl, nu, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl],
    [bl, bl, nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, nu, nu, bl, nu],
    [nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, nu],
    [nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu, bl, bl, nu, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu]
];

const spiritMinionIcon = [
    [nu, nu, nu, nu, nu, nu, nu, bl, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, bl, bl, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, nu, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, nu, nu, bl, nu, nu, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, bl, bl, bl, bl, nu, nu, nu, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu],
    [nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu],
    [nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu],
    [bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl],
    [bl, bl, bl, bl, bl, nu, nu, nu, nu, bl, bl, bl, bl, bl],
    [bl, bl, bl, bl, nu, nu, nu, nu, nu, nu, bl, bl, bl, bl],
    [bl, bl, bl, bl, nu, nu, nu, nu, nu, nu, bl, bl, bl, bl],
    [nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, bl, bl, bl, nu],
    [nu, bl, bl, bl, nu, nu, nu, nu, nu, nu, bl, bl, bl, nu],
    [nu, nu, bl, bl, bl, nu, nu, nu, nu, bl, bl, bl, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu, nu, nu],
    [nu, nu, nu, nu, nu, bl, bl, bl, bl, nu, nu, nu, nu, nu]
];