const { GameVars } = require("./game-variables");
const { Game } = require("./screens/game");
const { grimReaper } = require("./objects/reaper");
const { soul } = require("./objects/soul");
const { drawSprite, createElem } = require("./utilities/draw-utilities");
const { Sound } = require("./utilities/sound");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("./utilities/text");
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
    GameVars.sound = new Sound();

    GameVars.resetGameVars();
    GameVars.calcPixelSize();

    createGameContainer();
    createGameTutorialMenu();
    createGameOverMenu();
    createWinScreenMenu();
    createMainMenu();
}

function createMainMenu() {
    mainMenuCanv = createElem(mainDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH, "gray", (e) => startGame());

    let scale = GameVars.pixelSize * 5;
    drawSprite(mainMenuCanv, grimReaper, scale,
        Math.round((((GameVars.gameW / scale) / 4) * 3) - (grimReaper[0].length / 2)),
        Math.round((((GameVars.gameH / scale) / 6) * 4) - (grimReaper.length / 2)));

    let soulsmallScale = GameVars.pixelSize * 2;
    drawSprite(mainMenuCanv, soul, soulsmallScale,
        Math.round((((GameVars.gameW / soulsmallScale) / 24) * 8) - (soul[0].length / 2)),
        Math.round((((GameVars.gameH / soulsmallScale) / 24) * 11) - (soul.length / 2)));

    let soulMiddleScale = GameVars.pixelSize * 4;
    drawSprite(mainMenuCanv, soul, soulMiddleScale,
        Math.round((((GameVars.gameW / soulMiddleScale) / 8) * 1) - (soul[0].length / 2)),
        Math.round((((GameVars.gameH / soulMiddleScale) / 8) * 3) - (soul.length / 2)));

    let soulCloseScale = GameVars.pixelSize * 6;
    drawSprite(mainMenuCanv, soul, soulCloseScale,
        Math.round((((GameVars.gameW / soulCloseScale) / 4) * 1) - (soul[0].length / 2)),
        Math.round((((GameVars.gameH / soulCloseScale) / 6) * 4) - (soul.length / 2)));

    let halfScreenWidthAsPixels = GameVars.gameWdAsPixels / 2;
    drawPixelTextInCanvas(convertTextToPixelArt("The Raising"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "#10495E", 6);
    drawPixelTextInCanvas(convertTextToPixelArt("Fighting Spirits"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 36, "#10495E", 6);

    drawPixelTextInCanvas(convertTextToPixelArt("click/touch"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 2) + 10, "#10495E", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("to Start Game"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 2) + 25, "#10495E", 2);

    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2022 game by igor estevao"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 24) * 23, "#10495E", 2);
}

function createGameTutorialMenu() {
    gameTutorDiv = createElem(mainDiv, "div", "game-tutorial", ["hidden"]);

    let gameTutorialCanvas = createElem(gameTutorDiv, "canvas", null, ["on-top"], GameVars.gameW, GameVars.gameH, "rgba(150,150,150,0.8)");
    gameTutorialCanvas.style.transform = "translateZ(999px)";

    drawPixelTextInCanvas(convertTextToPixelArt("Tutorial"), gameTutorialCanvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 14, "black", 6);

    drawPixelTextInCanvas(convertTextToPixelArt("click/touch to select a soul"), gameTutorialCanvas, GameVars.pixelSize, (GameVars.gameWdAsPixels / 4) + 10, (GameVars.gameHgAsPixels / 2) - 72);
    drawPixelTextInCanvas(convertTextToPixelArt("or use the buttons at the bottom right"), gameTutorialCanvas, GameVars.pixelSize, (GameVars.gameWdAsPixels / 4) + 10, (GameVars.gameHgAsPixels / 2) - 62);

    drawPixelTextInCanvas(convertTextToPixelArt("reaper next turn action"), gameTutorialCanvas, GameVars.pixelSize, ((GameVars.gameWdAsPixels / 4) * 3) + 10, (GameVars.gameHgAsPixels / 2) - 112);

    drawPixelTextInCanvas(convertTextToPixelArt("Cards you can play"), gameTutorialCanvas, GameVars.pixelSize, 34, GameVars.gameHgAsPixels - 120);
    drawPixelTextInCanvas(convertTextToPixelArt("per turn"), gameTutorialCanvas, GameVars.pixelSize, 34, GameVars.gameHgAsPixels - 110);

    drawPixelTextInCanvas(convertTextToPixelArt("drag cards off the hand area to play them"), gameTutorialCanvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 100);

    let gameTutorialSkipCanvas = createElem(gameTutorDiv, "canvas", null, ["on-top"], 140 * GameVars.pixelSize, 40 * GameVars.pixelSize, null,
        (e) => {
            GameVars.sound.clickSound();
            gameTutorDiv.classList.add("hidden")
        });
    gameTutorialSkipCanvas.style.transform = "translateZ(999px)";
    gameTutorialSkipCanvas.style.translate = ((GameVars.gameW - gameTutorialSkipCanvas.width) / 2) + "px " + (GameVars.gameH - gameTutorialSkipCanvas.height - (120 * GameVars.pixelSize)) + "px";

    generateLargeBox(gameTutorialSkipCanvas, 0, 0, 139, 39, GameVars.pixelSize, "black", "rgba(150,150,150,0.8)");
    drawPixelTextInCanvas(convertTextToPixelArt("skip tutorial"), gameTutorialSkipCanvas, GameVars.pixelSize, 70, 20, "black", 2);
}

function createGameContainer() {
    gameDiv = createElem(mainDiv, "div", "game");
}

function createGameOverMenu() {
    gameOverCanv = createElem(mainDiv, "canvas", "game-over-screen", ["hidden", "on-top"], GameVars.gameW, GameVars.gameH, "darkred",
        (e) => {
            GameVars.sound.clickSound();
            gameOverCanv.classList.add("hidden");
            mainMenuCanv.classList.remove("hidden");
            game.dispose();
            game = null;
        });
    gameOverCanv.style.transform = "translateZ(999px)";
    drawPixelTextInCanvas(convertTextToPixelArt("CROSSED OVER"), gameOverCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 6, "black", 6);
}

function createWinScreenMenu() {
    winScreenCanv = createElem(mainDiv, "canvas", "win-screen", ["hidden", "on-top"], GameVars.gameW, GameVars.gameH, "lightblue",
        (e) => {
            GameVars.sound.clickSound();
            winScreenCanv.classList.add("hidden");
            mainMenuCanv.classList.remove("hidden");
            game.dispose();
            game = null;
        });
    winScreenCanv.style.transform = "translateZ(999px)";
    drawPixelTextInCanvas(convertTextToPixelArt("win!!!"), winScreenCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 6, "black", 6);
}

function startGame() {
    mainMenuCanv.classList.add("hidden");
    gameTutorDiv.classList.remove("hidden");
    wasScheduledToShowWinScreen = false;
    game = new Game(gameDiv);
    GameVars.sound.initSound();
    GameVars.sound.clickSound();
    window.requestAnimationFrame(() => gameLoop());
}

function gameLoop() {
    if (game) {
        game.update();
        game.draw();
        if (GameVars.isGameOver) {
            gameOverCanv.classList.remove("hidden");
        }
        if (GameVars.reaper.isDead && !wasScheduledToShowWinScreen) {
            wasScheduledToShowWinScreen = true;
            setTimeout(() => winScreenCanv.classList.remove("hidden"), 250);
        }
        GameVars.sound.playMusic();
        window.requestAnimationFrame(() => gameLoop());
    }
}

init();