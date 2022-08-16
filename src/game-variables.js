const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

const pixelSize = 3;

const reaperWidth = 200;
const reaperHeight = 300;

const soulWidth = 200;
const soulHeight = 200;

const cardWidth = 53;
const cardHeight = 85;

const statusBarHeight = 18;

let reaper = null;
let soul = null;
let playerCards = [];

const defaultMaxPlayCards = 1
let maxPlayCards = defaultMaxPlayCards;
let cardsPlayed = 0;

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

    reaper,
    soul,

    playerCards,

    defaultMaxPlayCards,
    maxPlayCards,
    cardsPlayed,

    statusBarHeight,

    isPlayerTurn
}