# Toss Toss The Game

**Toss Toss** is a web game application. Inspired by the dice gambling game in Kingdom Come: Deliverance. Both share the same rules, but Toss Toss makes it possible to play with your friends online or in "hot-seat" mode.
[Click and Play!](https://kdc-dice-game.web.app)

## Key development features:

-  This is a **Vue.js web app**, made using newest Vue API features, such as **Vue 3**, **Composition API**, **Vuex** and **Vue Router**.
-  **Firebase Hosting, Firestore and Cloud Functions** – Hosting website, and synchronizing online game data.
-  Additional npm dependencies: **\*animejs**, copy-to-clipboard, goby, lodash, vue-global-events\*.

## Game Rules:

Toss Toss is a 2-player game, the first one to reach the specified amount of points wins (normally 2000).

Both players take turns playing.

One's turn ends either by:

1. _Passing the turn and keeping the earned round score._
2. _Getting a 'bust' by rolling and not having any scoring dice._

Points are gained for every 1 or 5 thrown, and for three or more of a kind of any other number. Scoring is as follows:

-  _a single **1** is worth 100 points_
-  _a single **5** is worth 50 points_
-  _**three of a kind** is worth 100 points multiplied by the given number, e.g. three 4s are worth 400 points_
-  _**three 1's** are worth 1,000 points_
-  _**four or more of a kind** is worth double the points of three of a kind, so four 4s are worth 800 points, five 4s are worth 1,600 points etc._

## Download and install locally

1. Download the repository files.
2. install dependencies using node packet manager (npm).

```bash
npm install
```

### Serve

Creates local development server on _localhost:8080_

```bash
npm run serve
```

### Build

```bash
npm run build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
