import { GameVariables } from "../game-variables";

export class Card {
    constructor(gameDiv) {
        const self = this;

        this.cardElem = document.createElement("div");
        this.cardElem.classList.add("card");
        gameDiv.appendChild(this.cardElem);

        // this.cardImage = document.createElement("div");
        // this.cardImage.classList.add("card-image");

        // this.cardElem.appendChild(this.cardImage);

        // this.cardIcon = document.createElement("div");
        // this.cardIcon.classList.add("card-icon");

        // this.cardElem.appendChild(this.cardIcon);

        // this.cardTitle = document.createElement("div");
        // this.cardTitle.classList.add("card-title");

        // this.cardElem.appendChild(this.cardTitle);

        // this.cardType = document.createElement("div");
        // this.cardType.classList.add("card-type");

        // this.cardElem.appendChild(this.cardType);

        this.cardUseButton = document.createElement("button");
        this.cardUseButton.classList.add("card-use-button");
        // this.cardUseButton.classList.add("hidden");
         this.cardUseButton.addEventListener('click', function(e){ self.useCard()});
        this.cardUseButton.textContent = "USE CARD"
        
        this.cardElem.appendChild(this.cardUseButton);
        
        this.cardDescription = document.createElement("p");
        this.cardDescription.classList.add("card-description");
        
        this.cardElem.appendChild(this.cardDescription);
        
        this.cardType = this.initCard();
        
        // const test = this.cardUseButton;
        // this.cardElem.addEventListener('click', function(e){
        //     console.log(e);
        //     test.classList.remove("hidden");
        // });
    }

    initCard() {
        let randomNumber = Math.floor(Math.random() * 2);
        switch (randomNumber) {
            case CardTypes.Atk:
                this.cardDescription.textContent = "ATK CARD 2 DAMAGE";
                return CardTypes.Atk;
            default:
                this.cardDescription.textContent = "DEF CARD 2 SHIELD"
                return CardTypes.Def;
        }
    }

    useCard(){
        console.log("USE CARD!");
        switch (this.cardType) {
            case CardTypes.Atk:
                GameVariables.reaper.takeDamage(2);
                break;
            default:
                GameVariables.soul.addShield(2);
                break;
        }
    }

    update() {

    }

    draw() {

    }

    dispose() {

    }
}

const CardTypes = {
    Atk: 0,
    Def: 1,
    Minion: 2,
    Trick: 3
}