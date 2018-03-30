import Helpers from "../Helpers";
import SpaceshipEnemy from "../AnimatedSprites/SpaceshipEnemy";
import ObjectPool from "./ObjectPool";

export default class SpaceshipEnemyObjectPool extends ObjectPool {
    constructor() {
        super();
        for (let i = 0; i < SpaceshipEnemyObjectPool.ITEMS_LENGTH; i++) {
            const spaceshipEnemyFrames = Helpers.collectAnimatedSpriteFrames(4, 'spaceship_enemy', 'png');
            const spaceshipEnemy = new SpaceshipEnemy(spaceshipEnemyFrames);
            this.items.push(spaceshipEnemy);
        }
    }

    startMovementRandomizers() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].startMovementRandomizer();
        }
    }

    stopMovementRandomizers() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].stopMovementRandomizer();
        }
    }
}

SpaceshipEnemyObjectPool.ITEMS_LENGTH = 8;
