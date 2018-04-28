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
import CollisionHandler from "./CollisionHandler";

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
        this.pauseScene = null;

        this.gameState = null;
        this.spaceShipEnemySpawnerIntervalId = null;

        this.objectPools = {};

        Helpers.loadAssets(this.onAssetsLoaded.bind(this));
        this.registerEventListeners();
    }

    onAssetsLoaded() {
        this.parallaxScroller.init(this.stage);
        this.mainScreenScene = SceneHandler.getMainScreenScene();
        this.gameOverScene = SceneHandler.getGameOverScene();
        this.splashScene = SceneHandler.getSplashScreenScene(() => {
            this.mainScreenScene.visible = true;
            this.gameState = this.mainScreenState;
        });
        this.pauseScene = SceneHandler.getPauseScene();

        this.gameOverScene.visible = false;
        this.mainScreenScene.visible = false;
        this.splashScene.visible = true;
        this.pauseScene.visible = false;

        this.objectPools = {
            'rockets': new RocketObjectPool(),
            'spaceshipEnemies': new SpaceshipEnemyObjectPool()
        };

        this.player = new Player(Helpers.collectAnimatedSpriteFrames(4, 'spaceship', 'png'));
        this.addParticleContainers();
        this.setSpaceButtonHandler();
        this.setPbuttonHandler();

        this.stage.addChild(this.mainScreenScene);
        this.stage.addChild(this.gameOverScene);
        this.stage.addChild(this.splashScene);
        this.stage.addChild(this.pauseScene);
        document.getElementById('app').appendChild(this.app.view);

        this.gameState = Main.actionManagerUpdateState;
        this.app.ticker.add(() => this.update());
    }

    update() {
        this.gameState();
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

    setPbuttonHandler() {
        let pButtonHandler = new KeyHandler(80);
        pButtonHandler.onPress = () => {
            if (this.gameState !== this.pauseState) {
                this.gameState = this.pauseState;
                this.pauseScene.visible = true;
                clearInterval(this.spaceShipEnemySpawnerIntervalId);
                return;
            }

            this.setSpaceshipEnemySpawner();
            this.pauseScene.visible = false;
            this.gameState = this.playState;
        }
    }

    fireRocket() {
        if (this.gameState !== this.playState) {
            return;
        }

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
        CollisionHandler.handlePlayerCollision(visibleSpaceshipEnemies, this.player);
        this.player.updateParticleContainerPosition();

        let i = this.stage.children.length;
        while (i--) {
            const child = this.stage.children[i];

            if (!child) {
                return;
            }

            switch (child.constructor) {
                case Rocket:
                    child.handleMovement();
                    CollisionHandler.handleRocketCollision(child, visibleSpaceshipEnemies);
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

    pauseState() {}

    mainScreenState() {
        const visibleSpaceshipEnemies = this.mainScreenScene.children.filter(
            (filteredChild) => filteredChild.constructor === SpaceshipEnemy
        );

        for (let i = 0; i < visibleSpaceshipEnemies.length; i++) {
            visibleSpaceshipEnemies[i].handleFloatingMovement();
        }
    }

    static actionManagerUpdateState() {
        PIXI.actionManager.update();
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
        let i = this.stage.children.length;

        while (i--) {
            const child = this.stage.children[i];

            if (child instanceof SpaceshipEnemy) {
                this.removeSprite(child, 'spaceshipEnemies');
            }

            if (child instanceof Rocket) {
                this.removeSprite(child, 'rockets');
            }
        }
    }

    registerEventListeners() {
        document.addEventListener('start', () => {
            this.parallaxScroller.setVisibility(true);
            this.objectPools.spaceshipEnemies.startMovementRandomizers();
            this.mainScreenScene.visible = false;
            this.gameOverScene.visible = false;
            this.gameState = this.playState;
            this.player.resetPosition();
            this.stage.addChild(this.player);
            this.setSpaceshipEnemySpawner();
        });

        document.addEventListener('gameOver', () => {
            clearInterval(this.spaceShipEnemySpawnerIntervalId);
            this.gameState = Main.actionManagerUpdateState;
            this.emptyStage();
            this.gameOverScene.visible = true;
            this.objectPools.spaceshipEnemies.stopMovementRandomizers();

            const gameOverFadeOutAction = new PIXI.action.FadeOut(0.5);
            setTimeout(() => {
                const gameOverAction = PIXI.actionManager.runAction(this.gameOverScene, gameOverFadeOutAction);
                gameOverAction.on('end', () => {
                    this.parallaxScroller.setVisibility(false);
                    this.gameOverScene.visible = false;
                    this.gameOverScene.alpha = 1;
                    this.mainScreenScene.visible = true;
                    this.gameState = this.mainScreenState;
                });
            }, 3000);
        });

        document.addEventListener('removeSprite', (event) => {
            const sprites = event.detail.sprites;

            let i = sprites.length;
            while (i--) {
                const spriteData = sprites[i];

                this.stage.removeChild(spriteData.sprite);

                if (spriteData.objectPool === null) {
                    return;
                }

                this.removeSprite(spriteData.sprite, spriteData.objectPool);
            }
        });
    }
}

Main.SCROLL_SPEED = 3;
