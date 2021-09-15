import {
	isArray as _isArray,
	isFinite as _isFinite,
	without as _without,
} from 'lodash';

import gridConstants from './constants/grid';
import {forEachTileInGridByLevelAndExtent} from './grid';
import LatLon from './dmsHelpers';

/**
 * Round coordinate on 13 decimals
 * @param {*} coordinate
 */
export const roundCoordinate = coordinate => {
	// Cause JS imprecize calculation with numbers we have to round coordinates
	// JS use 64-bit storage fot numbers, so 13 decimals left.
	// https://javascript.info/number#imprecise-calculations
	const decimals = 13;
	if (typeof coordinate == 'number' && isFinite(coordinate)) {
		//round coordinate and convert it to the number
		return +coordinate.toFixed(decimals);
	} else {
		return null;
	}
};

/**
 * Round point coordinates to 13 decimals
 */
export const roundPoint = point => {
	if (
		point &&
		point.length === 2 &&
		typeof point[0] == 'number' &&
		typeof point[1] == 'number'
	) {
		return point.map(roundCoordinate);
	} else {
		return null;
	}
};

/**
 *
 * @param {Array.<Array.<Longitude, Latitude>>} extent Extent is defined by left bottom and right top lon/lat.
 * @returns {string}
 */
export const getExtentID = (extent = gridConstants.LEVEL_BOUNDARIES) => {
	return `${extent[0][0]}${extent[0][1]}${extent[1][0]}${extent[1][1]}`;
};

/**
 * Determinate decimal precision of number
 * @param {Number} number
 * @returns {Number}
 */
export const precision = number => {
	if (!Number.isFinite(number)) {
		return 0;
	}
	let e = 1,
		p = 0;
	while (Math.round(number * e) / e !== number) {
		e *= 10;
		p++;
	}

	return p;
};

export const safeSumming = (num1, num2) => {
	const num1Precision = precision(num1);
	const num2Precision = precision(num1);
	const maxPrecision = Math.max(1, num1Precision, num2Precision);
	const decimalCorrection = Math.pow(10, maxPrecision);
	const intNum1 = num1 * decimalCorrection;
	const intNum2 = num2 * decimalCorrection;
	return (intNum1 + intNum2) / decimalCorrection;
};

export const safeSubtraction = (num1, num2) => {
	const num1Precision = precision(num1);
	const num2Precision = precision(num1);
	const maxPrecision = Math.max(1, num1Precision, num2Precision);
	const decimalCorrection = Math.pow(10, maxPrecision);
	const intNum1 = num1 * decimalCorrection;
	const intNum2 = num2 * decimalCorrection;
	return (intNum1 - intNum2) / decimalCorrection;
};

/**
 * Returns closer divisible that is higher than given number,
 * @param {Number} number
 * @param {Number} divisor
 * @returns {Number}
 */
export const closestDivisibleHigher = (number, divisor) => {
	if (divisor === 0) {
		return number;
	}

	const numberPrecision = precision(number);
	const divisorPrecision = precision(divisor);

	const maxPrecision = Math.max(1, numberPrecision, divisorPrecision);
	const intDecimalCorrection = Math.pow(10, maxPrecision);
	const bigIntNumber = BigInt(Math.round(number * intDecimalCorrection));
	const bigIntDivisor = BigInt(divisor * intDecimalCorrection);

	const bigIntRest = bigIntNumber % bigIntDivisor;

	if (bigIntNumber < 0) {
		return -closestDivisibleLower(Math.abs(number), divisor);
	} else {
		if (bigIntRest !== BigInt(0)) {
			if (bigIntNumber < bigIntDivisor) {
				return parseInt(bigIntDivisor) / intDecimalCorrection;
			} else {
				return (
					parseInt(bigIntNumber + bigIntDivisor - bigIntRest) /
					intDecimalCorrection
				);
			}
		} else {
			return parseInt(bigIntNumber) / intDecimalCorrection;
		}
	}
};

/**
 * Returns closer divisible that is lower than given number,
 * @param {Number} number
 * @param {Number} divisor
 * @returns {Number}
 */
export const closestDivisibleLower = (number, divisor) => {
	if (divisor === 0) {
		return number;
	}

	const numberPrecision = precision(number);
	const divisorPrecision = precision(divisor);

	const maxPrecision = Math.max(1, numberPrecision, divisorPrecision);
	const intDecimalCorrection = Math.pow(10, maxPrecision);
	const bigIntNumber = BigInt(Math.round(number * intDecimalCorrection));
	const bigIntDivisor = BigInt(divisor * intDecimalCorrection);

	if (bigIntNumber < BigInt(0)) {
		return -closestDivisibleHigher(Math.abs(number), divisor);
	} else {
		return (
			parseInt(bigIntNumber - (bigIntNumber % bigIntDivisor)) /
			intDecimalCorrection
		);
	}
};

/**
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {Extent} extent Extent.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @return {boolean} The x, y values are contained in the extent.
 */
export const containsXY = (extent, point) => {
	if (extent && point) {
		return (
			extent[0][0] <= point[0] &&
			point[0] <= extent[1][0] &&
			extent[0][1] <= point[1] &&
			point[1] <= extent[1][1]
		);
	} else {
		return false;
	}
};

/**
 * Check if one extent contains another.
 *
 * An extent is deemed contained if it lies completely within the other extent,
 * including if they share one or more edges.
 *
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 2.
 * @return {boolean} The second extent is contained by or on the edge of the
 *     first.
 */
export const containsExtent = (extent1, extent2) => {
	return (
		extent1[0][0] <= extent2[0][0] &&
		extent2[1][0] <= extent1[1][0] &&
		extent1[0][1] <= extent2[0][1] &&
		extent2[1][1] <= extent1[1][1]
	);
};

/**
 * Check if given point is world extent.
 * If coordinates overfloats world extent, they are recalculated to the valit coordinates.
 * Example longitude -190 is recalculated to longitude 170
 * Example latitude -92 is recalculated to longitude -90
 * @param {Array} point
 * @return {Array}
 */
export const ensurePointIntegrity = point => {
	if (point) {
		point = roundPoint(point);
		if (point[1]) {
			if (point[1] > 90) {
				point[1] = 90;
			} else if (point[1] < -90) {
				point[1] = -90;
			}
		}

		if (point[0]) {
			if (point[0] > 360 || point[0] < -360) {
				point[0] %= 360;
			}

			if (point[0] > 180) {
				point[0] = -180 + (point[0] - 180);
			} else if (point[0] < -180) {
				point[0] = 180 + (point[0] + 180);
			} else if (point[0] === -180) {
				point[0] = 180;
			}
		}
	}
	return point;
};

/**
 * Check if given point is world extent. If coordinates overfloats world extent, then are fixed by placing on the border.
 * Example longitude -190 is recalculated to longitude -180
 * Example latitude -92 is recalculated to longitude -90
 * @param {Array} point
 * @return {Array}
 */
export const ensurePointInWorldBBox = point => {
	let newPoint;
	if (point) {
		point = roundPoint(point);
		newPoint = [point[0], point[1]];
		if (newPoint[1]) {
			if (newPoint[1] > 90) {
				newPoint[1] = 90;
			} else if (newPoint[1] < -90) {
				newPoint[1] = -90;
			}
		}

		if (newPoint[0]) {
			if (newPoint[0] > 180) {
				newPoint[0] = 180;
			} else if (newPoint[0] < -180) {
				newPoint[0] = -180;
			} else if (newPoint[0] === -180) {
				newPoint[0] = 180;
			}
		}
	} else {
		newPoint = null;
	}
	return newPoint;
};

/**
 * Apply ensurePointIntegrity on each defined extent.
 *
 * @param {Array.[Array<Lon,Lat>]} extent
 * @return {Array.[Array]}
 */
export const ensureExtentIntegrity = extent => {
	return extent.map(ensurePointIntegrity);
};

/**
 * Apply ensurePointInWorldBBox on each defined extent.
 * @param {*} extent
 * @return {Array.[Array<Lon,Lat>]}
 */
export const ensureExtentInWorldBBox = extent => {
	return extent.map(ensurePointInWorldBBox);
};

/**
 * Check if given point lies in world extent.
 * If dont, throw Error
 * @param {Array.<Lon,Lat>} point
 * @return bool
 */
export const checkPointIntegrity = point => {
	point = roundPoint(point);
	if (containsXY(gridConstants.LEVEL_BOUNDARIES, point)) {
		return true;
	} else {
		throw new Error(`Point ${point} does not lies in base extent.`);
	}
};

/**
 * Check if all points from given extent lies in world extent.
 * If dont, throw Error
 * @param {Array} extent
 * @return bool
 */
export const checkExtentIntegrity = extent => {
	if (containsExtent(gridConstants.LEVEL_BOUNDARIES, extent)) {
		return true;
	} else {
		throw new Error(`Extent ${extent} does not lies in base extent.`);
	}
};

/**
 * Return intersected tile for given point and grid size.
 * If given point lies on top or right side of gridSet border, return nearest tile from inside gridset.
 * Point belongs to tile if lies on bottom or left border of tile.
 * @param {Array.<Longitude, Latitude>} point
 * @param {Number} gridSize
 * @param {bool} fixIntegrity Ensure point position in world extent
 * @param {bool} topRightCloseBorder default = true By default, if point lays on the border of the tiles,
 * identify intersected tile as the one which has border on the right od on the top.
 * This behaviour can be changed to the right/bottom by topRightCloseBorder=false.
 * @returns {Array.<Longitude, Latitude>}
 */
export const intersectTile = (
	point,
	gridSize,
	fixIntegrity = true,
	topRightCloseBorder = false
) => {
	//throw error if point does not fit integrity check
	try {
		checkPointIntegrity(point);
	} catch (error) {
		if (fixIntegrity) {
			point = ensurePointIntegrity(point);
		} else {
			throw error;
		}
	}

	const lon = point[0];
	const lat = point[1];
	let snappedLonInside;
	const pointLonOnLeftBorder = lon === gridConstants.LEVEL_BOUNDARIES[0][0];
	const pointLonOnRightBorder = lon === gridConstants.LEVEL_BOUNDARIES[1][0];
	if (pointLonOnLeftBorder) {
		snappedLonInside = lon;
	} else if (!topRightCloseBorder && pointLonOnRightBorder) {
		snappedLonInside = lon - gridSize;
	} else {
		//Check if point is on the Lontitude grid
		const isOnGridLonNet = lon % gridSize === 0;
		if (isOnGridLonNet) {
			if (topRightCloseBorder) {
				snappedLonInside = lon - gridSize;
			} else {
				snappedLonInside = lon;
			}
		} else {
			//point is inside tile
			snappedLonInside = closestDivisibleLower(lon, gridSize);
		}
	}

	let snappedLatInside;
	const pointLatOnBottomBorder = lat === gridConstants.LEVEL_BOUNDARIES[0][1];
	if (pointLatOnBottomBorder) {
		snappedLatInside = lat;
	} else {
		//Check if point is on the Latitude grid
		const isOnGridLatNet = lat % gridSize === 0;
		if (gridSize === 180 && (lat === 90 || lat === 0 || lat === -90)) {
			snappedLatInside = -90;
		} else if (isOnGridLatNet) {
			//tak je na top hranicích
			if (topRightCloseBorder) {
				snappedLatInside = lat - gridSize;
			} else {
				snappedLatInside = lat;
			}
		} else {
			//point is inside tile
			snappedLatInside = closestDivisibleLower(lat + 90, gridSize) - 90;
		}
	}
	return roundPoint([snappedLonInside, snappedLatInside]);
};

/**
 * Iterator for each tile in tileGrid.
 * @param {Array.<Array.<Array.<Longitude, Latitude>>>} tileGrid LevelTiles defined as array of rows. Each row contains Tiles.
 * @param {function} callback Called on each tile with parameters [tile, rowIndex, columnIndex].
 */
export const forEachTile = (tileGrid, callback) => {
	for (let row = 0; row < tileGrid.length; row++) {
		for (let column = 0; column < tileGrid[row].length; column++) {
			callback(tileGrid[row][column], row, column);
		}
	}
};

/**
 * Returns passed tile as polygon defined by array of nodes. Polygon is closed by last point same as first.
 * @param {Array.<Longitude, Latitude>} tile
 * @param {bool} fixIntegrity Ensure tile position in world extent
 * @param {Number} gridSize
 */
export const getTileAsPolygon = (tile, gridSize, fixIntegrity = true) => {
	//todo - use common function for parsing tiles
	let numericTile = tile.map(parseFloat);
	try {
		checkPointIntegrity(numericTile, fixIntegrity);
	} catch (error) {
		if (fixIntegrity) {
			numericTile = ensurePointIntegrity(numericTile);
		} else {
			throw error;
		}
	}

	const nodes = 5;
	const coordsInner = new Array(nodes).fill(null);
	const coordsInnerFill = coordsInner.map((v, i) => {
		switch (i) {
			case 0:
				return [numericTile[0], numericTile[1]];
			case 1:
				return [
					numericTile[0],
					roundCoordinate(safeSumming(numericTile[1], gridSize)),
				];
			case 2:
				return [
					roundCoordinate(safeSumming(numericTile[0], gridSize)),
					roundCoordinate(safeSumming(numericTile[1], gridSize)),
				];
			case 3:
				return [
					roundCoordinate(safeSumming(numericTile[0], gridSize)),
					numericTile[1],
				];
			case 4:
				return [numericTile[0], numericTile[1]];
		}
	});

	const feature = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [coordsInnerFill],
		},
	};
	return feature;
};

/**
 * Convert TileGrid to GeoJSON
 * @param {Array.<Array.<Array.<Longitude, Latitude>>>} tileGrid LevelTiles defined as array of rows. Each row contains Tiles.
 * @param {Number} gridSize
 * @param {bool} fixIntegrity Ensure each tile from tileGrid position in world extent.
 * @returns {Array.<Array.<Longitude, Latitude>>} polygon
 */
export const getTileGridAsGeoJSON = (tileGrid, size, fixIntegrity = true) => {
	const tilesPolygons = [];
	forEachTile(tileGrid, tile => {
		tilesPolygons.push(getTileAsPolygon(tile, size, fixIntegrity));
	});

	return {
		type: 'FeatureCollection',
		features: tilesPolygons,
	};
};

/**
 * Return size in degrees for certain level.
 * @param {Number} level
 * @returns {Number} gridSize size in degrees
 */
export const getGridSizeForLevel = (level = 0) => {
	return gridConstants.BASE_SIZE / Math.pow(2, level);
};

/**
 * Determine if one extent intersects another.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent.
 * @return {boolean} The two extents intersect.
 */
export function intersects(extent1, extent2) {
	return (
		(extent1[0][0] <= extent2[1][0] &&
			extent1[1][0] >= extent2[0][0] &&
			extent1[0][1] <= extent2[1][1] &&
			extent1[1][1] >= extent2[1][1]) ||
		(extent2[0][0] <= extent1[1][0] &&
			extent2[1][0] >= extent1[0][0] &&
			extent2[0][1] <= extent1[1][1] &&
			extent2[1][1] >= extent1[1][1])
	);
}

/**
 * Clip extent by extent. Return extents intersection. Mostly used for clip overfloating extent LEVEL_BOUNDARIES.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 1.
 * @returns {Extent} Extent intersection
 */
export const getIntersection = (extent1, extent2) => {
	const intersection = [
		[-Infinity, -Infinity],
		[Infinity, Infinity],
	];
	if (intersects(extent1, extent2)) {
		if (extent1[0][0] > extent2[0][0]) {
			intersection[0][0] = extent1[0][0];
		} else {
			intersection[0][0] = extent2[0][0];
		}
		if (extent1[0][1] > extent2[0][1]) {
			intersection[0][1] = extent1[0][1];
		} else {
			intersection[0][1] = extent2[0][1];
		}
		if (extent1[1][0] < extent2[1][0]) {
			intersection[1][0] = extent1[1][0];
		} else {
			intersection[1][0] = extent2[1][0];
		}
		if (extent1[1][1] < extent2[1][1]) {
			intersection[1][1] = extent1[1][1];
		} else {
			intersection[1][1] = extent2[1][1];
		}
	}

	return intersection;
};

/**
 *
 * @param {Array.<Longitude, Latitude>} coordinates Center coordinates of viewPort
 * @param {Number} range Size of map in meters
 * @param {Number} ratio Ratio between width and height
 * @param {Number} optLat Selected latitude with minimized distortion.
 * @param {bool} fixIntegrity Ensure center position in world extent
 * @returns {Extent} Extent intersection
 */
export const getExtentAroundCoordinates = (
	coordinates,
	range,
	ratio,
	optLat,
	fixIntegrity
) => {
	//throw error if point does not fit integrity check
	//TODO -> if lon/lat higher than earth extent, then transform to extent
	try {
		checkPointIntegrity(coordinates);
	} catch (error) {
		if (fixIntegrity) {
			coordinates = ensurePointIntegrity(coordinates);
		} else {
			throw error;
		}
	}

	//todo fix point

	//determinate landscape or portrait position of map
	let widthRatio = 1;
	let heightRatio = 1;
	// let layout;
	if (ratio < 1) {
		// portrait layout
		heightRatio = ratio;
	} else {
		// landscape layout
		widthRatio = 1 / ratio;
	}

	const rangeOnEq = range / Math.cos((Math.PI * optLat) / 180);
	const optRange = rangeOnEq * Math.cos((Math.PI * coordinates[1]) / 180);
	const centerLonLat = new LatLon(coordinates[1], coordinates[0]);
	const northBorder = centerLonLat.destinationPoint(
		optRange / 2 / heightRatio,
		0
	);
	const southBorder = centerLonLat.destinationPoint(
		optRange / 2 / heightRatio,
		180
	);
	const westBorder = centerLonLat.destinationPoint(
		optRange / 2 / widthRatio,
		270
	);
	const eastBorder = centerLonLat.destinationPoint(
		optRange / 2 / widthRatio,
		90
	);
	const extent = [
		roundPoint([westBorder.lon, southBorder.lat]),
		roundPoint([eastBorder.lon, northBorder.lat]),
	];
	const intersectedExtent = getIntersection(
		extent,
		gridConstants.LEVEL_BOUNDARIES
	);
	if (fixIntegrity) {
		return ensureExtentIntegrity(intersectedExtent);
	} else {
		return intersectedExtent;
	}
};

/**
 * Converts tile as a string to array
 * @param {Array|string} tile
 * @returns {Array} Tile defined by Numbers in array
 */
export function tileAsArray(tile) {
	if (
		typeof tile === 'string' &&
		tile.split(',').length > 1 &&
		tile.split(',').every(i => _isFinite(parseFloat(i)))
	) {
		return tile.split(',').map(parseFloat);
	} else if (
		_isArray(tile) &&
		tile.length !== 1 &&
		tile.every(i => _isFinite(parseFloat(i)))
	) {
		return tile.map(parseFloat);
	} else if (_isArray(tile) && tile.length === 1) {
		return tileAsArray(tile[0]);
	} else {
		return null;
	}
}

/**
 * Finite numbers are transformed to the decimal format and to the string.
 * Example: 2e-2 -> "0.02"
 * Example: 0.02 -> "0.02"
 * @param {Number} number
 * @returns {string?}
 */
export const getNumberInDecimalString = number => {
	if (!Number.isFinite(number)) {
		return null;
	}

	const numberPrecision = precision(number);
	return number.toFixed(numberPrecision);
};

/**
 * Returns array of strings representing given tile
 * @param {Array|string} tile
 * @returns {Array}
 */
export const tileAsStringArray = tile => {
	if (
		_isArray(tile) &&
		typeof tile[0] === 'string' &&
		typeof tile[1] === 'string'
	) {
		return tile;
	} else if (_isArray(tile)) {
		const arrTile = tileAsArray(tile);
		if (arrTile) {
			// return arrTile.map(getNumberInDecimalString).join(',');
			return arrTile.map(getNumberInDecimalString);
		} else {
			return null;
		}
	} else {
		return null;
	}
};

/**
 * Returns string representing given tile
 * @param {Array|string} tile
 * @returns {string}
 */
export const tileAsString = tile => {
	if (typeof tile === 'string') {
		return tile;
	} else {
		const stringTile = tileAsStringArray(tile);
		return stringTile ? stringTile.join(',') : null;
	}
};

export const getUnionTiles = (tilesA = [], tilesB = []) => {
	const tilesAlength = tilesA.length;
	const tilesBlength = tilesB.length;
	let smallerTiles, biggerTiles;
	if (tilesAlength <= tilesBlength) {
		smallerTiles = new Set([...tilesA.map(tileAsString)]);
		biggerTiles = new Set([...tilesB.map(tileAsString)]);
	} else {
		smallerTiles = new Set([...tilesB.map(tileAsString)]);
		biggerTiles = new Set([...tilesA.map(tileAsString)]);
	}

	const unionTiles = [];

	smallerTiles.forEach(t => {
		if (biggerTiles.has(t)) {
			unionTiles.push(t);
		}
	});

	return unionTiles;
};

export const getExtentOfTile = (level, tile) => {
	if (level <= gridConstants.levels) {
		const arrayTile = tileAsArray(tile);
		const sizeOfTileOnLevel = getGridSizeForLevel(level);
		const extent = [
			arrayTile,
			[arrayTile[0] + sizeOfTileOnLevel, arrayTile[1] + sizeOfTileOnLevel],
		];
		return extent;
	} else {
		return null;
	}
};

export const getLoadedTilesByDirection = (
	level,
	wanted,
	loaded,
	direction,
	dept
) => {
	let missingTiles = [...wanted.map(tileAsString)];
	const missingTilesInLevels = {};
	const loadedTiles = {};

	let nextLevel = null;
	let shouldProceedNextLevel = null;
	let getNextLevel = null;
	if (direction === 'LOWER') {
		nextLevel = level + 1;
		shouldProceedNextLevel = () =>
			nextLevel <= level + dept &&
			nextLevel <= gridConstants.levels &&
			missingTiles.length > 0;
		getNextLevel = () => ++nextLevel;
	} else if (direction === 'HIGHER') {
		nextLevel = level - 1;
		shouldProceedNextLevel = () =>
			nextLevel >= level - dept && nextLevel >= 0 && missingTiles.length > 0;
		getNextLevel = () => --nextLevel;
	} else {
		//direction undefined
		return null;
	}
	while (shouldProceedNextLevel()) {
		missingTilesInLevels[nextLevel] = missingTiles.map(tile => {
			const tilesInExtent = [];
			const tileExtent = getExtentOfTile(level, tile);
			forEachTileInGridByLevelAndExtent(nextLevel, tileExtent, t => {
				tilesInExtent.push(tileAsString(t));
			});
			return [tile, tilesInExtent];
		});
		if (loaded[nextLevel]) {
			for (let i = missingTilesInLevels[nextLevel].length - 1; i >= 0; i--) {
				const [missingTopTile, missingTilesForLevel] =
					missingTilesInLevels[nextLevel][i];
				if (loaded[nextLevel].length >= missingTilesForLevel.length) {
					// get same tiles from loaded and requested
					const unionForLevel = getUnionTiles(
						loaded[nextLevel],
						missingTilesForLevel
					);
					// union tiles covers all tiles from missing tiles
					if (unionForLevel.length === missingTilesForLevel.length) {
						// remove from missingTilesInLevels[nextLevel]
						const index = missingTilesInLevels[nextLevel].findIndex(
							pair => pair[0] === missingTopTile
						);
						missingTilesInLevels[nextLevel].splice(index, 1);

						// remove from missingTiles
						// clear this tile for farther comparison
						missingTiles = _without(missingTiles, missingTopTile);

						//save tiles that covers requester tile on propriet level
						loadedTiles[missingTopTile] = {
							level: nextLevel,
							tiles: missingTilesForLevel,
						};
					}
				}
			}
		}
		getNextLevel();
	}
	return loadedTiles;
};

/**
 *
 * @param {Number} level
 * @param {Array} wanted
 * @param {Object} loaded
 * @param {string} direction One of level type [SAME, LOWER, HIGHER]
 */
export const getLoadedTiles = (
	level,
	wanted = [],
	loaded = {},
	direction,
	dept = 4
) => {
	const types = ['SAME', 'LOWER', 'HIGHER'];
	if (!types.includes(direction)) {
		return;
	}

	if (level > gridConstants.levels) {
		return;
	}

	switch (direction) {
		case 'SAME':
			const loadedForLevel = loaded[level];
			const union = getUnionTiles(loadedForLevel, wanted);
			if (union.length > 0) {
				return {
					[level]: getUnionTiles(loadedForLevel, wanted),
				};
			} else {
				return null;
			}
		case 'LOWER':
			return getLoadedTilesByDirection(level, wanted, loaded, direction, dept);
		case 'HIGHER':
			return getLoadedTilesByDirection(level, wanted, loaded, direction, dept);
		default:
			break;
	}
};
