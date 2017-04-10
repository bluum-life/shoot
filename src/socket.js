/**
 * Create a websocket connection.
 * @param {String} address - basename to connect
 * @returns {WebSocket}
 */
export const connect = (address) => {
	const ws = new WebSocket(`ws://${address}:81/`, ['arduino']);
	return ws;
};
