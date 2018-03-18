import * as PIXI from 'pixi.js';

export default class CloseBackgroundLayer extends PIXI.extras.TilingSprite {
    constructor(texture) {
        super(texture, 800, 600);

        this.position.set(0);
        this.tilePosition.set(0);

        this.viewportX = 0;
    }

    setViewportX(newViewportX) {
        const distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.tilePosition.x -= (distanceTravelled * CloseBackgroundLayer.DELTA_X);
    }
}

CloseBackgroundLayer.DELTA_X = 0.128;