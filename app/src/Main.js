import * as PIXI from 'pixi.js';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';
import Player from "./Player";

export default class Main {
    constructor() {
        this.app = new PIXI.Application({
            width: Config.WINDOW_WIDTH,
            height: Config.WINDOW_HEIGHT
        });

        this.stage = this.app.stage;

        this.parallaxScroller = new ParallaxScroller();
        this.player = null;

        PIXI.loader
            .add('assets/sprites/spaceship.json')
            .add('farBackground', 'assets/images/far_background.png')
            .add('closeBackground', 'assets/images/close_background.png')
            .load(this.onAssetsLoaded.bind(this));
    }

    createPlayerSprite(numberOfFrames, imageName, imageExtension) {
        const frames = [];

        for (let i = 0; i < numberOfFrames; i++) {
            frames.push(PIXI.Texture.fromFrame(imageName + i + '.' + imageExtension));
        }

        this.player = new Player(frames);
    }

    onAssetsLoaded() {
        this.parallaxScroller.init(this.stage);

        this.createPlayerSprite(4, 'spaceship', 'png');
        this.stage.addChild(this.player);

        document.body.appendChild(this.app.view);
        this.app.ticker.add((delta) => this.update(delta));
    }

    update(delta) {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        this.player.position.x += this.player.vx;
        this.player.position.y += this.player.vy;
    }
}

Main.SCROLL_SPEED = 5;