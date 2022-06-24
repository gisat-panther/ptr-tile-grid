import {describe, it} from 'mocha';
import {assert} from 'chai';
import {utils} from '../../src/';

describe('getLoadedTilesByDirection', function () {
	it('Identify loaded tiles from higher level', function () {
		const level = 1;
		const wanted = [[0, 0]];
		const loaded = {
			0: [[0, -90]],
		};
		const direction = 'HIGHER';
		const dept = 1;
		const loadedTiles = utils.getLoadedTilesByDirection(
			level,
			wanted,
			loaded,
			direction,
			dept
		);
		assert.deepEqual(loadedTiles, {'0,0': {level: 0, tiles: ['0,-90']}});
	});

	it('Identify loaded tiles from higher level in dept 2', function () {
		const level = 2;
		const wanted = [[0, 0]];
		const loaded = {
			0: [[0, -90]],
		};
		const direction = 'HIGHER';
		const dept = 2;
		const loadedTiles = utils.getLoadedTilesByDirection(
			level,
			wanted,
			loaded,
			direction,
			dept
		);
		assert.deepEqual(loadedTiles, {'0,0': {level: 0, tiles: ['0,-90']}});
	});

	it('Dont identify loaded tiles from higher level in dept 3', function () {
		const level = 3;
		const wanted = [[0, 0]];
		const loaded = {
			0: [[0, -90]],
		};
		const direction = 'HIGHER';
		const dept = 2;
		const loadedTiles = utils.getLoadedTilesByDirection(
			level,
			wanted,
			loaded,
			direction,
			dept
		);
		assert.deepEqual(loadedTiles, {});
	});

	it('Identify loaded tiles from lower level in dept 1', function () {
		const level = 0;
		const wanted = [[0, -90]];
		const loaded = {
			1: [
				[0, -90],
				[90, -90],
				[0, 0],
				[90, 0],
			],
		};
		const direction = 'LOWER';
		const dept = 1;
		const loadedTiles = utils.getLoadedTilesByDirection(
			level,
			wanted,
			loaded,
			direction,
			dept
		);
		assert.deepEqual(loadedTiles, {
			'0,-90': {level: 1, tiles: ['0,-90', '90,-90', '0,0', '90,0']},
		});
	});

	it('Identify loaded tiles from lower level in dept 2', function () {
		const level = 0;
		const wanted = [[0, -90]];
		const loaded = {
			1: [],
			2: [
				[0, -90],
				[0, -45],
				[0, 0],
				[0, 45],
				[45, -90],
				[45, -45],
				[45, 0],
				[45, 45],
				[90, -90],
				[90, -45],
				[90, 0],
				[90, 45],
				[135, -90],
				[135, -45],
				[135, 0],
				[135, 45],
			],
		};
		const direction = 'LOWER';
		const dept = 2;
		const loadedTiles = utils.getLoadedTilesByDirection(
			level,
			wanted,
			loaded,
			direction,
			dept
		);
		assert.deepEqual(loadedTiles, {
			'0,-90': {
				level: 2,
				tiles: [
					'0,-90',
					'45,-90',
					'90,-90',
					'135,-90',
					'0,-45',
					'45,-45',
					'90,-45',
					'135,-45',
					'0,0',
					'45,0',
					'90,0',
					'135,0',
					'0,45',
					'45,45',
					'90,45',
					'135,45',
				],
			},
		});
	});
	it('Identify loaded tiles from lower level 5 in dept 2', function () {
		const level = 5;
		const wanted = [
			[-5.625, 56.25],
			[0, 56.25],
			[5.625, 56.25],
			[11.25, 56.25],
			[16.875, 56.25],
			[22.5, 56.25],
			[28.125, 56.25],
			[-5.625, 50.625],
			[0, 50.625],
			[5.625, 50.625],
			[11.25, 50.625],
			[16.875, 50.625],
			[22.5, 50.625],
			[28.125, 50.625],
			[-5.625, 45],
			[0, 45],
			[5.625, 45],
			[11.25, 45],
			[16.875, 45],
			[22.5, 45],
			[28.125, 45],
			[-5.625, 39.375],
			[0, 39.375],
			[5.625, 39.375],
			[11.25, 39.375],
			[16.875, 39.375],
			[22.5, 39.375],
			[28.125, 39.375],
		];
		const loaded = {
			6: [],
			7: [
				'9.84375,52.03125',
				'11.25,52.03125',
				'12.65625,52.03125',
				'14.0625,52.03125',
				'15.46875,52.03125',
				'16.875,52.03125',
				'18.28125,52.03125',
				'9.84375,50.625',
				'11.25,50.625',
				'12.65625,50.625',
				'14.0625,50.625',
				'15.46875,50.625',
				'16.875,50.625',
				'18.28125,50.625',
				'9.84375,49.21875',
				'11.25,49.21875',
				'12.65625,49.21875',
				'14.0625,49.21875',
				'15.46875,49.21875',
				'16.875,49.21875',
				'18.28125,49.21875',
				'9.84375,47.8125',
				'11.25,47.8125',
				'12.65625,47.8125',
				'14.0625,47.8125',
				'15.46875,47.8125',
				'16.875,47.8125',
				'18.28125,47.8125',
				'9.84375,46.40625',
				'11.25,46.40625',
				'12.65625,46.40625',
				'14.0625,46.40625',
				'15.46875,46.40625',
				'16.875,46.40625',
				'18.28125,46.40625',
			],
		};
		const direction = 'LOWER';
		const dept = 2;
		const loadedTiles = utils.getLoadedTilesByDirection(
			level,
			wanted,
			loaded,
			direction,
			dept
		);
		assert.deepEqual(loadedTiles, {});
	});
});
