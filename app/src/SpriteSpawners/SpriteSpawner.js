import Config from "../Config";

export default class SpriteSpawner {
    constructor(stage, objectPool) {
        this.intervalId = null;
        this.stage = stage;
        this.objectPool = objectPool;
        this.lastSpawnedSprite = null;
    }

    start() {
        this.intervalId = setInterval(() => {
            const sprite = this.objectPool.borrow();

            if (!sprite) {
                return;
            }

            this.lastSpawnedSprite = sprite;

            sprite.position = this.getSpawnPosition();
            this.stage.addChild(sprite);
        }, Config.ENEMY_SPAWN_INTERVAL_SECONDS * 1000);
    }

    stop() {
        clearInterval(this.intervalId);
    }

    getSpawnPosition() {
        return {
            x: 0,
            y: 0
        }
    }
}
