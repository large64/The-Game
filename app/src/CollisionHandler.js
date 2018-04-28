import RemoveSpritesEvent from "./Events/RemoveSpritesEvent";

export default class CollisionHandler {
    static handlePlayerCollision(spaceshipEnemies, player) {
        let i = spaceshipEnemies.length;
        while (i--) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (player.isCollidesWith(spaceshipEnemy)) {
                player.emitter.emit = true;
                spaceshipEnemy.emitter.emit = true;

                const spritesToRemove = [
                    CollisionHandler.packSpriteForRemoval(spaceshipEnemy, 'spaceshipEnemies'),
                    CollisionHandler.packSpriteForRemoval(player)
                ];
                const removeSpriteEvent = new RemoveSpritesEvent(document, spritesToRemove);
                removeSpriteEvent.dispatch();
                const gameOverEvent = new Event('gameOver');
                document.dispatchEvent(gameOverEvent);
            }
        }
    }

    static handleRocketCollision(rocket, spaceshipEnemies) {
        let i = spaceshipEnemies.length;
        while (i--) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (rocket.isCollidesWith(spaceshipEnemy)) {
                spaceshipEnemy.emitter.emit = true;

                const spritesToRemove = [
                    CollisionHandler.packSpriteForRemoval(spaceshipEnemy, 'spaceshipEnemies'),
                    CollisionHandler.packSpriteForRemoval(rocket, 'rockets')
                ];

                const removeSpriteEvent = new RemoveSpritesEvent(document, spritesToRemove);
                removeSpriteEvent.dispatch();
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
