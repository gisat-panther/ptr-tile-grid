import {map as mapUtils} from '@gisatcz/ptr-utils';
import {mapConstants} from '@gisatcz/ptr-core';

import gridConstants from './constants/grid';
import {createCache, clearEntries, placeEntryOnLastIndex} from './cache';

import {
	getExtentID,
	intersectTile,
	checkExtentIntegrity,
	ensureExtentInWorldBBox,
	getGridSizeForLevel,
} from './utils';

const tileCache = createCache();

/**
 * Return grid for given level and extent. If no extent defined, global extend is used.
 * @param {Number} level Level between {0 - 26}
 * @param {Array.<Array>} extent Restricted extent. Default extent is all globe. Extent is defined by left bottom and right top lon/lat.
 * @param {bool} fixIntegrity Ensure that extent will not overfloat antimeridian. Example: longitude -190 is changed to -180.
 * @return {Array.<Array.<Array.<Longitude, Latitude>>>} LevelTiles defined as array of rows. Each row contains Tiles.
 */
export const getGridForLevelAndExtent = (
	level = 0,
	extent = gridConstants.LEVEL_BOUNDARIES,
	fixIntegrity = true
) => {
	//throw error if extent does not fit integrity check
	try {
		checkExtentIntegrity(extent);
	} catch (error) {
		if (fixIntegrity) {
			extent = ensureExtentInWorldBBox(extent);
		} else {
			throw error;
		}
	}

	const extentId = getExtentID(extent);
	const intersectionId = `${level}-${extentId}`;
	if (tileCache.has(intersectionId)) {
		//update usage in cache
		placeEntryOnLastIndex(tileCache, intersectionId);
		//for same level and extent return grid from cache
		return tileCache.get(intersectionId);
	} else {
		const gridSize = getGridSizeForLevel(level);
		let grid = [];

		const leftBottomTile = intersectTile(extent[0], gridSize, fixIntegrity);
		const rightTopTile = intersectTile(extent[1], gridSize, fixIntegrity);
		for (
			let tileLat = leftBottomTile[1];
			tileLat <= rightTopTile[1];
			tileLat += gridSize
		) {
			let row = [];
			const crossMeridian = rightTopTile[0] - leftBottomTile[0] <= -180;
			if (crossMeridian) {
				//generate tile to meridian
				for (
					let tileLon = leftBottomTile[0];
					tileLon + gridSize <= 180;
					tileLon += gridSize
				) {
					row = [...row, [tileLon, tileLat]];
				}
				//generate tile from meridian
				for (
					let tileLon = -180;
					tileLon <= rightTopTile[0];
					tileLon += gridSize
				) {
					row = [...row, [tileLon, tileLat]];
				}
			} else {
				for (
					let tileLon = leftBottomTile[0];
					tileLon <= rightTopTile[0];
					tileLon += gridSize
				) {
					row = [...row, [tileLon, tileLat]];
				}
			}

			grid = [row, ...grid];
		}

		//keep cache size on max 1000 entries
		clearEntries(tileCache, 1000);

		tileCache.set(intersectionId, grid);
		return grid;
	}
};

/**
 *
 * @returns {Array.<Longitude, Latitude>} Coordinates of global extent
 */
export const getOrigin = () => {
	const extent = gridConstants.getGridExtent();
	return extent[0];
};

/**
 * Find nearest next (higher resolution) level for given resolution.
 * @param {Number} resolution Size of pixel in meters (m/px)
 * @returns {Number} Related level
 */
export const getLevelByResolution = resolution => {
	const prevLevelIndex = gridConstants.resolutions.findIndex(
		r => resolution >= r
	);
	if (prevLevelIndex === -1) {
		return gridConstants.resolutions.length - 1;
	} else {
		return prevLevelIndex;
	}
};

/**
 * Find best fit level on given parameters.
 * @param {Number} boxRange Size of visible map in meters
 * @param {Number} viewportRange Minimal size of viewport in pixels
 * @returns {Number} Related level
 */
export const getLevelByViewport = (boxRange, viewportRange) => {
	const viewportResolution = boxRange / viewportRange;
	return getLevelByResolution(viewportResolution);
};

/**
 * Create TileGrid based on given parameters.
 * It works only with boxrange and center generated from map in EPSG:3857.
 *
 * @param {number} width
 * @param {number} height
 * @param {number} boxRange
 * @param {Object} center {lon, lat}
 * @param {bool} fixIntegrity Ensure that computed extent will not overfloat antimeridian. Example: longitude -190 is changed to -180.
 * @param {Object} center {lon, lat}
 */
export const getTileGrid = (width, height, boxRange, center, fixIntegrity) => {
	const viewportRange = mapUtils.view.getMapViewportRange(width, height);
	const level = getLevelByViewport(boxRange, viewportRange);
	const ratio = width / height;
	const extent = mapUtils.view.getBoundingBoxFromViewForEpsg3857(
		center,
		boxRange,
		ratio,
		mapConstants.averageLatitude
	);

	const extentAsArray = [
		[extent.minLon, extent.minLat],
		[extent.maxLon, extent.maxLat],
	];

	const extentAsArrayInWorldExtent = ensureExtentInWorldBBox(extentAsArray);

	const tileGrid = getGridForLevelAndExtent(
		level,
		extentAsArrayInWorldExtent,
		fixIntegrity
	);
	return tileGrid;
};
