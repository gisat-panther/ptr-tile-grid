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

//size of tile in pixels
const PIXEL_TILE_SIZE = 250;

//Resolutions
//Resolution is number of meters displayed in one pixel (m/px).

// Maximum resolution on equator. 
const maxResolution = EARTH_CIRCUIT / PIXEL_TILE_SIZE / 2;
const resolutions = []
const levels = 25;
for (let i = 0; i < levels; ++i) {
	resolutions[i] = maxResolution / Math.pow(2, i);
}

export default {
	getGridExtent,
	BASE_SIZE,
	LEVEL_BOUNDARIES,
	PIXEL_TILE_SIZE,
	resolutions,
}
