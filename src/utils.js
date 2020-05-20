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
 * Snap given point to nearest left bottom node from grid defined by grid size.
 * If given point lies on right side of gridSet border
 * If result point overflow gridSet, then use nearest point on left/bottom.
 * @param {Array.<Longitude, Latitude>} point 
 * @param {Number} gridSize 
 * @returns {Array.<Longitude, Latitude>}
 */
export const snapPointToGridLeftBottom = (point, gridSize) => {
    const lon = point[0];
    const lat = point[1];

    const snappedLon = closestDivisibleLower(lon , gridSize);
    const snappedLonInside = snappedLon >= gridConstants.LEVEL_BOUNDARIES[1][0] ? snappedLon - gridSize : snappedLon;
    
    //move lat to positive sector before call closestDivisibleLower
    let snappedLat = closestDivisibleLower(lat - 90, gridSize) + 90;
    
    const snappedLatInside = snappedLat >= gridConstants.LEVEL_BOUNDARIES[1][1] ? snappedLat - gridSize : snappedLat;
    return [snappedLonInside, snappedLatInside];
}

/**
 * Returns row index for given latitude and gridSize.
 * @param {Number} latitude 
 * @param {Number} gridSize 
 */
export const convertLatitudeToRow = (latitude, gridSize) => {
    return (snapPointToGridLeftBottom([0, latitude], gridSize)[1] + 90) / gridSize;
}

/**
 * Returns column index
 * @param {Number} longitude 
 * @param {Number} gridSize 
 */
export const convertLongitudeToColumn = (longitude, gridSize) => {
    return (snapPointToGridLeftBottom([longitude, 0], gridSize)[0] + 180) / gridSize;
}