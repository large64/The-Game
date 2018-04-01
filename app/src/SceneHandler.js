import Config from "./Config";

export default class SceneHandler {
    static getGameOverScene(playAgainCallback) {
        const gameOverScene = new PIXI.Container();

        const theEndStlye = new PIXI.TextStyle({
            fontFamily: 'Futura',
            fontSize: 64,
            fill: 'white'
        });

        const playAgainStyle = new PIXI.TextStyle({
            fontFamily: 'Futura',
            fontSize: 32,
            fill: 'white',
            cursor: 'pointer'
        });

        const message = new PIXI.Text('The End!', theEndStlye);
        message.x = Config.WINDOW_WIDTH / 2 - message.width / 2;
        message.y = Config.WINDOW_HEIGHT / 2 - theEndStlye.fontSize;

        const playAgain = new PIXI.Text('Play Again!', playAgainStyle);
        playAgain.x = Config.WINDOW_HEIGHT / 2 - playAgainStyle.fontSize;
        playAgain.y = message.y + message.height;

        playAgain.interactive = true;
        playAgain.buttonMode = true;
        playAgain.on('click', (e) => {
            playAgainCallback();
        });

        gameOverScene.addChild(message);
        gameOverScene.addChild(playAgain);

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

        return splashScreenScene
    }
}
