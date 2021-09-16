import {assert} from 'chai';
import {utils} from '../../src/';

describe('tileAsArray', function () {
	it('Convert string tile to array -90,180', function () {
		assert.deepStrictEqual(utils.tileAsArray('-90,180'), [-90, 180]);
	});
	it('Convert string tile to array 90,-180', function () {
		assert.deepStrictEqual(utils.tileAsArray('90,-180'), [90, -180]);
	});

	it('Convert string tile to array 90.00001,-180.00001', function () {
		assert.deepStrictEqual(
			utils.tileAsArray('90.00001,-180.00001'),
			[90.00001, -180.00001]
		);
	});

	it('Convert string tile to array 90.000000000000001,-180.000000000000001', function () {
		assert.deepStrictEqual(
			utils.tileAsArray('90.000000000000001,-180.000000000000001'),
			[90.000000000000001, -180.000000000000001]
		);
	});

	it('Convert string tile to array 90.000000000000001,0.000000000000001', function () {
		assert.deepStrictEqual(
			utils.tileAsArray('90.000000000000001,0.000000000000001'),
			[90.000000000000001, 0.000000000000001]
		);
	});

	it('Convert string tile to array 90.33333333333333,-180.33333333333333', function () {
		assert.deepStrictEqual(
			utils.tileAsArray('90.33333333333333,-180.33333333333333'),
			[90.33333333333333, -180.33333333333333]
		);
	});

	it('Convert array tile to array [90,-180]', function () {
		assert.deepStrictEqual(utils.tileAsArray([90, -180]), [90, -180]);
	});
	it('Convert array tile to array [`90.001`,`-180.001`]', function () {
		assert.deepStrictEqual(
			utils.tileAsArray(['90.001', '-180.001']),
			[90.001, -180.001]
		);
	});

	it('Convert array tile to array [`90.001,-180.001`]', function () {
		assert.deepStrictEqual(
			utils.tileAsArray(['90.001,-180.001']),
			[90.001, -180.001]
		);
	});

	it('Tryes to convert string `test` to array return null.', function () {
		assert.deepStrictEqual(utils.tileAsArray('test'), null);
	});

	it('Tryes to convert string `test,test` to array return null.', function () {
		assert.deepStrictEqual(utils.tileAsArray('test,test'), null);
	});

	it('Tryes to convert string [`test`,`test`] to array return null.', function () {
		assert.deepStrictEqual(utils.tileAsArray(['test', 'test']), null);
	});

	it('Tryes to convert string [NaN,NaN] to array return null.', function () {
		assert.deepStrictEqual(utils.tileAsArray([NaN, NaN]), null);
	});
});
