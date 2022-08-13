import { GameVariables } from "../game-variables";

export class Reaper {
    constructor(gameDiv){
        this.backgroundElem = document.createElement("canvas");
        this.backgroundElem.width = GameVariables.reaperWidth;
        this.backgroundElem.height = GameVariables.reaperHeight;
        this.backgroundElem.id = "reaper";
        this.backgroundElem.style.backgroundColor = "black";

        gameDiv.appendChild(this.backgroundElem);
    }

    update(){

    }

    draw(){

    }

    dispose(){

    }
}