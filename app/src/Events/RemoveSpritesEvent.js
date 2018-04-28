export default class RemoveSpritesEvent {
    constructor(onElement, spritesToRemove) {
        this.builtInEvent = new CustomEvent('removeSprites', {
            detail: {
                sprites: spritesToRemove
            }
        });

        this.onElement = onElement;
    }

    dispatch() {
        this.onElement.dispatchEvent(this.builtInEvent);
    }
}
