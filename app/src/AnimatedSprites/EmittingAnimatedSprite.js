import * as PIXI from 'pixi.js';

export default class EmittingAnimatedSprite extends PIXI.extras.AnimatedSprite {
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
