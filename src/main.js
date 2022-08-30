const { GameVars } = require("./game-variables");
const { Game } = require("./game");
const { grimReaper } = require("./objects/reaper");
const { soul } = require("./objects/soul");
const { drawSprite, createElem } = require("./utilities/draw-utilities");
const { Sound } = require("./utilities/sound");
const { convertTextToPixelArt, drawPixelTextInCanvas } = require("./utilities/text");
const { genLargeBox } = require("./utilities/box-generator");
const { speaker, audio } = require("./objects/icons");
const { Background } = require("./objects/background");

let mainDiv;

let highScore = parseInt(localStorage.getItem(GameVars.storeId)) || 0;
let totalRunScore = 0;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuCtx;
let mainMenuBtn;
let gameTutorDiv;
let gameDiv;
let gameOverCanv;
let gameOverCtx;
let winScreenCanv;
let winScreenCtx;
let soundBtnCanv;
let soundBtnCtx;

let wasScheduledToShowWinScreen;
let game;

function init() {
    mainDiv = document.getElementById("main");

    GameVars.resetGameVars();

    addMonetizationEvents();
    createGameContainer();
    createMainMenu();
    createGameTutorialMenu();
    createGameOverMenu();
    createWinScreenMenu();
    createMuteBtn();

    // createFpsElement();

    window.requestAnimationFrame(() => gameLoop());
}

function createMainMenu() {
    mainMenuDiv = createElem(mainDiv, "div", null, null, GameVars.gameW, GameVars.gameH);
    let background = new Background(mainMenuDiv);
    background.generateMainMenu();
    mainMenuCanv = createElem(mainMenuDiv, "canvas", "main-menu", null, GameVars.gameW, GameVars.gameH);

    mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, 140 * GameVars.pixelSize, 60 * GameVars.pixelSize, null, (e) => startGame());
    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + "px " +
        ((GameVars.gameH / 2) - (mainMenuBtn.height / 2) + (40 * GameVars.pixelSize)) + "px";

    genLargeBox(mainMenuBtn, 0, 0, 139, 59, GameVars.pixelSize, "black", "rgba(255, 255, 255, 0.9)");
    drawPixelTextInCanvas(convertTextToPixelArt("click/touch"), mainMenuBtn, GameVars.pixelSize, 70, 22, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("to start game"), mainMenuBtn, GameVars.pixelSize, 70, 38, "black", 2);


    mainMenuCtx = mainMenuCanv.getContext("2d");
    drawMainMenu();
}

function drawMainMenu() {
    mainMenuCtx.clearRect(0, 0, mainMenuCanv.width, mainMenuCanv.height);
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

    if (highScore > 0) {
        genLargeBox(mainMenuCanv, -20, Math.round((GameVars.gameHgAsPixels / 14) - 25), GameVars.gameWdAsPixels + 40, 110, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
        drawPixelTextInCanvas(convertTextToPixelArt("best score " + highScore), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 72, "black", 2);
    } else {
        genLargeBox(mainMenuCanv, -20, Math.round((GameVars.gameHgAsPixels / 14) - 25), GameVars.gameWdAsPixels + 40, 85, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
    }

    drawPixelTextInCanvas(convertTextToPixelArt("the raising"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, GameVars.gameHgAsPixels / 14, "black", 6);
    drawPixelTextInCanvas(convertTextToPixelArt("fighting spirits"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 14) + 36, "black", 6);

    genLargeBox(mainMenuCanv, -20, Math.round(((GameVars.gameHgAsPixels / 24) * 23) - 15), GameVars.gameWdAsPixels + 40, 30, GameVars.pixelSize, "black", "rgba(255,255,255,0.9)");
    drawPixelTextInCanvas(convertTextToPixelArt("js13kgames 2022 game by igor estevao"), mainMenuCanv, GameVars.pixelSize, halfScreenWidthAsPixels, (GameVars.gameHgAsPixels / 24) * 23, "black", 2);
}

function createGameTutorialMenu() {
    gameTutorDiv = createElem(mainDiv, "div", "game-tutorial", ["hidden", "ontop"]);

    let gameTutorialCanvas = createElem(gameTutorDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, "rgb(101,107,114,0.6)");

    genLargeBox(gameTutorialCanvas, -20, Math.round((GameVars.gameHgAsPixels / 14) - 25), GameVars.gameWdAsPixels + 40, 50, GameVars.pixelSize, "black", "rgba(255,255,255,0.8)");
    drawPixelTextInCanvas(convertTextToPixelArt("tutorial"), gameTutorialCanvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels / 14, "black", 6);

    drawPixelTextInCanvas(convertTextToPixelArt("click/touch to select a soul"), gameTutorialCanvas, GameVars.pixelSize, (GameVars.gameWdAsPixels / 4) + 10, (GameVars.gameHgAsPixels / 2) - 72);
    drawPixelTextInCanvas(convertTextToPixelArt("or use the buttons at the bottom right"), gameTutorialCanvas, GameVars.pixelSize, (GameVars.gameWdAsPixels / 4) + 10, (GameVars.gameHgAsPixels / 2) - 62);

    drawPixelTextInCanvas(convertTextToPixelArt("reaper next turn action"), gameTutorialCanvas, GameVars.pixelSize, ((GameVars.gameWdAsPixels / 4) * 3) + 10, (GameVars.gameHgAsPixels / 2) - 82);

    drawPixelTextInCanvas(convertTextToPixelArt("cards you can play"), gameTutorialCanvas, GameVars.pixelSize, 34, GameVars.gameHgAsPixels - 120);
    drawPixelTextInCanvas(convertTextToPixelArt("per turn"), gameTutorialCanvas, GameVars.pixelSize, 34, GameVars.gameHgAsPixels - 110);

    drawPixelTextInCanvas(convertTextToPixelArt("drag cards off the hand area to play them"), gameTutorialCanvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 100);

    let gameTutorialSkipCanvas = createElem(gameTutorDiv, "canvas", null, null, 140 * GameVars.pixelSize, 40 * GameVars.pixelSize, null,
        (e) => {
            GameVars.sound.clickSound();
            gameTutorDiv.classList.add("hidden")
        });
    gameTutorialSkipCanvas.style.translate = ((GameVars.gameW - gameTutorialSkipCanvas.width) / 2) + "px " + (GameVars.gameH - gameTutorialSkipCanvas.height - (120 * GameVars.pixelSize)) + "px";

    genLargeBox(gameTutorialSkipCanvas, 0, 0, 139, 39, GameVars.pixelSize, "black", "rgba(255,255,255,0.8)");
    drawPixelTextInCanvas(convertTextToPixelArt("skip tutorial"), gameTutorialSkipCanvas, GameVars.pixelSize, 70, 20, "black", 2);
}

function createGameContainer() {
    gameDiv = createElem(mainDiv, "div", "game");
}

function createGameOverMenu() {
    gameOverCanv = createElem(mainDiv, "canvas", "gameoverscreen", ["hidden", "ontop"], GameVars.gameW, GameVars.gameH, "rgba(255,75,75,0.9)",
        () => {
            gameOverCanv.classList.add("hidden");
            mainMenuDiv.classList.remove("hidden");
            GameVars.sound.clickSound();
            gameDiv.innerHTML = "";
            game = null;
            updateHighScore();
        });
    gameOverCtx = gameOverCanv.getContext("2d");
}

function drawGameOver() {
    gameOverCtx.clearRect(0, 0, gameOverCanv.width, gameOverCanv.height);
    genLargeBox(gameOverCanv, -20, (GameVars.gameHgAsPixels / 2) - 85, GameVars.gameWdAsPixels + 40, 180, GameVars.pixelSize, "black", "white");
    drawPixelTextInCanvas(convertTextToPixelArt("crossed over"), gameOverCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 50, "black", 6);
    drawScoreCalc(gameOverCanv);
}

function drawScoreCalc(canvas) {
    let turnScore = GameVars.reaper.isDead ? (GameVars.turnCount - 1000) * ((1000 - 1) / (1 - 1000)) + 1 : 0;
    turnScore = turnScore < 0 ? 0 : turnScore;
    totalRunScore = GameVars.score + turnScore;
    drawPixelTextInCanvas(convertTextToPixelArt("score"), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 10, "black", 4);
    drawPixelTextInCanvas(convertTextToPixelArt("reaper life taken - " + GameVars.score), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 15, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("turns taken to kill reaper - " + turnScore), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 30, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("(less turns give more points)"), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 45, "black", 2);
    drawPixelTextInCanvas(convertTextToPixelArt("total - " + totalRunScore), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 60, "black", 2);
    if (totalRunScore > highScore) {
        drawPixelTextInCanvas(convertTextToPixelArt("new record!"), canvas, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) + 80, "black", 2);
    }
}

function createWinScreenMenu() {
    winScreenCanv = createElem(mainDiv, "canvas", "winscreen", ["hidden", "ontop"], GameVars.gameW, GameVars.gameH, "rgba(150,150,255,0.9)",
        () => {
            winScreenCanv.classList.add("hidden");
            mainMenuDiv.classList.remove("hidden");
            GameVars.sound.clickSound();
            gameDiv.innerHTML = "";
            game = null;
            updateHighScore();
        });
    winScreenCtx = winScreenCanv.getContext("2d");
}

function drawWinScreen() {
    winScreenCtx.clearRect(0, 0, winScreenCanv.width, winScreenCanv.height);
    genLargeBox(winScreenCanv, -20, (GameVars.gameHgAsPixels / 2) - 85, GameVars.gameWdAsPixels + 40, 180, GameVars.pixelSize, "black", "white");
    drawPixelTextInCanvas(convertTextToPixelArt("liberated"), winScreenCanv, GameVars.pixelSize, GameVars.gameWdAsPixels / 2, (GameVars.gameHgAsPixels / 2) - 50, "black", 6);
    drawScoreCalc(winScreenCanv);
}

function createMuteBtn() {
    soundBtnCanv = createElem(mainDiv, "canvas", "soundbtn", ["ontop"], 27 * GameVars.pixelSize, 24 * GameVars.pixelSize, null,
        () => {
            if (GameVars.sound) {
                GameVars.sound.muteMusic();
            } else {
                GameVars.sound = new Sound();
                GameVars.sound.initSound();
            }
        });
    soundBtnCtx = soundBtnCanv.getContext("2d");
    drawSoundBtn();
}

function startGame() {
    initAudio();
    GameVars.sound.clickSound();
    mainMenuDiv.classList.add("hidden");
    gameTutorDiv.classList.remove("hidden");
    wasScheduledToShowWinScreen = false;
    game = new Game(gameDiv);
}

function initAudio() {
    if (!GameVars.sound) {
        GameVars.sound = new Sound();
        GameVars.sound.initSound();
    }
}

// let fps;
// function createFpsElement() {
//     fps = document.createElement("div");
//     fps.style.fontSize = "50px";
//     fps.style.position = "absolute";
//     mainDiv.appendChild(fps);
// }

// let frameCount = 0;
let fpsInterval = 1000 / 30; // lock to 30fps
let then = Date.now();
// let startTime = then;
function gameLoop() {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        // var sinceStart = Date.now() - startTime;
        // var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
        // fps.innerHTML = currentFps + " fps";
        if (game) {
            game.update();
            if (GameVars.soulsInGame <= 0) {
                drawGameOver();
                gameOverCanv.classList.remove("hidden");
            }
            if (GameVars.reaper.isDead && !wasScheduledToShowWinScreen) {
                wasScheduledToShowWinScreen = true;
                drawWinScreen();
                setTimeout(() => winScreenCanv.classList.remove("hidden"), 250);
            }
        }
        drawSoundBtn();
        if (GameVars.sound) {
            GameVars.sound.playMusic();
        }
    }

    window.requestAnimationFrame(() => gameLoop());
}

function drawSoundBtn() {
    soundBtnCtx.clearRect(0, 0, soundBtnCanv.width, soundBtnCanv.height);
    genLargeBox(soundBtnCanv, 0, 0, 26, 23, GameVars.pixelSize, "black", GameVars.sound && GameVars.sound.isSoundOn ? "rgba(255,255,255,0.8)" : "rgba(150,150,150,0.8)");
    drawSprite(soundBtnCanv, speaker, GameVars.pixelSize * 2, 2, 3);
    if (GameVars.sound && GameVars.sound.isSoundOn) {
        drawSprite(soundBtnCanv, audio, GameVars.pixelSize * 2, 7, 1);
    }
}

function updateHighScore() {
    if (highScore < totalRunScore) {
        highScore = totalRunScore;
        localStorage.setItem(GameVars.storeId, highScore);
        drawMainMenu();
    }
}

function addMonetizationEvents() {
    if (document.monetization) {
        document.monetization.addEventListener('monetizationstart', () => {
            GameVars.sound.buffSound();
            GameVars.isMonetActive = true;
        });
        document.monetization.addEventListener('monetizationstop', () => {
            GameVars.sound.playOverSound();
            GameVars.isMonetActive = false
        });
    }
}

init();