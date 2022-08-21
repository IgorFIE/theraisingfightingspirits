import { GameVariables } from "../game-variables";

export class Background {
    constructor(gameDiv) {
        this.bckElem = document.createElement("canvas");
        this.bckCtx = this.bckElem.getContext("2d");
        this.bckElem.width = GameVariables.gameWidth;
        this.bckElem.height = GameVariables.gameHeight;
        this.bckElem.id = "gameBackground";
        this.bckElem.style.backgroundColor = "#686B7A";
        gameDiv.appendChild(this.bckElem);
    }

    generate(reaper) {
        const reaperBox = reaper.reaperContainer.getBoundingClientRect();
        let reaperX = Math.round(reaperBox.left / GameVariables.pixelSize);
        let reaperY = Math.round(reaperBox.top / GameVariables.pixelSize);

        this.generateDeepTerrain(reaperY);
        this.generateMiddleTerrain(reaperY);
        this.generateWaterTerrain(reaperY);
        this.generateCloseTerrain(reaperX, reaperY);
    }

    generateDeepTerrain(reaperY) {
        let deepTerrainCoords = { x: GameVariables.gameWidthAsPixels, y: reaperY + 10 };
        let treeX = 0;
        this.bckCtx.fillStyle = "#333940";
        for (let i = 0; i < 130; i++) {
            deepTerrainCoords = this.generateRandomTerrain(deepTerrainCoords, 10, 25, -5, 5, 30, 200);
            treeX = this.generateRandomTrees(treeX, 30, 90, 30);
        }
    }

    generateMiddleTerrain(reaperY) {
        let deepTerrainCoords = { x: GameVariables.gameWidthAsPixels, y: reaperY + 60 };
        let treeX = -10;
        this.bckCtx.fillStyle = "#19191F";
        for (let i = 0; i < 130; i++) {
            deepTerrainCoords = this.generateRandomTerrain(deepTerrainCoords, 10, 25, -4, 4, 30, 200);
            treeX = this.generateRandomTrees(treeX, 60, 180, 60);
        }
    }

    generateWaterTerrain(reaperY) {
        let waterTerrainCoords = { x: GameVariables.gameWidthAsPixels, y: reaperY + 125 };
        this.bckCtx.fillStyle = "#E0E8F0";
        for (let i = 0; i < 130; i++) {
            waterTerrainCoords = this.generateRandomTerrain(waterTerrainCoords, 30, 30, -1, 1, 100, 800);
        }
    }

    generateCloseTerrain(reaperX, reaperY) {
        let closerTerrainCoords = { x: reaperX + 20, y: reaperY + 112 };
        let graveX = reaperX + 40;
        this.bckCtx.fillStyle = "#0F0E11";
        this.bckCtx.fillRect(closerTerrainCoords.x * GameVariables.pixelSize, closerTerrainCoords.y * GameVariables.pixelSize, 400 * GameVariables.pixelSize, 800 * GameVariables.pixelSize);
        for (let i = 0; i < 160; i++) {
            graveX = this.generateInLineGraves(graveX, reaperY, 16, 25, 65, 90);
            closerTerrainCoords = this.generateRandomTerrain(closerTerrainCoords, 4, 8, -6, 12, 30, 800);
        }
    }

    generateRandomTerrain(terrainCoords, spaceMin, spaceMax, heightMin, heightMax, size, fillHeight = 100) {
        if (terrainCoords.x > -spaceMax * 2 && terrainCoords.y < GameVariables.gameHeightAsPixels) {
            let newX = terrainCoords.x - this.randomNumberOnRange(spaceMin, spaceMax);
            let newY = terrainCoords.y + this.randomNumberOnRange(heightMin, heightMax);
            let yDiff = Math.abs(newY) - Math.abs(terrainCoords.y);
            let forceBreak = 0;
            while (terrainCoords.y !== newY) {
                this.bckCtx.fillRect(terrainCoords.x * GameVariables.pixelSize, terrainCoords.y * GameVariables.pixelSize, size * GameVariables.pixelSize, fillHeight * GameVariables.pixelSize);
                if (terrainCoords.x !== newX) terrainCoords.x -= this.randomNumberOnRange(1, spaceMin);
                if (terrainCoords.y !== newY) yDiff > 0 ? terrainCoords.y++ : terrainCoords.y--;
                forceBreak++;
                if (forceBreak > 500) break;
            }
        }
        return terrainCoords;
    }

    generateRandomTrees(treeX, spaceMin, spaceMax, treeSize) {
        if (treeX < GameVariables.gameWidthAsPixels + treeSize) {
            this.generateTree(treeX, GameVariables.gameHeightAsPixels / 2, -1, 1, -16, 0, 120, treeSize);
            treeX += this.randomNumberOnRange(spaceMin, spaceMax);
        }
        return treeX;
    }

    generateTree(x, y, spaceMin, spaceMax, heightMin, heightMax, amount, originalTreeSize) {
        let nextX = x;
        let nextY = y;
        let treeSize = originalTreeSize;
        for (let i = 0; i < amount; i++) {
            this.bckCtx.fillRect(
                nextX * GameVariables.pixelSize,
                nextY * GameVariables.pixelSize,
                treeSize * GameVariables.pixelSize,
                treeSize * GameVariables.pixelSize
            );
            nextX += this.randomNumberOnRange(spaceMin, spaceMax);
            nextY += this.randomNumberOnRange(heightMin, heightMax);
            if (treeSize > (originalTreeSize / 3) * 2) treeSize--;
            if (nextY < -treeSize) {
                break;
            }
        }
    }

    generateInLineGraves(graveX, y, spaceMin, spaceMax, heightMin, heightMax) {
        if (graveX < GameVariables.gameWidthAsPixels + spaceMax) {
            this.generateGrave(graveX, y + this.randomNumberOnRange(heightMin, heightMax));
            graveX += this.randomNumberOnRange(spaceMin, spaceMax);
        }
        return graveX;
    }

    generateGrave(x, y) {
        this.bckCtx.fillRect((x + 4) * GameVariables.pixelSize, (y - 25) * GameVariables.pixelSize, 20 * GameVariables.pixelSize, 3 * GameVariables.pixelSize);
        this.bckCtx.fillRect((x + 13) * GameVariables.pixelSize, (y - 35) * GameVariables.pixelSize, 3 * GameVariables.pixelSize, 25 * GameVariables.pixelSize);

        this.bckCtx.fillRect((x + 7) * GameVariables.pixelSize, (y - 10) * GameVariables.pixelSize, 16 * GameVariables.pixelSize, 2 * GameVariables.pixelSize);
        this.bckCtx.fillRect((x + 5) * GameVariables.pixelSize, (y - 9) * GameVariables.pixelSize, 20 * GameVariables.pixelSize, 2 * GameVariables.pixelSize);
        this.bckCtx.fillRect((x + 3) * GameVariables.pixelSize, (y - 7) * GameVariables.pixelSize, 24 * GameVariables.pixelSize, 2 * GameVariables.pixelSize);
        this.bckCtx.fillRect((x + 2) * GameVariables.pixelSize, (y - 5) * GameVariables.pixelSize, 26 * GameVariables.pixelSize, 100 * GameVariables.pixelSize);
        this.bckCtx.fillRect((x + 1) * GameVariables.pixelSize, (y + 1) * GameVariables.pixelSize, 28 * GameVariables.pixelSize, 30 * GameVariables.pixelSize);
    }

    randomNumberOnRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}