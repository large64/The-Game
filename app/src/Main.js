import * as PIXI from 'pixi.js';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';
import Player from "./AnimatedSprites/Player";
import Helpers from './Helpers';
import KeyHandler from "./KeyHandler";
import RocketObjectPool from "./RocketObjectPool";

export default class Main {
    constructor() {
        this.app = new PIXI.Application({
            width: Config.WINDOW_WIDTH,
            height: Config.WINDOW_HEIGHT
        });

        this.stage = this.app.stage;

        this.parallaxScroller = new ParallaxScroller();
        this.player = null;
        this.visibleRockets = [];
        this.rocketObjectPool = null;

        PIXI.loader
            .add('assets/sprites/spaceship.json')
            .add('assets/sprites/rocket.json')
            .add('farBackground', 'assets/images/far_background.png')
            .add('closeBackground', 'assets/images/close_background.png')
            .load(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded() {
        this.rocketObjectPool = new RocketObjectPool();
        this.parallaxScroller.init(this.stage);
        this.app.renderer.backgroundColor = 0x2E2E2E;

        this.player = new Player(Helpers.collectAnimatedSpriteFrames(4, 'spaceship', 'png'));
        this.setSpaceHandler();

        this.stage.addChild(this.player);

        document.body.appendChild(this.app.view);
        this.app.ticker.add(() => this.update());
    }

    update() {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        this.handlePlayerMovement();
        this.handleRocketMovement();
    }

    setSpaceHandler() {
        let spaceKeyHandler = new KeyHandler(32);
        spaceKeyHandler.onPress = () => this.fireRocket();
    }

    fireRocket() {
        const rocket = this.rocketObjectPool.borrow();
        if (rocket) {
            rocket.position.y = this.player.position.y + this.player.height - rocket.height;
            rocket.position.x = this.player.position.x;
            this.stage.addChild(rocket);
            this.visibleRockets.push(rocket);
        }
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

    handleRocketMovement() {
        for (let i = 0; i < this.visibleRockets.length; i++) {
            const rocket = this.visibleRockets[i];
            rocket.position.x += rocket.vx;

            if (rocket.position.x > Config.WINDOW_WIDTH) {
                this.visibleRockets.splice(i, 1);
                this.stage.removeChild(rocket);
                this.rocketObjectPool.handBack(rocket);
            }
        }
    }
}

Main.SCROLL_SPEED = 5;