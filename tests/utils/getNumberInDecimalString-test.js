import {assert} from 'chai';
import {utils} from '../../src/';

describe('utils/getNumberInDecimalString', function () {
	it('Get as a string', function () {
		assert.strictEqual(utils.getNumberInDecimalString(1), '1');
		assert.strictEqual(utils.getNumberInDecimalString(1.1), '1.1');

		//with 13 decilals as a maximum
		assert.strictEqual(
			utils.getNumberInDecimalString(-359.1111111111111),
			'-359.1111111111111'
		);
		assert.strictEqual(
			utils.getNumberInDecimalString(-359.11111111111111),
			'-359.1111111111111'
		);
		assert.strictEqual(
			utils.getNumberInDecimalString(
				-359.111111111111111123456787654323456789876543
			),
			'-359.1111111111111'
		);
		//last decimal is rounded
		assert.strictEqual(
			utils.getNumberInDecimalString(-359.11111111111119111),
			'-359.1111111111112'
		);

		assert.strictEqual(utils.getNumberInDecimalString(2e-2), '0.02');
		assert.strictEqual(utils.getNumberInDecimalString(1.23e5), '123000');
	});
});
