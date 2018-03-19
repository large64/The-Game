import * as PIXI from "pixi.js";

import KeyHandler from "./KeyHandler";
import Config from "./Config";

export default class Player extends PIXI.extras.AnimatedSprite {
    constructor(frames) {
        super(frames);
        this.animationSpeed = Player.ANIMATION_SPEED;
        this.vx = 0;
        this.vy = 0;
        this.position.y = (Config.WINDOW_HEIGHT / 2) - (this.height / 2);
        this.play();

        this.setKeyHandlers();
    }

    setKeyHandlers() {
        const upKeyHandler = new KeyHandler(38);
        const downKeyHandler = new KeyHandler(40);
        const rightKeyHandler = new KeyHandler(39);
        const leftKeyHandler = new KeyHandler(37);

        upKeyHandler.onPress = () => {
            this.vy = -Player.MOVING_SPEED;
        };

        upKeyHandler.onRelease = () => {
            if (!downKeyHandler.isDown) {
                this.vy = 0;
            }
        };

        downKeyHandler.onPress = () => {
            this.vy = Player.MOVING_SPEED;
        };

        downKeyHandler.onRelease = () => {
            if (!upKeyHandler.isDown) {
                this.vy = 0;
            }
        };

        rightKeyHandler.onPress = () => {
            this.vx = Player.MOVING_SPEED;
        };

        rightKeyHandler.onRelease = () => {
            if (!leftKeyHandler.isDown) {
                this.vx = 0;
            }
        };

        leftKeyHandler.onPress = () => {
            this.vx = -Player.MOVING_SPEED;
        };

        leftKeyHandler.onRelease = () => {
            if (!rightKeyHandler.isDown) {
                this.vx = 0;
            }
        };
    }
}

Player.ANIMATION_SPEED = 0.3;
Player.MOVING_SPEED = 5;