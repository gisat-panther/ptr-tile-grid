import {assert} from 'chai';
import {
	getSizeForLevel,
	getGridForLevel,
	getOrigin,
} from '../../src/grid';

describe('grid/grid', function () {
	describe('createRenderFn', function () {
		it('getSizeForLevels', function () {

			const level0 = getSizeForLevel(0);
			const level1 = getSizeForLevel(1);
			const level2 = getSizeForLevel(2);
			const level3 = getSizeForLevel(3);
			const level4 = getSizeForLevel(4);
			const level5 = getSizeForLevel(5);
			const level6 = getSizeForLevel(6);
			const level7 = getSizeForLevel(7);
			const level8 = getSizeForLevel(8);
			const level9 = getSizeForLevel(9);
			const level10 = getSizeForLevel(10);

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

			const origin = getOrigin();

			assert.deepEqual(origin, [-180,-90]);
		});
	});

	describe('getGridForLevel', function () {
		it('Returns grid for given level', function () {

			const grid0 = getGridForLevel(0);
			const grid0SecondInstance = getGridForLevel(0);
			const grid1 = getGridForLevel(1);
			const grid2 = getGridForLevel(2);
			

			assert.deepEqual(grid0, [
				[[-180,-90], [0,-90]]
			]);

			//chceck if caching works
			assert.deepEqual(grid0SecondInstance, [
				[[-180,-90], [0,-90]]
			]);
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
});
