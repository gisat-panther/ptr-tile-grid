import gridConstants from './constants/grid'
import { constants } from '.';
import LatLon from './dmsHelpers';

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
 * Check if the passed coordinate is contained or on the edge of the extent.
 *
 * @param {Extent} extent Extent.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @return {boolean} The x, y values are contained in the extent.
 */
export const containsXY = (extent, point) => {
  return extent[0][0] <= point[0] && point[0] <= extent[1][0] && extent[0][1] <= point[1] && point[1] <= extent[1][1];
}

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
}

const checkPointIntegrity = (point) => {
  if(containsXY(gridConstants.LEVEL_BOUNDARIES, point)) {
    return true
  } else {
    throw new Error(`Point ${point} does not lies in base extent.`);
  }
}

export const checkExtentIntegrity = (extent) => {
  if(containsExtent(gridConstants.LEVEL_BOUNDARIES, extent)) {
    return true
  } else {
    throw `Extent ${extent} does not lies in base extent.`;
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
    //throw error if point does not fit integrity check
    checkPointIntegrity(point);
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
      snappedLatInside = closestDivisibleLower(lat + 90, gridSize) - 90;
    }

    return [snappedLonInside, snappedLatInside];
}

/**
 * Iterator for each tile in tileGrid.
 * @param {Array.<Array.<Array.<Longitude, Latitude>>>} tileGrid LevelTiles defined as array of rows. Each row contains Tiles.
 * @param {function} callback Called on each tile with parameters [tile, rowIndex, columnIndex].
 */
export const forEachTile = (tileGrid, callback) => {
  for (let row = 0; row < tileGrid.length; row++) {
    for (let column = 0; column < tileGrid[row].length; column++) {
      callback(tileGrid[row][column], row, column)
    }
  }
}

/**
 * Returns passed tile as polygon defined by array of nodes. Polygon is closed by last point same as first.
 * @param {Array.<Longitude, Latitude>} tile 
 * @param {Number} gridSize 
 */
export const getTileAsPolygon = (tile, gridSize) => {
  checkPointIntegrity(tile);
  const nodes = 5;
  const coordsInner = new Array(nodes).fill(null);
  const coordsInnerFill = coordsInner.map((v, i) => {
    switch (i) {
      case 0:
        return [tile[0], tile[1]];
      case 1:
        return [tile[0], tile[1] + gridSize]
      case 2:
        return [tile[0] + gridSize, tile[1] + gridSize]
      case 3:
        return [tile[0] + gridSize, tile[1]]
      case 4:
        return [tile[0], tile[1]]
    }
  })


  const feature = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [coordsInnerFill]
    }
  };
  return feature;

};


/**
 * Convert TileGrid to GeoJSON
 * @param {Array.<Array.<Array.<Longitude, Latitude>>>} tileGrid LevelTiles defined as array of rows. Each row contains Tiles.
 * @param {Number} gridSize 
 * @returns {Array.<Array.<Longitude, Latitude>>} polygon
 */
export const getTileGridAsGeoJSON = (tileGrid, size) => {
  const tilesPolygons = [];
  forEachTile(tileGrid, (tile) => {
    tilesPolygons.push(getTileAsPolygon(tile, size));
  });
  
  return {
    "type": "FeatureCollection",
    "features": tilesPolygons
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
 * Determine if one extent intersects another.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent.
 * @return {boolean} The two extents intersect.
 */
export function intersects(extent1, extent2) {
  return (extent1[0][0] <= extent2[1][0] &&
      extent1[1][0] >= extent2[0][0] &&
      extent1[0][1] <= extent2[1][1] &&
      extent1[1][1] >= extent2[1][1]) || (extent2[0][0] <= extent1[1][0] &&
        extent2[1][0] >= extent1[0][0] &&
        extent2[0][1] <= extent1[1][1] &&
        extent2[1][1] >= extent1[1][1]);
}


/**
 * Clip extent by extent. Return extents intersection. Mostly used for clip overfloating extent LEVEL_BOUNDARIES.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 1.
 * @returns {Extent} Extent intersection
 */
export const getIntersection = (extent1, extent2) => {
  const intersection = [[-Infinity, -Infinity], [Infinity, Infinity]];
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
  };

  return intersection;
}

/**
 * 
 * @param {Array.<Longitude, Latitude>} coordinates Center coordinates of viewPort
 * @param {Number} range Size of map in meters
 * @param {Number} optLat Optimized range for latitude. 
 * @param {Number} ratio Ratio between width and height
 * @param {string} layout [L/P] landscape/portrait
 * @returns {Extent} Extent intersection
 */
export const getExtentAroundCoordinates = (coordinates, range, ratio, optLat, layout) => {
  //throw error if point does not fit integrity check
  checkPointIntegrity(coordinates);

  //determinate landscape or portrait position of map
  let widthRatio = 1;
  let heightRatio = 1;
  
  if(layout === 'L') {
    widthRatio = ratio;
  }

  if(layout === 'P') {
    heightRatio = ratio;
  }

  const rangeOnEq = range / Math.cos(Math.PI * optLat / 180);
  const optRange = rangeOnEq * Math.cos(Math.PI * coordinates[1] / 180)
  const centerLonLat = new LatLon(coordinates[1], coordinates[0]);
  const northBorder = centerLonLat.destinationPoint((optRange / 2) / heightRatio, 0);
  const southBorder = centerLonLat.destinationPoint((optRange / 2) / heightRatio, 180);
  const westBorder = centerLonLat.destinationPoint((optRange / 2) / widthRatio, 270);
  const eastBorder = centerLonLat.destinationPoint((optRange / 2) / widthRatio, 90);
  const extent = [[westBorder.lon, southBorder.lat], [eastBorder.lon, northBorder.lat]];
  return getIntersection(extent, constants.LEVEL_BOUNDARIES); 
}
