# Loloof64's Chessboard component

A dynamic chess board

## Properties

| name      | description              | type       | default value                                            |
| --------- | ------------------------ | ---------- | -------------------------------------------------------- |
| size      | Size in px               | number     | 200.0                                                    |
| position  | Position in FEN notation | string     | rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 |
| reversed  | Is black side down ?     | boolean    | false                                                    |

## Do not forget !

* You must import the assets from the folder $project/assets/vectors
* You must install and configure the mobile-drap-drop package :

```
$ npm install mobile-drag-drop
```

Inside polyfill.ts, add, at the end of browser polyfills section :

```
import {polyfill} from 'mobile-drag-drop';

polyfill();
```

## Credits

This component use assets from Wikimedia Commons, and designed by Cburnett.