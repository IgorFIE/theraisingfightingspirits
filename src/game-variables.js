const storeId = 'igorfie-the-raising-fighting-spirits';

const gameW = window.innerWidth;
const gameH = window.innerHeight;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

let sound;

let score;
let turnCount;
let isPlayerTurn;
let isEventRunning;

let reaper;
let reaperNextEventTurn;

let soulNextEventTurn;
let soulsConts;
let souls;
let soulsInGame;

let nextSoul;
let prevSoul;
let soulInUse;

let soulLife;
let soulLifeBuff;

let cards;

let cardContX;
let cardContY;
let cardContW;
const cardContH = 89;

let maxPlayCards;
let cardsPlayed;
let drawCardNumb;

let cardDmg;
let cardDmgBuff;
let cardShield;
let cardShieldBuff;

let isMonetActive;
let redraw;

const resetGameVars = () => {
    GameVars.cardContX = 0;
    GameVars.cardContY = 0;
    GameVars.cardContW = 0;

    GameVars.reaper = null;

    GameVars.soulsConts = [];
    GameVars.souls = [];
    GameVars.soulsInGame = 0;

    GameVars.cards = [];

    GameVars.prevSoul = null;
    GameVars.soulInUse = null;
    GameVars.nextSoul = null;

    GameVars.maxPlayCards = 2;
    GameVars.cardsPlayed = 0;
    GameVars.drawCardNumb = 5;

    GameVars.isPlayerTurn = true;
    GameVars.score = 0;
    GameVars.turnCount = 0;
    GameVars.reaperNextEventTurn = 6;
    GameVars.soulNextEventTurn = 3;

    GameVars.soulLife = 10;
    GameVars.soulLifeBuff = 5;

    GameVars.cardDmg = 2;
    GameVars.cardDmgBuff = 4;
    GameVars.cardShield = 2;
    GameVars.cardShieldBuff = 4;

    GameVars.isEventRunning = false;

    let hgPixelSize = Math.round((gameH - 270) * ((3 - 1) / (1100 - 270)) + 1);
    let wdPixelSize = Math.round((gameW - 480) * ((3 - 1) / (1000 - 480)) + 1);

    GameVars.pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    GameVars.gameWdAsPixels = GameVars.gameW / GameVars.pixelSize;
    GameVars.gameHgAsPixels = GameVars.gameH / GameVars.pixelSize;

    GameVars.cardContW = Math.round((GameVars.gameW / 2) / GameVars.pixelSize);
    GameVars.cardContX = ((GameVars.gameW / 2) - ((GameVars.cardContW / 2) * GameVars.pixelSize));
    GameVars.cardContY = (GameVars.gameH - (GameVars.cardContH * GameVars.pixelSize));
}

export const GameVars = {
    storeId,

    gameW,
    gameH,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    cardContX,
    cardContY,
    cardContW,
    cardContH,

    sound,

    reaper,

    cards,

    soulsConts,
    souls,
    soulsInGame,

    prevSoul,
    soulInUse,
    nextSoul,

    maxPlayCards,
    cardsPlayed,
    drawCardNumb,

    isPlayerTurn,
    turnCount,
    score,
    reaperNextEventTurn,
    soulNextEventTurn,

    soulLife,
    soulLifeBuff,

    cardDmg,
    cardDmgBuff,
    cardShield,
    cardShieldBuff,

    isEventRunning,

    isMonetActive,
    redraw,

    resetGameVars
}