import {describe, it} from 'mocha';
import {getCenterOfTile} from '../../src/grid';
import {assert} from 'chai';

describe('getCenterOfTile', function () {
	it('Returns parent tile for given level and tile', function () {
		const level = 2;
		const tile = [-45, -45];

		const expectedOutput = {
			lat: -22.5,
			lon: -22.5,
		};

		assert.deepStrictEqual(getCenterOfTile(level, tile), expectedOutput);
	});

	it('Returns parent tile for given level and tile 2', function () {
		const level = 7;
		const tile = [11.25, 49.21875];

		const expectedOutput = {
			lat: 49.921875,
			lon: 11.953125,
		};

		assert.deepStrictEqual(getCenterOfTile(level, tile), expectedOutput);
	});

	it('Returns null if no level given', function () {
		const level = null;
		const tile = [11.25, 49.21875];

		assert.isNull(getCenterOfTile(level, tile));
	});

	it('Returns null if no tile given', function () {
		const level = 7;
		const tile = null;

		assert.isNull(getCenterOfTile(level, tile));
	});
});
