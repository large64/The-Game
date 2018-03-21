import * as PIXI from "pixi.js";

export default class SpaceshipEnemy extends PIXI.extras.AnimatedSprite {
    constructor(frames) {
        super(frames);
        this.animationSpeed = SpaceshipEnemy.ANIMATION_SPEED;
        this.vx = SpaceshipEnemy.MOVING_SPEED;
        this.position.y = 200;
        this.play();
    }
}

SpaceshipEnemy.ANIMATION_SPEED = 0.3;
SpaceshipEnemy.MOVING_SPEED = 0;