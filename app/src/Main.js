import * as PIXI from 'pixi.js';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';
import KeyHandler from "./KeyHandler";

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
        this.player = spaceshipAnimation;
        this.player.vx = 0;
        this.player.vy = 0;
        this.handlePlayerMovement();

        this.stage.addChild(spaceshipAnimation);

        document.body.appendChild(this.app.view);
        this.app.ticker.add((delta) => this.update(delta));
    }

    update(delta) {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        this.player.position.x += this.player.vx;
        this.player.position.y += this.player.vy;
    }

    handlePlayerMovement() {
        const upKeyHandler = new KeyHandler(38);
        const downKeyHandler = new KeyHandler(40);
        const rightKeyHandler = new KeyHandler(39);
        const leftKeyHandler = new KeyHandler(37);

        upKeyHandler.onPress = () => {
            this.player.vy = -5;
        };

        upKeyHandler.onRelease = () => {
            if (!downKeyHandler.isDown) {
                this.player.vy = 0;
            }
        };

        downKeyHandler.onPress = () => {
            this.player.vy = 5;
        };

        downKeyHandler.onRelease = () => {
            if (!upKeyHandler.isDown) {
                this.player.vy = 0;
            }
        };

        rightKeyHandler.onPress = () => {
            this.player.vx = 5;
        };

        rightKeyHandler.onRelease = () => {
            if (!leftKeyHandler.isDown) {
                this.player.vx = 0;
            }
        };

        leftKeyHandler.onPress = () => {
            this.player.vx = -5;
        };

        leftKeyHandler.onRelease = () => {
            if (!rightKeyHandler.isDown) {
                this.player.vx = 0;
            }
        };
    }
}

Main.SCROLL_SPEED = 5;