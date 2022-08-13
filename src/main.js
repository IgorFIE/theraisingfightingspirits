const { Game } = require("./screens/game");

function init(){
    let game = new Game();
    game.update();
    game.draw();
    game.dispose();
}

init();