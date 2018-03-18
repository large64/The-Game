import * as PIXI from 'pixi.js';

export default class CloseBackgroundLayer extends PIXI.extras.TilingSprite {
    constructor(texture, deltaX) {
        super(texture, 800, 600);

        this.position.set(0);
        this.tilePosition.set(0);

        this.viewportX = 0;
        this.deltaX = deltaX;
    }

    setViewportX(newViewportX) {
        const distanceTravelled = newViewportX - this.viewportX;
        this.viewportX = newViewportX;
        this.tilePosition.x -= (distanceTravelled * this.deltaX);
    }
}
