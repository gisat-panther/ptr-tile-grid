import {assert} from 'chai';
import {utils, constants} from '../../src/';

describe('utils/utils', function () {
	describe('intersectTile', function () {
		it('Snap given point to closest grid point on top right side.', function () {
			//point inside tile
			assert.deepEqual(utils.intersectTile([89, 89], 90, true, true), [0, 0]);
			assert.deepEqual(
				utils.intersectTile([-91, -89], 45, true, true),
				[-135, -90]
			);
			assert.deepEqual(
				utils.intersectTile([0, -5], 180, true, true),
				[-180, -90]
			);

			//point on node
			assert.deepEqual(utils.intersectTile([90, 90], 90, true, true), [0, 0]);
			assert.deepEqual(
				utils.intersectTile([-90, -90], 45, true, true),
				[-135, -90]
			);

			//point on gridSet node
			//gridSide 90
			assert.deepEqual(utils.intersectTile([0, 0], 90, true, true), [-90, -90]);
			assert.deepEqual(
				utils.intersectTile([-180, 90], 90, true, true),
				[-180, 0]
			);
			assert.deepEqual(utils.intersectTile([180, 90], 90, true, true), [90, 0]);
			assert.deepEqual(
				utils.intersectTile([180, -90], 90, true, true),
				[90, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-180, -90], 90, true, true),
				[-180, -90]
			);
			//gridSide 180
			assert.deepEqual(
				utils.intersectTile([-180, 90], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, 90], 180, true, true),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 180, true, true),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-180, -90], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-180, -33], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-33, -33], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([33, 33], 180, true, true),
				[0, -90]
			);

			//point on border grid size 180
			//latitude 0
			assert.deepEqual(
				utils.intersectTile([-180, 0], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([0, 0], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, 0], 180, true, true),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, 90], 180, true, true),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 180, true, true),
				[0, -90]
			);

			//latitude -90
			assert.deepEqual(
				utils.intersectTile([-180, -90], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([0, -90], 180, true, true),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 180, true, true),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile(
					[-0.7709771100106658, 45.5409891121946],
					1.40625,
					true,
					true
				),
				[-1.40625, 45]
			);
			assert.deepEqual(
				utils.intersectTile(
					[0.7709771100106658, 45.5409891121946],
					1.40625,
					true,
					true
				),
				[0, 45]
			);
			assert.deepEqual(
				utils.intersectTile([1.40625, 45.5409891121946], 1.40625, true, true),
				[0, 45]
			);
			assert.deepEqual(
				utils.intersectTile([-1.40625, 45.5409891121946], 1.40625, true, true),
				[-2.8125, 45]
			);
			assert.deepEqual(
				utils.intersectTile([-1.5, 45.5409891121946], 1.40625, true, true),
				[-2.8125, 45]
			);
			assert.deepEqual(
				utils.intersectTile([1.5, 45.5409891121946], 1.40625, true, true),
				[1.40625, 45]
			);
		});

		it('Snap given point to closest grid point on left bottom side.', function () {
			//point inside tile
			assert.deepEqual(utils.intersectTile([89, 89], 90, true, false), [0, 0]);
			assert.deepEqual(
				utils.intersectTile([-91, -89], 45, true, false),
				[-135, -90]
			);
			assert.deepEqual(
				utils.intersectTile([0, -5], 180, true, false),
				[0, -90]
			);

			//point on node
			assert.deepEqual(
				utils.intersectTile([90, 90], 90, true, false),
				[90, 90]
			);
			assert.deepEqual(
				utils.intersectTile([-90, -90], 45, true, false),
				[-90, -90]
			);

			//point on gridSet node
			//gridSide 90
			assert.deepEqual(utils.intersectTile([0, 0], 90, true, false), [0, 0]);
			assert.deepEqual(
				utils.intersectTile([-180, 90], 90, true, false),
				[-180, 90]
			);
			assert.deepEqual(
				utils.intersectTile([180, 90], 90, true, false),
				[90, 90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 90, true, false),
				[90, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-180, -90], 90, true, false),
				[-180, -90]
			);
			//gridSide 180
			assert.deepEqual(
				utils.intersectTile([-180, 90], 180, true, false),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, 90], 180, true, false),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 180, true, false),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-180, -90], 180, true, false),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-180, -33], 180, true, false),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([-33, -33], 180, true, false),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([33, 33], 180, true, false),
				[0, -90]
			);

			//point on border grid size 180
			//latitude 0
			assert.deepEqual(
				utils.intersectTile([-180, 0], 180, true, false),
				[-180, -90]
			);
			assert.deepEqual(utils.intersectTile([0, 0], 180, true, false), [0, -90]);
			assert.deepEqual(
				utils.intersectTile([180, 0], 180, true, false),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, 90], 180, true, false),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 180, true, false),
				[0, -90]
			);

			//latitude -90
			assert.deepEqual(
				utils.intersectTile([-180, -90], 180, true, false),
				[-180, -90]
			);
			assert.deepEqual(
				utils.intersectTile([0, -90], 180, true, false),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile([180, -90], 180, true, false),
				[0, -90]
			);
			assert.deepEqual(
				utils.intersectTile(
					[-0.7709771100106658, 45.5409891121946],
					1.40625,
					true,
					false
				),
				[-1.40625, 45]
			);
			assert.deepEqual(
				utils.intersectTile(
					[0.7709771100106658, 45.5409891121946],
					1.40625,
					true,
					false
				),
				[0, 45]
			);
			45.5409891121946 / 1.40625;
			assert.deepEqual(
				utils.intersectTile([1.40625, 45.5409891121946], 1.40625, true, false),
				[1.40625, 45]
			);
			assert.deepEqual(
				utils.intersectTile([-1.40625, 45.5409891121946], 1.40625, true, false),
				[-1.40625, 45]
			);
			assert.deepEqual(
				utils.intersectTile([-1.5, 45.5409891121946], 1.40625, true, false),
				[-2.8125, 45]
			);
			assert.deepEqual(
				utils.intersectTile([1.5, 45.5409891121946], 1.40625, true, false),
				[1.40625, 45]
			);
		});

		it('Throw error, coordinates does not lies in extent', function () {
			assert.throws(
				() => utils.intersectTile([185, -90], 180, false),
				Error,
				'Point 185,-90 does not lies in base extent.'
			);
		});
	});
});
