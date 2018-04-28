import Config from "./Config";
import Button from "./Button";
import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";
import Helpers from "./Helpers";
import Menu from "./Menu";

export default class SceneHandler {
    static getGameOverScene(onAnimationEndCallback) {
        const gameOverScene = new PIXI.Container();

        const theEndStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 64,
            fill: 'white'
        });

        const message = new PIXI.Text('GAME OVER', theEndStyle);
        message.x = Config.WINDOW_WIDTH / 2 - message.width / 2;
        message.y = Config.WINDOW_HEIGHT / 2 - theEndStyle.fontSize / 2;

        gameOverScene.addChild(message);

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

        const spaceshipEnemyLeft = new SpaceshipEnemy(Helpers.collectAnimatedSpriteFrames(4, 'spaceship_enemy', 'png'));
        spaceshipEnemyLeft.stopMovementRandomizer();
        spaceshipEnemyLeft.vx = 0;
        spaceshipEnemyLeft.position.y = 260;
        spaceshipEnemyLeft.position.x = 50;
        spaceshipEnemyLeft.anchor.set(0.5, 0);
        spaceshipEnemyLeft.scale.x *= -1;
        spaceshipEnemyLeft.pixelsToMoveVertically = 1;

        const spaceshipEnemyRight = new SpaceshipEnemy(Helpers.collectAnimatedSpriteFrames(4, 'spaceship_enemy', 'png'));
        spaceshipEnemyRight.stopMovementRandomizer();
        spaceshipEnemyRight.vx = 0;
        spaceshipEnemyRight.position.y = 350;
        spaceshipEnemyRight.position.x = Config.WINDOW_WIDTH - spaceshipEnemyRight.width - 25;
        spaceshipEnemyRight.pixelsToMoveVertically = -1;

        const startGameEvent = new Event('start');
        const mainMenu = new Menu(200, 50, 10, 280);
        const game1Button = mainMenu.createButton('GAME1');
        const game2Button = mainMenu.createButton('GAME2');
        const game3Button = mainMenu.createButton('GAME3');
        const exitButton = mainMenu.createButton('EXIT');

        game1Button.on('mouseup', (e) => {
            document.dispatchEvent(startGameEvent);
        });
        game2Button.on('mouseup', (e) => {
            document.dispatchEvent(startGameEvent);
        });
        game3Button.on('mouseup', (e) => {
            document.dispatchEvent(startGameEvent);
        });
        exitButton.on('mouseup', (e) => {
            window.location = 'http://example.com';
        });

        const logo = new PIXI.Sprite(PIXI.loader.resources['logo'].texture);
        logo.position.x = Config.WINDOW_WIDTH / 2 - logo.width / 2;
        logo.position.y = 70;
        mainScreenScene.addChild(logo);

        mainScreenScene.addChild(mainMenu);
        mainScreenScene.addChild(spaceshipEnemyLeft);
        mainScreenScene.addChild(spaceshipEnemyRight);

        return mainScreenScene;
    }

    static getPauseScene() {
        const pauseScene = new PIXI.Container();

        const pauseTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 64,
            fill: 'white'
        });

        const message = new PIXI.Text('PAUSED', pauseTextStyle);
        message.x = Config.WINDOW_WIDTH / 2 - message.width / 2;
        message.y = Config.WINDOW_HEIGHT / 2 - pauseTextStyle.fontSize / 2;

        pauseScene.addChild(message);

        return pauseScene;
    }
}
