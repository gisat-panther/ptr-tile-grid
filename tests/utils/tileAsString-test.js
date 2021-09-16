import {assert} from 'chai';
import {utils} from '../../src/';

describe('tileAsString', function () {
	it('Convert array tile to string [-90,180]', function () {
		assert.strictEqual(utils.tileAsString([-90, 180]), '-90,180');
	});

	it('Convert array tile to string [90,-180]', function () {
		assert.strictEqual(utils.tileAsString([90, -180]), '90,-180');
	});

	it('Convert array tile to string [`90`,`-180`]', function () {
		assert.strictEqual(utils.tileAsString(['90', '-180']), '90,-180');
	});

	it('Convert string tile to string `90,-180`', function () {
		assert.strictEqual(utils.tileAsString('90,-180'), '90,-180');
	});

	it('Convert string tile to string [`90,-180`]', function () {
		assert.strictEqual(utils.tileAsString(['90,-180']), '90,-180');
	});

	it('Convert string tile to string [`0,1e10-2`]', function () {
		assert.strictEqual(utils.tileAsString([0, 1e-2]), '0,0.01');
	});

	it('Convert string tile to string [`0,1e10-5`]', function () {
		assert.strictEqual(utils.tileAsString([0, 1e-5]), '0,0.00001');
	});

	it('Convert string tile to string [`0,0.0000000001`]', function () {
		assert.strictEqual(utils.tileAsString([0, 0.0000000001]), '0,0.0000000001');
	});
});
