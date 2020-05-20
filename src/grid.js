import gridConstants from './constants/grid'
import {
    createCache,
    clearEntries,
    placeEntryOnLastIndex,
} from './cache'
import {
    getExtentID,
    snapPointToGridLeftBottom,
    convertLongitudeToColumn,
    convertLatitudeToRow
} from './utils';

const tileCache = createCache();

/**
 * Return grid for given level and extent. If no extent defined, global extend is used.
 * @param {Number} level Level between {0 - 26}
 * @param {Array.<Array>} extent Restricted extent. Default extent is all globe. Extent is defined by left bottom and right top lon/lat.
 * @return {Array.<Array.<Array.<Longitude, Latitude>>>} LevelTiles defined as array of rows. Each row contains Tiles.
 */
export const getGridForLevelAndExtent = (level = 0, extent = gridConstants.LEVEL_BOUNDARIES) => {
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

        const leftBottomSnappedPoint = snapPointToGridLeftBottom(extent[0], gridSize);
        const rightTopSnappedPoint = snapPointToGridLeftBottom(extent[1], gridSize);

        for(let i = leftBottomSnappedPoint[1]; i <= rightTopSnappedPoint[1]; i+= gridSize){
            let row = [];
            for(let j = leftBottomSnappedPoint[0]; j <= rightTopSnappedPoint[0]; j+= gridSize){
                row = [...row, [j, i]];
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
 * Return size in degrees for certain level.
 * @param {Number} level
 * @returns {Number} gridSize size in degrees
 */
export const getGridSizeForLevel = (level = 0) => {
    return gridConstants.BASE_SIZE / Math.pow(2, level)
}
/**
 * 
 * @returns {Array.<Longitude, Latitude>} Coordinates of global extent
 */
export const getOrigin = () => {
    const extent = gridConstants.getGridExtent();
    return extent[0];
}