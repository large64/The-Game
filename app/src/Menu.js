import Config from "./Config";
import Button from "./Button";

export default class Menu extends PIXI.Container {
    constructor(buttonWidth, buttonHeight, buttonMarginBottom, firstButtonPositionY) {
        super();
        this.buttonWidth = buttonWidth;
        this.buttonHeight = buttonHeight;
        this.buttonMarginBottom = buttonMarginBottom;
        this.buttonPositionX = Config.WINDOW_WIDTH / 2 - buttonWidth / 2;
        this.nextButtonPositionY = firstButtonPositionY;
    }

    createButton(buttonText) {
        const button = new Button(
            buttonText,
            this.buttonWidth,
            this.buttonHeight,
            this.buttonPositionX,
            this.nextButtonPositionY
        );

        this.nextButtonPositionY =
            button.position.y
            + this.buttonHeight
            + this.buttonMarginBottom;
        this.addChild(button);

        return button;
    }
}
