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
export default {
	getGridExtent,
	BASE_SIZE,
}