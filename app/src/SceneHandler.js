import Config from "./Config";
import Button from "./Button";
import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";
import Helpers from "./Helpers";

export default class SceneHandler {
    static getGameOverScene(playAgainCallback) {
        const gameOverScene = new PIXI.Container();

        const theEndStyle = new PIXI.TextStyle({
            fontFamily: 'Futura',
            fontSize: 64,
            fill: 'white'
        });

        const message = new PIXI.Text('GAME OVER', theEndStyle);
        message.x = Config.WINDOW_WIDTH / 2 - message.width / 2;
        message.y = Config.WINDOW_HEIGHT / 2 - theEndStyle.fontSize;

        const tryAgainWidth = 240;
        const tryAgain = new Button(
            'TRY AGAIN',
            tryAgainWidth,
            55,
            Config.WINDOW_WIDTH / 2 - tryAgainWidth / 2,
            message.y + 80
        );
        tryAgain.on('click', (e) => {
            playAgainCallback();
        });

        gameOverScene.addChild(message);
        gameOverScene.addChild(tryAgain);

        return gameOverScene;
    }

    static getSplashScreenScene(onAnimationEndCallback) {
        const splashScreenScene = new PIXI.Container();
        const splashScreenImage = new PIXI.Sprite(PIXI.loader.resources['splashScreen'].texture);
        splashScreenScene.addChild(splashScreenImage);

        const splashScreenFadeOutAction = new PIXI.action.FadeOut(0.5);

        setTimeout(() => {
            const action = PIXI.actionManager.runAction(splashScreenScene, splashScreenFadeOutAction);
            action.on('end', () => {
                onAnimationEndCallback();
            });
        }, 2000);

        return splashScreenScene;
    }

    static getMainScreenScene() {
        const mainScreenScene = new PIXI.Container();
        const backgroundImage = new PIXI.Sprite(PIXI.loader.resources['farBackground'].texture);
        mainScreenScene.addChild(backgroundImage);

        const spaceshipEnemy = new SpaceshipEnemy(Helpers.collectAnimatedSpriteFrames(4, 'spaceship_enemy', 'png'));

        const game1Button = new Button('GAME1', 200, 50, 0, 0);

        mainScreenScene.addChild(game1Button);
        mainScreenScene.addChild(spaceshipEnemy);

        return mainScreenScene;
    }
}
