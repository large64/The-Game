import * as PIXI from 'pixi.js';

import Helpers from "../Helpers";
import Config from "../Config";

export default class AnimatedSprite extends PIXI.extras.AnimatedSprite {
    constructor(frames) {
        super(frames);
    }

    isOutOfScreen() {
        return this.position.x < 0 - this.width
            || this.position.x > Config.WINDOW_WIDTH
            || this.position.y < 0 - this.height
            || this.position.y > Config.WINDOW_HEIGHT;
    }

    isCollidesWith(sprite) {
        return Helpers.hitTestRectangle(this, sprite);
    }
}
