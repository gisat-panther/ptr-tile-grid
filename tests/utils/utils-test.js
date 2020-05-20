import {assert} from 'chai';
import {
    utils
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
});
