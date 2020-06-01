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
    getGridSizeForLevel,
} from './utils';

const tileCache = createCache();

/**
 * Return grid for given level and extent. If no extent defined, global extend is used.
 * @param {Number} level Level between {0 - 26}
 * @param {Array.<Array>} extent Restricted extent. Default extent is all globe. Extent is defined by left bottom and right top lon/lat.
 * @return {Array.<Array.<Array.<Longitude, Latitude>>>} LevelTiles defined as array of rows. Each row contains Tiles.
 */
export const getGridForLevelAndExtent = (level = 0, extent = gridConstants.LEVEL_BOUNDARIES) => {
    //throw error if extent does not fit integrity check    
    checkExtentIntegrity(extent);

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

        const leftBottomTile = intersectTile(extent[0], gridSize);
        const rightTopTile = intersectTile(extent[1], gridSize);

        for(let tileLat = leftBottomTile[1]; tileLat <= rightTopTile[1]; tileLat+= gridSize){
            let row = [];
            for(let tileLon = leftBottomTile[0]; tileLon <= rightTopTile[0]; tileLon+= gridSize){
                row = [...row, [tileLon, tileLat]];
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
