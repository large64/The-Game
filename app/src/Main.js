import * as PIXI from 'pixi.js';
import * as PIXI_PARTICLES from 'pixi-particles';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';
import Player from "./AnimatedSprites/Player";
import Helpers from './Helpers';
import KeyHandler from "./KeyHandler";
import RocketObjectPool from "./ObjectPools/RocketObjectPool";
import SpaceshipEnemyObjectPool from './ObjectPools/SpaceshipEnemyObjectPool';
import Rocket from "./AnimatedSprites/Rocket";
import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";

export default class Main {
    constructor() {
        this.app = new PIXI.Application({
            width: Config.WINDOW_WIDTH,
            height: Config.WINDOW_HEIGHT
        });

        this.stage = this.app.stage;

        this.parallaxScroller = new ParallaxScroller();
        this.player = null;

        this.objectPools = {};

        Helpers.loadAssets(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded() {
        this.objectPools = {
            'rockets': new RocketObjectPool(),
            'spaceshipEnemies': new SpaceshipEnemyObjectPool()
        };

        this.parallaxScroller.init(this.stage);
        this.addParticleContainers();

        this.app.renderer.backgroundColor = 0x2E2E2E;

        this.player = new Player(Helpers.collectAnimatedSpriteFrames(4, 'spaceship', 'png'));
        this.setSpaceHandler();
        this.setSpaceshipEnemySpawner();

        this.stage.addChild(this.player);

        document.body.appendChild(this.app.view);

        this.app.ticker.add(() => this.update());
    }

    update() {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        this.handlePlayerMovement();

        for (let i = 0; i < this.stage.children.length; i++) {
            const child = this.stage.children[i];

            if (!child) {
                return;
            }

            switch (child.constructor) {
                case Rocket:
                    this.handleRocketMovement(child);
                    this.handleRocketCollision(child, this.stage.children.filter((filteredChild) => filteredChild.constructor === SpaceshipEnemy));
                    break;
                case SpaceshipEnemy:
                    this.handleSpaceshipEnemyMovement(child);
                    child.updateParticleContainerPosition();
                    break;
            }
        }
    }

    setSpaceshipEnemySpawner() {
        setInterval(this.addSpaceshipEnemy.bind(this), Config.ENEMY_SPAWN_INTERVAL_SECONDS * 1000);
    }

    setSpaceHandler() {
        let spaceKeyHandler = new KeyHandler(32);
        spaceKeyHandler.onPress = () => this.fireRocket();
    }

    fireRocket() {
        const rocket = this.objectPools.rockets.borrow();
        if (rocket) {
            rocket.position.y = this.player.position.y + this.player.height - rocket.height;
            rocket.position.x = this.player.position.x;
            this.stage.addChild(rocket);
        }
    }

    addSpaceshipEnemy() {
        const spaceshipEnemy = this.objectPools.spaceshipEnemies.borrow();
        if (spaceshipEnemy) {
            spaceshipEnemy.position.y = Helpers.getRandomInteger(
                spaceshipEnemy.height,
                Config.WINDOW_HEIGHT - spaceshipEnemy.height
            );
            spaceshipEnemy.position.x = Config.WINDOW_WIDTH;
            this.stage.addChild(spaceshipEnemy);
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

    handleRocketMovement(rocket) {
        rocket.position.x += rocket.vx;

        if (rocket.position.x > Config.WINDOW_WIDTH) {
            this.removeSprite(rocket, 'rockets');
        }
    }

    handleSpaceshipEnemyMovement(spaceshipEnemy) {
        spaceshipEnemy.position.x += spaceshipEnemy.vx;

        if (spaceshipEnemy.position.x < 0 - spaceshipEnemy.width) {
            this.removeSprite(spaceshipEnemy, 'spaceshipEnemies');
        }
    }

    handleRocketCollision(rocket, spaceShipEnemies) {
        for (let i = 0; i < spaceShipEnemies.length; i++) {
            const spaceshipEnemy = spaceShipEnemies[i];
            if (Helpers.hitTestRectangle(rocket, spaceshipEnemy)) {
                spaceshipEnemy.emitter.emit = true;
                this.removeSprite(spaceshipEnemy, 'spaceshipEnemies');
                this.removeSprite(rocket, 'rockets');
            }
        }
    }

    removeSprite(sprite, objectPool) {
        this.stage.removeChild(sprite);
        this.objectPools[objectPool].handBack(sprite);
    }

    addParticleContainers() {
        for (let i = 0; i < this.objectPools.spaceshipEnemies.items.length; i++) {
            const spaceshipEnemy = this.objectPools.spaceshipEnemies.items[i];
            this.stage.addChild(spaceshipEnemy.particleContainer);
        }
    }
}

Main.SCROLL_SPEED = 3;
