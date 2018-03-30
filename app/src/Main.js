import * as PIXI from 'pixi.js';
import * as PIXI_PARTICLES from 'pixi-particles';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';
import Player from "./AnimatedSprites/Player";
import Helpers from './Helpers';
import KeyHandler from "./KeyHandler";
import RocketObjectPool from "./ObjectPools/RocketObjectPool";
import SpaceshipEnemyObjectPool from './ObjectPools/SpaceshipEnemyObjectPool';
import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";
import Rocket from "./AnimatedSprites/Rocket";

export default class Main {
    constructor() {
        this.app = new PIXI.Application({
            width: Config.WINDOW_WIDTH,
            height: Config.WINDOW_HEIGHT
        });

        this.stage = this.app.stage;

        this.parallaxScroller = new ParallaxScroller();
        this.player = null;
        this.gameOverScene = null;
        this.gameState = null;
        this.spaceShipEnemySpawnerIntervalId = null;

        this.objectPools = {};

        Helpers.loadAssets(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded() {
        this.gameOverScene = Helpers.getGameOverScene(this.restartGame.bind(this));
        this.gameOverScene.visible = false;

        this.objectPools = {
            'rockets': new RocketObjectPool(),
            'spaceshipEnemies': new SpaceshipEnemyObjectPool()
        };

        this.parallaxScroller.init(this.stage);

        this.app.renderer.backgroundColor = 0x2E2E2E;

        this.player = new Player(Helpers.collectAnimatedSpriteFrames(4, 'spaceship', 'png'));
        this.addParticleContainers();
        this.setSpaceButtonHandler();
        this.setSpaceshipEnemySpawner();

        this.stage.addChild(this.gameOverScene);
        this.stage.addChild(this.player);

        document.body.appendChild(this.app.view);

        this.gameState = this.playState;
        this.app.ticker.add(() => this.update());
    }

    update() {
        this.gameState();
    }

    restartGame() {
        this.objectPools.spaceshipEnemies.startMovementRandomizers();

        this.gameOverScene.visible = false;
        this.setSpaceshipEnemySpawner();
        this.player.resetPosition();

        this.stage.addChild(this.player);
        this.gameState = this.playState;
    }

    setSpaceshipEnemySpawner() {
        this.spaceShipEnemySpawnerIntervalId = setInterval(
            this.addSpaceshipEnemy.bind(this),
            Config.ENEMY_SPAWN_INTERVAL_SECONDS * 1000
        );
    }

    setSpaceButtonHandler() {
        let spaceKeyHandler = new KeyHandler(32);
        spaceKeyHandler.onPress = () => this.fireRocket();
    }

    fireRocket() {
        const rocket = this.objectPools.rockets.borrow();

        if (!rocket) {
            return;
        }

        rocket.position.y = this.player.position.y + this.player.height - rocket.height;
        rocket.position.x = this.player.position.x;
        this.stage.addChild(rocket);
    }

    addSpaceshipEnemy() {
        const spaceshipEnemy = this.objectPools.spaceshipEnemies.borrow();

        if (!spaceshipEnemy) {
            return;
        }

        spaceshipEnemy.position.y = Helpers.getRandomInteger(
            spaceshipEnemy.height,
            Config.WINDOW_HEIGHT - spaceshipEnemy.height
        );
        spaceshipEnemy.position.x = Config.WINDOW_WIDTH;
        this.stage.addChild(spaceshipEnemy);
    }

    playState() {
        this.parallaxScroller.moveViewportXBy(Main.SCROLL_SPEED);
        const visibleSpaceshipEnemies = this.stage.children.filter(
            (filteredChild) => filteredChild.constructor === SpaceshipEnemy
        );

        this.player.handleMovement();
        this.handlePlayerCollision(visibleSpaceshipEnemies);
        this.player.updateParticleContainerPosition();

        for (let i = 0; i < this.stage.children.length; i++) {
            const child = this.stage.children[i];

            if (!child) {
                return;
            }

            switch (child.constructor) {
                case Rocket:
                    this.handleRocketMovement(child);
                    this.handleRocketCollision(child, visibleSpaceshipEnemies);
                    break;
                case SpaceshipEnemy:
                    this.handleSpaceshipEnemyMovement(child);
                    child.updateParticleContainerPosition();
                    break;
            }
        }
    }

    endState() {
        this.gameOverScene.visible = true;
        clearInterval(this.spaceShipEnemySpawnerIntervalId);
        this.objectPools.spaceshipEnemies.stopMovementRandomizers();
        Helpers.emptyStage(this.stage, this.objectPools);
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

        spaceshipEnemy.position.y += spaceshipEnemy.pixelsToMoveVertically;
    }

    handleRocketCollision(rocket, spaceshipEnemies) {
        for (let i = 0; i < spaceshipEnemies.length; i++) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (Helpers.hitTestRectangle(rocket, spaceshipEnemy)) {
                spaceshipEnemy.emitter.emit = true;
                this.removeSprite(spaceshipEnemy, 'spaceshipEnemies');
                this.removeSprite(rocket, 'rockets');
            }
        }
    }

    handlePlayerCollision(spaceshipEnemies) {
        for (let i = 0; i < spaceshipEnemies.length; i++) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (Helpers.hitTestRectangle(this.player, spaceshipEnemy)) {
                this.player.emitter.emit = true;
                spaceshipEnemy.emitter.emit = true;
                this.stage.removeChild(this.player);
                this.removeSprite(spaceshipEnemy, 'spaceshipEnemies');
                this.gameState = this.endState;
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

        this.stage.addChild(this.player.particleContainer);
    }
}

Main.SCROLL_SPEED = 3;
Main.GAME_MODE = 1;
