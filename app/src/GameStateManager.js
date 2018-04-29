import Main from "./Main";
import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";
import Rocket from "./AnimatedSprites/Rocket";
import CollisionHandler from "./CollisionHandler";

export default class GameStateManager {
    static playState() {
        if (GameStateManager.CURRENT_STATE !== GameStateManager.PLAY_STATE) {
            GameStateManager.CURRENT_STATE = GameStateManager.PLAY_STATE;
        }

        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        const visibleSpaceshipEnemies = this.stage.children.filter(
            (filteredChild) => filteredChild.constructor === SpaceshipEnemy
        );

        this.player.handleMovement();
        CollisionHandler.handlePlayerCollision(visibleSpaceshipEnemies, this.player);
        this.player.updateParticleContainerPosition();

        let i = this.stage.children.length;
        while (i--) {
            const child = this.stage.children[i];

            if (!child) {
                return;
            }

            switch (child.constructor) {
                case Rocket:
                    child.handleMovement();
                    CollisionHandler.handleRocketCollision(child, visibleSpaceshipEnemies);
                    if (child.isOutOfScreen()) {
                        this.removeSprite(child, 'rockets');
                    }
                    break;
                case SpaceshipEnemy:
                    child.handleMovement();
                    child.updateParticleContainerPosition();
                    if (child.isOutOfScreen()) {
                        this.removeSprite(child, 'spaceshipEnemies');
                    }
                    break;
            }
        }
    }

    static pauseState() {
        if (GameStateManager.CURRENT_STATE !== GameStateManager.PAUSED_STATE) {
            GameStateManager.CURRENT_STATE = GameStateManager.PAUSED_STATE;
        }
    }

    static actionManagerUpdateState() {
        if (GameStateManager.CURRENT_STATE !== GameStateManager.ACTION_MANAGER_UPDATE_STATE) {
            GameStateManager.CURRENT_STATE = GameStateManager.ACTION_MANAGER_UPDATE_STATE;
        }
        PIXI.actionManager.update();
    }

    static mainScreenState() {
        if (GameStateManager.CURRENT_STATE !== GameStateManager.MAIN_SCREEN_STATE) {
            GameStateManager.CURRENT_STATE = GameStateManager.MAIN_SCREEN_STATE;
        }

        const visibleSpaceshipEnemies = this.mainScreenScene.children.filter(
            (filteredChild) => filteredChild.constructor === SpaceshipEnemy
        );

        for (let i = 0; i < visibleSpaceshipEnemies.length; i++) {
            visibleSpaceshipEnemies[i].handleFloatingMovement();
        }
    }

    static getCurrentState() {
        return GameStateManager.CURRENT_STATE;
    }
}

GameStateManager.CURRENT_STATE = null;
GameStateManager.PLAY_STATE = 'play';
GameStateManager.PAUSED_STATE = 'paused';
GameStateManager.ACTION_MANAGER_UPDATE_STATE = 'actionManagerUpdate';
GameStateManager.MAIN_SCREEN_STATE = 'mainScreenState';
