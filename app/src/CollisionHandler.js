export default class CollisionHandler {
    constructor(stage, player) {
        this.stage = stage;
        this.player = player;
    }

    handlePlayerCollision(spaceshipEnemies) {
        let i = spaceshipEnemies.length;
        while (i--) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (this.player.isCollidesWith(spaceshipEnemy)) {
                this.player.emitter.emit = true;
                spaceshipEnemy.emitter.emit = true;

                const spritesToRemove = [
                    CollisionHandler.packSpriteForRemoval(spaceshipEnemy, 'spaceshipEnemies'),
                    CollisionHandler.packSpriteForRemoval(this.player)
                ];
                const removeSpriteEvent = new CustomEvent('removeSprite', {
                    detail: {
                        sprites: spritesToRemove
                    }
                });
                document.dispatchEvent(removeSpriteEvent);
                const gameOverEvent = new Event('gameOver');
                document.dispatchEvent(gameOverEvent);
            }
        }
    }

    static packSpriteForRemoval(sprite, objectPool = null) {
        return {
            sprite: sprite,
            objectPool: objectPool
        };
    }
}
