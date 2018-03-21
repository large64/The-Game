import Helpers from "../Helpers";
import SpaceshipEnemy from "../AnimatedSprites/SpaceshipEnemy";

export default class RocketObjectPool {
    constructor() {
        this.items = [];
        for (let i = 0; i < 5; i++) {
            const spaceshipEnemyFrames = Helpers.collectAnimatedSpriteFrames(4, 'spaceship_enemy', 'png');
            const spaceshipEnemy = new SpaceshipEnemy(spaceshipEnemyFrames);
            this.items.push(spaceshipEnemy);
        }
    }

    borrow() {
        return this.items.shift();
    }

    handBack(item) {
        this.items.push(item);
    }
}