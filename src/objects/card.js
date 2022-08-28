import { GameVars } from "../game-variables";
import { randomNumb, retrieveSoulCoords } from "../utilities/general-utilities";
const { Soul } = require("../objects/soul");
const { drawSprite, createElem } = require("../utilities/draw-utilities");
const { atkIcon, defIcon, minionIcon } = require("../objects/icons");
const { generateSmallBox, generateLargeBox } = require("../utilities/box-generator");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("../utilities/text");

export class Card {
    constructor(gameDiv, cardX, cardY) {
        this.isUsed = false;
        this.isDispose = false;

        this.cardCanv = createElem(gameDiv, "canvas", null, ["card"], 53 * GameVars.pixelSize, 85 * GameVars.pixelSize);
        this.cardCanv.style.animation = "cardturn 500ms linear";

        this.updateCardPos(cardX, cardY);
        this.dragElement(this);

        let value = randomNumb(100);
        if (value < 20) {
            this.cardType = 1; // minion 20% prob
        } else if (value < 60) {
            this.cardType = 0; // atk 40% prob
        } else {
            this.cardType = 2; // def 40% prob
        }

        this.drawCard();
    }

    useCard() {
        switch (this.cardType) {
            case 0: // damage card
                GameVars.soulInUse.soulCanv.style.animation = "";
                requestAnimationFrame(() => setTimeout(() => GameVars.soulInUse.soulCanv.style.animation = "soulatk 900ms ease-in-out", 0));
                setTimeout(() => GameVars.reaper.takeDmg(GameVars.cardDmg), 250)
                this.afterUseCardsSettings();
                break;
            case 1: // new soul minion card
                if (GameVars.soulsInGame != GameVars.souls.length * GameVars.souls[0].length) {
                    let soulCoords = retrieveSoulCoords(GameVars.souls, (y, x) => GameVars.souls[y][x] !== null);
                    GameVars.souls[soulCoords.y][soulCoords.x] = new Soul(GameVars.soulsConts[soulCoords.y][soulCoords.x], soulCoords.x, soulCoords.y);
                    GameVars.soulsInGame++;
                    this.afterUseCardsSettings();
                } else {
                    this.cardCanv.style.top = null;
                    this.cardCanv.style.left = null;
                }
                break;
            default: // add shield
                GameVars.soulInUse.soulStats.addShield(GameVars.cardShield);
                this.afterUseCardsSettings();
                break;
        }
    }

    afterUseCardsSettings() {
        this.isUsed = true;
        GameVars.cardsPlayed++;
        this.dispose();
        this.updateCards();
    }

    updateCards() {
        const cardSpace = ((GameVars.cardContW * GameVars.pixelSize) / (GameVars.drawCardNumb - GameVars.cardsPlayed));
        const cardX = (cardSpace / 2) - (this.cardCanv.width / 2);
        const cardY = GameVars.cardContY + (2 * GameVars.pixelSize);
        let placementCounter = 0;
        GameVars.cards.forEach((card) => {
            if (!card.isUsed) {
                card.updateCardPos(GameVars.cardContX + (placementCounter * cardSpace + cardX), cardY);
                placementCounter++;
            }
        });
    }

    updateCardPos(cardX, cardY) {
        this.cardX = cardX;
        this.cardY = cardY;
        this.cardCanv.style.translate = cardX + "px " + cardY + "px " + this.cardCanv.width + "px";
    }

    draw() {
        if (this.cardType === 1) { // minion card
            if (GameVars.maxPlayCards - GameVars.cardsPlayed <= 0 ||
                GameVars.soulsInGame === GameVars.souls.length * GameVars.souls[0].length) {
                this.drawCard("gray");
            } else {
                this.drawCard();
            }
        } else {
            if (GameVars.maxPlayCards - GameVars.cardsPlayed <= 0) {
                this.drawCard("gray");
            } else {
                this.drawCard();
            }
        }
    }

    drawCard(bckColor = "White") {
        generateLargeBox(this.cardCanv, 2, 2, 53 - 3, 85 - 3, GameVars.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanv, 7, 14, 40, 31, GameVars.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanv, 7, 48, 40, 31, GameVars.pixelSize, "black", bckColor);
        generateSmallBox(this.cardCanv, 13, 42, 28, 9, GameVars.pixelSize, "black", bckColor);

        switch (this.cardType) {
            case 0:
                drawSprite(this.cardCanv, atkIcon, GameVars.pixelSize);
                drawSprite(this.cardCanv, shockImg, GameVars.pixelSize, 10, 19);
                this.generateCardText("shock", "atk", GameVars.cardDmg + " damage");
                break;
            case 1:
                drawSprite(this.cardCanv, minionIcon, GameVars.pixelSize);
                drawSprite(this.cardCanv, spiritImg, GameVars.pixelSize, 22, 19);
                this.generateCardText("spirit", "minion", "+1 soul");
                break;
            default:
                drawSprite(this.cardCanv, defIcon, GameVars.pixelSize);
                drawSprite(this.cardCanv, hardenImg, GameVars.pixelSize, 20, 20);
                this.generateCardText("harden", "def", GameVars.cardShield + " shield");
                break;
        }
    }

    generateCardText(cardName, cardType, cardDescription) {
        drawPixelTextInCanvas(convertTextToPixelArt(cardName), this.cardCanv, GameVars.pixelSize, 32, 9);
        drawPixelTextInCanvas(convertTextToPixelArt(cardType), this.cardCanv, GameVars.pixelSize, 27, 47);
        drawPixelTextInCanvas(convertTextToPixelArt(cardDescription), this.cardCanv, GameVars.pixelSize, 28, 64);
    }

    dispose() {
        if (this.cardCanv.parentNode !== null) {
            if (!this.isDispose) {
                this.isDispose = true;
                this.cardCanv.style.animation = "";
                requestAnimationFrame(() => setTimeout(() => this.cardCanv.style.animation = "cardturn 200ms reverse linear", 0));
                setTimeout(() => this.cardCanv.parentElement.removeChild(this.cardCanv), 200);
            }
        }
    }

    dragElement(card) {
        let clientX = 0, clientY = 0;
        let newX = 0, newY = 0, startX = 0, startY = 0;
        let lastTopValue = 0;
        card.cardCanv.onmousedown = dragMouseDown;
        card.cardCanv.ontouchstart = dragMouseDown;

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
            card.cardCanv.classList.add("on-top");

            document.onmouseup = closeDragElem;
            document.onmousemove = elemDrag;

            document.ontouchend = closeDragElem;
            document.ontouchmove = elemDrag;
        }

        function elemDrag(e) {
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
            lastTopValue = (card.cardCanv.offsetTop - newY);
            card.cardCanv.style.top = lastTopValue + "px";
            card.cardCanv.style.left = (card.cardCanv.offsetLeft - newX) + "px";
        }

        function closeDragElem(e) {
            document.onmouseup = null;
            document.onmousemove = null;

            document.ontouchend = null;
            document.ontouchmove = null;

            if (GameVars.cardsPlayed < GameVars.maxPlayCards &&
                card.cardY - Math.abs(lastTopValue) < card.cardY - card.cardCanv.height) {
                card.useCard();
            } else {
                card.cardCanv.style.top = null;
                card.cardCanv.style.left = null;
            }
            card.cardCanv.classList.remove("on-top");
        }
    }
}

const nu = null;
const bl = "#000000";

const shockImg = [
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

const hardenImg = [
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

const spiritImg = [
    [nu, nu, nu, bl, nu, nu, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, nu, nu, nu, nu, nu],
    [nu, nu, nu, nu, nu, bl, bl, nu, nu, nu, nu],
    [nu, nu, nu, nu, bl, bl, bl, nu, nu, nu, nu],
    [nu, nu, bl, bl, bl, bl, bl, nu, nu, nu, nu],
    [nu, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu],
    [nu, bl, bl, bl, bl, nu, nu, nu, nu, nu, nu],
    [nu, bl, bl, bl, bl, bl, nu, nu, nu, nu, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, nu, nu, nu],
    [nu, nu, nu, bl, bl, bl, bl, bl, bl, nu, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, bl, bl, nu],
    [nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu],
    [nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl],
    [bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl],
    [bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl],
    [bl, bl, nu, bl, bl, bl, bl, bl, nu, bl, bl],
    [bl, bl, nu, nu, bl, bl, bl, nu, nu, bl, bl],
    [bl, bl, bl, bl, bl, bl, bl, bl, bl, bl, bl],
    [nu, bl, bl, bl, bl, bl, bl, bl, bl, bl, nu],
    [nu, nu, bl, bl, bl, bl, bl, bl, bl, nu, nu]
];