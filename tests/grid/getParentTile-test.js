import {describe, it} from 'mocha';
import {getParentTile} from '../../src/grid';
import {assert} from 'chai';

describe('getParentTile', function () {
	it('Returns parent tile for given level and tile', function () {
		const level = 2;
		const tile = [-135, 45];

		const expectedOutput = {
			level: 1,
			tile: [-180, 0],
		};

		assert.deepStrictEqual(getParentTile(level, tile), expectedOutput);
	});

	it('Returns parent tile for given level and tile 2', function () {
		const level = 7;
		const tile = [11.25, 49.21875];

		const expectedOutput = {
			level: 6,
			tile: [11.25, 47.8125],
		};

		assert.deepStrictEqual(getParentTile(level, tile), expectedOutput);
	});

	it('Returns parent tile for given level and tile 3', function () {
		const level = 7;
		const tile = [0, 0];

		const expectedOutput = {
			level: 6,
			tile: [0, 0],
		};

		assert.deepStrictEqual(getParentTile(level, tile), expectedOutput);
	});

	it('Returns null if no level given', function () {
		const level = null;
		const tile = [11.25, 49.21875];

		assert.isNull(getParentTile(level, tile));
	});

	it('Returns null if no tile given', function () {
		const level = 7;
		const tile = null;

		assert.isNull(getParentTile(level, tile));
	});

	it('Returns null if given tile is from first level', function () {
		const level = 0;
		const tile = [-180, -180];

		assert.isNull(getParentTile(level, tile));
	});
});
