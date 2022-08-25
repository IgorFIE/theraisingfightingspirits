const gameW = window.innerWidth;
const gameH = window.innerHeight;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

const calcPixelSize = () => {
    let hgPixelSize = Math.round((gameH - 270) * ((3 - 1) / (1100 - 270)) + 1);
    let wdPixelSize = Math.round((gameW - 480) * ((3 - 1) / (1000 - 480)) + 1);

    GameVars.pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    GameVars.gameWdAsPixels = GameVars.gameW / GameVars.pixelSize;
    GameVars.gameHgAsPixels = GameVars.gameH / GameVars.pixelSize;
};

const cardW = 53;
const cardH = 85;

let cardContX;
let cardContY;
let cardContW;
let cardContH;

let sound;

let reaper;

let soulsConts;
let souls;
let soulsInGame;

let prevSoul;
let soulInUse;
let nextSoul;

let maxPlayCards;
let cardsPlayed;
let drawCardNumb;

let isPlayerTurn;
let turnCount;
let reaperNextEventTurn;
let soulNextEventTurn;

let soulLife;
let soulLifeBuff;

let cardDmg;
let cardDmgBuff;
let cardShield;
let cardShieldBuff;

let isEventRunning;

const resetGameVars = () => {
    GameVars.cardContX = 0;
    GameVars.cardContY = 0;
    GameVars.cardContW = 0;
    GameVars.cardContH = cardH + 4;

    GameVars.reaper = null;

    GameVars.soulsConts = [];
    GameVars.souls = [];
    GameVars.soulsInGame = 0;

    GameVars.prevSoul = null;
    GameVars.soulInUse = null;
    GameVars.nextSoul = null;

    GameVars.maxPlayCards = 2;
    GameVars.cardsPlayed = 0;
    GameVars.drawCardNumb = 5;

    GameVars.isPlayerTurn = true;
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
}

export const GameVars = {
    gameW,
    gameH,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,
    calcPixelSize,

    cardW,
    cardH,

    cardContX,
    cardContY,
    cardContW,
    cardContH,

    sound,

    reaper,

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
    reaperNextEventTurn,
    soulNextEventTurn,

    soulLife,
    soulLifeBuff,

    cardDmg,
    cardDmgBuff,
    cardShield,
    cardShieldBuff,

    isEventRunning,

    resetGameVars
}