import GameStateManager from "./GameStateManager";

export default class EventListeners {
    register() {
        document.addEventListener('start', () => {
            this.parallaxScroller.setVisibility(true);
            this.objectPools.spaceshipEnemies.startMovementRandomizers();
            this.mainScreenScene.visible = false;
            this.gameOverScene.visible = false;
            this.gameState = GameStateManager.playState.bind(this);
            this.player.resetPosition();
            this.stage.addChild(this.player);
            this.spaceShipEnemySpawner.start();
        });

        document.addEventListener('gameOver', () => {
            this.spaceShipEnemySpawner.stop();
            this.gameState = GameStateManager.actionManagerUpdateState.bind(this);
            this.emptyStage();
            this.gameOverScene.visible = true;
            this.objectPools.spaceshipEnemies.stopMovementRandomizers();

            const gameOverFadeOutAction = new PIXI.action.FadeOut(0.5);
            setTimeout(() => {
                const gameOverAction = PIXI.actionManager.runAction(this.gameOverScene, gameOverFadeOutAction);
                gameOverAction.on('end', () => {
                    this.parallaxScroller.setVisibility(false);
                    this.gameOverScene.visible = false;
                    this.gameOverScene.alpha = 1;
                    this.mainScreenScene.visible = true;
                    this.gameState = GameStateManager.mainScreenState.bind(this);
                });
            }, 3000);
        });

        document.addEventListener('removeSprites', (event) => {
            const sprites = event.detail.sprites;

            let i = sprites.length;
            while (i--) {
                const spriteData = sprites[i];

                this.stage.removeChild(spriteData.sprite);

                if (spriteData.objectPool === null) {
                    return;
                }

                this.removeSprite(spriteData.sprite, spriteData.objectPool);
            }
        });
    }
}
