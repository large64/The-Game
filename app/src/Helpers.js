import * as PIXI from "pixi.js";

export default class Helpers {
    static collectAnimatedSpriteFrames(numberOfFrames, imageName, imageExtension) {
        const frames = [];

        for (let i = 0; i < numberOfFrames; i++) {
            frames.push(PIXI.Texture.fromFrame(imageName + i + '.' + imageExtension));
        }

        return frames;
    }

    static loadAssets(onReadyCallback) {
        PIXI.loader
            .add('assets/sprites/spaceship.json')
            .add('assets/sprites/spaceship_enemy.json')
            .add('assets/sprites/rocket.json')
            .add('farBackground', 'assets/images/far_background.png')
            .add('closeBackground', 'assets/images/close_background.png')
            .load(onReadyCallback);
    }
}