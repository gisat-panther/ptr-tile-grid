import {assert} from 'chai';

import {
	grid,
} from '../../src/';

describe('grid/grid', function () {	
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
			const grid3 = grid.getGridForLevelAndExtent(2, [[-180, -80], [116, 39]]);
			const grid4 = grid.getGridForLevelAndExtent(1, [[-180, 46.95954441138797],[17.40234375000064, 86.80434844068677]], true);
			
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

			assert.deepEqual(grid3, [
				[
					[
						-180,
						0
					],
					[
						-135,
						0
					],
					[
						-90,
						0
					],
					[
						-45,
						0
					],
					[
						0,
						0
					],
					[
						45,
						0
					],
					[
						90,
						0
					]
				],
				[
					[
						-180,
						-45
					],
					[
						-135,
						-45
					],
					[
						-90,
						-45
					],
					[
						-45,
						-45
					],
					[
						0,
						-45
					],
					[
						45,
						-45
					],
					[
						90,
						-45
					]
				],
				[
					[
						-180,
						-90
					],
					[
						-135,
						-90
					],
					[
						-90,
						-90
					],
					[
						-45,
						-90
					],
					[
						0,
						-90
					],
					[
						45,
						-90
					],
					[
						90,
						-90
					]
				]
			]);

			assert.deepEqual(grid4, 
				[
					[
					[
						-180,
						0
					],
					[
						-90,
						0
					],
					[
						0,
						0
					]
					]
				]
			);
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