import * as PIXI from 'pixi.js';

document.addEventListener('DOMContentLoaded', (event) => {
    let app = new PIXI.Application(800, 600, {transparent: true});
    document.body.appendChild(app.view);

    PIXI.loader
        .add('assets/images/kitten.png')
        .load(setup);

    function setup() {
        let kitten = new PIXI.Sprite(PIXI.loader.resources['assets/images/kitten.png'].texture);
        app.stage.addChild(kitten);
    }
});
