import {describe, it} from 'mocha';
import {forEachTileInGridByLevelAndExtent} from '../../src/grid';
import {assert} from 'chai';

describe('forEachTileInGridByLevelAndExtent', function () {
	it('Iterrate over all tiles in the extent _1', function () {
		const level = 2;
		const extent = [
			[-90, 0],
			[0, 90],
		];
		let tilesCount = 0;
		forEachTileInGridByLevelAndExtent(level, extent, () => {
			++tilesCount;
		});

		assert.deepStrictEqual(tilesCount, 4);
	});

	it('Iterrate over all tiles in the extent _2', function () {
		const level = 25;
		const extent = [
			[-90, -90],
			[-89.99998927116394, -89.99998927116394],
		];
		let tilesCount = 0;
		forEachTileInGridByLevelAndExtent(level, extent, () => {
			++tilesCount;
		});

		assert.deepStrictEqual(tilesCount, 4);
	});
});
