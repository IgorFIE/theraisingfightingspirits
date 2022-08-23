const { GameVariables } = require("./game-variables");
const { Game } = require("./screens/game");
const { grimReaper } = require("./objects/reaper");
const { maleSoul, femaleSoul } = require("./objects/soul");
const { drawSprite, createElemOnElem } = require("./utilities/draw-utilities");
const { SoundInstance } = require("./utilities/sound");
const { convertTextToPixelArt, drawPixelTextInCanvasContext } = require("./utilities/text");
const { generateLargeBox } = require("./utilities/box-generator");

let mainDiv;

let mainMenuCanvas;
let gameTutorialDiv;
let gameDiv;
let gameOverCanvas;
let winScreenCanvas;

let wasScheduledToShowWinScreen;
let game;

function init() {
    mainDiv = document.getElementById("main");

    GameVariables.resetGameVariables();
    GameVariables.calculatePixelSize();

    createGameContainer();
    createGameTutorialMenu();
    createGameOverMenu();
    createWinScreenMenu();
    createMainMenu();
}

function createMainMenu() {
    mainMenuCanvas = createElemOnElem(mainDiv, "canvas", "main-menu", null, GameVariables.gameWidth, GameVariables.gameHeight, "gray", (e) => startGame());
    let mainMenuCtx = mainMenuCanvas.getContext("2d");

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

    drawPixelTextInCanvasContext(convertTextToPixelArt("js13kgames 2022 game by igor estevao"), mainMenuCtx, GameVariables.pixelSize, halfScreenWidthAsPixels, (GameVariables.gameHeightAsPixels / 24) * 23, "#10495E", 2);
}

function createGameTutorialMenu() {
    gameTutorialDiv = createElemOnElem(mainDiv, "div", "game-tutorial", ["hidden"]);

    let gameTutorialCanvas = createElemOnElem(gameTutorialDiv, "canvas", null, ["on-top"], GameVariables.gameWidth, GameVariables.gameHeight, "rgba(150,150,150,0.8)");
    gameTutorialCanvas.style.transform = "translateZ(999px)";
    let gameTutorialCtx = gameTutorialCanvas.getContext("2d");

    drawPixelTextInCanvasContext(convertTextToPixelArt("Tutorial"), gameTutorialCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels / 14, "black", 6);

    drawPixelTextInCanvasContext(convertTextToPixelArt("click/touch to select a soul"), gameTutorialCtx, GameVariables.pixelSize, (GameVariables.gameWidthAsPixels / 4) + 10, (GameVariables.gameHeightAsPixels / 2) - 72);
    drawPixelTextInCanvasContext(convertTextToPixelArt("or use the buttons at the bottom right"), gameTutorialCtx, GameVariables.pixelSize, (GameVariables.gameWidthAsPixels / 4) + 10, (GameVariables.gameHeightAsPixels / 2) - 62);

    drawPixelTextInCanvasContext(convertTextToPixelArt("reaper next turn action"), gameTutorialCtx, GameVariables.pixelSize, ((GameVariables.gameWidthAsPixels / 4) * 3) + 10, (GameVariables.gameHeightAsPixels / 2) - 112);

    drawPixelTextInCanvasContext(convertTextToPixelArt("Cards you can play"), gameTutorialCtx, GameVariables.pixelSize, 34, GameVariables.gameHeightAsPixels - 120);
    drawPixelTextInCanvasContext(convertTextToPixelArt("per turn"), gameTutorialCtx, GameVariables.pixelSize, 34, GameVariables.gameHeightAsPixels - 110);

    drawPixelTextInCanvasContext(convertTextToPixelArt("drag cards off the hand area to play them"), gameTutorialCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, GameVariables.gameHeightAsPixels - 100);

    let gameTutorialSkipCanvas = createElemOnElem(gameTutorialDiv, "canvas", null, ["on-top"], 140 * GameVariables.pixelSize, 40 * GameVariables.pixelSize, null,
        (e) => {
            SoundInstance.clickSound();
            gameTutorialDiv.classList.add("hidden")
        });
    gameTutorialSkipCanvas.style.transform = "translateZ(999px)";
    gameTutorialSkipCanvas.style.translate = ((GameVariables.gameWidth - gameTutorialSkipCanvas.width) / 2) + "px " + (GameVariables.gameHeight - gameTutorialSkipCanvas.height - (120 * GameVariables.pixelSize)) + "px";
    let gameTutorialSkipCtx = gameTutorialSkipCanvas.getContext("2d");

    generateLargeBox(gameTutorialSkipCanvas, 0, 0, 139, 39, GameVariables.pixelSize, "black", "rgba(150,150,150,0.8)");
    drawPixelTextInCanvasContext(convertTextToPixelArt("skip tutorial"), gameTutorialSkipCtx, GameVariables.pixelSize, 70, 20, "black", 2);
}

function createGameContainer() {
    gameDiv = createElemOnElem(mainDiv, "div", "game");
}

function createGameOverMenu() {
    gameOverCanvas = createElemOnElem(mainDiv, "canvas", "game-over-screen", ["hidden", "on-top"], GameVariables.gameWidth, GameVariables.gameHeight, "darkred",
        (e) => {
            SoundInstance.clickSound();
            gameOverCanvas.classList.add("hidden");
            mainMenuCanvas.classList.remove("hidden");
            game.dispose();
            game = null;
        });
    gameOverCanvas.style.transform = "translateZ(999px)";
    let gameOverCtx = gameOverCanvas.getContext("2d");
    drawPixelTextInCanvasContext(convertTextToPixelArt("CROSSED OVER"), gameOverCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, (GameVariables.gameHeightAsPixels / 2) - 6, "black", 6);

}

function createWinScreenMenu() {
    winScreenCanvas = createElemOnElem(mainDiv, "canvas", "win-screen", ["hidden", "on-top"], GameVariables.gameWidth, GameVariables.gameHeight, "lightblue",
        (e) => {
            SoundInstance.clickSound();
            winScreenCanvas.classList.add("hidden");
            mainMenuCanvas.classList.remove("hidden");
            game.dispose();
            game = null;
        });
    winScreenCanvas.style.transform = "translateZ(999px)";
    let winScreenCtx = winScreenCanvas.getContext("2d");

    drawPixelTextInCanvasContext(convertTextToPixelArt("win!!!"), winScreenCtx, GameVariables.pixelSize, GameVariables.gameWidthAsPixels / 2, (GameVariables.gameHeightAsPixels / 2) - 6, "black", 6);

}

function startGame() {
    mainMenuCanvas.classList.add("hidden");
    gameTutorialDiv.classList.remove("hidden");
    wasScheduledToShowWinScreen = false;
    game = new Game(gameDiv);
    SoundInstance.initSound();
    SoundInstance.clickSound();
    window.requestAnimationFrame(() => gameLoop());
}

function gameLoop() {
    if (game) {
        game.update();
        game.draw();
        if (GameVariables.isGameOver) {
            gameOverCanvas.classList.remove("hidden");
        }
        if (GameVariables.reaper.isDeadAndAnimationEnded && !wasScheduledToShowWinScreen) {
            wasScheduledToShowWinScreen = true;
            setTimeout(() => winScreenCanvas.classList.remove("hidden"), 250);
        }
        SoundInstance.playMusic();
        window.requestAnimationFrame(() => gameLoop());
    }
}

init();