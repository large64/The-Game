import Helpers from "../Helpers";
import Rocket from "../AnimatedSprites/Rocket";
import ObjectPool from "./ObjectPool";

export default class RocketObjectPool extends ObjectPool {
    constructor() {
        super();
        for (let i = 0; i < RocketObjectPool.ITEMS_LENGTH; i++) {
            const rocketFrames = Helpers.collectAnimatedSpriteFrames(7, 'rocket', 'png');
            const rocket = new Rocket(rocketFrames);
            this.items.push(rocket);
        }
    }
}

RocketObjectPool.ITEMS_LENGTH = 3;
