import * as PIXI from 'pixi.js';

import Config from './Config';

export default class BackgroundLayer extends PIXI.extras.TilingSprite {
    constructor(texture, deltaX) {
        super(texture, Config.WINDOW_WIDTH, Config.WINDOW_HEIGHT);

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
