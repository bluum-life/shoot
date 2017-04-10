import * as sock from './socket';
import * as msg from './messages';
import * as mocks from './mock';

/**
 * Consume and route a message from the board
 * @param {Message} msg
 * @void
 */
const routeMessage = (msg) => {
	console.debug('Message received: ', msg);
};

console.debug('First mock test: ', mocks.firstTest);

const onLoad = () => {
	// Create the WS connection -- for now, assume same as host
	const ws = sock.connect(location.hostname);
	ws.onmessage = (evt) => {
		console.debug('WS event: ', evt);
		try {
			const data = JSON.parse(evt.data);
			routeMessage(data);
		} catch (err) {
			console.error('Parse error: ', err);
		}
	};
	
	console.debug(ws.onmessage);
};
