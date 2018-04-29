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
import EnemySpriteSpawner from "./SpriteSpawners/SpaceshipEnemySpriteSpawner";
import EventListeners from "./EventListeners";
import GameStateManager from "./GameStateManager";

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

        this.spaceShipEnemySpawner = null;

        this.objectPools = {};

        Helpers.loadAssets(this.onAssetsLoaded.bind(this));
        const eventListeners = new EventListeners();
        eventListeners.register.bind(this).call();
    }

    onAssetsLoaded() {
        this.parallaxScroller.init(this.stage);
        this.mainScreenScene = SceneHandler.getMainScreenScene();
        this.gameOverScene = SceneHandler.getGameOverScene();
        this.splashScene = SceneHandler.getSplashScreenScene(() => {
            this.mainScreenScene.visible = true;
            this.gameState = GameStateManager.mainScreenState.bind(this);
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
        KeyHandler.setSpaceButtonHandler(this.fireRocket.bind(this));
        KeyHandler.setPbuttonHandler(this.togglePauseGame.bind(this));

        this.stage.addChild(this.mainScreenScene);
        this.stage.addChild(this.gameOverScene);
        this.stage.addChild(this.splashScene);
        this.stage.addChild(this.pauseScene);
        this.spaceShipEnemySpawner = new EnemySpriteSpawner(this.stage, this.objectPools.spaceshipEnemies);
        document.getElementById('app').appendChild(this.app.view);

        this.gameState = GameStateManager.actionManagerUpdateState.bind(this);
        this.app.ticker.add(() => this.update());
    }

    update() {
        this.gameState();
    }

    togglePauseGame() {
        if (GameStateManager.getCurrentState() === GameStateManager.PLAY_STATE) {
            this.gameState = GameStateManager.pauseState.bind(this);
            this.pauseScene.visible = true;
            this.spaceShipEnemySpawner.stop();
            return;
        }

        if (GameStateManager.getCurrentState() === GameStateManager.PAUSED_STATE) {
            this.spaceShipEnemySpawner.start();
            this.pauseScene.visible = false;
            this.gameState = GameStateManager.playState.bind(this);
        }
    }

    fireRocket() {
        if (GameStateManager.getCurrentState() !== GameStateManager.PLAY_STATE) {
            return;
        }

        const rocket = this.objectPools.rockets.borrow();

        if (!rocket) {
            return;
        }

        rocket.fire(this.stage, this.player);
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
}

Main.SCROLL_SPEED = 3;
