import * as PIXI from "pixi.js";

export default class Rocket extends PIXI.extras.AnimatedSprite {
    constructor(frames) {
        super(frames);
        this.animationSpeed = Rocket.ANIMATION_SPEED;
        this.vx = Rocket.MOVING_SPEED;
        this.position.y = 100;
        this.play();
    }
}

Rocket.ANIMATION_SPEED = 0.3;
Rocket.MOVING_SPEED = 8;