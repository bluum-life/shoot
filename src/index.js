import * as sock from './socket';
import * as msg from './messages';
import { bootstrap } from './doc';

// import * as mocks from './mock';
// console.debug('First mock test: ', mocks.firstTest);

/**
 * Consume and route a message from the board
 * @param {Message} msg
 * @void
 */
const routeMessage = (msg) => {
	console.debug('Message received: ', msg);
};


// Code to run once the document is bootstrapped
bootstrap((doc) => {
	console.debug('LOADED', doc.body);
	
	doc.querySelector('.loading-display').remove();

	doc.body.appendChild(
		doc.createElement('div')
	);

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

});
