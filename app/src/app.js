import * as PIXI from 'pixi.js';

document.addEventListener('DOMContentLoaded', (event) => {
    const app = new PIXI.Application(800, 600, {backgroundColor: 'black'});
    document.body.appendChild(app.view);
});
