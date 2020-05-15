import gridConstants from './constants/grid'

const tileCache = new Map();

/**
 * 
 * @param {Number} level Level between {0 - 26}
 */
export const getGridForLevel = (level = 0) => {
    if(!tileCache.has(level)) {
        const size = getSizeForLevel(level);
        const xSize = gridConstants.BASE_SIZE * 2;
        const ySize = gridConstants.BASE_SIZE;
        const rows = ySize / size;
        const columns = xSize / size;
        const grid = [];
        const origin = getOrigin();

        for(let i = 0; i < rows; i++){
            const row = [];
            for(let j = 0; j < columns; j++){
                row[j] = [origin[0] + (j * size), origin[1] + (i * size)];
            }
            grid[rows-i-1] = row;
        }
        tileCache.set(level, grid);
        return grid;
    } else {
        return tileCache.get(level);
    }

}

/**
 * Return size in degrees for certain level.
 * @param {Number} level Level between {0 - 26}
 */
export const getSizeForLevel = (level = 0) => {
    return gridConstants.BASE_SIZE / Math.pow(2, level)
}
/**
 * 
 * @param {*} level 
 */
export const getOrigin = () => {
    const extent = gridConstants.getGridExtent();
    return extent[0];
}

