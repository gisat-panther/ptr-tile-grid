import {assert} from 'chai';

import {utils} from '../../src/';

describe('utils/getTilesIntersection', function () {
	it('Intersection tiles _1', function () {
		const tilesA = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const tilesB = [
			[-45, 0],
			[0, 0],
			[-45, -45],
			[0, -45],
		];
		const intersection = utils.getTilesIntersection(tilesA, tilesB);

		assert.deepEqual(intersection, ['-45,0', '0,0', '-45,-45', '0,-45']);
	});
	it('Intersection tiles _2', function () {
		const tilesA = [
			[-45, 0],
			[0, 0],
			[-45, -45],
			[0, -45],
		];
		const tilesB = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const intersection = utils.getTilesIntersection(tilesA, tilesB);

		assert.deepEqual(intersection, ['-45,0', '0,0', '-45,-45', '0,-45']);
	});

	it('Intersection tiles _3', function () {
		const tilesA = [
			[-45, 0],
			[0, 0],
			[-45, -45],
			[0, -45],
			[55, 55],
		];
		const tilesB = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const intersection = utils.getTilesIntersection(tilesA, tilesB);

		assert.deepEqual(intersection, ['-45,0', '0,0', '-45,-45', '0,-45']);
	});
	it('Intersection tiles _4', function () {
		const tilesA = [[55, 55]];
		const tilesB = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const intersection = utils.getTilesIntersection(tilesA, tilesB);

		assert.deepEqual(intersection, []);
	});
});
