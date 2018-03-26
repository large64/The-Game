import * as PIXI from "pixi.js";

import BlowUpEmitterData from '../EmitterData/BlowUpEmitterData.json';
import EmittingAnimatedSprite from "./EmittingAnimatedSprite";
import Helpers from "../Helpers";

export default class SpaceshipEnemy extends EmittingAnimatedSprite {
    constructor(frames) {
        super(frames, BlowUpEmitterData, [PIXI.loader.resources['spaceshipEnemyParticle'].texture]);
        this.animationSpeed = SpaceshipEnemy.ANIMATION_SPEED;
        this.vx = SpaceshipEnemy.MOVING_SPEED;
        this.position.y = 200;
        this.pixelsToMoveVertically = 0;
        this.play();

        setInterval(() => {
            this.changeSpeed();
            this.pixelsToMoveVertically = Helpers.getRandomInteger(-1, 1);
        }, Helpers.getRandomInteger(1, 2) * 1000);
    }

    changeSpeed() {
        this.vx = Helpers.getRandomInteger(-0.5, -6);
    }
}

SpaceshipEnemy.ANIMATION_SPEED = 0.3;
SpaceshipEnemy.MOVING_SPEED = -3;
