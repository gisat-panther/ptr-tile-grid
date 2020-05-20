import gridConstants from './constants/grid'

/**
 * 
 * @param {Array.<Array.<Longitude, Latitude>>} extent Extent is defined by left bottom and right top lon/lat.
 * @returns {string}
 */
export const getExtentID = (extent = gridConstants.LEVEL_BOUNDARIES) => {
    return `${extent[0][0]}${extent[0][1]}${extent[1][0]}${extent[1][1]}`
}

/**
 * Returns closer divisible that is higher than given number,
 * @param {Number} number
 * @param {Number} divisor
 * @returns {Number}
 */
export const closestDivisibleHigher = (number, divisor) => {
    // return (number + divisor) - (number % divisor);

    const rest = number % divisor;

    if(number < 0) {
      return -closestDivisibleLower(Math.abs(number), divisor);
    } else {
      if(rest !== 0) {
        return (number + divisor) - (number % divisor);
      } else {
        return number;
      }
    }
}

/**
 * Returns closer divisible that is lower than given number,
 * @param {Number} number
 * @param {Number} divisor
 * @returns {Number}
 */
export const closestDivisibleLower = (number, divisor) => {
    if(number < 0) {
      return -closestDivisibleHigher(Math.abs(number), divisor);
    } else {
      return number - (number % divisor);
    }
}

/**
 * Return intersected tile for given point and grid size.
 * If given point lies on top or  right side of gridSet border, return nearest tile from inside gridset.
 * Point belongs to tile if lies on bottom or left border of tile.
 * @param {Array.<Longitude, Latitude>} point 
 * @param {Number} gridSize 
 * @returns {Array.<Longitude, Latitude>}
 */
export const intersectTile = (point, gridSize) => {
    const lon = point[0];
    const lat = point[1];

    let snappedLonInside;
    const pointLonOnTopBorder = lon === gridConstants.LEVEL_BOUNDARIES[1][0];
    if(pointLonOnTopBorder) {
      snappedLonInside = lon - gridSize;
    } else {
      snappedLonInside = closestDivisibleLower(lon , gridSize);
    }

    let snappedLatInside;
    const pointLatOnTopBorder = lat === gridConstants.LEVEL_BOUNDARIES[1][1];
    if(pointLatOnTopBorder) {
      snappedLatInside = lat - gridSize;
    } else {
      //move lat to positive sector before call closestDivisibleLower
      snappedLatInside = closestDivisibleLower(lat - 90, gridSize) + 90;
    }

    return [snappedLonInside, snappedLatInside];
}