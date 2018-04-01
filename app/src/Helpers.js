export default class Helpers {
    static collectAnimatedSpriteFrames(numberOfFrames, imageName, imageExtension) {
        const frames = [];

        for (let i = 0; i < numberOfFrames; i++) {
            frames.push(PIXI.Texture.fromFrame(imageName + i + '.' + imageExtension));
        }

        return frames;
    }

    static loadAssets(onReadyCallback) {
        PIXI.loader
            .add('splashScreen', 'assets/images/splash_screen.png')
            .add('assets/sprites/spaceship.json')
            .add('assets/sprites/spaceship_enemy.json')
            .add('assets/sprites/rocket.json')
            .add('spaceshipEnemyParticle', 'assets/images/spaceship_enemy_particle.png')
            .add('spaceshipParticle', 'assets/images/spaceship_particle.png')
            .add('farBackground', 'assets/images/far_background.png')
            .add('closeBackground', 'assets/images/close_background.png')
            .load(onReadyCallback);
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
     */
    static getRandomInteger(minimumValue, maximumValue) {
        minimumValue = Math.ceil(minimumValue);
        maximumValue = Math.floor(maximumValue);

        return Math.floor(Math.random() * (maximumValue - minimumValue + 1)) + minimumValue;
    }

    /**
     * @see https://github.com/kittykatattack/learningPixi#collision
     */
    static hitTestRectangle(r1, r2) {
        //Define the variables we'll need to calculate
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        //hit will determine whether there's a collision
        hit = false;
        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;
        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;
        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;
        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {
            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {
                //There's definitely a collision happening
                hit = true;
            } else {
                //There's no collision on the y axis
                hit = false;
            }
        } else {
            //There's no collision on the x axis
            hit = false;
        }
        //`hit` will be either `true` or `false`
        return hit;
    };
}
