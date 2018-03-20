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

    static createPlayerSprite(numberOfFrames, imageName, imageExtension) {
        const frames = [];

        for (let i = 0; i < numberOfFrames; i++) {
            frames.push(PIXI.Texture.fromFrame(imageName + i + '.' + imageExtension));
        }

        return new Player(frames);
    }

    onAssetsLoaded() {
        this.parallaxScroller.init(this.stage);
        this.app.renderer.backgroundColor = 0x2E2E2E;

        this.player = Main.createPlayerSprite(4, 'spaceship', 'png');
        this.stage.addChild(this.player);

        document.body.appendChild(this.app.view);
        this.app.ticker.add(() => this.update());
    }

    update() {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        this.handlePlayerMovement();
    }

    handlePlayerMovement() {
        if (this.player.position.y > 0 && this.player.vy < 0
            || this.player.position.y < (Config.WINDOW_HEIGHT - this.player.height) && this.player.vy > 0) {
            this.player.position.y += this.player.vy;
        }
        if (this.player.position.x > 0 && this.player.vx < 0
            || this.player.position.x < (Config.WINDOW_WIDTH - this.player.width) && this.player.vx > 0) {
            this.player.position.x += this.player.vx;
        }
    }
}

Main.SCROLL_SPEED = 5;