import {assert} from 'chai';
import {utils} from '../../src/';

describe('utils/precision', function () {
	it('Get right precision', function () {
		assert.strictEqual(utils.precision(1), 0);
		assert.strictEqual(utils.precision(100), 0);
		assert.strictEqual(utils.precision(1000000000), 0);

		//for non finity numbers
		assert.strictEqual(utils.precision(Infinity), 0);
		assert.strictEqual(utils.precision(-Infinity), 0);
		assert.strictEqual(utils.precision(NaN), 0);
		assert.strictEqual(utils.precision(null), 0);

		//for decimal numbers
		assert.strictEqual(utils.precision(1.1), 1);
		assert.strictEqual(utils.precision(1.333), 3);
		assert.strictEqual(utils.precision(1.4444), 4);
		assert.strictEqual(utils.precision(1.1111111111111111), 16);

		// detect only 16 decimals even if original is with 20.
		assert.strictEqual(utils.precision(0.11111111111111111111), 16);

		// detect only 14 decimals even if original is with 16.
		// Negative sign and more numbers takes space from 64bit.
		assert.strictEqual(utils.precision(-20.1111111111111111), 14);

		// Maximum is 13 decimals for negative possible coordinates
		assert.strictEqual(utils.precision(-359.11111111111111111111), 13);

		// Decimals are rounded
		assert.strictEqual(utils.precision(-359.99999999999999999999), 0);
		assert.strictEqual(utils.precision(-359.89999999999999999999), 1);
		assert.strictEqual(utils.precision(-359.99999999999919999999), 13);
	});
});
