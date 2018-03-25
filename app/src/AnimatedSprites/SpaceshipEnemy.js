import * as PIXI from "pixi.js";

import SpaceshipEnemyEmitterData from '../EmitterData/SpaceshipEnemyEmitterData.json';
import EmittingAnimatedSprite from "./EmittingAnimatedSprite";

export default class SpaceshipEnemy extends EmittingAnimatedSprite {
    constructor(frames) {
        super(frames, SpaceshipEnemyEmitterData, [PIXI.loader.resources['spaceshipEnemyParticle'].texture]);
        this.animationSpeed = SpaceshipEnemy.ANIMATION_SPEED;
        this.vx = SpaceshipEnemy.MOVING_SPEED;
        this.position.y = 200;
        this.play();
    }
}

SpaceshipEnemy.ANIMATION_SPEED = 0.3;
SpaceshipEnemy.MOVING_SPEED = -3;
