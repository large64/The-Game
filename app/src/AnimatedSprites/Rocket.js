import AnimatedSprite from "./AnimatedSprite";

export default class Rocket extends AnimatedSprite {
    constructor(frames) {
        super(frames);
        this.animationSpeed = Rocket.ANIMATION_SPEED;
        this.vx = Rocket.MOVING_SPEED;
        this.position.y = 100;
        this.play();
    }

    handleMovement() {
        this.position.x += this.vx;
    }
}

Rocket.ANIMATION_SPEED = 0.3;
Rocket.MOVING_SPEED = 8;
