import {describe, it} from 'mocha';
import {assert} from 'chai';
import {utils} from '../../src/';

describe('utils/roundPoint', function () {
	it('Round point [0,0]', function () {
		assert.deepEqual(utils.roundPoint([0, 0]), [0, 0]);
	});

	it('Return null when try to round undefined point', function () {
		assert.equal(utils.roundPoint(), null);
	});

	it('Return null when try to round undefined point _2', function () {
		assert.equal(utils.roundPoint(undefined), null);
	});

	it('Return null when try to round point with undefined coordinates', function () {
		assert.equal(utils.roundPoint([undefined, undefined]), null);
	});

	it('Return null when try to round point with coordinates length of 4', function () {
		assert.equal(utils.roundPoint([0, 0, undefined, undefined]), null);
	});

	it('Return null when try to round point [5.555,5.555]', function () {
		assert.deepEqual(utils.roundPoint([5.555, 5.555]), [5.555, 5.555]);
	});

	it('Return null when try to round point with 15 decimals [5.666666666666666,5.666666666666666]', function () {
		assert.deepEqual(
			utils.roundPoint([5.666666666666666, 5.666666666666666]),
			[5.6666666666667, 5.6666666666667]
		);
	});
});
