import {map as mapUtils} from '@gisatcz/ptr-utils';

import gridConstants from './constants/grid'
import {
    createCache,
    clearEntries,
    placeEntryOnLastIndex,
} from './cache'

import {
    getExtentID,
    intersectTile,
    checkExtentIntegrity,
    ensureExtentIntegrity,
    getGridSizeForLevel,
    getExtentAroundCoordinates,
} from './utils';

const tileCache = createCache();

/**
 * Return grid for given level and extent. If no extent defined, global extend is used.
 * @param {Number} level Level between {0 - 26}
 * @param {Array.<Array>} extent Restricted extent. Default extent is all globe. Extent is defined by left bottom and right top lon/lat.
 * @return {Array.<Array.<Array.<Longitude, Latitude>>>} LevelTiles defined as array of rows. Each row contains Tiles.
 */
export const getGridForLevelAndExtent = (level = 0, extent = gridConstants.LEVEL_BOUNDARIES, fixIntegrity) => {
    //throw error if extent does not fit integrity check    
    try {
        checkExtentIntegrity(extent);
      } catch (error) {
        if(fixIntegrity) {
            extent = ensureExtentIntegrity(extent);
        } else {
            throw error;
        }
      }
    

    const extentId = getExtentID(extent);
    const intersectionId = `${level}-${extentId}`;
    if(tileCache.has(intersectionId)) {
        //update usage in cache
        placeEntryOnLastIndex(tileCache, intersectionId);
        //for same level and extent return grid from cache
        return tileCache.get(intersectionId);
    } else {
        const gridSize = getGridSizeForLevel(level);
        let grid = [];

        const leftBottomTile = intersectTile(extent[0], gridSize, fixIntegrity);
        const rightTopTile = intersectTile(extent[1], gridSize, fixIntegrity);
        for(let tileLat = leftBottomTile[1]; tileLat <= rightTopTile[1]; tileLat+= gridSize){
            let row = [];
            const crossMeridian = (rightTopTile[0] - leftBottomTile[0]) <= -180;
            if (crossMeridian) {
                //generate tile to meridian
                for(let tileLon = leftBottomTile[0]; tileLon+gridSize <= 180; tileLon+= gridSize) {
                    row = [...row, [tileLon, tileLat]];
                }
                //generate tile from meridian
                for(let tileLon = -180; tileLon <= rightTopTile[0]; tileLon+= gridSize) {
                    row = [...row, [tileLon, tileLat]];
                }
            } else {
                for(let tileLon = leftBottomTile[0]; tileLon <= rightTopTile[0]; tileLon+= gridSize){
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
}

/**
 * 
 * @returns {Array.<Longitude, Latitude>} Coordinates of global extent
 */
export const getOrigin = () => {
    const extent = gridConstants.getGridExtent();
    return extent[0];
}

/**
 * Find nearest next (higher resolution) level for given resolution.
 * @param {Number} resolution Size of pixel in meters (m/px)
 * @returns {Number} Related level
 */
export const getLevelByResolution = (resolution) => {
    const prevLevelIndex = gridConstants.resolutions.findIndex((r) => resolution >= r);
    if(prevLevelIndex === -1) {
        return gridConstants.resolutions.length - 1;
    } else {
        return prevLevelIndex;
    }
}

/**
 * Find best fit level on given parameters.
 * @param {Number} boxRange Size of visible map in meters
 * @param {Number} viewportRange Minimal size of viewport in pixels
 * @returns {Number} Related level
 */
export const getLevelByViewport = (boxRange, viewportRange) => {
    const viewportResolution = boxRange / viewportRange;
    return getLevelByResolution(viewportResolution);
}

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {number} boxRange 
 * @param {Array.<number, number>} center [lon, lat]
 */
export const getTileGrid = (width, height, boxRange, center, fixIntegrity) => {
    const viewportRange = mapUtils.view.getMapViewportRange(width, height);

    //map zoom from zoom levels generated for lat 50
    const zoom = mapUtils.view.getZoomLevelFromBoxRange(boxRange, width, height);
    const boxRangeByZoomLevel = mapUtils.view.getBoxRangeFromZoomLevel(zoom, width, height);
    const level = getLevelByViewport(boxRange, viewportRange);
    const ratio =  width / height;
    const extent = getExtentAroundCoordinates(center, boxRangeByZoomLevel, ratio, 50, fixIntegrity);
    const tileGrid = getGridForLevelAndExtent(level, extent, fixIntegrity);
    return tileGrid;
  }