import BlowUpEmitterData from '../EmitterData/BlowUpEmitterData.json';
import EmittingAnimatedSprite from "./EmittingAnimatedSprite";
import Helpers from "../Helpers";
import Config from "../Config";

export default class SpaceshipEnemy extends EmittingAnimatedSprite {
    constructor(frames) {
        super(frames, BlowUpEmitterData, [PIXI.loader.resources['spaceshipEnemyParticle'].texture]);
        this.animationSpeed = SpaceshipEnemy.ANIMATION_SPEED;
        this.vx = SpaceshipEnemy.MOVING_SPEED;
        this.position.y = 200;
        this.pixelsToMoveVertically = 0;
        this.movementRandomizerIntervalId = null;

        this.play();
        this.startMovementRandomizer();
    }

    changeVerticalMovement() {
        this.pixelsToMoveVertically = Helpers.getRandomInteger(-1, 1);
    }

    changeSpeed() {
        this.vx = Helpers.getRandomInteger(-0.5, -6);
    }

    startMovementRandomizer() {
        this.movementRandomizerIntervalId = setInterval(() => {
            this.changeSpeed();
            this.changeVerticalMovement();
        }, Helpers.getRandomInteger(500, 2000));
    }

    stopMovementRandomizer() {
        clearInterval(this.movementRandomizerIntervalId);
    }

    handleMovement() {
        this.position.x += this.vx;

        if (this.position.y > 0
            && this.position.y < Config.WINDOW_HEIGHT - this.height) {
            this.position.y += this.pixelsToMoveVertically;
        }
    }
}

SpaceshipEnemy.ANIMATION_SPEED = 0.3;
SpaceshipEnemy.MOVING_SPEED = -3;
