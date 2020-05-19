import gridConstants from './constants/grid'
import {
    getExtentID,
    snapPointToGridLeftBottom,
    convertLongitudeToColumn,
    convertLatitudeToRow
} from './utils';

const tileCache = new Map();

/**
 * Return grid for given level and extent. If no extent defined, global extend is used.
 * @param {Number} level Level between {0 - 26}
 * @param {Array.<Array>} extent Restricted extent. All tiles are intersecting given extent. Default extent is all globe. Extent is defined by left bottom and right top lon/lat.
 * @return {Array.<Array.<Array.<Longitude, Latitude>>>} LevelTiles defined as array of rows. Each row contains Tiles.
 */
export const getGridForLevelAndExtent = (level = 0, extent = gridConstants.LEVEL_BOUNDARIES) => {
    const extentId = getExtentID(extent);
    const intersectionId = `${level}-${extentId}`;
    if(!tileCache.has(intersectionId)) {
        const gridSize = getGridSizeForLevel(level);
        let grid = [];
        const origin = getOrigin();

        const leftBottomSnappedPoint = snapPointToGridLeftBottom(extent[0], gridSize);
        const rightTopSnappedPoint = snapPointToGridLeftBottom(extent[1], gridSize);
        
        const rowsStartIndex = convertLatitudeToRow(leftBottomSnappedPoint[1], gridSize);
        const rowsEndIndex = convertLatitudeToRow(rightTopSnappedPoint[1], gridSize);
        
        const columnsStartIndex = convertLongitudeToColumn(leftBottomSnappedPoint[0], gridSize);
        const columnsEndIndex = convertLongitudeToColumn(rightTopSnappedPoint[0], gridSize);

        for(let i = rowsStartIndex; i <= rowsEndIndex; i++){
            let row = [];
            for(let j = columnsStartIndex; j <= columnsEndIndex; j++){
                row = [...row, [origin[0] + (j * gridSize), origin[1] + (i * gridSize)]];
            }
            grid = [row, ...grid];
        }

        //consider cleaning cache 
        tileCache.set(level, grid);
        return grid;
    } else {
        return tileCache.get(level);
    }
}

/**
 * Return size in degrees for certain level.
 * @param {Number} level Level between {0 - 26}
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