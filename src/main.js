const { GameVariables } = require("./game-variables");
const { Game } = require("./screens/game");
const { grimReaper } = require("./objects/reaper");
const { maleSoul, femaleSoul } = require("./objects/soul");
const { drawSprite } = require("./utilities/draw-utilities");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("./utilities/text");
const { generateSmallBox } = require("./utilities/box-generator");

// Game names...

// The Raising Fighting Spirits
// In the realm of the reaper
// battle spirits
// soul fighting
// limbo battles
// Reaper's bad soul day

let mainDiv;

let mainMenuCanvas;
let gameTutorialCanvas;
let gameDiv;
let gameOverCanvas;

let game;

function init() {
    mainDiv = document.getElementById("main");

    GameVariables.calculatePixelSize();

    createGameContainer();
    createGameTutorialMenu();
    createGameOverMenu();
    createMainMenu();
}

function createMainMenu() {
    mainMenuCanvas = createElemOnMainDiv("main-menu", "canvas");
    mainMenuCanvas.width = GameVariables.gameWidth;
    mainMenuCanvas.height = GameVariables.gameHeight;
    let mainMenuCtx = mainMenuCanvas.getContext("2d");
    mainMenuCanvas.style.backgroundColor = "gray";

    let scale = GameVariables.pixelSize * 5;
    drawSprite(mainMenuCtx, grimReaper, scale,
        Math.round((((GameVariables.gameWidth / scale) / 4) * 3) - (grimReaper[0].length / 2)),
        Math.round((((GameVariables.gameHeight / scale) / 6) * 4) - (grimReaper.length / 2)));

    let soulsmallScale = GameVariables.pixelSize * 2;
    drawSprite(mainMenuCtx, maleSoul, soulsmallScale,
        Math.round((((GameVariables.gameWidth / soulsmallScale) / 24) * 8) - (maleSoul[0].length / 2)),
        Math.round((((GameVariables.gameHeight / soulsmallScale) / 24) * 11) - (maleSoul.length / 2)));

    let soulMiddleScale = GameVariables.pixelSize * 4;
    drawSprite(mainMenuCtx, maleSoul, soulMiddleScale,
        Math.round((((GameVariables.gameWidth / soulMiddleScale) / 8) * 1) - (maleSoul[0].length / 2)),
        Math.round((((GameVariables.gameHeight / soulMiddleScale) / 8) * 3) - (maleSoul.length / 2)));

    let soulCloseScale = GameVariables.pixelSize * 6;
    drawSprite(mainMenuCtx, maleSoul, soulCloseScale,
        Math.round((((GameVariables.gameWidth / soulCloseScale) / 4) * 1) - (maleSoul[0].length / 2)),
        Math.round((((GameVariables.gameHeight / soulCloseScale) / 6) * 4) - (maleSoul.length / 2)));

    let halfScreenWidthAsPixels = GameVariables.gameWidthAsPixels / 2;
    drawPixelTextInCanvasContext(convertTextToPixelArt("The Raising"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, GameVariables.gameHeightAsPixels / 14, "#10495E", 6);
    drawPixelTextInCanvasContext(convertTextToPixelArt("Fighting Spirits"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, (GameVariables.gameHeightAsPixels / 14) + 36, "#10495E", 6);

    drawPixelTextInCanvasContext(convertTextToPixelArt("click/touch"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, (GameVariables.gameHeightAsPixels / 2) + 10, "#10495E", 2);
    drawPixelTextInCanvasContext(convertTextToPixelArt("to Start Game"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, (GameVariables.gameHeightAsPixels / 2) + 25, "#10495E", 2);

    drawPixelTextInCanvasContext(convertTextToPixelArt("js13kgames 2022"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, ((GameVariables.gameHeightAsPixels / 24) * 23) - 15, "#10495E", 2);
    drawPixelTextInCanvasContext(convertTextToPixelArt("game by igor estevao"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, (GameVariables.gameHeightAsPixels / 24) * 23, "#10495E", 2);

    mainMenuCanvas.addEventListener('click', (e) => startGame());
}

function createGameTutorialMenu() {
    gameTutorialCanvas = createElemOnMainDiv("game-tutorial", "canvas");
    gameTutorialCanvas.classList.add("hidden");
    gameTutorialCanvas.style.backgroundColor = "gray";
    gameTutorialCanvas.style.opacity = "0.8";
    gameTutorialCanvas.style.zIndex = 999;
    gameTutorialCanvas.width = GameVariables.gameWidth;
    gameTutorialCanvas.height = GameVariables.gameHeight;
    let gameTutorialCtx = gameTutorialCanvas.getContext("2d");

    drawPixelTextInCanvasContext(convertTextToPixelArt("Tutorial"), gameTutorialCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels / 14, "black", 6);

    drawPixelTextInCanvasContext(convertTextToPixelArt("click/touch to select a soul"), gameTutorialCtx, GameVariables.pixelSize, (GameVariables.gameWidthAsPixels / 4) + 10, (GameVariables.gameHeightAsPixels / 2) - 72);
    drawPixelTextInCanvasContext(convertTextToPixelArt("or use the buttons at the bottom right"), gameTutorialCtx, GameVariables.pixelSize, (GameVariables.gameWidthAsPixels / 4) + 10, (GameVariables.gameHeightAsPixels / 2) - 62);

    drawPixelTextInCanvasContext(convertTextToPixelArt("reaper next turn action"), gameTutorialCtx, GameVariables.pixelSize, ((GameVariables.gameWidthAsPixels / 4) * 3) + 10, (GameVariables.gameHeightAsPixels / 2) - 112);

    drawPixelTextInCanvasContext(convertTextToPixelArt("Cards you can play"), gameTutorialCtx, GameVariables.pixelSize, 34, GameVariables.gameHeightAsPixels - 120);
    drawPixelTextInCanvasContext(convertTextToPixelArt("per turn"), gameTutorialCtx, GameVariables.pixelSize, 34, GameVariables.gameHeightAsPixels - 110);

    drawPixelTextInCanvasContext(convertTextToPixelArt("drag cards off the hand area to play them"), gameTutorialCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels - 100);

    gameTutorialCanvas.addEventListener('click', (e) => gameTutorialCanvas.classList.add("hidden"));
}

function createGameContainer() {
    gameDiv = createElemOnMainDiv("game", "div");
}

function createGameOverMenu() {
    gameOverCanvas = createElemOnMainDiv("game-over", "canvas");
    gameOverCanvas.classList.add("hidden");
    gameOverCanvas.style.backgroundColor = "darkred";
    gameOverCanvas.style.opacity = "0.9";
    gameOverCanvas.style.zIndex = 999;
    gameOverCanvas.width = GameVariables.gameWidth;
    gameOverCanvas.height = GameVariables.gameHeight;
    let gameOverCtx = gameOverCanvas.getContext("2d");
    drawPixelTextInCanvasContext(convertTextToPixelArt("CROSSED OVER"), gameOverCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, (GameVariables.gameHeightAsPixels / 2) - 6, "black", 6);

    gameOverCanvas.addEventListener('click', (e) => {
        gameOverCanvas.classList.add("hidden");
        mainMenuCanvas.classList.remove("hidden");
        game.dispose();
        game = null;
    });
}

function createElemOnMainDiv(id, elemType) {
    let elem = document.createElement(elemType);
    elem.id = id;
    mainDiv.appendChild(elem);
    return elem;
}

function startGame() {
    mainMenuCanvas.classList.add("hidden");
    gameTutorialCanvas.classList.remove("hidden");
    game = new Game(gameDiv);
    window.requestAnimationFrame(() => gameLoop());
}

function gameLoop() {
    if (game) {
        game.update();
        game.draw();
        if (GameVariables.isGameOver) {
            gameOverCanvas.classList.remove("hidden");
        }
    }
    window.requestAnimationFrame(() => gameLoop());
}

init();