export default class KeyHandler {
    constructor(keyCode) {
        this.keyCode = keyCode;
        this.isDown =  false;
        this.isUp=  true;
        this.onPress = undefined;
        this.onRelease = undefined;

        window.addEventListener(
            'keydown', this.downHandler.bind(this), false
        );
        window.addEventListener(
            "keyup", this.upHandler.bind(this), false
        );
    }

    downHandler(event) {
        if (event.keyCode === this.keyCode) {
            if (this.isUp && this.onPress) this.onPress();
            this.isDown = true;
            this.isUp = false;
        }
        event.preventDefault();
    }

    upHandler(event) {
        if (event.keyCode === this.keyCode) {
            if (this.isDown && this.onRelease) this.onRelease();
            this.isDown = false;
            this.isUp = true;
        }
        event.preventDefault();
    }

    static setSpaceButtonHandler(callback) {
        let spaceKeyHandler = new KeyHandler(32);
        spaceKeyHandler.onPress = () => callback();
    }

    static setPbuttonHandler(callback) {
        let pButtonHandler = new KeyHandler(80);
        pButtonHandler.onPress = () => callback();
    }
}
