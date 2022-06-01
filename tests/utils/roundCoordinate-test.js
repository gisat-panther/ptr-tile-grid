/* eslint-disable no-loss-of-precision */
import {describe, it} from 'mocha';
import {assert} from 'chai';
import {utils} from '../../src/';

describe('utils/roundCoordinate', function () {
	it('Round coordinate 0', function () {
		assert.equal(utils.roundCoordinate(0), 0);
	});

	it('Return null when try to round NaN', function () {
		assert.equal(utils.roundCoordinate(NaN), null);
	});

	it('Return null when try to round undefined', function () {
		assert.equal(utils.roundCoordinate(), null);
	});

	it('Return null when try to round undefined _2', function () {
		assert.equal(utils.roundCoordinate(undefined), null);
	});

	it('Return null when try to round Infinity', function () {
		assert.equal(utils.roundCoordinate(Infinity), null);
	});

	it('Round 1', function () {
		assert.equal(utils.roundCoordinate(1), 1);
	});

	it('Round 1.1', function () {
		assert.equal(utils.roundCoordinate(1.1), 1.1);
	});

	it('Round -1.1', function () {
		assert.equal(utils.roundCoordinate(-1.1), -1.1);
	});

	it('Round 13 decimals -180.9999999999999', function () {
		assert.equal(utils.roundCoordinate(-180.9999999999999), -180.9999999999999);
	});

	it('Round 14 decimals -180.99999999999999', function () {
		assert.equal(utils.roundCoordinate(-181), -181);
	});

	it('Round 20 decimals -180.11111111111111111111', function () {
		assert.equal(
			utils.roundCoordinate(-180.11111111111111111111),
			-180.1111111111111
		);
	});

	it('Round 20 decimals -180.11111111111114111111', function () {
		assert.equal(
			utils.roundCoordinate(-180.11111111111114111111),
			-180.1111111111111
		);
	});

	it('Round 20 decimals -180.11111111111115111111', function () {
		assert.equal(
			utils.roundCoordinate(-180.11111111111115111111),
			-180.1111111111111
		);
	});

	it('Round 20 decimals -180.11111111111116111111', function () {
		assert.equal(
			utils.roundCoordinate(-180.11111111111116111111),
			-180.1111111111112
		);
	});

	it('Round 20 decimals 180.11111111111114111111', function () {
		assert.equal(
			utils.roundCoordinate(180.11111111111114111111),
			180.1111111111111
		);
	});

	it('Round 20 decimals 180.11111111111115111111', function () {
		assert.equal(
			utils.roundCoordinate(180.11111111111115111111),
			180.1111111111111
		);
	});

	it('Round 20 decimals 180.11111111111116111111', function () {
		assert.equal(
			utils.roundCoordinate(180.11111111111116111111),
			180.1111111111112
		);
	});
});
