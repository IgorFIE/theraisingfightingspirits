import { GameVars } from "../game-variables";
import { randomNumb } from "../utilities/general-utilities";
const { Soul } = require("../objects/soul");
const { drawSprite, createElemOnElem } = require("../utilities/draw-utilities");
const { atkIcon, defIcon, minionIcon } = require("../objects/icons");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");

export class Card {
    constructor(gameDiv, cardX, cardY) {
        this.isUsed = false;
        this.isDispose = false;

        this.cardCanvas = createElemOnElem(gameDiv, "canvas", null, ["card"], GameVars.cardW * GameVars.pixelSize, GameVars.cardH * GameVars.pixelSize);
        this.cardCanvas.style.animation = "cardturn 500ms linear";

        this.updateCardPosition(cardX, cardY);
        this.dragElement(this);

        this.cardType = randomNumb(Object.keys(CardTypes).length);
        this.drawCard();
    }

    drawCard(bckColor = "White") {
        generateLargeBox(this.cardCanvas, 2, 2, GameVars.cardW - 3, GameVars.cardH - 3, GameVars.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanvas, 7, 14, 40, 31, GameVars.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanvas, 7, 48, 40, 31, GameVars.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanvas, 13, 42, 28, 9, GameVars.pixelSize, "black", bckColor);

        switch (this.cardType) {
            case CardTypes.ATK:
                drawSprite(this.cardCanvas, atkIcon, GameVars.pixelSize);
                drawSprite(this.cardCanvas, shockAtkIcon, GameVars.pixelSize, 10, 19);
                this.generateCardText("SHOCK", "ATK", GameVars.cardDmg + " DAMAGE");
                break;

            case CardTypes.MINION:
                drawSprite(this.cardCanvas, minionIcon, GameVars.pixelSize);
                drawSprite(this.cardCanvas, spiritMinionIcon, GameVars.pixelSize, 21, 16);
                this.generateCardText("SPIRIT", "MINION", "+1 SOUL");
                break;

            default:
                drawSprite(this.cardCanvas, defIcon, GameVars.pixelSize);
                drawSprite(this.cardCanvas, hardenDefIcon, GameVars.pixelSize, 20, 20);
                this.generateCardText("HARDEN", "DEF", GameVars.cardShield + " SHIELD");
                break;
        }
    }

    generateCardText(cardName, cardType, cardDescription) {
        drawPixelTextInCanvas(convertTextToPixelArt(cardName), this.cardCanvas, GameVars.pixelSize, 32, 9);
        drawPixelTextInCanvas(convertTextToPixelArt(cardType), this.cardCanvas, GameVars.pixelSize, 27, 47);
        drawPixelTextInCanvas(convertTextToPixelArt(cardDescription), this.cardCanvas, GameVars.pixelSize, 28, 64);
    }

    useCard() {
        switch (this.cardType) {
            case CardTypes.ATK:
                GameVars.soulInUse.soulCanvas.style.animation = "";
                requestAnimationFrame(() => setTimeout(() => GameVars.soulInUse.soulCanvas.style.animation = "soulatk 900ms ease-in-out", 0));
                setTimeout(() => GameVars.reaper.takeDamage(GameVars.cardDmg), 250)
                this.afterUseCardsSettings();
                break;
            case CardTypes.MINION:
                this.generateNewMinion();
                break;
            default:
                GameVars.soulInUse.soulStatus.addShield(GameVars.cardShield);
                this.afterUseCardsSettings();
                break;
        }
    }

    afterUseCardsSettings() {
        this.isUsed = true;
        GameVars.cardsPlayed++;
        this.dispose();
        this.refreshPlayerCards();
    }

    generateNewMinion() {
        if (GameVars.soulsInGame != GameVars.souls.length * GameVars.souls[0].length) {
            let y = randomNumb(GameVars.souls.length);
            let x = randomNumb(GameVars.souls[0].length);
            while (GameVars.souls[y][x] !== null) {
                y = randomNumb(GameVars.souls.length);
                x = randomNumb(GameVars.souls[0].length);
            }
            GameVars.souls[y][x] = new Soul(GameVars.soulsConts[y][x], x, y);
            GameVars.soulsInGame++;
            this.afterUseCardsSettings();
        } else {
            this.cardCanvas.style.top = null;
            this.cardCanvas.style.left = null;
        }
    }

    refreshPlayerCards() {
        const cardSpace = (GameVars.cardContW * GameVars.pixelSize) / (GameVars.drawCardNumb - GameVars.cardsPlayed);
        const cardX = (cardSpace / 2) - (this.cardCanvas.width / 2);
        const cardY = GameVars.cardContY + (2 * GameVars.pixelSize);
        let placementCounter = 0;
        for (let i = 0; i < GameVars.cards.length; i++) {
            if (!GameVars.cards[i].isUsed) {
                GameVars.cards[i].updateCardPosition(GameVars.cardContX + (placementCounter * cardSpace + cardX), cardY);
                placementCounter++;
            }
        }
    }

    updateCardPosition(cardX, cardY) {
        this.cardX = cardX;
        this.cardY = cardY;
        this.cardCanvas.style.translate = + cardX + "px " + cardY + "px " + this.cardCanvas.width + "px";
    }

    draw() {
        if (this.cardType === CardTypes.MINION) {
            if (GameVars.soulsInGame === GameVars.souls.length * GameVars.souls[0].length) {
                this.drawCard("Gray");
            } else {
                this.drawCard();
            }
        }
        if (GameVars.maxPlayCards - GameVars.cardsPlayed <= 0) {
            this.drawCard("Gray");
        }
    }

    dispose() {
        if (this.cardCanvas.parentNode !== null) {
            if (!this.isDispose) {
                this.isDispose = true;
                this.cardCanvas.style.animation = "";
                requestAnimationFrame(() => setTimeout(() => this.cardCanvas.style.animation = "cardturn 200ms reverse linear", 0));
                setTimeout(() => this.cardCanvas.parentElement.removeChild(this.cardCanvas), 200);
            }
        }
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
            card.cardCanvas.classList.add("on-top");

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

            if (GameVars.cardsPlayed < GameVars.maxPlayCards &&
                card.cardY - Math.abs(lastTopValue) < card.cardY - card.cardCanvas.height) {
                card.useCard();
            } else {
                card.cardCanvas.style.top = null;
                card.cardCanvas.style.left = null;
            }
            card.cardCanvas.classList.remove("on-top");
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