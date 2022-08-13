import { GameVariables } from "../game-variables";

export class Soul {
    constructor(gameDiv){
        this.backgroundElem = document.createElement("canvas");
        this.backgroundElem.width = GameVariables.soulWidth;
        this.backgroundElem.height = GameVariables.soulHeight;
        this.backgroundElem.id = "soul";
        this.backgroundElem.style.backgroundColor = "blue";

        gameDiv.appendChild(this.backgroundElem);
    }

    update(){

    }

    draw(){

    }

    dispose(){

    }
}