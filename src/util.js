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
