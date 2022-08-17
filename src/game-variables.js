const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const pixelSize = 3;

const reaperWidth = 200;
const reaperHeight = 300;

const soulWidth = 200;
const soulHeight = 200;

const cardWidth = 53;
const cardHeight = 85;

let cardContainerX = 0;
let cardContainerY = 0;
let cardContainerW = 0;
let cardContainerH = cardHeight + 4;

const statusBarHeight = 18;

let reaper = null;
let soul = null;
let playerCards = [];

const defaultMaxPlayCards = 2;
let maxPlayCards = defaultMaxPlayCards;
let cardsPlayed = 0;
let drawCardNumber = 5;

let isPlayerTurn = true;

export const GameVariables = {
    gameWidth,
    gameHeight,

    pixelSize,

    reaperWidth,
    reaperHeight,

    soulWidth,
    soulHeight,

    cardWidth,
    cardHeight,

    cardContainerX,
    cardContainerY,
    cardContainerW,
    cardContainerH,

    reaper,
    soul,

    playerCards,

    defaultMaxPlayCards,
    maxPlayCards,
    cardsPlayed,
    drawCardNumber,

    statusBarHeight,

    isPlayerTurn
}