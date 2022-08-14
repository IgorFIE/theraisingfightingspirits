import { GameVariables } from "../game-variables";

export class Soul {
    constructor(gameDiv){

        this.soulLife = 100;
        this.soulDef = 0;

        this.backgroundElem = document.createElement("canvas");
        this.backgroundElem.width = GameVariables.soulWidth;
        this.backgroundElem.height = GameVariables.soulHeight;
        this.backgroundElem.id = "soul";
        this.backgroundElem.style.backgroundColor = "blue";

        gameDiv.appendChild(this.backgroundElem);

        let ctx = this.backgroundElem.getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(5, GameVariables.soulHeight - 15, GameVariables.soulWidth - 10, 10);
    }

    takeDamage(dmg){
        console.log("Current Soul Life: " + this.soulLife + " || Def: " + this.soulDef);
        if(this.soulDef > 0){
            this.soulDef -=dmg;
            if(this.soulDef < 0){
                dmg = Math.abs(this.soulDef);
                this.soulDef = 0;
            }
        }
        if(this.soulDef == 0){
            this.soulLife -= dmg;
            if(this.soulLife <  0){
                this.soulLife = 0;
            }
        }
        console.log("After Soul Life: " + this.soulLife+ " || Def: " + this.soulDef);
    }

    addShield(amount){
        console.log("Current Soul Life: " + this.soulLife + " || Def: " + this.soulDef);
        this.soulDef += amount;
        console.log("After Soul Life: " + this.soulLife + " || Def: " + this.soulDef);
    }

    update(){

    }

    draw(){

    }

    dispose(){

    }
}