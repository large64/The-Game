import FarBackgroundLayer from './FarBackgroundLayer';
import * as PIXI from "pixi.js";

export default class ParallaxScroller {
    constructor() {
        this.farBackgroundLayer = null;
        this.viewportX = 0;
    }

    init(stage) {
        const farBackgroundTexture = PIXI.loader.resources['farBackground'].texture;
        this.farBackgroundLayer = new FarBackgroundLayer(farBackgroundTexture);
        stage.addChild(this.farBackgroundLayer);
    }

    setViewportX(viewportX) {
        this.viewportX = viewportX;
        this.farBackgroundLayer.setViewportX(viewportX);
    }

    getViewportX() {
        return this.viewportX;
    }

    moveViewportXBy(units) {
        const newViewportX = this.viewportX + units;
        this.setViewportX(newViewportX);
    }
}