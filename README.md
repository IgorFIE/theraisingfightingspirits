# The Raising Fighting Spirits

Is a simple strategy card game where you fight against the Grim Reaper using a horde of spirits!

Try to kill the Reaper faster to receive a better score!!! BUT watch out for the Reaper's next turn intended action!!!

Game instructions:
- You can stop/start the game sounds in the top right speaker icon.
- Click/touch a soul to select it or use the buttons at the bottom right (next soul/previous soul) to navigate them.
- Look at the Reaper's next turn intention/action to create your strategy.
- Energy lets you know the amount of cards you can play per turn.
- Click and drag cards out/above your hand area to play them.
- End your turn and see the reaper action.
- During game events you can select one of the power up options.

Web monetization:
- When monetization is active the top left dollar icon will display as gold.
- During game you will also see messages boxes as gold letting you know what bonuses are active.
- If you end monetization the bonus applied only expires at the end of your turn.

Web monetization Bonus:
- Monetization allows you to have one extra energy per turn (energy allows you to play cards).
- Monetization allows you to draw one extra card per turn.
- Monetization gives you one more option to select during events.

You can play a live version here: https://igorfie.gitlab.io/theraisingfightingspirits/

This game was created for the [2022 js13kGames](https://js13kgames.com/) where the theme was `DEATH`.

## TODO-FOR-THE-FUTURE-ME
Since the limit of space was 13kbs I was out of space but in the future I may:
- Implement auto resizing so the game automatically ajusts without the need of refreshing the page.
- Implement card deck so the player can know what cards are in the deck.
- Implement card events so the player can add cards to the deck, this would allow players to create an unique deck during a run.
- Implement souls special traits, for example:. a cat soul has 7 lifes, an owl soul allows you to see the first card of your next turn.
- Souls having diferent sprites and colors.
- Some card ideas:
    - heal a selected minion
    - sacrifice 5 random souls to spawn a devil soul (100 life, damage cards have double effect)
    - selected soul becomes invisible (reaper can't atk it next turn)

### Setup
Run `npm install` on a terminal

### Development
Run `npm run start` to start the game in a development server on `localhost:8080`.

### Production
Use `npm run build` to create minified file and zip him with the `index.html`. The result will be available in the `dist` directory.

![main menu](main-menu.png "The Raising Fighting Spirits Main Menu")
![game screen](game-screen.png "The Raising Fighting Spirits Game Screen")
