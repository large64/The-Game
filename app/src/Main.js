import * as PIXI_ACTION from 'pixi-action';

import ParallaxScroller from './ParallaxScroller';
import Config from './Config';
import Player from "./AnimatedSprites/Player";
import Helpers from './Helpers';
import KeyHandler from "./KeyHandler";
import RocketObjectPool from "./ObjectPools/RocketObjectPool";
import SpaceshipEnemyObjectPool from './ObjectPools/SpaceshipEnemyObjectPool';
import SpaceshipEnemy from "./AnimatedSprites/SpaceshipEnemy";
import Rocket from "./AnimatedSprites/Rocket";
import SceneHandler from "./SceneHandler";

export default class Main {
    constructor() {
        this.app = new PIXI.Application({
            width: Config.WINDOW_WIDTH,
            height: Config.WINDOW_HEIGHT
        });
        this.app.renderer.backgroundColor = 0x2E2E2E;

        this.stage = this.app.stage;

        this.parallaxScroller = new ParallaxScroller();
        this.player = null;

        this.gameOverScene = null;
        this.splashScene = null;
        this.mainScreenScene = null;

        this.gameState = null;
        this.spaceShipEnemySpawnerIntervalId = null;

        this.objectPools = {};

        Helpers.loadAssets(this.onAssetsLoaded.bind(this));
    }

    onAssetsLoaded() {
        this.gameOverScene = SceneHandler.getGameOverScene(this.restartGame.bind(this));
        this.mainScreenScene = SceneHandler.getMainScreenScene();
        this.splashScene = SceneHandler.getSplashScreenScene(() => {
            this.mainScreenScene.visible = true;

            //this.parallaxScroller.init(this.stage);
            //this.gameState = this.playState;
            //this.stage.addChild(this.player);
            //this.setSpaceshipEnemySpawner();
        });

        this.gameOverScene.visible = false;
        this.mainScreenScene.visible = false;
        this.splashScene.visible = true;

        this.objectPools = {
            'rockets': new RocketObjectPool(),
            'spaceshipEnemies': new SpaceshipEnemyObjectPool()
        };

        this.player = new Player(Helpers.collectAnimatedSpriteFrames(4, 'spaceship', 'png'));
        this.addParticleContainers();
        this.setSpaceButtonHandler();

        this.stage.addChild(this.gameOverScene);
        this.stage.addChild(this.splashScene);
        this.stage.addChild(this.mainScreenScene);
        document.body.appendChild(this.app.view);

        this.gameState = this.splashScreenState;
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
                    child.handleMovement();
                    this.handleRocketCollision(child, visibleSpaceshipEnemies);
                    if (child.isOutOfScreen()) {
                        this.removeSprite(child, 'rockets');
                    }
                    break;
                case SpaceshipEnemy:
                    child.handleMovement();
                    child.updateParticleContainerPosition();
                    if (child.isOutOfScreen()) {
                        this.removeSprite(child, 'spaceshipEnemies');
                    }
                    break;
            }
        }
    }

    splashScreenState() {
        PIXI.actionManager.update();
    }

    endState() {
        this.stage.removeChild(this.player);
        this.gameOverScene.visible = true;
        clearInterval(this.spaceShipEnemySpawnerIntervalId);
        this.objectPools.spaceshipEnemies.stopMovementRandomizers();
        this.emptyStage(this.stage, this.objectPools);
    }

    mainScreenState() {
        this.mainScreenScene.visisble = true;
    }

    handleRocketCollision(rocket, spaceshipEnemies) {
        for (let i = 0; i < spaceshipEnemies.length; i++) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (rocket.isCollidesWith(spaceshipEnemy)) {
                spaceshipEnemy.emitter.emit = true;
                this.removeSprite(spaceshipEnemy, 'spaceshipEnemies');
                this.removeSprite(rocket, 'rockets');
            }
        }
    }

    handlePlayerCollision(spaceshipEnemies) {
        for (let i = 0; i < spaceshipEnemies.length; i++) {
            const spaceshipEnemy = spaceshipEnemies[i];
            if (this.player.isCollidesWith(spaceshipEnemy)) {
                this.player.emitter.emit = true;
                spaceshipEnemy.emitter.emit = true;
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

    emptyStage() {
        for (let i = 0; i < this.stage.children.length; i++) {
            const child = this.stage.children[i];
            if (child.constructor === SpaceshipEnemy) {
                this.objectPools.spaceshipEnemies.handBack(child);
                this.stage.removeChild(child);
            }

            if (child.constructor === Rocket) {
                this.objectPools.rockets.handBack(child);
                this.stage.removeChild(child);
            }
        }
    }
}

Main.SCROLL_SPEED = 3;
Main.GAME_MODE = 1;
