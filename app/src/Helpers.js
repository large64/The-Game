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

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     */
    static getRandomInteger(minimumValue, maximumValue) {
        minimumValue = Math.ceil(minimumValue);
        maximumValue = Math.floor(maximumValue);

        return Math.floor(Math.random() * (maximumValue - minimumValue + 1)) + minimumValue;
    }
}