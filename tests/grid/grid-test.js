import {assert} from 'chai';

import {grid} from '../../src/';
import {
	tilegrid_1,
	tilegrid_2,
	tilegrid_3,
	tilegrid_4,
	tilegrid_5,
} from './mockTilegridData';

describe('grid/grid', function () {
	describe('getOrigin', function () {
		it('Origin of extent is [-180, -90]', function () {
			const origin = grid.getOrigin();

			assert.deepEqual(origin, [-180, -90]);
		});
	});

	describe('getGridForLevelAndExtent', function () {
		it('Returns grid for given level by default extent', function () {
			const grid0 = grid.getGridForLevelAndExtent(0);
			const grid0SecondInstance = grid.getGridForLevelAndExtent(0);
			const grid1 = grid.getGridForLevelAndExtent(1);
			const grid2 = grid.getGridForLevelAndExtent(2);

			assert.deepEqual(grid0, [
				[
					[-180, -90],
					[0, -90],
				],
			]);

			// //chceck if caching works
			assert.equal(grid0SecondInstance === grid0, true);

			assert.deepEqual(grid1, [
				[
					[-180, 0],
					[-90, 0],
					[0, 0],
					[90, 0],
				],
				[
					[-180, -90],
					[-90, -90],
					[0, -90],
					[90, -90],
				],
			]);
			assert.deepEqual(grid2, [
				[
					[-180, 45],
					[-135, 45],
					[-90, 45],
					[-45, 45],
					[0, 45],
					[45, 45],
					[90, 45],
					[135, 45],
				],
				[
					[-180, 0],
					[-135, 0],
					[-90, 0],
					[-45, 0],
					[0, 0],
					[45, 0],
					[90, 0],
					[135, 0],
				],
				[
					[-180, -45],
					[-135, -45],
					[-90, -45],
					[-45, -45],
					[0, -45],
					[45, -45],
					[90, -45],
					[135, -45],
				],
				[
					[-180, -90],
					[-135, -90],
					[-90, -90],
					[-45, -90],
					[0, -90],
					[45, -90],
					[90, -90],
					[135, -90],
				],
			]);
		});

		it('Returns grid for given level and extent', function () {
			const grid0 = grid.getGridForLevelAndExtent(0, [
				[-180, -90],
				[-1, 90],
			]);
			const grid1 = grid.getGridForLevelAndExtent(0, [
				[-180, -90],
				[0, 90],
			]);
			const grid2 = grid.getGridForLevelAndExtent(2, [
				[-10, -10],
				[10, 10],
			]);

			assert.deepEqual(grid0, [[[-180, -90]]]);

			assert.deepEqual(grid1, [[[-180, -90]]]);

			assert.deepEqual(grid2, [
				[
					[-45, 0],
					[0, 0],
				],
				[
					[-45, -45],
					[0, -45],
				],
			]);
		});

		it('Returns grid for given level and extent for France anf level 14', function () {
			this.timeout(10000);
			const grid14France = grid.getGridForLevelAndExtent(14, [
				[-5.14375114, 41.33375168],
				[9.56041622, 51.08939743],
			]);
			assert.equal(grid14France.length, 889); //number of rows
			assert.equal(grid14France[0].length, 1340); //number of columns
		});
	});

	describe('forEachTileInGridByLevelAndExtent', function () {
		it('Run callback on each tile on grid for given level and extent for France and level 14', function () {
			this.timeout(10000);
			let count = 0;
			grid.forEachTileInGridByLevelAndExtent(
				14,
				[
					[-1, 41],
					[1, 42],
				],
				(tile, tileSize) => {
					count++;
				}
			);
			assert.equal(count, 16928); //number of tiles
		});

		it('Run callback on each tile on grid for given level and extent for France and level 16', function () {
			this.timeout(10000);
			let count = 0;
			grid.forEachTileInGridByLevelAndExtent(
				16,
				[
					[-1, 41],
					[1, 42],
				],
				(tile, tileSize) => {
					count++;
				}
			);
			assert.equal(count, 266085); //number of tiles
		});

		it('Run callback on each tile on grid for given level and extent for France and level 17', function () {
			this.timeout(10000);
			let count = 0;
			grid.forEachTileInGridByLevelAndExtent(
				17,
				[
					[-1, 41],
					[1, 42],
				],
				(tile, tileSize) => {
					count++;
				}
			);
			assert.equal(count, 1062882); //number of tiles
		});
	});

	describe('getTilesCountForGridByLevelAndExtent', function () {
		it('Get tiles count for grids.', function () {
			const count = grid.getTilesCountForGridByLevelAndExtent(14, [
				[-1, 41],
				[1, 42],
			]);
			assert.equal(count, 16928); //number of tiles

			const count2 = grid.getTilesCountForGridByLevelAndExtent(2, [
				[-10, -10],
				[10, 10],
			]);
			assert.equal(count2, 4); //number of tiles
		});

		it('Get tiles count for certain grids in maximum level', function () {
			const count = grid.getTilesCountForGridByLevelAndExtent(24, [
				[-1, 41],
				[1, 42],
			]);
			assert.equal(count, 17375276112); //number of tiles

			const count2 = grid.getTilesCountForGridByLevelAndExtent(24, [
				[-10, -10],
				[10, 10],
			]);
			assert.equal(count2, 3475003026496); //number of tiles
		});

		it('Get tiles count for whole grids', function () {
			const levels = [...new Array(25)].map((_, i) => i);
			const tilesCount = levels.reduce((acc, level) => {
				return level === 0 ? [2] : [...acc, acc[acc.length - 1] * 4];
			}, []);
			levels.forEach(level => {
				const count = grid.getTilesCountForGridByLevelAndExtent(level);
				assert.equal(count, tilesCount[level]); //number of tiles
			});
		});
	});

	describe('getLevelByViewport', function () {
		it('Returns related level by given boxRange and vieportRange', function () {
			const boxRange = 240;
			const viewport = 240;

			const level0 = grid.getLevelByViewport(boxRange, viewport);
			assert.equal(level0, 17);

			const level1 = grid.getLevelByViewport(50000000, 250);
			assert.equal(level1, 0);

			const level2 = grid.getLevelByViewport(0.000001, 4000);
			assert.equal(level2, 24);

			const level3 = grid.getLevelByViewport(0.00000000000000001, 4000);
			assert.equal(level3, 24);

			const level4 = grid.getLevelByViewport(5000000000000000000000, 4000);
			assert.equal(level4, 0);
		});
	});

	describe('getLevelByResolution', function () {
		it('Returns related level by given resolution', function () {
			const resolution0 = 100000; //higher than base resolution
			const resolution1 = 50000;
			const resolution25 = 0.0000001; //lower than last 25th resolution

			const level0 = grid.getLevelByResolution(resolution0);
			assert.equal(level0, 0);
			const level1 = grid.getLevelByResolution(resolution1);
			assert.equal(level1, 1);
			const level24 = grid.getLevelByResolution(resolution25);
			assert.equal(level24, 24);
		});
	});

	describe('getTileGrid', function () {
		it('Check if returned polygon is correct for given tile', function () {
			const mapWidth = 810.5499877929688;
			const mapHeight = 764;
			const levelBoxRange = 600598.0379691155;
			const center = {lat: 46.924007100770275, lon: 3.2627686660155857};
			const tileGrid = grid.getTileGrid(
				mapWidth,
				mapHeight,
				levelBoxRange,
				center,
				true
			);
			assert.deepEqual(tileGrid, tilegrid_2);
		});

		it('Check if returned tilegrid has correct tiles', function () {
			const mapWidth = 810.5499877929688;
			const mapHeight = 764;
			const levelBoxRange = 600598.0379691155;
			const center = {lat: 49.91232450346397, lon: 1.6894303172424334};
			const tileGrid = grid.getTileGrid(
				mapWidth,
				mapHeight,
				levelBoxRange,
				center,
				true
			);
			assert.deepEqual(tileGrid, tilegrid_1);
		});

		it('Check if returned tilegrid has correct tiles _1', function () {
			const mapWidth = 810.5499877929688;
			const mapHeight = 764;
			const levelBoxRange = 600598.0379691155;
			const center = {lat: 48.40367941865281, lon: 3.68149954038823};
			const tileGrid = grid.getTileGrid(
				mapWidth,
				mapHeight,
				levelBoxRange,
				center,
				true
			);
			assert.deepEqual(tileGrid, tilegrid_3);
		});

		it('Check if returned tilegrid has correct tiles _2, it check BigInt in closestDivisibleHigher.', function () {
			const mapWidth = 896;
			const mapHeight = 763;
			const levelBoxRange = 2399250.654295472;
			const center = {lat: 47.23907760550141, lon: -4.548861866565056};
			const tileGrid = grid.getTileGrid(
				mapWidth,
				mapHeight,
				levelBoxRange,
				center,
				true
			);
			assert.deepEqual(tileGrid, tilegrid_4);
		});

		it('Check if returned tilegrid for lavel 23 has correct tiles and each coordinate has maximum 13 decimals.', function () {
			const mapWidth = 896;
			const mapHeight = 763;
			const levelBoxRange = 10;
			const center = {lat: 47.23907760550141, lon: -4.548861866565056};
			const tileGrid = grid.getTileGrid(
				mapWidth,
				mapHeight,
				levelBoxRange,
				center,
				true
			);
			assert.deepEqual(tileGrid, tilegrid_5);
		});
	});
});
