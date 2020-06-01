import {assert} from 'chai';
import {
    utils,
    constants,
} from '../../src/';

describe('utils/utils', function () {
	describe('getExtentID', function () {
        it('Check correct id generated from extent', function () {
            const extent = [[1,-50],[120, 20]];
            const extentId = utils.getExtentID(extent);
            
			assert.equal(extentId, '1-5012020');
            
		});
    });

    describe('closestDivisibleHigher', function () {
        it('Check correct number rounding', function () {
            assert.equal(utils.closestDivisibleHigher(0, 180), 0);
            assert.equal(utils.closestDivisibleHigher(1, 180), 180);
            assert.equal(utils.closestDivisibleHigher(180, 180), 180);
            assert.equal(utils.closestDivisibleHigher(100, 33), 132);
            assert.equal(utils.closestDivisibleHigher(1.5555, 2), 2);
            assert.equal(utils.closestDivisibleHigher(-91, 45), -90);
            assert.equal(utils.closestDivisibleHigher(-95, 180), 0);
            assert.equal(utils.closestDivisibleHigher(90, 90), 90);
        })
    })

    describe('closestDivisibleLower', function () {
        it('Check correct number rounding', function () {
            assert.equal(utils.closestDivisibleLower(90, 90), 90);
            assert.equal(utils.closestDivisibleLower(-91, 45), -135);
            assert.equal(utils.closestDivisibleLower(-90, 45), -90);
            assert.equal(utils.closestDivisibleLower(0, 180), 0);
            assert.equal(utils.closestDivisibleLower(100, 33), 99);
            assert.equal(utils.closestDivisibleLower(1.5555, 2), 0);
        })
    })

    describe('intersectTile', function () {
        it('Snap given point to closest grid point on left bottom side.', function () {
            //poin inside tile
            assert.deepEqual(utils.intersectTile([89, 89], 90), [0, 0]);
            assert.deepEqual(utils.intersectTile([-91, -89], 45), [-135, -90]);
            assert.deepEqual(utils.intersectTile([0, -5], 180), [0, -90]);
            
            //point on node
            assert.deepEqual(utils.intersectTile([90, 90], 90), [90, 0]);
            assert.deepEqual(utils.intersectTile([-90, -90], 45), [-90, -90]);
            
            
            //point on gridSet node
                //gridSide 90
            assert.deepEqual(utils.intersectTile([-180, 90], 90), [-180, 0]);
            assert.deepEqual(utils.intersectTile([180, 90], 90), [90, 0]);
            assert.deepEqual(utils.intersectTile([180, -90], 90), [90, -90]);
            assert.deepEqual(utils.intersectTile([-180, -90], 90), [-180, -90]);
                //gridSide 180
            assert.deepEqual(utils.intersectTile([-180, 90], 180), [-180, -90]);
            assert.deepEqual(utils.intersectTile([180, 90], 180), [0, -90]);
            assert.deepEqual(utils.intersectTile([180, -90], 180), [0, -90]);
            assert.deepEqual(utils.intersectTile([-180, -90], 180), [-180, -90]);
            

            //point on border grid size 180
                //latitude 0
            assert.deepEqual(utils.intersectTile([-180, 0], 180), [-180, -90]);
            assert.deepEqual(utils.intersectTile([0, 0], 180), [0, -90]);
            assert.deepEqual(utils.intersectTile([180, 0], 180), [0, -90]);
            
                //latitude -90
            assert.deepEqual(utils.intersectTile([-180, -90], 180), [-180, -90]);
            assert.deepEqual(utils.intersectTile([0, -90], 180), [0, -90]);
            assert.deepEqual(utils.intersectTile([180, -90], 180), [0, -90]);
            
        })
    })

    describe('containsXY', function () {
        it('Check if point is inside extent', function () {
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [0,0]), true);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [180,0]), true);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [180,-90]), true);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [180,90]), true);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [-180,90]), true);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [-180,-90]), true);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [-179,-89]), true);
            
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [180,-91]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [181,-90]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [-181,-90]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [-360,-90]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [180,90.1]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [0,90.1]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [0,-90.1]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [180.1,0]), false);
            assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [-180.1,0]), false);
            
        })
    })

    describe('containsExtent', function () {
        it('Check if extent is inside extent', function () {
            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[0,0], [10,10]]), true);
            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[-180,-90], [180,90]]), true);
            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[-180,-90], [0,0]]), true);

            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[-180,-90], [180,91]]), false);
            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[-180,-90], [181,90]]), false);
            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[-180,-91], [180,90]]), false);
            assert.equal(utils.containsExtent(constants.LEVEL_BOUNDARIES, [[-181,-90], [180,90]]), false);
        })
    })


    describe('getGridSizeForLevel', function () {
		    it('getSizeForLevels', function () {

                const level0 = utils.getGridSizeForLevel(0);
                const level1 = utils.getGridSizeForLevel(1);
                const level2 = utils.getGridSizeForLevel(2);
                const level3 = utils.getGridSizeForLevel(3);
                const level4 = utils.getGridSizeForLevel(4);
                const level5 = utils.getGridSizeForLevel(5);
                const level6 = utils.getGridSizeForLevel(6);
                const level7 = utils.getGridSizeForLevel(7);
                const level8 = utils.getGridSizeForLevel(8);
                const level9 = utils.getGridSizeForLevel(9);
                const level10 = utils.getGridSizeForLevel(10);

                assert.equal(level0, 180);
                assert.equal(level1, 90);
                assert.equal(level2, 45);
                assert.equal(level3, 22.5);
                assert.equal(level4, 11.25);
                assert.equal(level5, 5.625);
                assert.equal(level6, 2.8125);
                assert.equal(level7, 1.40625);
                assert.equal(level8, 0.703125);
                assert.equal(level9, 0.3515625);
                assert.equal(level10, 0.17578125);
            });
    });
	

    describe('forEachTile', function () {
        it('Check if callback is executed on each tile with params', function () {
            const tileSet = [
				[[-180,-90], [0,-90]]
            ]
            let tilesCount = 0;
            utils.forEachTile(tileSet, (tile, rowIndex, columnIndex) => {
                ++tilesCount;
            })
            assert.equal(tilesCount, 2);
        })
    })

    describe('getTileAsPolygon', function () {
        it('Check if returned polygon is correct for given tile', function () {
            const correctPolygon1 = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "Polygon",
                  "coordinates": [[[0,0],[0,90], [90,90], [90,0], [0,0]]]
                }
              };
            const polygon1 = utils.getTileAsPolygon([0,0], 90);
            assert.deepEqual(polygon1, correctPolygon1);
        })
        it('Check if getTileAsPolygon throw fail', function () {
            assert.throws(() => utils.getTileAsPolygon([190,90], 90), Error, 'Point 190,90 does not lies in base extent.');
        })
    })

    describe('intersects', function () {
        it('Determinate if two extents intersects.', function () {
            const extent1 = [[0,0], [10,10]];
            const extent2 = [[0,0], [20,20]];
            const extent3 = [[10,10], [20,20]];
            const extent4 = [[15,15], [20,20]];
            assert.deepEqual(utils.intersects(extent1, extent2), true);
            assert.deepEqual(utils.intersects(extent2, extent1), true);
            
            assert.deepEqual(utils.intersects(extent1, extent3), true);
            assert.deepEqual(utils.intersects(extent3, extent1), true);

            //dont intersect
            assert.deepEqual(utils.intersects(extent1, extent4), false);
            assert.deepEqual(utils.intersects(extent4, extent1), false);
        })
    })

    describe('getIntersection', function () {
        it('Clip one extent by other', function () {
            const extent1 = [[0,0], [10,10]];
            const extent2 = [[0,0], [20,20]];
            const extent3 = [[10,10], [20,20]];
            const extent4 = [[15,15], [20,20]];
            assert.deepEqual(utils.getIntersection(extent1, extent2), [[0,0], [10,10]]);
            assert.deepEqual(utils.getIntersection(extent2, extent1), [[0,0], [10,10]]);
            
            assert.deepEqual(utils.getIntersection(extent1, extent3), [[ 10, 10 ], [ 10, 10 ] ]);
            assert.deepEqual(utils.getIntersection(extent3, extent1), [[ 10, 10 ], [ 10, 10 ] ]);

            //dont intersect
            assert.deepEqual(utils.getIntersection(extent1, extent4), [[-Infinity, -Infinity], [Infinity, Infinity]]);
            assert.deepEqual(utils.getIntersection(extent4, extent1), [[-Infinity, -Infinity], [Infinity, Infinity]]);
            // assert.deepEqual(extent2, [[-180,-90], [180,90]]);
        })
    })

    describe('getExtentAroundCoortinates', function () {
        it('Check if callback is executed on each tile with params', function () {
            const extent1 = utils.getExtentAroundCoortinates(250, 3, [0,0]);
            const extent2 = utils.getExtentAroundCoortinates(2000, 3, [0,0]);
            assert.deepEqual(extent1, [[-45,-45], [45,45]]);
            assert.deepEqual(extent2, [[-180,-90], [180,90]]);
        })
    })
});
