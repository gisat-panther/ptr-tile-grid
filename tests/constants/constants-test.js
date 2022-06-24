import {describe, it} from 'mocha';
import {assert} from 'chai';
import {constants} from '../../src/';

describe('constants/constants', function () {
	describe('resolutions', function () {
		it('Check first and last resolution', function () {
			assert.equal(constants.resolutions[0], 80150);
			assert.equal(constants.resolutions[1], 40075);
			assert.equal(constants.resolutions[2], 20037.5);
			assert.equal(constants.resolutions[20], 80150 / Math.pow(2, 20));
			assert.equal(constants.resolutions[24], 80150 / Math.pow(2, 24));
			assert.equal(constants.resolutions.length, 25);
		});
	});
});
