import * as PIXI from 'pixi.js';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';

export default class Main {
    constructor() {
        this.stage = new PIXI.Container();
        this.renderer = PIXI.autoDetectRenderer(Config.WINDOW_WIDTH, Config.WINDOW_HEIGHT, {
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

    static createAnimationFromFrames(numberOfFrames, imageName, imageExtension) {
        const frames = [];

        for (let i = 0; i < numberOfFrames; i++) {
            frames.push(PIXI.Texture.fromFrame(imageName + i + '.' + imageExtension));
        }

        return new PIXI.extras.AnimatedSprite(frames);
    }

    onAssetsLoaded() {
        this.parallaxScroller.init(this.stage);

        const spaceshipAnimation = Main.createAnimationFromFrames(4, 'spaceship', 'png');
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