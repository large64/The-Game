# THE GAME

## For Developers

### Setting Up The Environment

#### Using Docker

You may want to use Docker to set up your local environment. To do so,
create a file named `docker-compose.override.yml`. You can read more
about the override file [here](https://docs.docker.com/compose/extends/).

If you want to set only the port of your http server the game will run on,
paste the following into your override file:

```yaml
version: '3'
services:
  http-server:
    ports:
      - "9000:8080"
```

This way you will reach the application at `localhost:9000`.

Now open a terminal, navigate to the root of this project and run
```bash
./helpers/npm install
```

_Helper scripts usually run your command inside a docker container._

Then you can use the following npm scripts:

* this one compiles the application in a way that you can easily debug it:
```bash
./helpers/npm run development
```

* the next one is almost the same, except that it keeps watching for file
changes and automatically triggers a build if needed:
```bash
./helpers/npm run watch
```

* if you want to build an artifact for production, run:
```bash
./helpers/npm run production
```

It is time to actually see the application in a browser! Run the following
command to start an http server:
```bash
./helpers/npm run http-server
```

### Without Docker

To run the application without using Docker containers, you should have
[node.js](https://nodejs.org) (^9.8.0) installed on your machine.

Use the npm scripts above without `./helpers/` prefix.

## For Players

To start the game, wait for the main menu to load. Press any of the GAME
buttons, except EXIT. Use up, down, left and right arrow keys to control
your spaceship, press space to fire a rocket.
