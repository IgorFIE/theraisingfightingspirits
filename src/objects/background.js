import { GameVars } from "../game-variables";
import { randomNumbOnRange } from "../utilities/general-utilities";
const { createElem } = require("../utilities/draw-utilities");

export class Background {
    constructor(gameDiv) {
        this.bckElem = createElem(gameDiv, "canvas", null, ["gameback"], GameVars.gameW, GameVars.gameH, "#686b7a");
        this.bckCtx = this.bckElem.getContext("2d");
    }

    generateMainMenu() {
        let terrainCoords = { x: GameVars.gameWdAsPixels, y: (GameVars.gameHgAsPixels / 2) - 80 };
        let treeX = 0;
        this.bckCtx.fillStyle = "#333940";
        for (let i = 0; i < 200; i++) {
            terrainCoords = this.generateRandomTerrain(terrainCoords, 10, 25, -5, 5, 30, 200);
            treeX = this.generateRandomTrees(treeX, 30, 90, 30);
        }

        terrainCoords = { x: GameVars.gameWdAsPixels, y: (GameVars.gameHgAsPixels / 2) - 30 };
        treeX = -10;
        this.bckCtx.fillStyle = "#19191f";
        for (let i = 0; i < 250; i++) {
            terrainCoords = this.generateRandomTerrain(terrainCoords, 10, 25, -4, 4, 30, 200);
            treeX = this.generateRandomTrees(treeX, 60, 180, 60);
        }

        terrainCoords = { x: GameVars.gameWdAsPixels, y: (GameVars.gameHgAsPixels / 2) + 35 };
        this.bckCtx.fillStyle = "#e0e8f0";
        for (let i = 0; i < 300; i++) {
            terrainCoords = this.generateRandomTerrain(terrainCoords, 30, 30, -1, 1, 100, 800);
        }

        terrainCoords = { x: GameVars.gameWdAsPixels, y: GameVars.gameHgAsPixels / 2 };
        let graveX = -10;
        this.bckCtx.fillStyle = "#0f0e11";
        this.bckCtx.fillRect(0, (GameVars.gameH / 2) + (150 * GameVars.pixelSize), GameVars.gameW, GameVars.gameH);
        for (let i = 0; i < 160; i++) {
            graveX = this.generateInLineGraves(graveX, GameVars.gameHgAsPixels / 2, 16, 25, 65, 90);
        }
    }

    generateGameTerrain(reaper) {
        const reaperBox = reaper.reaperCont.getBoundingClientRect();
        let reaperCoords = { x: Math.round(reaperBox.left / GameVars.pixelSize), y: Math.round(reaperBox.top / GameVars.pixelSize) };

        this.generateDeepTerrain(reaperCoords);
        this.generateMiddleTerrain(reaperCoords);
        this.generateWaterTerrain(reaperCoords);
        this.generateCloseTerrain(reaperCoords);
    }

    generateDeepTerrain(reaperCoords) {
        let deepTerrainCoords = { x: GameVars.gameWdAsPixels, y: reaperCoords.y + 10 };
        let treeX = 0;
        this.bckCtx.fillStyle = "#333940";
        for (let i = 0; i < 200; i++) {
            deepTerrainCoords = this.generateRandomTerrain(deepTerrainCoords, 10, 25, -5, 5, 30, 200);
            treeX = this.generateRandomTrees(treeX, 30, 90, 30);
        }
    }

    generateMiddleTerrain(reaperCoords) {
        let deepTerrainCoords = { x: GameVars.gameWdAsPixels, y: reaperCoords.y + 60 };
        let treeX = -10;
        this.bckCtx.fillStyle = "#19191f";
        for (let i = 0; i < 250; i++) {
            deepTerrainCoords = this.generateRandomTerrain(deepTerrainCoords, 10, 25, -4, 4, 30, 200);
            treeX = this.generateRandomTrees(treeX, 60, 180, 60);
        }
    }

    generateWaterTerrain(reaperCoords) {
        let waterTerrainCoords = { x: GameVars.gameWdAsPixels, y: reaperCoords.y + 125 };
        this.bckCtx.fillStyle = "#e0e8f0";
        for (let i = 0; i < 300; i++) {
            waterTerrainCoords = this.generateRandomTerrain(waterTerrainCoords, 30, 30, -1, 1, 100, 800);
        }
    }

    generateCloseTerrain(reaperCoords) {
        let closerTerrainCoords = { x: reaperCoords.x + 20, y: reaperCoords.y + 112 };
        let graveX = reaperCoords.x + 40;
        this.bckCtx.fillStyle = "#0f0e11";
        this.bckCtx.fillRect(closerTerrainCoords.x * GameVars.pixelSize, closerTerrainCoords.y * GameVars.pixelSize, 1000 * GameVars.pixelSize, 800 * GameVars.pixelSize);
        for (let i = 0; i < 160; i++) {
            graveX = this.generateInLineGraves(graveX, reaperCoords.y, 16, 25, 65, 90);
            closerTerrainCoords = this.generateRandomTerrain(closerTerrainCoords, 4, 8, -6, 12, 30, 800);
        }
    }

    generateRandomTerrain(terrainCoords, spaceMin, spaceMax, heightMin, heightMax, size, fillHeight = 100) {
        if (terrainCoords.x > -spaceMax * 2 && terrainCoords.y < GameVars.gameHgAsPixels) {
            let newX = terrainCoords.x - randomNumbOnRange(spaceMin, spaceMax);
            let newY = terrainCoords.y + randomNumbOnRange(heightMin, heightMax);
            let yDiff = Math.abs(newY) - Math.abs(terrainCoords.y);
            while (terrainCoords.y !== newY) {
                this.bckCtx.fillRect(Math.round(terrainCoords.x * GameVars.pixelSize), Math.round(terrainCoords.y * GameVars.pixelSize), Math.round(size * GameVars.pixelSize), Math.round(fillHeight * GameVars.pixelSize));
                if (terrainCoords.x !== newX) terrainCoords.x -= randomNumbOnRange(1, spaceMin);
                if (terrainCoords.y !== newY) yDiff > 0 ? terrainCoords.y++ : terrainCoords.y--;
            }
        }
        return terrainCoords;
    }

    generateRandomTrees(treeX, spaceMin, spaceMax, treeSize) {
        if (treeX < GameVars.gameWdAsPixels + treeSize) {
            this.generateTree(treeX, GameVars.gameHgAsPixels / 2, -1, 1, -16, 0, 120, treeSize);
            treeX += randomNumbOnRange(spaceMin, spaceMax);
        }
        return treeX;
    }

    generateTree(x, y, spaceMin, spaceMax, heightMin, heightMax, amount, originalTreeSize) {
        let nextX = x;
        let nextY = y;
        let treeSize = originalTreeSize;
        for (let i = 0; i < amount; i++) {
            this.bckCtx.fillRect(
                Math.round(nextX * GameVars.pixelSize),
                Math.round(nextY * GameVars.pixelSize),
                Math.round(treeSize * GameVars.pixelSize),
                Math.round(treeSize * GameVars.pixelSize)
            );
            nextX += randomNumbOnRange(spaceMin, spaceMax);
            nextY += randomNumbOnRange(heightMin, heightMax);
            if (treeSize > (originalTreeSize / 3) * 2) treeSize--;
            if (nextY < -treeSize) {
                break;
            }
        }
    }

    generateInLineGraves(graveX, y, spaceMin, spaceMax, heightMin, heightMax) {
        if (graveX < GameVars.gameWdAsPixels + spaceMax) {
            this.generateGrave(graveX, Math.round(y + randomNumbOnRange(heightMin, heightMax)));
            graveX += randomNumbOnRange(spaceMin, spaceMax);
        }
        return graveX;
    }

    generateGrave(x, y) {
        this.bckCtx.fillRect((x + 4) * GameVars.pixelSize, (y - 25) * GameVars.pixelSize, 20 * GameVars.pixelSize, 3 * GameVars.pixelSize);
        this.bckCtx.fillRect((x + 13) * GameVars.pixelSize, (y - 35) * GameVars.pixelSize, 3 * GameVars.pixelSize, 25 * GameVars.pixelSize);

        this.bckCtx.fillRect((x + 7) * GameVars.pixelSize, (y - 10) * GameVars.pixelSize, 16 * GameVars.pixelSize, 2 * GameVars.pixelSize);
        this.bckCtx.fillRect((x + 5) * GameVars.pixelSize, (y - 9) * GameVars.pixelSize, 20 * GameVars.pixelSize, 2 * GameVars.pixelSize);
        this.bckCtx.fillRect((x + 3) * GameVars.pixelSize, (y - 7) * GameVars.pixelSize, 24 * GameVars.pixelSize, 2 * GameVars.pixelSize);
        this.bckCtx.fillRect((x + 2) * GameVars.pixelSize, (y - 5) * GameVars.pixelSize, 26 * GameVars.pixelSize, 100 * GameVars.pixelSize);
        this.bckCtx.fillRect((x + 1) * GameVars.pixelSize, (y + 1) * GameVars.pixelSize, 28 * GameVars.pixelSize, 30 * GameVars.pixelSize);
    }
}