import * as msg from './messages';

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
					data: JSON.stringify(msg)
				});
			}
		});
	}
};

export const rootServer = new MockSockServer();



// Export first test on the root server
// const fields = {
// 	baseColor: ,
// 	effects: msg.selectionField(['A', 'B', 'C'], 2),
// };

export const firstTest = (delay = 0) => {
	let i = 0;
	const cmds = [
		msg.declareField(i++, msg.boolField('Power', true)),
		msg.declareField(i++, msg.rangeField('Brightness', 1, 255, 150)),
		msg.declareField(i++, msg.selectField('Pattern', ['A', 'B', 'C'], 1)),
		msg.declareField(i++, msg.rangeField('Speed', 1, 255, 30)),
		msg.declareField(i++, msg.colorField('Color', 114, 0, 255)),
	];
	
	const recurse = (idx) => {
		if (idx < cmds.length) {
			rootServer.broadcast(cmds[idx]);
			setTimeout(() => recurse(idx + 1), delay);
		}
	}
	
	recurse(0);
};



export class MockSock {
	constructor(addr, protocols) {
		console.info('MockSock::Connection', addr, protocols);
		rootServer.addSock(this);
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

