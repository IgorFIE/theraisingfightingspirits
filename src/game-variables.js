const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

let pixelSize = 0;

const calculatePixelSize = () => {
    // 270, 1
    // 720, 3 
    // (value-x1) * ((y2-y1)/(x2-x1)) + y1
    // mark2s = (gameHeight-270) * ((3-1)/(720-270)) + 1
    let heightPixelSize = Math.round((gameHeight - 270) * ((3 - 1) / (1100 - 270)) + 1);
    let widthPixelSize = Math.round((gameWidth - 480) * ((3 - 1) / (1000 - 480)) + 1);

    GameVariables.pixelSize = heightPixelSize < widthPixelSize ? heightPixelSize : widthPixelSize;
};

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

let soulsContainers = [];
let souls = [];
let soulsInGame = 0;
let soulInUse = null;

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
    soulInUse,

    playerCards,

    defaultMaxPlayCards,
    maxPlayCards,
    cardsPlayed,
    drawCardNumber,

    statusBarHeight,

    isPlayerTurn
}