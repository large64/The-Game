import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";
import Rocket from "./AnimatedSprites/Rocket";
import Main from "./Main";

export default class GameStateHandler {
    static play() {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        const visibleSpaceshipEnemies = this.stage.children.filter(
            (filteredChild) => filteredChild.constructor === SpaceshipEnemy
        );

        this.handlePlayerMovement();
        this.handlePlayerCollision(visibleSpaceshipEnemies);
        this.player.updateParticleContainerPosition();

        for (let i = 0; i < this.stage.children.length; i++) {
            const child = this.stage.children[i];

            if (!child) {
                return;
            }

            switch (child.constructor) {
                case Rocket:
                    this.handleRocketMovement(child);
                    this.handleRocketCollision(child, visibleSpaceshipEnemies);
                    break;
                case SpaceshipEnemy:
                    this.handleSpaceshipEnemyMovement(child);
                    child.updateParticleContainerPosition();
                    break;
            }
        }
    }

    static end() {
        this.gameOverScene.visible = true;
        clearInterval(this.spaceShipEnemySpawnerIntervalId);

        for (let i = 0; i < this.objectPools.spaceshipEnemies.items.length; i++) {
            this.objectPools.spaceshipEnemies.items[i].clearInterval();
        }

        for (let i = 0; i < this.stage.children.length; i++) {
            const child = this.stage.children[i];
            if (child.constructor === SpaceshipEnemy || child.constructor === Rocket) {
                this.stage.removeChild(child);
            }
        }
    }
}
