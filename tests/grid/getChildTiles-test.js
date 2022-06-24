import {describe, it} from 'mocha';
import {getChildTiles} from '../../src/grid';
import {assert} from 'chai';

describe('getChildTiles', function () {
	it('Returns child tiles for given level and tile', function () {
		const level = 2;
		const tile = [0, 0];

		const expectedOutput = [
			{
				level: 3,
				tile: [0, 0],
			},
			{
				level: 3,
				tile: [22.5, 0],
			},
			{
				level: 3,
				tile: [0, 22.5],
			},
			{
				level: 3,
				tile: [22.5, 22.5],
			},
		];

		assert.sameDeepMembers(getChildTiles(level, tile), expectedOutput);
	});

	it('Returns child tiles for given level and tile 2', function () {
		const level = 6;
		const tile = [11.25, -47.8125];

		const expectedOutput = [
			{
				level: 7,
				tile: [11.25, -46.40625],
			},
			{
				level: 7,
				tile: [11.25, -47.8125],
			},
			{
				level: 7,
				tile: [12.65625, -46.40625],
			},
			{
				level: 7,
				tile: [12.65625, -47.8125],
			},
		];

		assert.sameDeepMembers(getChildTiles(level, tile), expectedOutput);
	});

	it('Returns null if no level given', function () {
		const level = null;
		const tile = [11.25, 49.21875];

		assert.isNull(getChildTiles(level, tile));
	});

	it('Returns null if no tile given', function () {
		const level = 7;
		const tile = null;

		assert.isNull(getChildTiles(level, tile));
	});

	it('Returns null if given tile is from the last level', function () {
		const level = 24;
		const tile = [0, 0];

		assert.isNull(getChildTiles(level, tile));
	});
});
