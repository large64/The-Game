import * as PIXI from "pixi.js";

import FarBackgroundLayer from './FarBackgroundLayer';
import CloseBackgroundLayer from "./CloseBackgroundLayer";

export default class ParallaxScroller {
    constructor() {
        this.farBackgroundLayer = null;
        this.closeBackgroundLayer = null;
        this.viewportX = 0;
    }

    init(stage) {
        const farBackgroundTexture = PIXI.loader.resources['farBackground'].texture;
        this.farBackgroundLayer = new FarBackgroundLayer(farBackgroundTexture, ParallaxScroller.DELTA_X_FAR);

        const closeBackgroundTexture = PIXI.loader.resources['closeBackground'].texture;
        this.closeBackgroundLayer= new CloseBackgroundLayer(closeBackgroundTexture, ParallaxScroller.DELTA_X_CLOSE);

        stage.addChild(this.farBackgroundLayer);
        stage.addChild(this.closeBackgroundLayer);
    }

    setViewportX(viewportX) {
        this.viewportX = viewportX;
        this.farBackgroundLayer.setViewportX(viewportX);
        this.closeBackgroundLayer.setViewportX(viewportX);
    }

    moveViewportXBy(units) {
        const newViewportX = this.viewportX + units;
        this.setViewportX(newViewportX);
    }
}

ParallaxScroller.DELTA_X_FAR = 0.64;
ParallaxScroller.DELTA_X_CLOSE = 0.128;