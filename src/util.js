/**
 * Concats two array buffers
 * 
 * @param {ArrayBuffer} a 
 * @param {ArrayBuffer} b 
 * @returns {ArrayBuffer}
 */
export const concatBuffer = (a, b) => {
	const out = new Uint8Array(a.byteLength + b.byteLength);
	out.set(new Uint8Array(a), 0);
	out.set(new Uint8Array(b), a.byteLength);
	return out.buffer;
};

/**
 * @typedef {Object} Listener
 * @property {fn[]} registry - list of registered functions
 * @property {function(fn)} map - register a function to fire on event
 * @property {function(Object)} emit - emit an event to listeners
 */

/**
 * Helper to generate a listener to apply to any object.
 * @returns {Listener}
 */
export const listener = () => {
	const registry = [];

	const map = (fn) => {
		registry.push(fn);
		return () => {
			const i = registry.indexOf(fn);
			if (i !== -1) {
				registry.splice(i, 1);
			}
		}
	}

	const emit = (msg) => {
		registry.forEach(fn => fn(msg));
	};

	return { registry, map, emit };
}
