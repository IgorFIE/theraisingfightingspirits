const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

let pixelSize;

let gameWidthAsPixels;
let gameHeightAsPixels;

const calculatePixelSize = () => {
    // 270, 1
    // 720, 3 
    // (value-x1) * ((y2-y1)/(x2-x1)) + y1
    // mark2s = (gameHeight-270) * ((3-1)/(720-270)) + 1
    let heightPixelSize = Math.round((gameHeight - 270) * ((3 - 1) / (1100 - 270)) + 1);
    let widthPixelSize = Math.round((gameWidth - 480) * ((3 - 1) / (1000 - 480)) + 1);

    GameVariables.pixelSize = heightPixelSize < widthPixelSize ? heightPixelSize : widthPixelSize;
    GameVariables.gameWidthAsPixels = GameVariables.gameWidth / GameVariables.pixelSize;
    GameVariables.gameHeightAsPixels = GameVariables.gameHeight / GameVariables.pixelSize;
};

const reaperWidth = 200;
const reaperHeight = 300;

const soulWidth = 200;
const soulHeight = 200;

const cardWidth = 53;
const cardHeight = 85;

let cardContainerX;
let cardContainerY;
let cardContainerW;
let cardContainerH;

const statusBarHeight = 18;

let reaper;

let soulsContainers;
let souls;
let soulsInGame;

let previousSoul;
let soulInUse;
let nextSoul;

let playerCards;

const defaultMaxPlayCards = 2;
let maxPlayCards;
let cardsPlayed;
let drawCardNumber;

let isPlayerTurn;
let turnCounter;
let nextEventTurn;

let isGameOver;

const resetGameVariables = () => {
    GameVariables.cardContainerX = 0;
    GameVariables.cardContainerY = 0;
    GameVariables.cardContainerW = 0;
    GameVariables.cardContainerH = cardHeight + 4;

    GameVariables.reaper = null;

    GameVariables.soulsContainers = [];
    GameVariables.souls = [];
    GameVariables.soulsInGame = 0;

    GameVariables.previousSoul = null;
    GameVariables.soulInUse = null;
    GameVariables.nextSoul = null;

    GameVariables.playerCards = [];

    GameVariables.maxPlayCards = defaultMaxPlayCards;
    GameVariables.cardsPlayed = 0;
    GameVariables.drawCardNumber = 5;

    GameVariables.isPlayerTurn = true;
    GameVariables.turnCounter = 0;
    GameVariables.nextEventTurn = 5;

    GameVariables.isGameOver = false;
}

export const GameVariables = {
    gameWidth,
    gameHeight,

    pixelSize,
    gameWidthAsPixels,
    gameHeightAsPixels,
    calculatePixelSize,

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

    soulsContainers,
    souls,
    soulsInGame,

    previousSoul,
    soulInUse,
    nextSoul,

    playerCards,

    defaultMaxPlayCards,
    maxPlayCards,
    cardsPlayed,
    drawCardNumber,

    statusBarHeight,

    isPlayerTurn,
    turnCounter,
    nextEventTurn,

    isGameOver,

    resetGameVariables
}