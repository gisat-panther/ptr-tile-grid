/**
 * Create new Map instance
 * @returns {Map} mapCache Cache Map object
 */
const createCache = () => {
	return new Map();
};

/**
 * Get first entry from cache.
 * @param {Map} mapCache Cache Map object
 * @returns First entry from cache.
 */
const getFirstEntry = mapCache => {
	if (mapCache.size > 0) {
		const firstCacheEntryKey = mapCache.entries().next().value;
		return firstCacheEntryKey;
	} else {
		return null;
	}
};

/**
 * Remove first entry from chache object.
 * @param {Map} mapCache Cache Map object
 * @returns {Map} mapCache Cache Map object
 */
const removeFirstCacheEntry = mapCache => {
	const firstCacheEntry = getFirstEntry(mapCache);
	if (firstCacheEntry) {
		mapCache.delete(firstCacheEntry[0]);
	}
	return mapCache;
};

/**
 * Remove oldest entries that overfloat maxSize.
 * @param {Map} mapCache Cache Map object
 * @param {Number} maxSize Maximum size of entries in cache
 * @returns {Map} mapCache Cache Map object
 */
const clearEntries = (mapCache, maxSize) => {
	const size = mapCache.size;
	if (size > maxSize) {
		for (let i = 0; i < size - maxSize; i++) {
			removeFirstCacheEntry(mapCache);
		}
	}
	return mapCache;
};

/**
 *
 * @param {Map} mapCache Cache Map object
 * @param {string|Number} entryKey
 * @returns {Map} mapCache Cache Map object
 */
const placeEntryOnLastIndex = (mapCache, entryKey) => {
	if (mapCache.has(entryKey)) {
		const tmpEntry = mapCache.get(entryKey);
		mapCache.delete(entryKey);
		mapCache.set(entryKey, tmpEntry);
	}
	return mapCache;
};

export {
	createCache,
	clearEntries,
	getFirstEntry,
	placeEntryOnLastIndex,
	removeFirstCacheEntry,
};
