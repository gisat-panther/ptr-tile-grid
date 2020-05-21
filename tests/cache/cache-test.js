import {assert} from 'chai';

import {
	createCache,
    clearEntries,
    getFirstEntry,
    placeEntryOnLastIndex,
    removeFirstCacheEntry,
} from '../../src/cache';

describe('cache/cache', function () {
	describe('createCache', function () {
		it('create new cache instance', function () {
            const cache = createCache();
            assert.instanceOf(cache, Map);
		});
    });

	describe('clearEntries', function () {
		it('clear entries with index higher than 100', function () {
            const cache = createCache();
            
            for (let i = 0; i < 200; i++) {
                cache.set(i, 'value');
            }
            assert.equal(cache.size, 200);
            const clearCache = clearEntries(cache, 100);
            assert.equal(clearCache.size, 100);
		});
    });

	describe('removeFirstCacheEntry', function () {
		it('Remove first entry from cache', function () {
            const cache = createCache();
            
            cache.set(1,1);
            cache.set(2,2);
            cache.set(3,3);

            assert.equal(cache.size, 3);
            assert.deepEqual(getFirstEntry(cache), [1,1]);
            removeFirstCacheEntry(cache);
            assert.equal(cache.size, 2);
            assert.deepEqual(getFirstEntry(cache), [2,2]);
        });

		it('Remove first entry from empty cache', function () {
            const cache = createCache();
            
            assert.equal(cache.size, 0);
            removeFirstCacheEntry(cache);
            assert.equal(cache.size, 0);
		});
    });

	describe('getFirstEntry', function () {
		it('Get first entry from cache', function () {
            const cache = createCache();
            
            cache.set(1,1);
            cache.set(2,2);
            cache.set(3,3);

            assert.equal(cache.size, 3);
            assert.deepEqual(getFirstEntry(cache), [1,1]);
        });

		it('Get null from empty cache', function () {
            const cache = createCache();
            assert.equal(cache.size, 0);
            assert.equal(getFirstEntry(cache), null);
		});
	});

	describe('placeEntryOnLastIndex', function () {
		it('Get first entry from cache', function () {
            const cache = createCache();
            
            cache.set(1,1);
            cache.set(2,2);
            cache.set(3,3);

            assert.equal(cache.size, 3);
            assert.deepEqual(getFirstEntry(cache), [1,1]);

            const entries1 = [...cache.entries()];
            const lastEntry1 = entries1[entries1.length - 1];
            assert.deepEqual(lastEntry1, [3,3]);

            placeEntryOnLastIndex(cache, 1);
            const entries = [...cache.entries()];
            const lastEntry = entries[entries.length - 1];
            assert.deepEqual(lastEntry, [1,1]);
        });

		it('Get null from empty cache', function () {
            const cache = createCache();
            assert.equal(cache.size, 0);
            assert.equal(getFirstEntry(cache), null);
		});
	});

	describe('entries from cache are same instances', function () {
		it('', function () {
            const cache = createCache();
            
            const objectA = {
                test: 'test'
            }

            cache.set(1,objectA);
            cache.set(2,22);

            assert.equal(cache.get(1) === objectA, true);
            assert.equal(cache.get(1) === cache.get(1), true);
            placeEntryOnLastIndex(cache, 1);
            assert.equal(cache.get(1) === objectA, true);
            assert.equal(cache.get(1) === cache.get(1), true);
        });

		it('Get null from empty cache', function () {
            const cache = createCache();
            assert.equal(cache.size, 0);
            assert.equal(getFirstEntry(cache), null);
		});
	});
});