import { GameVariables } from "../game-variables";

export class Background {
    constructor(gameDiv){
        this.backgroundElem = document.createElement("canvas");
        this.backgroundElem.width = GameVariables.gameWidth;
        this.backgroundElem.height = GameVariables.gameHeight;
        this.backgroundElem.id = "gameBackground";
        this.backgroundElem.style.backgroundColor = "darkgray";

        gameDiv.appendChild(this.backgroundElem);
    }

    update(){

    }

    draw(){

    }

    dispose(){

    }
}