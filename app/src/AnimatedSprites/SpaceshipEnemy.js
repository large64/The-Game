import * as PIXI from "pixi.js";

import SpaceshipEnemyEmitterData from '../EmitterData/SpaceshipEnemyEmitterData.json';

export default class SpaceshipEnemy extends PIXI.extras.AnimatedSprite {
    constructor(frames) {
        super(frames);
        this.animationSpeed = SpaceshipEnemy.ANIMATION_SPEED;
        this.vx = SpaceshipEnemy.MOVING_SPEED;
        this.position.y = 200;
        this.play();

        this.particleContainer = new PIXI.particles.ParticleContainer();
        this.emitter = new PIXI.particles.Emitter(
            this.particleContainer,
            [PIXI.loader.resources['spaceshipEnemyParticle'].texture],
            SpaceshipEnemyEmitterData.config
        );
        this.emitter.autoUpdate = true;
        this.emitter.emit = false;
    }

    updateParticleContainerPosition() {
        this.particleContainer.position = this.position;
    }
}

SpaceshipEnemy.ANIMATION_SPEED = 0.3;
SpaceshipEnemy.MOVING_SPEED = -3;
