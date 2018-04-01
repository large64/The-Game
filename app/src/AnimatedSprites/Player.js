import KeyHandler from "../KeyHandler";
import Config from "../Config";
import EmittingAnimatedSprite from "./EmittingAnimatedSprite";
import BlowUpEmitterData from '../EmitterData/BlowUpEmitterData.json';

export default class Player extends EmittingAnimatedSprite {
    constructor(frames) {
        super(frames, BlowUpEmitterData, [PIXI.loader.resources['spaceshipParticle'].texture]);
        this.animationSpeed = Player.ANIMATION_SPEED;
        this.vx = 0;
        this.vy = 0;
        this.resetPosition();
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

    resetPosition() {
        this.position.x = 0;
        this.position.y = (Config.WINDOW_HEIGHT / 2) - (this.height / 2);
    }

    handleMovement() {
        if (this.position.y > 0 && this.vy < 0
            || this.position.y < (Config.WINDOW_HEIGHT - this.height) && this.vy > 0) {
            this.position.y += this.vy;
        }
        if (this.position.x > 0 && this.vx < 0
            || this.position.x < (Config.WINDOW_WIDTH - this.width) && this.vx > 0) {
            this.position.x += this.vx;
        }
    }
}

Player.ANIMATION_SPEED = 0.3;
Player.MOVING_SPEED = 5;
