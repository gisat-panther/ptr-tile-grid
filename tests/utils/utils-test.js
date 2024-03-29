/* eslint-disable no-loss-of-precision */
import {describe, it} from 'mocha';
import {assert} from 'chai';
import {utils, constants} from '../../src/';

describe('utils/utils', function () {
	describe('getExtentID', function () {
		it('Check correct id generated from extent', function () {
			const extent = [
				[1, -50],
				[120, 20],
			];
			const extentId = utils.getExtentID(extent);

			assert.equal(extentId, '1-5012020');
		});
	});

	describe('closestDivisibleHigher', function () {
		it('Check correct number rounding', function () {
			assert.equal(utils.closestDivisibleHigher(0, 180), 0);
			assert.equal(utils.closestDivisibleHigher(1, 180), 180);
			assert.equal(utils.closestDivisibleHigher(180, 180), 180);
			assert.equal(utils.closestDivisibleHigher(100, 33), 132);
			assert.equal(utils.closestDivisibleHigher(1.5555, 2), 2);
			assert.equal(utils.closestDivisibleHigher(-91, 45), -90);
			assert.equal(utils.closestDivisibleHigher(-95, 180), 0);
			assert.equal(utils.closestDivisibleHigher(90, 90), 90);
			assert.equal(
				utils.closestDivisibleHigher(-2763046333156462, 1406250000000000),
				-1406250000000000
			);
			assert.equal(
				utils.closestDivisibleHigher(-2.763046333156462, 1.40625),
				-1.40625
			);
			assert.equal(
				utils.closestDivisibleHigher(5.00000000000000001, 0.17578125),
				5.09765625
			);

			const level20size = utils.getGridSizeForLevel(20);
			assert.equal(
				utils.closestDivisibleHigher(5.000000000000000000001, level20size),
				5.000152587890624
			);
			const level10size = utils.getGridSizeForLevel(10);
			assert.equal(
				utils.closestDivisibleHigher(5.000000000000000000001, level10size),
				5.09765625
			);

			assert.equal(utils.closestDivisibleHigher(0.1, 0.2), 0.2);
			assert.equal(
				utils.closestDivisibleHigher(0.0000000001, 0.0000000002),
				0.0000000002
			);

			assert.equal(utils.closestDivisibleHigher(0.0000000001, 0), 0.0000000001);

			assert.equal(
				utils.closestDivisibleHigher(-24.236353660881438, 5.625),
				-22.5
			);

			const level24size = utils.getGridSizeForLevel(24);
			assert.equal(utils.closestDivisibleHigher(0, level24size), 0);

			assert.equal(
				utils.closestDivisibleHigher(0.0000108, level24size),
				0.000021457672119140625
			);
		});
	});

	describe('closestDivisibleLower', function () {
		it('Check correct number rounding', function () {
			assert.equal(utils.closestDivisibleLower(90, 90), 90);
			assert.equal(utils.closestDivisibleLower(-91, 45), -135);
			assert.equal(utils.closestDivisibleLower(-90, 45), -90);
			assert.equal(utils.closestDivisibleLower(0, 180), 0);
			assert.equal(utils.closestDivisibleLower(100, 33), 99);
			assert.equal(utils.closestDivisibleLower(1.5555, 2), 0);
			assert.equal(
				utils.closestDivisibleLower(-2.763046333156462, 1.40625),
				-2.8125
			);

			assert.equal(
				utils.closestDivisibleLower(5.00000000000000001, 0.17578125),
				4.921875
			);

			const level20size = utils.getGridSizeForLevel(20);
			assert.equal(
				utils.closestDivisibleLower(5.000000000000000000001, level20size),
				4.999980926513672
			);
			const level10size = utils.getGridSizeForLevel(10);
			assert.equal(
				utils.closestDivisibleLower(5.000000000000000000001, level10size),
				4.921875
			);

			assert.equal(utils.closestDivisibleLower(0.1, 0.2), 0);
			assert.equal(utils.closestDivisibleLower(0.0000000001, 0.0000000002), 0);
			assert.equal(
				utils.closestDivisibleLower(0.000000000000002, 0.000000000000001),
				0.000000000000002
			);
			assert.equal(utils.closestDivisibleLower(0.1, 0), 0.1);

			assert.equal(utils.closestDivisibleLower(0.7709771100106658, 1.40625), 0);
			assert.equal(
				utils.closestDivisibleLower(-0.7709771100106658, 1.40625),
				-1.40625
			);
			assert.equal(utils.closestDivisibleLower(-1.40625, 1.40625), -1.40625);
			assert.equal(utils.closestDivisibleLower(-1.40626, 1.40625), -2.8125);
			assert.equal(utils.closestDivisibleLower(1.40625, 1.40625), 1.40625);
			assert.equal(utils.closestDivisibleLower(1.40626, 1.40625), 1.40625);

			assert.equal(
				utils.closestDivisibleLower(-24.236353660881438, 5.625),
				-28.125
			);

			const level24size = utils.getGridSizeForLevel(24);
			assert.equal(utils.closestDivisibleLower(0, level24size), 0);

			assert.equal(
				// utils.closestDivisibleLower(0.000010728836059570313, level24size),
				utils.closestDivisibleLower(0.0000108, level24size),
				0.000010728836059570312
			);
		});
	});

	describe('containsXY', function () {
		it('Check if point is inside extent', function () {
			assert.equal(utils.containsXY(constants.LEVEL_BOUNDARIES, [0, 0]), true);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [180, 0]),
				true
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [180, -90]),
				true
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [180, 90]),
				true
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [-180, 90]),
				true
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [-180, -90]),
				true
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [-179, -89]),
				true
			);

			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [180, -91]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [181, -90]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [-181, -90]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [-360, -90]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [180, 90.1]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [0, 90.1]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [0, -90.1]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [180.1, 0]),
				false
			);
			assert.equal(
				utils.containsXY(constants.LEVEL_BOUNDARIES, [-180.1, 0]),
				false
			);
		});
	});

	describe('containsExtent', function () {
		it('Check if extent is inside extent', function () {
			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[0, 0],
					[10, 10],
				]),
				true
			);
			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[-180, -90],
					[180, 90],
				]),
				true
			);
			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[-180, -90],
					[0, 0],
				]),
				true
			);

			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[-180, -90],
					[180, 91],
				]),
				false
			);
			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[-180, -90],
					[181, 90],
				]),
				false
			);
			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[-180, -91],
					[180, 90],
				]),
				false
			);
			assert.equal(
				utils.containsExtent(constants.LEVEL_BOUNDARIES, [
					[-181, -90],
					[180, 90],
				]),
				false
			);
		});
	});

	describe('getGridSizeForLevel', function () {
		it('getSizeForLevels', function () {
			const level0 = utils.getGridSizeForLevel(0);
			const level1 = utils.getGridSizeForLevel(1);
			const level2 = utils.getGridSizeForLevel(2);
			const level3 = utils.getGridSizeForLevel(3);
			const level4 = utils.getGridSizeForLevel(4);
			const level5 = utils.getGridSizeForLevel(5);
			const level6 = utils.getGridSizeForLevel(6);
			const level7 = utils.getGridSizeForLevel(7);
			const level8 = utils.getGridSizeForLevel(8);
			const level9 = utils.getGridSizeForLevel(9);
			const level10 = utils.getGridSizeForLevel(10);

			assert.equal(level0, 180);
			assert.equal(level1, 90);
			assert.equal(level2, 45);
			assert.equal(level3, 22.5);
			assert.equal(level4, 11.25);
			assert.equal(level5, 5.625);
			assert.equal(level6, 2.8125);
			assert.equal(level7, 1.40625);
			assert.equal(level8, 0.703125);
			assert.equal(level9, 0.3515625);
			assert.equal(level10, 0.17578125);
		});
	});

	describe('forEachTile', function () {
		it('Check if callback is executed on each tile with params', function () {
			const tileSet = [
				[
					[-180, -90],
					[0, -90],
				],
			];
			let tilesCount = 0;
			utils.forEachTile(tileSet, () => {
				++tilesCount;
			});
			assert.equal(tilesCount, 2);
		});
	});

	describe('getTileAsPolygon', function () {
		it('Check if returned polygon is correct for given tile', function () {
			const correctPolygon1 = {
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[0, 0],
							[0, 90],
							[90, 90],
							[90, 0],
							[0, 0],
						],
					],
				},
			};
			const polygon1 = utils.getTileAsPolygon([0, 0], 90);
			assert.deepEqual(polygon1, correctPolygon1);
		});

		it('Check if returned polygon is correct for given tile in string', function () {
			const correctPolygon1 = {
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[0, 0],
							[0, 90],
							[90, 90],
							[90, 0],
							[0, 0],
						],
					],
				},
			};
			const polygon1 = utils.getTileAsPolygon(['0', '0'], 90);
			assert.deepEqual(polygon1, correctPolygon1);
		});
		it('Check if getTileAsPolygon throw fail', function () {
			assert.throws(
				() => utils.getTileAsPolygon([190, 90], 90, false),
				Error,
				'Point 190,90 does not lies in base extent.'
			);
		});
	});

	describe('getTileGridAsGeoJSON', function () {
		it('Check if returned polygon is correct for given tile', function () {
			const correctPolygon1 = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[0, 0],
									[0, 90],
									[90, 90],
									[90, 0],
									[0, 0],
								],
							],
						},
					},
				],
			};
			const polygon1 = utils.getTileGridAsGeoJSON([[[0, 0]]], 90);
			assert.deepEqual(polygon1, correctPolygon1);
		});
	});

	describe('intersects', function () {
		it('Determinate if two extents intersects.', function () {
			const extent1 = [
				[0, 0],
				[10, 10],
			];
			const extent2 = [
				[0, 0],
				[20, 20],
			];
			const extent3 = [
				[10, 10],
				[20, 20],
			];
			const extent4 = [
				[15, 15],
				[20, 20],
			];
			const extent5 = [
				[5, 5],
				[15, 15],
			];
			assert.deepEqual(utils.intersects(extent1, extent2), true);
			assert.deepEqual(utils.intersects(extent2, extent1), true);

			assert.deepEqual(utils.intersects(extent1, extent3), true);
			assert.deepEqual(utils.intersects(extent3, extent1), true);

			assert.deepEqual(utils.intersects(extent3, extent5), true);
			assert.deepEqual(utils.intersects(extent5, extent3), true);

			//dont intersect
			assert.deepEqual(utils.intersects(extent1, extent4), false);
			assert.deepEqual(utils.intersects(extent4, extent1), false);
		});
	});

	describe('getIntersection', function () {
		it('Clip one extent by other', function () {
			const extent1 = [
				[0, 0],
				[10, 10],
			];
			const extent2 = [
				[0, 0],
				[20, 20],
			];
			const extent3 = [
				[10, 10],
				[20, 20],
			];
			const extent4 = [
				[15, 15],
				[20, 20],
			];
			assert.deepEqual(utils.getIntersection(extent1, extent2), [
				[0, 0],
				[10, 10],
			]);
			assert.deepEqual(utils.getIntersection(extent2, extent1), [
				[0, 0],
				[10, 10],
			]);

			assert.deepEqual(utils.getIntersection(extent1, extent3), [
				[10, 10],
				[10, 10],
			]);
			assert.deepEqual(utils.getIntersection(extent3, extent1), [
				[10, 10],
				[10, 10],
			]);

			//dont intersect
			assert.deepEqual(utils.getIntersection(extent1, extent4), [
				[-Infinity, -Infinity],
				[Infinity, Infinity],
			]);
			assert.deepEqual(utils.getIntersection(extent4, extent1), [
				[-Infinity, -Infinity],
				[Infinity, Infinity],
			]);
			// assert.deepEqual(extent2, [[-180,-90], [180,90]]);
		});
	});

	describe('getExtentAroundCoordinates', function () {
		it('Returns extent', function () {
			const extent1 = utils.getExtentAroundCoordinates(
				[-179, 89],
				78271.51696402048,
				1,
				50
			);
			assert.deepEqual(extent1, [
				[-179.5475301886502, 88.9904439898096],
				[-178.4524698113498, 89.0095560101902],
			]);
		});

		it('Fix extent and returns extent', function () {
			const extent2 = utils.getExtentAroundCoordinates(
				[-179, 50],
				20000000,
				1,
				50
			);
			assert.deepEqual(extent2, [
				[91.0436063429503, -39.932160591873],
				[-89.0436063429504, 40.067839408127],
			]);

			const extent1 = utils.getExtentAroundCoordinates(
				[-181, 50],
				20000000,
				1,
				50,
				true
			);
			assert.deepEqual(extent1, [
				[89.0436063429504, -39.932160591873],
				[-91.0436063429504, 40.067839408127],
			]);
		});

		it('Throw error, coordinates does not lies in extent', function () {
			assert.throws(
				() =>
					utils.getExtentAroundCoordinates(
						[200, 100],
						78271.51696402048,
						0.5,
						50
					),
				Error,
				'Point 200,100 does not lies in base extent.'
			);
			assert.throws(
				() =>
					utils.getExtentAroundCoordinates(
						[-200, -100],
						78271.51696402048,
						0.5,
						50
					),
				Error,
				'Point -200,-100 does not lies in base extent.'
			);
		});

		it('Check if callback is executed on each tile with params', function () {
			const extent1 = utils.getExtentAroundCoordinates(
				[0, 0],
				78271.51696402048,
				1,
				50
			);
			const extent2 = utils.getExtentAroundCoordinates(
				[0, 0],
				78271.51696402048,
				2,
				50
			);
			const extent3 = utils.getExtentAroundCoordinates(
				[0, 0],
				78271.51696402048,
				0.5,
				50
			);
			assert.deepEqual(extent1, [
				[-0.5475468511917, -0.5475468511917],
				[0.5475468511917, 0.5475468511917],
			]);
			assert.deepEqual(extent2, [
				[-1.0950937023834, -0.5475468511917],
				[1.0950937023834, 0.5475468511917],
			]);
			assert.deepEqual(extent3, [
				[-0.5475468511917, -1.0950937023834],
				[0.5475468511917, 1.0950937023834],
			]);
			assert.deepEqual(extent3, [
				[-0.5475468511917, -1.0950937023834],
				[0.5475468511917, 1.0950937023834],
			]);
		});
	});
});

describe('checkPointIntegrity', function () {
	it('Throw error', function () {
		assert.throws(
			() => utils.checkPointIntegrity([190, 90]),
			Error,
			'Point 190,90 does not lies in base extent.'
		);
		assert.throws(
			() => utils.checkPointIntegrity([-190, 90]),
			Error,
			'Point -190,90 does not lies in base extent.'
		);
		assert.throws(
			() => utils.checkPointIntegrity([90, 200]),
			Error,
			'Point 90,200 does not lies in base extent.'
		);
		assert.throws(
			() => utils.checkPointIntegrity([90, -200]),
			Error,
			'Point 90,-200 does not lies in base extent.'
		);
	});

	it('Does not throw error', function () {
		assert.equal(utils.checkPointIntegrity([180, 90]), true);
		assert.equal(utils.checkPointIntegrity([-180, -90]), true);
		assert.equal(utils.checkPointIntegrity([-179, -90]), true);
		assert.equal(utils.checkPointIntegrity([0, 0]), true);
	});
});

describe('checkExtentIntegrity', function () {
	// const a = utils.checkExtentIntegrity([[-190,-100],[190,100]]);

	it('Throw error', function () {
		assert.throws(
			() =>
				utils.checkExtentIntegrity([
					[-190, -100],
					[190, 100],
				]),
			Error,
			'Extent -190,-100,190,100 does not lies in base extent.'
		);
		assert.throws(
			() =>
				utils.checkExtentIntegrity([
					[-190, -90],
					[180, 90],
				]),
			Error,
			'Extent -190,-90,180,90 does not lies in base extent.'
		);
		assert.throws(
			() =>
				utils.checkExtentIntegrity([
					[90, 90],
					[180, 200],
				]),
			Error,
			'Extent 90,90,180,200 does not lies in base extent.'
		);
		assert.throws(
			() =>
				utils.checkExtentIntegrity([
					[90, -200],
					[180, -300],
				]),
			Error,
			'Extent 90,-200,180,-300 does not lies in base extent.'
		);
	});

	it('Does not throw error', function () {
		assert.equal(
			utils.checkExtentIntegrity([
				[-180, -90],
				[90, 90],
			]),
			true
		);
		assert.equal(
			utils.checkExtentIntegrity([
				[-179, -90],
				[90, 90],
			]),
			true
		);
		assert.equal(
			utils.checkExtentIntegrity([
				[0, 0],
				[90, 90],
			]),
			true
		);
	});
});

describe('ensurePointIntegrity', function () {
	it('Fix point coords', function () {
		assert.deepEqual(utils.ensurePointIntegrity([190, 150]), [-170, 90]);
		assert.deepEqual(utils.ensurePointIntegrity([190, 100]), [-170, 90]);
		assert.deepEqual(utils.ensurePointIntegrity([-195, -300]), [165, -90]);
	});

	it('Keep point coords untouched', function () {
		assert.deepEqual(utils.ensurePointIntegrity([180, 90]), [180, 90]);
		assert.deepEqual(utils.ensurePointIntegrity([-170, 0]), [-170, 0]);
		assert.deepEqual(utils.ensurePointIntegrity([-19, -30]), [-19, -30]);
	});
});

describe('ensurePointInWorldBBox', function () {
	it('Fix point coords', function () {
		assert.deepEqual(utils.ensurePointInWorldBBox([190, 150]), [180, 90]);
		assert.deepEqual(utils.ensurePointInWorldBBox([190, 100]), [180, 90]);
		assert.deepEqual(utils.ensurePointInWorldBBox([-195, -300]), [-180, -90]);
	});

	it('Keep point coords untouched', function () {
		assert.deepEqual(utils.ensurePointInWorldBBox([180, 90]), [180, 90]);
		assert.deepEqual(utils.ensurePointInWorldBBox([-170, 0]), [-170, 0]);
		assert.deepEqual(utils.ensurePointInWorldBBox([-19, -30]), [-19, -30]);
	});
});

describe('ensureExtentIntegrity', function () {
	it('Fix extent coords', function () {
		assert.deepEqual(
			utils.ensureExtentIntegrity([
				[190, -150],
				[-190, 150],
			]),
			[
				[-170, -90],
				[170, 90],
			]
		);
	});
	it('Keep extent coords untouched', function () {
		assert.deepEqual(
			utils.ensureExtentIntegrity([
				[-90, -15],
				[19, 15],
			]),
			[
				[-90, -15],
				[19, 15],
			]
		);
	});
});

describe('utils/precision', function () {
	it('Get right precision', function () {
		assert.deepEqual(utils.precision(null), 0);
		assert.deepEqual(utils.precision(''), 0);
		assert.deepEqual(utils.precision(undefined), 0);

		assert.deepEqual(utils.precision(0), 0);
		assert.deepEqual(utils.precision(10), 0);
		assert.deepEqual(utils.precision(100000), 0);
		assert.deepEqual(utils.precision(2e10 - 15), 0);

		assert.deepEqual(utils.precision(0.1), 1);
		assert.deepEqual(utils.precision(0.00001), 5);
		assert.deepEqual(utils.precision(0.0000000009281), 13);
		assert.deepEqual(utils.precision(2e-15), 15);
	});
});

describe('safeSubtraction', function () {
	it('Correctly math', function () {
		assert.equal(utils.safeSubtraction(1, 2), -1);
		assert.equal(utils.safeSubtraction(2, 1), 1);
		assert.equal(utils.safeSubtraction(0.2, 0.1), 0.1);
		assert.equal(utils.safeSubtraction(0.1, 0.2), -0.1);
		assert.equal(
			utils.safeSubtraction(0.0000000000001, 0.000000000005),
			-0.0000000000049
		);
	});
});

describe('safeSumming', function () {
	it('Correctly math', function () {
		assert.equal(utils.safeSumming(1, 2), 3);
		assert.equal(utils.safeSumming(-2, 1), -1);
		assert.equal(utils.safeSumming(0.2, 0.1), 0.3);
		assert.equal(utils.safeSumming(0.1, 0.2), 0.3);

		assert.equal(utils.safeSumming(-0.1, 0.2), 0.1);
		assert.equal(
			utils.safeSumming(0.0000000000001, 0.000000000005),
			0.0000000000051
		);
	});
});

describe('ensureExtentInWorldBBox', function () {
	it('Fix extent coords', function () {
		assert.deepEqual(
			utils.ensureExtentInWorldBBox([
				[190, -150],
				[-190, 150],
			]),
			[
				[180, -90],
				[-180, 90],
			]
		);
	});
	it('Keep extent coords untouched', function () {
		assert.deepEqual(
			utils.ensureExtentInWorldBBox([
				[-90, -15],
				[19, 15],
			]),
			[
				[-90, -15],
				[19, 15],
			]
		);
	});
});
