import * as PIXI from 'pixi.js';
import Config from "../Config";

export default class AnimatedSprite extends PIXI.extras.AnimatedSprite {
    constructor(frames) {
        super(frames);
    }

    isOutOfScreen() {
        if (this.position.y > 0 && this.vy < 0
            || this.position.y < (Config.WINDOW_HEIGHT - this.height) && this.vy > 0) {
            return false;
        }

        return !(this.position.x > 0 && this.vx < 0
            || this.position.x < (Config.WINDOW_WIDTH - this.width) && this.vx > 0);
    }

    handleMovement() {
    }
}
