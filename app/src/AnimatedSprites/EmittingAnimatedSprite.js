import * as PIXI from 'pixi.js';

import AnimatedSprite from "./AnimatedSprite";

export default class EmittingAnimatedSprite extends AnimatedSprite {
    constructor(frames, emitterData, particleImages) {
        super(frames);

        this.particleContainer = new PIXI.particles.ParticleContainer();
        this.emitter = new PIXI.particles.Emitter(
            this.particleContainer,
            particleImages,
            emitterData.config
        );
        this.emitter.autoUpdate = true;
        this.emitter.emit = false;
    }

    updateParticleContainerPosition() {
        this.particleContainer.position = this.position;
    }
}
