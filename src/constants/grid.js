/**
 * WGS84 extent for whole world
 * Corners [leftBottom, rightUpper]
 */
const LEVEL_BOUNDARIES = [[-180, -90], [180,90]];

/**
 * Base size in degrees for level 0 [Tile,Tile]
 */
const BASE_SIZE = 180;

/**
 * Returns [[LeftBottom], [RightTop]] extent coordinates
 */
const getGridExtent = () => {
	return [[...LEVEL_BOUNDARIES[0]], [...LEVEL_BOUNDARIES[1]]];
}

const EARTH_CIRCUIT = 40075000 //in meters

//Tile size in degrees
const LEVEL_0_TILE_SIZE = BASE_SIZE / 2;

//size of tile in pixels
const PIXEL_TILE_SIZE = 250;

//resolutions
//Resolution is number of meters displayed inone pixel.

// Maximum resolution for level 0. Level 0 has two tiles of size 180° x 180°
const maxResolution = EARTH_CIRCUIT / PIXEL_TILE_SIZE;
const resolutions = []
const levels = 25;
for (let i = 0; i < levels; ++i) {
	resolutions[i] = maxResolution / Math.pow(2, i + 1);
}

export default {
	getGridExtent,
	BASE_SIZE,
	LEVEL_BOUNDARIES,
	LEVEL_0_TILE_SIZE,
	resolutions,
}