import {assert} from 'chai';

import {
	grid,
} from '../../src/';

describe('grid/grid', function () {
	describe('createRenderFn', function () {
		it('getSizeForLevels', function () {

			const level0 = grid.getGridSizeForLevel(0);
			const level1 = grid.getGridSizeForLevel(1);
			const level2 = grid.getGridSizeForLevel(2);
			const level3 = grid.getGridSizeForLevel(3);
			const level4 = grid.getGridSizeForLevel(4);
			const level5 = grid.getGridSizeForLevel(5);
			const level6 = grid.getGridSizeForLevel(6);
			const level7 = grid.getGridSizeForLevel(7);
			const level8 = grid.getGridSizeForLevel(8);
			const level9 = grid.getGridSizeForLevel(9);
			const level10 = grid.getGridSizeForLevel(10);

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
	
	describe('getOrigin', function () {
		it('Origin of extent is [-180, -90]', function () {

			const origin = grid.getOrigin();

			assert.deepEqual(origin, [-180,-90]);
		});
	});

	describe('getGridForLevelAndExtent', function () {
		it('Returns grid for given level by default extent', function () {

			const grid0 = grid.getGridForLevelAndExtent(0);
			const grid0SecondInstance = grid.getGridForLevelAndExtent(0);
			const grid1 = grid.getGridForLevelAndExtent(1);
			const grid2 = grid.getGridForLevelAndExtent(2);
			

			assert.deepEqual(grid0, [
				[[-180,-90], [0,-90]]
			]);

			// //chceck if caching works
			assert.equal(grid0SecondInstance === grid0, true);

			assert.deepEqual(grid1, [
				[[-180,0], [-90,0], [0,0], [90,0]],
				[[-180,-90], [-90,-90], [0,-90], [90,-90]]
			]);
			assert.deepEqual(grid2, [
				[[-180,45], [-135,45], [-90,45], [-45,45], [0,45], [45,45], [90,45], [135,45]],
				[[-180,0], [-135,0], [-90,0], [-45,0], [0,0], [45,0], [90,0], [135,0]],
				[[-180,-45], [-135,-45], [-90,-45], [-45,-45], [0,-45], [45,-45], [90,-45], [135,-45]],
				[[-180,-90], [-135,-90], [-90,-90], [-45,-90], [0,-90], [45,-90], [90,-90], [135,-90]]
			]);
		});
	});

	describe('getGridForLevelAndExtent', function () {
		it('Returns grid for given level and extent', function () {

			const grid0 = grid.getGridForLevelAndExtent(0, [[-180,-90], [-1,90]]);
			const grid1 = grid.getGridForLevelAndExtent(0, [[-180,-90], [0,90]]);
			const grid2 = grid.getGridForLevelAndExtent(2, [[-10,-10], [10,10]]);
			
			assert.deepEqual(grid0, [
				[[-180,-90]]
			]);

			assert.deepEqual(grid1, [
				[[-180,-90],[0,-90]]
			]);

			assert.deepEqual(grid2, [
				[[-45,0], [0,0]],
				[[-45,-45], [0,-45]],
			]);
		});
	});

	describe('getLevelByViewport', function () {
		it('Returns related level by given boxRange and vieportRange', function () {
			const boxRange = 240;
			const viewport = 240;

			const level0 = grid.getLevelByViewport(boxRange, viewport);
			assert.equal(level0, 17);
			
			const level1 = grid.getLevelByViewport(50000000, 250);
			assert.equal(level1, 0);
			
			const level2 = grid.getLevelByViewport(0.000001, 4000);
			assert.equal(level2, 24);

			const level3 = grid.getLevelByViewport(0.00000000000000001, 4000);
			assert.equal(level3, 24);
			
			const level4 = grid.getLevelByViewport(5000000000000000000000, 4000);
			assert.equal(level4, 0);
		});
	});

	describe('getLevelByResolution', function () {
		it('Returns related level by given resolution', function () {
			const resolution0 = 100000; //higher than base resolution
			const resolution1 = 50000; 
			const resolution25 = 0.0000001; //lower than last 25th resolution

			const level0 = grid.getLevelByResolution(resolution0);
			assert.equal(level0, 0);
			const level1 = grid.getLevelByResolution(resolution1);
			assert.equal(level1, 1);
			const level24 = grid.getLevelByResolution(resolution25);
			assert.equal(level24, 24);
		});
	});
});