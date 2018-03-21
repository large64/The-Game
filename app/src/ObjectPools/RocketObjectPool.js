import Helpers from "../Helpers";
import Rocket from "../AnimatedSprites/Rocket";

export default class RocketObjectPool {
    constructor() {
        this.items = [];
        for (let i = 0; i < 10; i++) {
            const rocketFrames = Helpers.collectAnimatedSpriteFrames(7, 'rocket', 'png');
            const rocket = new Rocket(rocketFrames);
            this.items.push(rocket);
        }
    }

    borrow() {
        return this.items.shift();
    }

    handBack(item) {
        this.items.push(item);
    }
}
