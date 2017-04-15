// MOCKING
import * as mocks from './mock';
console.debug('First mock test: ', mocks);
const sock = mocks.sock;

// END MOCKS
// import * as sock from './socket';
import { MessageType } from './messages';
import { bootstrap } from './doc';


// API
import { buildField } from './fields';
class RootApi {
	constructor(elt) {
		this.fields = {};
	}

	declareField(id, msg) {
		
	}
}


/**
 * Consume and route a message from the board
 * @param {Message} msg
 * @void
 */
const newRouter = api => msg => {
	console.info('Message received: ', msg);
	switch (msg.type) {
		case MessageType.DeclareField:
			return api.declareField(msg.id, msg.field);
		default:
			console.error('Unhandled message.', msg);
	}
};


// Code to run once the document is bootstrapped
bootstrap((doc) => {
	console.info('LOADED', doc.body);
	
	// Init DOM
	doc.querySelector('.loading-display').remove();
	const rootElt = doc.createElement('div')
	doc.body.appendChild(rootElt);

	// Make app
	const api = new RootApi(rootElt);
	const router = newRouter(api);

	// Create the WS connection -- for now, assume same as host
	const ws = sock.connect(location.hostname);
	ws.onmessage = (evt) => {
		console.info('WS event: ', evt);
		try {
			const data = JSON.parse(evt.data);
			router(data);
		} catch (err) {
			console.error('Parse error: ', err);
		}
	};

	///////// @todo: remove mock kickoff
	mocks.firstTest();
});
