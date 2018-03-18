import * as PIXI from 'pixi.js';

import ParallaxScroller from './ParallaxScroller';

export default class Main {
    constructor() {
        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(800, 600, {
            view: document.getElementById('app'),
            transparent: false,
        });
        this.renderer.backgroundColor = 0x1D1D1D;

        this.parallaxScroller = new ParallaxScroller();

        PIXI.loader
            .add('assets/sprites/spaceship.json')
            .add('farBackground', 'assets/images/far_background.png')
            .add('closeBackground', 'assets/images/close_background.png')
            .load(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded() {
        this.parallaxScroller.init(this.stage);

        const spaceshipAnimationFrames = [];

        for (let i = 0; i < 4; i++) {
            spaceshipAnimationFrames.push(PIXI.Texture.fromFrame('spaceship' + i + '.png'));
        }

        const spaceshipAnimation = new PIXI.extras.AnimatedSprite(spaceshipAnimationFrames);
        spaceshipAnimation.animationSpeed = 0.3;
        spaceshipAnimation.play();
        this.stage.addChild(spaceshipAnimation);

        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        this.renderer.render(this.stage);
        requestAnimationFrame(this.update.bind(this));
    }
}

Main.SCROLL_SPEED = 2;