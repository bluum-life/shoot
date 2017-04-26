import * as msg from './messages';
import * as ser from './serialize';
const unimpl = (l) => { throw new Error('Unimplemented method.') };

export class MockSockServer {
	
	constructor() {
		this.socks = [];
	}
	
	addSock(sock) {
		this.socks.push(sock);
	}
	
	disconnect(sock) {
		const idx = this.socks.indexOf(sock);
		if (idx !== -1) {
			// @todo
			// this.broadcast(
			// 	[this.socks.splice(idx, 1)],
			// 	{} // disconnect message
			// );
		}
	}
	
	broadcast(msg) {
		this.socks.forEach(sock => {
			if (sock.onmessage) {
				sock.onmessage({
					type: 'MockEvent',
					data: ser.serializeMessage(msg)
				});
			}
		});
	}
};

export const rootServer = new MockSockServer();



// Export first test on the root server
export const firstCmds = [
	msg.declareField(0, msg.boolField('Power', true)),
	msg.declareField(1, msg.rangeField('Brightness', 1, 255, 150)),
	msg.declareField(2, msg.selectField('Pattern', ['A', 'B', 'C'], 1)),
	msg.declareField(3, msg.rangeField('Speed', 1, 255, 30)),
	msg.declareField(4, msg.colorField('Color', 114, 0, 255)),
];
export const firstTest = (delay = 0) => {
	const recurse = (idx) => {
		if (idx < firstCmds.length) {
			rootServer.broadcast(firstCmds[idx]);
			setTimeout(() => recurse(idx + 1), delay);
		}
	}
	
	recurse(0);
};


export class MockSock {
	constructor(addr, protocols) {
		console.info('MockSock::Connection', addr, protocols);
		this.url = addr;
		rootServer.addSock(this);

		// Ugh
		this.binaryType = '';
		this.bufferedAmount = 0;
		this.extensions = '';
		this.protocol = '';
		this.readyState = 1; // @todo: 0 = connecting, 1 = optn, 2 = closing, 3 = closed
		this.onclose = unimpl;
		this.onmessage = unimpl;
		this.onerror = unimpl;
		this.onopen = unimpl;
	}
	
	// close(code, reason) {
	// 	this.onclose(code, reason);
	// 	rootServer
	// }
	
	send(msg) {
		console.info('MockSockSend:', msg);
	}
};

export const sock = {
/**
 * Create a websocket connection.
 * @param {String} address - basename to connect
 * @returns {WebSocket}
 */
	connect(address) {
		const ws = new MockSock(`ws://${address}:81/`, ['arduino']);
		return ws;
	}
};

