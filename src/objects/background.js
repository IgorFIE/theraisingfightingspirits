import { GameVars } from "../game-variables";
import { randomNumbOnRange } from "../utilities/general-utilities";
const { createElem } = require("../utilities/draw-utilities");

export class Background {
    constructor(gameDiv) {
        this.bckElem = createElem(gameDiv, "canvas", "gameBackground", null, GameVars.gameW, GameVars.gameH, "#686B7A");
        this.bckCtx = this.bckElem.getContext("2d");
    }

    generate(reaper) {
        const reaperBox = reaper.reaperContainer.getBoundingClientRect();
        let reaperX = Math.round(reaperBox.left / GameVars.pixelSize);
        let reaperY = Math.round(reaperBox.top / GameVars.pixelSize);

        this.generateDeepTerrain(reaperY);
        this.generateMiddleTerrain(reaperY);
        this.generateWaterTerrain(reaperY);
        this.generateCloseTerrain(reaperX, reaperY);
    }

    generateDeepTerrain(reaperY) {
        let deepTerrainCoords = { x: GameVars.gameWdAsPixels, y: reaperY + 10 };
        let treeX = 0;
        this.bckCtx.fillStyle = "#333940";
        for (let i = 0; i < 130; i++) {
            deepTerrainCoords = this.generateRandomTerrain(deepTerrainCoords, 10, 25, -5, 5, 30, 200);
            treeX = this.generateRandomTrees(treeX, 30, 90, 30);
        }
    }

    generateMiddleTerrain(reaperY) {
        let deepTerrainCoords = { x: GameVars.gameWdAsPixels, y: reaperY + 60 };
        let treeX = -10;
        this.bckCtx.fillStyle = "#19191F";
        for (let i = 0; i < 130; i++) {
            deepTerrainCoords = this.generateRandomTerrain(deepTerrainCoords, 10, 25, -4, 4, 30, 200);
            treeX = this.generateRandomTrees(treeX, 60, 180, 60);
        }
    }

    generateWaterTerrain(reaperY) {
        let waterTerrainCoords = { x: GameVars.gameWdAsPixels, y: reaperY + 125 };
        this.bckCtx.fillStyle = "#E0E8F0";
        for (let i = 0; i < 130; i++) {
            waterTerrainCoords = this.generateRandomTerrain(waterTerrainCoords, 30, 30, -1, 1, 100, 800);
        }
    }

    generateCloseTerrain(reaperX, reaperY) {
        let closerTerrainCoords = { x: reaperX + 20, y: reaperY + 112 };
        let graveX = reaperX + 40;
        this.bckCtx.fillStyle = "#0F0E11";
        this.bckCtx.fillRect(closerTerrainCoords.x * GameVars.pixelSize, closerTerrainCoords.y * GameVars.pixelSize, 400 * GameVars.pixelSize, 800 * GameVars.pixelSize);
        for (let i = 0; i < 160; i++) {
            graveX = this.generateInLineGraves(graveX, reaperY, 16, 25, 65, 90);
            closerTerrainCoords = this.generateRandomTerrain(closerTerrainCoords, 4, 8, -6, 12, 30, 800);
        }
    }

    generateRandomTerrain(terrainCoords, spaceMin, spaceMax, heightMin, heightMax, size, fillHeight = 100) {
        if (terrainCoords.x > -spaceMax * 2 && terrainCoords.y < GameVars.gameHgAsPixels) {
            let newX = terrainCoords.x - randomNumbOnRange(spaceMin, spaceMax);
            let newY = terrainCoords.y + randomNumbOnRange(heightMin, heightMax);
            let yDiff = Math.abs(newY) - Math.abs(terrainCoords.y);
            let forceBreak = 0;
            while (terrainCoords.y !== newY) {
                this.bckCtx.fillRect(terrainCoords.x * GameVars.pixelSize, terrainCoords.y * GameVars.pixelSize, size * GameVars.pixelSize, fillHeight * GameVars.pixelSize);
                if (terrainCoords.x !== newX) terrainCoords.x -= randomNumbOnRange(1, spaceMin);
                if (terrainCoords.y !== newY) yDiff > 0 ? terrainCoords.y++ : terrainCoords.y--;
                forceBreak++;
                if (forceBreak > 500) break;
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
                nextX * GameVars.pixelSize,
                nextY * GameVars.pixelSize,
                treeSize * GameVars.pixelSize,
                treeSize * GameVars.pixelSize
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
            this.generateGrave(graveX, y + randomNumbOnRange(heightMin, heightMax));
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