import Config from "../Config";
import SpriteSpawner from "./SpriteSpawner";
import Helpers from "../Helpers";

export default class SpaceshipEnemySpriteSpawner extends SpriteSpawner {
    constructor(stage, objectPool) {
        super(stage, objectPool);
    }

    getSpawnPosition() {
        const spaceshipEnemy = this.lastSpawnedSprite;

        return {
            y: Helpers.getRandomInteger(
                spaceshipEnemy.height,
                Config.WINDOW_HEIGHT - spaceshipEnemy.height
            ),
            x: spaceshipEnemy.position.x = Config.WINDOW_WIDTH
        }
    }
}
