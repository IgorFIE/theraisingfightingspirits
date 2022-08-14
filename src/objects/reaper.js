import { GameVariables } from "../game-variables";

export class Reaper {
    constructor(gameDiv){

        this.reaperLife = 100;
        this.reaperDef = 0;

        this.backgroundElem = document.createElement("canvas");
        this.backgroundElem.width = GameVariables.reaperWidth;
        this.backgroundElem.height = GameVariables.reaperHeight;
        this.backgroundElem.id = "reaper";
        this.backgroundElem.style.backgroundColor = "black";

        let ctx = this.backgroundElem.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(5, GameVariables.reaperHeight - 15, GameVariables.reaperWidth - 10, 10);

        gameDiv.appendChild(this.backgroundElem);
    }

    takeDamage(dmg){
        console.log("Current Reaper Life: " + this.reaperLife + " || Def: " + this.reaperDef);
        if(this.reaperDef > 0){
            this.reaperDef -=dmg;
            if(this.reaperDef < 0){
                dmg = Math.abs(this.reaperDef);
                this.reaperDef = 0;
            }
        }
        if(this.reaperDef == 0){
            this.reaperLife -= dmg;
            if(this.reaperLife <  0){
                this.reaperLife = 0;
            }
        }
        console.log("After Reaper Life: " + this.reaperLife+ " || Def: " + this.reaperDef);
    }

    addShield(amount){
        console.log("Current reaper Life: " + this.reaperLife + " || Def: " + this.reaperDef);
        this.reaperDef += amount;
        console.log("After reaper Life: " + this.reaperLife + " || Def: " + this.reaperDef);
    }

    update(){

    }

    draw(){

    }

    dispose(){

    }
}