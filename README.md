# ptr-tile-grid

Tile grid for globe. 

Tile grid covers the whole globe. Extent of grid is [bottomLeft, topRight] [[-180,-90], [180, 90]].

It is possible to generate all tiles for a certain level. Zero lavel has two tiles. Tiles count rise quadratic with each level.

```js
import {
    getSizeForLevel,
} from './src/grid';

const grid0 = getGridForLevel(0);
//[ 
//    [[-180,-90], [0,-90]]
//]
const grid1 = getGridForLevel(1);
//[
//    [[-180,0], [-90,0], [0,0], [90,0]],
//    [[-180,-90], [-90,-90], [0,-90], [90,-90]]
//]
const grid2 = getGridForLevel(2);
//[
//    [[-180,45], [-135,45], [-90,45], [-45,45], [0,45], [45,45], [90,45], [135,45]],
//    [[-180,0], [-135,0], [-90,0], [-45,0], [0,0], [45,0], [90,0], [135,0]],
//    [[-180,-45], [-135,-45], [-90,-45], [-45,-45], [0,-45], [45,-45], [90,-45], [135,-45]],
//    [[-180,-90], [-135,-90], [-90,-90], [-45,-90], [0,-90], [45,-90], [90,-90], [135,-90]]
// ]
```

## Tile
Tile is spherical square with same site size in degrees. Site size is same for all tiles in same level. Each tile is defined by left bootm longitude latitude.

```js
import {
    getSizeForLevel,
} from './src/grid';

const level0 = getSizeForLevel(0); //180
const level1 = getSizeForLevel(1); //90
const level2 = getSizeForLevel(2); //45
const level3 = getSizeForLevel(3); //22.5
const level4 = getSizeForLevel(4); //11.25
const level5 = getSizeForLevel(5); //5.625
const level6 = getSizeForLevel(6); //2.8125
const level7 = getSizeForLevel(7); //1.40625
const level8 = getSizeForLevel(8); //0.703125
const level9 = getSizeForLevel(9); //0.3515625
const level10 = getSizeForLevel(10); //0.17578125
```
