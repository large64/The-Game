export default class Button extends PIXI.Sprite {
    constructor(text, width, height, positionX, positionY) {
        super();

        this.position.x = positionX;
        this.position.y = positionY;

        this.text = new PIXI.Text(text, {
            fontFamily: 'Futura',
            fontSize: 25,
            fill: 0x808080,
            cursor: 'pointer',
            align: 'center'
        });

        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x000000, 1);
        this.graphics.drawRect(0, 0, width, height);
        this.graphics.endFill();

        this.text.position.x = this.graphics.width / 2 - this.text.width / 2;
        this.text.position.y = this.graphics.height / 2 - this.text.height / 2;

        this.texture = this.graphics.generateCanvasTexture();

        this.addChild(this.text);

        this.interactive = true;
        this.buttonMode = true;

        this.on("mousedown", () => {
            this.onDown();
        });

        this.on("mouseup", () => {
            this.onUp();
        });

        this.on("mouseover", () => {
            this.onHover();
        });

        this.on("mouseout", () => {
            this.onOut();
        });
    }

    onDown() {
        this.y += 3;
    }

    onUp() {
        this.y -= 3;
    }

    onHover() {
        this.text.style.fill = 0xffffff;
    }

    onOut() {
        this.text.style.fill = 0x808080;
    }
}
