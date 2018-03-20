import * as PIXI from "pixi.js";

export default class Helpers {
    static collectAnimatedSpriteFrames(numberOfFrames, imageName, imageExtension) {
        const frames = [];

        for (let i = 0; i < numberOfFrames; i++) {
            frames.push(PIXI.Texture.fromFrame(imageName + i + '.' + imageExtension));
        }

        return frames;
    }
}