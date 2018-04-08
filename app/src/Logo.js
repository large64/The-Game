export default class Logo extends PIXI.Sprite {
    constructor() {
        super();

        this.width = 350;
        this.height = 150;

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, this.width, this.height);
        graphics.endFill();

        const text = new PIXI.Text('THE GAME', {
            fontFamily: 'Futura',
            fontSize: 36,
            fill: 0xFFFFFF,
        });

        text.position.x = this.width / 2 - text.width / 2;
        text.position.y = this.height / 2 - text.height / 2;

        this.texture = graphics.generateCanvasTexture();

        this.addChild(text);
    }
}
