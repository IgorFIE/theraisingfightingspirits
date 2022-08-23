const { GameVars } = require("./game-variables");
const { Game } = require("./screens/game");
const { grimReaper } = require("./objects/reaper");
const { maleSoul, femaleSoul } = require("./objects/soul");
const { drawSprite, createElemOnElem } = require("./utilities/draw-utilities");
const { SoundInstance } = require("./utilities/sound");
const { convertTextToPixelArt, drawPixelTextInCanvasCtx } = require("./utilities/text");
const { generateLargeBox } = require("./utilities/box-generator");

let mainDiv;

let mainMenuCanv;
let gameTutorDiv;
let gameDiv;
let gameOverCanv;
let winScreenCanv;

let wasScheduledToShowWinScreen;
let game;

function init() {
    mainDiv = document.getElementById("main");

    GameVars.resetGameVars();
    GameVars.calcPixelSize();

    createGameContainer();
    createGameTutorialMenu();
    createGameOverMenu();
    createWinScreenMenu();
    createMainMenu();
}

function createMainMenu() {
    mainMenuCanv = createElemOnElem(mainDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH, "gray", (e) => startGame());
    let mainMenuCtx = mainMenuCanv.getContext("2d");

    let scale = GameVars.pixelSize * 5;
    drawSprite(mainMenuCtx, grimReaper, scale,
        Math.round((((GameVars.gameW / scale) / 4) * 3) - (grimReaper[0].length / 2)),
        Math.round((((GameVars.gameH / scale) / 6) * 4) - (grimReaper.length / 2)));

    let soulsmallScale = GameVars.pixelSize * 2;
    drawSprite(mainMenuCtx, maleSoul, soulsmallScale,
        Math.round((((GameVars.gameW / soulsmallScale) / 24) * 8) - (maleSoul[0].length / 2)),
        Math.round((((GameVars.gameH / soulsmallScale) / 24) * 11) - (maleSoul.length / 2)));

    let soulMiddleScale = GameVars.pixelSize * 4;
    drawSprite(mainMenuCtx, maleSoul, soulMiddleScale,
        Math.round((((GameVars.gameW / soulMiddleScale) / 8) * 1) - (maleSoul[0].length / 2)),
        Math.round((((GameVars.gameH / soulMiddleScale) / 8) * 3) - (maleSoul.length / 2)));

    let soulCloseScale = GameVars.pixelSize * 6;
    drawSprite(mainMenuCtx, maleSoul, soulCloseScale,
        Math.round((((GameVars.gameW / soulCloseScale) / 4) * 1) - (maleSoul[0].length / 2)),
        Math.round((((GameVars.gameH / soulCloseScale) / 6) * 4) - (maleSoul.length / 2)));

    let halfScreenWidthAsPixels = GameVars.gameWdAsPixels / 2;
    drawPixelTextInCanvasCtx(convertTextToPixelArt("The Raising"), mainMenuCtx, GameVars.pixelSize, halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "#10495E", 6);
    drawPixelTextInCanvasCtx(convertTextToPixelArt("Fighting Spirits"), mainMenuCtx, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 36, "#10495E", 6);

    drawPixelTextInCanvasCtx(convertTextToPixelArt("click/touch"), mainMenuCtx, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 2) + 10, "#10495E", 2);
    drawPixelTextInCanvasCtx(convertTextToPixelArt("to Start Game"), mainMenuCtx, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 2) + 25, "#10495E", 2);

    drawPixelTextInCanvasCtx(convertTextToPixelArt("js13kgames 2022 game by igor estevao"), mainMenuCtx, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 24) * 23, "#10495E", 2);
}

function createGameTutorialMenu() {
    gameTutorDiv = createElemOnElem(mainDiv, "div", "game-tutorial", ["hidden"]);

    let gameTutorialCanvas = createElemOnElem(gameTutorDiv, "canvas", null, ["on-top"], GameVars.gameW, GameVars.gameH, "rgba(150,150,150,0.8)");
    gameTutorialCanvas.style.transform = "translateZ(999px)";
    let gameTutorialCtx = gameTutorialCanvas.getContext("2d");

    drawPixelTextInCanvasCtx(convertTextToPixelArt("Tutorial"), gameTutorialCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 14, "black", 6);

    drawPixelTextInCanvasCtx(convertTextToPixelArt("click/touch to select a soul"), gameTutorialCtx, GameVars.pixelSize, (GameVars.gameWdAsPixels / 4) + 10, (GameVars.gameHgAsPixels / 2) - 72);
    drawPixelTextInCanvasCtx(convertTextToPixelArt("or use the buttons at the bottom right"), gameTutorialCtx, GameVars.pixelSize, (GameVars.gameWdAsPixels / 4) + 10, (GameVars.gameHgAsPixels / 2) - 62);

    drawPixelTextInCanvasCtx(convertTextToPixelArt("reaper next turn action"), gameTutorialCtx, GameVars.pixelSize, ((GameVars.gameWdAsPixels / 4) * 3) + 10, (GameVars.gameHgAsPixels / 2) - 112);

    drawPixelTextInCanvasCtx(convertTextToPixelArt("Cards you can play"), gameTutorialCtx, GameVars.pixelSize, 34, GameVars.gameHgAsPixels - 120);
    drawPixelTextInCanvasCtx(convertTextToPixelArt("per turn"), gameTutorialCtx, GameVars.pixelSize, 34, GameVars.gameHgAsPixels - 110);

    drawPixelTextInCanvasCtx(convertTextToPixelArt("drag cards off the hand area to play them"), gameTutorialCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 100);

    let gameTutorialSkipCanvas = createElemOnElem(gameTutorDiv, "canvas", null, ["on-top"], 140 * GameVars.pixelSize, 40 * GameVars.pixelSize, null,
        (e) => {
            SoundInstance.clickSound();
            gameTutorDiv.classList.add("hidden")
        });
    gameTutorialSkipCanvas.style.transform = "translateZ(999px)";
    gameTutorialSkipCanvas.style.translate = ((GameVars.gameW - gameTutorialSkipCanvas.width) / 2) + "px " + (GameVars.gameH - gameTutorialSkipCanvas.height - (120 * GameVars.pixelSize)) + "px";
    let gameTutorialSkipCtx = gameTutorialSkipCanvas.getContext("2d");

    generateLargeBox(gameTutorialSkipCanvas, 0, 0, 139, 39, GameVars.pixelSize, "black", "rgba(150,150,150,0.8)");
    drawPixelTextInCanvasCtx(convertTextToPixelArt("skip tutorial"), gameTutorialSkipCtx, GameVars.pixelSize, 70, 20, "black", 2);
}

function createGameContainer() {
    gameDiv = createElemOnElem(mainDiv, "div", "game");
}

function createGameOverMenu() {
    gameOverCanv = createElemOnElem(mainDiv, "canvas", "game-over-screen", ["hidden", "on-top"], GameVars.gameW, GameVars.gameH, "darkred",
        (e) => {
            SoundInstance.clickSound();
            gameOverCanv.classList.add("hidden");
            mainMenuCanv.classList.remove("hidden");
            game.dispose();
            game = null;
        });
    gameOverCanv.style.transform = "translateZ(999px)";
    let gameOverCtx = gameOverCanv.getContext("2d");
    drawPixelTextInCanvasCtx(convertTextToPixelArt("CROSSED OVER"), gameOverCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 6, "black", 6);

}

function createWinScreenMenu() {
    winScreenCanv = createElemOnElem(mainDiv, "canvas", "win-screen", ["hidden", "on-top"], GameVars.gameW, GameVars.gameH, "lightblue",
        (e) => {
            SoundInstance.clickSound();
            winScreenCanv.classList.add("hidden");
            mainMenuCanv.classList.remove("hidden");
            game.dispose();
            game = null;
        });
    winScreenCanv.style.transform = "translateZ(999px)";
    let winScreenCtx = winScreenCanv.getContext("2d");

    drawPixelTextInCanvasCtx(convertTextToPixelArt("win!!!"), winScreenCtx, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 6, "black", 6);

}

function startGame() {
    mainMenuCanv.classList.add("hidden");
    gameTutorDiv.classList.remove("hidden");
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
        if (GameVars.isGameOver) {
            gameOverCanv.classList.remove("hidden");
        }
        if (GameVars.reaper.isDeadAndAnimationEnded && !wasScheduledToShowWinScreen) {
            wasScheduledToShowWinScreen = true;
            setTimeout(() => winScreenCanv.classList.remove("hidden"), 250);
        }
        SoundInstance.playMusic();
        window.requestAnimationFrame(() => gameLoop());
    }
}

init();