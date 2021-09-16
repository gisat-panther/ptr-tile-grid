import {assert} from 'chai';

import {utils} from '../../src/';

describe('utils/getLoadedTiles', function () {
	it('Identify already loaded tiles on same level _1.', function () {
		const level = 2;
		const wanted = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const loaded = {
			2: [
				[-45, 0],
				[0, 0],
				[-45, -45],
				[0, -45],
			],
		};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'SAME'
		);
		assert.deepEqual(intersectionOfLoaded, {
			2: ['-45,0', '0,0', '-45,-45', '0,-45'],
		});
	});

	it('Identify already loaded tiles on same level _2.', function () {
		const level = 2;
		const wanted = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const loaded = {2: []};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'SAME'
		);

		assert.deepEqual(intersectionOfLoaded, null);
	});

	it('Identify already loaded tiles on LOWER level _1.', function () {
		const level = 2;
		const wanted = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[45, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const loaded = {3: ['45,0', '67.5,0', '45,22.5', '67.5,22.5']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'LOWER',
			2
		);

		assert.deepEqual(intersectionOfLoaded, {
			'45,0': {
				level: 3,
				tiles: ['45,0', '67.5,0', '45,22.5', '67.5,22.5'],
			},
		});
	});
	it('Identify already loaded tiles on LOWER level _2.', function () {
		const level = 2;
		const wanted = [
			[-90, 0],
			[-45, 0],
			[0, 0],
			[-90, -45],
			[-45, -45],
			[0, -45],
			[-90, -45],
		];
		const loaded = {3: ['45,0', '67.5,0', '45,22.5', '67.5,22.5']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'LOWER',
			2
		);
		assert.deepEqual(intersectionOfLoaded, {});
	});

	it('Identify already loaded tiles on LOWER level _3.', function () {
		const level = 1;
		const wanted = [
			[-90, 0],
			[0, 0],
			[-90, -90],
			[0, -90],
		];
		const loaded = {
			3: [
				'0,0',
				'22.5,0',
				'45,0',
				'67.5,0',
				'0,22.5',
				'22.5,22.5',
				'45,22.5',
				'67.5,22.5',
				'0,45',
				'22.5,45',
				'45,45',
				'67.5,45',
				'0,67.5',
				'22.5,67.5',
				'45,67.5',
				'67.5,67.5',
			],
		};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'LOWER',
			2
		);
		assert.deepEqual(intersectionOfLoaded, {
			'0,0': {
				level: 3,
				tiles: [
					'0,0',
					'22.5,0',
					'45,0',
					'67.5,0',
					'0,22.5',
					'22.5,22.5',
					'45,22.5',
					'67.5,22.5',
					'0,45',
					'22.5,45',
					'45,45',
					'67.5,45',
					'0,67.5',
					'22.5,67.5',
					'45,67.5',
					'67.5,67.5',
				],
			},
		});
	});

	it('Identify already loaded tiles on LOWER level _4.', function () {
		const level = 24;
		const wanted = [
			[0.000005364418029785156, 0.000005364418029785156],
			[0, 0],
			[-90, -90],
			[0, -90],
		];
		const loaded = {25: ['0,0']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'LOWER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {});
	});

	it('Identify already loaded tiles on HIGHER level _0.', function () {
		const level = 0;
		const wanted = [[0, 0]];
		const loaded = {25: ['0,0']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {});
	});

	it('Identify already loaded tiles on HIGHER level _1.', function () {
		const level = 1;
		const wanted = [[0, 0]];
		const loaded = {0: ['0,-90']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {
			'0,0': {level: 0, tiles: ['0,-90']},
		});
	});

	it('Identify already loaded tiles on HIGHER level _2.', function () {
		const level = 1;
		const wanted = [['0,0']];
		const loaded = {0: ['0,-90']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {
			'0,0': {level: 0, tiles: ['0,-90']},
		});
	});

	it('Identify already loaded tiles on HIGHER level _3.', function () {
		const level = 1;
		const wanted = [['0,0'], ['90,0'], ['-90,0']];
		const loaded = {0: ['0,-90']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {
			'0,0': {level: 0, tiles: ['0,-90']},
			'90,0': {level: 0, tiles: ['0,-90']},
		});
	});

	it('Identify already loaded tiles on HIGHER level _4.', function () {
		const level = 2;
		const wanted = [['0,0'], ['45,0'], ['-45,0']];
		const loaded = {0: ['0,-90'], 1: ['-90,0']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {
			'0,0': {level: 0, tiles: ['0,-90']},
			'45,0': {level: 0, tiles: ['0,-90']},
			'-45,0': {level: 1, tiles: ['-90,0']},
		});
	});

	it('Identify already loaded tiles on HIGHER level _5.', function () {
		const level = 25;
		const wanted = [['0,0'], ['45,0'], ['-45,0']];
		const loaded = {0: ['0,-90'], 1: ['-90,0']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			4
		);
		assert.deepEqual(intersectionOfLoaded, {});
	});
	it('Identify already loaded tiles on HIGHER level _6.', function () {
		const level = 25;
		const wanted = [['0,0'], ['45,0'], ['-45,0']];
		const loaded = {0: ['0,-90'], 1: ['-90,0']};
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			25
		);
		assert.deepEqual(intersectionOfLoaded, {
			'0,0': {level: 0, tiles: ['0,-90']},
			'45,0': {level: 0, tiles: ['0,-90']},
			'-45,0': {level: 1, tiles: ['-90,0']},
		});
	});

	it('Identify already loaded tiles on HIGHER level _7.', function () {
		// exceed maximum levels
		const level = 26;
		const wanted = [['0,0'], ['45,0'], ['-45,0']];
		const loaded = {0: ['0,-90'], 1: ['-90,0']};
		debugger;
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			25
		);
		assert.deepEqual(intersectionOfLoaded, undefined);
	});

	it('Identify already loaded tiles on HIGHER level _8.', function () {
		const level = 25;
		const wanted = [['0,0'], ['45,0'], ['-45,0']];
		const loaded = {0: ['0,-90'], 1: ['-90,0']};
		debugger;
		const intersectionOfLoaded = utils.getLoadedTiles(
			level,
			wanted,
			loaded,
			'HIGHER',
			24
		);
		assert.deepEqual(intersectionOfLoaded, {
			'-45,0': {level: 1, tiles: ['-90,0']},
		});
	});
});
