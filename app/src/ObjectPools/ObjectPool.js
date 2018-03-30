export default class ObjectPool {
    constructor() {
        this.items = [];
    }

    borrow() {
        return this.items.shift();
    }

    handBack(item) {
        this.items.push(item);
    }
}
